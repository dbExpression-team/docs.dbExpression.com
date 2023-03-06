---
title: In
description: How to use in clauses when fluently building query expressions.
---

Results can be filtered by using the `In` method of a field expression while composing a query.

This example selects records where the value matches one of the items in the list:
{% code-example %}
```csharp
IEnumerable<Purchase> purchases = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .Where(
        dbo.Purchase.PaymentMethodType.In(
            PaymentMethodType.CreditCard, 
            PaymentMethodType.ACH, 
            PaymentMethodType.PayPal
        )
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
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
WHERE
	[t0].[PaymentMethodType] IN (@P1,@P2,@P3);',N'@P1 varchar(20),@P2 varchar(20),@P3 varchar(20)',@P1='CreditCard',@P2='ACH',@P3='PayPal'
```
Note the above sql statement uses the string values of the enum values.  This is due to the settings provided in startup configuration that indicated the type `PaymentMethodType` should be persisted as it's string value (see [Enums](enums) for more detail).
{% /code-example %}