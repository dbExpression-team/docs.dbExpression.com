---
title: Left
description: dbExpression LEFT string function
---

{% ms-docs-url label="Left" path="/functions/left-transact-sql" /%}
{% supported-versions /%}

## Left String Function

Use the `Left` function to return the start of a string with the specified number of characters.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Left({expression}, {character_count})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The value to take beginning characters from.",
            "types": [
                { 
                    "typeName" : "AnyStringElement"
                }
            ]
        },
        {
            "argumentName" : "character_count",
            "required" : true,
            "description" : "The number of characters to take from `expression`.",
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
                    "typeName" : "int?"
                }
            ]
        }            
    ],
    "returns" : { 
        "typeName" : "string or string?",
		"description" : "(depending on the nullability of `expression` and `character_count`)"
    }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the first letter of city
{% code-example %}
```csharp
IList<string> result = db.SelectMany(
		db.fx.Left(dbo.Address.City, 1)
	)
	.From(dbo.Address)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
	LEFT([dbo].[Address].[City], @P1)
FROM
	[dbo].[Address];',N'@P1 int',@P1=1
```
{% /code-example %}

### Where Clause
Select address ids where the city name starts with "D"
{% code-example %}
```csharp
IList<int> result = db.SelectMany(
		dbo.Address.Id
	)
	.From(dbo.Address)
    .Where(db.fx.Left(dbo.Address.City, 1) == "D")
	.Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Address].[Id]
FROM
	[dbo].[Address]
WHERE
	LEFT([dbo].[Address].[City], @P1) = @P2;',N'@P1 int,@P2 char(1)',@P1=1,@P2='D'
```
{% /code-example %}

### Order By Clause
Select a list of persons, ordered by their initials.
{% code-example %}
```csharp
IList<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .OrderBy(
        db.fx.Left(dbo.Person.FirstName, 1),
        db.fx.Left(dbo.Person.LastName, 1)
    )
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
	LEFT([dbo].[Person].[FirstName], @P1) ASC,
	LEFT([dbo].[Person].[LastName], @P2) ASC;',N'@P1 int,@P2 int',@P1=1,@P2=1
```
{% /code-example %}

### Group By Clause
Select a list of data for persons, grouped by the initial of their last name.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
        db.fx.Count().As("count"),
        dbo.Person.YearOfLastCreditLimitReview,
        db.fx.Left(dbo.Person.LastName, 1).As("last_initial")
    )
    .From(dbo.Person)
    .GroupBy(
        dbo.Person.YearOfLastCreditLimitReview,
        db.fx.Left(dbo.Person.LastName, 1)
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(@P1) AS [count],
	[dbo].[Person].[YearOfLastCreditLimitReview],
	LEFT([dbo].[Person].[LastName], @P2) AS [last_initial]
FROM
	[dbo].[Person]
GROUP BY
	[dbo].[Person].[YearOfLastCreditLimitReview],
	LEFT([dbo].[Person].[LastName], @P2);',N'@P1 nchar(1),@P2 int',@P1=N'*',@P2=1
```
{% /code-example %}

### Having Clause
Select a list of data for persons, grouped by the initial of their last name having a first initial of last name in the last half of the alphabet.
{% code-example %}
```csharp
IList<dynamic> addresses = db.SelectMany(
        db.fx.Count().As("count"),
        dbo.Person.YearOfLastCreditLimitReview,
        db.fx.Left(dbo.Person.LastName, 1).As("last_initial")
    )
    .From(dbo.Person)
    .GroupBy(
        dbo.Person.YearOfLastCreditLimitReview,
        db.fx.Left(dbo.Person.LastName, 1)
    )
    .Having(
        db.fx.Left(dbo.Person.LastName, 1) > "M"
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(@P1) AS [count],
	[dbo].[Person].[YearOfLastCreditLimitReview],
	LEFT([dbo].[Person].[LastName], @P2) AS [last_initial]
FROM
	[dbo].[Person]
GROUP BY
	[dbo].[Person].[YearOfLastCreditLimitReview],
	LEFT([dbo].[Person].[LastName], @P2)
HAVING
	LEFT([dbo].[Person].[LastName], @P2) > @P3;',N'@P1 nchar(1),@P2 int,@P3 char(1)',@P1=N'*',@P2=1,@P3='M'
```
{% /code-example %}


