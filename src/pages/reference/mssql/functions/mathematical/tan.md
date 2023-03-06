---
title: Tan
description: dbExpression TAN Tangent mathematical function
---

{% ms-docs-url label="Tan" path="/functions/tan-transact-sql" /%}
{% supported-versions /%}

## Tan (Tangent) Mathematical Function

Use the `Tan` function to return the tangent of the specified expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Tan({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true, 
			"description" : "The value to use in the tangent calculation.",
            "types": [
                { 
                    "typeName" : "AnyNumericElement"
                }
            ]
        }
    ],
	"returns" : {
		"typeName" : "float"
	}
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the tangent of a product's weight (which is nullable in the database).
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.Tan(dbo.Product.Weight)
    )
    .From(dbo.Product)
    .Execute();
```
```sql
SELECT TOP(1)
    TAN([t0].[Weight])
FROM
    [dbo].[Product] AS [t0];
```
{% /code-example %}

### Where Clause
Select the tangent of a product's depth (which is nullable in the database).
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.Tan(dbo.Product.Depth)
    )
    .From(dbo.Product)
    .Execute();
```
```sql
SELECT TOP(1)
    TAN([t0].[Depth])
FROM
    [dbo].[Product] AS [t0];
```
{% /code-example %}

### Order By Clause
Select and order by the tangent of a product's depth.
{% code-example %}
```csharp
IEnumerable<Product> result = db.SelectMany<Product>()
    .From(dbo.Product)
    .OrderBy(db.fx.Tan(dbo.Product.Depth).Desc())
    .Execute();
```
```sql
SELECT
    [t0].[Id],
    [t0].[ProductCategoryType],
    [t0].[Name],
    [t0].[Description],
    [t0].[ListPrice],
    [t0].[Price],
    [t0].[Quantity],
    [t0].[Image],
    [t0].[Height],
    [t0].[Width],
    [t0].[Depth],
    [t0].[Weight],
    [t0].[ShippingWeight],
    [t0].[ValidStartTimeOfDayForPurchase],
    [t0].[ValidEndTimeOfDayForPurchase],
    [t0].[DateCreated],
    [t0].[DateUpdated]
FROM
    [dbo].[Product] AS [t0]
ORDER BY
    TAN([t0].[Depth]) DESC;
```
{% /code-example %}

### Group By Clause
Select product details grouped by product
category and the tangent of the product's depth.
{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
        dbo.Product.ProductCategoryType,
        db.fx.Tan(dbo.Product.Depth).As("calculated_value")
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.Tan(dbo.Product.Depth)
    )
    .Execute();
```
```sql
SELECT
    [t0].[ProductCategoryType],
    TAN([t0].[Depth]) AS [calculated_value]
FROM
    [dbo].[Product] AS [t0]
GROUP BY
    [t0].[ProductCategoryType],
    TAN([t0].[Depth]);
```
{% /code-example %}

### Having Clause
Select the ids of all products, grouped by product
category type having a tangent of the product's height 
greater than the product's width.
{% code-example %}
```csharp
IEnumerable<ProductCategoryType?> results = db.SelectMany(
        dbo.Product.ProductCategoryType
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.Tan(dbo.Product.Height),
        dbo.Product.Width
    )
    .Having(
        db.fx.Tan(dbo.Product.Height) > dbo.Product.Width
    )
    .Execute();
```
```sql
SELECT
    [t0].[ProductCategoryType]
FROM
    [dbo].[Product] AS [t0]
GROUP BY
    [t0].[ProductCategoryType],
    TAN([t0].[Height]),
    [t0].[Width]
HAVING
    TAN([t0].[Height]) > [t0].[Width];
```
{% /code-example %}
