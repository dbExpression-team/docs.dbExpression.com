---
title: Table Aliasing
---

Table aliasing in dbExpression eliminates ambiguity in identical table names in a SQL statement.  For example, the following 
query would fail during execution as the database engine cannot process the SQL statement with two tables with the same name of *Person*:

```csharp
IEnumerable<dynamic> persons = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.FirstName,
        dbo.Person.LastName,
        sec.Person.SocialSecurityNumber
    )
    .From(dbo.Person)
    .InnerJoin(sec.Person).On(dbo.Person.Id == sec.Person.Id)
    .Execute();
```

Execution of this would cause the following runtime exception during execution of the SQL statement:  `System.Data.SqlClient.SqlException : The objects "sec.Person" and "dbo.Person" in the FROM clause have the same exposed names. Use correlation names to distinguish them.`

By aliasing one of the tables, the query will execute without exception:

{% code-example %}
```csharp
IEnumerable<dynamic> persons = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.FirstName,
        dbo.Person.LastName,
        sec.Person.As("secure").SocialSecurityNumber 
		// ^ use table alias for sec.Person to retrieve column
    )
    .From(dbo.Person)
    .InnerJoin(sec.Person.As("secure")) 
	// ^ establish table alias for sec.Person
        .On(dbo.Person.Id == sec.Person.As("secure").Id)  
		// ^ use table alias for sec.Person in join condition
    .Execute();
```
```sql
SELECT
    [t0].[Id],
    [t0].[FirstName],
    [t0].[LastName],
    [t1].[SSN] AS [SocialSecurityNumber]
FROM
    [dbo].[Person] AS [t0]
    INNER JOIN [sec].[Person] AS [t1] ON [t0].[Id] = [t1].[Id];
```
{% /code-example %}

The query can be simplified by using a variable to reference the table alias (produces an identical SQL statement):
```csharp
var secPerson = sec.Person.As("secure");

IEnumerable<dynamic> persons = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.FirstName,
        dbo.Person.LastName,
        secPerson.SocialSecurityNumber
    )
    .From(dbo.Person)
    .InnerJoin(secPerson).On(dbo.Person.Id == secPerson.Id)
    .Execute();
```
Another alternative is to use the `dbex.Alias` method to create an alias for the *sec.Person* table, and select the *SSN* field using the created alias:
```csharp
IEnumerable<dynamic> persons = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.FirstName,
        dbo.Person.LastName,
        dbex.Alias<string?>("secPerson", "SSN")
    )
    .From(dbo.Person)
    .InnerJoin(sec.Person.As("secPerson"))
        .On(dbo.Person.Id == dbex.Alias("secPerson", "Id"))
    .Execute();
```
If the **right-side** of the join condition uses the alias, a tuple can be used instead of the `dbex.Alias` method:
```csharp
IEnumerable<dynamic> persons = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.FirstName,
        dbo.Person.LastName,
        dbex.Alias<string?>("secPerson", "SSN")
    )
    .From(dbo.Person)
    .InnerJoin(sec.Person.As("secPerson")).On(dbo.Person.Id == ("secPerson", "Id")) 
	// ^ using a tuple for the alias
    .Execute();
```
> When using the `dbex.Alias` utility method to select a field in a result set, the return type must be specified via the generic constraint.  The type specified determines the value converter that will be used when reading the field value from a data reader. *The type provided in the generic constraint should typically be the expected return type.*

In the following example, the scaffold generation specified the column values for *dbo.Purchase.PaymentMethodType* should be converted to the Enum type `PaymentMethodType`.  By using the generic type `string` when selecting the field, the dynamic object type for the field `PaymentMethodType` is a `string` type, not a `PaymentMethodType` type.
```csharp
dynamic? first_person = db.SelectOne(
    dbo.Person.Id,
    (dbo.Person.FirstName + " " + dbo.Person.LastName).As("FullName"),
    dbex.Alias<string?>("payment_type_counts", "PaymentMethodType") 
	// ^ use the registered value converter for type 'string'
)
.From(dbo.Person)
.InnerJoin(db.SelectMany(
        dbo.Purchase.PersonId,
        dbo.Purchase.PaymentMethodType
    ).From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PersonId,
        dbo.Purchase.PaymentMethodType
    )
    .Having(
        db.fx.Count(dbo.Purchase.PaymentMethodType) > 1
    )
).As("payment_type_counts").On(dbo.Person.Id == ("payment_type_counts", "PersonId"))
.Execute();

//first_person.PaymentMethodType = "ACH"
//first_person.PaymentMethodType != PaymentMethodType.ACH
```