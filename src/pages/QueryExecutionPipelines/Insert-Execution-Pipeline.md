---
title: Insert Execution Pipeline
---

For INSERT operations, the following pipeline is executed:

![Insert Query Expression Pipeline](https://dbexpressionpublic.blob.core.windows.net/docs/insert-execution-pipeline.png)

When executing INSERT operations, the following additional events can be subscribed to:
* ```OnBeforeInsertSqlStatementAssembly``` - This event is fired *just after* the ```OnBeforeSqlStatementAssembly``` event.
* ```OnBeforeInsertQueryExecution``` - This event is fired *just before* the ```OnBeforeSqlStatementExecution``` event.
* ```OnAfterInsertQueryExecution``` - This event is fired *just after* the ```OnAfterSqlStatementExecution``` event.