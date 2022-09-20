---
title: Database Functions
description: How to use basic database functions while fluently building query expressions.
---

dbExpression supports the following database functions:
* Concat
* Coalesce
* Trim
* RTrim
* LTrim
* Len
* PatIndex
* CharIndex
* Left
* Right
* Substring
* Replace
* IsNull
* Abs
* Floor
* Ceiling
* Cast
* Current_Timestamp
* DateAdd
* DatePart
* DateDiff
* GetDate
* GetUtcDate
* SysDateTime
* SysDateTimeOffset
* SysUtcDateTime
* NewId
* Round

These functions can be used in building QueryExpressions by using ```fx```, a member of the ```db``` database accessor class (or the name of the property representing the database injected using dependency injection). So, accessing the ```GetDate``` function is simply ```db.fx.GetDate()```.

> Use the ```fx``` property of the database accessor to use database functions
{% code-example %}
```csharp
//set year of last credit review equal current year
db.Update(
        dbo.Person.YearOfLastCreditLimitReview.Set(
            db.fx.DatePart(DateParts.Year, db.fx.GetDate())
			// ^ use db.fx to access the DatePart function
        )
    )
    .From(dbo.Person)
    .Where(dbo.Person.Id == 1)
    .Execute();

```
```sql
exec sp_executesql N'UPDATE
    [dbo].[Person]
SET
    [YearOfLastCreditLimitReview] = DATEPART(year, GETDATE())
FROM
    [dbo].[Person]
WHERE
    [dbo].[Person].[Id] = @P1; 
SELECT @@ROWCOUNT;',N'@P1 int',@P1=4
```
{% /code-example %}

## SQL Server Version Specific Handling
A few database functions require special handling.  These database functions were either introduced in later versions of 
SQL Server and/or result in different data types based on inputs, where there is no means to effect that difference 
in code.  dbExpression will use alternative functions, or deviate from SQL Server when necesary.

### Trim
Microsoft Sql Server natively supports the ```Trim``` function from versions 2017 forward.  Prior to version 2017, Microsoft Sql Server only supported the ```LTrim``` and ```RTrim``` functions.  Using a combination of these two is effectively the same as ```Trim```.  When dbExpression is configured for a runtime version prior to 2017, **dbExpression will translate any use of the ```Trim``` function to a combination of ```LTrim``` and ```RTrim```**.

Version 2017 forward:
{% code-example %}
```csharp
//select some combination of address fields
IList<string> addresses = db.SelectMany(
        db.fx.Trim(dbo.Address.Line1 + " " + db.fx.IsNull(dbo.Address.Line2, "") + " " + dbo.Address.City)
    ).From(dbo.Address)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	TRIM(([dbo].[Address].[Line1] + @P1 + ISNULL([dbo].[Address].[Line2], @P2) + @P3 + [dbo].[Address].[City]))
FROM
	[dbo].[Address];',N'@P1 char(1),@P2 varchar(1),@P3 char(1)',@P1=' ',@P2='',@P3=' '
```
{% /code-example %}

Prior to version 2017:
{% code-example %}
```csharp
//select some combination of address fields (same as previous example)
IList<string> addresses = db.SelectMany(
        db.fx.Trim(dbo.Address.Line1 + " " + db.fx.IsNull(dbo.Address.Line2, "") + " " + dbo.Address.City)
    ).From(dbo.Address)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	LTRIM(RTRIM(([dbo].[Address].[Line1] + @P1 + ISNULL([dbo].[Address].[Line2], @P2) + @P3 + [dbo].[Address].[City])))
FROM
	[dbo].[Address];',N'@P1 char(1),@P2 varchar(1),@P3 char(1)',@P1=' ',@P2='',@P3=' '
```
{% /code-example %}

### Len
Microsoft Sql Server returns ```bigint``` if expression is of the ```varchar(max)```, ```nvarchar(max)``` or ```varbinary(max)``` data types; otherwise, ```int```.  dbExpression generally maps these to CLR types ```long``` and ```int``` respectively.  As the dbExpression implementation for ```Len``` works with the CLR type ```string``` (values and expressions), there is no way to effect a different return type based on the length of the provided ```string``` (value or expression).  Therefore, ```Len``` in dbExpression *always* returns ```long``` (or ```long?``` for expressions that reference a nullable column/value).

{% code-example %}
```csharp
//select all persons with full name longer than 10 characters
IList<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .Where(db.fx.Len(dbo.Person.FirstName + " " + dbo.Person.LastName) > 10)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Person].[Id]
	,[dbo].[Person].[FirstName]
	,[dbo].[Person].[LastName]
	,[dbo].[Person].[BirthDate]
	,[dbo].[Person].[GenderType]
	,[dbo].[Person].[CreditLimit]
	,[dbo].[Person].[YearOfLastCreditLimitReview]
	,[dbo].[Person].[RegistrationDate]
	,[dbo].[Person].[LastLoginDate]
	,[dbo].[Person].[DateCreated]
	,[dbo].[Person].[DateUpdated]
FROM
	[dbo].[Person]
WHERE
	LEN((([dbo].[Person].[FirstName] + @P1) + [dbo].[Person].[LastName])) > @P2;',N'@P1 char(1),@P2 bigint',@P1=' ',@P2=10
```
{% /code-example %}

### PatIndex
Microsoft Sql Server returns ```bigint``` if expression is of the ```varchar(max)``` or ```nvarchar(max)``` data types; otherwise, ```int```.  dbExpression generally maps these to CLR types ```long``` and ```int``` respectively.  As the dbExpression implementation for ```PatIndex``` works with the CLR type ```string``` (values and expressions), there is no way to effect a different return type based on the length of the provided ```string``` (value or expression) for the ```element``` method parameter.  Therefore, ```PatIndex``` in dbExpression *always* returns ```long``` (or ```long?``` for expressions that reference a nullable column/value).

{% code-example %}
```csharp
//select all persons whose name starts with the letter 'K'
IList<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .Where(db.fx.PatIndex("K%", dbo.Person.FirstName) == 1)
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
	PATINDEX(@P1, [dbo].[Person].[FirstName]) = @P2;',N'@P1 char(2),@P2 bigint',@P1='K%',@P2=1'
```
{% /code-example %}

### CharIndex
Microsoft Sql Server returns ```bigint``` if expression is of the ```varchar(max)```, ```varbinary(max)```, or ```nvarchar(max)``` data types; otherwise, ```int```.  dbExpression generally maps these to CLR types ```long``` and ```int``` respectively.  As the dbExpression implementation for ```CharIndex``` works with the CLR type ```string``` (values and expressions), there is no way to effect a different return type based on the length of the provided ```string``` (value or expression) for the ```element``` method parameter.  Therefore, ```CharIndex``` in dbExpression *always* returns ```long``` or ```long?```.

{% code-example %}
```csharp
//select all persons whose name starts with the letter 'K'
IList<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .Where(db.fx.CharIndex("K", dbo.Person.FirstName) == 1)
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
	CHARINDEX(@P1, [dbo].[Person].[FirstName]) = @P2;',N'@P1 char(2),@P2 bigint',@P1='K',@P2=1'
```
{% /code-example %}