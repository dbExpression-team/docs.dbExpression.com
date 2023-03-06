---
title: Trim
description: dbExpression TRIM string function
---

{% ms-docs-url label="Trim" path="/functions/trim-transact-sql" /%}
{% supported-versions initial_version=2017 /%}

## Trim String Function

Use the `Trim` function to remove leading and trailing spaces from a string expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Trim({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The value to remove leading and trailing spaces from.",
            "types": [
                { 
                    "typeName" : "AnyStringElement"
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
Select the a person's last name, with leading and trailing spaces removed.
{% code-example %}
```csharp
IEnumerable<string> result = db.SelectMany(
		db.fx.Trim(dbo.Person.LastName)
	)
	.From(dbo.Person)
	.Execute();
```
```sql
SELECT
	TRIM([t0].[LastName])
FROM
	[dbo].[Person] AS [t0];
```
{% /code-example %}

### Where Clause
Select persons where their last name starts or ends with one or more spaces.
{% code-example %}
```csharp
IEnumerable<Person> result = db.SelectMany<Person>()
    .From(dbo.Person)
	.Where(db.fx.Trim(dbo.Person.LastName) != dbo.Person.LastName)
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
	TRIM([t0].[LastName]) <> [t0].[LastName];
```
{% /code-example %}

### Order By Clause
Select a list of persons, ordered by their last name with leading and trailing spaces removed.
{% code-example %}
```csharp
IEnumerable<Person> result = db.SelectMany<Person>()
	.From(dbo.Person)
	.OrderBy(db.fx.Trim(dbo.Person.LastName))
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
	TRIM([t0].[LastName]) ASC;
```
{% /code-example %}

### Group By Clause
Select a list of address values grouped by address type and the value of the city field with leading and trailing spaces removed.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
		dbo.Address.AddressType,
		db.fx.Trim(dbo.Address.City).As("city")
	)
	.From(dbo.Address)
	.GroupBy(
		dbo.Address.AddressType,
		db.fx.Trim(dbo.Address.City)
	)
	.Execute();
```
```sql
SELECT
	[t0].[AddressType],
	TRIM([t0].[City]) AS [city]
FROM
	[dbo].[Address] AS [t0]
GROUP BY
	[t0].[AddressType],
	TRIM([t0].[City]);
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
		db.fx.Trim(dbo.Address.City) == "Los Angeles"
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
	TRIM([t0].[City]) = @P1;',N'@P1 varchar(11)',@P1='Los Angeles'
```
{% /code-example %}


