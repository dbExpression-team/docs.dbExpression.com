---
title: Select Statements
description: Fluently build a SELECT sql statement using dbExpression.
todo: update reference link to select statement once docs for select statement are completed (/reference/statements/select-statement)
      [Old starting text:] We'll cover the basics of *SELECT* queries here, but the [Reference section on executing SELECT queries](/reference/statements/select-statement) discusses advanced
      operations you can
      use to manage rowset data as it's returned from the database.
---

To start building *SELECT* queries, use the database accessor (static or dependency injected instance) followed by a `SelectOne` or `SelectMany`.  The number of data items you expect or want as a
return, and the return type of *SELECT* operations, determine which signature you use to construct a query.

> To ensure no additional data is buffered from the data reader beyond the intended single result, an explicit *TOP(1)* clause is appended to all SQL statements assembled using the `SelectOne` query type.

> dbExpression does NOT validate executed `SelectOne` queries to ensure there was only one record matching your query input - it simply selects the first record.

## Select One or Many Entities

Entities in dbExpression refer to the data package classes (POCOs) that are generated via the scaffolding process.  Data package classes are generated for all tables and views in the target database (by default).  The `SelectOne` query type returns a single entity (type defined by the provided generic parameter `T`).  The `SelectMany` query type expects multiple results and returns an `IList<T>`.

### Select One Entity

To select a single entity, use the `SelectOne` query type (`db.SelectOne<T>`) when building a QueryExpression, where `T` is the entity type.

{% code-example %}
```csharp
Person? person = db.SelectOne<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.Id == 1)
    .Execute();
```
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
{% /code-example %}

### Select Many Entities

To select a list of entities, use the `SelectMany` query type (`db.SelectMany<T>`) when building a QueryExpression, where `T` is the entity type.

{% code-example %}
```csharp
IList<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
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

## Select One or Many Scalar Values

Returning a single column value from a table or view is achieved by providing a single field expression (or any valid expression element) to the `SelectOne` or `SelectMany` method.  The result is a single `T` or an `IList<T>` where `T` is the .NET CLR type that maps to the SQL column type.

### Select One Scalar Value

{% code-example %}
```csharp
string? firstName = db.SelectOne(dbo.Person.FirstName)
    .From(dbo.Person)
    .Where(dbo.Person.Id == 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT TOP(1)
    [dbo].[Person].[FirstName]
FROM
    [dbo].[Person]
WHERE
    [dbo].[Person].[Id] = @P1;',N'@P1 int',@P1=1
```
{% /code-example %}

### Select Many Scalar Values

{% code-example %}
```csharp
IList<string> firstNames = db.SelectMany(dbo.Person.FirstName)
    .From(dbo.Person)
    .Where(dbo.Person.LastName == "Cartman")
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [dbo].[Person].[FirstName]
FROM
    [dbo].[Person]
WHERE
    [dbo].[Person].[LastName] = @P1;',N'@P1 varchar(20)',@P1='Cartman'
```
{% /code-example %}

## Select One or Many Dynamic Projections

*dynamic projection* describes a constructed QueryExpression resulting in the selection of more than one field for which no first class data package class exists.  Execution of the `SelectOne` or `SelectMany` query types results in `dynamic` or `IList<dynamic>`.  Execution of the QueryExpression will create properties on each dynamic object that match the field names of the columns selected (*Id*, *FirstName*, *LastName*, etc.).

> Field names from resulting rowsets are used to create the properties on dynamic objects, so provide field names (or aliased field names) that create C# language supported property names. 

### Select One Dynamic Projection

To select a single dynamic object, provide more than one field expression (or any other valid expression element) to the `SelectOne` method.

{% code-example %}
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
{% /code-example %}

### Select Many Dynamic Projections

To select a list of dynamic objects, provide more than one field expression (or any other valid expression element) to the `SelectMany` method.

{% code-example %}
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
{% /code-example %}