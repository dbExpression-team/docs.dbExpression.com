---
title: Aliasing the Composition of Elements
---

When using aliased fields with other elements like functions, you can use the ```dbex.Alias``` helper, but in most cases you can use a tuple representing the alias to improve readability.  Database functions accepting tuples that represent derived tables have been implemented as extension methods and are in a different namespace than the core methods of the database functions.  Use the namespaces ```HatTrick.DbEx.Sql.Expression.Alias``` and ```HatTrick.DbEx.MsSql.Expression.Alias``` to access database functions that accept tuples.  Implementation as extension methods was chosen as it is not common to use derived tables that require aliasing.  Having all of the methods signatures that accept tuples mixed in with the core method signatures heavily polluted the method overload list for some database functions.  So, using tuples for aliasing with functions is an "opt-in" feature via using statements.  

> Database functions accepting tuples representing derived tables have been implemented as extension 
methods and are in a different namespace.  
Use the namespaces ```HatTrick.DbEx.Sql.Builder.Alias``` and ```HatTrick.DbEx.MsSql.Builder.Alias``` 
to access method signatures of database functions that accept tuples.

The following example uses a tuple with the ```IsNull``` function:

```csharp
IList<dynamic> address_stats = db.SelectMany(
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

{% collapsable title="SQL statement" %}
```sql
exec sp_executesql N'SELECT
	[dbo].[Person].[FirstName],
	[dbo].[Person].[LastName],
	ISNULL([Address].[Type], @P1) AS [AddressType],
	[Address].[Count]
FROM
	[dbo].[Person]
	INNER JOIN (
		SELECT
			[dbo].[Person_Address].[PersonId],
			[dbo].[Address].[AddressType] AS [Type],
			COUNT(@P2) AS [Count]
		FROM
			[dbo].[Address]
			INNER JOIN [dbo].[Person_Address] ON [dbo].[Address].[Id] = [dbo].[Person_Address].[AddressId]
		GROUP BY
			[dbo].[Person_Address].[PersonId],
			[dbo].[Address].[AddressType]
	) AS [Address] ON [dbo].[Person].[Id] = [Address].[PersonId];',N'@P1 bigint,@P2 char(1)',@P1=0,@P2='*'

```
{% /collapsable %}

The use of aliasing with the ```IsNull``` function above could have been specified using the ```dbex.Alias``` helper method:
```csharp
//using dbex.Alias<AddressType> for specifying the aliased field
db.fx.IsNull(dbex.Alias<AddressType>("Address", "Type"), AddressType.Shipping).As("AddressType")

//using a tuple for specifying the aliased field
db.fx.IsNull(("Address", "Type"), AddressType.Shipping).As("AddressType")
```
The two are functionally equivalent and produce the same sql statement, but the later provides better readability.