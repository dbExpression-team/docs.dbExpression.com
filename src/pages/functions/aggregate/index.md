---
title: Aggregate Database Functions
description: How to use aggregate database functions while fluently building query expressions.
---

dbExpression supports the following aggregate database functions:
* Sum
* Avg
* Min
* Max
* Count
* StDev
* StDevP
* Var
* VarP

Use ```fx``` to access these functions for building QueryExpressions. So, using the ```Sum``` function is simply ```db.fx.Sum(...)```.

> Use the ```fx``` property of the database accessor to use database functions

{% code-example %}
```csharp
//select the avg total purchase amount
double avgSale = db.SelectOne(db.fx.Avg(dbo.Purchase.TotalPurchaseAmount))
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT TOP(1)
	AVG([dbo].[Purchase].[TotalPurchaseAmount])
FROM
	[dbo].[Purchase];
```
{% /code-example %}