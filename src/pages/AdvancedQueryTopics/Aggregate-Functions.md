---
title: Aggregate Database Functions
description: How to use aggregate database functions while fluently building query expressions.
---

dbExpression currently supports the following aggregate functions:
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

```csharp
//select the avg total purchase amount
double avgSale = db.SelectOne(db.fx.Avg(dbo.Purchase.TotalPurchaseAmount))
    .From(dbo.Purchase)
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
SELECT TOP(1)
	AVG([dbo].[Purchase].[TotalPurchaseAmount])
FROM
	[dbo].[Purchase];
```
{% /collapsable %}