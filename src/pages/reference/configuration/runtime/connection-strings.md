---
title: Connection Strings
---

Configure options for providing a connection string to dbExpression.

## Generically specify a factory type

{% method-descriptor %}
```json
{
    "syntax" : "Use<T>()",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The generic parameter that specifies the type that implements `IConnectionStringFactory`. `T` must have a public parameterless constructor." ,
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
Use a value provided by configuration:
```csharp
db => db.ConnectionString.Use<MyConnectionStringFactory>();
```
{% /accordian %}

---

## Use a static string

{% method-descriptor %}
```json
{
    "syntax" : "Use({connection_string})",
    "arguments" : [
        {
            "argumentName" : "connection_string",
            "required" : true, 
            "description" : "The connection string dbExpression will use to connect to the database.",
            "types": [
                { 
                    "typeName" : "string" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use a static value:
```csharp
db => db.ConnectionString.Use("server=myserver,database=mydatabase...");
```

Use a value provided by configuration:
```csharp
db => db.ConnectionString.Use(Configuration.GetConnectionString("MyDatabase"));
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
            "description" : "A factory that returns a connection string.",
            "types": [
                { 
                    "typeName" : "IConnectionStringFactory", 
                    "description" : "An implementation of `IConnectionStringFactory`." 
                },
                { 
                    "typeName" : "Func<string>", 
                    "description" : "A delegate returning a connection string." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,IConnectionStringFactory>", 
                    "description" : "A delegate that receives a service provider and returns an implementation of `IConnectionStringFactory`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,string>", 
                    "description" : "A delegate that receives a service provider and returns a connection string." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use a value provided by configuration:
```csharp
db => db.ConnectionString.Use(new MyConnectionStringFactory());
```

Use a value provided by configuration:
```csharp
db => db.ConnectionString.Use(() => Configuration.GetConnectionString("MyDatabase"));
```
Use the service provider to resolve a connection string factory:
```csharp
db => db.ConnectionString.Use(sp => sp.GetRequiredService<MyConnectionStringFactory>());
```

Use the service provider to resolve a connection string:
```csharp
db => db.ConnectionString.Use(
        sp => sp.GetRequiredService<DatabaseConfiguration>()
            .ConnectionString
        );
```
{% /accordian %}
