---
title: Sqrt
description: dbExpression SQRT "Square Root" mathematical function
---

{% ms-docs-url label="Sqrt" path="/functions/sqrt-transact-sql" /%}
{% supported-versions /%}

## Sqrt (Square Root) Mathematical Function

Use the `Sqrt` function to return the square root of the specified expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Sqrt({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true, 
			"description" : "The value to use in the square root calculation.",
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
Select the square root of a product's height (which is nullable in the database).
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.Sqrt(dbo.Product.Height)
    )
    .From(dbo.Product)
    .Execute();
```
```sql
SELECT TOP(1)
    SQRT([t0].[Height])
FROM
    [dbo].[Product] AS [t0];
```
{% /code-example %}

### Where Clause
Select the square root of a product's depth (which is nullable in the database) where the product's depth is greater
than 0 and less than 10.
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.Sqrt(dbo.Product.Depth)
    )
    .From(dbo.Product)
    .Where(dbo.Product.Depth > 0 & dbo.Product.Depth < 10)
    .Execute();
```
```sql
exec sp_executesql N'SELECT TOP(1)
    SQRT([t0].[Depth])
FROM
    [dbo].[Product] AS [t0]
WHERE
    [t0].[Depth] > @P1
    AND
    [t0].[Depth] < @P2;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=10.0
```
{% /code-example %}

### Order By Clause
Select and order by the square root of a product's depth.
{% code-example %}
```csharp
IEnumerable<Product> result = db.SelectMany<Product>()
    .From(dbo.Product)
    .OrderBy(db.fx.Sqrt(dbo.Product.Depth).Desc())
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
    SQRT([t0].[Depth]) DESC;
```
{% /code-example %}

### Group By Clause
Select product details grouped by product
category and square root of the product's depth.
{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
        dbo.Product.ProductCategoryType,
        db.fx.Sqrt(dbo.Product.Depth).As("calculated_value")
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.Sqrt(dbo.Product.Depth)
    )
    .Execute();
```
```sql
SELECT
    [t0].[ProductCategoryType],
    SQRT([t0].[Depth]) AS [calculated_value]
FROM
    [dbo].[Product] AS [t0]
GROUP BY
    [t0].[ProductCategoryType],
    SQRT([t0].[Depth]);
```
{% /code-example %}

### Having Clause
Select the ids of all products, grouped by product
category type having an square root of the product's height greater than 1.
{% code-example %}
```csharp
IEnumerable<ProductCategoryType?> results = db.SelectMany(
        dbo.Product.ProductCategoryType
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.Sqrt(dbo.Product.Height)
    )
    .Having(
        db.fx.Sqrt(dbo.Product.Height) < .5f
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
    SQRT([t0].[Height])
HAVING
    SQRT([t0].[Height]) < @P1;',N'@P1 decimal(4,1),@P2 decimal(4,1),@P3 real',@P1=0.0,@P2=1.0,@P3=0.5
```
{% /code-example %}
