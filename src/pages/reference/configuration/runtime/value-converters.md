---
title: Value Converters
---

Configure options for creating converters.  When configuring converters for specific types, the method used depends on the type you are configuring:
- For primitive types, use `ForValueType<T>()`
- For enum types, use `ForEnumType<T>()`
- For all other types, use `ForReferenceType<T>()`

{% core-concepts caption="value converters" %}
Converters have two roles:
- Convert parameter values sent to the database
- Convert data and output parameters returned from the database

Converters apply to any type, from primitive C# types to any custom type you define.

{% query-execution-sequence-image highlight="Value Converter" /%}
{% /core-concepts %}

## Generically specify a value converter factory

{% method-descriptor %}
```json
{
    "syntax" : "Use<T>()",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The generic parameter that specifies the type of `IValueConverterFactory` to use in creating converters.  `T` must have a public parameterless constructor.",
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
Use `MyValueConverterFactory` to create instances of converters:
```csharp
db => db.Conversions.Use<MyValueConverterFactory()
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
            "description" : "A factory responsible for creating a value converter for a requested type.",
            "types": [
                {
                    "typeName" : "Func<Type,IValueConverter>",
                    "description" : "A delegate accepting a type and returns an instance of an `IValueConverter`"
                },
                {
                    "typeName" : "Func<IServiceProvider,Type,IValueConverter>",
                    "description" : "A delegate accepting a Service Provider and a type and returns an instance of an `IValueConverter`."
                },
                {
                    "typeName" : "IValueConverterFactory",
                    "description" : "An instance of an `IValueConverterFactory`."
                },
                { 
                    "typeName" : "Func<IValueConverterFactory>", 
                    "description" : "A delegate that provides an instance of a `IValueConverterFactory`." 
                },
                {
                    "typeName" : "Func<IServiceProvider,IValueConverterFactory>",
                    "description" : "A delegate accepting a service provider and returns an instance of an `IValueConverterFactory`."
                }
            ]
        },
        {
            "argumentName" : "configureTypes",
            "required" : false, 
            "description" : "A delegate that allows for configuring value converters for specific primitive, enum, and reference types.",
            "types": [
                { 
                    "typeName" : "Action<IValueConverterFactoryContinuationConfigurationBuilder<TDatabase>>" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use the service provider to resolve `MyValueConverterFactory` to create instances of an `IValueConverter` for the requested type:
```csharp
db => db.Conversions.Use(
        (sp, type, IValueConverter) => 
            sp.GetRequiredService<MyValueConverterFactory>().CreateConverter(type)
    )
```

Use the instance of `MyValueConverterFactory` to create instances of converters:
```csharp
db => db.Conversions.Use(new MyValueConverterFactory())
```

Use a delegate to provide an instance of `MyValueConverterFactory` to create instances of converters:
```csharp
db => db.Conversions.Use(
        () => new MyValueConverterFactory()
    )
```

Use the service provider to resolve an instance of `MyValueConverterFactory` to create instances of converters:
```csharp
db => db.Conversions.Use(
        sp => sp.GetRequiredService<MyValueConverterFactory>()
    )
```

Use the service provider to resolve an instance of `MyValueConverterFactory` to create instances of converters and 
use `MyDecimalConverter` to convert `decimal` values:
```csharp
db => db.Conversions.Use(
        sp => sp.GetRequiredService<MyValueConverterFactory>(), 
            configure => configure.ForValueType<decimal>()
                .Use<MyDecimalConverter>()
    )
```

Use the service provider to resolve an instance of `MyValueConverterFactory` to create instances of converters 
and use `MyDecimalConverter` to convert decimal values
and use `MyEnumConverter` to convert enums of type `MyEnum`:
```csharp
db => db.Conversions.Use(
        (sp, @type) => sp.GetRequiredService<MyValueConverterFactory>().CreateValueConverter(@type), 
            configure => configure
                .ForValueType<decimal>().Use<MyDecimalConverter>()
                .ForEnumType<MyEnum>().Use<MyEnumConverter>()

    )
```
{% /accordian %}

---

> When using a custom factory and registrations for specific value converter types are made, the custom factory 
*MUST* support those registrations (the dbExpression default factory does).

## Configure value converters using registered factory

{% method-descriptor %}
```json
{
    "syntax" : "ForTypes({configureTypes})",
    "arguments" : [
        {
            "argumentName" : "configureTypes",
            "required" : true, 
            "description" : "A delegate that enables configuration of converters for specific types.",
            "types": [
                { 
                    "typeName" : "Action<IValueConverterFactoryContinuationConfigurationBuilder<TDatabase>>" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use the default (or previously registered) `IValueConverterFactory` to create instances of converters, use `MyStringConverter` to convert string values, 
use `MyEnumConverter` to convert enums of type `MyEnum`, and use `MyJsonConverter` to convert objects of type `MyCustomObjectType`:
```csharp
db => db.Conversions.ForTypes(
    configure => configure
        .ForValueType<string>().Use<MyStringConverter>()
        .ForEnumType<MyEnum>().Use<MyEnumConverter>()
        .ForReferenceType<MyCustomObjectType>().Use<MyJsonConverter>()
)
```
{% /accordian %}

---

## Generically use a specific value type converter

{% method-descriptor %}
```json
{
    "syntax" : "ForValueType<T>().Use<TConverter>()",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The value type to use the converter for." ,
            "types": [
                { 
                    "typeName" : "Type"
                }
            ]
        },
        {
            "argumentName" : "TConverter",
            "required" : true, 
            "description" : "The value converter type to use for converting values of type `T`." ,
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

{% method-descriptor %}
```json
{
    "syntax" : "ForEnumType<TEnum>().Use<TConverter>()",
    "arguments" : [
        {
            "argumentName" : "TEnum",
            "required" : true,
            "types": [
                { 
                    "typeName" : "Type", 
                    "description" : "The enum type to use the converter for." 
                }
            ]
        },
        {
            "argumentName" : "TConverter",
            "required" : true,
            "types": [
                { 
                    "typeName" : "Type", 
                    "description" : "The value converter type to use for converting values of enum type `T`." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% method-descriptor %}
```json
{
    "syntax" : "ForReferenceType<T>().Use<TConverter>()",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The reference type to use the converter for.",
            "types": [
                { 
                    "typeName" : "Type" 
                }
            ]
        },
        {
            "argumentName" : "TConverter",
            "required" : true, 
            "description" : "The value converter type to use for converting reference types of type `T`." ,
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

---

## Configure a factory for a specific value converter

{% method-descriptor %}
```json
{
    "syntax" : "ForValueType<T>().Use({factory})",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The value type to use the converter for.",
            "types": [
                { 
                    "typeName" : "Type" 
                }
            ]
        },
        {
            "argumentName" : "factory",
            "required" : true, 
            "description" : "A factory responsible for creating a value converter for a requested type." ,
            "types": [
                { 
                    "typeName" : "IValueConverter<T>", 
                    "description" : "An instance of a value converter for type `T`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,IValueConverter<T>>", 
                    "description" : "A delegate receiving a service provider and returning a value converter type to use for converting values of type `T`." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% method-descriptor %}
```json
{
    "syntax" : "ForEnumType<TEnum>().Use({factory})",
    "arguments" : [
        {
            "argumentName" : "TEnum",
            "required" : true, 
            "description" : "The enum type to use the converter for." ,
            "types": [
                { 
                    "typeName" : "Type"
                }
            ]
        },
        {
            "argumentName" : "factory",
            "required" : true, 
            "description" : "An instance of a value converter for enum type `TEnum`." ,
            "types": [
                { 
                    "typeName" : "IValueConverter<TEnum>"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% method-descriptor %}
```json
{
    "syntax" : "ForReferenceType<T>().Use({factory})",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The reference type to use the converter for." ,
            "types": [
                { 
                    "typeName" : "Type"
                }
            ]
        },
        {
            "argumentName" : "factory",
            "required" : true, 
            "description" : "An instance of a value converter for reference type `T`.",
            "types": [
                { 
                    "typeName" : "IValueConverter<T>" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

## Configure delegates to convert values for specific types

{% method-descriptor %}
```json
{
    "syntax" : "ForValueType<T>().Use({convertToDatabase}, {convertFromDatabase})",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The value type to use the converter for.",
            "types": [
                { 
                    "typeName" : "Type" 
                }
            ]
        },
        {
            "argumentName" : "convertToDatabase",
            "required" : true, 
            "description" : "A delegate that converts a value for persistence in the database.",
            "types": [
                { 
                    "typeName" : "Func<T?,object?>", 
                    "description" : "A delegate receiving a nullable `T` and returning an object to persist in the database." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,T?,object?>", 
                    "description" : "A delegate receiving a service provider and a nullable `T` and returning an object to persist in the database." 
                }
            ]
        },
        {
            "argumentName" : "convertFromDatabase",
            "required" : true,
            "description" : "A delegate that converts a value for read from the database.",
            "types": [
                { 
                    "typeName" : "Func<object?,T?>", 
                    "description" : "A delegate receiving the read value from the database and returning a nullable `T`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,object?,T?>", 
                    "description" : "A delegate receiving a service provider and the read value from the database and returning a nullable `T`." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% method-descriptor %}
```json
{
    "syntax" : "ForEnumType<TEnum>().Use({convertToDatabase}, {convertFromDatabase})",
    "arguments" : [
        {
            "argumentName" : "TEnum",
            "required" : true, 
            "description" : "The enum type to use the converter for.",
            "types": [
                { 
                    "typeName" : "Type" 
                }
            ]
        },
        {
            "argumentName" : "convertToDatabase",
            "required" : true,
            "description" : "A delegate that converts a value for persistence in the database.",
            "types": [
                { 
                    "typeName" : "Func<TEnum?,object?>", 
                    "description" : "A delegate receiving a nullable `TEnum` and returning an object to persist in the database." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,TEnum?,object?>", 
                    "description" : "A delegate receiving a service provider and a nullable `TEnum` and returning an object to persist in the database." 
                }
            ]
        },
        {
            "argumentName" : "convertFromDatabase",
            "required" : true,
            "description" : "A delegate that converts a value read from the database.",
            "types": [
                { 
                    "typeName" : "Func<object?,TEnum?>", 
                    "description" : "A delegate receiving the read value from the database and returning a nullable `TEnum`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,object?,TEnum?>", 
                    "description" : "A delegate receiving a service provider and the read value from the database and returning a nullable `TEnum`." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% method-descriptor %}
```json
{
    "syntax" : "ForReferenceType<T>().Use({convertToDatabase}, {convertFromDatabase})",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The reference type to use the converter for." ,
            "types": [
                { 
                    "typeName" : "Type"
                }
            ]
        },
        {
            "argumentName" : "convertToDatabase",
            "required" : true,
            "description" : "A delegate that converts a value for persistence in the database.",
            "types": [
                { 
                    "typeName" : "Func<T?,object?>", 
                    "description" : "A delegate receiving a nullable `T` and returning an object to persist in the database." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,T?,object?>", 
                    "description" : "A delegate receiving a service provider and a nullable `T` and returning an object to persist in the database." 
                }
            ]
        },
        {
            "argumentName" : "convertFromDatabase",
            "required" : true,
            "description" : "A delegate that converts a value read from the database.",
            "types": [
                { 
                    "typeName" : "Func<object?,T?>", 
                    "description" : "A delegate receiving the read value from the database and returning a nullable `T`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,object?,T?>", 
                    "description" : "A delegate receiving a service provider and the read value from the database and returning a nullable `T`." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

## Configure enums to persist as strings

{% method-descriptor %}
```json
{
    "syntax" : "ForEnumType<TEnum>().PersistAsString()",
    "arguments" : [
        {
            "argumentName" : "TEnum",
            "required" : true, 
            "description" : "The enum type to persist as a string in the database." ,
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