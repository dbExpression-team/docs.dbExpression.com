---
title: Avg
description: dbExpression AVG Average aggregate function
---

{% ms-docs-url label="Average" path="/functions/avg-transact-sql" /%}
{% supported-versions /%}

## Avg (Average) Aggregate Function

Use the `Avg` function to return the average of a set of values, ignoring null values.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Avg({expression})[.Distinct()]",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "types": [
                { 
                    "typeName" : "AnyNumericElement"
                }
            ]
        },
        {
            "argumentName" : "Distinct()",
            "required" : false,
            "notes" : [ "The function operates only on one unique instance of each value, regardless of how many times that value occurs." ]
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
Select the average of total purchase amount for all purchases (ignoring null values).
{% code-example %}
```csharp
double avgSales = db.SelectOne(
        db.fx.Avg(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT TOP(1)
    AVG([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

### Select Statement with Distinct
Select the average of distinct total purchase amount for all purchases (ignoring null values).
{% code-example %}
```csharp
double avgSales = db.SelectOne(
        db.fx.Avg(dbo.Purchase.TotalPurchaseAmount).Distinct()
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT TOP(1)
    AVG(DISTINCT [t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

### Order By Clause
Select the average of total purchase amount for all purchases (ignoring null values), grouped by payment
method type and ordered by the average of total purchase amount descending.
{% code-example %}
```csharp
IEnumerable<double> avgSales = db.SelectMany(
        db.fx.Avg(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .OrderBy(db.fx.Avg(dbo.Purchase.TotalPurchaseAmount).Desc())
    .Execute();
```
```sql
SELECT
    AVG([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0]
ORDER BY
    AVG([t0].[TotalPurchaseAmount]) DESC;
```
{% /code-example %}

### Having Clause
Select the average of total purchase amount for all purchases (ignoring null values), grouped by payment
method type having an average greater than 10.
{% code-example %}
```csharp
IEnumerable<double> avgSales = db.SelectMany(
        db.fx.Avg(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .GroupBy(dbo.Purchase.PaymentMethodType)
    .Having(db.fx.Avg(dbo.Purchase.TotalPurchaseAmount) > 10)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    AVG([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType]
HAVING
    AVG([t0].[TotalPurchaseAmount]) > @P1;',N'@P1 float',@P1=10
```
{% /code-example %}