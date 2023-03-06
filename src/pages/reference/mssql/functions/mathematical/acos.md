---
title: ACos
description: dbExpression ACOS Arccosine mathematical function
---

{% ms-docs-url label="ACos" path="/functions/acos-transact-sql" /%}
{% supported-versions /%}

## ACos (Arccosine) Mathematical Function

Use the `ACos` function to return the arccosine of the specified expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.ACos({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true, 
			"description" : "The value to use in the arccosine calculation.  The value of `expression` must be between -1 and 1.",
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
A where clause has been added to the following examples to ensure successful execution.

### Select Statement
Select the arccosine of a product's weight (which is nullable in the database).
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.ACos(dbo.Product.Weight)
    )
    .From(dbo.Product)
    .Where(dbo.Product.Weight > 0 & dbo.Product.Weight < 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT TOP(1)
	ACOS([t0].[Weight])
FROM
	[dbo].[Product] AS [t0]
WHERE
	[t0].[Weight] > @P1
	AND
	[t0].[Weight] < @P2;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Where Clause
Select the arccosine of a product's depth (which is nullable in the database).
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.ACos(dbo.Product.Depth)
    )
    .From(dbo.Product)
    .Where(dbo.Product.Depth > 0 & dbo.Product.Depth < 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT TOP(1)
	ACOS([t0].[Depth])
FROM
	[dbo].[Product] AS [t0]
WHERE
	[t0].[Depth] > @P1
	AND
	[t0].[Depth] < @P2;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Order By Clause
Select and order by the arccosine of a product's depth.
{% code-example %}
```csharp
IEnumerable<Product> result = db.SelectMany<Product>()
    .From(dbo.Product)
    .Where(dbo.Product.Depth > 0 & dbo.Product.Depth < 1)
    .OrderBy(db.fx.ACos(dbo.Product.Depth).Desc())
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
	ACOS([t0].[Depth]) DESC;',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Group By Clause
Select product details grouped by product
category and arccosine of the product's depth.
{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
        dbo.Product.ProductCategoryType,
        db.fx.ACos(dbo.Product.Depth).As("calculated_value")
    )
    .From(dbo.Product)
    .Where(dbo.Product.Depth > 0 & dbo.Product.Depth < 1)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.ACos(dbo.Product.Depth)
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[ProductCategoryType],
	ACOS([t0].[Depth]) AS [calculated_value]
FROM
	[dbo].[Product] AS [t0]
WHERE
	[t0].[Depth] > @P1
	AND
	[t0].[Depth] < @P2
GROUP BY
	[t0].[ProductCategoryType],
	ACOS([t0].[Depth]);',N'@P1 decimal(4,1),@P2 decimal(4,1)',@P1=0.0,@P2=1.0
```
{% /code-example %}

### Having Clause
Select the ids of all products, grouped by product
category type having an arccosine of the product's height greater than 1.
{% code-example %}
```csharp
IEnumerable<ProductCategoryType?> results = db.SelectMany(
        dbo.Product.ProductCategoryType
    )
    .From(dbo.Product)
    .Where(dbo.Product.Height > 0 & dbo.Product.Height < 1)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.ACos(dbo.Product.Height)
    )
    .Having(
        db.fx.ACos(dbo.Product.Height) < .5f
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
	ACOS([t0].[Height])
HAVING
	ACOS([t0].[Height]) < @P3;',N'@P1 decimal(4,1),@P2 decimal(4,1),@P3 real',@P1=0.0,@P2=1.0,@P3=0.5
```
{% /code-example %}
