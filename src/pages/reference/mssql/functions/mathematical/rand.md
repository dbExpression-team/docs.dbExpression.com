---
title: Rand
description: dbExpression RAND Random mathematical function
---

{% ms-docs-url label="Rand" path="/functions/rand-transact-sql" /%}
{% supported-versions /%}

## Rand (Random) Mathematical Function

Use the `Rand` function to return random value, optionally using a seed value.

> Microsoft SQL Server does not require a FROM clause
to execute the `Rand` function, but dbExpression requires a FROM clause to execute
any query.  For this function to execute on it's own, a "dummy" FROM clause must be provided.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Rand({seed_expression})",
    "arguments" : [
        {
            "argumentName" : "seed_expression",
            "required" : true,
            "types": [
                { 
                    "typeName" : "byte"
                },
				{ 
                    "typeName" : "AnyElement<byte>"
                },
				{ 
                    "typeName" : "AnyElement<byte?>"
                },
				{ 
                    "typeName" : "short"
                },
				{ 
                    "typeName" : "AnyElement<short>"
                },
				{ 
                    "typeName" : "AnyElement<short?>"
                },
				{ 
                    "typeName" : "int"
                },
				{ 
                    "typeName" : "AnyElement<int>"
                },
				{ 
                    "typeName" : "AnyElement<int?>"
                }
            ]
        }
    ],
	"returns" : {
		"typeName" : "float"
	}
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select a random value from the database.
{% code-example %}
```csharp
float? result = db.SelectOne(
        db.fx.Rand()
    )
    .From(dbo.Product)
    .Execute();
```
```sql
SELECT TOP(1)
    RAND()
FROM
    [dbo].[Product] AS [t0];
```
{% /code-example %}

### Select Statement with Seed
Select a random value using a product's id as a seed value.
{% code-example %}
```csharp
IEnumerable<float> results = db.SelectMany(
        db.fx.Rand(dbo.Product.Id)
    )
    .From(dbo.Product)
    .Execute();
```
```sql
SELECT
    RAND([t0].[Id])
FROM
    [dbo].[Product] AS [t0]
```
{% /code-example %}
