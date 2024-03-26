---
title: DatePart
description: dbExpression DATEPART date time function
---

{% ms-docs-url label="DatePart" path="/functions/datepart-transact-sql" /%}
{% supported-versions /%}

## DatePart Date and Time Function

Use the `DatePart` function to return the specified part of a date.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.DatePart({DATEPART}, {expression})",
    "arguments" : [
        {
            "argumentName" : "DATEPART",
            "required" : true,
            "description" : "The part of `expression` to extract.  `DATEPART` is an enumeration (in the `DbExpression.MsSql.Expression` namespace).",
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
            "argumentName" : "expression",
            "required" : true,
            "description" : "The date value to extract `DATEPART` from.",
            "types": [
                { 
                    "typeName" : "AnyElement<DateTime>"
                },
                { 
                    "typeName" : "AnyElement<DateTime?>"
                },
                { 
                    "typeName" : "AnyElement<DateTimeOffset>"
                },
                { 
                    "typeName" : "AnyElement<DateTimeOffset?>"
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
Select the year of ship date.
{% code-example %}
```csharp
IEnumerable<int?> result = db.SelectMany(
        db.fx.DatePart(DateParts.Year, dbo.Purchase.ShipDate)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT
    DATEPART(year, [t0].[ShipDate])
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

### Where Clause
Select all product ids of products that shipped on Friday.
{% code-example %}
```csharp
IEnumerable<int> purchase_ids = db.SelectMany(
        dbo.Purchase.Id
    )
    .From(dbo.Purchase)
    .Where(db.fx.DatePart(DateParts.Weekday, dbo.Purchase.ShipDate) == 6)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    [t0].[Id]
FROM
    [dbo].[Purchase] AS [t0]
WHERE
    DATEPART(weekday, [t0].[ShipDate]) = @P1;',N'@P1 int',@P1=6
```
{% /code-example %}

### Order By Clause
Select all purchases ordered by the week the product shipped.
{% code-example %}
```csharp
IEnumerable<Purchase> result = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .OrderBy(db.fx.DatePart(DateParts.Week, dbo.Purchase.ShipDate))
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
    DATEPART(week, [t0].[ShipDate]) ASC;
```
{% /code-example %}

### Group By Clause
Select product information grouped by product category type and the
week the product was added to the system.
{% code-example %}
```csharp
IEnumerable<dynamic> results = db.SelectMany(
        dbo.Product.ProductCategoryType,
        db.fx.DatePart(DateParts.Week, dbo.Product.DateCreated).As("Week")
    )
    .From(dbo.Product)
    .GroupBy(
        dbo.Product.ProductCategoryType,
        db.fx.DatePart(DateParts.Week, dbo.Product.DateCreated)
    )
    .Execute();
```
```sql
SELECT
    [t0].[ProductCategoryType],
    DATEPART(week, [t0].[DateCreated]) AS [Week]
FROM
    [dbo].[Product] AS [t0]
GROUP BY
    [t0].[ProductCategoryType],
    DATEPART(week, [t0].[DateCreated]);
```
{% /code-example %}

### Having Clause
Select purchase values grouped by payment method type that shipped the first week of the year.
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
        db.fx.DatePart(DateParts.Week, dbo.Purchase.ShipDate) == 1
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
    DATEPART(week, [t0].[ShipDate]) = @P1;',N'@P1 int',@P1=1
```
{% /code-example %}
