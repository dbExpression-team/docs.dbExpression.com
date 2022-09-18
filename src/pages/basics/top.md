---
title: Top
description: How to use the top clause when fluently building query expressions.
---

Use the ```Top``` method while composing a QueryExpression to limit the number of results affected/returned from execution.

```csharp
//select the top 5 purchases by dollar amount
IList<Purchase> purchases = db.SelectMany<Purchase>()
    .Top(5)
    .From(dbo.Purchase)
    .OrderBy(dbo.Purchase.TotalPurchaseAmount.Desc)
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
SELECT TOP(5)
    [dbo].[Purchase].[Id],
    [dbo].[Purchase].[PersonId],
    [dbo].[Purchase].[OrderNumber],
    [dbo].[Purchase].[TotalPurchaseQuantity],
    [dbo].[Purchase].[TotalPurchaseAmount],
    [dbo].[Purchase].[PurchaseDate],
    [dbo].[Purchase].[ShipDate],
    [dbo].[Purchase].[ExpectedDeliveryDate],
    [dbo].[Purchase].[TrackingIdentifier],
    [dbo].[Purchase].[PaymentMethodType],
    [dbo].[Purchase].[PaymentSourceType],
    [dbo].[Purchase].[DateCreated],
    [dbo].[Purchase].[DateUpdated]
FROM
    [dbo].[Purchase]
ORDER BY
    [dbo].[Purchase].[TotalPurchaseAmount] DESC;
```
{% /collapsable %}

```Top``` can also be used in conjunction with the ```Distinct``` method.
```csharp
//select the top 5 distinct persons by name
IList<Person> persons = db.SelectMany(
        dbo.Person.FirstName,
        dbo.Person.LastName
    )
    .Top(expected)
    .Distinct()
    .From(dbo.Person)
    .OrderBy(
        dbo.Person.LastName.Asc, 
        dbo.Person.FirstName.Asc
    )
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
SELECT DISTINCT TOP(5)
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName]
FROM
	[dbo].[Person]
ORDER BY
	[dbo].[Person].[LastName] ASC,
	[dbo].[Person].[FirstName] ASC
;
```
{% /-output %}