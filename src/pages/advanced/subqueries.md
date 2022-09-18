---
title: Subqueries
description: How to fluently build subqueries for use with outer query expressions.
---

dbExpression supports subqueries in QueryExpressions.  The general form of subqueries in a JOIN condition:

```csharp
IList<dynamic> vips = db.SelectMany(
	dbo.Person.Id, 
	dbo.Person.FirstName, 
	dbo.Person.LastName,
	dbex.Alias("t0", "TotalPurchase")
	)
.From(dbo.Person)
.InnerJoin(
	db.SelectMany(
	    dbo.Purchase.PersonId,
	    db.fx.Sum(dbo.Purchase.TotalPurchaseAmount).As("TotalPurchase")
	)
	.Top(100)
	.From(dbo.Purchase)
	.GroupBy(dbo.Purchase.PersonId)
	.Having(db.fx.Sum(dbo.Purchase.TotalPurchaseAmount) > 25)
	.OrderBy(db.fx.Sum(dbo.Purchase.TotalPurchaseAmount).Desc)
).As("t0")
.On(dbex.Alias("t0", "PersonId") == dbo.Person.Id)
.Execute();
```

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'SELECT
	[dbo].[Person].[Id],
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName],
	[t0].[TotalPurchase]
FROM
	[dbo].[Person]
	INNER JOIN (
		SELECT TOP(100)
			[dbo].[Purchase].[PersonId],
			SUM([dbo].[Purchase].[TotalPurchaseAmount]) AS [TotalPurchase]
		FROM
			[dbo].[Purchase]
		GROUP BY
			[dbo].[Purchase].[PersonId]
		HAVING
			SUM([dbo].[Purchase].[TotalPurchaseAmount]) > @P1
		ORDER BY
			SUM([dbo].[Purchase].[TotalPurchaseAmount]) DESC
	) AS [t0] ON [t0].[PersonId] = [dbo].[Person].[Id];',N'@P1 float',@P1=25
```
{% /collapsable %}

Subqueries are discussed in more detail in [Subquery Aliasing](/aliasing/subquery).