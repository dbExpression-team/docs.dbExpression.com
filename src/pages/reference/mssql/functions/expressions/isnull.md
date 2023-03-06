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
IEnumerable<DateTime?> result = db.SelectMany(
        db.fx.IsNull(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate).As("latest_date")
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT
    ISNULL([t0].[ExpectedDeliveryDate], [t0].[ShipDate]) AS [latest_date]
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

Select the expected delivery date and if it is null return the current date.
{% code-example %}
```csharp
IEnumerable<DateTime> result = db.SelectMany(
        db.fx.IsNull(dbo.Purchase.ExpectedDeliveryDate, DateTime.UtcNow).As("latest_date")
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    ISNULL([t0].[ExpectedDeliveryDate], @P1) AS [latest_date]
FROM
    [dbo].[Purchase] AS [t0];',N'@P1 datetime',@P1='2022-09-26 16:51:30.997'
```
{% /code-example %}

### Where Clause
Select purchases where relevant dates or over a week ago.
{% code-example %}
```csharp
IEnumerable<Purchase> purchases = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .Where(
        db.fx.IsNull(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate) < DateTime.UtcNow.AddDays(-7)
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
    ISNULL([t0].[ExpectedDeliveryDate], [t0].[ShipDate]) < @P1;',N'@P1 datetime',@P1='2022-09-20 16:44:07.717'
```
{% /code-example %}

### Order By Clause
Select a list of purchases, ordered by a relevant date.
{% code-example %}
```csharp
IEnumerable<Purchase> products = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .OrderBy(db.fx.IsNull(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate).Desc())
    .Execute();
```
```sql
SELECT
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
    ISNULL([t0].[ExpectedDeliveryDate], [t0].[ShipDate]) DESC;
```
{% /code-example %}

### Group By Clause
Select the cast of all product quantities, grouped by product category
type and cast of product quantity.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
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
    [t0].[PaymentMethodType],
    ISNULL([t0].[ExpectedDeliveryDate], [t0].[ShipDate]) AS [relevant_date]
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType],
    ISNULL([t0].[ExpectedDeliveryDate], [t0].[ShipDate]);
```
{% /code-example %}

### Having Clause
Select a list of payment methods and a 'relevant date(s)' where no activity has taken place for more than 7 days.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
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
    [t0].[PaymentMethodType],
    ISNULL([t0].[ExpectedDeliveryDate], [t0].[ShipDate]) AS [relevant_date]
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType],
    [t0].[ExpectedDeliveryDate],
    [t0].[ShipDate]
HAVING
    ISNULL([t0].[ExpectedDeliveryDate], [t0].[ShipDate]) < @P1;',N'@P1 datetime',@P1='2022-09-19 00:00:00'
```
{% /code-example %}


