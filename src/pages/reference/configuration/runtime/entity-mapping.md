---
title: Entity Mapping
---

{% core-concepts caption="entity mapping" %}
dbExpression uses a mapper factory to provide instances of entity mappers to map data to entities as needed.
When you use the generic form of `SelectOne<T>` and `SelectMany<T>`, the generic parameter `T` specifies the entity type.
As dbExpression executes SQL statements and maps returned data back to an entity, the mapper factory provides
the instance of a mapper.  Overriding a mapper factory, or how a mapper maps data to a specific entity type, 
enables you to control the mapping of data to each property of an entity.
{% query-execution-sequence-image highlight="Entity Mapping" /%}
{% /core-concepts %}

## Generically specify a factory type
{% method-descriptor %}
```json
{
    "syntax" : "Use<T>()",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The generic parameter that specifies the type of `IMapperFactory`.  `T` must have a public parameterless constructor." ,
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

## Use a factory

{% method-descriptor %}
```json
{
    "syntax" : "Use({factory}[,{configureTypes}])",
    "arguments" : [
        {
            "argumentName" : "factory",
            "required" : true,
            "description" : "A factory responsible for creating entity mappers.",
            "types": [
                {
                    "typeName" : "Func<Type,IEntityMapper>",
                    "description" : "A delegate accepting an entity type and returns an instance of an `IEntityMapper`."
                },
                {
                    "typeName" : "Func<IServiceProvider,Type,IEntityMapper>",
                    "description" : "A delegate accepting a Service Provider and an entity type and returns an instance of an `IEntityMapper`."
                },
                {
                    "typeName" : "IMapperFactory",
                    "description" : "An instance of an `IMapperFactory`."
                },
                { 
                    "typeName" : "Func<IServiceProvider,IEntityMapper<T>>", 
                    "description" : "A delegate receiving a service provider and returning an IEntityMapper<T> to use for mapping data to an entity of type `T`." 
                },
                {
                    "typeName" : "Func<IMapperFactory>",
                    "description" : "A delegate that returns an instance of an `IMapperFactory`."
                },
                {
                    "typeName" : "Func<IServiceProvider,IMapperFactory>",
                    "description" : "A delegate that receives a service provider and returns an instance of an `IMapperFactory`."
                }
            ]
        },
        {
            "argumentName" : "configureTypes",
            "required" : false, 
            "description" : "A delegate that enables configuration of specific entity types." ,
            "types": [
                { 
                    "typeName" : "Action<IEntityFactoryContinuationConfigurationBuilder<TDatabase>>"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use `MyEntityMapper` to create instances of an `IEntityMapper` for the provided entity type:
```csharp
db => db.Entities.Mapping.Use(
        (type, IEntityMapper) => new MyEntityMapper().CreateEntity(type))
    )
```

Use `MyEntityMapper` to create instances of an `IEntityMapper` for the requested entity type:
```csharp
db => db.Entities.Mapping.Use(
        (sp, type, IEntityMapper) => 
            sp.GetRequiredService<MyEntityMapper>().CreateEntity(type)
    )
```

Use `MyEntityMapper` to create instances of entities:
```csharp
db => db.Entities.Mapping.Use<MyEntityMapper()
```

Use the instance of `MyEntityMapper` to create instances of entities:
```csharp
db => db.Entities.Mapping.Use(new MyEntityMapper())
```

Use the instance of `MyEntityMapper` to create instances of entities:
```csharp
db => db.Entities.Mapping.Use(
        () => new MyEntityMapper>()
    )
```

Use the instance of `MyEntityMapper` to create instances of entities:
```csharp
db => db.Entities.Mapping.Use(
        sp => sp.GetRequiredService<MyEntityMapper>()
    )
```

Use the instance of `MyEntityMapper` to create instances of entities, and for the entity type `Person`,
a new `Person` type with a default credit limit will be returned:
```csharp
db => db.Entities.Mapping.Use(
        sp => sp.GetRequiredService<MyEntityMapper>(), 
            configure => configure.ForEntityType<Person>()
                .Use(new Person { CreditLimit = 100 })
    )
```
{% /accordian %}

---

## Configure specific entities

> When using a custom factory and registrations for specific entities are made, the custom factory 
*MUST* support those registrations (the dbExpression default factory does).

## Configure entities using registered factory

{% method-descriptor %}
```json
{
    "syntax" : "ForEntityTypes({configureTypes})",
    "arguments" : [
        {
            "argumentName" : "configureTypes",
            "required" : true, 
            "description" : "A delegate that allows for configuring entity factories for specific entity types." ,
            "types": [
                { 
                    "typeName" : "Action<IEntityMapperContinuationConfigurationBuilder<TDatabase>>"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

## Generically specificy a mapper for an entity type

{% method-descriptor %}
```json
{
    "syntax" : "ForEntityType<T>().Use<TMapper>()",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The generic parameter that specifies the type of `IDbEntity` to use the mapper for.  `T` must have a public parameterless constructor.",
            "types": [
                { 
                    "typeName" : "Type" 
                }
            ]
        },
        {
            "argumentName" : "TMapper",
            "required" : true, 
            "description" : "AThe generic parameter that specifies the type of `IEntityMapper<T>` to use for mapping data to an instance of `T`.  `TMapper` must have a public parameterless constructor." ,
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

## Configure specific mapper for an entity type

{% method-descriptor %}
```json
{
    "syntax" : "ForEntityType<T>().Use({factory})",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The generic parameter that specifies the type of `IDbEntity` to use the mapper for.  `T` must have a public parameterless constructor.",
            "types": [
                { 
                    "typeName" : "Type" 
                }
            ]
        },
        {
            "argumentName" : "factory",
            "required" : true,
            "description" : "A factory responsible for creating entity mappers.",
            "types": [
                { 
                    "typeName" : "IEntityMapper<T>", 
                    "description" : "An instance of an `IEntityMapper<T>` to use for mapping data to an entity of type `T`." 
                },
                { 
                    "typeName" : "Func<IEntityMapper<T>", 
                    "description" : "A delegate returning an instance of an `IEntityMapper<T>` to use for mapping data to an entity of type `T`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,IEntityMapper<T>>", 
                    "description" : "A delegate receiving a service provider and returning an instance of `IEntityMapper<T>` to use for mapping data to an entity of type `T`." 
                },
                { 
                    "typeName" : "Action<ISqlFieldReader, TEntity>", 
                    "description" : "A delegate receiving a field reader and an entity instance.  The delegate is responsible for reading data from the field reader and mapping to the entity." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
For the entity type `Person`, use an instance of `MyPersonEntityMapper`:
```csharp
db => db.Entities.Mapping.ForEntityTypes(
        configure => configure.ForEntityType<Person>()
                .Use(new MyPersonEntityMapper())
    )
```

For the entity type `Person`, use a delegate to provide an instance of `MyPersonEntityMapper`:
```csharp
db => db.Entities.Mapping.ForEntityTypes(
        configure => configure.ForEntityType<Person>()
                .Use(() => new MyPersonEntityMapper())
    )
```

For the entity type `Person`, use the service provider to resolve an instance of an `IEntityMapper<Person>` that was registered with type `MyPersonEntityMapper`:
```csharp
db => db.Entities.Mapping.ForEntityTypes(
        configure => configure.ForEntityType<Person>()
                .Use(sp => sp.GetRequiredService<IEntityMapper<Person>>())
    )
```
{% /accordian %}