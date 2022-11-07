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
	SQUARE([dbo].[Product].[Height])
FROM
	[dbo].[Product]
WHERE
	[dbo].[Product].[Height] > @P1
	AND
	[dbo].[Product].[Height] < @P2;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Where Clause
Select a list of product ids where the square of the product's depth is greater than 0 and less than 1.
{% code-example %}
```csharp
IList<int> results = db.SelectMany(
        dbo.Product.Id
    )
    .From(dbo.Product)
    .Where(db.fx.Square(dbo.Product.Depth) > 0 & db.fx.Square(dbo.Product.Depth) < 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT TOP(1)
	[dbo].[Product].[Id]
FROM
	[dbo].[Product]
WHERE
	[dbo].[Product].[Depth] > @P1
	AND
	[dbo].[Product].[Depth] < @P2;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Order By Clause
Select and order by the square of a product's depth.
{% code-example %}
```csharp
IList<Product> result = db.SelectMany<Product>()
    .From(dbo.Product)
    .OrderBy(db.fx.Square(dbo.Product.Depth).Desc())
    .Execute();
```
```sql
SELECT
	[dbo].[Product].[Id],
	[dbo].[Product].[ProductCategoryType],
	[dbo].[Product].[Name],
	[dbo].[Product].[Description],
	[dbo].[Product].[ListPrice],
	[dbo].[Product].[Price],
	[dbo].[Product].[Quantity],
	[dbo].[Product].[Image],
	[dbo].[Product].[Height],
	[dbo].[Product].[Width],
	[dbo].[Product].[Depth],
	[dbo].[Product].[Height],
	[dbo].[Product].[ShippingHeight],
	[dbo].[Product].[ValidStartTimeOfDayForPurchase],
	[dbo].[Product].[ValidEndTimeOfDayForPurchase],
	[dbo].[Product].[DateCreated],
	[dbo].[Product].[DateUpdated]
FROM
	[dbo].[Product]
ORDER BY
	SQUARE([dbo].[Product].[Depth]) DESC;
```
{% /code-example %}

### Group By Clause
Select product details grouped by product
category and square of the product's depth.
{% code-example %}
```csharp
IList<dynamic> results = db.SelectMany(
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
	[dbo].[Product].[ProductCategoryType],
	SQUARE([dbo].[Product].[Depth]) AS [calculated_value]
FROM
	[dbo].[Product]
GROUP BY
	[dbo].[Product].[ProductCategoryType],
	SQUARE([dbo].[Product].[Depth]);
```
{% /code-example %}

### Having Clause
Select the ids of all products, grouped by product
category type having an square of the product's height greater than 1.
{% code-example %}
```csharp
IList<ProductCategoryType?> results = db.SelectMany(
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
	[dbo].[Product].[ProductCategoryType]
FROM
	[dbo].[Product]
GROUP BY
	[dbo].[Product].[ProductCategoryType],
	SQUARE([dbo].[Product].[Height])
HAVING
	SQUARE([dbo].[Product].[Height]) < @P3;',N'@P1 decimal(4,1),@P2 decimal(4,1),@P3 real',@P1=0.0,@P2=1.0,@P3=0.5
```
{% /code-example %}
