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
	ASIN([t0].[Weight])
FROM
	[dbo].[Product] AS [t0]
WHERE
	[t0].[Weight] > @P1
	AND
	[t0].[Weight] < @P2;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
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
	ASIN([t0].[Depth])
FROM
	[dbo].[Product] AS [t0]
WHERE
	[t0].[Depth] > @P1
	AND
	[t0].[Depth] < @P2;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Order By Clause
Select and order by the arcsine of a product's depth.
{% code-example %}
```csharp
IEnumerable<Product> result = db.SelectMany<Product>()
    .From(dbo.Product)
    .Where(dbo.Product.Depth > 0 & dbo.Product.Depth < 1)
    .OrderBy(db.fx.ASin(dbo.Product.Depth).Desc())
    .Execute();
```
```sql
exec sp_executesql N'SELECT
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
WHERE
	[t0].[Depth] > @P1
	AND
	[t0].[Depth] < @P2
ORDER BY
	ASIN([t0].[Depth]) DESC;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Group By Clause
Select product details grouped by product
category and arcsine of the product's depth.
{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
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
	[t0].[ProductCategoryType],
	ASIN([t0].[Depth]) AS [calculated_value]
FROM
	[dbo].[Product] AS [t0]
WHERE
	[t0].[Depth] > @P1
	AND
	[t0].[Depth] < @P2
GROUP BY
	[t0].[ProductCategoryType],
	ASIN([t0].[Depth]);',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Having Clause
Select the ids of all products, grouped by product
category type having an arcsine of the product's height greater than 1.
{% code-example %}
```csharp
IEnumerable<ProductCategoryType?> results = db.SelectMany(
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
	[t0].[ProductCategoryType]
FROM
	[dbo].[Product] AS [t0]
WHERE
	[t0].[Height] > @P1
	AND
	[t0].[Height] < @P2
GROUP BY
	[t0].[ProductCategoryType],
	ASIN([t0].[Height])
HAVING
	ASIN([t0].[Height]) < @P3;',N'@P1 decimal(4,1),@P2 decimal(4,1),@P3 real',@P1=0.0,@P2=1.0,@P3=0.5
```
{% /code-example %}
