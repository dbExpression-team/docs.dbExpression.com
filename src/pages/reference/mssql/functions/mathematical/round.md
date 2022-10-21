---
title: Round
description: dbExpression ROUND mathematical function
---

{% ms-docs-url label="Round" path="/functions/round-transact-sql" /%}
{% supported-versions /%}

## Round Mathematical Function

Use the `Round` function to return a numeric value rounded to the specified length or precision.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Round({expression}, {length} [,{function}])",
    "arguments" : [
        {
            "argumentName" : "expression",
            "description" : "The value to round.",
            "required" : true,
            "types": [
                { 
                    "typeName" : "AnyNumericElement"
                }
            ]
        },
        {
            "argumentName" : "length",
            "required" : true,
            "description" : "Precision to round `expression`.",
            "types": [
                { 
                    "typeName" : "short"
                },
                { 
                    "typeName" : "AnyElement<short>"
                },
                { 
                    "typeName" : "int"
                },
                { 
                    "typeName" : "AnyElement<int>"
                },
                { 
                    "typeName" : "long"
                },
                { 
                    "typeName" : "AnyElement<long>"
                }
            ]
        },
        {
            "argumentName" : "function",
            "required" : true,
            "description" : "The type of operation to perform.",
            "types": [
                { 
                    "typeName" : "short"
                },
                { 
                    "typeName" : "AnyElement<short>"
                },
                { 
                    "typeName" : "int"
                },
                { 
                    "typeName" : "AnyElement<int>"
                },
                { 
                    "typeName" : "long"
                },
                { 
                    "typeName" : "AnyElement<long>"
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

## Syntax
```csharp
db.fx.Round({expression}, {length} [,{function}])
```

## Arguments
* `{expression}` - Any dbExpression element of a numeric data type.
* `{length}` - Precision to round {expression}, must be one of:
    * `short`
    * `int`
    * `long`
    * `AnyElement<short>`
    * `AnyElement<int>`
    * `AnyElement<long>`
* `{function}` - The type of operation to perform, must be one of:
    * `short`
     * `int`
    * `long`
    * `AnyElement<short>`
    * `AnyElement<int>`
    * `AnyElement<long>`

### Returns
{% table %}
* expression type
* return type
---
* `byte`
* `byte`
---
* `byte?`
* `byte?`
---
* `AnyElement<byte>`
* `byte`
---
* `AnyElement<byte?>`
* `byte?`
---
* `decimal`
* `decimal`
---
* `decimal?`
* `decimal?`
---
* `AnyElement<decimal>`
* `decimal`
---
* `AnyElement<decimal?>`
* `decimal?`
---
* `double`
* `double`
---
* `double?`
* `double?`
---
* `AnyElement<double>`
* `double`
---
* `AnyElement<double?>`
* `double?`
---
* `float`
* `float`
---
* `float?`
* `float?`
---
* `AnyElement<float>`
* `float`
---
* `AnyElement<float?>`
* `float?`
---
* `int`
* `int`
---
* `int?`
* `int?`
---
* `AnyElement<int>`
* `int`
---
* `AnyElement<int?>`
* `int?`
---
* `long`
* `long`
---
* `long?`
* `long?`
---
* `AnyElement<long>`
* `long`
---
* `AnyElement<long?>`
* `long?`
---
* `short`
* `short`
---
* `short?`
* `short?`
---
* `AnyElement<short>`
* `short`
---
* `AnyElement<short?>`
* `short?`
{% /table %}

## Examples
### Select Statement
Round of total purchase amount for all purchases.
{% code-example %}
```csharp
IList<double> value = db.SelectMany(
        db.fx.Round(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT
	ROUND([dbo].[Purchase].[TotalPurchaseAmount])
FROM
	[dbo].[Purchase];
```
{% /code-example %}

### Where Clause
Select all purchase ids where the rounded value is equal to 100.
{% code-example %}
```csharp
IList<int> value = db.SelectMany(
        dbo.Purchase.Id
    )
    .From(dbo.Purchase)
    .Where(db.fx.Round(dbo.Purchase.TotalPurchaseAmount, -1) == 100)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Purchase].[Id]
FROM
	[dbo].[Purchase]
WHERE
	ROUND([dbo].[Purchase].[TotalPurchaseAmount], @P1) = @P2;',N'@P1 int,@P2 float',@P1=-1,@P2=100
```
{% /code-example %}

### Order By Clause
Select the floor value of total purchase amount for all purchases ordered by the floor value descending.
{% code-example %}
```csharp
IList<double> value = db.SelectMany(
        dbo.Purchase.TotalPurchaseAmount
    )
    .From(dbo.Purchase)
    .OrderBy(db.fx.Round(dbo.Purchase.TotalPurchaseAmount, 1).Desc)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Purchase].[TotalPurchaseAmount]
FROM
	[dbo].[Purchase]
ORDER BY
	ROUND([dbo].[Purchase].[TotalPurchaseAmount], @P1) DESC;',N'@P1 int',@P1=1
```
{% /code-example %}

### Group By Clause
Select the payment method and floor of total purchase amount for all purchases, grouped by payment method type and ordered by the floor of total purchase amount.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        db.fx.Round(dbo.Purchase.TotalPurchaseAmount, 2).As("TotalPurchaseAmount")
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType,
        db.fx.Round(dbo.Purchase.TotalPurchaseAmount, 2)
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Purchase].[PaymentMethodType],
	ROUND([dbo].[Purchase].[TotalPurchaseAmount], @P1) AS [TotalPurchaseAmount]
FROM
	[dbo].[Purchase]
GROUP BY
	[dbo].[Purchase].[PaymentMethodType],
	ROUND([dbo].[Purchase].[TotalPurchaseAmount], @P1);',N'@P1 int',@P1=2
```
{% /code-example %}

### Having Clause
Select the payment method and absolute value of total purchase amount for all purchases, grouped by payment
method type having an absolute value greater than 10 and ordered by the absolute value of total purchase amount.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        dbo.Purchase.TotalPurchaseAmount
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType,
        dbo.Purchase.TotalPurchaseAmount
    )
    .Having(db.fx.Round(dbo.Purchase.TotalPurchaseAmount, 2) > 10)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Purchase].[PaymentMethodType],
	[dbo].[Purchase].[TotalPurchaseAmount]
FROM
	[dbo].[Purchase]
GROUP BY
	[dbo].[Purchase].[PaymentMethodType],
	[dbo].[Purchase].[TotalPurchaseAmount]
HAVING
	ROUND([dbo].[Purchase].[TotalPurchaseAmount], @P1) > @P2;',N'@P1 int,@P2 float',@P1=2,@P2=10
```
{% /code-example %}