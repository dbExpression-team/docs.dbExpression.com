---
title: Var
description: dbExpression VAR Variance aggregate function
---

{% ms-docs-url label="Var" path="/functions/var-transact-sql" /%}
{% supported-versions /%}

## Var (Variance) Aggregate Function

Use the `Var` function to return the statistical variance for all values in the specified expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Var({expression})[.Distinct()]",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The field expression, composite element, or function result to use in calculating the variance.",
            "types": [
                { 
                    "typeName" : "AnyNumericElement"
                }
            ]
        },
        {
            "argumentName" : "Distinct()",
            "required" : false,
            "description" : "Each unique value is considered in calculating the variance value."
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
Select the variance of product shipping weights.
{% code-example %}
```csharp
float result = db.SelectOne(
        db.fx.Var(dbo.Product.ShippingWeight)
    )
    .From(dbo.Product)
    .Execute();
```
```sql
SELECT TOP(1)
    VAR([t0].[ShippingWeight])
FROM
    [dbo].[Product] AS [t0];
```
{% /code-example %}

### Order By Clause
Select the variance of product shipping weights ordered by the variance of product shipping weights descending.
{% code-example %}
```csharp
float result = db.SelectOne(
        db.fx.Var(dbo.Product.ShippingWeight)
    )
    .From(dbo.Product)
    .OrderBy(db.fx.Var(dbo.Product.ShippingWeight).Desc())
    .Execute();
```
```sql
SELECT TOP(1)
    VAR([t0].[ShippingWeight])
FROM
    [dbo].[Product] AS [t0]
ORDER BY
    VAR([t0].[ShippingWeight]) DESC;
```
{% /code-example %}

### Having Clause
Select the product categories of all products, grouped by product
category type having an variance greater than 1.
{% code-example %}
```csharp
IEnumerable<ProductCategoryType?> results = db.SelectMany(
        dbo.Product.ProductCategoryType
    )
    .From(dbo.Product)
    .GroupBy(dbo.Product.ProductCategoryType)
    .Having(db.fx.Var(dbo.Product.ShippingWeight) > 1)
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
    VAR([t0].[ShippingWeight]) > @P1;',N'@P1 real',@P1=1
```
{% /code-example %}
