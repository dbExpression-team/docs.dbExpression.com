---
title: Enums
description: How to use enums in query expressions.
---

Enums are fully supported in dbExpression with the appropriate scaffold and runtime configuration (see [Runtime Configuration](../../core-concepts/configuration/runtime)).

Using enums in QueryExpressions is like using any other data type.  In the sample [console application](https://github.com/dbexpression-team/dbexpression/blob/master/samples/mssql/NetCoreConsoleApp/Data/_TypeCode.cs), we have a few enums defined.  Let's look at the definition of the `AddressType` enum:
```csharp
public enum AddressType : int
{
    [Display(Name = "Shipping", Description = "Shipping Address")]
    Shipping = 0,
    [Display(Name = "Mailing", Description = "Mailing Address")]
    Mailing = 1,
    [Display(Name = "Billing", Description = "Billing Address")]
    Billing = 2,
}
```

Let's look at some examples using enums in queries, starting with a few *SELECT* operations using the `AddressType` enum:

{% code-example %}
```csharp
IEnumerable<Address> billing_addresses = db.SelectMany<Address>()
    .From(dbo.Address)
    .Where(dbo.Address.AddressType == AddressType.Billing)
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
WHERE
	[t0].[AddressType] = @P1;',N'@P1 int',@P1=2
```
{% /code-example %}

Note that the *WHERE* clause uses the enum value, not the numeric version of the enum.

An example using an enum with an `In` clause:
{% code-example %}
```csharp
IEnumerable<Address> billing_and_mailing_addresses = db.SelectMany<Address>()
    .From(dbo.Address)
    .Where(dbo.Address.AddressType.In(AddressType.Billing, AddressType.Mailing))
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
WHERE
	[t0].[AddressType] IN (@P1,@P2);',N'@P1 int,@P2 int',@P1=2,@P2=1
```
{% /code-example %}

In a `GroupBy` clause:
{% code-example %}
```csharp
IEnumerable<dynamic> count_by_address_type = db.SelectMany(
        dbo.Address.AddressType,
        db.fx.Count(dbo.Address.Id).As("AddressCount")
    )
    .From(dbo.Address)
    .GroupBy(dbo.Address.AddressType)
    .Execute();
```
```sql
SELECT
	[t0].[AddressType],
	COUNT([t0].[Id]) AS [AddressCount]
FROM
	[dbo].[Address] AS [t0]
GROUP BY
	[t0].[AddressType];
```
{% /code-example %}

In an `IsNull` database function:
{% code-example %}
```csharp
IEnumerable<AddressType> address_types = db.SelectMany(
        db.fx.IsNull(dbo.Address.AddressType, AddressType.Billing)
    )
    .From(dbo.Address)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	ISNULL([t0].[AddressType], @P1)
FROM
	[dbo].[Address] AS [t0];',N'@P1 int',@P1=2
```
{% /code-example %}

Using the `AddressType` enum in an *UPDATE* operation:
{% code-example %}
```csharp
db.Update(
        dbo.Address.AddressType.Set(AddressType.Mailing)
    )
    .From(dbo.Address)
    .Where(dbo.Address.AddressType == dbex.Null)
    .Execute();
```                
```sql
exec sp_executesql N'UPDATE
	[t0]
SET
	[t0].[AddressType] = @P1
FROM
	[dbo].[Address] AS [t0]
WHERE
	[t0].[AddressType] IS NULL;
SELECT @@ROWCOUNT;',N'@P1 int',@P1=1
```
{% /code-example %}

Let's look at another enum from the sample [console application](https://github.com/dbexpression-team/dbexpression/blob/master/samples/mssql/NetCoreConsoleApp/Data/_TypeCode.cs), `PaymentMethodType`:
```csharp
public enum PaymentMethodType : int
{
	[Display(Name = "Credit Card", Description = "Credit Card")]
	CreditCard = 1,
	[Display(Name = "ACH", Description = "ACH")]
	ACH = 2,
	[Display(Name = "Pay Pal", Description = "Pay Pal")]
	PayPal = 3
}
```
  
This enum has been configured (in scaffolding configuration) similar to configuring the `AddressType` enum.  We have also indicated that we desire to persist the enum using it's string 
value as detailed in [Runtime Configuration](../../core-concepts/configuration/runtime).  The *PaymentMethodType* column in the *Purchase* table has a database 
type of *VARCHAR(20)*.  Using this in a query is *exactly* the same as those persisted using their numeric value.
{% code-example %}
```csharp
IEnumerable<Purchase> credit_card_purchases = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .Where(dbo.Purchase.PaymentMethodType == PaymentMethodType.CreditCard)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[t0].[Id],
	[t0].[PersonId],
	[t0].[OrderNumber],
	[t0].[TotalPurchaseQuantity],
	[t0].[TotalPurchaseAmount],
	[t0].[PurchaseDate],
	[t0].[ShipDate],
	[t0].[ExpectedDeliveryDate],
	[t0].[TrackingIdentifier],
	[t0].[PaymentMethodType],
	[t0].[PaymentSourceType],
	[t0].[DateCreated],
	[t0].[DateUpdated]
FROM
	[dbo].[Purchase] AS [t0]
WHERE
	[t0].[PaymentMethodType] = @P1;',N'@P1 varchar(20)',@P1='CreditCard'
```
{% /code-example %}

Note in the SQL statement that the parameter value (`@P1`) used in the *WHERE* clause is the string value of the `PaymentMethodType` enum.