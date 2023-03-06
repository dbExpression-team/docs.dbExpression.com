---
title: Subqueries
description: How to fluently build subqueries for use with outer query expressions.
---

dbExpression supports subqueries in queries.  Subqueries are just like any other select
query, simply write a normal `SelectOne` or `SelectMany` query and include that query
as a comparison argument in a *JOIN* clause.

The general form of subqueries in a *JOIN* clause:

{% code-example %}
```csharp
IEnumerable<dynamic> vips = db.SelectMany(
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
	.OrderBy(db.fx.Sum(dbo.Purchase.TotalPurchaseAmount).Desc())
).As("t0")
.On(dbex.Alias("t0", "PersonId") == dbo.Person.Id)
.Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[Id],
	[t0].[FirstName],
	[t0].[LastName],
	[t0].[TotalPurchase]
FROM
	[dbo].[Person] AS [t0]
	INNER JOIN (
		SELECT TOP(100)
			[t1].[PersonId],
			SUM([t1].[TotalPurchaseAmount]) AS [TotalPurchase]
		FROM
			[dbo].[Purchase] AS [t1]
		GROUP BY
			[t1].[PersonId]
		HAVING
			SUM([t1].[TotalPurchaseAmount]) > @P1
		ORDER BY
			SUM([t1].[TotalPurchaseAmount]) DESC
	) AS [t0] ON [t0].[PersonId] = [t0].[Id];',N'@P1 float',@P1=25
```
{% /code-example %}

Subqueries are discussed in more detail in [Subquery Aliasing](../../core-concepts/aliasing/subquery).