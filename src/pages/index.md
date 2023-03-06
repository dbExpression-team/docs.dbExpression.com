---
title: Getting Started
description: dbExpression - compiled sql for Microsoft SQL Server. 
---

dbExpression closes the gap between application code and raw SQL, bringing Microsoft SQL Server functionality into .NET.  dbExpression isn't centered around object relational mapping (ORM) concepts, but instead focuses on allowing you to write powerful type-checked SQL queries comparable to queries written directly in TSQL.

* **Extensible by design**
* **Fluent** query builder using natural SQL syntax
* **WYSIWYG** - What you write looks like SQL, what we execute looks like SQL
* **Compile-time checking** of SQL queries
* Build queries **without magic strings** or string interpolation
* Tooling to easily keep **application code in sync with database schema**
* **ORM features without the ORM handcuffs**

With dbExpression, the code that handles the basics of pushing and pulling data in and out of your database is generated via a CLI tool.  The code contains all the classes and functional plumbing necessary to insert, update, delete and query your data with expressions that live directly within your application code.  When you modify your database in any way, regenerating the code exposes those changes to your application, keeping schema changes in sync with your application code.

With dbExpression, you can easily write queries in code like this:
```csharp
//query composed and compiled in c#

IList<dynamic> purchases_shipped_by_year = await db.SelectMany(
        dbo.Person.Id,
        (dbo.Person.FirstName + " " + dbo.Person.LastName).As("CustomerName"),
        db.fx.Count(dbo.Purchase.ShipDate).As("ShippedCount"),
        db.fx.DatePart(DateParts.Year, dbo.Purchase.ShipDate).As("ShippedYear")
    )
    .From(dbo.Purchase)
    .InnerJoin(dbo.Person).On(dbo.Purchase.PersonId == dbo.Person.Id)
    .Where(dbo.Purchase.ShipDate != dbex.Null)
    .GroupBy(
        dbo.Person.Id,
        dbo.Person.FirstName,
        dbo.Person.LastName,
        db.fx.DatePart(DateParts.Year, dbo.Purchase.ShipDate)
    )
    .ExecuteAsync();
```
And here's the SQL statement dbExpression assembled and executed against the database:
```sql
exec sp_executesql N'SELECT
	[t0].[Id],
	([t0].[FirstName] + @P1 + [t0].[LastName]) AS [CustomerName],
	COUNT([t1].[ShipDate]) AS [ShippedCount],
	DATEPART(year, [t1].[ShipDate]) AS [ShippedYear]
FROM
	[dbo].[Purchase] AS [t1]
	INNER JOIN [dbo].[Person] AS [t0] ON [t1].[PersonId] = [t0].[Id]
WHERE
	[t1].[ShipDate] IS NOT NULL
GROUP BY
	[t0].[Id],
	[t0].[FirstName],
	[t0].[LastName],
	DATEPART(year, [t1].[ShipDate]);',N'@P1 varchar(1)',@P1=' '
```

dbExpression was designed to work statically or with dependency injection.  The decision for which to use is typically based on the type of project, 
the team environment, and just what works best for you - it's your choice!

dbExpression is quick and easy to get up and running using two packages available on NuGet:
1) [dbExpression Microsoft SQL Server package](https://www.nuget.org/packages/HatTrick.DbEx.MsSql/)
2) [dbExpression dotnet CLI tool](https://www.nuget.org/packages/HatTrick.DbEx.Tools/)
