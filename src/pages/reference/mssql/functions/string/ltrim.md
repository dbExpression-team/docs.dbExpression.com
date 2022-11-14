---
title: LTrim
description: dbExpression LTRIM string function
---

{% ms-docs-url label="LTrim" path="/functions/ltrim-transact-sql" /%}
{% supported-versions /%}

## LTrim (Left Trim) String Function

Use the `LTrim` function to remove leading spaces from a string expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.LTrim({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The value to remove leading spaces from.",
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
Select the a person's last name, with leading spaces removed.
{% code-example %}
```csharp
IEnumerable<long> result = db.SelectMany(
		db.fx.LTrim(dbo.Person.LastName)
	)
	.From(dbo.Person)
	.Execute();
```
```sql
SELECT
	LTRIM([dbo].[Person].[LastName])
FROM
	[dbo].[Person];
```
{% /code-example %}

### Where Clause
Select persons where their last name starts with one or more spaces.
{% code-example %}
```csharp
IEnumerable<Person> result = db.SelectMany<Person>()
    .From(dbo.Person)
	.Where(db.fx.LTrim(dbo.Person.LastName) != dbo.Person.LastName)
	.Execute();
```
```sql
SELECT
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
WHERE
	LTRIM([dbo].[Person].[LastName]) <> [dbo].[Person].[LastName];
```
{% /code-example %}

### Order By Clause
Select a list of persons, ordered by their last name with leading spaces removed.
{% code-example %}
```csharp
IEnumerable<Person> result = db.SelectMany<Person>()
	.From(dbo.Person)
	.OrderBy(db.fx.LTrim(dbo.Person.LastName))
	.Execute();
```
```sql
SELECT
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
	LTRIM([dbo].[Person].[LastName]) ASC;
```
{% /code-example %}

### Group By Clause
Select a list of address values grouped by address type and the value of the city field with leading spaces removed.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
		dbo.Address.AddressType,
		db.fx.LTrim(dbo.Address.City).As("city")
	)
	.From(dbo.Address)
	.GroupBy(
		dbo.Address.AddressType,
		db.fx.LTrim(dbo.Address.City)
	)
	.Execute();
```
```sql
SELECT
	[dbo].[Address].[AddressType],
	LTRIM([dbo].[Address].[City]) AS [city]
FROM
	[dbo].[Address]
GROUP BY
	[dbo].[Address].[AddressType],
	LTRIM([dbo].[Address].[City]);
```
{% /code-example %}

### Having Clause
Select a list of address data, grouped by address type and city where the value of city with leading spaces removed
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
		db.fx.LTrim(dbo.Address.City) == "Chicago"
	)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(*) AS [count],
	LTRIM([dbo].[Address].[City])
FROM
	[dbo].[Address]
GROUP BY
	[dbo].[Address].[AddressType],
	LTRIM([dbo].[Address].[City])
HAVING
	LTRIM([dbo].[Address].[City]) = @P2;',N'@P1 nchar(1),@P2 char(7)',@P1=N'*',@P2='Chicago'
```
{% /code-example %}


