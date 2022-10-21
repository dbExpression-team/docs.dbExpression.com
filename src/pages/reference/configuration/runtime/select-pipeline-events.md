---
title: Select Execution Pipeline Events
---

{% core-concepts caption="select execution pipeline" %}
After you construct a query using `Select` and invoke `Execute` or `ExecuteAsync`, dbExpression constructs an
execution pipeline which assembles a SQL statement from the `QueryExpression` and executes that SQL statement. 
You can subscribe to any "common" events and events specific to the *SELECT* operation.  The events are 
published by the select execution pipeline as follows:

{% execution-pipeline-image type="Select" %}
```csharp
db.SelectMany<Person>()
	.From(dbo.Person)
	.Where(dbo.Person.BirthDate > DateTime.UtcNow.Date.AddYears(-18))
	.Execute();
```
{% /execution-pipeline-image %}
{% /core-concepts %}

{% partial file="common-execution-pipeline-partial.md" /%}

---

## Before Select Start (Synchronous)

The first Select-specific event published, it is published *before* a SQL statement is assembled from the `QueryExpression` and *after* all
`BeforeStart` subscribers have received the `BeforeStart` event publication.  This event should be used to apply any query-specifics 
to the `QueryExpression` that need to be applied immediately after `Execute` or `ExecuteAsync` is invoked 
on the query.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeSelectStart({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context.  The provided delegate is invoked *before* a SQL statement is assembled.",
            "types": [
                { 
                    "typeName" : "Action<BeforeSelectStartPipelineEventContext>" 
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
            "defaultValue" : "true",
            "types": [
                { 
                    "typeName" : "Predicate"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Log a message before any sql statement for a Select operation is assembled.
```csharp
db.Events.OnBeforeSelectStart(
	context => logger.LogDebug("Beginning execution of a sql statement for a select query.")
);
```
Log a message before any *SELECT* sql statement is assembled, but only if the From is dbo.Person.
```csharp
db.Events.OnBeforeSelectStart(
	context => logger.LogDebug("Beginning execution a select sql statement from [Person]."),
	context => context.Expression.From!.Expression as EntityExpression == dbo.Person 
	// ^ publish event only when the from is dbo.Person
);
```
{% /accordian %}

---

## After Select Assembly (Synchronous)

Event published *after* a SQL statement is assembled from the `QueryExpression` and *after* all `OnAfterAssembly`
subscribers have received the `OnAfterAssembly` event publication.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterSelectAssembly({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context.",
            "types": [
                { 
                    "typeName" : "Action<AfterSelectAssemblyPipelineEventContext>" 
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
            "defaultValue" : "true",
            "types": [
                { 
                    "typeName" : "Predicate"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

## Before Select Command (Synchronous)

Event published *before* a command is executed against the database and *after* the `OnBeforeCommand` event was published.
This is the last event published before the command is executed against the database.


{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeSelectCommand({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked *before* a SQL statement is executed against the database." ,
            "types": [
                { 
                    "typeName" : "Action<BeforeSelectCommandPipelineEventContext>"
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription.",
            "defaultValue" : "true",
            "types": [
                { 
                    "typeName" : "Predicate" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

## After Select Command (Synchronous)

Event published *after* a command is executed against the database and *after* the `OnAfterCommand` event publication. 

> Subscribe to this event only if you need access to the command after execution of the SQL statement. The command (and any data readers) 
are still open.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterSelectCommand({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked *after* a command has been executed." ,
            "types": [
                { 
                    "typeName" : "Action<AfterSelectCommandPipelineEventContext>"
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription.",
            "defaultValue" : "true",
            "types": [
                { 
                    "typeName" : "Predicate" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

## After Select Complete (Synchronous)

Event published *after* a SQL statement has been executed.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterSelectComplete({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked *after* the pipeline has completed all work." ,
            "types": [
                { 
                    "typeName" : "Action<AfterSelectCompletePipelineEventContext>"
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription.",
            "defaultValue" : "true",
            "types": [
                { 
                    "typeName" : "Predicate" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

{% partial file="common-async-execution-pipeline-partial.md" /%}

---

## Before Select Start (Asynchronous)

The first Select-specific event published, it is published *before* a SQL statement is assembled from the `QueryExpression` and *after* all
`BeforeStart` subscribers have received the `BeforeStart` event publication.  This event should be used to apply any query-specifics 
to the `QueryExpression` that need to be applied immediately after `Execute` or `ExecuteAsync` is invoked 
on the query.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeSelectStart({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked *before* a SQL statement is assembled.",
            "types": [
                { 
                    "typeName" : "Func<BeforeSelectStartPipelineEventContext,Task>" 
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
            "defaultValue" : "true",
            "types": [
                { 
                    "typeName" : "Predicate"
                }
            ]
        },
        {
            "argumentName" : "cancellationToken",
            "required" : false, 
            "description" : "A cancellation token that will be checked occassionally as the pipeline progresses.  An `OperationCanceledException` will be thrown if the token is cancelled." ,
            "types": [
                { 
                    "typeName" : "CancellationToken"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
Log a message before any sql statement for a Select operation is assembled.
```csharp
db.Events.OnBeforeSelectStart(
	context => logger.LogDebug("Beginning execution of a sql statement for a select query.")
);
```
Log a message before any *{% $upper-case-query-type %}* sql statement is assembled, but only if the From is dbo.Person.
```csharp
db.Events.OnBeforeSelectStart(
	context => logger.LogDebug("Beginning execution a select sql statement from [Person]."),
	context => context.Expression.From!.Expression as EntityExpression == dbo.Person 
	// ^ publish event only when the from is dbo.Person
);
```
{% /accordian %}

---

## After Select Assembly (Asynchronous)

Event published *after* a SQL statement is assembled from the `QueryExpression` and *after* all `OnAfterAssembly`
subscribers have received the `OnAfterAssembly` event publication.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterSelectAssembly({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context." ,
            "types": [
                { 
                    "typeName" : "Func<AfterSelectAssemblyPipelineEventContext,Task>"
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
            "defaultValue" : "true",
            "types": [
                { 
                    "typeName" : "Predicate"
                }
            ]
        },
        {
            "argumentName" : "cancellationToken",
            "required" : false, 
            "description" : "A cancellation token that will be checked occassionally as the pipeline progresses.  An `OperationCanceledException` will be thrown if the token is cancelled." ,
            "types": [
                { 
                    "typeName" : "CancellationToken"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

## Before Select Command (Asynchronous)

Event published *before* a command is executed against the database and *after* the `OnBeforeCommand` event was published.
This is the last event published before the command is executed against the database.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeSelectCommand({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context.  The provided delegate is invoked *before* a SQL statement is executed against the database.",
            "types": [
                { 
                    "typeName" : "Func<BeforeSelectCommandPipelineEventContext,Task>" 
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
            "defaultValue" : "true",
            "types": [
                { 
                    "typeName" : "Predicate"
                }
            ]
        },
        {
            "argumentName" : "cancellationToken",
            "required" : false, 
            "description" : "A cancellation token that will be checked occassionally as the pipeline progresses.  An `OperationCanceledException` will be thrown if the token is cancelled.",
            "types": [
                { 
                    "typeName" : "CancellationToken" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

## After Select Command (Asynchronous)

Event published *after* a command is executed against the database and *after* the `OnAfterCommand` event publication. 

> Subscribe to this event only if you need access to the command after execution of the SQL statement. The command (and any data readers) 
are still open.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterSelectCommand({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked *after* a command has been executed.",
            "types": [
                { 
                    "typeName" : "Func<AfterSelectCommandPipelineEventContext,Task>" 
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
            "defaultValue" : "true",
            "types": [
                { 
                    "typeName" : "Predicate"
                }
            ]
        },
        {
            "argumentName" : "cancellationToken",
            "required" : false, 
            "description" : "A cancellation token that will be checked occassionally as the pipeline progresses.  An `OperationCanceledException` will be thrown if the token is cancelled.",
            "types": [
                { 
                    "typeName" : "CancellationToken" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

## After Select Complete (Asynchronous)

Event published *after* a SQL statement has been executed.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterSelectComplete({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context." ,
            "types": [
                { 
                    "typeName" : "Func<AfterSelectCompletePipelineEventContext,Task>"
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
            "defaultValue" : "true",
            "types": [
                { 
                    "typeName" : "Predicate"
                }
            ]
        },
        {
            "argumentName" : "cancellationToken",
            "required" : false, 
            "description" : "A cancellation token that will be checked occassionally as the pipeline progresses.  An `OperationCanceledException` will be thrown if the token is cancelled.",
            "types": [
                { 
                    "typeName" : "CancellationToken" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}


