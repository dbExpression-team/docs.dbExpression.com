---
title: Execute a Query
---

The `Execute` and `ExecuteAsync` methods have several overloads with varying method parameters, which enable custom behavior at the query execution level. 
Method parameters include:

* `commandTimeout` - The execution duration (in seconds) of a query before execution will timeout if not yet complete.
* `connection` - a SQL connection to use for query execution.  Using this parameter with a valid connection is the foundation of transaction support (we'll discuss
this in [Connections](../execution/connections) and [Transactions](../execution/transactions)).

> Some method parameters of query execution apply to all queries, while others are specific to the type of query.

For queries executing a *SELECT* statement, the `Execute` and `ExecuteAsync` methods provide additional method parameters:

* `read` - an `Action<ISqlFieldReader>` that enables you to take full control of the data reader returned from execution.  Invocations using this parameter *DO NOT* have a return, it's
up to you to manage the data.
* `map` - and `Func<ISqlFieldReader,T>` that enables you to take control of the mapping of rowset data.  Invocations using this parameter return value(s).

*The `ExecuteAsync` method also supports `Task` based usage and honors a `CancellationToken` if provided.*.
