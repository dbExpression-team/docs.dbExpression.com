## Before Start (Asynchronous)

Event published *before* a SQL statement is assembled from the `QueryExpression`.  The parameter builder 
is available (no parameters have been created).  This event should be used to apply any query-specifics 
to the `QueryExpression` that need to be applied immediately after `Execute` or `ExecuteAsync` is invoked 
on the query.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeStart({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true,
            "description" : "A delegate receiving event-specific context.  The provided delegate is invoked before a SQL statement is assembled.",
            "types": [
                { 
                    "typeName" : "Func<BeforeStartPipelineEventContext,Task>"
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
        },
        {
            "argumentName" : "cancellationToken",
            "required" : false,
            "description" : "A cancellation token that will be checked occassionally as the pipeline progresses.  An `OperationCanceledException` will be thrown if the token is cancelled.","types": [
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
```csharp
db.Events.OnBeforeStart(
	async context => await SendTelemetry(context.Expression)
);
```
Log a message before any sql statement is assembled, but only if it is a *{% $upper-case-query-type %}* statement.
```csharp
db.Events.OnBeforeStart(
	async context => await SendTelemetry(context.Expression),
	context => context.Expression.IsSelectQueryExpression() 
	// ^ execute only when the expression is of type SelectQueryExpression
);
```
{% /accordian %}

---

## After Assembly (Asynchronous)

Event published *after* a SQL statement is assembled from the `QueryExpression`.  Changes made to the `QueryExpression` 
will NOT effect the SQL statement.  The SQL statement has been assembled and any/all parameters have been created 
for the SQL statement.  The parameter builder is available in this event, and should be used to create/add additional 
parameters for any additional text appended to the SQL statements command text writer.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterAssembly({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true,
            "description" : "A delegate receiving event-specific context.  The provided delegate is invoked *after* a SQL statement is assembled.",
            "types": [
                { 
                    "typeName" : "Func<AfterAssemblyPipelineEventContext,Task>"                    
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
Log a message after any sql statement is assembled.
```csharp
db.Events.OnAfterAssembly(
	async context => await SendTelemetry(context.Expression)
);
```
Log a message after any sql statement is assembled, but only if it is a *SELECT* statement.
```csharp
db.Events.OnAfterAssembly(
	async context => await SendTelemetry(context.Expression), 
	context => context.Expression.IsUpdateQueryExpression()
	// ^ execute only when the expression is of type UpdateQueryExpression
);
```
{% /accordian %}

---

## Before Command (Asynchronous)

Event published *before* a database command is executed against the database.  The command text
can be overwritten, or the command text writer can have text appended. Parameters have been set on the command
prior to this event publication.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeCommand({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true,
            "types": [
                { 
                    "typeName" : "Func<BeforeCommandPipelineEventContext,Task>", 
                    "description" : "A delegate receiving event-specific context.  The provided delegate is invoked *before* a SQL statement is executed." 
                }
            ]
        },
        {
            "argumentName" : "shouldInvokeAction",
            "required" : false,
            "defaultValue" : "true",
            "types": [
                { 
                    "typeName" : "Predicate", 
                    "description" : "Invoked to determine if `action` should be invoked, a filter on the event subscription." 
                }
            ]
        },
        {
            "argumentName" : "cancellationToken",
            "required" : false,
            "types": [
                { 
                    "typeName" : "CancellationToken", 
                    "description" : "A cancellation token that will be checked occassionally as the pipeline progresses.  An `OperationCanceledException` will be thrown if the token is cancelled." 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

## After Command (Asynchronous)

Event published *after* a command has been executed against the database.

> Subscribe to this event only if you need access to the command after execution of the SQL statement. The command (and any data readers) 
are still open.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterCommand({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context.  The provided delegate is invoked *after* a command has been executed.",
            "types": [
                { 
                    "typeName" : "Func<AfterCommandPipelineEventContext,Task>" 
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

## After Complete (Asynchronous)

The final event published.  This is a good event to subscribe to for needs that apply to all queries and they
are only published after successful execution of the SQL statement.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterComplete({action}[,{shouldInvokeAction}][,{cancellationToken}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context." ,
            "types": [
                { 
                    "typeName" : "Func<AfterCompletePipelineEventContext,Task>"
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