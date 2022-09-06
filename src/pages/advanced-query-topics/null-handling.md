---
title: Null Handling
description: How to use null in query expressions.
---

With dbExpression use the helper method ```dbex.Null``` (see [dbex](/utilities/dbex#dbex-null)) instead of ```null```.  dbExpression requires clarity on types, therefore the use of ```null``` should be replaced with ```dbex.Null``` when it is expected to produce a SQL statement with a server side ```NULL```.  This is because to the CLR, ```null``` can be just about anything, from any object to any nullable primitive.  For example, the following QueryExpression will not compile as the right side of the equality can be just about anything, and dbExpression constrains what is accepted to ensure valid SQL statements.

```csharp
db.SelectOne<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.LastLoginDate == null)
    .Execute();
```

This would cause a compilation error:  ```CS0034 Operator '==' is ambiguous on operands of type 'PersonEntity.LastLoginDateField' and '<null>'```

> It is *preferable* to use ```dbex.Null``` instead of ```null``` (or a cast operation to ```null```).  In some cases, there is no choice but to use ```dbex.Null```, the compiler will indicate when.

 While you can cast a ```null``` as a specific type, it is *preferable* to use ```dbex.Null```.  The following expressions are both valid and produce identical SQL statements:

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

{% collapsable title="SQL statement" %}
```sql
SELECT TOP(1)
	[dbo].[Person].[Id],
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName],
	[dbo].[Person].[BirthDate],
	[dbo].[Person].[GenderType],
	[dbo].[Person].[CreditLimit],
	[dbo].[Person].[YearOfLastCreditLimitReview],
	[dbo].[Person].[RegistrationDate],
	[dbo].[Person].[LastLoginDate],
	[dbo].[Person].[DateCreated],
	[dbo].[Person].[DateUpdated]
FROM
	[dbo].[Person]
WHERE
	[dbo].[Person].[LastLoginDate] IS NULL;
```
{% /collapsable %}