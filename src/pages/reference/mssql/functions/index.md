---
title: Database Functions
description: How to use basic database functions while fluently building query expressions.
---

dbExpression supports various database functions that generally fall into one of the following categories:

[Mathematical](/functions/mathematical)

[Aggregate](/functions/aggregate)

[Conversion](/functions/conversion)

[Date and Time](/functions/date-and-time)

[String](/functions/string)

[Expressions](/functions/expressions)

[System](/functions/system)

Database functions can be used in building QueryExpressions by using `fx`.  If you are using dbExpression in static mode, `fx` is a property of the `db` database accessor (or the name of the database accessor if it was overridden in [scaffolding configuration](/configuration/scaffolding)).  If you are using dbExpression with dependency injection, `fx` is a property of the injected property representing the database accessor.

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

private readonly SimpleConsoleDb _consoleDb;
public SomeService(SimpleConsoleDb consoleDb)
{
    _consoleDb = consoleDb;
}

public string GetSomeValue()
{
    return _consoleDb.SelectOne(
            _consoleDb.fx.Cast(dbo.Person.Id).AsVarChar(20)
        )
        .From(dbo.Person)
        .Execute();
}

```

## SQL Server Version Specific Handling
A few database functions require special handling.  These database functions were either introduced in later versions of 
SQL Server and/or result in different data types based on inputs, where there is no valid way to implement that difference 
in code.  dbExpression will use alternative functions, or deviate from SQL Server when necesary.