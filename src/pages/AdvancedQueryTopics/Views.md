---
title: Views
description: How to use views in query expressions.
---

QueryExpressions can also be composed with database views.  Given the following QueryExpression which selects aggregated data for a person:
```csharp
IList<dynamic> aggregates = db.SelectOne(
    dbo.Person.Id,
    db.fx.Sum(dbo.Purchase.TotalPurchaseAmount).As("TotalAmount"),
    db.fx.Count(dbo.Purchase.Id).As("TotalCount")
)
.From(dbo.Person)
.InnerJoin(dbo.Purchase).On(dbo.Purchase.PersonId == dbo.Person.Id)
.GroupBy(
    dbo.Person.Id
)
```

{% collapsable title="SQL statement" %}
```sql
SELECT        
	[dbo].[Person].[Id], 
	SUM([dbo].[Purchase].[TotalPurchaseAmount]) AS [TotalAmount],
	COUNT([dbo].[Purchase].[Id]) AS [TotalCount]
FROM            
	[dbo].[Person] 
	INNER JOIN [dbo].[Purchase] ON [dbo].[Purchase].[PersonId] = [dbo].[Person].[Id]
GROUP BY 
	[dbo].[Person].[Id]
```
{% /collapsable %}

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

Regenerating code using the dbExpression CLI tool (```dbex gen```), the code will now contain a database entity (POCO) named ```PersonTotalPurchasesView```, which can be used in any query operation that supports views.  For example, to retrieve view data for a single person:
```csharp
//return a PersonTotalPurchasesView, where the person's id is 1.
PersonTotalPurchasesView person_total = db.SelectOne<PersonTotalPurchasesView>()
    .From(dbo.PersonTotalPurchasesView)
    .Where(dbo.PersonTotalPurchasesView.Id == 1)
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'SELECT TOP(1)
	[dbo].[PersonTotalPurchasesView].[Id],
	[dbo].[PersonTotalPurchasesView].[TotalAmount],
	[dbo].[PersonTotalPurchasesView].[TotalCount]
FROM
	[dbo].[PersonTotalPurchasesView]
WHERE
	[dbo].[PersonTotalPurchasesView].[Id] = @P1;',N'@P1 int',@P1=1
```
{% /collapsable %}

This returns an instance of ```PersonTotalPurchasesView``` with properties ```PersonId```, ```TotalAmount```, and ```TotalCount``` properties.

To retrieve view data for many:
```csharp
//return a list of PersonTotalPurchasesView, where the list contains any person who has a sum of purchases exceeding $2,500.
IList<PersonTotalPurchasesView> people_totals = db.SelectMany<PersonTotalPurchasesView>()
    .From(dbo.PersonTotalPurchasesView)
    .Where(dbo.PersonTotalPurchasesView.TotalAmount > 2500)
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'SELECT
	[dbo].[PersonTotalPurchasesView].[Id],
	[dbo].[PersonTotalPurchasesView].[TotalAmount],
	[dbo].[PersonTotalPurchasesView].[TotalCount]
FROM
	[dbo].[PersonTotalPurchasesView]
WHERE
	[dbo].[PersonTotalPurchasesView].[TotalAmount] > @P1;',N'@P1 money',@P1=$2500.0000
```
{% /collapsable %}

Using a view to update records:
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

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'UPDATE
	[dbo].[Person]
SET
	[CreditLimit] = CAST(FLOOR(([CreditLimit] * @P1)) AS Int)
FROM
	[dbo].[Person]
	INNER JOIN [dbo].[PersonTotalPurchasesView] ON [dbo].[Person].[Id] = [dbo].[PersonTotalPurchasesView].[Id]
WHERE
	[dbo].[PersonTotalPurchasesView].[TotalAmount] > @P2;
SELECT @@ROWCOUNT;',N'@P1 float,@P2 money',@P1=1.1000000000000001,@P2=$2500.0000
```
{% /collapsable %}

Using a view to delete records:
```csharp
//delete persons who haven't made any purchases
int affectedCount = db.Delete()
    .From(dbo.Person)
    .LeftJoin(dbo.PersonTotalPurchasesView).On(dbo.Person.Id == dbo.PersonTotalPurchasesView.Id)
    .Where(dbo.PersonTotalPurchasesView.Id == dbex.Null)
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
DELETE
	[dbo].[Person]
FROM
	[dbo].[Person]
	LEFT JOIN [dbo].[PersonTotalPurchasesView] ON [dbo].[Person].[Id] = [dbo].[PersonTotalPurchasesView].[Id]
WHERE
	[dbo].[PersonTotalPurchasesView].[Id] IS NULL;
SELECT @@ROWCOUNT;
```
{% /collapsable %}