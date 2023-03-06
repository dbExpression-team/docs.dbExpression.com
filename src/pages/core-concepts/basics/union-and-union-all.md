---
title: Union and Union All
description: How to use union and union all when fluently building query expressions.
---

Use the `Union` and `Union All` methods while composing a query to append 
multiple select statements and return a single rowset.

{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.FirstName,
        dbo.Person.LastName
    )
    .From(dbo.Person)
    .Union()
    .SelectMany(
        dbo.Address.Id,
        dbo.Address.Line1,
        dbo.Address.Line2
    )
    .From(dbo.Address)
    .Execute();
```
```sql
SELECT
    [t0].[Id],
    [t0].[FirstName],
    [t0].[LastName]
FROM
    [dbo].[Person] AS [t0]
UNION
SELECT
    [t1].[Id],
    [t1].[Line1],
    [t1].[Line2]
FROM
    [dbo].[Address] AS [t1];
```
{% /code-example %}

{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.FirstName,
        dbo.Person.LastName
    )
    .From(dbo.Person)
    .UnionAll()
    .SelectMany(
        dbo.Address.Id,
        dbo.Address.Line1,
        dbo.Address.Line2
    )
    .From(dbo.Address)
    .Execute();
```
```sql
SELECT
    [t0].[Id],
    [t0].[FirstName],
    [t0].[LastName]
FROM
    [dbo].[Person] AS [t0]
UNION ALL
SELECT
    [t1].[Id],
    [t1].[Line1],
    [t1].[Line2]
FROM
    [dbo].[Address] AS [t1];
```
{% /code-example %}

*Union* and *Union All* can be used in conjunction with other database functions, grouping, ordering, etc.  For example, the following 
pivots data using different database functions and aggregation, finally ordering the result set (purely for example, we 
know there's a better way):

{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
        dbex.Alias<string>("Pivot", "State"),
        db.fx.Sum(("Pivot", "ShippingCount")).As("Shipping"),
        db.fx.Sum(("Pivot", "MailingCount")).As("Mailing"),
        db.fx.Sum(("Pivot", "BillingCount")).As("Billing")
    ).From(
        db.SelectMany(
            dbo.Address.State,
            db.fx.Count().As("ShippingCount"),
            dbex.Null.As("MailingCount"),
            dbex.Null.As("BillingCount")
        ).From(dbo.Address)
        .Where(dbo.Address.AddressType == AddressType.Shipping)
        .GroupBy(dbo.Address.State)
        .UnionAll()
        .SelectMany(
            dbo.Address.State,
            dbex.Null,
            db.fx.Count(),
            dbex.Null
        ).From(dbo.Address)
        .Where(dbo.Address.AddressType == AddressType.Mailing)
        .GroupBy(dbo.Address.State)
        .UnionAll()
        .SelectMany(
            dbo.Address.State,
            dbex.Null,                        
            dbex.Null,
            db.fx.Count()
        ).From(dbo.Address)
        .Where(dbo.Address.AddressType == AddressType.Billing)
        .GroupBy(dbo.Address.State)
    ).As("Pivot")
    .GroupBy(("Pivot", "State"))
    .OrderBy(("Pivot", "State"))
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[State],
	SUM([t0].[ShippingCount]) AS [Shipping],
	SUM([t0].[MailingCount]) AS [Mailing],
	SUM([t0].[BillingCount]) AS [Billing]
FROM
(
	SELECT
		[t1].[State],
		COUNT(*) AS [ShippingCount],
		NULL AS [MailingCount],
		NULL AS [BillingCount]
	FROM
		[dbo].[Address] AS [t1]
	WHERE
		[t1].[AddressType] = @P1
	GROUP BY
		[t1].[State]
	UNION ALL
	SELECT
		[t1].[State],
		NULL,
		COUNT(*),
		NULL
	FROM
		[dbo].[Address] AS [t1]
	WHERE
		[t1].[AddressType] = @P2
	GROUP BY
		[t1].[State]
	UNION ALL
	SELECT
		[t1].[State],
		NULL,
		NULL,
		COUNT(*)
	FROM
		[dbo].[Address] AS [t1]
	WHERE
		[t1].[AddressType] = @P3
	GROUP BY
		[t1].[State]
) AS [t0]
GROUP BY
	[t0].[State]
ORDER BY
	[t0].[State] ASC;',N'@P1 int,@P2 int,@P3 int',@P1=0,@P2=1,@P3=2
```
{% /code-example %}

Note the use of tuples to define the alias in the outer select clause's *Sum* function.  This requires an additional namespace in a using statement `HatTrick.DbEx.Sql.Builder.Alias`, see [Aliasing](../aliasing/column) for more details.