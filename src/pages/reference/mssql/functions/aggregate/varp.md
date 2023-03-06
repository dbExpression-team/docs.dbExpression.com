---
title: VarP
description: dbExpression VARP "Population Variance" aggregate function
---

{% ms-docs-url label="VarP" path="/functions/varp-transact-sql" /%}
{% supported-versions /%}

## Var (Population Variance) Aggregate Function

Use the `VarP` function to return the statistical variance for the population for all values in the specified expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.VarP({expression})[.Distinct()]",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The field expression, composite element, or function result to use in calculating the population variance.",
            "types": [
                { 
                    "typeName" : "AnyNumericElement"
                }
            ]
        },
        {
            "argumentName" : "Distinct()",
            "required" : false,
            "description" : "Each unique value is considered in calculating the population variance value."
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
Select the variance for the population of product shipping weights.
{% code-example %}
```csharp
float result = db.SelectOne(
        db.fx.VarP(dbo.Product.ShippingWeight)
    )
    .From(dbo.Product)
    .Execute();
```
```sql
SELECT TOP(1)
    VARP([t0].[ShippingWeight])
FROM
    [dbo].[Product] AS [t0];
```
{% /code-example %}

### Order By Clause
Select the variance for the population of product shipping weights ordered by the variance for the population of product shipping weights descending.
{% code-example %}
```csharp
float result = db.SelectOne(
        db.fx.VarP(dbo.Product.ShippingWeight)
    )
    .From(dbo.Product)
    .OrderBy(db.fx.VarP(dbo.Product.ShippingWeight).Desc())
    .Execute();
```
```sql
SELECT TOP(1)
    VARP([t0].[ShippingWeight])
FROM
    [dbo].[Product] AS [t0]
ORDER BY
    VARP([t0].[ShippingWeight]) DESC;
```
{% /code-example %}

### Having Clause
Select the variance for the population of all products, grouped by product
category type having a variance for the population greater than 1.
{% code-example %}
```csharp
IEnumerable<float> results = db.SelectMany(
        db.fx.VarP(dbo.Product.ShippingWeight)
    )
    .From(dbo.Product)
    .GroupBy(dbo.Product.ProductCategoryType)
    .Having(db.fx.VarP(dbo.Product.ShippingWeight) > 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    VARP([t0].[ShippingWeight])
FROM
    [dbo].[Product] AS [t0]
GROUP BY
    [t0].[ProductCategoryType]
HAVING
    VARP([t0].[ShippingWeight]) > @P1;',N'@P1 real',@P1=1
```
{% /code-example %}
