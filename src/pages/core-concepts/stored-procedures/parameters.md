---
title: Parameters
---

## Input Parameters

dbExpression accepts values for a stored procedure's input parameters as method parameters.  
Parameters with a direction of `InputOutput` will also be included in the list of method
parameters.

For example, let's define a stored procedure named `GetPersonsWithCreditLimitGreaterThan` as follows:
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

Building a query to execute this stored procedure would look like the following: 
```csharp
db.sp.dbo.GetPersonsWithCreditLimitGreaterThan(10_000) ...
```

## Output Parameters

Parameters with a direction of `Output` can be read/retrieved via a delegate provided as a method parameter, 
always after all input parameters.  Again, parameters with a direction of `InputOutput` can be read/retrieved via a 
delegate you provide as a method parameter.

Let's modify the stored procedure from above and add an `Output` parameter:
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

The dbExpression CLI tool will scaffold a method signature for this stored procedure that looks like:
```csharp
public static StoredProcedureContinuation GetPersonsWithCreditLimitGreaterThan(int CreditLimit, Action<ISqlOutputParameterList> outputParameters)
{
    ...
}
```

Building a query for this stored procedure would look like the following: 
```csharp
int maxCreditLimit = 0;

db.sp.dbo.GetPersonsWithCreditLimitGreaterThan(10_000, outParams => maxCreditLimit = outParams[nameof(maxCreditLimit)]) ...

//or alternatively using the 'FindByName' method to access the output parameter:
db.sp.dbo.GetPersonsWithCreditLimitGreaterThan(10_000, outParams => maxCreditLimit = outParams.FindByName(nameof(maxCreditLimit))) ...

```

## Input/Output Parameters

Reading values of a `InputOutput` parameters is accomplished using the same delegate used for `Output` parameters.