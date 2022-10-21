---
title: Entities
---

{% core-concepts caption="entities" %}
Entities type definitions (POCOs) are created during the scaffolding process, 
where each entity type has a direct correlation to a table in the database.

dbExpression uses an entity factory to provide instances of entity types as needed.  When you use the
generic form of `SelectOne<T>` and `SelectMany<T>`, the generic parameter `T` specifies the entity type.
As dbExpression executes SQL statements and maps returned data back to an entity, the entity factory provides
the instance of that entity prior to mapping.  Overriding an entity factory, or how an entity factory creates
a specific type, enables you to set any initial data on the entity prior to mapping.

{% query-execution-sequence-image highlight="Entity Creation" /%}
{% /core-concept %}

## Generically specify entity factory type
{% method-descriptor %}
```json
{
    "syntax" : "Use<T>()",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The generic parameter that specifies the type of `IEntityFactory`.  `T` must have a public parameterless constructor." ,
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
            "description" : "A factory responsible for returning entities." ,
            "types": [
                {
                    "typeName" : "Func<Type,IDbEntity>",
                    "description" : "A delegate accepting an entity type and returns an instance of an `IDbEntity`."
                },
                {
                    "typeName" : "Func<IServiceProvider,Type,IDbEntity>",
                    "description" : "A delegate accepting a service provider and an entity type and returns an instance of an `IDbEntity`."
                },
                {
                    "typeName" : "IEntityFactory",
                    "description" : "An instance of an `IEntityFactory`."
                },
                { 
                    "typeName" : "Func<IServiceProvider,IEntityFactory>", 
                    "description" : "A delegate that receives a service provider and returns an instance of an `IEntityFactory`." 
                },
                {
                    "typeName" : "Func<IEntityFactory>",
                    "description" : "A delegate that returns an instance of an `IEntityFactory`."
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
Use `MyEntityFactory` to create instances of an `IDbEntity` for the provided entity type:
```csharp
db => db.Entities.Creation.Use(
        (type, IDbEntity) => new MyEntityFactory().CreateEntity(type))
    )
```

Use the service provider to resolve an instance of `MyEntityFactory` to create instances 
of an `IDbEntity` for the requested entity type:
```csharp
db => db.Entities.Creation.Use(
        (sp, type, IDbEntity) => 
            sp.GetRequiredService<MyEntityFactory>().CreateEntity(type)
    )
```

Use `MyEntityFactory` to create instances of entities:
```csharp
db => db.Entities.Creation.Use<MyEntityFactory()
```

Use the instance of `MyEntityFactory` to create instances of entities:
```csharp
db => db.Entities.Creation.Use(new MyEntityFactory())
```

Use the delegate to provide an instance of `MyEntityFactory` to create instances of entities:
```csharp
db => db.Entities.Creation.Use(
        () => new MyEntityFactory>()
    )
```

Use the service provider to resolve an instance of `MyEntityFactory` to create instances of entities:
```csharp
db => db.Entities.Creation.Use(
        sp => sp.GetRequiredService<MyEntityFactory>()
    )
```

Use the service provider to resolve an instance of `MyEntityFactory` to create instances of entities, 
and for the entity type `Person`, a new `Person` type with a default credit limit will be returned:
```csharp
db => db.Entities.Creation.Use(
        sp => sp.GetRequiredService<MyEntityFactory>(), 
            configure => configure.ForEntityType<Person>()
                .Use(() => new Person { CreditLimit = 100 })
    )
```
{% /accordian %}

---

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
                    "typeName" : "Action<IEntityFactoryContinuationConfigurationBuilder<TDatabase>>"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

## Configure specific entity type

{% method-descriptor %}
```json
{
    "syntax" : "ForEntityType<T>().Use({factory})",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The generic parameter that specifies the type of `IDbEntity` to use the factory for.  `T` must have a public parameterless constructor." ,
            "types": [
                { 
                    "typeName" : "Type"
                }
            ]
        },
        {
            "argumentName" : "factory",
            "required" : true, 
            "description" : "A factory responsible for returning entities." ,
            "types": [
                { 
                    "typeName" : "Func<T>", 
                    "description" : "A delegate that returns an instance of `T`, an `IDbEntity`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,T>", 
                    "description" : "A delegate receiving a service provider and returning an instance of `T`, an `IDbEntity`." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
For the entity type `Person`, a new `Person` type with a default credit limit will be returned:
```csharp
db => db.Entities.Creation.ForEntityTypes(
        configure => configure.ForEntityType<Person>()
                .Use(() => new Person { CreditLimit = 100 })
    )
```

For the entity type `Person`, a new `Person` type with a default credit limit will be returned:
```csharp
db => db.Entities.Creation.ForEntityTypes(
        configure => configure.ForEntityType<Person>()
                .Use(sp => new Person { CreditLimit = 100 })
    )
```
{% /accordian %}