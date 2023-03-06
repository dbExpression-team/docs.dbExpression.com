---
title: Right
description: dbExpression RIGHT string function
---

{% ms-docs-url label="Right" path="/functions/right-transact-sql" /%}
{% supported-versions /%}

## Right String Function

Use the `Right` function to return the end of a string with the specified number of characters.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Right({expression}, {character_count})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The value to take trailing characters from.",
            "types": [
                { 
                    "typeName" : "AnyStringElement"
                }
            ]
        },
        {
            "argumentName" : "character_count",
            "required" : true,
            "description" : "The number of characters to take from the end of `expression`.",
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
Select the last letter of city
{% code-example %}
```csharp
IEnumerable<string> result = db.SelectMany(
		db.fx.Right(dbo.Address.City, 1)
	)
	.From(dbo.Address)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
    RIGHT([t0].[City], @P1)
FROM
    [dbo].[Address] AS [t0];',N'@P1 int',@P1=1
```
{% /code-example %}

### Where Clause
Select address ids where the city name ends with "ly"
{% code-example %}
```csharp
IEnumerable<int> result = db.SelectMany(
		dbo.Address.Id
	)
	.From(dbo.Address)
    .Where(db.fx.Right(dbo.Address.City, 2) == "ly")
	.Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id]
FROM
    [dbo].[Address] AS [t0]
WHERE
    RIGHT([t0].[City], @P1) = @P2;',N'@P1 int,@P2 varchar(2)',@P1=2,@P2='ly'
```
{% /code-example %}

### Order By Clause
Select a list of persons, ordered by the last character of their first name.
{% code-example %}
```csharp
IEnumerable<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .OrderBy(
        db.fx.Right(dbo.Person.FirstName, 1)
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
    RIGHT([t0].[FirstName], @P1) ASC;',N'@P1 int',@P1=1
```
{% /code-example %}

### Group By Clause
Select a list of data for persons, grouped by the initial of their last name.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        db.fx.Count().As("count"),
        dbo.Person.YearOfLastCreditLimitReview,
        db.fx.Right(dbo.Person.LastName, 1).As("last_character")
    )
    .From(dbo.Person)
    .GroupBy(
        dbo.Person.YearOfLastCreditLimitReview,
        db.fx.Right(dbo.Person.LastName, 1)
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(*) AS [count],
	[t0].[YearOfLastCreditLimitReview],
	RIGHT([t0].[LastName], @P1) AS [last_character]
FROM
	[dbo].[Person] AS [t0]
GROUP BY
	[t0].[YearOfLastCreditLimitReview],
	RIGHT([t0].[LastName], @P1);',N'@P1 int',@P1=1
```
{% /code-example %}

### Having Clause
Select a list of data for persons, grouped by the last character of their last name having a last character equal to ".".
{% code-example %}
```csharp
IEnumerable<dynamic> addresses = db.SelectMany(
        db.fx.Count().As("count"),
        dbo.Person.YearOfLastCreditLimitReview,
        db.fx.Right(dbo.Person.LastName, 1).As("last_character")
    )
    .From(dbo.Person)
    .GroupBy(
        dbo.Person.YearOfLastCreditLimitReview,
        db.fx.Right(dbo.Person.LastName, 1)
    )
    .Having(
        db.fx.Right(dbo.Person.LastName, 1) > "."
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(*) AS [count],
	[t0].[YearOfLastCreditLimitReview],
	RIGHT([t0].[LastName], @P1) AS [last_character]
FROM
	[dbo].[Person] AS [t0]
GROUP BY
	[t0].[YearOfLastCreditLimitReview],
	RIGHT([t0].[LastName], @P1)
HAVING
	RIGHT([t0].[LastName], @P1) > @P2;',N'@P1 int,@P2 varchar(1)',@P1=1,@P2='.'
```
{% /code-example %}


