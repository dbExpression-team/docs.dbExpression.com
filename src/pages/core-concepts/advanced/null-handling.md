---
title: Null Handling
description: How to use null in query expressions.
---

With dbExpression, use the helper method `dbex.Null` (see [dbex](../../core-concepts/utilities/dbex#dbex-null)) instead of `null`.  
dbExpression requires clarity on types - the use of `null` should be replaced with `dbex.Null` when it is expected 
to produce a SQL statement with a server side `NULL`.  This is because to the CLR, `null` can be just about anything, 
from any object to any nullable primitive.

For example, the following query will not compile as the right side of the equality can be just about anything, 
and dbExpression constrains what is accepted to ensure valid SQL statements.

```csharp
db.SelectOne<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.LastLoginDate == null)
    .Execute();
```

This would cause a compilation error:  `CS0034 Operator '==' is ambiguous on operands of type 'PersonEntity.LastLoginDateField' and '<null>'`

> It is *preferable* to use `dbex.Null` instead of `null` (or a cast operation to `null`).  In some cases, there is no choice but to use `dbex.Null`, the compiler will indicate when.

 While you can cast a `null` as a specific type, it is *preferable* to use `dbex.Null`.  The following expressions are both valid and produce identical SQL statements:

{% code-example %}
```csharp
// it is known that the equality comparison is to a type of 
// DateTime? as we are casting a CLR null to DateTime?
db.SelectOne<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.LastLoginDate == (DateTime?)null)
    .Execute();

// equality comparison to a NullElement provided by dbex.Null,
// which is fully understood by dbExpression
db.SelectOne<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.LastLoginDate == dbex.Null)
    .Execute();
```
```sql
SELECT TOP(1)
	[t0].[Id],
	[t0].[FirstName],
	[t0].[LastName],
	[t0].[BirthDate],
	[t0].[GenderType],
	[t0].[CreditLimit],
	[t0].[YearOfLastCreditLimitReview],
	[t0].[RegistrationDate],
	[t0].[LastLoginDate],
	[t0].[DateCreated],
	[t0].[DateUpdated]
FROM
	[dbo].[Person] AS [t0]
WHERE
	[t0].[LastLoginDate] IS NULL;
```
{% /code-example %}