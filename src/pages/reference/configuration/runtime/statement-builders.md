---
title: Statement Builders
---

{% core-concepts caption="statement builder" %}

Configure options for creating builders that turn a QueryExpression into a SQL statement for execution. *It is very rare, or very advanced use cases, that you would need to override the default implementations for building SQL statements*. `StatementBuilder` options are fluently available using `SqlStatements.Assembly.StatementBuilder`.

{% query-execution-sequence-image highlight="Statement Builder" /%}
{% /core-concept %}

## Generically specify a builder type
{% method-descriptor %}
```json
{
    "syntax" : "Use<T>()",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The generic parameter that specifies the type of statement builder, where `T` is a `ISqlStatementBuilder`.  `T` must have a public parameterless constructor." ,
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
Use `MyStatementBuilder` when constructing a sql statement from a query expression:
```csharp
db => db.SqlStatements.Assembly.StatementBuilder.Use<MyStatementBuilder>()
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
            "description" : "A factory responsible for creating sql statement builders." ,
            "default": "",
            "types": [
                { 
                    "typeName" : "Func<ISqlStatementBuilder>", 
                    "description" : "A delegate that returns an instance of an `ISqlStatementBuilder`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,ISqlStatementBuilder>", 
                    "description" : "A delegate receiving a `IServiceProvider` that returns an instance of an `ISqlStatementBuilder`." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use `MyStatementBuilder` when constructing a sql statement from a query expression:
```csharp
db => db.SqlStatements.Assembly.StatementBuilder.Use(
        () => new MyStatementBuilder()
    )
```

Use `MyStatementBuilder` when constructing a sql statement from a query expression:
```csharp
db => db.SqlStatements.Assembly.StatementBuilder.Use(
        sp => sp.GetRequiredService<MyStatementBuilder>()
    )
```
{% /accordian %}

