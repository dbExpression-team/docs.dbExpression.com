---
title: Multiple Schemas
description: How to use multiple schemas in query expressions.
---

dbExpression supports queries using more than one schema.  For example, the following query
uses fields from the *dbo* and *sec* schema:
{% code-example %}
```csharp
IEnumerable<dynamic> purchases = db.SelectMany(
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
{% /code-example %}