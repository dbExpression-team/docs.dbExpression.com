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
IList<int?> result = db.SelectMany(
        db.fx.DateDiff(DateParts.Day, dbo.Purchase.PurchaseDate, dbo.Purchase.ShipDate)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT
	DATEDIFF(day, [dbo].[Purchase].[PurchaseDate], [dbo].[Purchase].[ShipDate])
FROM
	[dbo].[Purchase];
```
{% /code-example %}

### Where Clause
Select all purchase ids where it took longer than 7 days from purchase to ship.
{% code-example %}
```csharp
IList<int> result = db.SelectMany(
        dbo.Purchase.Id
    )
    .From(dbo.Purchase)
    .Where(db.fx.DateDiff(DateParts.Day, dbo.Purchase.PurchaseDate, dbo.Purchase.ShipDate) < 7)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Purchase].[Id]
FROM
	[dbo].[Purchase]
WHERE
	DATEDIFF(day, [dbo].[Purchase].[PurchaseDate], [dbo].[Purchase].[ShipDate]) < @P1;',N'@P1 int',@P1=7
```
{% /code-example %}

### Order By Clause
Select all purchases ordered by the difference in weeks between purchase date and ship date.
{% code-example %}
```csharp
IList<Purchase> result = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .OrderBy(db.fx.DateDiff(DateParts.Week, dbo.Purchase.PurchaseDate, dbo.Purchase.ShipDate))
    .Execute();
```
```sql
SELECT
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
ORDER BY
	DATEDIFF(week, [dbo].[Purchase].[PurchaseDate], [dbo].[Purchase].[ShipDate]) ASC;
```
{% /code-example %}

### Group By Clause
Select product information grouped by payment method type and the
difference in weeks between the purchase date and ship date.
{% code-example %}
```csharp
IList<dynamic> results = db.SelectMany(
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
	[dbo].[Purchase].[PaymentMethodType],
	DATEDIFF(week, [dbo].[Purchase].[PurchaseDate], [dbo].[Purchase].[ShipDate]) AS [WeeksBetween]
FROM
	[dbo].[Purchase]
GROUP BY
	[dbo].[Purchase].[PaymentMethodType],
	DATEDIFF(week, [dbo].[Purchase].[PurchaseDate], [dbo].[Purchase].[ShipDate]);
```
{% /code-example %}

### Having Clause
Select purchase values grouped by payment method type that haven't shipped in the past week.
{% code-example %}
```csharp
IList<dynamic> results = db.SelectMany(
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
	[dbo].[Purchase].[PaymentMethodType],
	DATEDIFF(day, [dbo].[Purchase].[PurchaseDate], [dbo].[Purchase].[ShipDate]) AS [DaysBetween]
FROM
	[dbo].[Purchase]
GROUP BY
	[dbo].[Purchase].[PaymentMethodType],
	DATEDIFF(day, [dbo].[Purchase].[PurchaseDate], [dbo].[Purchase].[ShipDate])
HAVING
	DATEDIFF(day, [dbo].[Purchase].[PurchaseDate], [dbo].[Purchase].[ShipDate]) < @P1;',N'@P1 int',@P1=7
```
{% /code-example %}
