---
title: Like
description: dbExpression LIKE operation
---

{% ms-docs-url label="In" path="/language-elements/like-transact-sql" /%}
{% supported-versions /%}

Use the `Like` operation to find values that match the provided pattern.

{% core-concepts caption="logical operators" %}
`Like` is one of the set of logical operators used to create filter expressions.
{% partial file="logical-operators-partial.md" /%}
{% /core-concepts %}

{% method-descriptor %}
```json
{
    "syntax" : "{string_element}.Like({pattern})",
    "arguments" : [
        {
            "argumentName" : "string_element",
            "required" : true,
            "description" : "The element to search for `pattern`.",
            "types": [
                { 
                    "typeName" : "AnyStringElement", 
                    "description" : "Any expression typed as a string, for example:",
					"notes" : [
						"FieldExpression that is a string field in the database",
						"Functions that produce a `AnyStringElement`"
					]
                }
            ]
        },
		{
            "argumentName" : "pattern",
            "required" : true, 
			"description" : "The pattern to use to find values that match." ,
            "types": [
                { 
                    "typeName" : "string"
                }
            ]
        }
    ],
    "returns" : {
        "typeName" : "FilterExpression",
        "description" : "An expression that can be used anywhere a logical expression can be used:",
		"notes" : [
			"Where clause",
			"Join clause",
			"Having clause"
		]
    }
}
```
{% /method-descriptor %}

> Prefix the `Like` expression with `!` to negate the expression.

## Examples

### Where Clause

Find all persons where their first name starts with the letter 'J'
{% code-example %}
```csharp
IEnumerable<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.FirstName.Like("J%"))
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
WHERE
	[t0].[FirstName] LIKE @P1;',N'@P1 char(2)',@P1='J%'
```
{% /code-example %}

Find all persons where their first name does not start with the letter 'J'
{% code-example %}
```csharp
IEnumerable<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .Where(!dbo.Person.FirstName.Like("J%"))
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
WHERE
	NOT ([t0].[FirstName] LIKE @P1);',N'@P1 char(2)',@P1='J%'
```
{% /code-example %}

### Having Clause

Find unique product names that have the word 'Book' in the name
{% code-example %}
```csharp
IEnumerable<string> product_counts = db.SelectMany(
        dbo.Product.Name
    )
    .From(dbo.Product)
    .GroupBy(dbo.Product.Name)
    .Having(dbo.Product.Name.Like("%Book%"))
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[Name]
FROM
	[dbo].[Product] AS [t0]
GROUP BY
	[t0].[Name]
HAVING
	[t0].[Name] LIKE @P1;',N'@P1 char(6)',@P1='%Book%'
```
{% /code-example %}

### Join Clause

Find all persons who live in a zip code that starts with '80'
{% code-example %}
```csharp
IEnumerable<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .InnerJoin(dbo.PersonAddress).On(dbo.Person.Id == dbo.PersonAddress.PersonId)
    .InnerJoin(dbo.Address).On(
        dbo.Address.Zip.Like("80%")
        &
        dbo.PersonAddress.AddressId == dbo.Address.Id
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
	INNER JOIN [dbo].[Person_Address] AS [t1] ON [t0].[Id] = [t1].[PersonId]
	INNER JOIN [dbo].[Address] AS [t2] ON [t2].[Zip] LIKE @P1
	AND
	[t1].[AddressId] = [t2].[Id];',N'@P1 char(3)',@P1='80%'
```
{% /code-example %}

ind all persons who don't live in a zip code that starts with '80'
{% code-example %}
```csharp
IEnumerable<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .InnerJoin(dbo.PersonAddress).On(dbo.Person.Id == dbo.PersonAddress.PersonId)
    .InnerJoin(dbo.Address).On(
        !dbo.Address.Zip.Like("80%")
        &
        dbo.PersonAddress.AddressId == dbo.Address.Id
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
	INNER JOIN [dbo].[Person_Address] AS [t1] ON [t0].[Id] = [t1].[PersonId]
	INNER JOIN [dbo].[Address] AS [t2] ON NOT ([t2].[Zip] LIKE @P1)
	AND
	[t1].[AddressId] = [t2].[Id];',N'@P1 char(3)',@P1='80%'
```
{% /code-example %}



