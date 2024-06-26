---
title: Floor
description: dbExpression FLOOR mathematical function
---

{% ms-docs-url label="Floor" path="/functions/floor-transact-sql" /%}
{% supported-versions /%}

## Floor Mathematical Function

Use the `Floor` function to returns the largest integer value less than or equal to the specified expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Floor({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true, 
            "description" : "The value to use in the floor calculation.",
            "types": [
                { 
                    "typeName" : "AnyNumericElement"
                }
            ]
        }
    ],
	"returns" : {
		"description" : "The same type as `expression`."
	}
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the floor of total purchase amount for all purchases.
{% code-example %}
```csharp
IEnumerable<double> value = db.SelectMany(
        db.fx.Floor(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT
    FLOOR([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

### Where Clause
Select all purchase ids where the floor of total purchase amount is less than or equal to 100.
{% code-example %}
```csharp
IEnumerable<int> value = db.SelectMany(
        dbo.Purchase.Id
    )
    .From(dbo.Purchase)
    .Where(db.fx.Floor(dbo.Purchase.TotalPurchaseAmount) <= 100)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id]
FROM
    [dbo].[Purchase] AS [t0]
WHERE
    FLOOR([t0].[TotalPurchaseAmount]) <= @P1;',N'@P1 float',@P1=100
```
{% /code-example %}

### Order By Clause
Select the floor value of total purchase amount for all purchases ordered by the floor value descending.
{% code-example %}
```csharp
IEnumerable<double> value = db.SelectMany(
        dbo.Purchase.TotalPurchaseAmount
    )
    .From(dbo.Purchase)
    .OrderBy(db.fx.Floor(dbo.Purchase.TotalPurchaseAmount).Desc())
    .Execute();
```
```sql
SELECT
    [t0].[TotalPurchaseAmount]
FROM
    [dbo].[Purchase] AS [t0]
ORDER BY
    FLOOR([t0].[TotalPurchaseAmount]) DESC;
```
{% /code-example %}

### Group By Clause
Select the payment method and floor of total purchase amount for all purchases, grouped by payment method type and ordered by the floor of total purchase amount.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        db.fx.Floor(dbo.Purchase.TotalPurchaseAmount).As("TotalPurchaseAmount")
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType,
        db.fx.Floor(dbo.Purchase.TotalPurchaseAmount)
    )
    .OrderBy(db.fx.Floor(dbo.Purchase.TotalPurchaseAmount))
    .Execute();
```
```sql
SELECT
    [t0].[PaymentMethodType],
    FLOOR([t0].[TotalPurchaseAmount]) AS [TotalPurchaseAmount]
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType],
    FLOOR([t0].[TotalPurchaseAmount])
ORDER BY
    FLOOR([t0].[TotalPurchaseAmount]) ASC;
```
{% /code-example %}

### Having Clause
Select the payment method and absolute value of total purchase amount for all purchases, grouped by payment
method type having an absolute value greater than 10 and ordered by the absolute value of total purchase amount.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        db.fx.Floor(dbo.Purchase.TotalPurchaseAmount).As("TotalPurchaseAmount")
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType,
        db.fx.Floor(dbo.Purchase.TotalPurchaseAmount)
    )
    .Having(db.fx.Floor(dbo.Purchase.TotalPurchaseAmount) > 10)
    .OrderBy(db.fx.Floor(dbo.Purchase.TotalPurchaseAmount))
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[PaymentMethodType],
    FLOOR([t0].[TotalPurchaseAmount]) AS [TotalPurchaseAmount]
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType],
    FLOOR([t0].[TotalPurchaseAmount])
HAVING
    FLOOR([t0].[TotalPurchaseAmount]) > @P1
ORDER BY
    FLOOR([t0].[TotalPurchaseAmount]) ASC;',N'@P1 float',@P1=10
```
{% /code-example %}