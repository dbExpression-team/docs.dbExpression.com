---
title: ATan
description: dbExpression ATAN Arctangent mathematical function
---

{% ms-docs-url label="ATan" path="/functions/atan-transact-sql" /%}
{% supported-versions /%}

## ATan (Arctangent) Mathematical Function

Use the `ATan` function to return the square root of the specified expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.ATan({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true, 
            "description" : "The value to use in the arctangent calculation.",
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
Select the square root of a product's weight (which is nullable in the database).
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.ATan(dbo.Product.Weight)
    )
    .From(dbo.Product)
    .Where(dbo.Product.Weight > 0 & dbo.Product.Weight < 1)
    .Execute();
```
```sql
SELECT TOP(1)
    ATAN([t0].[Weight])
FROM
    [dbo].[Product] AS [t0]
WHERE
    [t0].[Weight] > @P1
    AND
    [t0].[Weight] < @P2;
```
{% /code-example %}

### Where Clause
Select the square root of a product's depth (which is nullable in the database) where the depth is between 0 and 1.
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.ATan(dbo.Product.Depth)
    )
    .From(dbo.Product)
    .Where(dbo.Product.Depth > 0 & dbo.Product.Depth < 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT TOP(1)
    ATAN([t0].[Depth])
FROM
    [dbo].[Product] AS [t0]
WHERE
    [t0].[Depth] > @P1
    AND
    [t0].[Depth] < @P2;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Order By Clause
Select and order by the square root of a product's depth.
{% code-example %}
```csharp
IEnumerable<Product> result = db.SelectMany<Product>()
    .From(dbo.Product)
    .OrderBy(db.fx.ATan(dbo.Product.Depth).Desc())
    .Execute();
```
```sql
ELECT
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
    ATAN([t0].[Depth]) DESC;
```
{% /code-example %}

### Group By Clause
Select product details grouped by product
category and square root of the product's depth.
{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
        dbo.Product.ProductCategoryType,
        db.fx.ATan(dbo.Product.Depth).As("calculated_value")
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.ATan(dbo.Product.Depth)
    )
    .Execute();
```
```sql
SELECT
    [t0].[ProductCategoryType],
    ATAN([t0].[Depth]) AS [calculated_value]
FROM
    [dbo].[Product] AS [t0]
GROUP BY
    [t0].[ProductCategoryType],
    ATAN([t0].[Depth]);
```
{% /code-example %}

### Having Clause
Select the ids of all products, grouped by product
category type having an arctangent of the product's depth less than .5.
{% code-example %}
```csharp
IEnumerable<ProductCategoryType?> results = db.SelectMany(
        dbo.Product.ProductCategoryType
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.ATan(dbo.Product.Depth)
    )
    .Having(
        db.fx.ATan(dbo.Product.Depth) < .5f
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[ProductCategoryType]
FROM
    [dbo].[Product] AS [t0]
GROUP BY
    [t0].[ProductCategoryType],
    ATAN([t0].[Depth])
HAVING
    ATAN([t0].[Depth]) < @P1;',N'@P1 decimal(4,1)',@P1=0.5
```
{% /code-example %}
