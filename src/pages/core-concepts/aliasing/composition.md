---
title: Aliasing the Composition of Elements
---

When using aliased fields with other elements like functions, you can use the `dbex.Alias` helper method, but in most cases you can use a tuple representing the alias to improve readability.  Database functions accepting tuples that represent derived tables have been implemented as extension methods and are in a different namespace than the core methods of the database functions. 

Implementation as extension methods was chosen as it is not common to use derived tables that require aliasing.  Having all of the methods signatures that accept tuples mixed in with the core method signatures heavily polluted the method overload list for some database functions.  So, using tuples for aliasing with functions is an "opt-in" feature via using statements.  

> Database functions accepting tuples representing derived tables have been implemented as extension 
methods in a different namespace.

Use the namespaces `HatTrick.DbEx.Sql.Builder.Alias` and `HatTrick.DbEx.MsSql.Builder.Alias` 
to access method signatures of database functions that accept tuples.

The following example uses a tuple with the `IsNull` function.  The use of a tuple in the `IsNull` function is valid as the method can
infer the data type to use in creating the `AddressType` property on each `dynamic` object returned.

{% code-example %}
```csharp
IEnumerable<dynamic> address_stats = db.SelectMany(
        dbo.Person.FirstName,
        dbo.Person.LastName,
        db.fx.IsNull(("Address", "Type"), AddressType.Shipping).As("AddressType"),
        dbex.Alias<int>("Address", "Count")
    )
    .From(dbo.Person)
    .InnerJoin(
        db.SelectMany(
            dbo.PersonAddress.PersonId,
            dbo.Address.AddressType.As("Type"),
            db.fx.Count().As("Count")
        ).From(dbo.Address)
        .InnerJoin(dbo.PersonAddress).On(dbo.Address.Id == dbo.PersonAddress.AddressId)
        .GroupBy(
            dbo.PersonAddress.PersonId,
            dbo.Address.AddressType
        )
    ).As("Address").On(dbo.Person.Id == ("Address", "PersonId"))
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[FirstName],
	[t0].[LastName],
	ISNULL([t1].[Type], @P1) AS [AddressType],
	[t1].[Count]
FROM
	[dbo].[Person] AS [t0]
	INNER JOIN (
		SELECT
			[t2].[PersonId],
			[t1].[AddressType] AS [Type],
			COUNT(*) AS [Count]
		FROM
			[dbo].[Address] AS [t1]
			INNER JOIN [dbo].[Person_Address] AS [t2] ON [t1].[Id] = [t2].[AddressId]
		GROUP BY
			[t2].[PersonId],
			[t1].[AddressType]
	) AS [t1] ON [t0].[Id] = [t1].[PersonId];',N'@P1 bigint',@P1=0
```
{% /code-example %}

The `IsNull` function above could have just as easily been specified using the `dbex.Alias` helper method:
```csharp
//using dbex.Alias<AddressType> for specifying the aliased field
db.fx.IsNull(dbex.Alias<AddressType>("Address", "Type"), AddressType.Shipping).As("AddressType")
```
The two are functionally equivalent and produce the same sql statement, but the later provides better readability.