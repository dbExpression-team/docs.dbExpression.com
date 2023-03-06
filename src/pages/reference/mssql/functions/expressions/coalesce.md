---
title: Coalesce
description: dbExpression COALESCE expression function
---

{% ms-docs-url label="Coalesce" path="/language-elements/coalesce-transact-sql" /%}
{% supported-versions /%}

## Coalesce Expression

Use the `Coalesce` function to return the first non-null item from the list of expressions.

`Coalesce` is a curious function.  Columns/expressions of different database types can be provided in the list, but depending
upon what is provided, the function may fail.  For example, given two fields where `field1` is a `uniqueidentifier` 
and `field2` is a `varchar` and both fields allow null.  On execution of a SELECT (many) query using `Coalesce(field1, field2)`, if the first 
record in the rowset has a non-null value for `field1` and the second record in the rowset has a `NULL` value for `field1` and a non-null 
value for `field2`, an error will occur. *Why?* - The first row causes the `Coalesce` function to conclude 
the return type should be `uniqueidentifier`.  The second row returns a `varchar`, which is not convertible 
to a `uniqueidentifier`, so Microsoft SQL Server raises an error.

See the Microsoft docs for a more technically correct explanation and in-depth explanation.

## Non-Generic Version

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Coalesce({first_expression}, {second_expression}[, ...{n-expression}])",
    "arguments" : [
        {
            "argumentName" : "first_expression",
            "required" : true,
            "description" : "The first value to seek a non-null value.",
            "types": [
                { 
                    "typeName" : "AnyElement"
                }
            ]
        },
		{
            "argumentName" : "second_expression",
            "required" : true,
            "description" : "An expression or literal value, the second value to evaluate for null.",
            "types": [
                { 
                    "typeName" : "AnyElement"
                },
				{ 
                    "typeName" : "IComparable"
                }
            ]
        },
		{
            "argumentName" : "n-expression",
            "required" : false,
            "description" : "A list of expressions or literal values, if `first_expression` and `second_expression` are null, the first non-null value (or null) will be returned.",
            "types": [
                { 
                    "typeName" : "AnyElement"
                },
				{ 
                    "typeName" : "IComparable",
					"description" : "last value only."			
                }
            ],
			"notes" : [
				"`n-expression` is 0 or more `AnyElement`(s).  The last value can be an `AnyElement` or an `IComparable`."
			]
        }            
    ],
    "returns" : { 
        "typeName" : "object?"
    }
}
```
{% /method-descriptor %}

## Generic Version

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Coalesce<T>({first_expression}, {second_expression}[, ...{n-expression}])",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true,
            "description" : "The resulting expression will be typed as `T`.",
            "types": [
                { 
                    "typeName" : "Type"
                }
            ]
        },
		{
            "argumentName" : "first_expression",
            "required" : true,
            "description" : "The first value to seek a non-null value.",
            "types": [
                { 
                    "typeName" : "AnyElement"
                }
            ]
        },
		{
            "argumentName" : "second_expression",
            "required" : true,
            "description" : "An expression or literal value, the second value to evaluate for null.",
            "types": [
                { 
                    "typeName" : "AnyElement"
                },
				{ 
                    "typeName" : "IComparable"
                }
            ]
        },
		{
            "argumentName" : "n-expression",
            "required" : false,
            "description" : "A list of expressions or literal values, if `first_expression` and `second_expression` are null, the first non-null value (or null) will be returned.",
            "types": [
                { 
                    "typeName" : "AnyElement"
                },
				{ 
                    "typeName" : "IComparable",
					"description" : "last value only."			
                }
            ],
			"notes" : [
				"`n-expression` is 0 or more `AnyElement`(s).  The last value can be an `AnyElement` or an `IComparable`."
			]
        }            
    ],
    "returns" : { 
        "typeName" : "T",
		"description" : "If the first non-null value in the list is not convertible to `T`, an error will occur."
    }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the first non-null date.
{% code-example %}
```csharp
IEnumerable<object?> result = db.SelectMany(
        db.fx.Coalesce(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate, dbo.Purchase.PurchaseDate).As("latest_date")
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT
    COALESCE([t0].[ExpectedDeliveryDate], [t0].[ShipDate], [t0].[PurchaseDate]) AS [latest_date]
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

Select the first non-null date, indicating the return type should be `DateTime`.
{% code-example %}
```csharp
IEnumerable<DateTime> result = db.SelectMany(
        db.fx.Coalesce<DateTime>(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate, dbo.Purchase.PurchaseDate).As("latest_date")
    )
    .From(dbo.Purchase)
    .Execute();
    // dbo.Purchase.PurchaseDate does not allow nulls, so the last parameter will always return a non-null value
    // therefore, the return can be DateTime, not DateTime?
```
```sql
SELECT
    COALESCE([t0].[ExpectedDeliveryDate], [t0].[ShipDate], [t0].[PurchaseDate]) AS [latest_date]
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

Try and select the first non-null item in a list of different data types.  This query will fail with: 'The conversion of the varchar value overflowed an int column.'
{% code-example %}
```csharp
object? result = db.SelectOne(
        db.fx.Coalesce(db.fx.Cast(dbo.Purchase.OrderNumber).AsBigInt(), dbo.Purchase.Id).As("relevant_identifier")
    )
    .From(dbo.Purchase)
    .Execute();
    // dbo.Purchase.OrderNumber is a varchar (string) while
    // dbo.Purchase.Id is an int
```
```sql
SELECT TOP(1)
    COALESCE(CAST([t0].[OrderNumber] AS BigInt), [t0].[Id]) AS [relevant_identifier]
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

### Where Clause
Select purchases where the last relevant date is over a week ago.
{% code-example %}
```csharp
IEnumerable<Purchase> purchases = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .Where(
        db.fx.Coalesce(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate, dbo.Purchase.PurchaseDate) < DateTime.UtcNow.AddDays(-7)
    )
    .Execute();
```
```sql
exec sp_executesql N'ELECT
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
    COALESCE([t0].[ExpectedDeliveryDate], [t0].[ShipDate], [t0].[PurchaseDate]) < @P1;',N'@P1 datetime',@P1='2022-09-20 16:47:54.607'
```
{% /code-example %}

### Order By Clause
Select a list of purchases, ordered by a relevant date.
{% code-example %}
```csharp
IEnumerable<Purchase> products = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .OrderBy(db.fx.Coalesce(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate, dbo.Purchase.PurchaseDate).Desc())
    .Execute();
```
```sql
SELECT
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
ORDER BY
    COALESCE([t0].[ExpectedDeliveryDate], [t0].[ShipDate], [t0].[PurchaseDate]) DESC;
```
{% /code-example %}

### Group By Clause
Select the cast of all product quantities, grouped by product category
type and cast of product quantity.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        db.fx.Coalesce(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate, dbo.Purchase.PurchaseDate).As("relevant_date")
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType,
        db.fx.Coalesce(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate, dbo.Purchase.PurchaseDate)
    )
    .Execute();
```
```sql
SELECT
    [t0].[PaymentMethodType],
    COALESCE([t0].[ExpectedDeliveryDate], [t0].[ShipDate], [t0].[PurchaseDate]) AS [relevant_date]
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType],
    COALESCE([t0].[ExpectedDeliveryDate], [t0].[ShipDate], [t0].[PurchaseDate]);
```
{% /code-example %}

### Having Clause
Select a list of payment methods and a 'relevant date(s)' where no activity has taken place for more than 7 days.
{% code-example %}
```csharp
IEnumerable<dynamic> values = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        db.fx.Coalesce(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate, dbo.Purchase.PurchaseDate).As("relevant_date")
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType, 
        dbo.Purchase.ExpectedDeliveryDate, 
        dbo.Purchase.ShipDate, 
        dbo.Purchase.PurchaseDate
    )
    .Having(
        db.fx.Coalesce(dbo.Purchase.ExpectedDeliveryDate, dbo.Purchase.ShipDate, dbo.Purchase.PurchaseDate) < DateTime.UtcNow.Date.AddDays(-7)
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[PaymentMethodType],
    COALESCE([t0].[ExpectedDeliveryDate], [t0].[ShipDate], [t0].[PurchaseDate]) AS [relevant_date]
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType],
    [t0].[ExpectedDeliveryDate],
    [t0].[ShipDate],
    [t0].[PurchaseDate]
HAVING
    COALESCE([t0].[ExpectedDeliveryDate], [t0].[ShipDate], [t0].[PurchaseDate]) < @P1;',N'@P1 datetime',@P1='2022-09-19 00:00:00'
```
{% /code-example %}

