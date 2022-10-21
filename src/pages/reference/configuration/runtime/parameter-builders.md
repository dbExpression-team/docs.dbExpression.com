---
title: Parameter Builders
---

{% core-concepts caption="parameters" %}
When authoring queries, you have the complete ability to use literal values in arithmetic,
filtering data, functions, etc.  dbExpression will create a database parameter for every
literal value provided.  As dbExpression builds SQL statements, it uses a parameter builder
to convert the literal value into a database parameter.
{% query-execution-sequence-image highlight="Parameter Builder" /%}
{% /core-concept %}

## Generically specify parameter builder type

{% method-descriptor %}
```json
{
    "syntax" : "Use<T>()",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The generic parameter that specifies the type of `ISqlParameterBuilder`.  `T` must have a public parameterless constructor." ,
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
Use `MyParameterBuilder` to create sql parameters for use with a SQL statement:
```csharp
db => db.SqlStatements.Assembly.ParameterBuilder.Use<MyParameterBuilder>()
```
{% /accordian %}

{% method-descriptor %}
```json
{
    "syntax" : "Use({factory})",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true,
            "description" : "A factory responsible for creating a sql parameter builder.",
            "types": [
                { 
                    "typeName" : "Func<ISqlParameterBuilder>", 
                    "description" : "A delegate that returns an instance of an `ISqlParameterBuilder`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,ISqlParameterBuilder>", 
                    "description" : "A delegate that receives a service provider and returns an instance of an `ISqlParameterBuilder`." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use `MyParameterBuilder` to build parameters for use with a SQL statement:
```csharp
db => db.SqlStatements.Assembly.ParameterBuilder.Use<MyParameterBuilder>(
        () => new MyParameterBuilder()
    )
```

Use `MyParameterBuilder` to create a parameter builder:
```csharp
db => db.SqlStatements.Assembly.ParameterBuilder.Use<MyParameterBuilder>(
        sp => sp.GetRequiredService<MyParameterBuilder>()
    )
```
{% /accordian %}