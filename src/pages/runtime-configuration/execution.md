---
title: Execution
---

After assembly of a sql statement, other factories and services manage the process of connecting to the database, building a command (and setting any parameters) and executing the sql statement against the target database.  These can be configured
using the following:

#### SqlStatements.Execution.Executor
Configure options for executing SQL statements.
* ```Use<T>()```: use the type ```T```, which implements ```ISqlStatementExecutor```
* ```Use(Func<ISqlStatementExecutor> factory)```: use the provided delegate to provide an instance of an ```ISqlStatementExecutor```
* ```Use(Func<IServiceProvider,ISqlStatementExecutor> factory)```: use the service provider to resolve an instance of an ```ISqlStatementExecutor```

#### SqlStatements.Execution.Pipeline
Configure options for managing the workflow of assembling and executing SQL statements.  *It is very rare, or very advanced use cases, that you would need to override the default execution pipelines*.  The section on [Query Execution Pipelines](/query-execution-pipelines/query-execution-pipelines) details how QueryExpressions are assembled and executed.
* ```ForPipelineType.Use<T>()```: use the type ```T```, which implements ```IQueryExecutionPipeline```
* ```ForPipelineType.Use<T>(Func<T> factory)```: use the provided delegate to provide an instance of an ```T```, which is a ```IQueryExecutionPipeline``` for a specific query type (SELECT, INSERT, UPDATE, DELETE, and Stored Procedure)
* ```ForPipelineType.Use<T>(Func<IServiceProvider,T> factory)```: use the service provider to resolve an instance of an ```T```, which is a ```IQueryExecutionPipeline``` for a specific query type (SELECT, INSERT, UPDATE, DELETE, and Stored Procedure)

#### ConnectionString
Configure options to use the provided connection string or factory for providing a connection string as needed.
* ```Use(string connectionString)```: use the provided connection string
* ```Use(Func<string> factory)```: use the provided delegate to provide a connection string
* ```Use(Func<IServiceProvider, string> factory)```: use the provided delegate to provide a connection string (that may use the service provider)
* ```Use<T>()```: use the type ```T```, which implements ```IConnectionStringFactory```
* ```Use(IConnectionStringFactory factory)```: use the provided factory
* ```Use(Func<IServiceProvider,IConnectionStringFactory> factory)```: use the provided delegate to provide a connection string factory (that may use the service provider)

#### SqlStatements.Execution.Connection
Configure options for creating connections to the target database to execute SQL statements.
* ```Use<T>()```: use the type ```T```, which implements ```IDbConnectionFactory```
* ```Use(IDbConnectionFactory factory)```: use the provided factory to provide an ```IDbConnection```
* ```Use(Func<IServiceProvider,IDbConnectionFactory> factory)```: use the service provider to resolve an instance of a ```IDbConnectionFactory``` used to create an ```IDbConnection```
* ```Use(Func<IDbConnection> factory)```: use the provided delegate to provide an ```IDbConnection```
* ```Use(Func<IServiceProvider,IDbConnection> factory)```: use the service provider to resolve an instance of ```IDbConnection```

#### Conversions
Configure options for converting primitive values (and strings and byte arrays), enums, and reference types as they are sent to and read from the target database.
* ```Use(Func<Type,IValueConverter> factory)```: use the provided delegate to provide an ```IValueConverter```
* ```Use(Func<IServiceProvider,Type,IValueConverter> factory)```: use the service provider to resolve an ```IValueConverter``` for the provided data type
* ```Use<T>()```: use the type ```T```, which implements ```IValueConverterFactory````
* ```Use(IValueConverterFactory factory)```: use the provided factory
* ```Use(Func<IValueConverterFactory> factory)```: use the provided delegate to resolve an ```IValueConverterFactory```
* ```Use(Func<IServiceProvider,IValueConverterFactory> factory)```: use the service provider to resolve an ```IValueConverterFactory```
* ```Use(Func<IServiceProvider,IValueConverterFactory> factory, Action<IValueConverterFactoryContinuationConfigurationBuilder<TDatabase>> configureElementTypes)```: use the service provider to resolve an ```IValueConverterFactory``` and configure converters for specific data types (NOTE: the factory must support the configuration of specific value converters - the default factory does)
* ```Use(Func<IServiceProvider,Type,IValueConverter> factory, Action<IValueConverterFactoryContinuationConfigurationBuilder<TDatabase>> configureElementTypes)```: use the service provider to resolve an ```IValueConverter``` for the provided data type ```T``` and configure value converters for specific data types (NOTE: the factory must support the configuration of specific value converters - the default factory does)
* ```ForTypes(Action<IValueConverterFactoryContinuationConfigurationBuilder<TDatabase>> configureTypes)```: using the default factory, configure value converters for specific data types

#### Entities.Creation
Configure options for creating instances of entities (POCOs) prior to mapping rowset data returned from execution of a SQL statement.
* ```Use(Func<Type,IDbEntity> factory)```: use the service provider to resolve an ```IDbEntity``` for the provided data type
* ```Use(Func<IServiceProvider,Type,IDbEntity> factory)```: use the service provider to resolve an ```IDbEntity``` for the provided data type
* ```Use<T>()```: use the type ```T```, which implements ```IEntityFactory````
* ```Use(IEntityFactory factory)```: use the provided factory
* ```Use(Func<IServiceProvider,IEntityFactory> factory)```: use the service provider to resolve an ```IEntityFactory```
* ```Use(Func<IServiceProvider,IEntityFactory> factory, Action<IEntityFactoryContinuationConfigurationBuilder<TDatabase>> configureEntityTypes)```: use the service provider to resolve an ```IEntityFactory``` and configure factories for specific entity types (NOTE: the factory must support the configuration of specific entity factories - the default factory does)
* ```Use(Func<IServiceProvider,Type,IDbEntity> factory, Action<IEntityFactoryContinuationConfigurationBuilder<TDatabase>> configureEntityTypes)```: use the service provider to resolve an ```IDbEntity``` for the provided entity type ```T``` and configure factories for specific entity types (NOTE: the factory must support the configuration of specific entity factories - the default factory does)
* ```ForEntityTypes(Action<IEntityFactoryContinuationConfigurationBuilder<TDatabase>> configureEntityTypes)```: using the default factory, configure factories for specific entity types

#### Entities.Mapping
Configure options for mapping field level values from a rowset returned from the target database to an instance of an entity (POCO).
* ```Use(Func<Type,IEntityMapper> factory)```: use the service provider to resolve an ```IEntityMapper``` for the provided entity type
* ```Use(Func<IServiceProvider,Type,IEntityMapper> factory)```: use the service provider to resolve an ```IEntityMapper``` for the provided entity type
* ```Use<T>()```: use the type ```T```, which implements ```IMapperFactory````
* ```Use(IMapperFactory factory)```: use the provided factory
* ```Use(Func<IServiceProvider,IMapperFactory> factory)```: use the service provider to resolve an ```IMapperFactory```
* ```ForEntityType<T>(Action<ISqlFieldReader, T> mapping)```: for an entity of type ```T```, use the provided delegate to map rowset values from the database to the entity

#### Logging.ConfigureLoggingSettings
Configure options for logging, when logging is configured using Microsoft's logging framework ().
* ```ConfigureLoggingSettings(Action<LoggingOptions> configure)```: use the provided delegate to configure logging options. See [Logging](/utilities/logging) for more details.