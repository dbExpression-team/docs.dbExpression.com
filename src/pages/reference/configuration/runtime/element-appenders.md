---
title: Element Appenders
---

Configure options for creating appenders that write an element's state to an appender.

{% core-concepts caption="element appender" %}
{% query-execution-sequence-image highlight="Element Appender" /%}
{% /core-concepts %}

## Generically specify an element appender factory

{% method-descriptor %}
```json
{
    "syntax" : "Use<T>()",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The generic parameter that specifies the type of `IExpressionElementAppenderFactory` to use in creating element appenders.  `T` must have a public parameterless constructor.",
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
The following will use `MyAppenderFactory` to create instances of element appenders:
```csharp
db => db.SqlStatements.Assembly.ElementAppender.Use<MyAppenderFactory()
```
{% /accordian %}

---

## Use a factory

{% method-descriptor %}
```json
{
    "syntax" : "Use({factory}[,{configureTypes}])",
    "arguments" : [
        {
            "argumentName" : "factory",
            "required" : true, 
            "description" : "A factory responsible for returning expression element appenders." ,
            "types": [
                {
                    "typeName" : "IExpressionElementAppenderFactory",
                    "description" : "An instance of an `IExpressionElementAppenderFactory`."
                },
                {
                    "typeName" : "Func<IExpressionElementAppenderFactory>",
                    "description" : "A delegate that returns an instance of an `IExpressionElementAppenderFactory`."
                },
                {
                    "typeName" : "Func<IServiceProvider,IExpressionElementAppenderFactory>",
                    "description" : "A delegate that receives a Service Provider and returns an instance of an `IExpressionElementAppenderFactory`."
                },
                { 
                    "typeName" : "Func<Type,IExpressionElementAppender>", 
                    "description" : "A delegate accepting an element appender type and returns an instance of an `IExpressionElementAppender`." 
                },
                {
                    "typeName" : "Func<IServiceProvider,Type,IExpressionElementAppender>",
                    "description" : "A delegate accepting a Service Provider and an element appender type and returns an instance of an `IExpressionElementAppender`."
                }
            ]
        },
        {
            "argumentName" : "configureTypes",
            "required" : false, 
            "description" : "A delegate that allows for configuring element appenders for specific element types." ,
            "types": [
                { 
                    "typeName" : "Action<IExpressionElementAppenderFactoryContinuationConfigurationBuilder<TDatabase>>"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use `MyAppenderFactory` to create instances of an `IExpressionElementAppender` for the provided element type:
```csharp
db => db.SqlStatements.Assembly.ElementAppender.Use(
        (type, IExpressionElementAppender) => new MyAppenderFactory().CreateElementAppender(type))
    )
```

Use `MyAppenderFactory` to create instances of an `IExpressionElementAppender` for the provided element type:
```csharp
db => db.SqlStatements.Assembly.ElementAppender.Use(
        (type, IExpressionElementAppender) => new MyAppenderFactory().CreateElementAppender(type))
    )
```

Use the instance of `MyAppenderFactory` to create instances of element appenders:
```csharp
db => db.SqlStatements.Assembly.ElementAppender.Use(new MyAppenderFactory())
```

Use the instance of `MyAppenderFactory` to create instances of element appenders:
```csharp
db => db.SqlStatements.Assembly.ElementAppender.Use(
        () => new MyAppenderFactory>()
    )
```

Use the instance of `MyAppenderFactory` to create instances of element appenders:
```csharp
db => db.SqlStatements.Assembly.ElementAppender.Use(
        sp => sp.GetRequiredService<MyAppenderFactory>(), 
            configure => configure.ForElementType<FieldExpression>()
                .Use<MyFieldExpressionAppender>()
    )
```
{% /accordian %}

---

## Configure specific element appenders

> When using a custom factory and registrations for specific element types are made, the custom factory 
*MUST* support those registrations (the dbExpression default factory does).

## Configure appenders using registered factory

{% method-descriptor %}
```json
{
    "syntax" : "ForElementTypes({configureTypes})",
    "arguments" : [
        {
            "argumentName" : "configureTypes",
            "required" : true, 
            "description" : "A delegate that allows for configuring element appenders for specific element types.",
            "types": [
                { 
                    "typeName" : "Action<IExpressionElementAppenderFactoryContinuationConfigurationBuilder<TDatabase>>" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use the default factory (or the previously registered factory) and `MyBirthdayAppender` to create instances of element 
appenders for appending a specific field type (`PersonEntity.BirthDateField`):
```csharp
db => db.SqlStatements.Assembly.ElementAppender.ForElementTypes(
    configure => configure.ForElementType<PersonEntity.BirthDateField>()
        .Use<MyBirthdayAppender>()
)
```
{% /accordian %}

## Generically use a factory for a specific appender

{% method-descriptor %}
```json
{
    "syntax" : "ForElement<T>().Use<TAppender>()",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The element type the appender will be used for.",
            "types": [
                { 
                    "typeName" : "Type" 
                }
            ]
        },
        {
            "argumentName" : "TAppender",
            "required" : true, 
            "description" : "The type of appender to use for element type `T`. `TAppender` must have a public parameterless constructor.",
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

## Configure a factory for a specific appender

{% method-descriptor %}
```json
{
    "syntax" : "ForElement<T>().Use({factory})",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The element type the appender will be used for." ,
            "types": [
                { 
                    "typeName" : "Type"
                }
            ]
        },
        {
            "argumentName" : "factory",
            "required" : true, 
            "description" : "A factory responsible for returning expression element appenders." ,
            "types": [
                { 
                    "typeName" : "IExpressionElementAppender<T>", 
                    "description" : "An instance of an element appender." 
                },
                { 
                    "typeName" : "Func<IExpressionElementAppender<T>>", 
                    "description" : "A delegate returning an element appender." 
                },
                { 
                    "typeName" : "Func<IServiceProvider, IExpressionElementAppender<T>>", 
                    "description" : "A delegate receiving a service provider and returning an element appender." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use a `MyElementAppenderFactory` to create instances of element appenders for appending field expressions:
```csharp
db => db.SqlStatements.Assembly.ElementAppender.Use(
    new MyElementAppenderFactory(),
    configure => configure.ForElementType<FieldExpression>()
        .Use<MyFieldExpressionAppender>()
)
```
{% /accordian %}