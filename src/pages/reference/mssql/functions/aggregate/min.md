---
title: Min
description: dbExpression MIN Minimum aggregate function
---

{% ms-docs-url label="Minimum" path="/functions/min-transact-sql" /%}
{% supported-versions /%}

## Min (Minimum) Aggregate Function

Use the `Min` function to return the minimum value from a set of values.

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Min({expression})[.Distinct()]",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true,
            "description" : "The field expression, composite element, or function result to use in finding the minimum value.",
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
Select the minimum of total purchase amount for all purchases.
{% code-example %}
```csharp
double minSales = db.SelectOne(
        db.fx.Min(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT TOP(1)
    MIN([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

### Order By Clause
Select the minimum of total purchase amount for all purchases ordered by the minimum of total purchase amount descending.
{% code-example %}
```csharp
IEnumerable<double> minSales = db.SelectMany(
        db.fx.Min(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .OrderBy(db.fx.Min(dbo.Purchase.TotalPurchaseAmount).Desc())
    .Execute();
```
```sql
SELECT
    MIN([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0]
ORDER BY
    MIN([t0].[TotalPurchaseAmount]) DESC;
```
{% /code-example %}

### Having Clause
Select the minimum of total purchase amount for all purchases (ignoring null values), grouped by payment
method type having an minimum greater than 10 and ordered by the minimum of total purchase amount.
{% code-example %}
```csharp
IEnumerable<double> minSales = db.SelectMany(
        db.fx.Min(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .GroupBy(dbo.Purchase.PaymentMethodType)
    .Having(db.fx.Min(dbo.Purchase.TotalPurchaseAmount) > 10)
    .OrderBy(db.fx.Min(dbo.Purchase.TotalPurchaseAmount))
    .Execute();
```
```sql
exec sp_executesql N'SELECT
    MIN([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0]
GROUP BY
    [t0].[PaymentMethodType]
HAVING
    MIN([t0].[TotalPurchaseAmount]) > @P1
ORDER BY
    MIN([t0].[TotalPurchaseAmount]) ASC;',N'@P1 float',@P1=10
```
{% /code-example %}
