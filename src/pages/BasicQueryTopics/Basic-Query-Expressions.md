---
title: Select, Update, Insert, and Delete
description: Fluently build strongly-typed QueryExpressions for execution against the target database using dbExpression.
---

using dbExpression, you can easily and fluently construct strongly-typed queries to perform *SELECT*, *UPDATE*, *DELETE*, and *INSERT* operations.

## Select
### Select One or Many Entities
Entities in dbExpression refer to the data package classes (POCOs) that are generated via the scaffolding process.  Data package classes are generated for all tables and views in the target database (by default).  The ```SelectOne``` query type returns a single entity (type defined by the provided generic parameter ```<T>```).  The ```SelectMany``` query type expects multiple results and returns an ```IList<T>```.  

> To ensure no additional data is buffered from the data reader beyond the intended single result, an explicit *TOP(1)* clause is appended to all SQL statements assembled using the ```SelectOne``` query type.

#### Select One Entity
To select a single entity, use the `SelectOne` query type (`db.SelectOne<T>`) when building a QueryExpression, where `T` is the entity type.
```csharp
Person? person = db.SelectOne<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.Id == 1)
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'SELECT TOP(1)
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
    [dbo].[Person].[Id] = @P1;',N'@P1 int',@P1=1
```
{% /collapsable %}

#### Select Many Entities
To select a list of entities, use the ```SelectMany``` query type (```db.SelectMany<T>```) when building a QueryExpression, where ```T``` is the entity type.
```csharp
IList<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.LastName == "Cartman")
    .Execute();
```

{% collapsable title="SQL statement" %}
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
{% /collapsable %}

### Select One or Many Scalar Values
Returning a single column value from a table or view is achieved by providing a single field expression (or any valid expression element) to the ```SelectOne``` or ```SelectMany``` method.  The result is a single ```T``` or an ```IList<T>``` where ```T``` is the .NET CLR type that maps to the SQL column type.

#### Select One Scalar Value
```csharp
string? firstName = db.SelectOne(dbo.Person.FirstName)
    .From(dbo.Person)
    .Where(dbo.Person.Id == 1)
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'SELECT TOP(1)
    [dbo].[Person].[FirstName]
FROM
    [dbo].[Person]
WHERE
    [dbo].[Person].[Id] = @P1;',N'@P1 int',@P1=1
```
{% /collapsable %}

#### Select Many Scalar Values
```csharp
IList<string> firstNames = db.SelectMany(dbo.Person.FirstName)
    .From(dbo.Person)
    .Where(dbo.Person.LastName == "Cartman")
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'SELECT
    [dbo].[Person].[FirstName]
FROM
    [dbo].[Person]
WHERE
    [dbo].[Person].[LastName] = @P1;',N'@P1 varchar(20)',@P1='Cartman'
```
{% /collapsable %}

### Select One or Many Dynamic Projections
*dynamic projection* describes a constructed QueryExpression resulting in the selection of more than one field for which no first class data package class exists.  Execution of the ```SelectOne``` or ```SelectMany``` query types results in ```dynamic``` or ```IList<dynamic>```.  Execution of the QueryExpression will create properties on each dynamic object that match the field names of the columns selected (*Id*, *FirstName*, *LastName*, etc.).

> Field names from resulting rowsets are used to create the properties on dynamic objects, so provide field names (or aliased field names) that create C# language supported property names. 

#### Select One Dynamic Projection
To select a single dynamic object, provide more than one field expression (or any other valid expression element) to the ```SelectOne``` method.
```csharp
dynamic? record = db.SelectOne(
    	dbo.Person.Id, 
    	dbo.Person.FirstName, 
    	dbo.Person.LastName
    )
    .From(dbo.Person)
    .Where(dbo.Person.Id == 1)
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'SELECT TOP(1)
    [dbo].[Person].[Id],
    [dbo].[Person].[FirstName],
    [dbo].[Person].[LastName]
FROM
    [dbo].[Person]
WHERE
    [dbo].[Person].[Id] = @P1;',N'@P1 int',@P1=1
```
{% /collapsable %}

#### Select Many Dynamic Projections
To select a list of dynamic objects, provide more than one field expression (or any other valid expression element) to the ```SelectMany``` method.
```csharp
IList<dynamic> records = db.SelectMany(
        dbo.Person.Id, 
        dbo.Person.FirstName, 
        dbo.Person.LastName
    )
    .From(dbo.Person)
    .Where(dbo.Person.LastName == "Cartman")
    .Execute();	
```

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'SELECT
    [dbo].[Person].[Id],
    [dbo].[Person].[FirstName],
    [dbo].[Person].[LastName]
FROM
    [dbo].[Person]
WHERE
    [dbo].[Person].[LastName] = @P1;',N'@P1 varchar(20)',@P1='Cartman'
```
{% /collapsable %}

## Update
dbExpression allows you to compose and execute direct updates against the target database.  Unlike some ORM frameworks, it's not standard or required to retrieve data in order to execute an update.  

To update a field value, use the ```Set``` method of the field expression. The following QueryExpression issues an update to the *Person* table where *Person.Id* is equal to the literal value ```1``` and sets that person's credit limit to the literal value ```25,000```.

```csharp
int affected = db.Update(dbo.Person.CreditLimit.Set(25000))
    .From(dbo.Person)
    .Where(dbo.Person.Id == 1)
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'UPDATE
    [dbo].[Person]
SET
    [CreditLimit] = @P1
FROM
    [dbo].[Person]
WHERE
    [dbo].[Person].[Id] = @P2;
SELECT @@ROWCOUNT;',N'@P1 int,@P2 int',@P1=25000,@P2=1
```
{% /collapsable %}

> Execution of an update QueryExpression returns the affected row count.  

It's also possible to perform arithmetic on the target database within the ```Set``` method; for example, if you needed to increase the list price of products in a specific category by n%, the adjustment is accomplished (without data retrieval) using server side arithmetic.

```csharp
int affected = db.Update(
        dbo.Product.ListPrice.Set(dbo.Product.ListPrice * 1.1)
    )
    .From(dbo.Product)
    .Where(dbo.Product.ProductCategoryType == ProductCategoryType.Books)
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'UPDATE
    [dbo].[Product]
SET
    [ListPrice] = ([ListPrice] * @P1)
FROM
    [dbo].[Product]
WHERE
    [dbo].[Product].[ProductCategoryType] = @P2;
SELECT @@ROWCOUNT;',N'@P1 float,@P2 int',@P1=1.1000000000000001,@P2=3
```
{% /collapsable %}

See [Advanced Queries (Arithmetic)](/AdvancedQueryTopics/Arithmetic) section for more detail on using server side arithmetic.
  
## Delete
dbExpression allows you to compose and execute deletes against your target database without first retrieving affected records.  The following expression issues a delete to the *Purchase* table where *Purchase.Id* equals ```9```.

```csharp
int affected = db.Delete()
    .From(dbo.Product)
    .Where(dbo.Product.Id == 9)
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'DELETE
    [dbo].[Product]
FROM
    [dbo].[Product]
WHERE
    [dbo].[Product].[Id] = @P1;
SELECT @@ROWCOUNT;',N'@P1 int',@P1=9
```
{% /collapsable %}

> Execution of a delete QueryExpression returns the affected row count.

## Insert
An insert QueryExpression relies on the data packages generated via the scaffolding process.  In the example below, we set properties of the ```Person``` entity instance and pass it to the ```Insert``` method.  dbExpression handles the mapping and parameterization of the data and sends it to the target database as a *Merge* statement.  The *Merge* statement returns (as output) all the resulting columns, which are mapped back onto the person entity instance.  This process allows for the return of data created by your target database platform: columns with an identity specification, computed column values and columns with server side default constraints.

```csharp
var charlie = new Person()
{
    FirstName = "Charlie",
    LastName = "Brown",
    BirthDate = new DateTime(1950, 10, 2),
    GenderType = GenderType.Male,
    CreditLimit = 45000,
    YearOfLastCreditLimitReview = 2021,
    RegistrationDate = DateTimeOffset.Now,
    LastLoginDate = null,
};
// The person table relies on an identity specification 
// for the Id field (PK).  At this point, charlie.Id will be 0
// Person also contains a DateCreated column that is set via 
// a server side default binding of: GETDATE()

db.Insert(charlie).Into(dbo.Person).Execute();

// after the insert is executed, charlie.Id will contain 
// the identity generated on the database server
// charlie.DateCreated will contain the result of the 
// default constraint applied to the column
```

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'SET NOCOUNT ON;
MERGE [dbo].[Person] USING (
VALUES
	(@P1, @P2, @P3, @P4, @P5, @P6, @P7, @P8, 0)
) AS [__values] (
	[FirstName], 
	[LastName], 
	[BirthDate], 
	[GenderType], 
	[CreditLimit], 
	[YearOfLastCreditLimitReview], 
	[RegistrationDate], 
	[LastLoginDate], 
	[ordinal]
) ON 1 != 1
WHEN NOT MATCHED THEN
INSERT (
	[FirstName], 
	[LastName], 
	[BirthDate], 
	[GenderType], 
	[CreditLimit], 
	[YearOfLastCreditLimitReview], 
	[RegistrationDate], 
	[LastLoginDate]
) VALUES (
	[__values].[FirstName], 
	[__values].[LastName], 
	[__values].[BirthDate], 
	[__values].[GenderType], 
	[__values].[CreditLimit], 
	[__values].[YearOfLastCreditLimitReview], 
	[__values].[RegistrationDate], 
	[__values].[LastLoginDate]
)
OUTPUT
	__values.[ordinal], 
	INSERTED.[Id], 
	INSERTED.[FirstName], 
	INSERTED.[LastName], 
	INSERTED.[BirthDate], 
	INSERTED.[GenderType], 
	INSERTED.[CreditLimit], 
	INSERTED.[YearOfLastCreditLimitReview], 
	INSERTED.[RegistrationDate], 
	INSERTED.[LastLoginDate], 
	INSERTED.[DateCreated], 
	INSERTED.[DateUpdated];',
	N'@P1 varchar(20),@P2 varchar(20),@P3 date,@P4 int,@P5 int,@P6 int,@P7 datetimeoffset(7),
	@P8 datetimeoffset(7)',@P1='Charlie',@P2='Brown',@P3='1950-10-02',@P4=1,@P5=45000,@P6=2021,
	@P7=NULL,@P8=NULL
```
{% /collapsable %}

#### Insert a Record Batch
To insert a batch of records, use the ```InsertMany``` query type while building a QueryExpression.  ```InsertMany``` utilizes the same insert strategy as ```Insert``` described above.  Upon return from execution of the ```InsertMany```, all the supplied objects will have identity values, computed values and defaulted values.

```csharp
var sally = new Person()
{
    FirstName = "Sally",
    LastName = "Brown",
    BirthDate = new DateTime(1959, 5, 26),
    GenderType = GenderType.Female,
    CreditLimit = 42000,
    YearOfLastCreditLimitReview = 2021,
    RegistrationDate = DateTimeOffset.Now,
    LastLoginDate = null,
};

var linus = new Person()
{
    FirstName = "Linus",
    LastName = "van Pelt",
    BirthDate = new DateTime(1952, 7, 14),
    GenderType = GenderType.Male,
    CreditLimit = 42000,
    YearOfLastCreditLimitReview = 2021,
    RegistrationDate = DateTimeOffset.Now,
    LastLoginDate = null,
};

var lucy = new Person()
{
    FirstName = "Lucy",
    LastName = "Van Pelt",
    BirthDate = new DateTime(1952, 3, 3),
    GenderType = GenderType.Female,
    CreditLimit = 42000,
    YearOfLastCreditLimitReview = 2021,
    RegistrationDate = DateTimeOffset.Now,
    LastLoginDate = null,
};

db.InsertMany(sally, linus, lucy).Into(dbo.Person).Execute();

// all properties based on identity column specifications, 
// default constraints or computed columns 
// will be populated on execution.
```

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'SET NOCOUNT ON;
MERGE [dbo].[Person] USING (
VALUES
	(@P1, @P2, @P3, @P4, @P5, @P6, @P7, NULL, 0), 
	(@P8, @P9, @P10, @P11, @P5, @P6, @P12, NULL, 1), 
	(@P13, @P14, @P15, @P16, @P5, @P6, @P17, NULL, 2)
) AS [__values] (
	[FirstName], 
	[LastName], 
	[BirthDate], 
	[GenderType], 
	[CreditLimit], 
	[YearOfLastCreditLimitReview], 
	[RegistrationDate], 
	[LastLoginDate], 
	[__ordinal]
) ON 1 != 1
WHEN NOT MATCHED THEN
INSERT (
	[FirstName], 
	[LastName], 
	[BirthDate], 
	[GenderType], 
	[CreditLimit], 
	[YearOfLastCreditLimitReview], 
	[RegistrationDate], 
	[LastLoginDate]
) VALUES (
	[__values].[FirstName], 
	[__values].[LastName], 
	[__values].[BirthDate], 
	[__values].[GenderType], 
	[__values].[CreditLimit], 
	[__values].[YearOfLastCreditLimitReview], 
	[__values].[RegistrationDate], 
	[__values].[LastLoginDate]
)
OUTPUT
	[__values].[__ordinal], 
	[inserted].[Id], 
	[inserted].[FirstName], 
	[inserted].[LastName], 
	[inserted].[BirthDate], 
	[inserted].[GenderType], 
	[inserted].[CreditLimit], 
	[inserted].[YearOfLastCreditLimitReview], 
	[inserted].[RegistrationDate], 
	[inserted].[LastLoginDate], 
	[inserted].[DateCreated], 
	[inserted].[DateUpdated];',N'@P1 varchar(20),@P2 varchar(20),@P3 date,@P4 int,@P5 int,@P6 int,@P7 datetimeoffset(7),@P8 varchar(20),@P9 varchar(20),@P10 date,@P11 int,@P12 datetimeoffset(7),@P13 varchar(20),@P14 varchar(20),@P15 date,@P16 int,@P17 datetimeoffset(7)',@P1='Sally',@P2='Brown',@P3='1959-05-26',@P4=2,@P5=42000,@P6=2021,@P7='2022-06-10 10:23:59.1748700 -05:00',@P8='Linus',@P9='van Pelt',@P10='1952-07-14',@P11=1,@P12='2022-06-10 10:23:59.1750456 -05:00',@P13='Lucy',@P14='Van Pelt',@P15='1952-03-03',@P16=2,@P17='2022-06-10 10:23:59.1750510 -05:00'
```
{% /collapsable %}






