---
title: DateDiff
description: dbExpression DATEDIFF date time function
---

{% ms-docs-url label="DateDiff" path="/functions/datediff-transact-sql" /%}
{% supported-versions /%}

## DateDiff Date and Time Function

Use the `DateDiff` function to "generally" return the difference between two dates expressed in terms of `{DATEPART}`.  See the Microsoft docs for a more technically correct explanation.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.DateDiff({DATEPART}, {start_date_expression}, {end_date_expression})",
    "arguments" : [
        {
            "argumentName" : "DATEPART",
            "required" : true,
            "description" : "The part of `start_date_expression` and `end_date_expression` to use in determining the difference.  `DATEPART` is an enumeration (in the `HatTrick.DbEx.MsSql.Expression` namespace).",
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
            "argumentName" : "start_date_expression",
            "required" : true,
            "description" : "The starting date.",
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
        },
        {
            "argumentName" : "end_date_expression",
            "required" : true,
            "description" : "The ending date.",
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
        "typeName" : "int or int?", 
        "description" : "(based on nullability of `start_date_expression` and `end_date_expression`)"
    }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the days difference between a product's purchase date and it's ship date.
{% code-example %}
```csharp
IEnumerable<int?> result = db.SelectMany(
        db.fx.DateDiff(DateParts.Day, dbo.Purchase.PurchaseDate, dbo.Purchase.ShipDate)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT
    DATEDIFF(day, [t0].[PurchaseDate], [t0].[ShipDate])
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

### Where Clause
Select all purchase ids where it took longer than 7 days from purchase to ship.
{% code-example %}
```csharp
IEnumerable<int> result = db.SelectMany(
        dbo.Purchase.Id
    )
    .From(dbo.Purchase)
    .Where(db.fx.DateDiff(DateParts.Day, dbo.Purchase.PurchaseDate, dbo.Purchase.ShipDate) < 7)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id]
FROM
    [dbo].[Purchase] AS [t0]
WHERE
    DATEDIFF(day, [t0].[PurchaseDate], [t0].[ShipDate]) < @P1;',N'@P1 int',@P1=7
```
{% /code-example %}

### Order By Clause
Select all purchases ordered by the difference in weeks between purchase date and ship date.
{% code-example %}
```csharp
IEnumerable<Purchase> result = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .OrderBy(db.fx.DateDiff(DateParts.Week, dbo.Purchase.PurchaseDate, dbo.Purchase.ShipDate))
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
    DATEDIFF(week, [t0].[PurchaseDate], [t0].[ShipDate]) ASC;
```
{% /code-example %}

### Group By Clause
Select product information grouped by payment method type and the
difference in weeks between the purchase date and ship date.
{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        db.fx.DateDiff(DateParts.Week, dbo.Purchase.PurchaseDate, dbo.Purchase.ShipDate).As("WeeksBetween")
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType,
        db.fx.DateDiff(DateParts.Week, dbo.Purchase.PurchaseDate, dbo.Purchase.ShipDate)
    )
    .Execute();
```
```sql
SELECT
    [t0].[PaymentMethodType],
    DATEDIFF(week, [t0].[PurchaseDate], [t0].[ShipDate]) AS [WeeksBetween]
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType],
    DATEDIFF(week, [t0].[PurchaseDate], [t0].[ShipDate]);
```
{% /code-example %}

### Having Clause
Select purchase values grouped by payment method type that haven't shipped in the past week.
{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
        dbo.Purchase.PaymentMethodType,
        db.fx.DateDiff(DateParts.Day, dbo.Purchase.PurchaseDate, dbo.Purchase.ShipDate).As("DaysBetween")
    )
    .From(dbo.Purchase)
    .GroupBy(
        dbo.Purchase.PaymentMethodType,
        db.fx.DateDiff(DateParts.Day, dbo.Purchase.PurchaseDate, dbo.Purchase.ShipDate)
    )
    .Having(
        db.fx.DateDiff(DateParts.Day, dbo.Purchase.PurchaseDate, dbo.Purchase.ShipDate) < 7
    )
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[PaymentMethodType],
    DATEDIFF(day, [t0].[PurchaseDate], [t0].[ShipDate]) AS [DaysBetween]
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType],
    DATEDIFF(day, [t0].[PurchaseDate], [t0].[ShipDate])
HAVING
    DATEDIFF(day, [t0].[PurchaseDate], [t0].[ShipDate]) < @P1;',N'@P1 int',@P1=7
```
{% /code-example %}
