---
title: Subquery Aliasing
---

When using subqueries, providing an alias for the subquery is required.  dbExpression supports the aliasing of subqueries to enable both simple and complex queries. Let's look at the following (fairly) complex query:

In the example below, `dbex.Alias<int>("vips", "PurchaseCount")` will attempt to convert the field to a type of `int`.

```csharp
int year = 2021;
// any person making 3 or more purchases in a 
// calendar year are considered VIP customers
int purchaseCount = 3;

IEnumerable<dynamic> person_stats = db.SelectMany(
        dbo.Person.Id.As("PersonId"),
        (dbo.Person.FirstName + " " + dbo.Person.LastName).As("FullName"),
        dbex.Alias<int>("vips", "PurchaseCount"),
        dbex.Alias<int>("vips", "PurchaseYear")
    )
    .From(dbo.Person)
    .InnerJoin(
        db.SelectMany(
            dbo.Purchase.PersonId,
            db.fx.DatePart(DateParts.Year, dbo.Purchase.PurchaseDate).As("PurchaseYear"),
            db.fx.Count(dbo.Purchase.Id).As("PurchaseCount")
        )
        .From(dbo.Purchase)
        .GroupBy(
            dbo.Purchase.PersonId,
            db.fx.DatePart(DateParts.Year, dbo.Purchase.PurchaseDate)
        )
        .Having(
            db.fx.Count(dbo.Purchase.Id) >= purchaseCount
            & db.fx.DatePart(DateParts.Year, dbo.Purchase.PurchaseDate) == year
        )
    ).As("vips").On(dbo.Person.Id == ("vips", "PersonId"))
    .OrderBy(
        dbo.Person.LastName,
        dbo.Person.FirstName,
        ("vips", "PurchaseYear"),
        ("vips", "PurchaseCount").Desc()
    );

```
This query is retrieving a list of persons (customers) who have made 3 or more purchases in the year 2021 - these are considered "VIP" customers in this example.

The "outer" `SelectMany`

```csharp
...
    dbo.Person.Id.As("PersonId"),
    (dbo.Person.FirstName + " " + dbo.Person.LastName).As("FullName"),
    dbex.Alias<int>("vips", "PurchaseCount"),
    dbex.Alias<int>("vips", "PurchaseYear")
...
```

uses field aliasing to alias *Id* as *PersonId* and the concatenation of *FirstName* and *LastName* as *FullName*.  To return columns from the subquery, the use of the `dbex.Alias` utility method is required.

In the "first" `INNER JOIN`, we join an aggregation query that gets a count of purchases by person by year.

```csharp
...
    dbo.Purchase.PersonId,
    db.fx.DatePart(DateParts.Year, dbo.Purchase.PurchaseDate).As("PurchaseYear"),
    db.fx.Count(dbo.Purchase.Id).As("PurchaseCount")
...
```

The selected fields use field aliasing to alias columns in the SQL statement as *PurchaseYear* and *PurchaseCount*.  The subquery is aliased using `As(...)` method to alias the subquery as *vips*.  The join condition between the "outer" query and the subquery uses the alias of the subquery for the ON condition:

```csharp
...
    .As("vips").On(dbo.Person.Id == ("vips", "PersonId")) 
	//                                  ^ using a tuple for the alias
...
```

The subquery alias of *vips* enables the aliasing of the subquery fields in the "outer" `SelectMany`:

```csharp
...
    dbex.Alias<int>("vips", "PurchaseCount"),
    dbex.Alias<int>("vips", "PurchaseYear")
...
```

The outer query is completed by ordering by *LastName* ascending, *FirstName* ascending, *PurchaseYear* virtual column ascending (from the aliased subquery), and the *PurchaseCount* virtual column descending (from the aliased subquery):

```csharp
...
    .OrderBy(
        dbo.Person.LastName,
        dbo.Person.FirstName,
        ("vips", "PurchaseYear"),
        ("vips", "PurchaseCount").Desc()
    );
...
```
And the final sql statement:
```sql
exec sp_executesql N'SELECT
	[dbo].[Person].[Id] AS [PersonId]
	,(([dbo].[Person].[FirstName] + @P1) + [dbo].[Person].[LastName]) AS [FullName]
	,[vips].[PurchaseYear]
	,[vips].[PurchaseCount]
FROM
	[dbo].[Person]
	INNER JOIN (
		SELECT
			[dbo].[Purchase].[PersonId]
			,DATEPART(year, [dbo].[Purchase].[PurchaseDate]) AS [PurchaseYear]
			,COUNT([dbo].[Purchase].[Id]) AS [PurchaseCount]
		FROM
			[dbo].[Purchase]
		GROUP BY
			[dbo].[Purchase].[PersonId]
			,DATEPART(year, [dbo].[Purchase].[PurchaseDate])
		HAVING
			COUNT([dbo].[Purchase].[Id]) >= @P2
			AND
			DATEPART(year, [dbo].[Purchase].[PurchaseDate]) = @P3
	) AS [vips] ON [dbo].[Person].[Id] = [vips].[PersonId]
ORDER BY
	[dbo].[Person].[LastName] ASC
	,[dbo].[Person].[FirstName] ASC
	,[vips].[PurchaseYear] ASC
	,[vips].[PurchaseCount] DESC;',N'@P1 char(1),@P2 int,@P3 int',@P1=' ',@P2=3,@P3=2019

```