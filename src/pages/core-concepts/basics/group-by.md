---
title: Group By
description: How to use group by clauses when fluently building query expressions.
---

Results can be grouped by using the `GroupBy` method while composing a query. dbExpression 
supports grouping by any number of expression elements.

An example that selects the count of records grouped by last name:
{% code-example %}
```csharp
IEnumerable<dynamic> counts = db.SelectMany(
        dbo.Person.LastName,
        db.fx.Count(dbo.Person.LastName).As("LastNameCount")
    )
    .From(dbo.Person)
    .GroupBy(dbo.Person.LastName)
    .Execute();
```
```sql
SELECT
    [t0].[LastName],
    COUNT([t0].[LastName]) AS [LastNameCount]
FROM
    [dbo].[Person] AS [t0]
GROUP BY
    [t0].[LastName];
```
{% /code-example %}

An example that selects the count of records grouped by first name and last name:
{% code-example %}
```csharp
IEnumerable<dynamic> persons = db.SelectMany(
        dbo.Person.FirstName,
        dbo.Person.LastName,
        db.fx.Count(dbo.PersonAddress.Id).As("Count")
    )
    .From(dbo.Person)
    .InnerJoin(dbo.PersonAddress).On(dbo.Person.Id == dbo.PersonAddress.PersonId)
    .GroupBy(
        dbo.Person.FirstName,
        dbo.Person.LastName
    ).OrderBy(
        dbo.Person.LastName,
        dbo.Person.FirstName.Desc()
    )
    .Execute();
```
```sql
SELECT
    [t0].[FirstName],
    [t0].[LastName],
    COUNT([t1].[Id]) AS [Count]
FROM
    [dbo].[Person] AS [t0]
    INNER JOIN [dbo].[Person_Address] AS [t1] ON [t0].[Id] = [t1].[PersonId]
GROUP BY
    [t0].[FirstName],
    [t0].[LastName]
ORDER BY
    [t0].[LastName] ASC,
    [t0].[FirstName] DESC;
```
{% /code-example %}

Group by is typically used with aggregation functions, but also works as a means to select distinct items.

{% code-example %}
```csharp
//select unique last names ordered ascending
IEnumerable<string> uniqueLastNames = db.SelectMany(dbo.Person.LastName)
    .From(dbo.Person)
    .GroupBy(dbo.Person.LastName)
    .OrderBy(dbo.Person.LastName.Asc())
    .Execute();
```
```sql
SELECT
    [t0].[LastName]
FROM
    [dbo].[Person] AS [t0]
GROUP BY
    [t0].[LastName]
ORDER BY
    [t0].[LastName] ASC;
```
{% /code-example %}