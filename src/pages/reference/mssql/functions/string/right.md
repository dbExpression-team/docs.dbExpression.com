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
IList<string> result = db.SelectMany(
		db.fx.Right(dbo.Address.City, 1)
	)
	.From(dbo.Address)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
	RIGHT([dbo].[Address].[City], @P1)
FROM
	[dbo].[Address];',N'@P1 int',@P1=1
```
{% /code-example %}

### Where Clause
Select address ids where the city name ends with "ly"
{% code-example %}
```csharp
IList<int> result = db.SelectMany(
		dbo.Address.Id
	)
	.From(dbo.Address)
    .Where(db.fx.Right(dbo.Address.City, 2) == "ly")
	.Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Address].[Id]
FROM
	[dbo].[Address]
WHERE
	RIGHT([dbo].[Address].[City], @P1) = @P2;',N'@P1 int,@P2 varchar(2)',@P1=2,@P2='ly'
```
{% /code-example %}

### Order By Clause
Select a list of persons, ordered by the last character of their first name.
{% code-example %}
```csharp
IList<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .OrderBy(
        db.fx.Right(dbo.Person.FirstName, 1)
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
	RIGHT([dbo].[Person].[FirstName], @P1) ASC;',N'@P1 int',@P1=1
```
{% /code-example %}

### Group By Clause
Select a list of data for persons, grouped by the initial of their last name.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
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
	COUNT(@P1) AS [count],
	[dbo].[Person].[YearOfLastCreditLimitReview],
	RIGHT([dbo].[Person].[LastName], @P2) AS [last_character]
FROM
	[dbo].[Person]
GROUP BY
	[dbo].[Person].[YearOfLastCreditLimitReview],
	RIGHT([dbo].[Person].[LastName], @P2);',N'@P1 nchar(1),@P2 int',@P1=N'*',@P2=1
```
{% /code-example %}

### Having Clause
Select a list of data for persons, grouped by the last character of their last name having a last character equal to ".".
{% code-example %}
```csharp
IList<dynamic> addresses = db.SelectMany(
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
	COUNT(@P1) AS [count],
	[dbo].[Person].[YearOfLastCreditLimitReview],
	RIGHT([dbo].[Person].[LastName], @P2) AS [last_initial]
FROM
	[dbo].[Person]
GROUP BY
	[dbo].[Person].[YearOfLastCreditLimitReview],
	RIGHT([dbo].[Person].[LastName], @P2)
HAVING
	RIGHT([dbo].[Person].[LastName], @P2) > @P3;',N'@P1 nchar(1),@P2 int,@P3 char(1)',@P1=N'*',@P2=1,@P3='.'
```
{% /code-example %}


