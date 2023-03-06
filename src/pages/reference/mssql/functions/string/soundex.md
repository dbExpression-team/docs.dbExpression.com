---
title: Soundex
description: dbExpression SOUNDEX string function
---

{% ms-docs-url label="Soundex" path="/functions/soundex-transact-sql" /%}
{% supported-versions /%}

## Soundex String Function

Use the `Soundex` function to evaluate the similarity of two strings.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Soundex({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The value to use for computation of the four character result.",
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
		"description" : "(depending on the nullability of `expression`)"
    }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the soundex value of a person's last name.
{% code-example %}
```csharp
IEnumerable<string> result = db.SelectMany(
		db.fx.Soundex(dbo.Person.LastName)
	)
	.From(dbo.Person)
	.Execute();
```
```sql
SELECT
	SOUNDEX([t0].[LastName])
FROM
	[dbo].[Person] AS [t0];
```
{% /code-example %}

### Where Clause
Select persons where their last name is similar to their first name.
{% code-example %}
```csharp
IEnumerable<Person> result = db.SelectMany<Person>()
    .From(dbo.Person)
	.Where(db.fx.Soundex(dbo.Person.LastName) != dbo.Person.LastName)
	.Execute();
```
```sql
SELECT
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
WHERE
	SOUNDEX([t0].[LastName]) <> [t0].[LastName];
```
{% /code-example %}

### Order By Clause
Select a list of persons, ordered by the soundex value of their last name.
{% code-example %}
```csharp
IEnumerable<Person> result = db.SelectMany<Person>()
	.From(dbo.Person)
	.OrderBy(db.fx.Soundex(dbo.Person.LastName))
	.Execute();
```
```sql
SELECT
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
	SOUNDEX([t0].[LastName]) ASC;
```
{% /code-example %}

### Group By Clause
Select a list of address values grouped by address type and the similarity of the names of the city they live in (distinct list
of similar sonding cities).
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
		dbo.Address.AddressType,
		db.fx.Soundex(dbo.Address.City).As("city")
	)
	.From(dbo.Address)
	.GroupBy(
		dbo.Address.AddressType,
		db.fx.Soundex(dbo.Address.City)
	)
	.Execute();
```
```sql
SELECT
	[t0].[AddressType],
	SOUNDEX([t0].[City]) AS [city]
FROM
	[dbo].[Address] AS [t0]
GROUP BY
	[t0].[AddressType],
	SOUNDEX([t0].[City]);
```
{% /code-example %}

### Having Clause
Select a list of address data, grouped by address type and city where the value of city with leading and trailing spaces removed
is "Chicago".
{% code-example %}
```csharp
IEnumerable<dynamic> addresses = db.SelectMany(
		db.fx.Count().As("count"),
		dbo.Address.AddressType
	)
	.From(dbo.Address)
	.GroupBy(
		dbo.Address.AddressType,
		dbo.Address.City
	)
	.Having(
		db.fx.Soundex(dbo.Address.City) == "G452"
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
	[t0].[City]
HAVING
	SOUNDEX([t0].[City]) = @P1;',N'@P1 varchar(4)',@P1='G452'
```
{% /code-example %}


