---
title: Substring
description: dbExpression SUBSTRING string function
---

{% ms-docs-url label="Substring" path="/functions/substring-transact-sql" /%}
{% supported-versions /%}

## Substring String Function

Use the `Substring` function to return a part of a string.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Substring({expression}, {start}, {length})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The value to take a portion from.",
            "types": [
                { 
                    "typeName" : "AnyStringElement"
                }
            ]
        },
        {
            "argumentName" : "start",
            "required" : true,
            "description" : "Where in `expression` to start taking characters.",
            "types": [
                { 
                    "typeName" : "AnyElement<int>"
                },
                { 
                    "typeName" : "AnyElement<int?>"
                },
                { 
                    "typeName" : "int"
                },
                { 
                    "typeName" : "AnyElement<long>"
                },
                { 
                    "typeName" : "AnyElement<long?>"
                },
                { 
                    "typeName" : "long"
                }
            ]
        },
        {
            "argumentName" : "length",
            "required" : true,
            "description" : "The number of characters to take form `expression`.",
            "types": [
                { 
                    "typeName" : "AnyElement<int>"
                },
                { 
                    "typeName" : "AnyElement<int?>"
                },
                { 
                    "typeName" : "int"
                },
                { 
                    "typeName" : "AnyElement<long>"
                },
                { 
                    "typeName" : "AnyElement<long?>"
                },
                { 
                    "typeName" : "long"
                }
            ]
        }              
    ],
    "returns" : { 
        "typeName" : "string or string?", 
        "description" : "(based on nullability of `expression`, `start`, or `length`)"
    }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the two characters from product name, starting after the first character.
{% code-example %}
```csharp
IEnumerable<string> result = db.SelectMany(
        db.fx.Substring(dbo.Product.Name, 1, 2)
    )
    .From(dbo.Product)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    SUBSTRING([t0].[Name], @P1, @P2)
FROM
    [dbo].[Product] AS [t0];',N'@P1 int,@P2 int',@P1=1,@P2=2
```
{% /code-example %}

### Where Clause
Select any product id where the name starts with a single letter.
{% code-example %}
```csharp
IEnumerable<int> result = db.SelectMany(
		dbo.Product.Id
	)
	.From(dbo.Product)
	.Where(db.fx.Substring(dbo.Product.Name, 2, 1) == " ")
	.Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id]
FROM
    [dbo].[Product] AS [t0]
WHERE
    SUBSTRING([t0].[Name], @P1, @P2) = @P3;',N'@P1 int,@P2 int,@P3 char(1)',@P1=2,@P2=1,@P3=' '
```
{% /code-example %}

### Order By Clause
Select a list of products, ordered by their name but ignoring the first character.
{% code-example %}
```csharp
IEnumerable<Product> products = db.SelectMany<Product>()
	.From(dbo.Product)
	.OrderBy(db.fx.Substring(dbo.Product.Name, 2, db.fx.Len(dbo.Product.Name) - 1))
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
ORDER BY
    SUBSTRING([t0].[Name], @P1, (LEN([t0].[Name]) - @P2)) ASC;',N'@P1 bigint,@P2 int',@P1=2,@P2=1
```
{% /code-example %}

### Group By Clause
Select a list of address values grouped by address type and the first character of city.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        db.fx.Count().As("count"),
        dbo.Address.AddressType,
        db.fx.Substring(dbo.Address.City, 2, 1).As("ignore_first_character")
    )
    .From(dbo.Address)
    .GroupBy(
        dbo.Address.AddressType,
        db.fx.Substring(dbo.Address.City, 2, 1)
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(*) AS [count],
	[t0].[AddressType],
	SUBSTRING([t0].[City], @P1, @P2) AS [ignore_first_character]
FROM
	[dbo].[Address] AS [t0]
GROUP BY
	[t0].[AddressType],
	SUBSTRING([t0].[City], @P1, @P2);',N'@P1 int,@P2 int',@P1=2,@P2=1
```
{% /code-example %}

### Having Clause
Select a count of addresses grouped by address type and the first character of city, having a first character in city in the last half of the alphabet.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        db.fx.Count().As("count"),
        dbo.Address.AddressType
    )
    .From(dbo.Address)
    .GroupBy(
        dbo.Address.AddressType,
        db.fx.Substring(dbo.Address.City, 1, 1)
    )
    .Having(
        db.fx.Substring(dbo.Address.City, 1, 1) > "M"
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(*) AS [count],
	[t0].[AddressType]
FROM
	[dbo].[Address] AS [t0]
GROUP BY
	[t0].[AddressType],
	SUBSTRING([t0].[City], @P1, @P1)
HAVING
	SUBSTRING([t0].[City], @P1, @P1) > @P2;',N'@P1 int,@P2 varchar(1)',@P1=1,@P2='M'
```
{% /code-example %}



