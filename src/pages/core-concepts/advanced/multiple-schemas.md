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
    [t0].[Id],
    [t0].[SSN] AS [SocialSecurityNumber],
    [t1].[PurchaseDate],
    [t1].[OrderNumber],
    [t1].[TotalPurchaseAmount]
FROM
    [sec].[Person] AS [t0]
    INNER JOIN [dbo].[Purchase] AS [t1] ON [t0].[Id] = [t1].[PersonId];
```
{% /code-example %}