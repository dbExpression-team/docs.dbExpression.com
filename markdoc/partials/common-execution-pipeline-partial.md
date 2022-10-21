## Before Start (Synchronous)

The first event published, it is published *before* a SQL statement is assembled from the `QueryExpression`.  This event should be used to apply any query-specifics 
to the `QueryExpression` that need to be applied immediately after `Execute` or `ExecuteAsync` is invoked.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeStart({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context.  The provided delegate is invoked before a SQL statement is assembled.",
            "types": [
                { 
                    "typeName" : "Action<BeforeStartPipelineEventContext>" 
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

{% accordian caption="syntax examples" %}
Log a message *before* any sql statement for a query is assembled.
```csharp
db.Events.OnBeforeStart(
	context => logger.LogDebug("Beginning execution of a sql statement for a {query} query.", context.Expression.GetType())
);
```
Log a message *before* any *{% $upper-case-query-type %}* sql statement is assembled, but only if the From is dbo.Person.
```csharp
db.Events.OnBeforeStart(
	context => logger.LogDebug("Beginning execution of a {query} sql statement from [Person].", context.Expression.GetType()),
	context => context.Expression.From!.Expression as EntityExpression == dbo.Person 
	// ^ publish event only when the from is dbo.Person
);
```
{% /accordian %}

---

## After Assembly (Synchronous)

Event published *after* a SQL statement is assembled from the `QueryExpression` and *after* all query-specific after assembly
subscribers have received the query-specific after assembly event publication.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterAssembly({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context." ,
            "types": [
                { 
                    "typeName" : "Action<AfterAssemblyPipelineEventContext>"
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

## Before Command (Synchronous)

Event published *before* a command is executed against the database and *before* the query-specific before command event is published.

{% method-descriptor %}
```json
{
    "syntax" : "OnBeforeCommand({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked before a SQL statement is executed against the database." ,
            "types": [
                { 
                    "typeName" : "Action<BeforeCommandPipelineEventContext>"
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

## After Command (Synchronous)

Event published *after* a command is executed against the database and *after* the query-specific after command event is published. 

> Subscribe to this event only if you need access to the command after execution of the SQL statement. The command (and any data readers) 
are still open.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterCommand({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked after a command has been executed." ,
            "types": [
                { 
                    "typeName" : "Action<AfterCommandPipelineEventContext>"
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

## After Complete (Synchronous)

Event published *after* the pipeline has completed all work, this is the last event published.

{% method-descriptor %}
```json
{
    "syntax" : "OnAfterComplete({action}[,{shouldInvokeAction}])",
    "arguments" : [
        {
            "argumentName" : "action",
            "required" : true, 
            "description" : "A delegate receiving event-specific context. The provided delegate is invoked after the pipeline has completed all work." ,
            "types": [
                { 
                    "typeName" : "Action<AfterCompletePipelineEventContext>"
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