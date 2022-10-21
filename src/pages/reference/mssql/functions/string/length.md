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
IList<long> result = db.SelectMany(
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
IList<Person> persons = db.SelectMany<Person>()
	.From(dbo.Person)
	.Where(db.fx.Len(dbo.Person.LastName) > db.fx.Len(dbo.Person.FirstName))
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
	LEN([dbo].[Person].[LastName]) > LEN([dbo].[Person].[FirstName]);
```
{% /code-example %}

### Order By Clause
Select a list of persons, ordered descending by the length of their last name.
{% code-example %}
```csharp
IList<Person> result = db.SelectMany<Person>()
	.From(dbo.Person)
	.OrderBy(db.fx.Len(dbo.Person.LastName).Desc)
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
	LEN([dbo].[Person].[LastName]) DESC;
```
{% /code-example %}

### Group By Clause
Select a list of address values grouped by address type and the length of the city field.
{% code-example %}
```csharp
IList<dynamic> values = db.SelectMany(
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
	[dbo].[Address].[AddressType],
	LEN([dbo].[Address].[City]) AS [city]
FROM
	[dbo].[Address]
GROUP BY
	[dbo].[Address].[AddressType],
	LEN([dbo].[Address].[City]);
```
{% /code-example %}

### Having Clause
Select a list of address data, grouped by address type and city where the value of city has only 1 character.
{% code-example %}
```csharp
IList<dynamic> addresses = db.SelectMany(
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
		db.fx.Len(dbo.Address.City) = 1
	)
	.Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(@P1) AS [count],
	[dbo].[Address].[AddressType],
	[dbo].[Address].[City]
FROM
	[dbo].[Address]
GROUP BY
	[dbo].[Address].[AddressType],
	[dbo].[Address].[City]
HAVING
	LEN([dbo].[Address].[City]) = @P2;',N'@P1 nchar(1),@P2 bigint',@P1=N'*',@P2=1
```
{% /code-example %}


