---
title: RTrim
description: dbExpression RTRIM string function
---

{% ms-docs-url label="RTrim" path="/functions/rtrim-transact-sql" /%}
{% supported-versions /%}

## RTrim (Right Trim) String Function

Use the `RTrim` function to remove trailing spaces from a string expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.RTrim({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The value to remove trailing spaces from.",
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
Select the a person's last name, with trailing spaces removed.
{% code-example %}
```csharp
IList<long> result = db.SelectMany(
		db.fx.RTrim(dbo.Person.LastName)
	)
	.From(dbo.Person)
	.Execute();
```
```sql
SELECT
	RTRIM([dbo].[Person].[LastName])
FROM
	[dbo].[Person];
```
{% /code-example %}

### Where Clause
Select persons where their last name ends with one or more spaces.
{% code-example %}
```csharp
IList<Person> result = db.SelectMany<Person>()
    .From(dbo.Person)
	.Where(db.fx.RTrim(dbo.Person.LastName) != dbo.Person.LastName)
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
	RTRIM([dbo].[Person].[LastName]) <> [dbo].[Person].[LastName];
```
{% /code-example %}

### Order By Clause
Select a list of persons, ordered by their last name with trailing spaces removed.
{% code-example %}
```csharp
IList<Person> result = db.SelectMany<Person>()
	.From(dbo.Person)
	.OrderBy(db.fx.RTrim(dbo.Person.LastName))
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
	RTRIM([dbo].[Person].[LastName]) ASC;
```
{% /code-example %}

### Group By Clause
Select a list of address values grouped by address type and the value of the city field with trailing spaces removed.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
		dbo.Address.AddressType,
		db.fx.RTrim(dbo.Address.City).As("city")
	)
	.From(dbo.Address)
	.GroupBy(
		dbo.Address.AddressType,
		db.fx.RTrim(dbo.Address.City)
	)
	.Execute();
```
```sql
SELECT
	[dbo].[Address].[AddressType],
	RTRIM([dbo].[Address].[City]) AS [city]
FROM
	[dbo].[Address]
GROUP BY
	[dbo].[Address].[AddressType],
	RTRIM([dbo].[Address].[City]);
```
{% /code-example %}

### Having Clause
Select a list of address data, grouped by address type and city where the value of city with trailing spaces removed
is "Chicago".
{% code-example %}
```csharp
IList<dynamic> addresses = db.SelectMany(
		db.fx.Count().As("count"),
		dbo.Address.AddressType
	)
	.From(dbo.Address)
	.GroupBy(
		dbo.Address.AddressType,
		dbo.Address.City
	)
	.Having(
		db.fx.RTrim(dbo.Address.City) == "Los Angeles"
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
	[dbo].[Address].[City]
HAVING
	RTRIM([dbo].[Address].[City]) = @P2;',N'@P1 nchar(1),@P2 char(11)',@P1=N'*',@P2='Los Angeles'
```
{% /code-example %}


