---
title: Filter Expressions
---

Filter expressions are the composition of one or more logical expressions to limit the data affected/returned during execution of a query.  Filter expressions can be used with
*WHERE* clauses, *ON* conditions of a *JOIN* clause, and *HAVING* clauses.  The following examples demonstrate queries for each of the different clause types.

## Filter expressions in Where clauses

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
	[dbo].[Person].[RegistrationDate]
FROM
	[dbo].[Person]
WHERE
	[dbo].[Person].[Id] = @P1;',N'@P1 int',@P1=1
```
{% /code-example %}

This filter specifies a field expression greater than a literal value:
{% code-example %}
```csharp
var yesterday = DateTime.Now.Date.AddDays(-1);
IList<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
    //DateTime field expression comparison to DateTime literal value
    .Where(dbo.Person.LastLoginDate > yesterday)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Person].[Id],
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName],
	[dbo].[Person].[BirthDate],
	[dbo].[Person].[GenderType],
	[dbo].[Person].[CreditLimit],
	[dbo].[Person].[YearOfLastCreditLimitReview],
	[dbo].[Person].[RegistrationDate],
	[dbo].[Person].[LastLoginDate],
	[dbo].[Person].[DateCreated],
	[dbo].[Person].[DateUpdated]
FROM
	[dbo].[Person]
WHERE
	[dbo].[Person].[LastLoginDate] > @P1;',N'@P1 datetimeoffset(7)',@P1='2021-04-14 00:00:00 -05:00'
```
{% /code-example %}

This filter specifies a field expression equal to a literal value:
{% code-example %}
```csharp
IList<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
    //string field expression comparison to string literal value
    .Where(dbo.Person.LastName == "Cartman")
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Person].[Id],
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName],
	[dbo].[Person].[BirthDate],
	[dbo].[Person].[GenderType],
	[dbo].[Person].[CreditLimit],
	[dbo].[Person].[YearOfLastCreditLimitReview],
	[dbo].[Person].[RegistrationDate],
	[dbo].[Person].[LastLoginDate],
	[dbo].[Person].[DateCreated],
	[dbo].[Person].[DateUpdated]
FROM
	[dbo].[Person]
WHERE
	[dbo].[Person].[LastName] = @P1;',N'@P1 varchar(20)',@P1='Cartman'
```
{% /code-example %}

This filter specifies a field expression equal to a field expression (all people with the same first name as their last name):
{% code-example %}
```csharp
IList<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
    //string field expression comparison to string field expression
    .Where(dbo.Person.FirstName == dbo.Person.LastName)
    .Execute();
```
```sql
SELECT
	[dbo].[Person].[Id],
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName],
	[dbo].[Person].[BirthDate],
	[dbo].[Person].[GenderType],
	[dbo].[Person].[CreditLimit],
	[dbo].[Person].[YearOfLastCreditLimitReview],
	[dbo].[Person].[RegistrationDate],
	[dbo].[Person].[LastLoginDate],
	[dbo].[Person].[DateCreated],
	[dbo].[Person].[DateUpdated]
FROM
	[dbo].[Person]
WHERE
	[dbo].[Person].[FirstName] = [dbo].[Person].[LastName];
```
{% /code-example %}

This filter specifies a field expression greater than a literal value and additionally a field expression greater than or equal to a literal value:
{% code-example %}
```csharp
IList<Person> people = db.SelectMany<Person>()
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
	[dbo].[Person].[Id],
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName],
	[dbo].[Person].[BirthDate],
	[dbo].[Person].[GenderType],
	[dbo].[Person].[CreditLimit],
	[dbo].[Person].[YearOfLastCreditLimitReview],
	[dbo].[Person].[RegistrationDate],
	[dbo].[Person].[LastLoginDate],
	[dbo].[Person].[DateCreated],
	[dbo].[Person].[DateUpdated]
FROM
	[dbo].[Person]
WHERE
	[dbo].[Person].[YearOfLastCreditLimitReview] > @P1
	AND
	[dbo].[Person].[CreditLimit] >= @P2;',N'@P1 int,@P2 int',@P1=2020,@P2=25000
```
{% /code-example %}

This filter specifies a field expression that is one of a set of literal values:
{% code-example %}
```csharp
IList<Person> people = db.SelectMany<Person>()
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
	[dbo].[Person].[Id],
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName],
	[dbo].[Person].[BirthDate],
	[dbo].[Person].[GenderType],
	[dbo].[Person].[CreditLimit],
	[dbo].[Person].[YearOfLastCreditLimitReview],
	[dbo].[Person].[RegistrationDate],
	[dbo].[Person].[LastLoginDate],
	[dbo].[Person].[DateCreated],
	[dbo].[Person].[DateUpdated]
FROM
	[dbo].[Person]
WHERE
	(
		[dbo].[Person].[LastName] = @P1
		OR
		[dbo].[Person].[LastName] = @P2
	)
	OR
	[dbo].[Person].[LastName] = @P3;',N'@P1 varchar(20),@P2 varchar(20),@P3 varchar(20)',@P1='Broflovski',@P2='Cartman',@P3='McCormick'
```
{% /code-example %}

## Filter expressions in Join clauses

{% code-example %}
```csharp
IList<dynamic> person_totals = db.SelectMany(
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
	[dbo].[Person].[Id],
	SUM([dbo].[Purchase].[TotalPurchaseAmount]) AS [LifetimeValue]
FROM
	[dbo].[Person]
	INNER JOIN [dbo].[Purchase] ON [dbo].[Person].[Id] = [dbo].[Purchase].[PersonId]
GROUP BY
	[dbo].[Person].[Id];
```
{% /code-example %}

{% code-example %}
```csharp
IList<dynamic> person_zips = db.SelectMany(
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
	[dbo].[Person].[Id],
	[dbo].[Address].[Zip]
FROM
	[dbo].[Person]
	INNER JOIN [dbo].[Person_Address] ON [dbo].[Person].[Id] = [dbo].[Person_Address].[PersonId]
	INNER JOIN [dbo].[Address] ON [dbo].[Person_Address].[AddressId] = [dbo].[Address].[Id]
	AND
	[dbo].[Address].[AddressType] = @P1;',N'@P1 int',@P1=1
```
{% /code-example %}

## Filter expressions in Having clauses

{% code-example %}
```csharp
IList<dynamic> people = db.SelectMany(
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
	[dbo].[Person].[LastName],
	COUNT([dbo].[Person].[Id]) AS [LastNameCount]
FROM
	[dbo].[Person]
GROUP BY
	[dbo].[Person].[LastName]
HAVING
	COUNT([dbo].[Person].[Id]) > @P1;',N'@P1 int',@P1=1
```
{% /code-example %}

## Filter expressions using arithmetic

Filter expressions can also be composed using arithmetic expressions in *WHERE* clauses, *JOIN* clauses, and *HAVING* clauses.

Arithmetic expression in a *WHERE* clause:
{% code-example %}
```csharp
IList<Product> products = db.SelectMany<Product>()
    .From(dbo.Product)
    .Where(
        ((dbo.Product.Quantity * dbo.Product.ListPrice) - (dbo.Product.Quantity * dbo.Product.Price)) > 1000
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Product].[Id],
	[dbo].[Product].[ProductCategoryType],
	[dbo].[Product].[Name],
	[dbo].[Product].[Description],
	[dbo].[Product].[ListPrice],
	[dbo].[Product].[Price],
	[dbo].[Product].[Quantity],
	[dbo].[Product].[Image],
	[dbo].[Product].[Height],
	[dbo].[Product].[Width],
	[dbo].[Product].[Depth],
	[dbo].[Product].[Weight],
	[dbo].[Product].[ShippingWeight],
	[dbo].[Product].[ValidStartTimeOfDayForPurchase],
	[dbo].[Product].[ValidEndTimeOfDayForPurchase],
	[dbo].[Product].[DateCreated],
	[dbo].[Product].[DateUpdated]
FROM
	[dbo].[Product]
WHERE
	(([dbo].[Product].[Quantity] * [dbo].[Product].[ListPrice]) - ([dbo].[Product].[Quantity] * [dbo].[Product].[Price])) > @P1;',N'@P1 float',@P1=1000
```
{% /code-example %}

Arithmetic expression in a *JOIN* clause:
{% code-example %}
```csharp
IList<dynamic> purchases = db.SelectMany(
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
	[dbo].[Purchase].[OrderNumber],
	[dbo].[PurchaseLine].[PurchasePrice],
	[dbo].[PurchaseLine].[Quantity]
FROM
	[dbo].[PurchaseLine]
	INNER JOIN [dbo].[Purchase] ON [dbo].[PurchaseLine].[PurchaseId] = [dbo].[Purchase].[Id]
	AND
	[dbo].[Purchase].[TotalPurchaseAmount] > @P1;',N'@P1 money',@P1=$100.0000
```
{% /code-example %}

And an arithmetic expression in a *HAVING* clause:
{% code-example %}
```csharp
IList<dynamic> purchases = db.SelectMany(
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
	[dbo].[Purchase].[OrderNumber],
	SUM([dbo].[PurchaseLine].[PurchasePrice])
FROM
	[dbo].[PurchaseLine]
	INNER JOIN [dbo].[Purchase] ON [dbo].[PurchaseLine].[PurchaseId] = [dbo].[Purchase].[Id]
GROUP BY
	[dbo].[Purchase].[OrderNumber]
HAVING
	SUM([dbo].[PurchaseLine].[PurchasePrice]) > @P1;',N'@P1 decimal(3,0)',@P1=100
```
{% /code-example %}