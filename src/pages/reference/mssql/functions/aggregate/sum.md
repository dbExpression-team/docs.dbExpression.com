---
title: Sum
description: dbExpression SUM aggregate function
---

{% ms-docs-url label="Sum" path="/functions/sum-transact-sql" /%}
{% supported-versions /%}

## Sum Aggregate Function

Use the `Sum` function to return the sum of a set of values.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Sum({expression})[.Distinct()]",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The field expression, composite element, or function result to use in calculating the sum.",
            "types": [
                { 
                    "typeName" : "AnyNumericElement"
                }
            ]
        },
        {
            "argumentName" : "Distinct()",
            "required" : false,
            "description" : "Return the summation of unique values only."
        }        
    ]
}
```
{% /method-descriptor %}

### Returns
{% table %}
* expression type
* return type
---
* `AnyElement<byte>`
* `int`
---
* `AnyElement<byte?>`
* `int?`
---
* `AnyElement<short>`
* `int`
---
* `AnyElement<short?>`
* `int?`
---
* `AnyElement<int>`
* `int`
---
* `AnyElement<int?>`
* `int?`
---
* `AnyElement<long>`
* `long`
---
* `AnyElement<long?>`
* `long?`
---
* `AnyElement<decimal>`
* `decimal`
---
* `AnyElement<decimal?>`
* `decimal?`
---
* `AnyElement<double>`
* `double`
---
* `AnyElement<double?>`
* `double?`
---
* `AnyElement<float>`
* `float`
---
* `AnyElement<float?>`
* `float?`
{% /table %}

## Examples
### Select Statement
Select the sum of total purchase amount for all purchases.
{% code-example %}
```csharp
double minSales = db.SelectMany(
        db.fx.Sum(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT
	SUM([dbo].[Purchase].[TotalPurchaseAmount])
FROM
	[dbo].[Purchase];
```
{% /code-example %}

### Order By Clause
Select the sum of total purchase amount for all purchases ordered by the sum of total purchase amount descending.
{% code-example %}
```csharp
IEnumerable<double> minSales = db.SelectMany(
        db.fx.Sum(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .OrderBy(db.fx.Sum(dbo.Purchase.TotalPurchaseAmount).Desc())
    .Execute();
```
```sql
SELECT
	SUM([dbo].[Purchase].[TotalPurchaseAmount])
FROM
	[dbo].[Purchase]
ORDER BY
	SUM([dbo].[Purchase].[TotalPurchaseAmount]) DESC;
```
{% /code-example %}

### Having Clause
Select the sum of total purchase amount for all purchases (ignoring null values), grouped by payment
method type having an sum greater than 10 and ordered by the sum of total purchase amount.
{% code-example %}
```csharp
IEnumerable<double> minSales = db.SelectMany(
        db.fx.Sum(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .GroupBy(dbo.Purchase.PaymentMethodType)
    .Having(db.fx.Sum(dbo.Purchase.TotalPurchaseAmount) > 10)
    .OrderBy(db.fx.Sum(dbo.Purchase.TotalPurchaseAmount))
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	SUM([dbo].[Purchase].[TotalPurchaseAmount])
FROM
	[dbo].[Purchase]
GROUP BY
	[dbo].[Purchase].[PaymentMethodType]
HAVING
	SUM([dbo].[Purchase].[TotalPurchaseAmount]) > @P1
ORDER BY
	SUM([dbo].[Purchase].[TotalPurchaseAmount]) ASC;',N'@P1 float',@P1=10
```
{% /code-example %}
