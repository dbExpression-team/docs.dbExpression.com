---
title: Assembly
---

Factories and services in this category or responsible for managing the creation and building of a query expression, followed by the assembly of that query expression into a sql statement.
Factories in this category can be configured using the following properties/methods on the configuration builder:

#### QueryExpressions
Configure options for providing a QueryExpression for fluently building a SQL statement.
* ```ForQueryType<T>().Use<TQuery>()```: use the type ```TQuery``` query expression, for the query type ```T``` (SELECT, INSERT, UPDATE, DELETE, and Stored Procedure)
* ```ForQueryType.Use<T>(Func<TQuery> factory)```: use the provided delegate to provide an instance of an ```TQuery```, for the query type ```T``` (SELECT, INSERT, UPDATE, DELETE, and Stored Procedure)
* ```ForQueryType.Use<T>(Func<IServiceProvider,TQuery> factory)```: use the service provider to resolve an instance of an ```TQuery```, for the query type ```T``` (SELECT, INSERT, UPDATE, DELETE, and Stored Procedure)
#### SqlStatements.Assembly.StatementBuilder
Configure options for creating builders that turn a QueryExpression into a SQL statement for execution. *It is very rare, or very advanced use cases, that you would need to override the default implementations for building SQL statements*.
* ```Use<T>()```: use the type ```T```, which implements ```ISqlStatementBuilder```
* ```Use(Func<ISqlStatementBuilder> factory)```: use the provided delegate to resolve a statement builder
* ```Use(Func<IServiceProvider,ISqlStatementBuilder> factory)```: use the provided delegate to resolve a statement builder (that may use the service provider)

#### SqlStatements.Assembly.ElementAppenders
Configure options for creating appenders for appending QueryExpression elements to an appender.  Elements are the lowest building block of a QueryExpression.  For example with the QueryExpression  ```db.Select(dbo.Person.Id).From(dbo.Person)```; 'dbo' is a schema element, 'Person' is an entity element, and 'Id' is a field element.  Each of these elements will have an appender responsible for correctly emitting their state to the SQL statement appender.
* ```Use(Func<Type,IExpressionElementAppender> factory)```: use the provided delegate to provide an ```IExpressionElementAppender``` for the provided expression element type
* ```Use(Func<IServiceProvider,Type,IExpressionElementAppender> factory)```: use the provided delegate to provide an ```IExpressionElementAppender``` for the provided expression element type (that may use the service provider)
* ```Use<T>()```: use the type ```T```, which implements ```IExpressionElementAppenderFactory````
* ```Use(IExpressionElementAppenderFactory factory)```: use the provided factory
* ```Use(Func<IServiceProvider,IExpressionElementAppenderFactory> factory)```: use the service provider to resolve an ```IExpressionElementAppenderFactory```
* ```Use(Func<IServiceProvider,IExpressionElementAppenderFactory> factory, Action<IExpressionElementAppenderFactoryContinuationConfigurationBuilder<TDatabase>> configureElementTypes)```: use the service provider to resolve an ```IExpressionElementAppenderFactory``` and configure element appenders for specific element types (NOTE: the factory must support the configuration of specific element appenders - the default factory does)
* ```ForElementTypes(Action<IExpressionElementAppenderFactoryContinuationConfigurationBuilder<TDatabase>> configureElementTypes)```: using the default factory, configure element appenders for specific element types

#### SqlStatements.Assembly.StatementAppender
Configure options for creating appenders for appending elements of a QueryExpression to a stream.
* ```Use<T>()```: use the type ```T```, which implements ```IAppender```
* ```Use(Func<IAppender> factory)```: use the provided delegate to provide an instance of an ```IAppender```
* ```Use(Func<IServiceProvider,IAppender> factory)```: use the service provider to resolve an instance of an ```IAppender```

#### SqlStatements.Assembly.ParameterBuilder
Configure options for creating parameters for literal values for use with SQL commands.
* ```Use<T>()```: use the type ```T```, which implements ```ISqlParameterBuilder```
* ```Use(Func<ISqlParameterBuilder> factory)```: use the provided delegate to provide an instance of an ```ISqlParameterBuilder```
* ```Use(Func<IServiceProvider,ISqlParameterBuilder> factory)```: use the service provider to resolve an instance of an ```ISqlParameterBuilder```

#### SqlStatements.Assembly.ConfigureOutputSettings
Configure options for the styling of SQL statements.
* ```ConfigureOutputSettings(Action<SqlStatementAssemblyOptions> configure)```: use the provided delegate to configure the output settings while appending QueryExpression elements to the appender.

A value of ```true``` would emit:
```sql
SELECT 
    [dbo].[Person].[Id] 
FROM 
    [dbo].[Person]
```

While a value of ```false``` would emit:
```sql
SELECT 
    [Person].[Id] 
FROM 
    [Person]
```

* ```PrependCommaOnSelectClause``` - whether to emit commas at the beginning of a line in a SQL statement instead of at the end.

A value of ```true``` would emit:
```sql
SELECT
    [dbo].[Person].[Id]
    ,[dbo].[Person].[FirstName]
    ,[dbo].[Person].[LastName]
FROM
    [dbo].[Person]
```

while a value of ```false``` would emit:
```sql
SELECT
    [dbo].[Person].[Id],
    [dbo].[Person].[FirstName],
    [dbo].[Person].[LastName]
FROM
    [dbo].[Person]
```

* ```IdentifierDelimiter.Begin``` and  ```IdentifierDelimiter.End``` - the character separators that delimit various elements.

A value of ```[``` for ```Begin``` and ```]``` for ```End``` (the default values for Microsoft SQL Server) would emit:
```sql
SELECT
    [dbo].[Person].[Id]
FROM
    [dbo].[Person]
```

while a value of "'" (single apostrophe) would emit:
```sql
SELECT
    'dbo'.'Person'.'Id',
    'dbo'.'Person'.'FirstName',
    'dbo'.'Person'.'LastName'
FROM
    'dbo'.'Person'
```