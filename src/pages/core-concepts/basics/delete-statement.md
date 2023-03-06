---
title: Delete Statements
description: Fluently build a DELETE sql statement using dbExpression.
---

Using dbExpression, you can compose and execute direct deletes against the target database without first retrieving 
affected records.

> In addition to `Execute`, `Delete` includes `ExecuteAsync` to asynchronously delete data.

The following query issues a delete to the *Purchase* table where *Purchase.Id* equals the literal value `9`.

{% code-example %}
```csharp
int idToDelete = 9;

int affected = db.Delete()
    .From(dbo.Product)
    .Where(dbo.Product.Id == idToDelete)
    .Execute();
```
```sql
exec sp_executesql N'DELETE
    [t0]
FROM
    [dbo].[Product] AS [t0]
WHERE
    [t0].[Id] = @P1;
SELECT @@ROWCOUNT;',N'@P1 int',@P1=9
```
{% /code-example %}

> Execution of a delete query returns the affected row count.
