---
title: Runtime
---

dbExpression can operate "out of the box" using default implementations of factories/services.  The only *required* runtime configuration is a connection string. 

Using runtime configuration, you can tailor dbExpression's runtime environment to your application's needs.  dbExpression exposes a fluent builder 
for configuring the runtime environment for one or more databases.  Use this configuration builder in the startup of your application, typically 
in `Startup.cs` or `Program.cs`.

An example of the most basic runtime configuration in a console application:
```csharp
services.AddDbExpression(
    dbex => dbex.AddDatabase<MyDatabase>(
        db => db.ConnectionString.Use(Configuration.GetConnectionString("Default"))
    )
);
```

The runtime configuration uses the extension method `AddDbExpression` to begin configuration of dbExpression. Runtime configuration for the database type `MyDatabase` is performed in the
delegate, specifically using the method `AddDatabase`. The delegate instructs dbExpression to use the connection string named "Default" provided from `Configuration`.

With this runtime configuration, dbExpression is now ready to assemble and execute SQL statements against the database.

## Configuration Builder
The configuration builder generally categorizes configuration options into areas that are similar in operation:
* **Query Expressions** - The factories/services responsible for creating a `QueryExpression` which is used to fluently build queries.
* **Sql Statement Assembly** - When `Execute` or `ExecuteAsync` are invoked on a query, the `QueryExpression` is assembled into a SQL statement ready for execution against the target database.
* **Sql Statement Execution** - The SQL statement is executed against the database, and any returned data is converted and mapped to the requested return types.

> By default, dbExpression uses Microsoft SQL Server version specific services to work with supported versions of Microsoft SQL Server.

### Query Expressions

The configuration builder enables configuration of factory options for providing a `QueryExpression` for fluently building a SQL statement.

An example of providing a different `QueryExpression` type to be used with `Select` and `SelectMany`:

```csharp
services.AddDbExpression(
    dbex => 
        dbex.AddDatabase<MyDatabase>(
            db => db.QueryExpressions.ForQueryTypes(
                c => c.ForSelect().Use<MySelectQueryExpression>()
            )
        )
    );
```

Let's continue with an example of changing the query expression factory to always return a custom query expression type for *UPDATE* operations.  The following query expression derives from `UpdateQueryExpression` and adds a `Principal` property to the expression (for use with events, etc):

```csharp
public class AuthenticatedUpdateQueryExpression : UpdateQueryExpression
{
    public ClaimsPrincipal Principal { get; set; }
}
```
and the factory to create instances:
```csharp
public class AuthenticatedQueryExpressionFactory : QueryExpressionFactory
{
    public override T CreateQueryExpression<T>()
    {
        if (typeof(T) == typeof(UpdateQueryExpression))
        {
            //some valid context accessor, this is used solely for demonstration
            return new AuthenticatedUpdateQueryExpression { Principal = HttpContext.User };
        }

        return base.CreateQueryExpression<T>();
    }
}
```

### Sql Statement Assembly

The configuration builder enables configuration of services for assembling a `QueryExpression` into a SQL statement.  These configuration options for assembling a SQL statement
fall into one of the following areas:
* `SqlStatements.Assembly.StatementAppender`
* `SqlStatements.Assembly.ElementAppender`
* `SqlStatements.Assembly.ParameterBuilder`
* `SqlStatements.Assembly.StatementBuilder`
* `SqlStatements.Assembly.ConfigureAssemblyOptions`

An example of using these properties to configure assembly-related factories/services:

```csharp
services.AddDbExpression(
    dbex => dbex.AddDatabase<MyDatabase>(
        db =>
            {
                db.SqlStatements.Assembly
                    .StatementAppender.Use<MyStatementAppender>();
                    .ElementAppender.Use<MyElementAppender>();
                    .ParameterBuilder.Use<MyParameterBuilder>();
                    .StatementBuilder.Use<MyStatementBuilder>();
                    .ConfigureAssemblyOptions(options => options.PrependCommmaOnSelectClause = true);
            }
        )    
    );
```

### Sql Statement Execution

The configuration builder enables configuration of services for executing a a SQL statement.  These configuration options for executing a SQL statement
fall into one of the following areas:
* `ConnectionString`
* `Conversions`
* `Entities`
* `Events`

An example of using these properties to configure execution-related factories/services:

```csharp
services.AddDbExpression(
    dbex => dbex.AddDatabase<MyDatabase>(
        db =>
            {
                db.ConnectionString
                    .Use(CConfiguration.GetConnectionString("MyDatabase"));

                db.Conversions.ForTypes(t => t.ForValueType<decimal>()
                    .Use<MyDecimalConverter>());

                db.Entities.Creation.ForEntityTypes(
                        configure => configure
                            .ForEntityType<Person>(() => 
                                new Person 
                                { 
                                    CreditLimit = 1000 
                                }
                            )
                    );

                db.Events.OnAfterSelectQueryExecution(c => logger.LogDebug("Executed a SELECT query."));
            }
        )    
    );
```

### Logging

The configuration builder enables configuration of logging SQL statements (see [Logging](../utilities/logging)):
* `ConfigureLoggingOptions`

An example of configuring logging settings:

```csharp
services.AddDbExpression(
    dbex => dbex.AddDatabase<MyDatabase>(
        db => db.Logging.ConfigureLoggingOptions(
                logging => logging.LogParameterValues = true
            )
        )    
    );
```

## Dependency Injection

dbExpression uses [Microsoft's Dependency Injection](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection) 
framework for internal service resolution.  Every database configured for use with dbExpression has it's own Service Collection - other 
dependency injection frameworks refer to these as "child containers".  All runtime configuration service replacements 
(discussed above) are registered in the database-specific Service Collection.

> Use of dependency injection in your application is *optional*.

dbExpression supports service registration directly in your application's Service Collection in addition to the database-specific Service
Collections.  Any dbExpression service that is registered directly with the application's Service Collection will be *globally* used by dbExpression,
unless a different registration is provided with a database; i.e. dbExpression tries to resolve services from the database-specific Service Collection,
and falls back to the application's Service Collection if no service is resolved.

> dbExpression resolves services from the database-specific Service Collection,
and falls back to the application's Service Collection if no service is resolved.

To use dbExpression in an application using dependency injection, simply provide a constructor argument (typed as your database type) 
in your dependent service.

For example, a configured instance of `MyDatabase` is injected into `CustomerService` and is ready to execute queries:

```csharp
...

public class CustomerService
{
    private readonly MyDatabase db;
    
    public CustomerService(MyDatabase db) // <- CustomerService depends on MyDatabase
    {
        this.db = db ?? throw new ArgumentNullException(nameof(db));
    }
    
    public async Task<IEnumerable<Customer>> GetCustomersAsync(int offset, int limit)
    {
        return await db.SelectMany<Customer>() // <- db is an instance of MyDatabase
            .From(dbo.Customer)
            .OrderBy(
                dbo.Customer.LastName, 
                dbo.Customer.FirstName
            )
            .Offset(offset)
            .Limit(limit)
            .ExecuteAsync();
    }
}

...
```

## Static use of dbExpression

> By default, a database does not work statically with dbExpression.  Additional runtime configuration is *required* to use the database statically.

By default, dbExpression uses dependency injection to resolve an instance of a database.  To use dbExpression statically, additional configuration is required.  
Using the `MyDatabase` example from above, let's configure it to work statically.  For ASP.NET, use the `UseStaticRuntimeFor<T>()` extension method on `IApplicationBuilder` 
(available in the [HatTrick.DbEx.MsSql.Extensions.DependencyInjection](https://www.nuget.org/packages/HatTrick.DbEx.MsSql.Extensions.DependencyInjection) NuGet package), 
and for other project types, use the `UseStaticRuntimeFor<T>()` extension method on `IServiceProvider`.

An example in a `Startup.cs` class for an ASP.NET project;

```csharp

public void ConfigureServices(IServiceCollection services)
{
    ...
    services.AddDbExpression(
        dbex => dbex.AddMDatabase<MyDatabase>(db => db.ConnectionString.Use(config.GetConnectionString("MyDatabase")))
    );
    ...
}

public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    ...
    app.UseStaticRuntimeFor<MyDatabase>(); // <- specifically configure MyDatabase to be used statically
    ...
}
```

Now `MyDatabase` can be used statically in  `CustomerService` (or anywhere else):

```csharp
...

public class CustomerService
{
    public CustomerService() // <- no constructor args
    { 
        
    }

    public async Task<IEnumerable<Customer>> GetCustomersAsync(int offset, int limit)
    {
        return await db.SelectMany<Customer>() // <- using a static accessor for your database
            .From(dbo.Customer)
            .OrderBy(
                dbo.Customer.LastName, 
                dbo.Customer.FirstName
            )
            .Offset(offset)
            .Limit(limit)
            .ExecuteAsync();
    }
}

...
```

For another example on configuring dbExpression for use statically in a console application, see the [sample console application](https://github.com/dbexpression-team/dbexpression/blob/master/samples/mssql/NetCoreConsoleApp/Program.cs).