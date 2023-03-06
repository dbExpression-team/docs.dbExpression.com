---
title: Joins
description: How to use join clauses when fluently building query expressions.
---

When building *SELECT*, *UPDATE*, and *DELETE* queries, you can use any number of
join clauses while composing the query.

dbExpression supports the following join types: 
* Left Join
* Right Join
* Inner Join
* Full Join
* Cross Join

## Left Join

{% code-example %}
```csharp
//select all people who do not have an address
IEnumerable<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
    .LeftJoin(dbo.PersonAddress).On(dbo.PersonAddress.PersonId == dbo.Person.Id)
    .Where(dbo.PersonAddress.Id == dbex.Null)
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
    [t0].[DateUpdated]
FROM
    [dbo].[Person] AS [t0]
    LEFT JOIN [dbo].[Person_Address] AS [t1] ON [t1].[PersonId] = [t0].[Id]
WHERE
    [t1].[Id] IS NULL;
```
{% /code-example %}

## Right Join

{% code-example %}
```csharp
//get person credit limit info for people in zip 94043
IEnumerable<dynamic> info = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.FirstName,
        dbo.Person.LastName,
        dbo.Person.CreditLimit,
        dbo.Person.YearOfLastCreditLimitReview
    )
    .From(dbo.Address)
    .RightJoin(dbo.PersonAddress).On(dbo.PersonAddress.AddressId == dbo.Address.Id)
    .RightJoin(dbo.Person).On(dbo.Person.Id == dbo.PersonAddress.PersonId)
    .Where(dbo.Address.Zip == "94043" & dbo.Address.AddressType == AddressType.Billing)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id],
    [t0].[FirstName],
    [t0].[LastName],
    [t0].[CreditLimit],
    [t0].[YearOfLastCreditLimitReview]
FROM
    [dbo].[Address] AS [t1]
    RIGHT JOIN [dbo].[Person_Address] AS [t2] ON [t2].[AddressId] = [t1].[Id]
    RIGHT JOIN [dbo].[Person] AS [t0] ON [t0].[Id] = [t2].[PersonId]
WHERE
    [t1].[Zip] = @P1
    AND
    [t1].[AddressType] = @P2;',N'@P1 varchar(10),@P2 int',@P1='94043',@P2=2
```
{% /code-example %}

## Inner Join

{% code-example %}
```csharp
//select all address records for person with id equal 1
IEnumerable<Address> addresses = db.SelectMany<Address>()
    .From(dbo.Address)
    .InnerJoin(dbo.PersonAddress).On(dbo.PersonAddress.AddressId == dbo.Address.Id)
    .Where(dbo.PersonAddress.PersonId == 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id],
    [t0].[AddressType],
    [t0].[Line1],
    [t0].[Line2],
    [t0].[City],
    [t0].[State],
    [t0].[Zip],
    [t0].[DateCreated],
    [t0].[DateUpdated]
FROM
    [dbo].[Address] AS [t0]
    INNER JOIN [dbo].[Person_Address] AS [t1] ON [t1].[AddressId] = [t0].[Id]
WHERE
    [t1].[PersonId] = @P1;',N'@P1 int',@P1=1
```
{% /code-example %}

## Full Join

{% code-example %}
```csharp
//select data set for people's purchases
IEnumerable<dynamic> purchases = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.FirstName,
        dbo.Person.LastName,
        dbo.Purchase.OrderNumber
    )
    .From(dbo.Person)
    .FullJoin(dbo.Purchase).On(dbo.Purchase.PersonId == dbo.Person.Id)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id],
    [t0].[FirstName],
    [t0].[LastName],
    [t1].[OrderNumber]
FROM
    [dbo].[Person] AS [t0]
    FULL JOIN [dbo].[Purchase] AS [t1] ON [t1].[PersonId] = [t0].[Id];',N'@P1 float',@P1=0
```
{% /code-example %}

## Cross Join

{% code-example %}
```csharp
//select all product combinations price totals
IEnumerable<double> prices = db.SelectMany(
        (dbo.Product.As("p1").Price + dbo.Product.As("p2").Price)
    )
    .From(dbo.Product.As("p1"))
    .CrossJoin(dbo.Product.As("p2"))
    .Execute();
```
```sql
SELECT
    ([p1].[Price] + [p2].[Price])
FROM
    [dbo].[Product] AS [p1]
    CROSS JOIN [dbo].[Product] AS [p2];
```
{% /code-example %}