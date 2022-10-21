---
title: Delete Execution Pipeline Events
---

{% core-concepts caption="delete execution pipeline" %}
After you construct a query using `Delete` and invoke `Execute` or `ExecuteAsync`, dbExpression constructs an
execution pipeline which assembles a SQL statement from the `QueryExpression` and executes that SQL statement. 
You can subscribe to any "common" events and events specific to the *DELETE* operation.  The events are 
published by the delete execution pipeline as follows:

{% execution-pipeline-image type="Delete" %}
```csharp
db.Delete()
	.From(dbo.Person)
	.Where(
		dbo.Person.LastLoginDate == dbex.Null 
		| 
		dbo.Person.LastLoginDate < DateTime.Now.AddYears(-5)
	)
	.Execute();
```
{% /execution-pipeline-image %}
{% /core-concepts %}

{% partial file="common-execution-pipeline-partial.md" /%}

---

## Before Delete Start (Synchronous)

The first Delete-specific event published, it is published *before* a SQL statement is assembled from the `QueryExpression` and *after* all
`BeforeStart` subscribers have received the `BeforeStart` event publication.  This event should be used to apply any query-specifics 
to the `QueryExpression` that need to be applied immediately after `Execute` or `ExecuteAsync` is invoked 
on the query.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeDeleteStart({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context.  The provided delegate is invoked before a SQL statement is assembled." ,
            "types": [
                { 
                    "typeName" : "Action<BeforeDeleteStartPipelineEventContext>"
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
Log a message before any sql statement for a Delete operation is assembled.
```csharp
db.Events.OnBeforeDeleteStart(
	context => logger.LogDebug("Beginning execution of a sql statement for a delete query.")
);
```
Log a message before any *DELETE* sql statement is assembled, but only if the From is dbo.Person.
```csharp
db.Events.OnBeforeDeleteStart(
	context => logger.LogDebug("Beginning execution a delete sql statement from [Person]."),
	context => context.Expression.From!.Expression as EntityExpression == dbo.Person 
	// ^ publish event only when the from is dbo.Person
);
```
{% /accordian %}

---

## After Delete Assembly (Synchronous)

Event published *after* a SQL statement is assembled from the `QueryExpression` and *after* all `OnAfterAssembly`
subscribers have received the `OnAfterAssembly` event publication.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterDeleteAssembly({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context.",
            "types": [
                { 
                    "typeName" : "Action<AfterDeleteAssemblyPipelineEventContext>" 
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

## Before Delete Command (Synchronous)

Event published *before* a command is executed against the database and *after* the `OnBeforeCommand` event was published.
This is the last event published before the command is executed against the database.


{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeDeleteCommand({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked before a SQL statement is executed against the database.",
            "types": [
                { 
                    "typeName" : "Action<BeforeDeleteCommandPipelineEventContext>" 
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
        }
    ]
}
```
{% /method-descriptor %}

---

## After Delete Command (Synchronous)

Event published *after* a command is executed against the database and *after* the `OnAfterCommand` event publication. 

> Subscribe to this event only if you need access to the command after execution of the SQL statement. The command (and any data readers) 
are still open.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterDeleteCommand({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked after a command has been executed.",
            "types": [
                { 
                    "typeName" : "Action<AfterDeleteCommandPipelineEventContext>" 
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

## After Delete Complete (Synchronous)

Event published *after* a SQL statement has been executed.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterDeleteComplete({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked after the pipeline has completed all work.",
            "types": [
                { 
                    "typeName" : "Action<AfterDeleteCompletePipelineEventContext>" 
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

## Before Delete Start (Asynchronous)

The first Delete-specific event published, it is published *before* a SQL statement is assembled from the `QueryExpression` and *after* all
`BeforeStart` subscribers have received the `BeforeStart` event publication.  This event should be used to apply any query-specifics 
to the `QueryExpression` that need to be applied immediately after `Execute` or `ExecuteAsync` is invoked 
on the query.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeDeleteStart({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked before a SQL statement is assembled.",
            "types": [
                { 
                    "typeName" : "Func<BeforeDeleteStartPipelineEventContext,Task>" 
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

{% accordian caption="syntax examples" %}
Log a message before any sql statement for a Delete operation is assembled.
```csharp
db.Events.OnBeforeDeleteStart(
	context => logger.LogDebug("Beginning execution of a sql statement for a delete query.")
);
```
Log a message before any *DELETE* sql statement is assembled, but only if the From is dbo.Person.
```csharp
db.Events.OnBeforeDeleteStart(
	context => logger.LogDebug("Beginning execution a delete sql statement from [Person]."),
	context => context.Expression.From!.Expression as EntityExpression == dbo.Person 
	// ^ publish event only when the from is dbo.Person
);
```
{% /accordian %}

---

## After Delete Assembly (Asynchronous)

Event published *after* a SQL statement is assembled from the `QueryExpression` and *before* the `OnAfterAssembly`
event is published.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterDeleteAssembly({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context." ,
            "types": [
                { 
                    "typeName" : "Func<AfterDeleteAssemblyPipelineEventContext,Task>"
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

## Before Delete Command (Asynchronous)

Event published *before* a command is executed against the database and *after* the `OnBeforeCommand` event was published.
This is the last event published before the command is executed against the database.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeDeleteCommand({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context.  The provided delegate is invoked before a SQL statement is executed against the database.",
            "types": [
                { 
                    "typeName" : "Func<BeforeDeleteCommandPipelineEventContext,Task>"
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

## After Delete Command (Asynchronous)

Event published *after* a command is executed against the database and *after* the `OnAfterCommand` event publication. 

> Subscribe to this event only if you need access to the command after execution of the SQL statement. The command (and any data readers) 
are still open.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterDeleteCommand({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked after a command has been executed." ,
            "types": [
                { 
                    "typeName" : "Func<AfterDeleteCommandPipelineEventContext,Task>"
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

## After Delete Complete (Asynchronous)

Event published *after* a SQL statement has been executed.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterDeleteComplete({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context.",
            "types": [
                { 
                    "typeName" : "Func<AfterDeleteCompletePipelineEventContext,Task>" 
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