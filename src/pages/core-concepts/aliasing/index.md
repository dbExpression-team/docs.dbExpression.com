---
title: Aliasing
---

Aliasing refers to the use of alternate names for database entities, expressions, or composite expressions where the database engine
cannot infer a name or disambiguate two or more expressions as they have identical names.

To work effectively with Microsoft SQL Server, dbExpression exposes the ability to alias any one of the following:
* Column
* Table
* Subquery (an alias is required when using these)
* Any composition of functions and expressions where a name cannot be inferred by the database engine