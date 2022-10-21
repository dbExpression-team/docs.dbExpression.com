---
title: ASin
description: dbExpression ASIN Arcsine mathematical function
---

{% ms-docs-url label="ASin" path="/functions/asin-transact-sql" /%}
{% supported-versions /%}

## ASin (Arcsine) Mathematical Function

Use the `ASin` function to return the arcsine of the specified expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.ASin({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true, 
			"description" : "The value to use in the arcsine calculation.",
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
Select the arcsine of a product's weight (which is nullable in the database).  Note the
where clause on this statement to ensure successful execution.
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.ASin(dbo.Product.Weight)
    )
    .From(dbo.Product)
    .Where(dbo.Product.Weight > 0 & dbo.Product.Weight < 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT TOP(1)
	ASIN([dbo].[Product].[Weight])
FROM
	[dbo].[Product]
WHERE
	[dbo].[Product].[Weight] > @P1
	AND
	[dbo].[Product].[Weight] < @P2;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Where Clause
Select the arcsine of a product's depth (which is nullable in the database).  Note the
where clause on this statement to ensure successful execution.
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.ASin(dbo.Product.Depth)
    )
    .From(dbo.Product)
    .Where(dbo.Product.Depth > 0 & dbo.Product.Depth < 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT TOP(1)
	ASIN([dbo].[Product].[Depth])
FROM
	[dbo].[Product]
WHERE
	[dbo].[Product].[Depth] > @P1
	AND
	[dbo].[Product].[Depth] < @P2;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Order By Clause
Select and order by the arcsine of a product's depth.
{% code-example %}
```csharp
IList<Product> result = db.SelectMany<Product>()
    .From(dbo.Product)
    .Where(dbo.Product.Depth > 0 & dbo.Product.Depth < 1)
    .OrderBy(db.fx.ASin(dbo.Product.Depth).Desc)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
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
WHERE
	[dbo].[Product].[Depth] > @P1
	AND
	[dbo].[Product].[Depth] < @P2
ORDER BY
	ASIN([dbo].[Product].[Depth]) DESC;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Group By Clause
Select product details grouped by product
category and arcsine of the product's depth.
{% code-example %}
```csharp
IList<dynamic> results = db.SelectMany(
        dbo.Product.ProductCategoryType,
        db.fx.ASin(dbo.Product.Depth).As("calculated_value")
    )
    .From(dbo.Product)
    .Where(dbo.Product.Depth > 0 & dbo.Product.Depth < 1)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.ASin(dbo.Product.Depth)
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Product].[ProductCategoryType],
	ASIN([dbo].[Product].[Depth]) AS [calculated_value]
FROM
	[dbo].[Product]
WHERE
	[dbo].[Product].[Depth] > @P1
	AND
	[dbo].[Product].[Depth] < @P2
GROUP BY
	[dbo].[Product].[ProductCategoryType],
	ASIN([dbo].[Product].[Depth]);',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Having Clause
Select the ids of all products, grouped by product
category type having an arcsine of the product's height greater than 1.
{% code-example %}
```csharp
IList<ProductCategoryType?> results = db.SelectMany(
        dbo.Product.ProductCategoryType
    )
    .From(dbo.Product)
    .Where(dbo.Product.Height > 0 & dbo.Product.Height < 1)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.ASin(dbo.Product.Height)
    )
    .Having(
        db.fx.ASin(dbo.Product.Height) < .5f
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
	ASIN([dbo].[Product].[Height])
HAVING
	ASIN([dbo].[Product].[Height]) < @P3;',N'@P1 decimal(4,1),@P2 decimal(4,1),@P3 real',@P1=0.0,@P2=1.0,@P3=0.5
```
{% /code-example %}
