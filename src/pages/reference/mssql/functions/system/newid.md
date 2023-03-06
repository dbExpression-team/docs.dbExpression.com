---
title: NewId
description: dbExpression NEWID system function
---

{% ms-docs-url label="NewId" path="/functions/newid-transact-sql" /%}
{% supported-versions /%}

## NewId System Function

Use the `NewId` function to return the server's current timestamp as a `DateTime` value.

> Microsoft SQL Server does not require a FROM clause
to execute the `NewId` function, but dbExpression requires a FROM clause to execute
any query.  For this function to execute on it's own, a "dummy" FROM clause must be provided.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.NewId()",
    "returns" : { "typeName" : "Guid" }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select a new id.
{% code-example %}
```csharp
Guid id = db.SelectOne(
        db.fx.NewId()
    )
    .From(dbo.Purchase) // <- "dummy" from clause
    .Execute();
```
```sql
SELECT TOP(1)
    NEWID()
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}