* **Database Accessor** - The root accessor class for building SQL queries.
* **Query Type** - The type of query executed against the database (methods correlate to one of SELECT, INSERT, UPDATE, DELETE, or Stored Procedure).
* **Entities** - Data package classes (plain old class objects) that represent the tables and views within your target database.
* **Schema Accessors** - Classes that represent each schema in your target database.
* **Entity Accessors** - Classes that represent the tables and views within each of your schemas.
* **Field Accessors** - Classes that represent the columns within each of your tables and views.
* **QueryExpression** - A compile-time expression that represents a query for execution against the target database.  Here's the anatomy of a QueryExpression:

![Expression Composition](https://dbexpressionpublic.blob.core.windows.net/docs/query-expression-composition.png)