---
title: Cast
description: dbExpression CAST conversion function
---

{% ms-docs-url label="Cast" path="/functions/cast-and-convert-transact-sql" /%}
{% supported-versions /%}

## Cast Conversion Function

Use the `Cast` function to change the database type of an expression to a different database type.


{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Cast({expression}).{data_type_method}([{length}])",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The field expression, composite element, or function result to use in calculating the population variance.",
            "types": [
                { 
                    "typeName" : "AnyElement<T>",
                    "description" : "The type `T` to cast to a different database type - `T` is a .NET CLR type."
                }
            ]
        },
        {
            "argumentName" : "data_type_method",
            "required" : true,
            "description" : "The method specifying the database type the `expression` should be cast to.",
            "types" : [
                { "typeName" : "AsBit()" },
                { "typeName" : "AsDateTime()" },
                { "typeName" : "AsDateTimeOffset()" },
                { "typeName" : "AsDecimal()" },
                { "typeName" : "AsFloat()" },
                { "typeName" : "AsUniqueIdentifier()" },
                { "typeName" : "AsSmallInt()" },
                { "typeName" : "AsInt()" },
                { "typeName" : "AsBigInt()" },
                { "typeName" : "AsVarChar({length})" },
                { "typeName" : "AsChar({length})" },
                { "typeName" : "AsNVarChar({length})" },
                { "typeName" : "AsNChar({length})" },
                { "typeName" : "AsTinyInt()" },
                { "typeName" : "AsTime()" },
                { "typeName" : "AsMoney()" },
                { "typeName" : "AsMoney()" }
            ]
        },
        {
            "argumentName" : "length",
            "required" : false,
            "description" : "For cast operations to database types supporting a 'length' (`varchar`, `char`, `nvarchar`, `nchar`), the length of the database type returned from the cast operation."
        }        
    ]
}
```
{% /method-descriptor %}

### Returns
{% table %}
* data_type_method
* return type (based on nullability of expression)
---
* `AsBit()`
* `bool` or `bool?`
---
* `AsSmallInt()`
* `byte` or `byte?`
---
* `AsInt()`
* `int` or `int?`
---
* `AsBigInt()`
* `long` or `long?`
---
* `AsDecimal()`
* `decimal` or `decimal?`
---
* `AsFloat()`
* `float` or `float?`
---
* `AsDateTime()`
* `DateTime` or `DateTime?`
---
* `AsDateTimeOffset()`
* `DateTimeOffset` or `DateTimeOffset?`
---
* `AsUniqueIdentifier()`
* `Guid` or `Guid?`
---
* `AsVarChar({length})`
* `string` or `string?`
---
* `AsChar({length})`
* `string` or `string?`
---
* `AsNVarChar({length})`
* `string` or `string?`
---
* `AsNChar({length})`
* `string` or `string?`
---
* `AsTinyInt()`
* `short` or `short?`
---
* `AsTime()`
* `TimeSpan` or `TimeSpan?`
---
* `AsMoney()`
* `double` or `double?`
---
* `AsMoney()`
* `double` or `double?`
{% /table %}

## Examples
### Select Statement
Select the cast of total purchase amount to a varchar(20).
{% code-example %}
```csharp
string? result = db.SelectOne(
        db.fx.Cast(dbo.Purchase.TotalPurchaseAmount).AsVarChar(20)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT TOP(1)
    CAST([t0].[TotalPurchaseAmount] AS VarChar(20))
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

### Order By Clause
Select the cast of zip code to an integer.
{% code-example %}
```csharp
int cast = db.SelectOne(
        db.fx.Cast(dbo.Address.Zip).AsInt()
    )
    .From(dbo.Address)
    .OrderBy(db.fx.Cast(dbo.Address.Zip).AsInt().Desc())
    .Execute();
```
```sql
SELECT TOP(1)
    CAST([t0].[Zip] AS Int)
FROM
    [dbo].[Address] AS [t0]
ORDER BY
    CAST([t0].[Zip] AS Int) DESC;
```
{% /code-example %}

### Group By Clause
Select the cast of all product quantities, grouped by product category
type and cast of product quantity.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        dbo.Product.ProductCategoryType,
        db.fx.Cast(dbo.Product.Quantity).AsBigInt().As("Quantity")
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.Cast(dbo.Product.Quantity).AsBigInt()
    )
    .Execute();
```
```sql
SELECT
    [t0].[ProductCategoryType],
    CAST([t0].[Quantity] AS BigInt) AS [Quantity]
FROM
    [dbo].[Product] AS [t0]
GROUP BY
    [t0].[ProductCategoryType],
    CAST([t0].[Quantity] AS BigInt);
```
{% /code-example %}

### Having Clause
Select the cast of all product quantities, grouped by product category
type and cast of product quantity having n casted value less than or equal to 1,000,000.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        dbo.Product.ProductCategoryType,
        db.fx.Cast(dbo.Product.Quantity).AsBigInt().As("Quantity")
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        dbo.Product.Quantity
    )
    .Having(db.fx.Cast(dbo.Product.Quantity).AsBigInt() <= 1_000_000)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[ProductCategoryType],
    CAST([t0].[Quantity] AS BigInt) AS [Quantity]
FROM
    [dbo].[Product] AS [t0]
GROUP BY
    [t0].[ProductCategoryType],
    [t0].[Quantity]
HAVING
    CAST([t0].[Quantity] AS BigInt) <= @P1;',N'@P1 bigint',@P1=1000000
```
{% /code-example %}
