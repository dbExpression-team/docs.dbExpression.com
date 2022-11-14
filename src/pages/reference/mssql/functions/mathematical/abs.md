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
	ABS([dbo].[Purchase].[TotalPurchaseAmount])
FROM
	[dbo].[Purchase];
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
	[dbo].[Purchase].[Id]
FROM
	[dbo].[Purchase]
WHERE
	ABS([dbo].[Purchase].[TotalPurchaseAmount]) <> [dbo].[Purchase].[TotalPurchaseAmount];
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
	ABS([dbo].[Purchase].[TotalPurchaseAmount])
FROM
	[dbo].[Purchase]
ORDER BY
	ABS([dbo].[Purchase].[TotalPurchaseAmount]) DESC;
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
	[dbo].[Purchase].[PaymentMethodType],
	ABS([dbo].[Purchase].[TotalPurchaseAmount]) AS [TotalPurchaseAmount]
FROM
	[dbo].[Purchase]
GROUP BY
	[dbo].[Purchase].[PaymentMethodType],
	ABS([dbo].[Purchase].[TotalPurchaseAmount])
ORDER BY
	ABS([dbo].[Purchase].[TotalPurchaseAmount]) ASC;
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
	[dbo].[Purchase].[PaymentMethodType],
	ABS([dbo].[Purchase].[TotalPurchaseAmount]) AS [TotalPurchaseAmount]
FROM
	[dbo].[Purchase]
GROUP BY
	[dbo].[Purchase].[PaymentMethodType],
	ABS([dbo].[Purchase].[TotalPurchaseAmount])
HAVING
	ABS([dbo].[Purchase].[TotalPurchaseAmount]) > @P1
ORDER BY
	ABS([dbo].[Purchase].[TotalPurchaseAmount]) ASC;',N'@P1 float',@P1=10
```
{% /code-example %}
