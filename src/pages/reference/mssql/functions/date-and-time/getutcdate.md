---
title: GetUtcDate
description: dbExpression GETUTCDATE date time function
---

{% ms-docs-url label="GetUtcDate" path="/functions/getutcdate-transact-sql" /%}
{% supported-versions /%}

## GetUtcDate Date and Time Function

Use the `GetUtcDate` function to return the server's current timestamp as a `DateTime` value in UTC format (no timezone offset).

> Microsoft SQL Server does not require a FROM clause
to execute the `GetDate` function, but dbExpression requires a FROM clause to execute
any query.  For this function to execute on it's own, a "dummy" FROM clause must be provided.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.GetUtcDate()",
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
        db.fx.GetUtcDate()
    )
    .From(dbo.Purchase) // <- "dummy" from clause
    .Execute();
```
```sql
SELECT TOP(1)
	GETUTCDATE()
FROM
	[dbo].[Purchase];
```
{% /code-example %}