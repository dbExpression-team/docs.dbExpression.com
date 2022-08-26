---
title: Comparison Expressions
---

Comparison expressions are created by using one of the following operators between two expression elements and/or literal values:

| Operator | Description                |
|:--------:|----------------------------|
|   ==     | Is equal to                |
|   !=     | Is not equal to            |
|   >      | Is greater than            |
|   <      | Is less than               |
|   >=     | Is greater than or equal to|
|   <\=    | Is less than or equal to   |

Comparison operations within a QueryExpression must follow the same type check constraints the .NET CLR enforces for any other comparison expression.  For example, if a QueryExpression field represents an integer column in your database, comparing that field to a string literal would raise a compile time error.
```csharp
dbo.Person.Id == "4000"
```
This would cause a compilation error:  ```CS0019 Operator '==' cannot be applied to operands of type 'PersonEntity.IdField' and 'string'```

A basic comparison expression is a comparison operator between a database field and a literal value.  
```csharp
 dbo.Person.Id == 3 
 ```
The left argument in the expression above is a field expression, the right argument is a numeric literal.  Operands of each comparison can be field expressions, the result of any other expression composition, or any CLR literal.  The examples below represent comparisons using different types of operands:

```csharp
//string field to string literal
dbo.Person.LastName == "Broflovski"

//int field expression to int literal
dbo.Person.Id == 3

//DateTime field expression to DateTime field expression
dbo.Person.DateCreated == dbo.Person.DateUpdated

//function expression result to int literal
db.fx.IsNull(dbo.Person.CreditLimit, 0) < 1000

//aggregate function expression result to double literal
db.fx.Sum(dbo.Purchase.TotalPurchaseAmount) >= 2500
```