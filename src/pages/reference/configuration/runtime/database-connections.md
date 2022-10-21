---
title: Database Connections
---

Configure options for the services responsible for creating database connections.

{% core-concepts caption="connection" %}
{% query-execution-sequence-image highlight="Connection" /%}
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
            "description" : "The generic parameter that specifies the type that implements `IDbConnectionFactory`. `T` must have a public parameterless constructor.",
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
Use `MyConnectionFactory` to create database connections:
```csharp
db => db.SqlStatements.QueryExecution.Connection.Use<MyConnectionFactory>()
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
            "description" : "A factory responsible for returning a connection." ,
            "types": [
                { 
                    "typeName" : "Func<IDbConnection>", 
                    "description" : "A delegate that returns an instance of a type that implements `IDbConnection`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,IDbConnection>", 
                    "description" : "A delegate that receives a service provider and returns an instance of a type that implements `IDbConnection`." 
                },
                { 
                    "typeName" : "Func<IDbConnectionFactory>", 
                    "description" : "A delegate that returns an instance of a type that implements `IDbConnectionFactory`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,IDbConnectionFactory>", 
                    "description" : "A delegate that receives a service provider and returns an instance of a type that implements `IDbConnectionFactory`." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
The following will return a `MyDbConnection` (a connection to the database):
```csharp
db => db.SqlStatements.QueryExecution.Connection.Use(
        () => new MyDbConnection()
    )
```

Use `MyConnectionFactory` to create connections to the database:
```csharp
db => db.SqlStatements.QueryExecution.Connection.Use<MyConnectionFactory>(
        () => new MyConnectionFactory()
    )
```

Use the Service Provider to resolve a connection to the database:
```csharp
db => db.SqlStatements.QueryExecution.Connection.Use(
        sp => sp.GetRequiredService<IDbConnection>()
    )
```

Use the Service Provider to resolve a factory to create connections to the database:
```csharp
db => db.SqlStatements.QueryExecution.Executor.Use<MyConnectionFactory>(
        sp => sp.GetRequiredService<MyConnectionFactory>()
    )
```
{% /accordian %}