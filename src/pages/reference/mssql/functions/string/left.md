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
IEnumerable<string> result = db.SelectMany(
		db.fx.Left(dbo.Address.City, 1)
	)
	.From(dbo.Address)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
    LEFT([t0].[City], @P1)
FROM
    [dbo].[Address] AS [t0];',N'@P1 int',@P1=1
```
{% /code-example %}

### Where Clause
Select address ids where the city name starts with "D"
{% code-example %}
```csharp
IEnumerable<int> result = db.SelectMany(
		dbo.Address.Id
	)
	.From(dbo.Address)
    .Where(db.fx.Left(dbo.Address.City, 1) == "D")
	.Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id]
FROM
    [dbo].[Address] AS [t0]
WHERE
    LEFT([t0].[City], @P1) = @P2;',N'@P1 int,@P2 char(1)',@P1=1,@P2='D'
```
{% /code-example %}

### Order By Clause
Select a list of persons, ordered by their initials.
{% code-example %}
```csharp
IEnumerable<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .OrderBy(
        db.fx.Left(dbo.Person.FirstName, 1),
        db.fx.Left(dbo.Person.LastName, 1)
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id],
    [t0].[FirstName],
    [t0].[LastName],
    [t0].[BirthDate],
    [t0].[GenderType],
    [t0].[CreditLimit],
    [t0].[YearOfLastCreditLimitReview],
    [t0].[RegistrationDate],
    [t0].[LastLoginDate],
    [t0].[DateCreated],
    [t0].[DateUpdated]
FROM
    [dbo].[Person] AS [t0]
ORDER BY
    LEFT([t0].[FirstName], @P1) ASC,
    LEFT([t0].[LastName], @P2) ASC;',N'@P1 int,@P2 int',@P1=1,@P2=1
```
{% /code-example %}

### Group By Clause
Select a list of data for persons, grouped by the initial of their last name.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
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
	COUNT(*) AS [count],
	[t0].[YearOfLastCreditLimitReview],
	LEFT([t0].[LastName], @P1) AS [last_initial]
FROM
	[dbo].[Person] AS [t0]
GROUP BY
	[t0].[YearOfLastCreditLimitReview],
	LEFT([t0].[LastName], @P1);',N'@P1 int',@P1=1
```
{% /code-example %}

### Having Clause
Select a list of data for persons, grouped by the initial of their last name having a first initial of last name in the last half of the alphabet.
{% code-example %}
```csharp
IEnumerable<dynamic> addresses = db.SelectMany(
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
	COUNT(*) AS [count],
	[t0].[YearOfLastCreditLimitReview],
	LEFT([t0].[LastName], @P1) AS [last_initial]
FROM
	[dbo].[Person] AS [t0]
GROUP BY
	[t0].[YearOfLastCreditLimitReview],
	LEFT([t0].[LastName], @P1)
HAVING
	LEFT([t0].[LastName], @P1) > @P2;',N'@P1 int,@P2 varchar(1)',@P1=1,@P2='M'
```
{% /code-example %}


