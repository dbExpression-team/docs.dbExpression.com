---
title: Query Execution
---

When one of the execute methods (```Execute``` or ```ExecuteAsync```) is invoked on a query expression, an execution pipeline is created that manages the assembly, execution, and conversion/mapping of data to and from the database. 

> Some aspects of query execution are global in nature, while others are specific to the type of query.

## Query-scoped Execution Options
The ```Execute``` and ```ExecuteAsync``` methods have several overloads with varying method parameters, which enable custom behavior at the QueryExpression execution level.  Parameters include:

* ```commandTimeout``` - an integer value that represents the number of seconds a query operation can take before the query operation will timeout if it is not yet complete.
* ```connection``` - a SQL connection to use for query execution.  Using this parameter with a valid connection is the foundation of transaction support (see [Connections](/connections/connections)).

*The ```ExecuteAsync``` method also supports Task based usage and honors a ```CancellationToken``` if provided.  The remaining discussion and examples in this section omit discussion of these for brevity*.
