---
title: Offset and Limit (Pagination)
description: How to use the offset and limit statements when fluently building query expressions.
---

Use the `Offset` and `Limit` methods while composing a query to return a window of results.  dbExpression
deviates from Microsoft SQL Server on syntax - but using familiar C# Linq syntax just felt right on this one.

> dbExpression deviates from Microsoft SQL Server syntax of *OFFSET* and *FETCH NEXT ROWS ONLY* when building
queries.

{% code-example %}
```csharp
//skip the first 10 matched records, and only return 10 records
IEnumerable<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
    .OrderBy(dbo.Person.DateCreated.Desc())
    .Offset(10)
    .Limit(10)
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
ORDER BY
    [t0].[DateCreated] DESC
    OFFSET @P1 ROWS
    FETCH NEXT @P2 ROWS ONLY;',N'@P1 int,@P2 int',@P1=10,@P2=10
```
{% /code-example %}

{% code-example %}
```csharp
//skip the first record, and return all remaining records
IEnumerable<Person> notTheLastPersonToRegister = db.SelectMany<Person>()
    .From(dbo.Person)
    .OrderBy(dbo.Person.RegistrationDate.Desc())
    .Offset(1)
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
ORDER BY
    [t0].[RegistrationDate] DESC
    OFFSET @P1 ROWS;',N'@P1 int',@P1=1
```
{% /code-example %}