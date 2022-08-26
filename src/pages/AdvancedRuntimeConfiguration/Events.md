---
title: Events
---

During execution of a sql statement, dbExpression can raise events that allow an integration point to implement cross-cutting concerns.  Simply subscribe to the event using one or more of the following:


* ```OnBeforeSqlStatementAssembly(Action<BeforeAssemblyPipelineExecutionContext> action)``` - execute the provided delegate *before* a SQL statement is assembled for any SQL operation (SELECT, UPDATE, INSERT, DELETE).
* ```OnBeforeSqlStatementAssembly(Action<BeforeAssemblyPipelineExecutionContext> action, Predicate<BeforeAssemblyPipelineExecutionContext> predicate)``` - execute the provided delegate *before* a SQL statement is assembled for any SQL operation (SELECT, UPDATE, INSERT, DELETE) when the predicate condition evaluates to true.
* ```OnAfterSqlStatementAssembly(Action<AfterAssemblyPipelineExecutionContext> action)``` - execute the provided delegate *after* a SQL statement is assembled for any SQL operation (SELECT, UPDATE, INSERT, DELETE).
* ```OnAfterSqlStatementAssembly(Action<AfterAssemblyPipelineExecutionContext> action, Predicate<AfterAssemblyPipelineExecutionContext> predicate)``` - execute the provided delegate *after* a SQL statement is assembled for any SQL operation (SELECT, UPDATE, INSERT, DELETE) when the predicate condition evaluates to true.
* ```OnBeforeInsertQueryExecution(Action<BeforeInsertPipelineExecutionContext> action)``` - execute the provided delegate *before* a SQL statement is executed for the SQL operation INSERT.
* ```OnBeforeInsertQueryExecution(Action<BeforeInsertPipelineExecutionContext> action, Predicate<BeforeInsertPipelineExecutionContext> predicate)``` - execute the provided delegate *before* a SQL statement is executed for the SQL operation INSERT when the predicate condition evaluates to true.
* ```OnAfterInsertQueryExecution(Action<AfterInsertPipelineExecutionContext> action)``` - execute the provided delegate *after* a SQL statement is executed for the SQL operation INSERT.
* ```OnAfterInsertQueryExecution(Action<AfterInsertPipelineExecutionContext> action, Predicate<AfterInsertPipelineExecutionContext> predicate)``` - execute the provided delegate *after* a SQL statement is executed for the SQL operation INSERT when the predicate condition evaluates to true.
* ```OnBeforeUpdateQueryExecution(Action<BeforeUpdatePipelineExecutionContext> action)``` - execute the provided delegate *before* a SQL statement is executed for the SQL operation UPDATE.
* ```OnBeforeUpdateQueryExecution(Action<BeforeUpdatePipelineExecutionContext> action, Predicate<BeforeUpdatePipelineExecutionContext> predicate)``` - execute the provided delegate *before* a SQL statement is executed for the SQL operation UPDATE when the predicate condition evaluates to true.
* ```OnAfterUpdateQueryExecution(Action<AfterUpdatePipelineExecutionContext> action)``` - execute the provided delegate *after* a SQL statement is executed for the SQL operation UPDATE.
* ```OnAfterUpdateQueryExecution(Action<AfterUpdatePipelineExecutionContext> action, Predicate<AfterUpdatePipelineExecutionContext> predicate)``` - execute the provided delegate *after* a SQL statement is executed for the SQL operation UPDATE when the predicate condition evaluates to true.
* ```OnBeforeDeleteQueryExecution(Action<BeforeDeletePipelineExecutionContext> action)``` - execute the provided delegate *before* a SQL statement is executed for the SQL operation DELETE.
* ```OnBeforeDeleteQueryExecution(Action<BeforeDeletePipelineExecutionContext> action, Predicate<BeforeDeletePipelineExecutionContext> predicate)``` - execute the provided delegate *before* a SQL statement is executed for the SQL operation DELETE when the predicate condition evaluates to true.
* ```OnAfterDeleteQueryExecution(Action<AfterDeletePipelineExecutionContext> action)``` - execute the provided delegate *after* a SQL statement is executed for the SQL operation DELETE.
* ```OnAfterDeleteQueryExecution(Action<AfterDeletePipelineExecutionContext> action, Predicate<AfterDeletePipelineExecutionContext> predicate)``` - execute the provided delegate *after* a SQL statement is executed for the SQL operation DELETE when the predicate condition evaluates to true.
* ```OnBeforeSelectQueryExecution(Action<BeforeSelectPipelineExecutionContext> action)``` - execute the provided delegate *before* a SQL statement is executed for the SQL operation SELECT.
* ```OnBeforeSelectQueryExecution(Action<BeforeSelectPipelineExecutionContext> action, Predicate<BeforeSelectPipelineExecutionContext> predicate)``` - execute the provided delegate *before* a SQL statement is executed for the SQL operation SELECT when the predicate condition evaluates to true.
* ```OnAfterSelectQueryExecution(Action<AfterSelectPipelineExecutionContext> action)``` - execute the provided delegate *after* a SQL statement is executed for the SQL operation SELECT.
* ```OnAfterSelectQueryExecution(Action<AfterSelectPipelineExecutionContext> action, Predicate<AfterSelectPipelineExecutionContext> predicate)``` - execute the provided delegate *after* a SQL statement is executed for the SQL operation SELECT when the predicate condition evaluates to true.
* ```OnBeforeSqlStatementExecution(Action<BeforeExecutionPipelineExecutionContext> action)``` - execute the provided delegate *before* a SQL statement is executed for any SQL operation (SELECT, UPDATE, INSERT, DELETE).
* ```OnBeforeSqlStatementExecution(Action<BeforeExecutionPipelineExecutionContext> action, Predicate<BeforeExecutionPipelineExecutionContext> predicate)``` - execute the provided delegate *before* a SQL statement is executed for any SQL operation (SELECT, UPDATE, INSERT, DELETE) when the predicate condition evaluates to true.
* ```OnAfterSqlStatementExecution(Action<AfterExecutionPipelineExecutionContext> action)``` - execute the provided delegate *after* a SQL statement is executed for any SQL operation (SELECT, UPDATE, INSERT, DELETE).
* ```OnAfterSqlStatementExecution(Action<AfterExecutionPipelineExecutionContext> action, Predicate<AfterExecutionPipelineExecutionContext> predicate)``` - execute the provided delegate *after* a SQL statement is executed for any SQL operation (SELECT, UPDATE, INSERT, DELETE) when the predicate condition evaluates to true.

Events, and their relation to execution pipelines are discussed further in [Query Execution Pipelines](/QueryExecutionPipelines/Query-Execution-Pipelines).  *All events include asynchronous versions as well, those have been omitted from above for brevity.*

> You can subscribe to multiple event types, and even the same event multiple times.

When subscribing to events, you can provide a sync version, async version of your delegate, or both.  dbExpression will manage making a sync version of an async delegate, or an async version of a sync delegate for you.  When a QueryExpression is executed using ```Execute``` or ```ExecuteAsync```, all subscribed events will receive the event.  So, you can subscribe to an event by providing an async delegate and QueryExpressions (matching event type and any supplied predicate) executed using the ```Execute``` method will receive the published event.  When subscribing to events, use whichever type (sync or async) makes sense in the context of the delegate.

> When subscribing to events, use whichever type (sync or async) makes sense in the context of the delegate.

To subscribe to a specific event during execution of a QueryExpression, provide a delegate to execute.  Each delegate receives a context object specific to the published event.  This context allows you to change properties of the QueryExpression, or perform any other activities.

The following example subscribes to the ```OnBeforeSqlStatmentExecution``` event (twice):
```csharp

...

	database =>
	{
		database.ConnectionString.Use(Configuration.GetConnectionString("Default"));

		//log a message when a SELECT operation is executed
		database.Events.OnBeforeSqlStatementExecution(
			context => logger.LogDebug("{Name} is selecting {Entity} records.", HttpContext.User.Name, context.EntityType), 
			context => context.Expression.IsSelectQueryExpression() //<- execute only when the expression is SELECT
		);
		
		//log a message when a SELECT operation is executed when dbo.Person is in the FROM clause
		database.Events.OnBeforeSqlStatementExecution(
			context => logger.LogDebug("dbExpression is selecting {nameof(Person)} records."),
			context => context.Expression.IsSelectQueryExpression() && (context.Expression as SelectQueryExpression)?.From is PersonEntity //<- execute only when the expression is SELECT and the FROM is dbo.Person.  context.Expression may be a SelectSetQueryExpression, so using null coalescing
		);
	});

...
```