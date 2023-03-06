---
title: Views
description: How to use views in query expressions.
---

Queries can also be composed with database views - use them as you would
any other table expression.

Let's walk-thru a query, materializing that query as a view in the database,
then re-working the original query to use the new view.

Given the following query which selects aggregated data for a person:
{% code-example %}
```csharp
IEnumerable<dynamic> aggregates = db.SelectMany(
    dbo.Person.Id,
    db.fx.Sum(dbo.Purchase.TotalPurchaseAmount).As("TotalAmount"),
    db.fx.Count(dbo.Purchase.Id).As("TotalCount")
)
.From(dbo.Person)
.InnerJoin(dbo.Purchase).On(dbo.Purchase.PersonId == dbo.Person.Id)
.GroupBy(
    dbo.Person.Id
)
.Execute();
```
```sql
SELECT
	[t0].[Id],
	SUM([t1].[TotalPurchaseAmount]) AS [TotalAmount],
	COUNT([t1].[Id]) AS [TotalCount]
FROM
	[dbo].[Person] AS [t0]
	INNER JOIN [dbo].[Purchase] AS [t1] ON [t1].[PersonId] = [t0].[Id]
GROUP BY
	[t0].[Id];
```
{% /code-example %}

We can materialize this into a database view named *PersonTotalPurchasesView*:
```sql
CREATE VIEW [dbo].[PersonTotalPurchasesView]
AS
SELECT        
	[dbo].[Person].[Id], 
	SUM([dbo].[Purchase].[TotalPurchaseAmount]) AS [TotalAmount],
	COUNT([dbo].[Purchase].[Id]) AS [TotalCount]
FROM            
	[dbo].[Person] 
	INNER JOIN [dbo].[Purchase] ON [dbo].[Purchase].[PersonId] = [dbo].[Person].[Id]
GROUP BY 
	[dbo].[Person].[Id]

GO
```

Regenerating code using the dbExpression CLI tool (`dbex gen`), the code will now contain a database 
entity (POCO) named `PersonTotalPurchasesView`, which can be used in any query operation that supports views.  
Re-writing the original query using the view and adding a where clause:
{% code-example %}
```csharp
//return a PersonTotalPurchasesView, where the person's id is 1.
PersonTotalPurchasesView? person_total = db.SelectOne<PersonTotalPurchasesView>()
    .From(dbo.PersonTotalPurchasesView)
    .Where(dbo.PersonTotalPurchasesView.Id == 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT TOP(1)
	[t0].[Id],
	[t0].[TotalAmount],
	[t0].[TotalCount]
FROM
	[dbo].[PersonTotalPurchasesView] AS [t0]
WHERE
	[t0].[Id] = @P1;',N'@P1 int',@P1=1
```
{% /code-example %}

This returns an instance of `PersonTotalPurchasesView` with properties `PersonId`, `TotalAmount`, and `TotalCount` (the
same properties as in the original `dynamic`).

## Using a View in a Select Query

{% code-example %}
```csharp
//return a list of PersonTotalPurchasesView, where the list contains any person who has a sum of purchases exceeding $2,500.
IEnumerable<PersonTotalPurchasesView> people_totals = db.SelectMany<PersonTotalPurchasesView>()
    .From(dbo.PersonTotalPurchasesView)
    .Where(dbo.PersonTotalPurchasesView.TotalAmount > 2500)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[Id],
	[t0].[TotalAmount],
	[t0].[TotalCount]
FROM
	[dbo].[PersonTotalPurchasesView] AS [t0]
WHERE
	[t0].[TotalAmount] > @P1;',N'@P1 money',@P1=$2500.0000
```
{% /code-example %}

## Using a View in an Update Query

{% code-example %}
```csharp
//update any person's credit limit by 10% (rounding down to the nearest integer) who has spent more than $2,500 and a credit limit exists
int affectedCount = db.Update(
        dbo.Person.CreditLimit.Set(db.fx.Cast(db.fx.Floor(dbo.Person.CreditLimit * 1.1)).AsInt())
    )
    .From(dbo.Person)
    .InnerJoin(dbo.PersonTotalPurchasesView).On(dbo.Person.Id == dbo.PersonTotalPurchasesView.Id)
    .Where(dbo.PersonTotalPurchasesView.TotalAmount > 2500)
    .Execute();
```
```sql
exec sp_executesql N'UPDATE
	[t0]
SET
	[t0].[CreditLimit] = CAST(FLOOR(([t0].[CreditLimit] * @P1)) AS Int)
FROM
	[dbo].[Person] AS [t0]
	INNER JOIN [dbo].[PersonTotalPurchasesView] AS [t1] ON [t0].[Id] = [t1].[Id]
WHERE
	[t1].[TotalAmount] > @P2;
SELECT @@ROWCOUNT;',N'@P1 float,@P2 money',@P1=1.1000000000000001,@P2=$2500.0000
```
{% /code-example %}

## Using a View in a Delete Query

{% code-example %}
```csharp
//delete all addresses for any person that hasn't made any purchases
int affectedCount = db.Delete()
	.From(dbo.PersonAddress)
	.InnerJoin(dbo.Person).On(dbo.PersonAddress.PersonId == dbo.Person.Id)
	.LeftJoin(dbo.PersonTotalPurchasesView).On(dbo.Person.Id == dbo.PersonTotalPurchasesView.Id)
	.Where(dbo.PersonTotalPurchasesView.Id == dbex.Null)
	.Execute();
```
```sql
DELETE
	[t0]
FROM
	[dbo].[Person_Address] AS [t0]
	INNER JOIN [dbo].[Person] AS [t1] ON [t0].[PersonId] = [t1].[Id]
	LEFT JOIN [dbo].[PersonTotalPurchasesView] AS [t2] ON [t1].[Id] = [t2].[Id]
WHERE
	[t2].[Id] IS NULL;
SELECT @@ROWCOUNT;
```
{% /code-example %}