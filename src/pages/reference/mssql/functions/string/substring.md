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
IList<string> result = db.SelectMany(
        db.fx.Substring(dbo.Product.Name, 1, 2)
    )
    .From(dbo.Product)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	SUBSTRING([dbo].[Product].[Name], @P1, @P2)
FROM
	[dbo].[Product];',N'@P1 int,@P2 int',@P1=1,@P2=2
```
{% /code-example %}

### Where Clause
Select any product id where the name starts with a single letter.
{% code-example %}
```csharp
IList<int> result = db.SelectMany(
		dbo.Product.Id
	)
	.From(dbo.Product)
	.Where(db.fx.Substring(dbo.Product.Name, 2, 1) == " ")
	.Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Product].[Id]
FROM
	[dbo].[Product]
WHERE
	SUBSTRING([dbo].[Product].[Name], @P1, @P2) = @P3;',N'@P1 int,@P2 int,@P3 char(1)',@P1=2,@P2=1,@P3=' '
```
{% /code-example %}

### Order By Clause
Select a list of products, ordered by their name but ignoring the first character.
{% code-example %}
```csharp
IList<Product> products = db.SelectMany<Product>()
	.From(dbo.Product)
	.OrderBy(db.fx.Substring(dbo.Product.Name, 2, db.fx.Len(dbo.Product.Name) - 1))
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
ORDER BY
	SUBSTRING([dbo].[Product].[Name], @P1, (LEN([dbo].[Product].[Name]) - @P2)) ASC;',N'@P1 bigint,@P2 int',@P1=2,@P2=1
```
{% /code-example %}

### Group By Clause
Select a list of address values grouped by address type and the first character of state.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
        db.fx.Count().As("count"),
        dbo.Address.AddressType,
        db.fx.Substring(dbo.Address.State, 1, 1).As("ignore_first_character")
    )
    .From(dbo.Address)
    .GroupBy(
        dbo.Address.AddressType,
        db.fx.Substring(dbo.Address.State, 1, 1)
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(@P1) AS [count],
	[dbo].[Address].[AddressType],
	SUBSTRING([dbo].[Address].[State], @P2, @P3) AS [ignore_first_character]
FROM
	[dbo].[Address]
GROUP BY
	[dbo].[Address].[AddressType],
	SUBSTRING([dbo].[Address].[State], @P2, @P3);',N'@P1 nchar(1),@P2 int,@P3 int',@P1=N'*',@P2=1,@P3=1
```
{% /code-example %}

### Having Clause
Select a count of addresses grouped by address type and the first character of state, having a first character in state in the last half of the alphabet.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
        db.fx.Count().As("count"),
        dbo.Address.AddressType
    )
    .From(dbo.Address)
    .GroupBy(
        dbo.Address.AddressType,
        db.fx.Substring(dbo.Address.State, 1, 1)
    )
    .Having(
        db.fx.Substring(dbo.Address.State, 1, 1) > "M"
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(@P1) AS [count],
	[dbo].[Address].[AddressType]
FROM
	[dbo].[Address]
GROUP BY
	[dbo].[Address].[AddressType],
	SUBSTRING([dbo].[Address].[State], @P2, @P2)
HAVING
	SUBSTRING([dbo].[Address].[State], @P2, @P2) > @P4;',N'@P1 nchar(1),@P2 int,@P3 int,@P4 char(1)',@P1=N'*',@P2=1,@P3=1,@P4='M'
```
{% /code-example %}



