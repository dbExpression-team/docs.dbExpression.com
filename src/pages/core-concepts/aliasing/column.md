---
title: Column Aliasing
---

Column aliasing in dbExpression is used to eliminate ambiguity in identical column names in a returned rowset, or to simply change the name of a column in a returned rowset.  
For example, the following query would return two columns with a name of `Id`:

```csharp
IEnumerable<dynamic> purchases = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.LastName,
        dbo.Purchase.Id,
        dbo.Purchase.TotalPurchaseAmount
    )
    .From(dbo.Purchase)
    .InnerJoin(dbo.Person).On(dbo.Purchase.PersonId == dbo.Person.Id)
    .Execute();
```
Execution of this would cause the following runtime exception during mapping to a dynamic object:  `DbExpression.Sql.DbExpressionException : An element with the same key 'Id' already exists in the ExpandoObject.`

This is corrected by providing a field-level alias on one (or more) of the `Id` fields by using the `As(...)` method:
{% code-example %}
```csharp
IEnumerable<dynamic> purchases = db.SelectMany(
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
    [t0].[Id] AS [PersonId],
    [t0].[LastName],
    [t1].[Id],
    [t1].[TotalPurchaseAmount]
FROM
    [dbo].[Purchase] AS [t1]
    INNER JOIN [dbo].[Person] AS [t0] ON [t1].[PersonId] = [t0].[Id];
```
{% /code-example %}