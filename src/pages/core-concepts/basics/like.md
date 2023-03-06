---
title: Like
description: How to use like clauses when fluently building query expressions.
---

Results can be filtered by using the `Like` method of a string expression.

This example selects records where a person's first name is `David` and the last name starts with `W`:
{% code-example %}
```csharp
IEnumerable<Person> persons = db.SelectMany<Person>()
	.From(dbo.Person)
	.Where((dbo.Person.FirstName + " " + dbo.Person.LastName).Like("David W%"))
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
	([t0].[FirstName] + @P1 + [t0].[LastName]) LIKE @P2;',N'@P1 char(1),@P2 char(8)',@P1=' ',@P2='David W%'
```
{% /code-example %}