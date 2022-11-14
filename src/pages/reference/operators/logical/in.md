---
title: In
description: dbExpression IN operation
---

{% ms-docs-url label="In" path="/language-elements/in-transact-sql" /%}
{% supported-versions /%}

Use the `In` operation to determine if a value matches any values.

{% core-concepts caption="logical operators" %}
`In` is one of the set of logical operators used to create filter expressions.
{% partial file="logical-operators-partial.md" /%}
{% /core-concepts %}

{% method-descriptor %}
```json
{
    "syntax" : "{field_expression}.In({listOf} {values})",
    "arguments" : [
        {
            "argumentName" : "field_expression",
            "required" : true, 
            "description" : "An expression representing a field in a database table." ,
            "types": [
                { 
                    "typeName" : "FieldExpression<T>"
                }
            ]
        },
		{
            "argumentName" : "listOf",
            "required" : true,
            "description" : "The values to use for compare against `field_expression`.",
            "types": [
                { 
                    "typeName" : "Type[]", 
                    "description" : "An array or params of the items to use for comparison. `Type` is the same type as the generic parameter of the `FieldExpression<T>`." 
                },
				{ 
                    "typeName" : "IEnumerable<Type>", 
                    "description" : "A list of items to use for comparison. `Type` is the same type as the generic parameter of the `FieldExpression<T>`." 
                }
            ]
        },
		{
            "argumentName" : "values",
            "required" : true, 
                "description" : "The items in the array to use for comparison.",
            "types": [
                { 
                    "typeName" : "Type" 
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

> Prefix the `In` expression with `!` to negate the expression.

## Examples

### Where Clause
Find all persons where their first name is one of the values in the list
{% code-example %}
```csharp
IEnumerable<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.FirstName.In("Jane", "John", "Mary", "Joe"))
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
WHERE
	[dbo].[Person].[FirstName] IN (@P1,@P2,@P3,@P4);',N'@P1 varchar(20),@P2 varchar(20),@P3 varchar(20),@P4 varchar(20)',@P1='Jane',@P2='John',@P3='Mary',@P4='Joe'
```
{% /code-example %}

Find all persons where their first name is not one of the values in the list
{% code-example %}
```csharp
IEnumerable<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .Where(!dbo.Person.FirstName.In("Jane", "John", "Mary", "Joe"))
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
WHERE
	NOT ([dbo].[Person].[FirstName] IN (@P1,@P2,@P3,@P4));',N'@P1 varchar(20),@P2 varchar(20),@P3 varchar(20),@P4 varchar(20)',@P1='Jane',@P2='John',@P3='Mary',@P4='Joe'
```
{% /code-example %}

### Having Clause
Find product counts by category having a category value in the list
{% code-example %}
```csharp
IEnumerable<dynamic> product_counts = db.SelectMany(
        dbo.Product.ProductCategoryType,
        db.fx.Count().As("CategoryCount")
    )
    .From(dbo.Product)
    .GroupBy(dbo.Product.ProductCategoryType)
    .Having(
        dbo.Product.ProductCategoryType.In(
            ProductCategoryType.Books, 
            ProductCategoryType.ToysAndGames, 
            ProductCategoryType.Electronics
        )
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Product].[ProductCategoryType],
	COUNT(@P1) AS [CategoryCount]
FROM
	[dbo].[Product]
GROUP BY
	[dbo].[Product].[ProductCategoryType]
HAVING
	[dbo].[Product].[ProductCategoryType] IN (@P2,@P3,@P4);',N'@P1 nchar(1),@P2 int,@P3 int,@P4 int',@P1=N'*',@P2=3,@P3=1,@P4=2
```
{% /code-example %}

### Join Clause
{% code-example %}
```csharp
IEnumerable<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .InnerJoin(dbo.PersonAddress).On(
        dbo.PersonAddress.PersonId.In(1, 12, 14) 
        & 
        dbo.PersonAddress.PersonId == dbo.Person.Id
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
	INNER JOIN [dbo].[Person_Address] ON [dbo].[Person_Address].[PersonId] IN (@P1,@P2,@P3)
	AND
	[dbo].[Person_Address].[PersonId] = [dbo].[Person].[Id];',N'@P1 int,@P2 int,@P3 int',@P1=1,@P2=12,@P3=14
```
{% /code-example %}



