---
title: Delete Execution Pipeline
---

For DELETE operations, the following pipeline is executed:

![Delete Query Expression Pipeline](https://dbexpressionpublic.blob.core.windows.net/docs/delete-execution-pipeline.png)

When executing DELETE operations, the following additional events can be subscribed to:
* ```OnBeforeDeleteQueryExecution``` - This event is fired *just before* the ```OnBeforeSqlStatementExecution``` event.
* ```OnAfterDeleteQueryExecution``` - This event is fired *just after* the ```OnAfterSqlStatementExecution``` event.