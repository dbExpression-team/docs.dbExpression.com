---
title: dbex
---

.NET CLR languages and SQL have an inherent [impedance mismatch](https://en.wikipedia.org/wiki/Object%E2%80%93relational_impedance_mismatch) as each were designed for completely different use cases.  While dbExpression aims to make compiled code resemble SQL as closely as possible, some differences require the use of utility methods to help bridge the impedance mismatch as much as possible.  With this, dbExpression exposes a `dbex` static utility class.

> `dbex` provides utilities to bridge the differences between .NET CLR languages and SQL

## dbex.Null

The helper method `dbex.Null` creates an expression to be used anywhere a `null` is needed.  dbExpression requires clarity on types, so `dbex.Null` should be used instead of  `null` when it is expected to produce a SQL statement with a server side `NULL`.  

{% code-example %}
```csharp
DateTime? value = db.SelectOne(
    db.fx.DateAdd(DateParts.Year, 1, db.fx.Cast(dbo.Person.CreditLimit).AsDateTime())
).From(dbo.Person)
.Where(dbo.Person.CreditLimit == dbex.Null)
.Execute();

```
```sql
exec sp_executesql N'SELECT TOP(1)
    DATEADD(year, @P1, CAST([t0].[CreditLimit] AS DateTime))
FROM
    [dbo].[Person] AS [t0]
WHERE
    [t0].[CreditLimit] IS NULL;',N'@P1 int',@P1=1
```
{% /code-example %}

## dbex.Coerce

It's possible to logically construct a query that returns a CLR type that is different than the one inferred by dbExpression.  For example, given a *Person* table in the database with a *BirthDate* column that has a SQL DbType of *DATETIMEOFFSET* and allows null, the following query would return a value of type `DateTime?`:
```csharp
DateTime? birthDate = db.SelectOne(dbo.Person.BirthDate)
    .From(dbo.Person)
    .Execute();
```
  
The resulting data type is just as expected.  But if the query is logically changed to:
```csharp
DateTime? birthDate = db.SelectOne(dbo.Person.BirthDate)
    .From(dbo.Person)
    .Where(dbo.Person.BirthDate != dbex.Null)
    .Execute();
```
Note that we added a `Where` predicate that specifies the birth date can't be null.  But our return type is still `DateTime?`.  This works, but we would like the return type to be the non-nullable version; i.e. `DateTime`.  The reason it returns the nullable version is there is no correlation (and really can't be) between any `Where` predicates or `Join` conditions and the inferred return type.  So, the response could be handled in this way:

```csharp
DateTime? nullableBirthDate = db.SelectOne(
        dbo.Person.BirthDate
    )
    .From(dbo.Person)
    .Where(dbo.Person.BirthDate != dbex.Null)
    .Execute();
    
DateTime birthDate = nullableBirthDate.Value;
```
But this is less than ideal.  To account for this, dbExpression exposes a `Coerce` operation, which flips the data type from nullable to non-nullable (and vice versa).  Using the `Coerce` operation, the query returns the preferred `DateTime` instead of a `DateTime?`:
```csharp
DateTime birthDate = db.SelectOne(
        dbex.Coerce(dbo.Person.BirthDate)
    )
    .From(dbo.Person)
    .Where(dbo.Person.BirthDate != dbex.Null)
    .Execute();
```

## dbex.Alias

dbExpression supports aliasing for columns, tables, and subqueries.  the `dbex.Alias` method is commonly used in conjunction with subqueries.  The use of `dbex.Alias` is discussed in more detail in the [Aliasing](/docs/core-concepts/aliasing) section.

## dbex.GetDefaultMappingFor

When building and executing queries to return entities, the `dbex.GetDefaultMappingFor` method returns an `Action` delegate that uses the scaffolded mapping mechanism to map rowset data to an instance of an entity.  This method is useful when the default mapping should be applied, but some changes to the entity need to be made before returning from execution (using a custom mapping delegate).

{% code-example %}
```csharp
IEnumerable<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .Execute(row => 
        { 
            var person = new Person(); 
            dbex.GetDefaultMappingFor(dbo.Person).Invoke(row, person);
            if (DateTime.UtcNow.Year - person.YearOfLastCreditLimitReview > 5)
            {
                person.CreditLimit = 0;
            }
            return person; 
        }
    );
```
```sql
SELECT
    [t0].[Id],
    [t0].[FirstName],
    [t0].[LastName],
    [t0].[BirthDate],
    [t0].[GenderType],
    [t0].[CreditLimit],
    [t0].[YearOfLastCreditLimitReview],
    [t0].[RegistrationDate],
    [t0].[LastLoginDate],
    [t0].[DateCreated],
    [t0].[DateUpdated]
FROM
    [dbo].[Person] AS [t0];
```
{% /code-example %}

The `dbex.GetDefaultMappingFor` method is more useful, and is more commonly used in conjunction with `dbex.SelectAllFor`.

## dbex.SelectAllFor

When executing queries and returning entities, simply using an entity based query works fine:
```csharp
IEnumerable<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .Execute();
```
There is an equivalent approach to return exactly the same results:
```csharp
IEnumerable<Person> persons = db.SelectMany(
        dbex.SelectAllFor(dbo.Person)
    )
    .From(dbo.Person)
    .Execute(row => 
        { 
            var person = new Person(); 
            dbex.GetDefaultMappingFor(dbo.Person).Invoke(row, person); 
            return person; 
        }
    );
```
Both of these strategies continue to work as modifications to the schema are made and the code is kept in-sync with those changes through scaffolding via the dbExpression CLI tool.  For example, if a new field is added to or removed from the *Person* table, these will continue to work as expected.  While the second example works, readability is poor and it's not as easy to discern what it’s doing compared to the first example.

*So why are we covering this?*

Sometimes it's useful to return additional properties in a single query, but guard for future schema changes.  For example, a query that returns a list of *Person* and *additionally* includes the *State* of their mailing address:
{% code-example %}
```csharp
IEnumerable<(Person, StateType?)> persons = db.SelectMany(
        dbex.SelectAllFor(dbo.Person),
        dbo.Address.State
    )
    .From(dbo.Person)
    .LeftJoin(dbo.PersonAddress).On(dbo.Person.Id == dbo.PersonAddress.PersonId)
    .LeftJoin(dbo.Address).On(dbo.PersonAddress.AddressId == dbo.Address.Id & dbo.Address.AddressType == AddressType.Mailing)
    .Execute(row => 
        { 
            var person = new Person(); 
            dbex.GetDefaultMappingFor(dbo.Person).Invoke(row, person);
            var state = row.ReadField()!.GetValue<StateType?>();
            return (person, state); 
        }
    );
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id],
    [t0].[FirstName],
    [t0].[LastName],
    [t0].[BirthDate],
    [t0].[GenderType],
    [t0].[CreditLimit],
    [t0].[YearOfLastCreditLimitReview],
    [t0].[RegistrationDate],
    [t0].[LastLoginDate],
    [t0].[DateCreated],
    [t0].[DateUpdated],
    [t1].[State]
FROM
    [dbo].[Person] AS [t0]
    LEFT JOIN [dbo].[Person_Address] AS [t2] ON [t0].[Id] = [t2].[PersonId]
    LEFT JOIN [dbo].[Address] AS [t1] ON [t2].[AddressId] = [t1].[Id]
    AND
    [t1].[AddressType] = @P1;',N'@P1 int',@P1=1
```
{% /code-example %}

If the query had been written where all fields of *Person* were enumerated:
```csharp
IEnumerable<(Person, StateType?)> persons = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.FirstName,
        dbo.Person.LastName,
        dbo.Person.BirthDate,
        dbo.Person.GenderType,
        dbo.Person.CreditLimit,
        dbo.Person.YearOfLastCreditLimitReview,
        dbo.Person.RegistrationDate,
        dbo.Person.LastLoginDate,
        dbo.Person.DateCreated,
        dbo.Person.DateUpdated
        dbo.Address.State
    )
    .From(dbo.Person)
    .LeftJoin(dbo.PersonAddress).On(dbo.Person.Id == dbo.PersonAddress.PersonId)
    .LeftJoin(dbo.Address).On(dbo.PersonAddress.AddressId == dbo.Address.Id & dbo.Address.AddressType == AddressType.Mailing)
    .Execute(row => 
        { 
            var person = new Person(); 
            {
                Id = row.ReadField().GetValue<long>(),
                FirstName = row.ReadField().GetValue<string>(),
                LastName = row.ReadField().GetValue<string>(),
                BirthDate = row.ReadField().GetValue<DateTime?>(),
                GenderType = row.ReadField().GetValue<GenderType?>(),
                CreditLimit = row.ReadField().GetValue<double?>(),
                YearOfLastCreditLimitReview = row.ReadField().GetValue<int?>(),
                RegistrationDate = row.ReadField().GetValue<DateTime>(),
                LastLoginDate = row.ReadField().GetValue<DateTime?>(),
                DateCreated = row.ReadField().GetValue<DateTime>(),
                DateUpdated = row.ReadField().GetValue<DateTime>(),
            };
            var state = row.ReadField().GetValue<StateType?>();
            return (person, state); 
        }
    );
```
Now, a schema change is made to introduce a non-nullable column of type *Money* named *DiscountToApplyToGrossPurchaseAmount*. Any executed queries would not retrieve or map the value.  All `Person` instances retrieved using this query would contain the default value for the property `DiscountToApplyToGrossPurchaseAmount`, which could result in incorrect calculations for purchases.

Using `dbex.SelectAllFor` returns all columns for the *Person* table (effectively a `SELECT *`).  Any column additions or deletes from *Person* will be reflected in entity based queries and when using `dbex.SelectAllFor`. So, using this approach ensures schema changes do not introduce breaking changes to the business rules and/or processes.

> Using `dbex.SelectAllFor` when retrieving all columns for a table helps to ensure schema changes do not introduce breaking changes to the business rules and/or processes.

`dbex.SelectAllFor` includes an overload that provides aliasing functionality.  This is useful when selecting from more than one table, and the resulting rowset has more than one column with the same name and mapping to `dynamic` objects.  For example:

```csharp
IEnumerable<dynamic> person_purchases = db.SelectMany(
        dbex.SelectAllFor(dbo.Person),
        dbo.Purchase.Id,
        dbo.Purchase.PurchaseDate
    )
    .From(dbo.Person)
    .InnerJoin(dbo.Purchase).On(dbo.Person.Id == dbo.Purchase.PersonId)
    .Execute();
```

Execution of this would cause the following runtime exception during mapping to a dynamic object:
`HatTrick.DbEx.Sql.DbExpressionException : An element with the same key 'Id' already exists in the ExpandoObject.`

This can be corrected by using an alias (see [Aliasing](../../core-concepts/aliasing/column)) on the field accessor `dbo.Purchase.Id`:
{% code-example %}
```csharp
IEnumerable<dynamic> person_purchases = db.SelectMany(
        dbex.SelectAllFor(dbo.Person),
        dbo.Purchase.Id.As("PurchaseId"),
        dbo.Purchase.PurchaseDate
    )
    .From(dbo.Person)
    .InnerJoin(dbo.Purchase).On(dbo.Person.Id == dbo.Purchase.PersonId)
    .Execute();
```
```sql
SELECT
    [t0].[Id],
    [t0].[FirstName],
    [t0].[LastName],
    [t0].[BirthDate],
    [t0].[GenderType],
    [t0].[CreditLimit],
    [t0].[YearOfLastCreditLimitReview],
    [t0].[RegistrationDate],
    [t0].[LastLoginDate],
    [t0].[DateCreated],
    [t0].[DateUpdated],
    [t1].[Id] AS [PurchaseId],
    [t1].[PurchaseDate]
FROM
    [dbo].[Person] AS [t0]
    INNER JOIN [dbo].[Purchase] AS [t1] ON [t0].[Id] = [t1].[PersonId];
```
{% /code-example %}

But, another option is to alias the name of the *Id* column on *Person* by using a delegate to provide a column alias:

{% code-example %}
```csharp
IEnumerable<dynamic> person_purchases = db.SelectMany(
        dbex.SelectAllFor(dbo.Person, name => name == nameof(dbo.Person.Id) ? "PersonId" : name),
        dbo.Purchase.Id,
        dbo.Purchase.PurchaseDate
    )
    .From(dbo.Person)
    .InnerJoin(dbo.Purchase).On(dbo.Person.Id == dbo.Purchase.PersonId)
    .Execute();
```
```sql
SELECT
    [t0].[Id] AS [PersonId],
    [t0].[FirstName],
    [t0].[LastName],
    [t0].[BirthDate],
    [t0].[GenderType],
    [t0].[CreditLimit],
    [t0].[YearOfLastCreditLimitReview],
    [t0].[RegistrationDate],
    [t0].[LastLoginDate],
    [t0].[DateCreated],
    [t0].[DateUpdated],
    [t1].[Id],
    [t1].[PurchaseDate]
FROM
    [dbo].[Person] AS [t0]
    INNER JOIN [dbo].[Purchase] AS [t1] ON [t0].[Id] = [t1].[PersonId];
```
{% /code-example %}

Or prepend a value to create an alias to all columns for *Person*: 
{% code-example %}
```csharp
IEnumerable<dynamic> person_purchases = db.SelectMany(
        dbex.SelectAllFor(dbo.Person, "Person_"),
        dbo.Purchase.Id,
        dbo.Purchase.PurchaseDate
    )
    .From(dbo.Person)
    .InnerJoin(dbo.Purchase).On(dbo.Person.Id == dbo.Purchase.PersonId)
    .Execute();
```
```sql
SELECT
    [t0].[Id] AS [Person_Id],
    [t0].[FirstName] AS [Person_FirstName],
    [t0].[LastName] AS [Person_LastName],
    [t0].[BirthDate] AS [Person_BirthDate],
    [t0].[GenderType] AS [Person_GenderType],
    [t0].[CreditLimit] AS [Person_CreditLimit],
    [t0].[YearOfLastCreditLimitReview] AS [Person_YearOfLastCreditLimitReview],
    [t0].[RegistrationDate] AS [Person_RegistrationDate],
    [t0].[LastLoginDate] AS [Person_LastLoginDate],
    [t0].[DateCreated] AS [Person_DateCreated],
    [t0].[DateUpdated] AS [Person_DateUpdated],
    [t1].[Id],
    [t1].[PurchaseDate]
FROM
    [dbo].[Person] AS [t0]
    INNER JOIN [dbo].[Purchase] AS [t1] ON [t0].[Id] = [t1].[PersonId];
```
{% /code-example %}

*This would result in dynamic objects where all property names start with "Person_", which may not be desirable*.

The `dbex.SelectAllFor` is also useful when selecting `dynamic` objects when using multiple `dbex.SelectAllFor` methods that cause property name collisions:

{% code-example %}
```csharp
static string alias(string entity, string name)
    {
        switch (name)
        {
            case nameof(dbo.Person.Id):
            case nameof(dbo.Person.DateCreated):
            case nameof(dbo.Person.DateUpdated):
            case nameof(dbo.Purchase.PersonId): return $"{entity}_{name}";
            default: return name;
        }
    };

IEnumerable<dynamic> person_purchases = db.SelectMany(
        dbex.SelectAllFor(dbo.Person, name => alias(nameof(Person), name))
        .Concat(dbex.SelectAllFor(dbo.Purchase, name => alias(nameof(Purchase), name))) 
        // ^ LINQ concat, not database concat function
    )
    .From(dbo.Person)
    .InnerJoin(dbo.Purchase).On(dbo.Person.Id == dbo.Purchase.PersonId)
    .Execute();    
```
```sql
SELECT
    [t0].[Id] AS [Person_Id],
    [t0].[FirstName],
    [t0].[LastName],
    [t0].[BirthDate],
    [t0].[GenderType],
    [t0].[CreditLimit],
    [t0].[YearOfLastCreditLimitReview],
    [t0].[RegistrationDate],
    [t0].[LastLoginDate],
    [t0].[DateCreated] AS [Person_DateCreated],
    [t0].[DateUpdated] AS [Person_DateUpdated],
    [t1].[Id] AS [Purchase_Id],
    [t1].[PersonId] AS [Purchase_PersonId],
    [t1].[OrderNumber],
    [t1].[TotalPurchaseQuantity],
    [t1].[TotalPurchaseAmount],
    [t1].[PurchaseDate],
    [t1].[ShipDate],
    [t1].[ExpectedDeliveryDate],
    [t1].[TrackingIdentifier],
    [t1].[PaymentMethodType],
    [t1].[PaymentSourceType],
    [t1].[DateCreated] AS [Purchase_DateCreated],
    [t1].[DateUpdated] AS [Purchase_DateUpdated]
FROM
    [dbo].[Person] AS [t0]
    INNER JOIN [dbo].[Purchase] AS [t1] ON [t0].[Id] = [t1].[PersonId];
```
{% /code-example %}

## dbex.BuildAssignmentsFor

By design, dbExpression does not provide any entity change tracking features.  However, dbExpression does provide a feature to allow for constructing an *UPDATE* statement
based on the delta of property values between two entities.

{% code-example %}
```csharp

int personId = 1;

...
var personWithChanges = db.SelectOne<Person>()
     .From(dbo.Person)
     .Where(dbo.Person.Id == personId)
     .Execute();
...

//change some properties on the person instance
personWithChanges!.CreditLimit = 5000;
personWithChanges.YearOfLastCreditLimitReview = DateTime.UtcNow.Year;

...

var persistedState = db.SelectOne<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.Id == personId)
    .Execute();

var fieldUpdates = dbex.BuildAssignmentsFor(dbo.Person).From(persistedState!).To(personWithChanges);

//update based on the comparison.  updateFields will contain a SET for CreditLimit and YearOfLastCreditLimitReview
db.Update(
        fieldUpdates
    )
    .From(dbo.Person)
    .Where(dbo.Person.Id == personId)
    .Execute();
```
```sql
exec sp_executesql N'PDATE
    [t0]
SET
    [t0].[CreditLimit] = @P1,
    [t0].[YearOfLastCreditLimitReview] = @P2
FROM
    [dbo].[Person] AS [t0]
WHERE
    [t0].[Id] = @P3;
SELECT @@ROWCOUNT;',N'@P1 int,@P2 int,@P3 int',@P1=5000,@P2=2021,@P3=1
```
{% /code-example %}

