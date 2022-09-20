---
title: Enums
description: How to use enums in query expressions.
---

Enums are fully supported in dbExpression with the appropriate scaffold and runtime configuration (see [Runtime Configuration (Enums)](/configuration/runtime/enums)).

Using enums in QueryExpressions is like using any other data type.  In the sample [console application](https://github.com/HatTrickLabs/dbExpression/blob/master/samples/mssql/NetCoreConsoleApp/Data/_TypeCode.cs),  we have a few enums defined, let's look at one of these, ```AddressType```:
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

Some examples of how to use enums in QueryExpressions, starting with a few SELECT operations using the ```AddressType``` enum:

{% code-example %}
```csharp
IList<Address> billing_addresses = db.SelectMany<Address>()
    .From(dbo.Address)
    .Where(dbo.Address.AddressType == AddressType.Billing)
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
WHERE
	[dbo].[Address].[AddressType] = @P1;',N'@P1 int',@P1=2
```
{% /code-example %}

With an ```In``` clause:
{% code-example %}
```csharp
IList<Address> billing_and_mailing_addresses = db.SelectMany<Address>()
    .From(dbo.Address)
    .Where(dbo.Address.AddressType.In(AddressType.Billing, AddressType.Mailing))
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
WHERE
	[dbo].[Address].[AddressType] IN (@P1,@P2);',N'@P1 int,@P2 int',@P1=2,@P2=1
```
{% /code-example %}

In a ```GroupBy``` clause:
{% code-example %}
```csharp
IList<dynamic> count_by_address_type = db.SelectMany(
        dbo.Address.AddressType,
        db.fx.Count(dbo.Address.Id).As("AddressCount")
    )
    .From(dbo.Address)
    .GroupBy(dbo.Address.AddressType)
    .Execute();
```
```sql
SELECT
	[dbo].[Address].[AddressType]
	,COUNT([dbo].[Address].[Id]) AS [AddressCount]
FROM
	[dbo].[Address]
GROUP BY
	[dbo].[Address].[AddressType];
```
{% /code-example %}

In an ```IsNull``` database function:
{% code-example %}
```csharp
IList<AddressType> address_types = db.SelectMany(
        db.fx.IsNull(dbo.Address.AddressType, AddressType.Billing)
    )
    .From(dbo.Address)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	ISNULL([dbo].[Address].[AddressType], @P1)
FROM
	[dbo].[Address];',N'@P1 int',@P1=2
```
{% /code-example %}

Using the ```AddressType``` enum in an UPDATE operation:
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
	[dbo].[Address]
SET
	[AddressType] = @P1
FROM
	[dbo].[Address]
WHERE
	[dbo].[Address].[AddressType] IS NULL;
SELECT @@ROWCOUNT;',N'@P1 int',@P1=1
```
{% /code-example %}

Let's look at another enum from the sample [console application](https://github.com/HatTrickLabs/dbExpression/blob/master/samples/mssql/NetCoreConsoleApp/Data/_TypeCode.cs), ```PaymentMethodType```:
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
  
This enum has been configured (in scaffolding configuration) similar to configuring the ```AddressType``` enum.  We have also indicated that we desire to persist the enum using it's string 
value as detailed in [Runtime Configuration (Enums)](/configuration/runtime/enums).  The *PaymentMethodType* column in the *Purchase* table has a database 
type of *VARCHAR(20)*.  Using this in QueryExpressions is *exactly* the same as those persisted using their numeric value.  For example:
{% code-example %}
```csharp
IList<Purchase> credit_card_purchases = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .Where(dbo.Purchase.PaymentMethodType == PaymentMethodType.CreditCard)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Purchase].[Id],
	[dbo].[Purchase].[PersonId],
	[dbo].[Purchase].[OrderNumber],
	[dbo].[Purchase].[TotalPurchaseQuantity],
	[dbo].[Purchase].[TotalPurchaseAmount],
	[dbo].[Purchase].[PurchaseDate],
	[dbo].[Purchase].[ShipDate],
	[dbo].[Purchase].[ExpectedDeliveryDate],
	[dbo].[Purchase].[TrackingIdentifier],
	[dbo].[Purchase].[PaymentMethodType],
	[dbo].[Purchase].[PaymentSourceType],
	[dbo].[Purchase].[DateCreated],
	[dbo].[Purchase].[DateUpdated]
FROM
	[dbo].[Purchase]
WHERE
	[dbo].[Purchase].[PaymentMethodType] = @P1;',N'@P1 varchar(20)',@P1='CreditCard'
```
{% /code-example %}

Note that in the SQL statement the parameter value (```@P1```) used in the where clause is the string value of the ```PaymentMethodType``` enum.