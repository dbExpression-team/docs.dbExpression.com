---
title: Pipeline Events
---

When a QueryExpression is executed by an execution pipeline, the execution pipeline raises events that enable the application of cross-cutting concerns across all queries.  Example use cases: 
* setting an audit field value to a value from the current logged on user
* logging activities
* ensuring multi-tenancy aspects of a query

While all QueryExpressions are executed using ```Execute``` or ```ExecuteAsync```, execution pipelines are different based on whether the query is a SELECT, INSERT, UPDATE, or DELETE operation (or a stored procedure).  
Each of these distinct execution pipelines raise different event types.  However, all execution pipelines raise the following events:
* ```OnBeforeSqlStatementAssembly``` - This event is fired *prior* to constructing a SQL statement from the QueryExpression.  The QueryExpression can be modified at this point.
* ```OnAfterSqlStatementAssembly``` - This event is fired *after* constructing a SQL statement from the QueryExpression.  At this stage, a SQL statement and all parameters have been constructed.
* ```OnBeforeSqlStatementExecution``` - This event is fired *just before* a SQL command is executed against the target database.
* ```OnAfterSqlStatementExecution``` - This event is fired *just after* a SQL command is executed against the target database.  At this stage, any output parameters are available.

Subscribing to events is discussed in more detail in the [Runtime Configuration (Events)](/runtime-configuration/events) section.