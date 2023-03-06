---
title: SysDateTimeOffset
description: dbExpression SYSDATETIMEOFFSET date time function
---

{% ms-docs-url label="SysDateTimeOffset" path="/functions/sysdatetimeoffset-transact-sql" /%}
{% supported-versions /%}

## SysDateTimeOffset Date and Time Function

Use the `SysDateTimeOffset` function to return the server's current date and time.

> Microsoft SQL Server does not require a FROM clause
to execute the `SysDateTime` function, but dbExpression requires a FROM clause to execute
any query.  For this function to execute on it's own, a "dummy" FROM clause must be provided.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.SysDateTimeOffset()",
    "returns" : { "typeName" : "DateTimeOffset" }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the server's current date and time.
{% code-example %}
```csharp
DateTimeOffset current = db.SelectOne(
        db.fx.SysDateTimeOffset()
    )
    .From(dbo.Purchase) // <- "dummy" from clause
    .Execute();
```
```sql
SELECT TOP(1)
    SYSDATETIMEOFFSET()
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}