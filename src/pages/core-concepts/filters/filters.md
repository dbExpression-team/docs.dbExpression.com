dbExpression supports combining individual expression elements and literal values to create new composite expressions.  The composition of these into new composite expressions can be used as filters (filter expressions) to limit the data affected/returned from the target database.  This section covers:
* [Comparison Expressions](#comparison-expressions)
* [Logical Expressions](#logical-expressions)
* [Filter Expressions](#filter-expressions)

## Comparison Expressions
Comparison expressions are created by using one of the following operators between two expression elements and/or literal values:

| Operator | Description                |
|:--------:|----------------------------|
|   ==     | Is equal to                |
|   !=     | Is not equal to            |
|   >      | Is greater than            |
|   <      | Is less than               |
|   >=     | Is greater than or equal to|
|   <\=    | Is less than or equal to   |

Comparison operations within a QueryExpression must follow the same type check constraints the .NET CLR enforces for any other comparison expression.  For example, if a QueryExpression field represents an integer column in your database, comparing that field to a string literal would raise a compile time error.
```csharp
dbo.Person.Id == "4000"
```
This would cause a compilation error:  `CS0019 Operator '==' cannot be applied to operands of type 'PersonEntity.IdField' and 'string'`

A basic comparison expression is a comparison operator between a database field and a literal value.  
```csharp
 dbo.Person.Id == 3 
 ```
The left argument in the expression above is a field expression, the right argument is a numeric literal.  Operands of each comparison can be field expressions, the result of any other expression composition, or any CLR literal.  The examples below represent comparisons using different types of operands:

```csharp
//string field to string literal
dbo.Person.LastName == "Broflovski"

//int field expression to int literal
dbo.Person.Id == 3

//DateTime field expression to DateTime field expression
dbo.Person.DateCreated == dbo.Person.DateUpdated

//function expression result to int literal
db.fx.IsNull(dbo.Person.CreditLimit, 0) < 1000

//aggregate function expression result to double literal
db.fx.Sum(dbo.Purchase.TotalPurchaseAmount) >= 2500
```

## Logical Expressions
Logical expressions equate to a true/false result.  Logical expressions are created by using one of the following operators between two (or more) comparison expressions and/or literal values:

| Operator | Description                |
|:--------:|----------------------------|
|   &      | AND                        |
|   \|     | OR                         |
|   Like   | Like(...)                  |
|   !      | Negation                   |

You can combine any number of comparison and/or arithmetic expressions using logical operators to create composite expressions.
```csharp
//logical AND
dbo.Person.DateCreated >= DateTime.Now.AddYears(-1) & dbo.Person.CreditLimit > 100000

//logical OR
dbo.Address.Zip == "75000" | dbo.Address.Zip == "76000"

//Logical negation ... NOT either of these zip codes
!(dbo.Address.Zip == "75000" | dbo.Address.Zip == "76000")

//Logical Like() ... LastName starts with 'E' AND CreditLimit <= 15,000
dbo.Person.LastName.Like("E%") & dbo.Person.CreditLimit <= 15000
```

Precedence is controlled with parenthesis in the expression.  The following expression retrieves results for males within zip codes 80456 or 94043 and females within zip codes 10002 or 02801.
```csharp
//( (Male AND (reside in Zip 80456 OR Zip 94043))  OR (Female AND (reside in Zip 10002 OR Zip 02801)) )
(
    dbo.Person.GenderType == GenderType.Male 
    & 
    (dbo.Address.Zip == "80456" | dbo.Address.Zip == "94043")
)
|
(
    dbo.Person.GenderType == GenderType.Female 
    & 
    (dbo.Address.Zip == "10002" | dbo.Address.Zip == "02801")
)
```

## Filter Expressions
Filter expressions are the composition of one or more logical expressions to limit the data affected/returned during execution of a QueryExpression.  Filter expressions can be used with: Where clauses, On conditions of a Join clause, and Having clauses.  The following examples demonstrate QueryExpressions for each of the different clause types.

### Filter expressions in Where clauses
The following filter specifies a field expression to be equal to the literal value of 1:
{% code-example %}
```csharp
DateTimeOffset registration = db.SelectOne(dbo.Person.RegistrationDate)
    .From(dbo.Person)
    //int field expression comparison to int literal value
    .Where(dbo.Person.Id == 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT TOP(1)
	[t0].[RegistrationDate]
FROM
	[dbo].[Person] AS [t0]
WHERE
	[t0].[Id] = @P1;',N'@P1 int',@P1=1
```
{% /code-example %}

This filter specifies a field expression greater than a literal value:
{% code-example %}
```csharp
var yesterday = DateTime.Now.Date.AddDays(-1);
IEnumerable<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
    //DateTime field expression comparison to DateTime literal value
    .Where(dbo.Person.LastLoginDate > yesterday)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[Id],
	[t0].[FirstName],
	[t0].[LastName],
	[t0].[BirthDate],
	[t0].[GenderType],
	[t0].[CreditLimit],
	[t0].[YearOfLastCreditLimitReview],
	[t0].[RegistrationDate],
	[t0].[LastLoginDate],
	[t0].[DateCreated],
	[t0].[DateUpdated]
FROM
	[dbo].[Person] AS [t0]
WHERE
	[t0].[LastLoginDate] > @P1;',N'@P1 datetimeoffset(7)',@P1='2021-04-14 00:00:00 -05:00'
```
{% /code-example %}

This filter specifies a field expression equal to a literal value:
{% code-example %}
```csharp
IEnumerable<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
    //string field expression comparison to string literal value
    .Where(dbo.Person.LastName == "Cartman")
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[Id],
	[t0].[FirstName],
	[t0].[LastName],
	[t0].[BirthDate],
	[t0].[GenderType],
	[t0].[CreditLimit],
	[t0].[YearOfLastCreditLimitReview],
	[t0].[RegistrationDate],
	[t0].[LastLoginDate],
	[t0].[DateCreated],
	[t0].[DateUpdated]
FROM
	[dbo].[Person] AS [t0]
WHERE
	[t0].[LastName] = @P1;',N'@P1 varchar(20)',@P1='Cartman'
```
{% /code-example %}

This filter specifies a field expression equal to a field expression (all people with the same first name as their last name):
{% code-example %}
```csharp
IEnumerable<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
    //string field expression comparison to string field expression
    .Where(dbo.Person.FirstName == dbo.Person.LastName)
    .Execute();
```
```sql
SELECT
	[t0].[Id],
	[t0].[FirstName],
	[t0].[LastName],
	[t0].[BirthDate],
	[t0].[GenderType],
	[t0].[CreditLimit],
	[t0].[YearOfLastCreditLimitReview],
	[t0].[RegistrationDate],
	[t0].[LastLoginDate],
	[t0].[DateCreated],
	[t0].[DateUpdated]
FROM
	[dbo].[Person] AS [t0]
WHERE
	[t0].[FirstName] = [t0].[LastName];
```
{% /code-example %}

This filter specifies a field expression greater than a literal value and additionally a field expression greater than or equal to a literal value:
{% code-example %}
```csharp
IEnumerable<Person> people = db.SelectMany<Person>()
   .From(dbo.Person)
   //logical And
   .Where(
       dbo.Person.YearOfLastCreditLimitReview > DateTime.Now.AddYears(-1).Year
       &
       dbo.Person.CreditLimit >= 25000
   )
   .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[Id],
	[t0].[FirstName],
	[t0].[LastName],
	[t0].[BirthDate],
	[t0].[GenderType],
	[t0].[CreditLimit],
	[t0].[YearOfLastCreditLimitReview],
	[t0].[RegistrationDate],
	[t0].[LastLoginDate],
	[t0].[DateCreated],
	[t0].[DateUpdated]
FROM
	[dbo].[Person] AS [t0]
WHERE
	[t0].[YearOfLastCreditLimitReview] > @P1
	AND
	[t0].[CreditLimit] >= @P2;',N'@P1 int,@P2 int',@P1=2020,@P2=25000
```
{% /code-example %}

This filter specifies a field expression that is one of a set of literal values:

{% code-example %}
```csharp
IEnumerable<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
    //logical Or
    .Where(
        dbo.Person.LastName == "Broflovski" 
        | 
        dbo.Person.LastName == "Cartman" 
        | 
        dbo.Person.LastName == "McCormick"
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[Id],
	[t0].[FirstName],
	[t0].[LastName],
	[t0].[BirthDate],
	[t0].[GenderType],
	[t0].[CreditLimit],
	[t0].[YearOfLastCreditLimitReview],
	[t0].[RegistrationDate],
	[t0].[LastLoginDate],
	[t0].[DateCreated],
	[t0].[DateUpdated]
FROM
	[dbo].[Person] AS [t0]
WHERE
	[t0].[LastName] = @P1
	OR
	[t0].[LastName] = @P2
	OR
	[t0].[LastName] = @P3;',N'@P1 varchar(20),@P2 varchar(20),@P3 varchar(20)',@P1='Broflovski',@P2='Cartman',@P3='McCormick'
```
{% /code-example %}

### Filter expressions in Join clauses
{% code-example %}
```csharp
IEnumerable<dynamic> person_totals = db.SelectMany(
        dbo.Person.Id,
        db.fx.Sum(dbo.Purchase.TotalPurchaseAmount).As("LifetimeValue")
    )
    .From(dbo.Person)
    //int field expression comparison to int field expression
    .InnerJoin(dbo.Purchase).On(dbo.Person.Id == dbo.Purchase.PersonId)
    .GroupBy(dbo.Person.Id)
    .Execute();
```
```sql
SELECT
	[t0].[Id],
	SUM([t1].[TotalPurchaseAmount]) AS [LifetimeValue]
FROM
	[dbo].[Person] AS [t0]
	INNER JOIN [dbo].[Purchase] AS [t1] ON [t0].[Id] = [t1].[PersonId]
GROUP BY
	[t0].[Id];
```
{% /code-example %}

{% code-example %}
```csharp
IEnumerable<dynamic> person_zips = db.SelectMany(
        dbo.Person.Id,
        dbo.Address.Zip
    )
    .From(dbo.Person)
    //int field expression comparison to int field expression
    .InnerJoin(dbo.PersonAddress).On(dbo.Person.Id == dbo.PersonAddress.PersonId)
    //int field expression comparison to int field expression AND enum field expression comparison to literal enum value
    .InnerJoin(dbo.Address).On(
        dbo.PersonAddress.AddressId == dbo.Address.Id
        &
        dbo.Address.AddressType == AddressType.Mailing
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[Id],
	[t1].[Zip]
FROM
	[dbo].[Person] AS [t0]
	INNER JOIN [dbo].[Person_Address] AS [t2] ON [t0].[Id] = [t2].[PersonId]
	INNER JOIN [dbo].[Address] AS [t1] ON [t2].[AddressId] = [t1].[Id]
	AND
	[t1].[AddressType] = @P1;',N'@P1 int',@P1=1
```
{% /code-example %}

### Filter expressions in Having clauses
{% code-example %}
```csharp
IEnumerable<dynamic> people = db.SelectMany(
        dbo.Person.LastName,
        db.fx.Count(dbo.Person.Id).As("LastNameCount")
    )
    .From(dbo.Person)
    .GroupBy(dbo.Person.LastName)
    //aggregate function comparison to int literal value
    .Having(
        db.fx.Count(dbo.Person.Id) > 1
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[LastName],
	COUNT([t0].[Id]) AS [LastNameCount]
FROM
	[dbo].[Person] AS [t0]
GROUP BY
	[t0].[LastName]
HAVING
	COUNT([t0].[Id]) > @P1;',N'@P1 int',@P1=1
```
{% /code-example %}

### Filter expressions using arithmetic
Filter expressions can also be composed using arithmetic expressions in Where clauses, Join clauses, and Having clauses (see [Advanced Queries (Arithmetic)](advanced-query-expressions#arithmetic) to learn more about using arithmetic expressions in queries).

Arithmetic expression in a Where clause:
{% code-example %}
```csharp
IEnumerable<Product> products = db.SelectMany<Product>()
    .From(dbo.Product)
    .Where(
        ((dbo.Product.Quantity * dbo.Product.ListPrice) - (dbo.Product.Quantity * dbo.Product.Price)) > 1000
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[Id],
	[t0].[ProductCategoryType],
	[t0].[Name],
	[t0].[Description],
	[t0].[ListPrice],
	[t0].[Price],
	[t0].[Quantity],
	[t0].[Image],
	[t0].[Height],
	[t0].[Width],
	[t0].[Depth],
	[t0].[Weight],
	[t0].[ShippingWeight],
	[t0].[ValidStartTimeOfDayForPurchase],
	[t0].[ValidEndTimeOfDayForPurchase],
	[t0].[DateCreated],
	[t0].[DateUpdated]
FROM
	[dbo].[Product] AS [t0]
WHERE
	(([t0].[Quantity] * [t0].[ListPrice]) - ([t0].[Quantity] * [t0].[Price])) > @P1;',N'@P1 float',@P1=1000
```
{% /code-example %}

Arithmetic expression in a Join clause:
{% code-example %}
```csharp
IEnumerable<dynamic> purchases = db.SelectMany(
        dbo.Purchase.OrderNumber,
        dbo.PurchaseLine.PurchasePrice,
        dbo.PurchaseLine.Quantity
    )
    .From(dbo.PurchaseLine)
    .InnerJoin(dbo.Purchase).On(dbo.PurchaseLine.PurchaseId == dbo.Purchase.Id & dbo.Purchase.TotalPurchaseAmount > 100)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[OrderNumber],
	[t1].[PurchasePrice],
	[t1].[Quantity]
FROM
	[dbo].[PurchaseLine] AS [t1]
	INNER JOIN [dbo].[Purchase] AS [t0] ON [t1].[PurchaseId] = [t0].[Id]
	AND
	[t0].[TotalPurchaseAmount] > @P1;',N'@P1 money',@P1=$100.0000
```
{% /code-example %}

And an arithmetic expression in a Having clause:
{% code-example %}
```csharp
IEnumerable<dynamic> purchases = db.SelectMany(
        dbo.Purchase.OrderNumber,
        db.fx.Sum(dbo.PurchaseLine.PurchasePrice)
    )
    .From(dbo.PurchaseLine)
    .InnerJoin(dbo.Purchase).On(dbo.PurchaseLine.PurchaseId == dbo.Purchase.Id)
    .GroupBy(dbo.Purchase.OrderNumber)
    .Having(db.fx.Sum(dbo.PurchaseLine.PurchasePrice) > 100)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[OrderNumber],
	SUM([t1].[PurchasePrice])
FROM
	[dbo].[PurchaseLine] AS [t1]
	INNER JOIN [dbo].[Purchase] AS [t0] ON [t1].[PurchaseId] = [t0].[Id]
GROUP BY
	[t0].[OrderNumber]
HAVING
	SUM([t1].[PurchasePrice]) > @P1;',N'@P1 decimal(3,0)',@P1=100
```
{% /code-example %}