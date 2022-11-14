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
	[dbo].[Person].[LastName],
	COUNT([dbo].[Person].[LastName]) AS [LastNameCount]
FROM
	[dbo].[Person]
GROUP BY
	[dbo].[Person].[LastName];
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
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName],
	COUNT([dbo].[Person_Address].[Id]) AS [Count]
FROM
	[dbo].[Person]
	INNER JOIN [dbo].[Person_Address] ON [dbo].[Person].[Id] = [dbo].[Person_Address].[PersonId]
GROUP BY
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName]
ORDER BY
	[dbo].[Person].[LastName] ASC,
	[dbo].[Person].[FirstName] DESC;
```
{% /code-example %}

Group by is typically used with aggregation functions, but also works as a means to select distinct items.

{% code-example %}
```csharp
//select unique last names ordered ascending
ILIEnumerableist<string> uniqueLastNames = db.SelectMany(dbo.Person.LastName)
    .From(dbo.Person)
    .GroupBy(dbo.Person.LastName)
    .OrderBy(dbo.Person.LastName.Asc())
    .Execute();
```
```sql
SELECT
    [dbo].[Person].[LastName]
FROM
    [dbo].[Person]
GROUP BY
    [dbo].[Person].[LastName]
ORDER BY
    [dbo].[Person].[LastName] ASC;
```
{% /code-example %}