---
title: IsNull
description: dbExpression ISNULL expression function
---

{% ms-docs-url label="IsNull" path="/functions/isnull-transact-sql" /%}
{% supported-versions /%}

## IsNull Expression

Use the `IsNull` function to return the first non-null item from two expressions.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.IsNull({first_expression}, {second_expression})",
    "arguments" : [
        {
            "argumentName" : "first_expression",
            "required" : true,
            "description" : "The first value to evaluate for null.",
            "types": [
                { 
                    "typeName" : "AnyElement"
                }
            ]
        },
        {
            "argumentName" : "second_expression",
            "required" : true,
            "description" : "The second value to evaluate for null.",
            "types": [
                { 
                    "typeName" : "AnyElement",
					"description" : "Must be the same type as `first_expression`."
                },
				{ 
                    "typeName" : "IComparable",
					"description" : "Must be the equivalent .NET type as `first_expression`, i.e. `first_expression` is  `AnyElement<int> and `second_expression` is int."
                }
            ]
        }           
    ],
    "returns" : { 
        "description" : "A value that is the same type as `first_expression`."
    }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the expected delivery date, else the ship date (both can be null, so the return type is `DateTime?`).
{% code-example %}
```csharp
IList<DateTime?> result = db.SelectMany(
        db.fx.IsNull(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate).As("latest_date")
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT
	ISNULL([dbo].[Purchase].[ExpectedDeliveryDate], [dbo].[Purchase].[ShipDate]) AS [latest_date]
FROM
	[dbo].[Purchase];
```
{% /code-example %}

Select the expected delivery date and if it is null return the current date.
{% code-example %}
```csharp
IList<DateTime> result = db.SelectMany(
        db.fx.IsNull(dbo.Purchase.ExpectedDeliveryDate, DateTime.UtcNow).As("latest_date")
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	ISNULL([dbo].[Purchase].[ExpectedDeliveryDate], @P1) AS [latest_date]
FROM
	[dbo].[Purchase];',N'@P1 datetime',@P1='2022-09-26 16:51:30.997'
```
{% /code-example %}

### Where Clause
Select purchases where relevant dates or over a week ago.
{% code-example %}
```csharp
IList<Purchase> purchases = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .Where(
        db.fx.IsNull(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate) < DateTime.UtcNow.AddDays(-7)
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
	ISNULL([dbo].[Purchase].[ExpectedDeliveryDate], [dbo].[Purchase].[ShipDate]) < @P1;',N'@P1 datetime',@P1='2022-09-20 16:44:07.717'
```
{% /code-example %}

### Order By Clause
Select a list of purchases, ordered by a relevant date.
{% code-example %}
```csharp
IList<Purchase> products = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .OrderBy(db.fx.IsNull(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate).Desc)
    .Execute();
```
```sql
SELECT
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
	ISNULL([dbo].[Purchase].[ExpectedDeliveryDate], [dbo].[Purchase].[ShipDate]) DESC;
```
{% /code-example %}

### Group By Clause
Select the cast of all product quantities, grouped by product category
type and cast of product quantity.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        db.fx.IsNull(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate).As("relevant_date")
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType,
        db.fx.IsNull(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate)
    )
    .Execute();
```
```sql
SELECT
	[dbo].[Purchase].[PaymentMethodType],
	ISNULL([dbo].[Purchase].[ExpectedDeliveryDate], [dbo].[Purchase].[ShipDate]) AS [relevant_date]
FROM
	[dbo].[Purchase]
GROUP BY
	[dbo].[Purchase].[PaymentMethodType],
	ISNULL([dbo].[Purchase].[ExpectedDeliveryDate], [dbo].[Purchase].[ShipDate]);
```
{% /code-example %}

### Having Clause
Select a list of payment methods and a 'relevant date(s)' where no activity has taken place for more than 7 days.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        db.fx.IsNull(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate).As("relevant_date")
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType, 
        dbo.Purchase.ExpectedDeliveryDate, 
        dbo.Purchase.ShipDate
    )
    .Having(
        db.fx.IsNull(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate) < DateTime.UtcNow.Date.AddDays(-7)
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Purchase].[PaymentMethodType],
	ISNULL([dbo].[Purchase].[ExpectedDeliveryDate], [dbo].[Purchase].[ShipDate]) AS [relevant_date]
FROM
	[dbo].[Purchase]
GROUP BY
	[dbo].[Purchase].[PaymentMethodType],
	[dbo].[Purchase].[ExpectedDeliveryDate],
	[dbo].[Purchase].[ShipDate]
HAVING
	ISNULL([dbo].[Purchase].[ExpectedDeliveryDate], [dbo].[Purchase].[ShipDate]) < @P1;',N'@P1 datetime',@P1='2022-09-19 00:00:00'
```
{% /code-example %}


