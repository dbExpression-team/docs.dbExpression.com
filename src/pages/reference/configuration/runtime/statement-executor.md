---
title: Statement Executor
---

Configure options for executing SQL statements against the target database.

{% core-concepts caption="statement executor" %}
{% query-execution-sequence-image highlight="Statement Executor" /%}
{% /core-concept %}

## Generically specify type

{% method-descriptor %}
```json
{
    "syntax" : "Use<T>()",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The generic parameter that specifies the type that implements `ISqlStatementExecutor`. `T` must have a public parameterless constructor." ,
            "types": [
                { 
                    "typeName" : "Type"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
The following will use `MyStatementExecutor` to execute sql statements:
```csharp
db => db.SqlStatements.QueryExecution.Executor.Use<MyStatementExecutor>()
```
{% /accordian %}

---

## Use a factory

{% method-descriptor %}
```json
{
    "syntax" : "Use({factory})",
    "arguments" : [
        {
            "argumentName" : "factory",
            "required" : true, 
            "description" : "A factory responsible for creating sql statement executors." ,
            "types": [
                { 
                    "typeName" : "Func<ISqlStatementExecutor>", 
                    "description" : "A delegate that returns an instance of a type that implements `ISqlStatementExecutor`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,ISqlStatementExecutor>", 
                    "description" : "A delegate that receives a service provider and returns an instance of a type that implements `ISqlStatementExecutor`." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use `MyStatementExecutor` to create an appender to write the state of expression elements:
```csharp
db => db.SqlStatements.QueryExecution.Executor.Use<MyStatementExecutor>(
        () => new MyStatementExecutor()
    )
```

Use `MyStatementExecutor` to create an appender to write the state of expression elements:
```csharp
db => db.SqlStatements.QueryExecution.Executor.Use<MyStatementExecutor>(
        sp => sp.GetRequiredService<MyStatementExecutor>()
    )
```
{% /accordian %}