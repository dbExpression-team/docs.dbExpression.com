---
title: SysUtcDate
description: dbExpression SYSUTCDATETIME date time function
---

{% ms-docs-url label="SysUtcDateTime" path="/functions/sysutcdatetime-transact-sql" /%}
{% supported-versions /%}

## SysUtcDate Date and Time Function

Use the `SysUtcDateTime` function to return the server's current date and time in UTC format (no timezone offset).

> Microsoft SQL Server does not require a FROM clause
to execute the `SysUtcDateTime` function, but dbExpression requires a FROM clause to execute
any query.  For this function to execute on it's own, a "dummy" FROM clause must be provided.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.SysUtcDateTime()",
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
        db.fx.SysUtcDateTime()
    )
    .From(dbo.Purchase) // <- "dummy" from clause
    .Execute();
```
```sql
SELECT TOP(1)
    SYSUTCDATETIME()
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}