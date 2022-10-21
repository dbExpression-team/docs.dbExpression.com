---
title: Replace
description: dbExpression REPLACE string function
---

{% ms-docs-url label="Replace" path="/functions/replace-transact-sql" /%}
{% supported-versions /%}

## Replace String Function

Use the `Replace` function to replace all occurrences of a pattern with another string value.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Replace({expression}, {find}, {replacement})",
    "arguments" : [
        ,
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The value that will have occurrences of `find` replaced with `replacement`.",
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
            "argumentName" : "find",
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
            "argumentName" : "replacement",
            "required" : true,
            "description" : "The value to replace all occurrences of `find` in `expression`.",
            "types": [
                { 
                    "typeName" : "AnyStringElement"
                },
                { 
                    "typeName" : "string"
                }
            ]
        }              
    ],
    "returns" : { 
        "typeName" : "string or string?", 
        "description" : "(based on nullability of `expression`, `find`, or `replacement`)"
    }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select street addresses replacing "St." with "Ave."
{% code-example %}
```csharp
IList<string> result = db.SelectMany(
        db.fx.Replace(dbo.Address.Line1, "St.", "Ave.")
	)
	.From(dbo.Address)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
	REPLACE([dbo].[Address].[Line1], @P1, @P2)
FROM
	[dbo].[Address];',N'@P1 char(3),@P2 char(4)',@P1='St.',@P2='Ave.'
```
{% /code-example %}

### Where Clause
Select any product where replacing "Player" with "Play" changes the name.
{% code-example %}
```csharp
IList<dynamic> result = db.SelectMany(
        dbo.Product.Id,
        dbo.Product.Name
    )
    .From(dbo.Product)
    .Where(db.fx.Replace(dbo.Product.Name, "Player", "Play") != dbo.Product.Name)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Product].[Id],
	[dbo].[Product].[Name]
FROM
	[dbo].[Product]
WHERE
	REPLACE([dbo].[Product].[Name], @P1, @P2) <> [dbo].[Product].[Name];',N'@P1 char(6),@P2 char(4)',@P1='Player',@P2='Play'
```
{% /code-example %}

### Order By Clause
Select a list of persons, ordered by the removal of "Mr. " with an empty string.
{% code-example %}
```csharp
IList<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .OrderBy(db.fx.Replace(dbo.Person.LastName, "Mr. ", ""))
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Person].[Id],
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName],
	[dbo].[Person].[BirthDate],
	[dbo].[Person].[GenderType],
	[dbo].[Person].[CreditLimit],
	[dbo].[Person].[YearOfLastCreditLimitReview],
	[dbo].[Person].[RegistrationDate],
	[dbo].[Person].[LastLoginDate],
	[dbo].[Person].[DateCreated],
	[dbo].[Person].[DateUpdated]
FROM
	[dbo].[Person]
ORDER BY
	REPLACE([dbo].[Person].[LastName], @P1, @P2) ASC;',N'@P1 char(4),@P2 varchar(1)',@P1='Mr. ',@P2=''
```
{% /code-example %}

### Group By Clause
Select how many, and the name, of products resulting from replacing "Player" with "Play" in the name.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
        db.fx.Count().As("count"),
        dbo.Product.Name
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.Name,
        db.fx.Replace(dbo.Product.Name, "Player", "Play")
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(@P1) AS [count],
	[dbo].[Product].[Name]
FROM
	[dbo].[Product]
GROUP BY
	[dbo].[Product].[Name],
	REPLACE([dbo].[Product].[Name], @P2, @P3);',N'@P1 nchar(1),@P2 char(6),@P3 char(4)',@P1=N'*',@P2='Player',@P3='Play'
```
{% /code-example %}

### Having Clause
Select how many, and the name, of products resulting from replacing "Player" with "Play" in the name.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
        db.fx.Count().As("count"),
        dbo.Product.Name
    )
    .From(dbo.Product)
    .GroupBy(dbo.Product.Name)
    .Having(
        db.fx.Replace(dbo.Product.Name, "Play", "Player") != dbo.Product.Name
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(@P1) AS [count],
	[dbo].[Product].[Name]
FROM
	[dbo].[Product]
GROUP BY
	[dbo].[Product].[Name]
HAVING
	REPLACE([dbo].[Product].[Name], @P2, @P3) <> [dbo].[Product].[Name];',N'@P1 nchar(1),@P2 char(4),@P3 char(6)',@P1=N'*',@P2='Play',@P3='Player'
```
{% /code-example %}