---
title: Sin
description: dbExpression SIN Sine mathematical function
---

{% ms-docs-url label="Sin" path="/functions/sin-transact-sql" /%}
{% supported-versions /%}

## Sin (Sine) Mathematical Function

Use the `Sin` function to return the sine of the specified expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Sin({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true, 
			"description" : "The value to use in the sine calculation.",
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
Select the sine of a product's weight (which is nullable in the database).
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.Sin(dbo.Product.Weight)
    )
    .From(dbo.Product)
    .Execute();
```
```sql
SELECT TOP(1)
	SIN([dbo].[Product].[Weight])
FROM
	[dbo].[Product];
```
{% /code-example %}

### Where Clause
Select the sine of a product's depth (which is nullable in the database) where the depth is greater than 0 and less than 1.
{% code-example %}
```csharp
IList<float> result = db.SelectMany(
        db.fx.Sin(dbo.Product.Depth)
    )
    .From(dbo.Product)
    .Where(dbo.Product.Depth > 0 & dbo.Product.Depth < 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	SIN([dbo].[Product].[Depth])
FROM
	[dbo].[Product]
WHERE
	[dbo].[Product].[Depth] > @P1
	AND
	[dbo].[Product].[Depth] < @P2;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Order By Clause
Select and order by the sine of a product's depth.
{% code-example %}
```csharp
IList<Product> result = db.SelectMany<Product>()
    .From(dbo.Product)
    .OrderBy(db.fx.Sin(dbo.Product.Depth).Desc())
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
	[dbo].[Product].[Weight],
	[dbo].[Product].[ShippingWeight],
	[dbo].[Product].[ValidStartTimeOfDayForPurchase],
	[dbo].[Product].[ValidEndTimeOfDayForPurchase],
	[dbo].[Product].[DateCreated],
	[dbo].[Product].[DateUpdated]
FROM
	[dbo].[Product]
ORDER BY
	SIN([dbo].[Product].[Depth]) DESC;
```
{% /code-example %}

### Group By Clause
Select product details grouped by product
category and sine of the product's depth.
{% code-example %}
```csharp
IList<dynamic> results = db.SelectMany(
        dbo.Product.ProductCategoryType,
        db.fx.Sin(dbo.Product.Depth).As("calculated_value")
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.Sin(dbo.Product.Depth)
    )
    .Execute();
```
```sql
SELECT
	[dbo].[Product].[ProductCategoryType],
	SIN([dbo].[Product].[Depth]) AS [calculated_value]
FROM
	[dbo].[Product]
WHERE
	[dbo].[Product].[Depth] > @P1
	AND
	[dbo].[Product].[Depth] < @P2
GROUP BY
	[dbo].[Product].[ProductCategoryType],
	SIN([dbo].[Product].[Depth]);
```
{% /code-example %}

### Having Clause
Select the ids of all products, grouped by product
category type having an sine of the product's height greater than 1.
{% code-example %}
```csharp
IList<ProductCategoryType?> results = db.SelectMany(
        dbo.Product.ProductCategoryType
    )
    .From(dbo.Product)
    .Where(dbo.Product.Height > 0 & dbo.Product.Height < 1)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.Sin(dbo.Product.Height)
    )
    .Having(
        db.fx.Sin(dbo.Product.Height) < .5f
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Product].[ProductCategoryType]
FROM
	[dbo].[Product]
WHERE
	[dbo].[Product].[Height] > @P1
	AND
	[dbo].[Product].[Height] < @P2
GROUP BY
	[dbo].[Product].[ProductCategoryType],
	SIN([dbo].[Product].[Height])
HAVING
	SIN([dbo].[Product].[Height]) < @P3;',N'@P1 decimal(4,1),@P2 decimal(4,1),@P3 real',@P1=0.0,@P2=1.0,@P3=0.5
```
{% /code-example %}
