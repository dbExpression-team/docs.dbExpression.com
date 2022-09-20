---
title: In
description: How to use in clauses when fluently building query expressions.
---

Results can be filtered by using the ```In``` method of a field expression while composing a QueryExpression.

{% code-example %}
```csharp
//select records where the value matches one of the items in the list
IList<Purchase> purchases = db.SelectMany<Purchase>()
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
WHERE
	[dbo].[Purchase].[PaymentMethodType] IN (@P1,@P2,@P3)
;',N'@P1 varchar(20),@P2 varchar(20),@P3 varchar(20)',@P1='CreditCard',@P2='ACH',@P3='PayPal'
```
Note the above sql statement uses the string values of the enum values.  This is due to the settings provided in startup configuration that indicated the type ```PaymentMethodType``` should be persisted as it's string value (see [Enums](enums) for more detail).
{% /code-example %}