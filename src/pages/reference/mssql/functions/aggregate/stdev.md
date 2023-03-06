---
title: StDev
description: dbExpression STDEV "Standard Deviation" aggregate function
---

{% ms-docs-url label="StDev" path="/functions/stdevp-transact-sql" /%}
{% supported-versions /%}

## StDev (Standard Deviation) Aggregate Function

Use the `StDev` function to return the statistical standard deviation for all values in the specified expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.StDev({expression})[.Distinct()]",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The field expression, composite element, or function result to use in calculating the standard deviation.",
            "types": [
                { 
                    "typeName" : "AnyNumericElement"
                }
            ]
        },
        {
            "argumentName" : "Distinct()",
            "required" : false,
            "description" : "Each unique value is considered while calculating the standard deviation for the population."
        }        
    ],
    "returns" : {
        "typeName": "float"
    }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the standard deviation of product shipping weights.
{% code-example %}
```csharp
float result = db.SelectOne(
        db.fx.StDev(dbo.Product.ShippingWeight)
    )
    .From(dbo.Product)
    .Execute();
```
```sql
SELECT TOP(1)
    STDEV([t0].[ShippingWeight])
FROM
    [dbo].[Product] AS [t0];
```
{% /code-example %}

### Order By Clause
Select the standard deviation of product shipping weights ordered by the standard deviation of product shipping weights descending.
{% code-example %}
```csharp
float result = db.SelectOne(
        db.fx.StDev(dbo.Product.ShippingWeight)
    )
    .From(dbo.Product)
    .OrderBy(db.fx.StDev(dbo.Product.ShippingWeight).Desc())
    .Execute();
```
```sql
SELECT TOP(1)
    STDEV([t0].[ShippingWeight])
FROM
    [dbo].[Product] AS [t0]
ORDER BY
    STDEV([t0].[ShippingWeight]) DESC;
```
{% /code-example %}

### Having Clause
Select the product categories of all products, grouped by product
category type having standard deviation greater than 1.
{% code-example %}
```csharp
IEnumerable<ProductCategoryType?> results = db.SelectMany(
        dbo.Product.ProductCategoryType
    )
    .From(dbo.Product)
    .GroupBy(dbo.Product.ProductCategoryType)
    .Having(db.fx.StDev(dbo.Product.ShippingWeight) > 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[ProductCategoryType]
FROM
    [dbo].[Product] AS [t0]
GROUP BY
    [t0].[ProductCategoryType]
HAVING
    STDEV([t0].[ShippingWeight]) > @P1;',N'@P1 real',@P1=1
```
{% /code-example %}
