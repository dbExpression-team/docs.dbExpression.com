---
title: Abs
description: dbExpression ABS Absolute mathematical function
---

{% ms-docs-url label="Absolute" path="/functions/abs-transact-sql" /%}
{% supported-versions /%}

## Abs (Absolute) Mathematical Function

Use the `Abs` function to return the absolute value of the provided value.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Abs({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "types": [
                { 
                    "typeName" : "AnyNumericElement"
                }
            ]
        }
    ],
    "returns" : {
        "description" : "The positive value of the provided `expression`."
    }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the absolute value of total purchase amount for all purchases.
{% code-example %}
```csharp
IEnumerable<double> value = db.SelectMany(
        db.fx.Abs(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT
    ABS([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

### Where Clause
Select the purchase ids of any purchase where the total purchase amount isn't the same (in this example, think of a refund entered as a purchase, where the total purchase amount
would have a negative value).
{% code-example %}
```csharp
IEnumerable<int> value = db.SelectMany(
        dbo.Purchase.Id
    )
    .From(dbo.Purchase)
    .Where(
        db.fx.Abs(dbo.Purchase.TotalPurchaseAmount) != dbo.Purchase.TotalPurchaseAmount
    )
    .Execute();
```
```sql
SELECT
    [t0].[Id]
FROM
    [dbo].[Purchase] AS [t0]
WHERE
    ABS([t0].[TotalPurchaseAmount]) <> [t0].[TotalPurchaseAmount];
```
{% /code-example %}

### Order By Clause
Select the absolute value of total purchase amount for all purchases ordered by the absolute value descending.
{% code-example %}
```csharp
IEnumerable<double> value = db.SelectMany(
        db.fx.Abs(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .OrderBy(db.fx.Abs(dbo.Purchase.TotalPurchaseAmount).Desc())
    .Execute();
```
```sql
SELECT
    ABS([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0]
ORDER BY
    ABS([t0].[TotalPurchaseAmount]) DESC;
```
{% /code-example %}

### Group By Clause
Select the payment method and absolute value of total purchase amount for all purchases, grouped by payment method type and ordered by the absolute value of total purchase amount.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        db.fx.Abs(dbo.Purchase.TotalPurchaseAmount).As("TotalPurchaseAmount")
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType,
        db.fx.Abs(dbo.Purchase.TotalPurchaseAmount)
    )
    .OrderBy(db.fx.Abs(dbo.Purchase.TotalPurchaseAmount))
    .Execute();
```
```sql
SELECT
    [t0].[PaymentMethodType],
    ABS([t0].[TotalPurchaseAmount]) AS [TotalPurchaseAmount]
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType],
    ABS([t0].[TotalPurchaseAmount])
ORDER BY
    ABS([t0].[TotalPurchaseAmount]) ASC;
```
{% /code-example %}

### Having Clause
Select the payment method and absolute value of total purchase amount for all purchases, grouped by payment
method type having an absolute value greater than 10 and ordered by the absolute value of total purchase amount.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        db.fx.Abs(dbo.Purchase.TotalPurchaseAmount).As("TotalPurchaseAmount")
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType,
        db.fx.Abs(dbo.Purchase.TotalPurchaseAmount)
    )
    .Having(db.fx.Abs(dbo.Purchase.TotalPurchaseAmount) > 10)
    .OrderBy(db.fx.Abs(dbo.Purchase.TotalPurchaseAmount))
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[PaymentMethodType],
    ABS([t0].[TotalPurchaseAmount]) AS [TotalPurchaseAmount]
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType],
    ABS([t0].[TotalPurchaseAmount])
HAVING
    ABS([t0].[TotalPurchaseAmount]) > @P1
ORDER BY
    ABS([t0].[TotalPurchaseAmount]) ASC;',N'@P1 float',@P1=10
```
{% /code-example %}
