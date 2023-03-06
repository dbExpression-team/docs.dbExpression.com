---
title: Len
description: dbExpression LEN Length string function
---

{% ms-docs-url label="Len" path="/functions/len-transact-sql" /%}
{% supported-versions /%}

## Len (Length) String Function

Use the `Len` function to return the number of characters in a string expression.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Len({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The value to determine the length of.",
            "types": [
                { 
                    "typeName" : "AnyStringElement"
                }
            ]
        }           
    ],
    "returns" : { 
        "typeName" : "long or long?",
		"description" : "(depending on the nullability of `expression`)"
    }
}
```
{% /method-descriptor %}

> Microsoft SQL Server returns *bigint* if expression is of the *varchar(max)*, *varbinary(max)*, or *nvarchar(max)* data types; otherwise, *int*. 
dbExpression generally maps these to CLR types `long` and `int` respectively. As the dbExpression implementation for `Len` works 
with the CLR type `string`, there is no way to effect a different return type based on the length of the 
provided `{expression}` method parameter. Therefore, `Len` in dbExpression always returns `long` or `long?`.

## Examples
### Select Statement
Select the length of a person's last name.
{% code-example %}
```csharp
IEnumerable<long> result = db.SelectMany(
		db.fx.Len(dbo.Person.LastName)
	)
	.From(dbo.Person)
	.Execute();
```
```sql
SELECT
	LEN([dbo].[Person].[LastName])
FROM
	[dbo].[Person];
```
{% /code-example %}

### Where Clause
Select persons whose last name is longer than their first name.
{% code-example %}
```csharp
IEnumerable<Person> persons = db.SelectMany<Person>()
	.From(dbo.Person)
	.Where(db.fx.Len(dbo.Person.LastName) > db.fx.Len(dbo.Person.FirstName))
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
	LEN([t0].[LastName]) > LEN([t0].[FirstName]);
```
{% /code-example %}

### Order By Clause
Select a list of persons, ordered descending by the length of their last name.
{% code-example %}
```csharp
IEnumerable<Person> result = db.SelectMany<Person>()
	.From(dbo.Person)
	.OrderBy(db.fx.Len(dbo.Person.LastName).Desc())
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
	LEN([t0].[LastName]) DESC;
```
{% /code-example %}

### Group By Clause
Select a list of address values grouped by address type and the length of the city field.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
		dbo.Address.AddressType,
		db.fx.Len(dbo.Address.City).As("city")
	)
	.From(dbo.Address)
	.GroupBy(
		dbo.Address.AddressType,
		db.fx.Len(dbo.Address.City)
	)
	.Execute();
```
```sql
SELECT
	[t0].[AddressType],
	LEN([t0].[City]) AS [city]
FROM
	[dbo].[Address] AS [t0]
GROUP BY
	[t0].[AddressType],
	LEN([t0].[City]);
```
{% /code-example %}

### Having Clause
Select a list of address data, grouped by address type and city where the value of city has only 1 character.
{% code-example %}
```csharp
IEnumerable<dynamic> addresses = db.SelectMany(
		db.fx.Count().As("count"),
		dbo.Address.AddressType,
		dbo.Address.City
	)
	.From(dbo.Address)
	.GroupBy(
		dbo.Address.AddressType,
		dbo.Address.City
	)
	.Having(
		db.fx.Len(dbo.Address.City) == 1
	)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(*) AS [count],
	[t0].[AddressType],
	[t0].[City]
FROM
	[dbo].[Address] AS [t0]
GROUP BY
	[t0].[AddressType],
	[t0].[City]
HAVING
	LEN([t0].[City]) = @P1;',N'@P1 int',@P1=1
```
{% /code-example %}


