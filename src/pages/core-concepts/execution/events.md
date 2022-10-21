---
title: Pipeline Events
---

During the workflow of an execution pipeline, the execution pipeline can raise events that enable an integration point for any cross-cutting concerns. 
To receive events, you must subscribe to the event at application startup using runtime configuration.

> You can subscribe to multiple event types, and even the same event multiple times.

When subscribing to events, you provide delegates that receive a context object.  These context objects contain different properties based on the 
SQL statement type (*SELECT*, etc) and where the execution pipeline is in it's workflow, but the context will always contain the `QueryExpression`.  
When subscribing to events, you can provide a sync version of your delegate, an async version of your delegate, or both.  dbExpression will manage 
making a sync version of an async delegate, or an async version of a sync delegate for you.  When subscribing to events, use whichever type 
(sync or async) makes sense in the context of the delegate.

> When subscribing to events, use whichever type (sync or async) makes sense in the context of the delegate.

When an event is published by an execution pipeline, all subscriptions to that event will receive the context object.  The context object can be changed,
and depending on the workflow step of the execution pipeline, those changes may or may not have an effect.  For example, subscribing to an after execution
event and changing the `QueryExpression` to alter the SQL statement will have no effect - the SQL statement has already been assembled and executed.

The following example subscribes to the `OnBeforeSqlStatmentExecution` event (twice):
```csharp
...

db =>
{
    //log a message when a SELECT operation is executed
    db.Events.OnBeforeSqlStatementExecution(
        context => logger.LogDebug("{Name} is selecting {Entity} records.", HttpContext.User.Name, context.EntityType), 
        context => context.Expression.IsSelectQueryExpression() //<- execute only when the expression is SELECT
    );
    
    //log a message when a SELECT operation is executed when dbo.Person is in the FROM clause
    db.Events.OnBeforeSqlStatementExecution(
        context => logger.LogDebug("dbExpression is selecting {nameof(Person)} records."),
        context => context.Expression.IsSelectQueryExpression() && (context.Expression as SelectQueryExpression)?.From?.Expression is PersonEntity //<- execute only when the expression is SELECT and the FROM is dbo.Person
    );
});

...
```

Example use cases for subscribing to events: 
* setting an audit field value to a value from the current logged on user
* logging activities
* ensuring multi-tenancy aspects of a query
 
See the Reference section for how to subscribe to events:
* [*SELECT* execution pipeline](../../reference/configuration/runtime/select-pipeline-events)
* [*INSERT* execution pipeline](../../reference/configuration/runtime/insert-pipeline-events)
* [*UPDATE* execution pipeline](../../reference/configuration/runtime/update-pipeline-events)
* [*DELETE* execution pipeline](../../reference/configuration/runtime/delete-pipeline-events)