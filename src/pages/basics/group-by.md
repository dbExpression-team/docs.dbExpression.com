---
title: Group By
description: How to use group by clauses when fluently building query expressions.
---

Results can be grouped by using the ```GroupBy``` method while composing a QueryExpression. dbExpression supports grouping by any number of expression elements.

{% code-example %}
```csharp
//select the count of records grouped by last name
IList<dynamic> counts = db.SelectMany(
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

Group by is typically used with aggregation functions, but also works as a means to select distinct items.

{% code-example %}
```csharp
//select unique last names ordered ascending
IList<string> uniqueLastNames = db.SelectMany(dbo.Person.LastName)
    .From(dbo.Person)
    .GroupBy(dbo.Person.LastName)
    .OrderBy(dbo.Person.LastName.Asc)
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