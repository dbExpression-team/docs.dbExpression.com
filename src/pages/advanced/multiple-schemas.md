---
title: Multiple Schemas
description: How to use multiple schemas in query expressions.
---

dbExpression supports QueryExpressions using more than one schema.  For example, the following QueryExpression uses fields from the *dbo* and *sec* schema:
```csharp
IList<dynamic> purchases = db.SelectMany(
        sec.Person.Id,
        sec.Person.SocialSecurityNumber,            
        dbo.Purchase.PurchaseDate,
        dbo.Purchase.OrderNumber,
        dbo.Purchase.TotalPurchaseAmount
    )
    .From(sec.Person)
    .InnerJoin(dbo.Purchase).On(sec.Person.Id == dbo.Purchase.PersonId)
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
SELECT
	[sec].[Person].[Id],
	[sec].[Person].[SSN] AS [SocialSecurityNumber],
	[dbo].[Purchase].[PurchaseDate],
	[dbo].[Purchase].[OrderNumber],
	[dbo].[Purchase].[TotalPurchaseAmount]
FROM
	[sec].[Person]
	INNER JOIN [dbo].[Purchase] ON [sec].[Person].[Id] = [dbo].[Purchase].[PersonId];
```
{% /collapsable %}