---
title: Having
description: How to use the having clause when fluently building query expressions.
---

Aggregated results can be filtered by using the `Having` method while composing a query.

{% code-example %}
```csharp
IList<dynamic> maxPurchases = db.SelectMany(
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
    [dbo].[Person].[Id],
    [dbo].[Person].[FirstName],
    [dbo].[Person].[LastName],
    MAX([dbo].[Purchase].[TotalPurchaseAmount]) AS [MaxPurchaseAmt]
FROM
    [dbo].[Person]
    INNER JOIN [dbo].[Purchase] ON [dbo].[Purchase].[PersonId] = [dbo].[Person].[Id]
GROUP BY
    [dbo].[Person].[Id],
    [dbo].[Person].[FirstName],
    [dbo].[Person].[LastName]
HAVING
    MAX([dbo].[Purchase].[TotalPurchaseAmount]) >= @P1
ORDER BY
    [dbo].[Person].[LastName] ASC;',N'@P1 float',@P1=18
```
{% /code-example %}

The having clause is discussed in greater detail in [Filter Expressions](../../core-concepts/filters/filter-expressions).