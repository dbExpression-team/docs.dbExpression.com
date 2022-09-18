---
title: Update Execution Pipeline
---

For UPDATE operations, the following pipeline is executed:

![Update Query Expression Pipeline](https://dbexpressionpublic.blob.core.windows.net/docs/update-execution-pipeline.png)

When executing UPDATE operations, the following additional events can be subscribed to:
* ```OnBeforeUpdateSqlStatementAssembly``` - This event is fired *just after* the ```OnBeforeSqlStatementAssembly``` event.
* ```OnBeforeUpdateQueryExecution``` - This event is fired *just before* the ```OnBeforeSqlStatementExecution``` event.
* ```OnAfterUpdateQueryExecution``` - This event is fired *just after* the ```OnAfterSqlStatementExecution``` event.