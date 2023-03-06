---
title: Order By
description: How to use order by clauses when fluently building query expressions.
---

Results can be ordered either ascending or descending by using the `Asc` or `Desc` properties of a field expression (or any valid expression element).  When not provided, order defaults to ascending.  dbExpression supports ordering by any number of expression elements.

{% code-example %}
```csharp
//select all people ordered by last name descending
IEnumerable<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
    .OrderBy(dbo.Person.LastName.Desc())
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
ORDER BY
    [t0].[LastName] DESC;
```
{% /code-example %}

{% code-example %}
```csharp
//select all people ordered by gender type ascending and last name ascending
IEnumerable<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
    .OrderBy(
        dbo.Person.GenderType,
        dbo.Person.LastName
    )
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
ORDER BY
    [t0].[GenderType] ASC,
    [t0].[LastName] ASC;
```
{% /code-example %}