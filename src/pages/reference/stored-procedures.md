---
title: Executing Stored Procedures
---

To indicate that a stored procedure returns data, the type of data, and whether the stored procedure returns one or more results, 
use one of these methods while building the stored procedure query:
* `GetValue<T>()` - execution of the stored procedure returns a scalar value with type `T`.
* `GetValues<T>()` - execution of the stored procedure returns a list of scalar values with type `T`.
* `GetValue<T>(Func<ISqlFieldReader,T>)` - execution of the stored procedure returns an object of type `T`.
* `GetValues<T>(Func<ISqlFieldReader,T>)` - execution of the stored procedure returns a list of objects with type `T`.
* `GetValue()` - execution of the stored procedure returns a single `dynamic` object, where the properties of the dynamic object are determined by the returned rowset.
* `GetValues()` - execution of the stored procedure returns a list of `dynamic` objects, where the properties of each dynamic object are determined by the returned rowset(s).

## Returning a scalar value
To return a scalar value from execution of a stored procedure, use the generic `GetValue<T>` method, where `T` is the desired return type.  For example, using a stored procedure defined as follows:
```sql
CREATE PROCEDURE [dbo].[GetMaxCreditLimitLessThan]
    @CreditLimit INT
AS
    SELECT
        MAX([dbo].[Person].[CreditLimit])
    FROM
        [dbo].[Person]
    WHERE
        [dbo].[Person].[CreditLimit] < @CreditLimit
```

{% code-example %}
```csharp
//get the max credit limit for all persons when the credit limit is less than 1,000,000.
int maxCreditLimt = db.sp.dbo.GetMaxCreditLimitLessThan(1000000).GetValue<int>().Execute();
```
```sql
exec [dbo].[GetMaxCreditLimitLessThan] @CreditLimit=1000000;
```
{% /code-example %}

## Returning a list of scalar values
To return a list of scalar values from execution of a stored procedure, use the generic `GetValues<T>` method, where `T` is the desired return type.  Using a stored procedure defined as follows:
```sql
CREATE PROCEDURE [dbo].[GetPersonsWithCreditLimitLessThan]
    @CreditLimit INT
AS
    SELECT
        [dbo].[Person].[Id]
    FROM
        [dbo].[Person]
    WHERE
        [dbo].[Person].[CreditLimit] < @CreditLimit
```

{% code-example %}
```csharp
//get all person ids where the person has a credit limit less than 20000
IEnumerable<int> personIds = db.sp.dbo.GetPersonsWithCreditLimitLessThan(20000).GetValues<int>().Execute();
```
```sql
exec [dbo].[GetPersonsWithCreditLimitLessThan] @CreditLimit=20000;
```
{% /code-example %}

## Returning an object
To return an object from execution of a stored procedure, use the generic `GetValue<T>` method with a mapping delegate (`Func<ISqlFieldReader,T>`).  The mapping delegate defines the type (`T`) returned from the method, and the function used to read fields from a row and map to a `T`.  For example, using a stored procedure defined as follows:
```sql
CREATE PROCEDURE [dbo].[GetPersonById]
    @Id INT
AS
    SELECT
        [dbo].[Person].[Id],
        [dbo].[Person].[FirstName],
        [dbo].[Person].[LastName]
    FROM
        [dbo].[Person]
    WHERE
        [dbo].[Person].[Id] = @Id
```
This stored procedure can be executed with a mapping delegate to read the values from the row and map to an instance of a class of type `Person`:

{% code-example %}
```csharp
Person? person = db.sp.dbo.GetPersonById(1).GetValue(
    row => new Person 
    { 
        Id = row.ReadField()!.GetValue<int>(),
        FirstName = row.ReadField()!.GetValue<string>(),
        LastName = row.ReadField()!.GetValue<string>()
    }).Execute();
```
```sql
exec [dbo].[GetPersonById] @Id=1;
```
{% /code-example %}

## Returning a list of objects
To return a list of objects from execution of a stored procedure, use the generic `GetValues<T>` method with a mapping delegate (`Func<ISqlFieldReader,T>`).  The mapping delegate defines the type (`T`) returned from the method, and the function used to read fields from a row and map to a `T`.  For example, using a stored procedure defined as follows:
```sql
CREATE PROCEDURE [dbo].[GetPersonsWithCreditLimitLessThan]
    @CreditLimit INT
AS
    SELECT
        [dbo].[Person].[Id],
        [dbo].[Person].[FirstName],
        [dbo].[Person].[LastName]
    FROM
        [dbo].[Person]
    WHERE
        [dbo].[Person].[CreditLimit] < @CreditLimit
```

{% code-example %}
```csharp
IEnumerable<Person> persons = db.sp.dbo.GetPersonById(1).GetValues(
    row => new Person 
    { 
        Id = row.ReadField()!.GetValue<int>(),
        FirstName = row.ReadField()!.GetValue<string>(),
        LastName = row.ReadField()!.GetValue<string>()
    }).Execute();
```
```sql
exec [dbo].[GetPersonsWithCreditLimitLessThan] @CreditLimit=20000;
```
{% /code-example %}

## Returning a dynamic object
To return a `dynamic` object from execution of a stored procedure, use the `GetValue` method.  For example, using a stored procedure defined as follows:
```sql
CREATE PROCEDURE [dbo].[GetMaxCreditLimitLessThan]
    @CreditLimit INT
AS

    SELECT
        MAX([dbo].[Person].[CreditLimit]) AS [MaxCreditLimit],
        COUNT([dbo].[Person].[Id]) AS [PersonCount]
    FROM
        [dbo].[Person]
    WHERE
        [dbo].[Person].[CreditLimit] < @CreditLimit
```
*Note the aliasing of each field, which is required to successfully create and map data to a dynamic object.*

{% code-example %}
```csharp
//get all persons where the person has a credit limit less than 20000
IEnumerable<dynamic> persons = db.sp.dbo.GetPersonsWithCreditLimitLessThan(20000).GetValues().Execute();
```
```sql
exec [dbo].[GetPersonsWithCreditLimitLessThan] @CreditLimit=20000;
```
{% /code-example %}

## Returning a list of dynamic objects
To return a list of `dynamic` objects from execution of a stored procedure, use the `GetValues` method.  For example, using a stored procedure defined as follows:
```sql
CREATE PROCEDURE [dbo].[GetPersonsWithCreditLimitLessThan]
    @CreditLimit INT
AS
    SELECT
        [dbo].[Person].[Id],
        [dbo].[Person].[FirstName],
        [dbo].[Person].[LastName]
    FROM
        [dbo].[Person]
    WHERE
        [dbo].[Person].[CreditLimit] < @CreditLimit
```

{% code-example %}
```csharp
//get all persons where the person has a credit limit less than 20000
IEnumerable<dynamic> persons = db.sp.dbo.GetPersonsWithCreditLimitLessThan(20000).GetValues().Execute();
```
```sql
exec [dbo].[GetPersonsWithCreditLimitLessThan] @CreditLimit=20000;
```
{% /code-example %}

## Execution and Reading Data via a Delegate
Similar to the methods used to return data from a stored procedure, a method is available that expects data to be returned from the target database, but doesn't return data from execution of the method (method return type is `void`).  This method is useful when it is preferable to handle each row as it is read from the target database instead of waiting for the full data set as a return from the method.  Example use cases may be when you are working with very large data sets, streaming data directly to a file, publishing to an event sink or posting to a data pipeline.  This method has a delegate parameter that is executed as each row is read from the target database.  The `ISqlFieldReader` is just an abstraction over a `DataReader`.  The method has the following signature:
* `MapValues(Action<ISqlFieldReader>)` - the stored procedure returns data, but each row read from the target database is passed to the delegate.

For example, using a stored procedure defined as follows:
```sql
CREATE PROCEDURE [dbo].[GetPersonsWithCreditLimitLessThan]
    @CreditLimit INT
AS
    SELECT
        [dbo].[Person].[Id],
        [dbo].[Person].[FirstName],
        [dbo].[Person].[LastName]
    FROM
        [dbo].[Person]
    WHERE
        [dbo].[Person].[CreditLimit] < @CreditLimit
```

While the following code example loads all data into memory similar to the use of `GetValues`, the purpose is to demonstrate how to use the `MapValues` method with a delegate to handle each row as it is read from the target database.
{% code-example %}
```csharp
var persons = new Dictionary<int,string>();

db.sp.dbo.GetPersonsWithCreditLimitLessThan(20000).MapValues(
    row =>
    {
        var id = row.ReadField()!.GetValue<int>();
        var firstName = row.ReadField()!.GetValue<string>();
        var lastName = row.ReadField()!.GetValue<string>();
        persons.Add(id, $"{firstName} {lastName}");
    }
).Execute();
```
```sql
exec [dbo].[GetPersonsWithCreditLimitLessThan] @CreditLimit=20000;
```
{% /code-example %}

## Execution without Returning Data
For stored procedures that do not return data, omit the "GetXXX" and "MapXXX" methods discussed above.
```sql
CREATE PROCEDURE [dbo].[SetCreditLimitForPerson]
    @Id INT,
    @CreditLimit INT
AS
    UPDATE
        [dbo].[Person]
    SET
        [dbo].[Person].[CreditLimit] = @CreditLimit
    WHERE
        [dbo].[Person].[Id] = @Id
```
{% code-example %}
```csharp
//update the person with an id of 1 to have a credit limit of 20,000
db.sp.dbo.SetCreditLimitForPerson(1, 20000).Execute();
```
```sql
exec [dbo].[SetCreditLimitForPerson] @Id=1, @CreditLimit=20000;
```
{% /code-example %}