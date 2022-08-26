---
title: Logical Expressions
---

Logical expressions equate to a true/false result.  Logical expressions are created by using one of the following operators between two (or more) comparison expressions and/or literal values:

| Operator | Description                |
|:--------:|----------------------------|
|   &      | AND                        |
|   \|     | OR                         |
|   Like   | Like(...)                  |
|   !      | Negation                   |

You can combine any number of comparison and/or arithmetic expressions using logical operators to create composite expressions.
```csharp
//logical AND
dbo.Person.DateCreated >= DateTime.Now.AddYears(-1) & dbo.Person.CreditLimit > 100000

//logical OR
dbo.Address.Zip == "75000" | dbo.Address.Zip == "76000"

//Logical negation ... NOT either of these zip codes
!(dbo.Address.Zip == "75000" | dbo.Address.Zip == "76000")

//Logical Like() ... LastName starts with 'E' AND CreditLimit <= 15,000
dbo.Person.LastName.Like("E%") & dbo.Person.CreditLimit <= 15000
```

Precedence is controlled with parenthesis in the expression.  The following expression retrieves results for males within zip codes 80456 or 94043 and females within zip codes 10002 or 02801.
```csharp
//( (Male AND (reside in Zip 80456 OR Zip 94043))  OR (Female AND (reside in Zip 10002 OR Zip 02801)) )
(
    dbo.Person.GenderType == GenderType.Male 
    & 
    (dbo.Address.Zip == "80456" | dbo.Address.Zip == "94043")
)
|
(
    dbo.Person.GenderType == GenderType.Female 
    & 
    (dbo.Address.Zip == "10002" | dbo.Address.Zip == "02801")
)
```