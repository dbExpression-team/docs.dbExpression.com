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
	.Where((dbo.Person.FirstName + " " + dbo.Person.LastName).Like("David W%"));
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
	([dbo].[Person].[FirstName] + @P1 + [dbo].[Person].[LastName]) LIKE @P2;',N'@P1 char(1),@P2 char(8)',@P1=' ',@P2='David W%'
```
{% /code-example %}