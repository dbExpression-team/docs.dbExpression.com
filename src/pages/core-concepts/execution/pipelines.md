---
title: Execution Pipelines
---

When one of the execute methods (`Execute` or `ExecuteAsync`) is invoked on a query expression, an execution pipeline 
is created that manages the workflow and services used for assembly, execution, and conversion/mapping of data to and 
from the database. Execution pipelines are built directly on top of ADO.NET.

> dbExpression is built directly on top of ADO.NET.

There are several execution pipeline types, a one-to-one with the SQL statement type:
{% table %}
- Execution pipeline type
- SQL statement type
---
- `ISelectQueryExpressionExecutionPipeline`
- SELECT
---
- `IInsertQueryExpressionExecutionPipeline`
- INSERT
---
- `IUpdateQueryExpressionExecutionPipeline`
- UPDATE
---
- `IDeleteQueryExpressionExecutionPipeline`
- DELETE
---
- `IStoredProcedureQueryExpressionExecutionPipeline`
- well, a stored procedure
{% /table %}
