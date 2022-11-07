---
title: Union and Union All
description: How to use union and union all when fluently building query expressions.
---

Use the `Union` and `Union All` methods while composing a query to append 
multiple select statements and return a single rowset.

{% code-example %}
```csharp
IList<dynamic> results = db.SelectMany(
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
        .From(dbo.Address);
```
```sql
SELECT
	[dbo].[Person].[Id],
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName]
FROM
	[dbo].[Person]
UNION
SELECT
	[dbo].[Address].[Id],
	[dbo].[Address].[Line1],
	[dbo].[Address].[Line2]
FROM
	[dbo].[Address];
```
{% /code-example %}

{% code-example %}
```csharp
IList<dynamic> results = db.SelectMany(
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
        .From(dbo.Address);
```
```sql
SELECT
	[dbo].[Person].[Id],
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName]
FROM
	[dbo].[Person]
UNION ALL
SELECT
	[dbo].[Address].[Id],
	[dbo].[Address].[Line1],
	[dbo].[Address].[Line2]
FROM
	[dbo].[Address];
```
{% /code-example %}

*Union* and *Union All* can be used in conjunction with other database functions, grouping, ordering, etc.  For example, the following 
pivots data using different database functions and aggregation, finally ordering the result set (purely for example, we 
know there's a better way):

{% code-example %}
```csharp
IList<dynamic> results = db.SelectMany(
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
        .OrderBy(("Pivot", "State"));
```
```sql
exec sp_executesql N'SELECT
	[Pivot].[State],
	SUM([Pivot].[ShippingCount]) AS [Shipping],
	SUM([Pivot].[MailingCount]) AS [Mailing],
	SUM([Pivot].[BillingCount]) AS [Billing]
FROM
(
	SELECT
		[dbo].[Address].[State],
		COUNT(@P1) AS [ShippingCount],
		NULL AS [MailingCount],
		NULL AS [BillingCount]
	FROM
		[dbo].[Address]
	WHERE
		[dbo].[Address].[AddressType] = @P2
	GROUP BY
		[dbo].[Address].[State]
	UNION ALL
	SELECT
		[dbo].[Address].[State],
		NULL,
		COUNT(@P3),
		NULL
	FROM
		[dbo].[Address]
	WHERE
		[dbo].[Address].[AddressType] = @P4
	GROUP BY
		[dbo].[Address].[State]
	UNION ALL
	SELECT
		[dbo].[Address].[State],
		NULL,
		NULL,
		COUNT(@P5)
	FROM
		[dbo].[Address]
	WHERE
		[dbo].[Address].[AddressType] = @P6
	GROUP BY
		[dbo].[Address].[State]
) AS [Pivot]
GROUP BY
	[Pivot].[State]
ORDER BY
	[Pivot].[State] ASC;',N'@P1 nchar(1),@P2 int,@P3 nchar(1),@P4 int,@P5 nchar(1),@P6 int',@P1=N'*',@P2=0,@P3=N'*',@P4=1,@P5=N'*',@P6=2
```
{% /code-example %}

Note the use of tuples to define the alias in the outer select clause's *Sum* function.  This requires an additional namespace in a using statement `HatTrick.DbEx.Sql.Builder.Alias`, see [Aliasing](../aliasing/column) for more details.