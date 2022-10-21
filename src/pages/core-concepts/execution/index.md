---
title: Query Execution
---

When you invoke `Execute` or `ExecuteAsync` on a query, dbExpression uses factories to retrieve the services it needs, where a factory is 
responsible for providing a service instance to perform a specific operation.

Factories, services, and the options to replace and/or configure these services fall into the following general categories:
* **Assembly** - From the start of fluently building a query expression to the assembly of that query expression into a sql statement.
* **Query Execution** - After assembly, the process of connecting to the database, building a command and setting (any) parameters and executing the sql statement against the target database.
* **Conversion and Mapping** - Converters are used to convert data as it is sent to and retrieved from the database.  When the query requests one or more entity types, data is mapped to instances of these entities.
* **Events** - events that occur during the execution of a sql statement, allowing an integration point to implement cross-cutting concerns.
