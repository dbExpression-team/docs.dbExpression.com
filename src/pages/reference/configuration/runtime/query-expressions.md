---
title: Query Expressions
---

{% core-concepts caption="query expressions" %}
{% partial file="query-expressions-partial.md" /%}
{% query-execution-sequence-image highlight="Query Expression" /%}
{% /core-concepts %}

Configure a query expression factory to return instances of different sub-types for a specific
`QueryExpression` type.

## Generically specify a query type

{% method-descriptor %}
```json
{
    "syntax" : "ForQueryType<T>().Use<T>()",
    "alternateSyntax": [
        "ForSelect().Use<T>()",
        "ForInsert().Use<T>()",
        "ForUpdate().Use<T>()",
        "ForDelete().Use<T>()"
    ],
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true,
            "description" : "Specify a the type of query expression implementation to use for a specific query expression type.",
            "types": [
                { 
                    "typeName" : "Type", 
                    "description" : "The generic parameter that specifies the type of `QueryExpression`.  `T` must have a public parameterless constructor." ,
                    "notes": [
                        "`SelectQueryExpression` (must be this type when using `ForSelect`)",
                        "`InsertQueryExpression` (must be this type when using `ForInsert`)",
                        "`UpdateQueryExpression` (must be this type when using `ForUpdate`)",
                        "`DeleteQueryExpression` (must be this type when using `ForDelete`)",
                        "`StoredProcedureQueryExpression`"
                    ]
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use `MySelectQueryExpression` (which must extend type `SelectQueryExpression`) when building *SELECT* queries:
```csharp
db => db.QueryExpressions.ForQueryTypes(
    q => q.ForQueryType<SelectQueryExpression>().Use<MySelectQueryExpression>()
)
```
Or, the alternate/alias method:
```csharp
db => db.QueryExpressions.ForQueryTypes(
    q => q.ForSelect().Use<MySelectQueryExpression>()
            .ForUpdate().Use<MyUpdateQueryExpression>()
)
```
{% /accordian %}

---

## Use a factory

{% method-descriptor %}
```json
{
    "syntax" : "ForQueryType<T>().Use({factory})",
    "alternateSyntax": [
        "ForSelect().Use({factory})",
        "ForInsert().Use({factory})",
        "ForUpdate().Use({factory})",
        "ForDelete().Use({factory})"
    ],
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The generic parameter that specifies the type of `QueryExpression`.  `T` must have a public parameterless constructor." ,
            "types": [
                { 
                    "typeName" : "T", 
                    "description" : "The generic parameter that specifies the type of `QueryExpression`.  `T` must have a public parameterless constructor." ,
                    "notes": [
                        "`SelectQueryExpression` (must be this type when using `ForSelect`)",
                        "`InsertQueryExpression` (must be this type when using `ForInsert`)",
                        "`UpdateQueryExpression` (must be this type when using `ForUpdate`)",
                        "`DeleteQueryExpression` (must be this type when using `ForDelete`)",
                        "`StoredProcedureQueryExpression`"
                    ]
                }
            ]
        },
        {
            "argumentName" : "factory",
            "required" : true, 
            "description" : "A factory responsible for creating query expressions of type `T`." ,
            "types": [
                { 
                    "typeName" : "Func<T>", 
                    "description" : "A delegate that returns an instance of `T`, a `QueryExpression`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,T>", 
                    "description" : "A delegate receiving an `IServiceProvider` and returning an instance of `T`, a `QueryExpression`." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use `MySelectQueryExpression` (which must extend type `SelectQueryExpression`) and the provided
delegate to create instances of `MySelectQueryExpression` when building *SELECT* queries:
```csharp
db => db.QueryExpressions.ForQueryTypes(
    q => q.ForQueryType<SelectQueryExpression>().Use(
        () => new MySelectQueryExpression()
    )
)
```
Or, the alternate/alias method:
```csharp
db => db.QueryExpressions.ForQueryTypes(
    q => q.ForSelect().Use(
            () => new MySelectQueryExpression()
        )
        .ForUpdate().Use(
            () => new MyUpdateQueryExpression()
        )
)
```

Use `MySelectQueryExpression` and the service provider
to create instances of `MySelectQueryExpression` when building *SELECT* queries:
```csharp
db => db.QueryExpressions.ForQueryTypes(
    q => q.ForQueryType<SelectQueryExpression>().Use(
            sp => sp.GetRequiredService<MySelectQueryExpression>()
        )
)
```
Or, the alias method:
```csharp
db => db.QueryExpressions.ForQueryTypes(
    q => q.ForSelect().Use(
            sp => sp.GetRequiredService<MySelectQueryExpression>()
        )
        .ForUpdate().Use(
            sp => sp.GetRequiredService<MyUpdateQueryExpression>()
        )
)
```
{% /accordian %}