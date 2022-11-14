---
title: Stored Procedure Execution Pipeline Events
---

{% core-concepts caption="stored procedure execution pipeline" %}
After you construct a stored procedure query and invoke `Execute` or `ExecuteAsync`, dbExpression constructs an
execution pipeline which assembles a SQL statement from the `QueryExpression` and executes that SQL statement. 
You can subscribe to any "common" events and events specific to the stored procedure.  The events are 
published by the stored procedure execution pipeline as follows:

{% execution-pipeline-image type="Stored Procedure" %}
```csharp
IEnumerable<int> person_ids = db.sp.dbo.SelectPersons(
		birthDate: DateTime.UtcNow.Date.AddYears(-18)
	)
	.GetValues<int>()
	.Execute();
``` 
{% /execution-pipeline-image %}
{% /core-concepts %}

{% partial file="common-execution-pipeline-partial.md" /%}

---

### Before Stored Procedure Start (Synchronous)

The first Stored Procedure-specific event published, it is published *before* a SQL statement is assembled from the `QueryExpression` and *after* all
`BeforeStart` subscribers have received the `BeforeStart` event publication.  This event should be used to apply any query-specifics 
to the `QueryExpression` that need to be applied immediately after `Execute` or `ExecuteAsync` is invoked 
on the query.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeStored ProcedureStart({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context.  The provided delegate is invoked before a SQL statement is assembled.",
            "types": [
                { 
                    "typeName" : "Action<BeforeStoredProcedureStartPipelineEventContext>" 
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

{% accordian caption="syntax examples" %}
Log a message before any sql statement for a stored procedure is assembled.
```csharp
db.Events.OnBeforeStoredProcedureStart(
	context => logger.LogDebug("Beginning execution of a sql statement for a stored procedure.")
);
```
{% /accordian %}

---

### After Stored Procedure Assembly (Synchronous)

Event published *after* a SQL statement is assembled from the `QueryExpression` and *after* all `OnAfterAssembly`
subscribers have received the `OnAfterAssembly` event publication.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterStoredProcedureAssembly({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context." ,
            "types": [
                { 
                    "typeName" : "Action<AfterStoredProcedureAssemblyPipelineEventContext>"
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

### Before Stored Procedure Command (Synchronous)

Event published *before* a command is executed against the database and *after* the `OnBeforeCommand` event was published.
This is the last event published before the command is executed against the database.


{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeStoredProcedureCommand({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked before a SQL statement is executed against the database.",
            "types": [
                { 
                    "typeName" : "Action<BeforeStoredProcedureCommandPipelineEventContext>" 
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

### After Stored Procedure Command (Synchronous)

Event published *after* a command is executed against the database and *after* the `OnAfterCommand` event publication. 

> Subscribe to this event only if you need access to the command after execution of the SQL statement. The command (and any data readers) 
are still open.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterStoredProcedureCommand({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked after a command has been executed." ,
            "types": [
                { 
                    "typeName" : "Action<AfterStoredProcedureCommandPipelineEventContext>"
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

### After Stored Procedure Complete (Synchronous)

Event published *after* a SQL statement has been executed.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterStoredProcedureComplete({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked after the pipeline has completed all work." ,
            "types": [
                { 
                    "typeName" : "Action<AfterStoredProcedureCompletePipelineEventContext>"
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

### Before Stored Procedure Start (Asynchronous)

The first Stored Procedure-specific event published, it is published *before* a SQL statement is assembled from the `QueryExpression` and *after* all
`BeforeStart` subscribers have received the `BeforeStart` event publication.  This event should be used to apply any query-specifics 
to the `QueryExpression` that need to be applied immediately after `Execute` or `ExecuteAsync` is invoked 
on the query.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeStoredProcedureStart({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked before a SQL statement is assembled." ,
            "types": [
                { 
                    "typeName" : "Func<BeforeStoredProcedureStartPipelineEventContext,Task>"
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

{% accordian caption="syntax examples" %}
Log a message before any sql statement for a stored procedure is assembled.
```csharp
db.Events.OnBeforeStoredProcedureStart(
	context => logger.LogDebug("Beginning execution of a sql statement for a stored procedure.")
);
```
{% /accordian %}

---

### After Stored Procedure Assembly (Asynchronous)

Event published *after* a SQL statement is assembled from the `QueryExpression` and *before* the `OnAfterAssembly`
event is published.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterStoredProcedureAssembly({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context." ,
            "types": [
                { 
                    "typeName" : "Func<AfterStoredProcedureAssemblyPipelineEventContext,Task>"
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

### Before Stored Procedure Command (Asynchronous)

Event published *before* a command is executed against the database and *after* the `OnBeforeCommand` event was published.
This is the last event published before the command is executed against the database.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeStoredProcedureCommand({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context.  The provided delegate is invoked before a SQL statement is executed against the database." ,
            "types": [
                { 
                    "typeName" : "Func<BeforeStoredProcedureCommandPipelineEventContext,Task>"
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

### After Stored Procedure Command (Asynchronous)

Event published *after* a command is executed against the database and *after* the `OnAfterCommand` event publication. 

> Subscribe to this event only if you need access to the command after execution of the SQL statement. The command (and any data readers) 
are still open.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterStoredProcedureCommand({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked after a command has been executed.",
            "types": [
                { 
                    "typeName" : "Func<AfterStoredProcedureCommandPipelineEventContext,Task>" 
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

### After Stored Procedure Complete (Asynchronous)

Event published *after* a SQL statement has been executed.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterStoredProcedureComplete({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context." ,
            "types": [
                { 
                    "typeName" : "Func<AfterStoredProcedureCompletePipelineEventContext,Task>"
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