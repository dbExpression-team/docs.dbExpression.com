---
title: Joins
description: How to use join clauses when fluently building query expressions.
---

dbExpression supports the following join types in QueryExpressions: 
* Left Join
* Right Join
* Inner Join
* Full Join
* Cross Join

## Left Join

{% code-example %}
```csharp
//select all people who do not have an address
IList<Person> people = db.SelectMany<Person>()
    .From(dbo.Person)
    .LeftJoin(dbo.PersonAddress).On(dbo.PersonAddress.PersonId == dbo.Person.Id)
    .Where(dbo.PersonAddress.Id == dbex.Null)
    .Execute();
```
```sql
SELECT
    [dbo].[Person].[Id],
    [dbo].[Person].[FirstName],
    [dbo].[Person].[LastName],
    [dbo].[Person].[BirthDate],
    [dbo].[Person].[GenderType],
    [dbo].[Person].[CreditLimit],
    [dbo].[Person].[YearOfLastCreditLimitReview],
    [dbo].[Person].[RegistrationDate],
    [dbo].[Person].[LastLoginDate],
    [dbo].[Person].[DateCreated],
    [dbo].[Person].[DateUpdated]
FROM
    [dbo].[Person]
    LEFT JOIN [dbo].[Person_Address] ON [dbo].[Person_Address].[PersonId] = [dbo].[Person].[Id]
WHERE
    [dbo].[Person_Address].[Id] IS NULL;
```
{% /code-example %}

## Right Join

{% code-example %}
```csharp
//get person credit limit info for people in zip 94043
IList<dynamic> info = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.FirstName,
        dbo.Person.LastName,
        dbo.Person.CreditLimit,
        dbo.Person.YearOfLastCreditLimitReview
    )
    .From(dbo.Address)
    .RightJoin(dbo.PersonAddress).On(dbo.PersonAddress.AddressId == dbo.Address.Id)
    .RightJoin(dbo.Person).On(dbo.Person.Id == dbo.PersonAddress.PersonId)
    .Where(dbo.Address.Zip == zip & dbo.Address.AddressType == AddressType.Billing)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [dbo].[Person].[Id],
    [dbo].[Person].[FirstName],
    [dbo].[Person].[LastName],
    [dbo].[Person].[CreditLimit],
    [dbo].[Person].[YearOfLastCreditLimitReview]
FROM
    [dbo].[Address]
    RIGHT JOIN [dbo].[Person_Address] ON [dbo].[Person_Address].[AddressId] = [dbo].[Address].[Id]
    RIGHT JOIN [dbo].[Person] ON [dbo].[Person].[Id] = [dbo].[Person_Address].[PersonId]
WHERE
    [dbo].[Address].[Zip] = @P1
    AND
    [dbo].[Address].[AddressType] = @P2;',N'@P1 varchar(10),@P2 int',@P1='94043',@P2=2
```
{% /code-example %}

## Inner Join

{% code-example %}
```csharp
//select all address records for person with id equal 1
IList<Address> addresses = db.SelectMany<Address>()
    .From(dbo.Address)
    .InnerJoin(dbo.PersonAddress).On(dbo.PersonAddress.AddressId == dbo.Address.Id)
    .Where(dbo.PersonAddress.PersonId == 1)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Address].[Id],
	[dbo].[Address].[AddressType],
	[dbo].[Address].[Line1],
	[dbo].[Address].[Line2],
	[dbo].[Address].[City],
	[dbo].[Address].[State],
	[dbo].[Address].[Zip],
	[dbo].[Address].[DateCreated],
	[dbo].[Address].[DateUpdated]
FROM
	[dbo].[Address]
	INNER JOIN [dbo].[Person_Address] ON [dbo].[Person_Address].[AddressId] = [dbo].[Address].[Id]
WHERE
	[dbo].[Person_Address].[PersonId] = @P1;',N'@P1 int',@P1=1
```
{% /code-example %}

## Full Join

{% code-example %}
```csharp
//select data set for people's purchases
IList<dynamic> purchases = db.SelectMany(
        dbo.Person.Id,
        dbo.Person.FirstName,
        dbo.Person.LastName,
        dbo.Purchase.OrderNumber,
        db.fx.IsNull(dbo.Purchase.TotalPurchaseAmount, 0.0).As("TotalPurchaseAmount")
    )
    .From(dbo.Person)
    .FullJoin(dbo.Purchase).On(dbo.Purchase.PersonId == dbo.Person.Id)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [dbo].[Person].[Id],
    [dbo].[Person].[FirstName],
    [dbo].[Person].[LastName],
    [dbo].[Purchase].[OrderNumber],
    ISNULL([dbo].[Purchase].[TotalPurchaseAmount], @P1) AS [PurchaseAmount]
FROM
    [dbo].[Person]
    FULL JOIN [dbo].[Purchase] ON [dbo].[Purchase].[PersonId] = [dbo].[Person].[Id];',N'@P1 float',@P1=0
```
{% /code-example %}

## Cross Join

{% code-example %}
```csharp
//select all product combinations price totals
IList<double> prices = db.SelectMany(
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