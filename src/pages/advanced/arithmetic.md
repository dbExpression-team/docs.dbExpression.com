---
title: Arithmetic
description: How to use arithmetic while fluently building query expressions.
---

Arithmetic expressions are used to specify arithmetic calculations that are performed by the database engine - not in compiled code.  Arithmetic expressions are created by using one of the following operators between two (or more) expression elements and/or literal values:

| Operator | Description                |
|:--------:|----------------------------|
|   +      | Addition                   |
|   -      | Subtraction                |
|   *      | Multiplication             |
|   /      | Division                   |
|   %      | Modulus                    |

```csharp
//double field expression subtracted from a double field expression
dbo.Product.ListPrice - dbo.Product.Price
 ```
The left argument in the expression above is a field expression, the right argument is another field expression.  Arithmetic can be performed on field expressions, the result of any other expression composition, or any CLR literal - provided the data types can be used together for arithmetic.  For example, the following is not a valid arithmetic expression:
```csharp
//double field expression multiplied by a string field expression
dbo.Purchase.TotalPurchaseAmount * dbo.Person.FirstName
```
This would cause a compilation error:  ```CS0019 Operator '*' cannot be applied to operands of type 'PurchaseEntity.TotalPurchaseAmountField' and 'PersonEntity.FirstNameField'```

The following demonstrate arithmetic expressions using different types of arithmetic operators:
```csharp
//double field expression divided by literal value
dbo.Purchase.TotalPurchaseAmount / 2

//double field expression multiplied by an int field expression
dbo.Product.Price * dbo.Product.Quantity

//decimal function expression multiplied by decimal function expression
db.fx.IsNull(dbo.Product.Height, 0) * db.fx.IsNull(dbo.Product.Width, 0)

//decimal function expressions multiplied
db.fx.IsNull(dbo.Product.Height, 0) * db.fx.IsNull(dbo.Product.Width, 0) * db.fx.IsNull(dbo.Product.Depth, 0)
```

An example QueryExpression using arithmetic expressions to select data calculated by the database engine:
{% code-example %}
```csharp
//select the product info (inventory on hand, price of inventory and projected margin on sales)
IList<dynamic> inventoryStats = db.SelectMany(
        dbo.Product.Id,
        dbo.Product.Name,
        dbo.Product.Quantity.As("QuantityOnHand"),
        (dbo.Product.Quantity * dbo.Product.Price).As("InventoryCost"),
        ((dbo.Product.Quantity * dbo.Product.ListPrice) - (dbo.Product.Quantity * dbo.Product.Price)).As("ProjectedMargin")
    )
    .From(dbo.Product)
    .Execute();
```
```sql
SELECT
    [dbo].[Product].[Id],
    [dbo].[Product].[Name],
    [dbo].[Product].[Quantity] AS [QuantityOnHand],
    ([dbo].[Product].[Quantity] * [dbo].[Product].[Price]) AS [InventoryCost],
    (([dbo].[Product].[Quantity] * [dbo].[Product].[ListPrice]) - ([dbo].[Product].[Quantity] * [dbo].[Product].[Price])) AS [ProjectedMargin]
FROM
    [dbo].[Product];
```
{% /code-example %}

Arithmetic expressions are also useful for filtering data retrieved from the database, see [Filter Expressions](/filters/filter-expressions#filter-expressions-in-where-clauses) for using arithmetic expressions in Where (and other) clauses.