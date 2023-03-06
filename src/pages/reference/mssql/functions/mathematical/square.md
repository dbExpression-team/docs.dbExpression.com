---
title: Square
description: dbExpression SQUARE mathematical function
---

{% ms-docs-url label="Square" path="/functions/square-transact-sql" /%}
{% supported-versions /%}

## Square Mathematical Function

Use the `Square` function to return the square of the specified expression (value raised to the power of 2 `n^2`).

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Square({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true, 
			"description" : "The value to square.",
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
Select the square of a product's height (which is nullable in the database).
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.Square(dbo.Product.Height)
    )
    .From(dbo.Product)
    .Execute();
```
```sql
exec sp_executesql N'SELECT TOP(1)
    SQUARE([t0].[Height])
FROM
    [dbo].[Product] AS [t0];',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Where Clause
Select a list of product ids where the square of the product's depth is greater than 0 and less than 1.
{% code-example %}
```csharp
IEnumerable<int> results = db.SelectMany(
        dbo.Product.Id
    )
    .From(dbo.Product)
    .Where(db.fx.Square(dbo.Product.Depth) > 0 & db.fx.Square(dbo.Product.Depth) < 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id]
FROM
    [dbo].[Product] AS [t0]
WHERE
    SQUARE([t0].[Depth]) > @P1
    AND
    SQUARE([t0].[Depth]) < @P2;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Order By Clause
Select and order by the square of a product's depth.
{% code-example %}
```csharp
IEnumerable<Product> result = db.SelectMany<Product>()
    .From(dbo.Product)
    .OrderBy(db.fx.Square(dbo.Product.Depth).Desc())
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
    SQUARE([t0].[Depth]) DESC;
```
{% /code-example %}

### Group By Clause
Select product details grouped by product
category and square of the product's depth.
{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
        dbo.Product.ProductCategoryType,
        db.fx.Square(dbo.Product.Depth).As("calculated_value")
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.Square(dbo.Product.Depth)
    )
    .Execute();
```
```sql
SELECT
    [t0].[ProductCategoryType],
    SQUARE([t0].[Depth]) AS [calculated_value]
FROM
    [dbo].[Product] AS [t0]
GROUP BY
    [t0].[ProductCategoryType],
    SQUARE([t0].[Depth]);
```
{% /code-example %}

### Having Clause
Select the ids of all products, grouped by product
category type having an square of the product's height greater than 1.
{% code-example %}
```csharp
IEnumerable<ProductCategoryType?> results = db.SelectMany(
        dbo.Product.ProductCategoryType
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.Square(dbo.Product.Height)
    )
    .Having(
        db.fx.Square(dbo.Product.Height) < .5f
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
    SQUARE([t0].[Height])
HAVING
    SQUARE([t0].[Height]) < @P1;',N'@P1 decimal(4,1),@P2 decimal(4,1),@P3 real',@P1=0.0,@P2=1.0,@P3=0.5
```
{% /code-example %}
