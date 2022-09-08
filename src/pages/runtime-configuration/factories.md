---
title: Factory/Service Replacement
---

dbExpression uses factories to retrieve the services it needs, where a factory is responsible for providing a service instance to perform a specific operation.  A core design principle
of dbExpression is extensibility.  So while you may never need to override/configure dbExpression beyond it's defaults, dbExpression allows for complete customization if required.

> Customization of default factories is typically far less effort than providing your own implementation.

## Factories
Factories, services, and the options to replace and/or configure these services fall into the following general categories:
* **Assembly** - from the start of fluently building a query expression to the assembly of that query expression into a sql statement.
* **Execution** - after assembly, the process of connecting to the database, building a command and setting (any) parameters and executing the sql statement against the target database.
* **Entities** - when reading data from the target database and the desired return is an entity or a list of entities.
* **Conversion** - converters are used to convert data as it is sent to and retrieved from the database.
* **SqlStatements** - connection management and execution of the composed sql statements against the target database.
* **Events** - events that occur during the execution of a sql statement, allowing an integration point to implement cross-cutting concerns.

The following is a list of the factories used by dbExpression:
* **SQL Statement Builder Factory** (```ISqlStatementBuilderFactory```) - creates instances of ```ISqlStatementBuilder```, which creates a SQL statement from a QueryExpression.
* **Element Appender Factory** (```IExpressionElementAppenderFactory```) - creates instances of ```IExpressionElementAppender```, which are used by an ```ISqlStatementBuilder``` to append elements of a QueryExpression to an ```IAppender```.
* **Mapper Factory** (```IMapperFactory```) - creates instances of an ```IEntityMapper<T>``` or an ```IExpandoObjectMapper```, which map rowset data returned from execution of a SQL statement to an instance of an entity of type ```T``` or to a ```dynamic``` object.
* **Entity Factory** (```IEntityFactory```) - creates instances of an ```IDbEntity```, which are the entities (POCOs) that rowset data is mapped to by an ```IEntityMapper<T>```.
* **Query Expression Factory** (```IQueryExpressionFactory```) - creates instances of an ```QueryExpression```, which is the "container" behind the fluent builder for QueryExpressions.
* **Value Converter Factory** (```IValueConverterFactory```) - creates instances of an ```IValueConverter```, which convert types as they are emitted to and read from the target database during SQL statement execution.
* **Execution Pipeline Factory** (```IExecutionPipelineFactory```) - creates instances of an ```IExecutionPipeline```, the "workflow" controllers that manage the order of operations once ```Execute()``` is called on a QueryExpression (assembling a SQL statement, executing the SQL statement, and mapping/converting rowset/scalar data).
* **SQL Connection Factory** (```ISqlConnectionFactory```) - creates instances of ```System.Data.IDbConnection```, which are used to create connections to the target database for SQL statement execution.
* **Connection String Factory** (```IConnectionStringFactory```) - provides connection strings as needed to connect to the target database.

Other services that aren't provided via a factory, but are resolved from the service provider as needed:
* **Appender** (```IAppender```) - used to write elements of a QueryExpression.  The default implementation of ```IAppender``` returns a ```StringBuilder``` backed implementation.
* **Parameter Builder** (```ISqlParameterBuilder```) - responsible for creating platform-specific SQL parameters.
* **SQL Statement Executor** (```ISqlStatementExecutor```) - executes SQL statements against a target database.

## Configuration Options

To replace a factory implementation, simply provide your implementation while providing runtime configuration.  For example, we'll provide our own implementation of an ```IAppender```:
```csharp
...
public class MemoryStreamAppender : IAppender
{
    private readonly MemoryStream stream = new MemoryStream();
    
    public void Write(string value)
    {
        //implementation of writing to the memory stream
    }
    
    //other methods from IAppender interface...
    ... 
}
...
```
To configure this factory:
```csharp
...
        services.AddDbExpression(
            dbex => dbex.AddDatabase<SimpleConsoleDb>(
                database => {
                    ...
                    database.SqlStatements.Assembly.StatementAppender.Use<MemoryStreamAppender>(); // <- dbExpression will use MemoryStreamAppenders to build SQL statements
                    ...
                }
            )
        );
...
```

While factories can be completely replaced with your own implementations, most of the default factories can be customized. Typically customization of a default implementation is far less effort than providing your own implementation.  
For example, if initialization of an entity *prior* to mapping values from the database is required, simply specify that with the runtime configuration of the default entity factory:  

```csharp
...
        services.AddDbExpression(
            dbex => dbex.AddDatabase<SimpleConsoleDb>(
                database => {
                    ...
                    database.Entities.Creation.ForEntityTypes(
                        configureEntityFactory => configureEntityFactory.ForEntityType<Person>(() => new Person { CreditLimit = 1000 })
                    );
                    ...
                }
            )
        );
...
```

Most configuration options provide access to the service provider.  The example above could be re-written as follows:
```csharp
...
        services.AddDbExpression(
            dbex => dbex.AddDatabase<SimpleConsoleDb>(
                database => {
                    ...
                    database.Entities.Creation.ForEntityTypes(
                        configureEntityFactory => configureEntityFactory.ForEntityType<Person>(sp => sp.GetRequiredService<IEntityFactory>().CreateEntity<Person>())
                    );
                    ...
                }
            )
        );
...
```

