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
		db.fx.Concat(dbo.Address.City, ", ", dbo.Address.State)
	)
	.From(dbo.Address)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
	CONCAT([dbo].[Address].[City], @P1, [dbo].[Address].[State])
FROM
	[dbo].[Address];',N'@P1 char(2)',@P1=', '
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
SELECT
	[dbo].[Address].[Id]
FROM
	[dbo].[Address]
WHERE
	CONCAT([dbo].[Address].[Line1], [dbo].[Address].[Line2]) <> [dbo].[Address].[Line1];
```
{% /code-example %}

### Order By Clause
Select a list of addresses, ordered by the concatenation of city and state.
{% code-example %}
```csharp
IEnumerable<Address> addresses = db.SelectMany<Address>()
    .From(dbo.Address)
    .OrderBy(db.fx.Concat(dbo.Address.City, ", ", dbo.Address.State))
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Address].[Id],
	[dbo].[Address].[AddressType],
	[dbo].[Address].[Line1],
	[dbo].[Address].[Line2],
	[dbo].[Address].[City],
	[dbo].[Address].[State],
	[dbo].[Address].[Zip],
	[dbo].[Address].[DateCreated],
	[dbo].[Address].[DateUpdated]
FROM
	[dbo].[Address]
ORDER BY
	CONCAT([dbo].[Address].[City], @P1, [dbo].[Address].[State]) ASC;',N'@P1 char(2)',@P1=', '
```
{% /code-example %}

### Group By Clause
Select a list of address values grouped by address type and the concatenation of city and state.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        dbo.Address.AddressType,
        db.fx.Concat(dbo.Address.City, ", ", dbo.Address.State).As("formatted_city_state")
    )
    .From(dbo.Address)
    .GroupBy(
        dbo.Address.AddressType,
        db.fx.Concat(dbo.Address.City, ", ", dbo.Address.State)
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Address].[AddressType],
	CONCAT([dbo].[Address].[City], @P1, [dbo].[Address].[State]) AS [formatted_city_state]
FROM
	[dbo].[Address]
GROUP BY
	[dbo].[Address].[AddressType],
	CONCAT([dbo].[Address].[City], @P1, [dbo].[Address].[State]);',N'@P1 char(2)',@P1=', '
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
        db.fx.Concat(dbo.Address.City, ", ", dbo.Address.State)
    )
    .Having(
        db.fx.Concat(dbo.Address.City, ", ", dbo.Address.State).Like("%y, A%")
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
	PATINDEX((@P2 + [dbo].[Address].[State] + @P2), [dbo].[Address].[Line1])
HAVING
	PATINDEX((@P2 + [dbo].[Address].[State] + @P2), [dbo].[Address].[Line1]) > @P3;',N'@P1 nchar(1),@P2 char(1),@P3 bigint',@P1=N'*',@P2='%',@P3=0
```
{% /code-example %}


