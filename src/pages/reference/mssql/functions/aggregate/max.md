---
title: Max
description: dbExpression MAX Maximum aggregate function
---

{% ms-docs-url label="Maximum" path="/functions/max-transact-sql" /%}
{% supported-versions /%}

## Max (Maximum) Aggregate Function

Use the `Max` function to return the maximum value from a set of values.


{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Max({expression})[.Distinct()]",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The field expression, composite element, or function result to use in finding the maximum value.",
            "types": [
                { 
                    "typeName" : "AnyNumericElement"
                },
                { 
                    "typeName" : "AnyElement<Guid>"
                },
                { 
                    "typeName" : "AnyElement<Guid?>"
                },
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
                },
                { 
                    "typeName" : "AnyElement<string>"
                },
                { 
                    "typeName" : "AnyElement<string?>"
                }
            ]
        },
        {
            "argumentName" : "Distinct()",
            "required" : false,
            "description" : "Has no functional purpose and is provided for ISO compatibility only."
        }        
    ],
    "returns" : {
        "description": "The same type as the generic parameter of the provided `expression`."
    }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the maximum of total purchase amount for all purchases.
{% code-example %}
```csharp
double minSales = db.SelectOne(
        db.fx.Max(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT TOP(1)
    MAX([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

### Order By Clause
Select the maximum of total purchase amount for all purchases ordered by the maximum of total purchase amount descending.
{% code-example %}
```csharp
IEnumerable<double> minSales = db.SelectMany(
        db.fx.Max(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .OrderBy(db.fx.Max(dbo.Purchase.TotalPurchaseAmount).Desc())
    .Execute();
```
```sql
SELECT
    MAX([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0]
ORDER BY
    MAX([t0].[TotalPurchaseAmount]) DESC;
```
{% /code-example %}

### Having Clause
Select the maximum of total purchase amount for all purchases (ignoring null values), grouped by payment
method type having an maximum greater than 10 and ordered by the maximum of total purchase amount.
{% code-example %}
```csharp
IEnumerable<double> minSales = db.SelectMany(
        db.fx.Max(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .GroupBy(dbo.Purchase.PaymentMethodType)
    .Having(db.fx.Max(dbo.Purchase.TotalPurchaseAmount) > 10)
    .OrderBy(db.fx.Max(dbo.Purchase.TotalPurchaseAmount))
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    MAX([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType]
HAVING
    MAX([t0].[TotalPurchaseAmount]) > @P1
ORDER BY
    MAX([t0].[TotalPurchaseAmount]) ASC;',N'@P1 float',@P1=10
```
{% /code-example %}
