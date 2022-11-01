---
title: Stored Procedure Query Concepts
---

The dbExpression CLI tool generates a model of your database - including stored procedures.  

Building a query to execute a stored procedure is slightly different than building a query for *SELECT*, *UPDATE*, 
*INSERT*, and *DELETE* statements.  To build a query for a stored procedure, use `sp`, 
a member of the `db` database accessor.

> Use the `sp` property of the database accessor to execute stored procedures

## Stored Procedure Query Composition

We'll list the nomenclature in common with other queries:
* **Database Accessor** - The root accessor class for building SQL queries.
* **Schema Accessor** - Classes that represent each schema in your target database.

And some new nomenclature, specific to stored procedures:
* **Stored Procedures Accessor** - The accessor class for all stored procedures in the target database.
* **Stored Procedure Method** - The scaffolded method representing the stored procedure in the target database.
* **Input Parameter(s)** - Method parameters that align to the input parameters of the stored procedure.
* **Output Parameter(s)** - The delegate that will receive a list of all output parameters after execution of the stored procedure.
* **Return Type** - Definition of the type of data that will be returned from execution of the stored procedure.

![Expression Composition](https://dbexpressionpublic.blob.core.windows.net/docs/sproc-expression-execution.png)

As with all queries, execution of a stored procedure uses the synchronous or asynchronous variations `Execute` or `ExecuteAsync` to execute the stored 
procedure against the target database.