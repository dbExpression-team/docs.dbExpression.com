---
title: GetDate
description: dbExpression GETDATE date time function
---

{% ms-docs-url label="GetDate" path="/functions/getdate-transact-sql" /%}
{% supported-versions /%}

## GetDate Date and Time Function

Use the `GetDate` function to return the server's current timestamp as a `DateTime` value.

> Microsoft SQL Server does not require a FROM clause
to execute the `GetDate` function, but dbExpression requires a FROM clause to execute
any query.  For this function to execute on it's own, a "dummy" FROM clause must be provided.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.GetDate()",
    "returns" : { "typeName" : "DateTime" }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the server's current date and time.
{% code-example %}
```csharp
DateTime current = db.SelectOne(
        db.fx.GetDate()
    )
    .From(dbo.Purchase) // <- "dummy" from clause
    .Execute();
```
```sql
SELECT TOP(1)
    GETDATE()
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}