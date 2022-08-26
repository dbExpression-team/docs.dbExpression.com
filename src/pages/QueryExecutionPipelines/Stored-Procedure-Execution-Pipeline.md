---
title: Stored Procedure Execution Pipeline
---

For execution of stored procedures, the following pipeline is executed:

![Stored Procedure Expression Pipeline](https://dbexpressionpublic.blob.core.windows.net/docs/stored-procedure-execution-pipeline.png)

When executing stored procedures, the following additional events can be subscribed to:
* ```OnBeforeStoredProcedureExecution``` - This event is fired *just before* the ```OnBeforeSqlStatementExecution``` event.
* ```OnAfterStoredProcedureExecution``` - This event is fired *just after* the ```OnAfterSqlStatementExecution``` event.