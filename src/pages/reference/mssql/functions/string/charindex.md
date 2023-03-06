---
title: CharIndex
description: dbExpression CHARINDEX string function
---

{% ms-docs-url label="CharIndex" path="/functions/charindex-transact-sql" /%}
{% supported-versions /%}

## CharIndex String Function

Use the `CharIndex` function to search for the index of the beginning of a phrase within an 
expression, optionally providing the index in expression to start the search.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.CharIndex({pattern}, {expression}[, {startSearchPosition}])",
    "arguments" : [
        {
            "argumentName" : "pattern",
            "required" : true,
            "description" : "The value to search for in `expression`.",
            "types": [
                { 
                    "typeName" : "AnyStringElement"
                },
                { 
                    "typeName" : "string"
                }
            ]
        },
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The element to search for `pattern`.",
            "types": [
                { 
                    "typeName" : "AnyStringElement"
                }
            ]
        },
        {
            "argumentName" : "startSearchPosition",
            "required" : true,
            "description" : "Where in `expression` to start the search for `pattern`.",
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
        "typeName" : "long or long?", 
        "description" : "(based on nullability of `expression`)"
    }
}
```
{% /method-descriptor %}

> Microsoft SQL Server returns *bigint* if expression is of the *varchar(max)*, *varbinary(max)*, or *nvarchar(max)* data types; otherwise, *int*. 
dbExpression generally maps these to CLR types `long` and `int` respectively. As the dbExpression implementation for `CharIndex` works 
with the CLR type `string`, there is no way to effect a different return type based on the length of the 
provided `string` for the `expression` method parameter. Therefore, `CharIndex` in dbExpression always returns `long` or `long?`.

> If `CharIndex` does not find `pattern` within `expression`, `CharIndex` returns 0.

## Examples
### Select Statement
Select the first index of an address's line2 in line1 (if 0, line1 starts with line2)
{% code-example %}
```csharp
IEnumerable<long?> result = db.SelectMany(
		db.fx.CharIndex(dbo.Address.Line2, dbo.Address.Line1)
	)
	.From(dbo.Address)
	.Execute();
```
```sql
SELECT
    CHARINDEX([t0].[Line2], [t0].[Line1])
FROM
    [dbo].[Address] AS [t0];
```
{% /code-example %}

### Where Clause
Select any address id where line1 starts with line2
{% code-example %}
```csharp
IEnumerable<int> result = db.SelectMany(
		dbo.Address.Id
	)
	.From(dbo.Address)
	.Where(db.fx.CharIndex(dbo.Address.Line2, dbo.Address.Line1) == 1)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id]
FROM
    [dbo].[Address] AS [t0]
WHERE
    CHARINDEX([t0].[Line2], [t0].[Line1]) = @P1;',N'@P1 bigint',@P1=1
```
{% /code-example %}

### Order By Clause
Select a list of addresses, ordered by the index of the occurrence of line2 in line1.
{% code-example %}
```csharp
IEnumerable<Address> addresses = db.SelectMany<Address>()
    .From(dbo.Address)
    .OrderBy(db.fx.CharIndex(dbo.Address.Line2, dbo.Address.Line1))
    .Execute();
```
```sql
SELECT
    [t0].[Id],
    [t0].[AddressType],
    [t0].[Line1],
    [t0].[Line2],
    [t0].[City],
    [t0].[State],
    [t0].[Zip],
    [t0].[DateCreated],
    [t0].[DateUpdated]
FROM
    [dbo].[Address] AS [t0]
ORDER BY
    CHARINDEX([t0].[Line2], [t0].[Line1]) ASC;
```
{% /code-example %}

### Group By Clause
Select a list of address values grouped by address type and the index of line2 in line1.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        dbo.Address.AddressType,
        db.fx.CharIndex(dbo.Address.Line2, dbo.Address.Line1).As("first_index_of")
    )
    .From(dbo.Address)
    .GroupBy(
        dbo.Address.AddressType,
        db.fx.CharIndex(dbo.Address.Line2, dbo.Address.Line1)
    )
    .Execute();
```
```sql
SELECT
    [t0].[AddressType],
    CHARINDEX([t0].[Line2], [t0].[Line1]) AS [first_index_of]
FROM
    [dbo].[Address] AS [t0]
GROUP BY
    [t0].[AddressType],
    CHARINDEX([t0].[Line2], [t0].[Line1]);
```
{% /code-example %}

### Having Clause
Select a list of address values where line2 appears in line1 or the address has a line2 (either line2 appears in line1 where index will be 0 or greater,
or it is not found and charindex returns 0).
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
		dbo.Address.AddressType,
		dbo.Address.Line1,
		dbo.Address.Line2
	)
	.From(dbo.Address)
	.GroupBy(
		dbo.Address.AddressType,
		dbo.Address.Line1,
		dbo.Address.Line2
	)
	.Having(
		db.fx.CharIndex(dbo.Address.Line2, dbo.Address.Line1) >= 0
	)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[AddressType],
    [t0].[Line1],
    [t0].[Line2]
FROM
    [dbo].[Address] AS [t0]
GROUP BY
    [t0].[AddressType],
    [t0].[Line1],
    [t0].[Line2]
HAVING
    CHARINDEX([t0].[Line2], [t0].[Line1]) >= @P1;',N'@P1 bigint',@P1=0
```
{% /code-example %}


