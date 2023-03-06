---
title: SysDateTime
description: dbExpression SYSDATETIME date time function
---

{% ms-docs-url label="SysDateTime" path="/functions/sysdatetime-transact-sql" /%}
{% supported-versions /%}

## SysDateTime Date and Time Function

Use the `SysDateTime` function to return the server's current date and time.

> Microsoft SQL Server does not require a FROM clause
to execute the `SysDateTime` function, but dbExpression requires a FROM clause to execute
any query.  For this function to execute on it's own, a "dummy" FROM clause must be provided.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.SysDateTime()",
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
        db.fx.SysDateTime()
    )
    .From(dbo.Purchase) // <- "dummy" from clause
    .Execute();
```
```sql
SELECT TOP(1)
    SYSDATETIME()
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}