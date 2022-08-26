---
title: Stored Procedure Query Expressions
---

The dbExpression CLI tool generates a static model representing your database - including stored procedures.  

Building a QueryExpression to execute a stored procedure is slightly different than building a QueryExpression for query operations like SELECT, UPDATE, INSERT, and DELETE.  To build a QueryExpression for a stored procedure, use ```sp```, a member of the ```db``` database accessor class.

> Use the ```sp``` property of the database accessor to execute stored procedures

## Stored Procedure QueryExpression
* **Database Accessor** - The root accessor class for building SQL queries.
* **Stored Procedures Accessor** - The accessor class for all stored procedures in the target database.
* **Schema Accessor** - Classes that represent each schema in your target database.
* **Stored Procedure Method** - The scaffolded method representing the stored procedure in the target database.
* **Input Parameter(s)** - Method parameters that align to the input parameters of the stored procedure.
* **Output Parameter(s)** - The delegate that will receive a list of all output parameters after execution of the stored procedure.
* **Return Type** - Definition of the type of data that will be returned from execution of the stored procedure.

![Expression Composition](https://dbexpressionpublic.blob.core.windows.net/docs/sproc-expression-execution.png)

As with all other QueryExpression execution methods, execution of a stored procedure uses the synchronous or asynchronous variations ```Execute``` or ```ExecuteAsync``` to execute the stored procedure against the target database.

## Input Parameters
dbExpression exposes a stored procedure's input parameters as method parameters of the scaffolded method.  Parameters with a direction of ```InputOutput``` are exposed as method parameters and are additionally exposed for reading/retrieval via a delegate provided as a method parameter.

For example, let's define a stored procedure named ```GetPersonsWithCreditLimitGreaterThan``` as follows:
```sql
CREATE PROCEDURE [dbo].[GetPersonsWithCreditLimitGreaterThan]
    @CreditLimit INT
AS
    SELECT  
    	[Id]
    FROM 
    	[dbo].[Person]
    WHERE 
    	[dbo].[Person].[CreditLimit] > @CreditLimit;
```
The dbExpression CLI tool would scaffold a method signature for the stored procedure that looks like:
```csharp
public static StoredProcedureContinuation GetPersonsWithCreditLimitGreaterThan(int CreditLimit)
{
    ...
}
```

Building a QueryExpression to execute this stored procedure would look like the following: 
```csharp
db.sp.dbo.GetPersonsWithCreditLimitGreaterThan(10000) ...
```

## Output Parameters
Parameters with a direction of ```Output``` are exposed for reading/retrieval via a delegate provided as a method parameter after all input parameters.  Again, parameters with a direction of ```InputOutput``` are exposed as method parameters and are additionally exposed for reading/retrieval via a delegate provided as a method parameter.

Let's modify the stored procedure from above and add an ```Output``` parameter:
```sql
CREATE PROCEDURE [dbo].[GetPersonsWithCreditLimitGreaterThan]
    @CreditLimit INT,
    @MaxCreditLimit INT OUTPUT
AS
    SELECT  
    	[Id]
    FROM 
    	[dbo].[Person]
    WHERE 
    	[dbo].[Person].[CreditLimit] > @CreditLimit;
    	
    SELECT
        @MaxCreditLimit = MAX([dbo].[Person].[CreditLimit])
    FROM
        [dbo].[Person]
```
The dbExpression CLI tool would scaffold a method signature for this stored procedure that looks like:
```csharp
public static StoredProcedureContinuation GetPersonsWithCreditLimitGreaterThan(int CreditLimit, Action<ISqlOutputParameterList> outputParameters)
{
    ...
}
```

Building a QueryExpression for this stored procedure would look like the following: 
```csharp
int maxCreditLimit = 0;

db.sp.dbo.GetPersonsWithCreditLimitGreaterThan(10000, outParams => maxCreditLimit = outParams[nameof(maxCreditLimit)]) ...

//or alternatively using the 'FindByName' method to access the output parameter:
db.sp.dbo.GetPersonsWithCreditLimitGreaterThan(10000, outParams => maxCreditLimit = outParams.FindByName(nameof(maxCreditLimit))) ...

```