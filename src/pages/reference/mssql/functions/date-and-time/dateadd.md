---
title: DateAdd
description: dbExpression DATEADD date time function
---

{% ms-docs-url label="DateAdd" path="/functions/dateadd-transact-sql" /%}
{% supported-versions /%}

## DateAdd Date and Time Function

Use the `DateAdd` function to add a number to a part of a date.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.DateAdd({DATEPART}, {number}, {expression})",
    "arguments" : [
        {
            "argumentName" : "DATEPART",
            "required" : true,
            "description" : "The part of `expression` to add `number`.  `DATEPART` is an enumeration (in the `DbExpression.MsSql.Expression` namespace).",
            "types": [
                { 
                    "typeName" : "Year"
                },
                { 
                    "typeName" : "Quarter"
                },
                { 
                    "typeName" : "Month"
                },
                { 
                    "typeName" : "DayOfYear"
                },
                { 
                    "typeName" : "Day"
                },
                { 
                    "typeName" : "Week"
                },
                { 
                    "typeName" : "Weekday"
                },
                { 
                    "typeName" : "Hour"
                },
                { 
                    "typeName" : "Minute"
                },
                { 
                    "typeName" : "Second"
                },
                { 
                    "typeName" : "Millisecond"
                },
                { 
                    "typeName" : "Microsecond"
                },
                { 
                    "typeName" : "Nanosecond"
                },
                { 
                    "typeName" : "TZOffset"
                },
                { 
                    "typeName" : "ISO_Week"
                }
            ]
        },
        {
            "argumentName" : "number",
            "required" : true,
            "description" : "The value to add.",
            "types": [
                { 
                    "typeName" : "AnyElement<int>"
                },
                { 
                    "typeName" : "AnyElement<int?>"
                },
                { 
                    "typeName" : "int"
                },
                { 
                    "typeName" : "int?"
                }
            ]
        },
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The date value, where the part specified by `DATEPART`, that `number` is added.",
            "types": [
                { 
                    "typeName" : "AnyElement<DateTime>"
                },
                { 
                    "typeName" : "AnyElement<DateTime?>"
                },
                { 
                    "typeName" : "DateTime"
                },
                { 
                    "typeName" : "DateTime?"
                },
                { 
                    "typeName" : "AnyElement<DateTimeOffset>"
                },
                { 
                    "typeName" : "AnyElement<DateTimeOffset?>"
                },
                { 
                    "typeName" : "DateTimeOffset"
                },
                { 
                    "typeName" : "DateTimeOffset?"
                }
            ]
        }              
    ],
    "returns" : { 
        "typeName" : "DateTime or DateTime?", 
        "description" : "(based on nullability of `expression` and `number`)"
    }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the addition of 1 to the ship date of all products.
{% code-example %}
```csharp
IEnumerable<DateTime?> result = db.SelectMany(
        db.fx.DateAdd(DateParts.Year, 1, dbo.Purchase.ShipDate)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    DATEADD(year, @P1, [t0].[ShipDate])
FROM
    [dbo].[Purchase] AS [t0];',N'@P1 int',@P1=1
```
{% /code-example %}

### Where Clause
Select all product ids where it took longer than 15 days from purchase to ship.
{% code-example %}
```csharp
IEnumerable<int> result = db.SelectMany(
        dbo.Purchase.Id
    )
    .From(dbo.Purchase)
    .Where(db.fx.DateAdd(DateParts.Day, -15, dbo.Purchase.ShipDate) > dbo.Purchase.PurchaseDate)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id]
FROM
    [dbo].[Purchase] AS [t0]
WHERE
    DATEADD(day, @P1, [t0].[ShipDate]) > [t0].[PurchaseDate];',N'@P1 int',@P1=-15
```
{% /code-example %}

### Order By Clause
Select all purchases ordered by the addition of 1 to ship date. (this example shows order, but the actual logic isn't any different than simply ordering by ship date).
{% code-example %}
```csharp
IEnumerable<Purchase> result = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .OrderBy(db.fx.DateAdd(DateParts.Week, 1, dbo.Purchase.ShipDate))
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
ORDER BY
    DATEADD(week, @P1, [t0].[ShipDate]) ASC;',N'@P1 int',@P1=1
```
{% /code-example %}

### Group By Clause
Select product information grouped by product category type and the
addition of 1 to ship date. (this example shows grouping, but the actual logic isn't any different than simply grouping by date created).
{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
        dbo.Product.ProductCategoryType,
        db.fx.DateAdd(DateParts.Week, 1, dbo.Product.DateCreated).As("NewDateCreated")
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.DateAdd(DateParts.Week, 1, dbo.Product.DateCreated)
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[ProductCategoryType],
    DATEADD(week, @P1, [t0].[DateCreated]) AS [NewDateCreated]
FROM
    [dbo].[Product] AS [t0]
GROUP BY
    [t0].[ProductCategoryType],
    DATEADD(week, @P1, [t0].[DateCreated]);',N'@P1 int',@P1=1
```
{% /code-example %}

### Having Clause
Select purchase values grouped by payment method type that haven't shipped in the past week.
{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        dbo.Purchase.ShipDate
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType,
        dbo.Purchase.ShipDate
    )
    .Having(
        db.fx.DateAdd(DateParts.Week, 1, dbo.Purchase.ShipDate) > DateTime.Now
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[PaymentMethodType],
    [t0].[ShipDate]
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType],
    [t0].[ShipDate]
HAVING
    DATEADD(week, @P1, [t0].[ShipDate]) > @P2;',N'@P1 int,@P2 datetime',@P1=1,@P2='2022-09-25 15:37:50.877'
```
{% /code-example %}
