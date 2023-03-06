---
title: Having
description: How to use the having clause when fluently building query expressions.
---

Aggregated results can be filtered by using the `Having` method while composing a query.

{% code-example %}
```csharp
IEnumerable<dynamic> maxPurchases = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.FirstName, 
        dbo.Person.LastName,
        db.fx.Max(dbo.Purchase.TotalPurchaseAmount).As("MaxPurchaseAmt")
    )
    .From(dbo.Person)
    .InnerJoin(dbo.Purchase).On(dbo.Purchase.PersonId == dbo.Person.Id)
    .OrderBy(dbo.Person.LastName)
    .GroupBy(
        dbo.Person.Id, 
        dbo.Person.FirstName, 
        dbo.Person.LastName
    )
    .Having(
	    db.fx.Max(dbo.Purchase.TotalPurchaseAmount) >= 18.00
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id],
    [t0].[FirstName],
    [t0].[LastName],
    MAX([t1].[TotalPurchaseAmount]) AS [MaxPurchaseAmt]
FROM
    [dbo].[Person] AS [t0]
    INNER JOIN [dbo].[Purchase] AS [t1] ON [t1].[PersonId] = [t0].[Id]
GROUP BY
    [t0].[Id],
    [t0].[FirstName],
    [t0].[LastName]
HAVING
    MAX([t1].[TotalPurchaseAmount]) >= @P1
ORDER BY
    [t0].[LastName] ASC;',N'@P1 float',@P1=18
```
{% /code-example %}

The having clause is discussed in greater detail in [Filter Expressions](../../core-concepts/filters/filter-expressions).