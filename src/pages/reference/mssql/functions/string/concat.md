---
title: Concat
description: dbExpression CONCAT string function
---

{% ms-docs-url label="Concat" path="/functions/concat-transact-sql" /%}
{% supported-versions /%}

## Concat String Function

Use the `Concat` function to join two or more string values.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Concat({first_expression}, {second_expression}[, ...{n-expression}])",
    "arguments" : [
        {
            "argumentName" : "first_expression",
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
            "argumentName" : "second_expression",
            "required" : true,
            "description" : "Value to append to `first_expression`.",
            "types": [
                { 
                    "typeName" : "AnyStringElement"
                }
            ]
        },
        {
            "argumentName" : "n-expression",
            "required" : false,
            "description" : "Additional expressions to append.",
            "types": [
                { 
                    "typeName" : "AnyStringElement"
                }
            ]
        }              
    ],
    "returns" : { 
        "typeName" : "string"
    }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the concatenation of city and state for addresses
{% code-example %}
```csharp
IEnumerable<string> result = db.SelectMany(
		db.fx.Concat(dbo.Address.City, ", ", db.fx.Cast(dbo.Address.State).AsVarChar(2))
	)
	.From(dbo.Address)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
    CONCAT([t0].[City], @P1, CAST([t0].[State] AS VarChar(2)))
FROM
    [dbo].[Address] AS [t0];',N'@P1 char(2)',@P1=', '
```
{% /code-example %}

### Where Clause
Select address id's where line2 has a value.
{% code-example %}
```csharp
IEnumerable<int> result = db.SelectMany(
		dbo.Address.Id
	)
	.From(dbo.Address)
    .Where(db.fx.Concat(dbo.Address.Line1, dbo.Address.Line2) != dbo.Address.Line1)
	.Execute();
```
```sql
SSELECT
    [t0].[Id]
FROM
    [dbo].[Address] AS [t0]
WHERE
    CONCAT([t0].[Line1], [t0].[Line2]) <> [t0].[Line1];
```
{% /code-example %}

### Order By Clause
Select a list of addresses, ordered by the concatenation of city and state.
{% code-example %}
```csharp
IEnumerable<Address> addresses = db.SelectMany<Address>()
    .From(dbo.Address)
    .OrderBy(db.fx.Concat(dbo.Address.City, ", ", db.fx.Cast(dbo.Address.State).AsVarChar(2)))
    .Execute();
```
```sql
exec sp_executesql N'SELECT
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
    CONCAT([t0].[City], @P1, CAST([t0].[State] AS VarChar(2))) ASC;',N'@P1 char(2)',@P1=', '
```
{% /code-example %}

### Group By Clause
Select a list of address values grouped by address type and the concatenation of city and state.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        dbo.Address.AddressType,
        db.fx.Concat(dbo.Address.City, ", ", db.fx.Cast(dbo.Address.State).AsVarChar(2)).As("formatted_city_state")
    )
    .From(dbo.Address)
    .GroupBy(
        dbo.Address.AddressType,
        db.fx.Concat(dbo.Address.City, ", ", db.fx.Cast(dbo.Address.State).AsVarChar(2))
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[AddressType],
    CONCAT([t0].[City], @P1, CAST([t0].[State] AS VarChar(2))) AS [formatted_city_state]
FROM
    [dbo].[Address] AS [t0]
GROUP BY
    [t0].[AddressType],
    CONCAT([t0].[City], @P1, CAST([t0].[State] AS VarChar(2)));',N'@P1 char(2)',@P1=', '
```
{% /code-example %}

### Having Clause
Select a count of addresses grouped by address type and the concatenation of city and state, having a city
 that ends in "y" and a state that begins with "A".
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        db.fx.Count().As("count"),            
        dbo.Address.AddressType
    )
    .From(dbo.Address)
    .GroupBy(
        dbo.Address.AddressType,
        db.fx.Concat(dbo.Address.City, ", ", db.fx.Cast(dbo.Address.State).AsVarChar(2))
    )
    .Having(
        db.fx.Concat(dbo.Address.City, ", ", db.fx.Cast(dbo.Address.State).AsVarChar(2)).Like("%y, A%")
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
	CONCAT([t0].[City], @P1, CAST([t0].[State] AS VarChar(2)))
HAVING
	CONCAT([t0].[City], @P1, CAST([t0].[State] AS VarChar(2))) LIKE @P2;',N'@P1 varchar(2),@P2 varchar(6)',@P1=', ',@P2='%y, A%'
```
{% /code-example %}


