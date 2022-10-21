---
title: Database Functions
description: How to use basic database functions while fluently building query expressions.
---

Database functions can be used in building queries by using `fx`.  If you're using dbExpression in 
static mode, `fx` is a property of the `db` database accessor (or the name of the database accessor 
if it was overridden in [scaffolding configuration](../../core-concepts/configuration/scaffolding)). 
If you're using dbExpression with dependency injection, `fx` is a property of the instance 
(representing the database accessor) injected into your service.

> Use the `fx` property of the database accessor to use database functions

When using dbExpression in static mode:
```csharp
public string GetSomeValue()
{
    return db.SelectOne(
            db.fx.Cast(dbo.Person.Id).AsVarChar(20)
        )
        .From(dbo.Person)
        .Execute();
}
```

When using dbExpression with dependency injection:
```csharp
...

private readonly MyDatabase _myDb;
public SomeService(MyDatabase myDb)
{
    _myDb = myDb;
}

public string GetSomeValue()
{
    return _myDb.SelectOne(
            _myDb.fx.Cast(dbo.Person.Id).AsVarChar(20)
        )
        .From(dbo.Person)
        .Execute();
}

```

## Supported Functions

dbExpression supports many of the native SQL functions provided by Microsoft SQL Server. The
following tables list all of the functions dbExpression supports, grouped by general category.

### Mathematical

{% partial file="mathematical-function-list-partial.md" /%}

### Aggregate

{% partial file="aggregate-function-list-partial.md" /%}

### Conversion

{% partial file="conversion-function-list-partial.md" /%}

### Date and Time

{% partial file="date-time-function-list-partial.md" /%}

### String

{% partial file="string-function-list-partial.md" /%}

### Expressions

{% partial file="expression-function-list-partial.md" /%}

### System

{% partial file="system-function-list-partial.md" /%}