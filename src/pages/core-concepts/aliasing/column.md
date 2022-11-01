---
title: Column Aliasing
---

Column aliasing in dbExpression is used to eliminate ambiguity in identical column names in a returned rowset, or to simply change the name of a column in a returned rowset.  
For example, the following query would return two columns with a name of `Id`:

```csharp
IList<dynamic> purchases = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.LastName,
        dbo.Purchase.Id,
        dbo.Purchase.TotalPurchaseAmount
    )
    .From(dbo.Purchase)
    .InnerJoin(dbo.Person).On(dbo.Purchase.PersonId == dbo.Person.Id)
    .Execute();
```
Execution of this would cause the following runtime exception during mapping to a dynamic object:  `HatTrick.DbEx.Sql.DbExpressionException : An element with the same key 'Id' already exists in the ExpandoObject.`

This is corrected by providing a field-level alias on one (or more) of the `Id` fields by using the `As(...)` method:
{% code-example %}
```csharp
IList<dynamic> purchases = db.SelectMany(
        dbo.Person.Id.As("PersonId"),
        dbo.Person.LastName,
        dbo.Purchase.Id,
        dbo.Purchase.TotalPurchaseAmount
    )
    .From(dbo.Purchase)
    .InnerJoin(dbo.Person).On(dbo.Purchase.PersonId == dbo.Person.Id)
    .Execute();
```
```sql
SELECT
	[dbo].[Person].[Id] AS [PersonId],
	[dbo].[Person].[LastName],
	[dbo].[Purchase].[Id],
	[dbo].[Purchase].[TotalPurchaseAmount]
FROM
	[dbo].[Purchase]
	INNER JOIN [dbo].[Person] ON [dbo].[Purchase].[PersonId] = [dbo].[Person].[Id];
```
{% /code-example %}