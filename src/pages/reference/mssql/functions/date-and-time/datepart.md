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
            "description" : "The part of `expression` to extract.  `DATEPART` is an enumeration (in the `HatTrick.DbEx.MsSql.Expression` namespace).",
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
IList<int?> result = db.SelectMany(
        db.fx.DatePart(DateParts.Year, dbo.Purchase.ShipDate)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT
	DATEPART(year, [dbo].[Purchase].[ShipDate])
FROM
	[dbo].[Purchase];
```
{% /code-example %}

### Where Clause
Select all product ids of products that shipped on Friday.
{% code-example %}
```csharp
IList<int> purchase_ids = db.SelectMany(
        dbo.Purchase.Id
    )
    .From(dbo.Purchase)
    .Where(db.fx.DatePart(DateParts.Weekday, dbo.Purchase.ShipDate) == 6)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	[dbo].[Purchase].[Id]
FROM
	[dbo].[Purchase]
WHERE
	DATEPART(weekday, [dbo].[Purchase].[ShipDate]) = @P1;',N'@P1 int',@P1=6
```
{% /code-example %}

### Order By Clause
Select all purchases ordered by the week the product shipped.
{% code-example %}
```csharp
IList<Purchase> result = db.SelectMany<Purchase>()
    .From(dbo.Purchase)
    .OrderBy(db.fx.DatePart(DateParts.Week, dbo.Purchase.ShipDate))
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
	DATEPART(week, [dbo].[Purchase].[ShipDate]) ASC;
```
{% /code-example %}

### Group By Clause
Select product information grouped by product category type and the
week the product was added to the system.
{% code-example %}
```csharp
IList<dynamic> results = db.SelectMany(
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
	[dbo].[Product].[ProductCategoryType],
	DATEPART(week, [dbo].[Product].[DateCreated]) AS [Week]
FROM
	[dbo].[Product]
GROUP BY
	[dbo].[Product].[ProductCategoryType],
	DATEPART(week, [dbo].[Product].[DateCreated]);
```
{% /code-example %}

### Having Clause
Select purchase values grouped by payment method type that shipped the first week of the year.
{% code-example %}
```csharp
IList<dynamic> results = db.SelectMany(
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
	[dbo].[Purchase].[PaymentMethodType],
	[dbo].[Purchase].[ShipDate]
FROM
	[dbo].[Purchase]
GROUP BY
	[dbo].[Purchase].[PaymentMethodType],
	[dbo].[Purchase].[ShipDate]
HAVING
	DATEPART(week, [dbo].[Purchase].[ShipDate]) = @P1;',N'@P1 int',@P1=1
```
{% /code-example %}