---
title: Count
description: dbExpression COUNT Count aggregate function
---

{% ms-docs-url label="Count" path="/functions/count-transact-sql" /%}
{% supported-versions /%}

Use the `Count` function to return the number of items in a group of values.

## Count Aggregate Function

{% method-descriptor %}
```json
{
    "syntax" : "db.fx.Count({expression})[.Distinct()]",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : false,
            "description" : "The value to count.  If the parameter is not provided, a default of `*` will be used. When provided, must be of type `AnyElement`",
            "types": [
                { 
                    "typeName" : "AnyNumericElement"
                }
            ]
        },
        {
            "argumentName" : "Distinct()",
            "required" : false,
            "notes" : [ "The function returns the number of unique non-null values." ]
        }
    ],
    "returns" : {
        "typeName" : "int"
    }
}
```
{% /method-descriptor %}

## Examples
### Select Statement
Select the count of total purchase amount for all purchases.
{% code-example %}
```csharp
int count = db.SelectOne(
        db.fx.Count(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .Execute();
```
```sql
SELECT TOP(1)
    COUNT([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0];
```
{% /code-example %}

### Order By Clause
Select the count of total purchase amount for all purchases ordered by the count of total purchase amount descending.
{% code-example %}
```csharp
int count = db.SelectOne(
        db.fx.Count(dbo.Purchase.TotalPurchaseAmount)
    )
    .From(dbo.Purchase)
    .OrderBy(db.fx.Count(dbo.Purchase.TotalPurchaseAmount).Desc())
    .Execute();
```
```sql
SELECT TOP(1)
    COUNT([t0].[TotalPurchaseAmount])
FROM
    [dbo].[Purchase] AS [t0]
ORDER BY
    COUNT([t0].[TotalPurchaseAmount]) DESC;
```
{% /code-example %}

### Having Clause
Select the count of all purchases, grouped by payment
method type having an count greater than 10 .
{% code-example %}
```csharp
IEnumerable<int> counts = db.SelectMany(
        db.fx.Count()
    )
    .From(dbo.Purchase)
    .GroupBy(dbo.Purchase.PaymentMethodType)
    .Having(db.fx.Count() > 10)
    .Execute();
```
```sql
exec sp_executesql N'SELECT
	COUNT(*)
FROM
	[dbo].[Purchase] AS [t0]
GROUP BY
	[t0].[PaymentMethodType]
HAVING
	COUNT(*) > @P1;',N'@P1 int',@P1=10
```
{% /code-example %}
