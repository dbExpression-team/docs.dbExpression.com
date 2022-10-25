---
title: Log
description: dbLogression LOG Logarithm mathematical function
---

{% ms-docs-url label="Log" path="/functions/log-transact-sql" /%}
{% supported-versions initial_version=2012 /%}

## Log (Logarithm) Mathematical Function

Use the `Log` function to return the natural logarithm of the specified expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Log({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true, 
            "description" : "The value to use in the logarithm calculation.",
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
Select the natural logarithm of a product's weight (which is nullable in the database).
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.Log(dbo.Product.Weight)
    )
    .From(dbo.Product)
    .Execute();
```
```sql
SELECT TOP(1)
	LOG([dbo].[Product].[Weight])
FROM
	[dbo].[Product];
```
{% /code-example %}

### Where Clause
Select the natural logarithm of a product's depth (which is nullable in the database).
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.Log(dbo.Product.Depth)
    )
    .From(dbo.Product)
    .Execute();
```
```sql
SELECT TOP(1)
	LOG([dbo].[Product].[Depth])
FROM
	[dbo].[Product];
```
{% /code-example %}

### Order By Clause
Select and order by the natural logarithm of a product's depth.
{% code-example %}
```csharp
IList<Product> result = db.SelectMany<Product>()
    .From(dbo.Product)
    .OrderBy(db.fx.Log(dbo.Product.Depth).Desc)
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
WHERE
	[dbo].[Product].[Depth] > @P1
	AND
	[dbo].[Product].[Depth] < @P2
ORDER BY
	LOG([dbo].[Product].[Depth]) DESC;
```
{% /code-example %}

### Group By Clause
Select product details grouped by product
category and the natural logarithm of the product's depth.
{% code-example %}
```csharp
IList<dynamic> results = db.SelectMany(
        dbo.Product.ProductCategoryType,
        db.fx.Log(dbo.Product.Depth).As("calculated_value")
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.Log(dbo.Product.Depth)
    )
    .Execute();
```
```sql
SELECT
	[dbo].[Product].[ProductCategoryType],
	LOG([dbo].[Product].[Depth]) AS [calculated_value]
FROM
	[dbo].[Product]
GROUP BY
	[dbo].[Product].[ProductCategoryType],
	LOG([dbo].[Product].[Depth]);
```
{% /code-example %}

### Having Clause
Select the ids of all products, grouped by product
category type having a natural logarithm of the product's height 
greater than the product's width.
{% code-example %}
```csharp
IList<ProductCategoryType?> results = db.SelectMany(
        dbo.Product.ProductCategoryType
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.Log(dbo.Product.Height)
    )
    .Having(
        db.fx.Log(dbo.Product.Height) > dbo.Product.Width
    )
    .Execute();
```
```sql
SELECT
	[dbo].[Product].[ProductCategoryType]
FROM
	[dbo].[Product]
GROUP BY
	[dbo].[Product].[ProductCategoryType],
	LOG([dbo].[Product].[Height])
HAVING
	LOG([dbo].[Product].[Height]) > [dbo].[Product].[Width];
```
{% /code-example %}