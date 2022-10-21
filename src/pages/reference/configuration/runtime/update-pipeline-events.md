---
title: Update Execution Pipeline Events
---

{% core-concepts caption="update execution pipeline" %}
After you construct a query using `Update` and invoke `Execute` or `ExecuteAsync`, dbExpression constructs an
execution pipeline which assembles a SQL statement from the `QueryExpression` and executes that SQL statement. 
You can subscribe to any "common" events and events specific to the *UPDATE* operation.  The events are 
published by the update execution pipeline as follows:

{% execution-pipeline-image type="Update" %}
```csharp
db.Update(dbo.Person.FirstName.Set('John'))
	.From(dbo.Person)
	.Where(dbo.Person.Id == 1)
	.Execute();
```
{% /execution-pipeline-image %}
{% /core-concepts %}

{% partial file="common-execution-pipeline-partial.md" /%}

--- 

## Before Update Start (Synchronous)

The first Update-specific event published, it is published *before* a SQL statement is assembled from the `QueryExpression` and *after* all
`BeforeStart` subscribers have received the `BeforeStart` event publication.  This event should be used to apply any query-specifics 
to the `QueryExpression` that need to be applied immediately after `Execute` or `ExecuteAsync` is invoked 
on the query.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeUpdateStart({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context.  The provided delegate is invoked before a SQL statement is assembled." ,
            "types": [
                { 
                    "typeName" : "Action<BeforeUpdateStartPipelineEventContext>"
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
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
Log a message before any sql statement for a Update operation is assembled.
```csharp
db.Events.OnBeforeUpdateStart(
	context => logger.LogDebug("Beginning execution of a sql statement for a update query.")
);
```
Log a message before any *{% $upper-case-query-type %}* sql statement is assembled, but only if the From is dbo.Person.
```csharp
db.Events.OnBeforeUpdateStart(
	context => logger.LogDebug("Beginning execution a update sql statement from [Person]."),
	context => context.Expression.From!.Expression as EntityExpression == dbo.Person 
	// ^ publish event only when the from is dbo.Person
);
```
{% /accordian %}

---

## After Update Assembly (Synchronous)

Event published *after* a SQL statement is assembled from the `QueryExpression` and *after* all `OnAfterAssembly`
subscribers have received the `OnAfterAssembly` event publication.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterUpdateAssembly({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context." ,
            "types": [
                { 
                    "typeName" : "Action<AfterUpdateAssemblyPipelineEventContext>"
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
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

## Before Update Command (Synchronous)

Event published *before* a command is executed against the database and *after* the `OnBeforeCommand` event was published.
This is the last event published before the command is executed against the database.


{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeUpdateCommand({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked before a SQL statement is executed against the database.",
            "types": [
                { 
                    "typeName" : "Action<BeforeUpdateCommandPipelineEventContext>" 
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
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

## After Update Command (Synchronous)

Event published *after* a command is executed against the database and *after* the `OnAfterCommand` event publication. 

> Subscribe to this event only if you need access to the command after execution of the SQL statement. The command (and any data readers) 
are still open.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterUpdateCommand({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked after a command has been executed.",
            "types": [
                { 
                    "typeName" : "Action<AfterUpdateCommandPipelineEventContext>" 
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
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

## After Update Complete (Synchronous)

Event published *after* a SQL statement has been executed.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterUpdateComplete({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked after the pipeline has completed all work.",
            "types": [
                { 
                    "typeName" : "Action<AfterUpdateCompletePipelineEventContext>" 
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
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

## Before Update Start (Asynchronous)

The first Update-specific event published, it is published *before* a SQL statement is assembled from the `QueryExpression` and *after* all
`BeforeStart` subscribers have received the `BeforeStart` event publication.  This event should be used to apply any query-specifics 
to the `QueryExpression` that need to be applied immediately after `Execute` or `ExecuteAsync` is invoked 
on the query.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeUpdateStart({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked before a SQL statement is assembled." ,
            "types": [
                { 
                    "typeName" : "Func<BeforeUpdateStartPipelineEventContext,Task>"
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription.",
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

{% accordian caption="syntax examples" %}
Log a message before any sql statement for a Update operation is assembled.
```csharp
db.Events.OnBeforeUpdateStart(
	context => logger.LogDebug("Beginning execution of a sql statement for a update query.")
);
```
Log a message before any *UPDATE* sql statement is assembled, but only if the From is dbo.Person.
```csharp
db.Events.OnBeforeUpdateStart(
	context => logger.LogDebug("Beginning execution a update sql statement from [Person]."),
	context => context.Expression.From!.Expression as EntityExpression == dbo.Person 
	// ^ publish event only when the from is dbo.Person
);
```
{% /accordian %}

---

## After Update Assembly (Asynchronous)

Event published *after* a SQL statement is assembled from the `QueryExpression` and *before* the `OnAfterAssembly`
event is published.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterUpdateAssembly({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context." ,
            "types": [
                { 
                    "typeName" : "Func<AfterUpdateAssemblyPipelineEventContext,Task>"
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
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

## Before Update Command (Asynchronous)

Event published *before* a command is executed against the database and *after* the `OnBeforeCommand` event was published.
This is the last event published before the command is executed against the database.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeUpdateCommand({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context.  The provided delegate is invoked before a SQL statement is executed against the database.",
            "types": [
                { 
                    "typeName" : "Func<BeforeUpdateCommandPipelineEventContext,Task>" 
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
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

## After Update Command (Asynchronous)

Event published *after* a command is executed against the database and *after* the `OnAfterCommand` event publication. 

> Subscribe to this event only if you need access to the command after execution of the SQL statement. The command (and any data readers) 
are still open.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterUpdateCommand({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked after a command has been executed.",
            "types": [
                { 
                    "typeName" : "Func<AfterUpdateCommandPipelineEventContext,Task>" 
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." ,
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

## After Update Complete (Asynchronous)

Event published *after* a SQL statement has been executed.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterUpdateComplete({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context." ,
            "types": [
                { 
                    "typeName" : "Func<AfterUpdateCompletePipelineEventContext,Task>"
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false, 
            "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription.",
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