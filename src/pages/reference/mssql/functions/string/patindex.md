---
title: PatIndex
description: dbExpression PATINDEX string function
---

{% ms-docs-url label="PatIndex" path="/functions/patindex-transact-sql" /%}
{% supported-versions /%}

## PatIndex (Pattern Index) String Function

Use the `PatIndex` function to search for the starting position of a pattern in a string expression or zero
if the pattern is not found in the string expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.PatIndex({pattern}, {expression})",
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
        }            
    ],
    "returns" : { 
        "typeName" : "long or long?", 
        "description" : "(based on nullability of `expression`)"
    }
}
```
{% /method-descriptor %}

{% callout type="warning" %}
dbExpression *does not* include or append any wildcard characters with the provided `pattern` - it is up to you to provide the wildcard characters.
{% /callout %}

> See [String Operators (Microsoft)](https://learn.microsoft.com/en-us/sql/t-sql/language-elements/string-operators-transact-sql)

> Microsoft SQL Server returns *bigint* if expression is of the *varchar(max)*, *varbinary(max)*, or *nvarchar(max)* data types; otherwise, *int*. 
dbExpression generally maps these to CLR types `long` and `int` respectively. As the dbExpression implementation for `PatIndex` works 
with the CLR type `string`, there is no way to effect a different return type based on the length of the 
provided `string` for the `expression` method parameter. Therefore, `PatIndex` in dbExpression always returns `long` or `long?`.

## Examples
### Select Statement
Select the index of an occurrence of the state in the city name.
{% code-example %}
```csharp
IEnumerable<long> result = db.SelectMany(
		db.fx.PatIndex("%" + dbo.Address.State + "%", dbo.Address.City)
	)
	.From(dbo.Address)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
	PATINDEX(@P1, [t0].[City])
FROM
	[dbo].[Address] AS [t0];',N'@P1 char(1),@P2 char(1)',@P1='%',@P2='%'
```
{% /code-example %}

### Where Clause
Select a list of address ids where the value of city is equal to the value of line 1
(a wildcard token has not been added to the beginning or the end of 'dbo.Address.Line1',
so PatIndex will return 1 only if the city exactly matches the line 1 of address).
{% code-example %}
```csharp
IEnumerable<int> result = db.SelectMany(
		dbo.Address.Id
	)
	.From(dbo.Address)
	.Where(db.fx.PatIndex(dbo.Address.Line1, dbo.Address.City) == 1)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[Id]
FROM
	[dbo].[Address] AS [t0]
WHERE
	PATINDEX([t0].[Line1], [t0].[City]) = @P1;',N'@P1 bigint',@P1=1
```
{% /code-example %}

### Order By Clause
Select a list of addresses, ordered by the index of the occurrence of line2 in line1.
{% code-example %}
```csharp
IEnumerable<Address> addresses = db.SelectMany<Address>()
    .From(dbo.Address)
    .OrderBy(db.fx.PatIndex("%" + dbo.Address.State + "%", dbo.Address.City))
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
	PATINDEX(@P1, [t0].[City]) ASC;',N'@P1 char(1),@P2 char(1)',@P1='%',@P2='%'
```
{% /code-example %}

### Group By Clause
Select a list of address values grouped by address type and the index of line2 in line1.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
		db.fx.Count().As("count"),
		dbo.Address.AddressType
	)
	.From(dbo.Address)
	.GroupBy(
		dbo.Address.AddressType,
		db.fx.PatIndex("%" + dbo.Address.State + "%", dbo.Address.City)
	)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(@P1) AS [count],
	[t0].[AddressType]
FROM
	[dbo].[Address] AS [t0]
GROUP BY
	[t0].[AddressType],
	PATINDEX(@P2, [t0].[City]);',N'@P1 nchar(1),@P2 char(1)',@P1=N'*',@P2='%'
```
{% /code-example %}

### Having Clause
Select a the count of addresses grouped by address type and the index of state in line1 where the value of state appears in line1.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
		db.fx.Count().As("count"),
		dbo.Address.AddressType
	)
	.From(dbo.Address)
	.GroupBy(
		dbo.Address.AddressType,
		db.fx.PatIndex("%" + dbo.Address.State + "%", dbo.Address.Line1)
	)
	.Having(
		db.fx.PatIndex("%" + dbo.Address.State + "%", dbo.Address.Line1) > 0
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
	PATINDEX(@P1, [t0].[Line1])
HAVING
	PATINDEX(@P1, [t0].[Line1]) > @P2;',N'@P1 varchar(7),@P2 int',@P1='%State%',@P2=0
```
{% /code-example %}


