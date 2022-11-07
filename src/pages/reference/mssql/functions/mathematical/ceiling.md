---
title: Ceiling
description: dbExpression Ceiling mathematical function
---

{% ms-docs-url label="Ceiling" path="/functions/ceiling-transact-sql" /%}
{% supported-versions /%}

## Ceiling Mathematical Function

Use the `Ceiling` function to returns the smallest integer value greater than or equal to the specified expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Ceiling({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true, 
            "description" : "The value to use in the ceiling calculation.",
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
Select the ceiling of total purchase amount for all purchases.
{% code-example %}
```csharp
IList<double> value = db.SelectMany(
        db.fx.Ceiling(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT
	CEILING([dbo].[Purchase].[TotalPurchaseAmount])
FROM
	[dbo].[Purchase];
```
{% /code-example %}

### Where Clause
Select all purchase ids where the ceiling of total purchase amount is less than or equal to 100.
{% code-example %}
```csharp
IList<int> value = db.SelectMany(
        dbo.Purchase.Id
    )
    .From(dbo.Purchase)
    .Where(db.fx.Ceiling(dbo.Purchase.TotalPurchaseAmount) <= 100)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Purchase].[Id]
FROM
	[dbo].[Purchase]
WHERE
	CEILING([dbo].[Purchase].[TotalPurchaseAmount]) <= @P1;',N'@P1 float',@P1=100
```
{% /code-example %}

### Order By Clause
Select the ceiling value of total purchase amount for all purchases ordered by the ceiling value descending.
{% code-example %}
```csharp
IList<double> value = db.SelectMany(
        dbo.Purchase.TotalPurchaseAmount
    )
    .From(dbo.Purchase)
    .OrderBy(db.fx.Ceiling(dbo.Purchase.TotalPurchaseAmount).Desc())
    .Execute();
```
```sql
SELECT
	[dbo].[Purchase].[TotalPurchaseAmount]
FROM
	[dbo].[Purchase]
ORDER BY
	CEILING([dbo].[Purchase].[TotalPurchaseAmount]) DESC;
```
{% /code-example %}

### Group By Clause
Select the payment method and ceiling of total purchase amount for all purchases, grouped by payment method type and ordered by the ceiling of total purchase amount.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        db.fx.Ceiling(dbo.Purchase.TotalPurchaseAmount).As("TotalPurchaseAmount")
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType,
        db.fx.Ceiling(dbo.Purchase.TotalPurchaseAmount)
    )
    .OrderBy(db.fx.Ceiling(dbo.Purchase.TotalPurchaseAmount))
    .Execute();
```
```sql
SELECT
	[dbo].[Purchase].[PaymentMethodType],
	CEILING([dbo].[Purchase].[TotalPurchaseAmount]) AS [TotalPurchaseAmount]
FROM
	[dbo].[Purchase]
GROUP BY
	[dbo].[Purchase].[PaymentMethodType],
	CEILING([dbo].[Purchase].[TotalPurchaseAmount])
ORDER BY
	CEILING([dbo].[Purchase].[TotalPurchaseAmount]) ASC;
```
{% /code-example %}

### Having Clause
Select the payment method and absolute value of total purchase amount for all purchases, grouped by payment
method type having an absolute value greater than 10 and ordered by the absolute value of total purchase amount.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        db.fx.Ceiling(dbo.Purchase.TotalPurchaseAmount).As("TotalPurchaseAmount")
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType,
        db.fx.Ceiling(dbo.Purchase.TotalPurchaseAmount)
    )
    .Having(db.fx.Ceiling(dbo.Purchase.TotalPurchaseAmount) > 10)
    .OrderBy(db.fx.Ceiling(dbo.Purchase.TotalPurchaseAmount))
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Purchase].[PaymentMethodType],
	CEILING([dbo].[Purchase].[TotalPurchaseAmount]) AS [TotalPurchaseAmount]
FROM
	[dbo].[Purchase]
GROUP BY
	[dbo].[Purchase].[PaymentMethodType],
	CEILING([dbo].[Purchase].[TotalPurchaseAmount])
HAVING
	CEILING([dbo].[Purchase].[TotalPurchaseAmount]) > @P1
ORDER BY
	CEILING([dbo].[Purchase].[TotalPurchaseAmount]) ASC;',N'@P1 float',@P1=10
```
{% /code-example %}