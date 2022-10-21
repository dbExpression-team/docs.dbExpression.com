---
title: Execution Pipelines
---

Configure options for managing the workflow of assembling and executing SQL statements.  *It is very rare, or very advanced use cases, that you would need to replace the default execution pipelines*.

## Generically specify type

{% method-descriptor %}
```json
{
    "syntax" : "Use<T>()",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The generic parameter that specifies the type that implements `IQueryExecutionPipelineFactory`. `T` must have a public parameterless constructor.",
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
Use `MyQueryExecutionPipelineFactory` to create execution pipelines:
```csharp
db => db.SqlStatements.QueryExecution.Pipeline.Use<MyQueryExecutionPipelineFactory>()
```
{% /accordian %}

---

## Use a factory

{% method-descriptor %}
```json
{
    "syntax" : "Use({factory}[,{configure_types}])",
    "arguments" : [
        {
            "argumentName" : "factory",
            "required" : true,
            "description" : "A factory responsible for creating query execution pipelines.",
            "types": [
                { 
                    "typeName" : "IQueryExecutionPipelineFactory", 
                    "description" : "An instance of a type that implements `IQueryExecutionPipelineFactory`." 
                },
                { 
                    "typeName" : "Func<IQueryExecutionPipelineFactory>", 
                    "description" : "A delegate that returns an instance of a type that implements `IQueryExecutionPipelineFactory`." 
                },
                { 
                    "typeName" : "Func<IServiceProvider,IQueryExecutionPipelineFactory>", 
                    "description" : "A delegate that receives a service provider and returns an instance of a type that implements `IQueryExecutionPipelineFactory`." 
                }
            ]
        },
        {
            "argumentName" : "configure_types",
            "required" : false, 
            "description" : "A delegate that enables configuration of specific execution pipelines (select, insert, etc.)." ,
            "types": [
                { 
                    "typeName" : "Action<IQueryExecutionPipelineFactoryContinuationConfigurationBuilder<TDatabase>>"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use `MyQueryExecutionPipelineFactory` to create execution pipelines:
```csharp
db => db.SqlStatements.QueryExecution.Pipeline.Use(
        new MyQueryExecutionPipelineFactory()
    )
```

Use the service provider to resolve a an instance of type `IQueryExecutionPipelineFactory`:
```csharp
db => db.SqlStatements.QueryExecution.Pipeline.Use(
        sp => sp.GetRequiredService<IQueryExecutionPipelineFactory>()
    )
```

Use `MyQueryExecutionPipelineFactory` to create a factory responsible for creating execution pipelines:
```csharp
db => db.SqlStatements.QueryExecution.Pipeline.Use(
        () => new MyQueryExecutionPipelineFactory()
    )
```

Use `MyQueryExecutionPipelineFactory`to create a factory responsible for creating execution pipelines and for select queries, use an instance of `MySelectQueryExecutionPipeline`:
```csharp
db => db.SqlStatements.QueryExecution.Pipeline.Use(
    () => new MyQueryExecutionPipelineFactory(), 
    c => c.ForSelect().Use(() => new MySelectQueryExecutionPipeline())
)
```

Use the service provider to resolve a registration for type `IQueryExecutionPipelineFactory`, and additionally specify that `MySelectQueryExecutionPipeline` should be used for *SELECT* operations:
```csharp
db => db.SqlStatements.QueryExecution.Pipeline.Use(
    sp => sp.GetRequiredService<IQueryExecutionPipelineFactory>(), 
    c => c.ForSelect().Use(() => new MySelectQueryExecutionPipeline())
)
```
{% /accordian %}

---

## Configure pipelines

{% method-descriptor %}
```json
{
    "syntax" : "ForPipelineTypes({configure_types})",
    "arguments" : [
        {
            "argumentName" : "configure_types",
            "required" : true, 
            "description" : "A delegate that enables configuration of specific execution pipelines (select, insert, etc.).",
            "types": [
                { 
                    "typeName" : "Action<IQueryExecutionPipelineFactoryContinuationConfigurationBuilder<TDatabase>>" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use `MySelectQueryExpressionExecutionPipeline` when executing *SELECT* queries:
```csharp
db => db.SqlStatements.QueryExecution.Pipeline.ForPipelineTypes(
    c => c.ForPipelineType<ISelectQueryExpressionExecutionPipeline>().Use<MySelectQueryExpressionExecutionPipeline>()
)
```

Use `MySelectQueryExecutionPipeline` for *SELECT* queries:
```csharp
db => db.SqlStatements.QueryExecution.Pipeline.ForPipelineTypes(
    c => c.ForSelect().Use(() => new MySelectQueryExecutionPipeline())
)
```

Or, the alternate/alias method:
```csharp
db => db.SqlStatements.QueryExecution.Pipeline.ForPipelineTypes(
    c => c.ForSelect().Use<MySelectQueryExpressionExecutionPipeline>()
            .ForUpdate().Use<MyUpdateQueryExpressionExecutionPipeline>()
)
```
{% /accordian %}

---

## Generically specify a type for a specific pipeline

{% method-descriptor %}
```json
{
    "syntax" : "ForPipelineType<T>().Use<TPipeline>()",
    "alternateSyntax" : [
        "ForSelect().Use<TPipeline>()",
        "ForInsert().Use<TPipeline>()",
        "ForUpdate().Use<TPipeline>()",
        "ForDelete().Use<TPipeline>()"
    ],
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true,
            "description" : "Specify a the type of execution pipeline to use for a specific query type.",
            "types": [
                { 
                    "typeName" : "Type", 
                    "description" : "The generic parameter that specifies the type of execution pipeline. `T` is a type thate implements one of:",
                    "notes" : [
                        "`ISelectQueryExpressionExecutionPipeline` (must be this type when using ForSelect",
                        "`IInsertQueryExpressionExecutionPipeline` (must be this type when using ForInsert",
                        "`IUpdateQueryExpressionExecutionPipeline` (must be this type when using ForUpdate",
                        "`IDeleteQueryExpressionExecutionPipeline` (must be this type when using ForDelete",
                        "`IStoredProedureQueryExpressionExecutionPipeline`"
                    ]
                }
            ]
        },
        {
            "argumentName" : "TPipeline",
            "required" : true, 
            "description" : "The type of execution pipeline to use for `T`. `TPipeline` must have a public parameterless constructor." ,
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

## Use a factory for a specific pipeline

{% method-descriptor %}
```json
{
    "syntax" : "ForPipelineType<T>().Use({factory})",
    "alternateSyntax" : [
        "ForSelect().Use({factory})",
        "ForInsert().Use({factory})",
        "ForUpdate().Use({factory})",
        "ForDelete().Use({factory})"
    ],
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true,
            "description" : "Specify a the type of execution pipeline to use for a specific query type.",
            "types": [
                { 
                    "typeName" : "Type", 
                    "description" : "The generic parameter that specifies the type of execution pipeline. `T` is a type thate implements one of:",
                    "notes" : [
                        "`ISelectQueryExpressionExecutionPipeline` (must be this type when using ForSelect",
                        "`IInsertQueryExpressionExecutionPipeline` (must be this type when using ForInsert",
                        "`IUpdateQueryExpressionExecutionPipeline` (must be this type when using ForUpdate",
                        "`IDeleteQueryExpressionExecutionPipeline` (must be this type when using ForDelete",
                        "`IStoredProedureQueryExpressionExecutionPipeline`"
                    ]
                }
            ]
        },
        {
            "argumentName" : "factory",
            "required" : true,
            "description" : "A delegate that returns an instance of a type that implements `T`",
            "types": [
                { 
                    "typeName" : "Func<T>"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Use the service provider to resolve `ISelectQueryExpressionExecutionPipeline`:
```csharp
db => db.SqlStatements.QueryExecution.Pipeline.ForPipelineTypes(
    q => q.ForPipelineType<ISelectQueryExpressionExecutionPipeline>()
            .Use(sp => sp.GetRequiredService<MySelectQueryExpressionExecutionPipeline>())
)
```
Or, the alternate/alias method:
```csharp
db => db.SqlStatements.QueryExecution.Pipeline.ForPipelineTypes(
    q => q.ForSelect().Use(() => new MySelectQueryExpressionExecutionPipeline())
            .ForUpdate().Use(() => new MyUpdateQueryExpressionExecutionPipeline())
)
```
{% /accordian %}