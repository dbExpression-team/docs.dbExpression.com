---
title: Top
description: How to use the top clause when fluently building query expressions.
---

Use the `Top` method while composing a query to limit the number of results affected/returned from execution.

{% code-example %}
```csharp
//select the top 5 purchases by dollar amount
IEnumerable<Purchase> purchases = db.SelectMany<Purchase>()
    .Top(5)
    .From(dbo.Purchase)
    .OrderBy(dbo.Purchase.TotalPurchaseAmount.Desc())
    .Execute();
```
```sql
SELECT TOP(5)
    [t0].[Id],
    [t0].[PersonId],
    [t0].[OrderNumber],
    [t0].[TotalPurchaseQuantity],
    [t0].[TotalPurchaseAmount],
    [t0].[PurchaseDate],
    [t0].[ShipDate],
    [t0].[ExpectedDeliveryDate],
    [t0].[TrackingIdentifier],
    [t0].[PaymentMethodType],
    [t0].[PaymentSourceType],
    [t0].[DateCreated],
    [t0].[DateUpdated]
FROM
    [dbo].[Purchase] AS [t0]
ORDER BY
    [t0].[TotalPurchaseAmount] DESC;
```
{% /code-example %}

`Top` can also be used in conjunction with the `Distinct` method.

{% code-example %}
```csharp
//select the top 5 distinct persons by name
IEnumerable<dynamic> persons = db.SelectMany(
        dbo.Person.FirstName,
        dbo.Person.LastName
    )
    .Top(5)
    .Distinct()
    .From(dbo.Person)
    .OrderBy(
        dbo.Person.LastName, 
        dbo.Person.FirstName
    )
    .Execute();
```
```sql
SELECT DISTINCT TOP(5)
    [t0].[FirstName],
    [t0].[LastName]
FROM
    [dbo].[Person] AS [t0]
ORDER BY
    [t0].[LastName] ASC,
    [t0].[FirstName] ASC;
```
{% /code-example %}