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
    [dbo].[Person].[LastName] DESC;
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
    [dbo].[Person].[GenderType] ASC,
    [dbo].[Person].[LastName] ASC;
```
{% /code-example %}