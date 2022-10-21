---
title: Sync and Async Query Execution
---

All dbExpression execution methods are exposed in synchronous and asynchronous variations.  To avoid duplication, examples in the docs will use the synchronous API option.
Switching any example from sync to async is as simple as changing the ending `Execute` to `ExecuteAsync`:

## Synchronous
```csharp
Person? person = db.SelectOne<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.Id == 1)
    .Execute();
```

## Asynchronous
```csharp
Person? person = await db.SelectOne<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.Id == 1)
    .ExecuteAsync();
```