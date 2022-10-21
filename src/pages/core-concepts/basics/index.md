---
title: Basic Query Concepts
description: QueryExpression explained.
---

Writing queries in dbExpression is fairly similar to writing a 
[Linq](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/linq/)
query in C#.  We'll explain the similarities as we cover these concepts:
* **Query Composition** - How to use dbExpression syntax to fluently build strongly-typed queries.
* **Query Expressions** - What they are and how they relate to a Linq query.
* **Expression Elements** - How they are used with a Query Expression and their similarity to Linq expressions.

## Query Composition

Similar to Linq, dbExpression queries are authored fluently, where the
query is constructed by chaining various methods.  dbExpression's chaining signatures
align to methods and keywords you would use when writing SQL statements in (T)SQL. Some 
dbExpression core nomenclature:

{% partial file="basic-queries-partial.md" /%}

## Query Expressions

{% partial file="query-expressions-partial.md" /%}

> A `QueryExpression` is the type that captures the input when fluently building a query.

## Expression Elements
{% partial file="expression-elements-partial.md" /%}

Some examples of expression elements:
```csharp
dbo.Person  //The person entity, which represents
            //the 'Person' table in the 'dbo' schema

dbo.Person.Id //The id field of a person entity 
              //typed as an integer, which is an Int32FieldExpression

```

You don't need to understand all of the expression element types in dbExpression. You'll 
see their types via Intellisense when building queries, you won't generally dive 
into the inner workings of an expression element - you'll simply use them to author queries.

Let's look at a few examples using expression elements to compose composite expression elements (which are
just other expression elements):
```csharp
//a DateTimeElement
db.fx.IsNull(dbo.Person.BirthDate, DateTime.UtcNow)

//an Int32Element composed using addition
dbo.Person.CreditLimit + 10_000

//a StringElement composed using concatenation
dbo.Person.FirstName + " " + dbo.Person.LastName

//an Int16Element simulating the approximation age of a person.
//composed using several database functions
db.fx.Cast(db.fx.Floor(db.fx.DateDiff(DateParts.Day, dbo.Customer.BirthDate, db.fx.GetUtcDate()) / 365.25)).AsSmallInt()
```

All .NET CLR primitives have a corresponding expression element type (plus strings and byte arrays). 
We'll create expression elements for all the things in your database - and we'll also create 
expression elements for your custom types, things like enums.


