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
ORDER BY
    [dbo].[Person].[DateCreated] DESC
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
ORDER BY
    [dbo].[Person].[RegistrationDate] DESC
    OFFSET @P1	 ROWS
;',N'@P1 int',@P1=1
```
{% /code-example %}