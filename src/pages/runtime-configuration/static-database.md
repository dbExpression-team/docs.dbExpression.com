---
title: Static use of dbExpression
---

> By default, a database configured with dbExpression does not work statically - additional runtime configuration is *required* to use the database statically

By default, dbExpression uses dependency injection to resolve an instance of a database.  To use dbExpression statically, additional configuration is required.  Using the ```MyDatabase``` example from above, let's configure it to work statically.  
For ASP.NET, use the ```UseStaticRuntimeFor<T>()``` extension method on ```IApplicationBuilder```, and for other project types, use the ```UseStaticRuntimeFor<T>()``` extension method on ```IServiceProvider```.  
An example in a ```Startup.cs``` class for an ASP.NET project;

```csharp

public void ConfigureServices(IServiceCollection services)
{
    ...
    services.AddDbExpression(
        dbex => dbex.AddMDatabase<MyDatabase>(database => database.ConnectionString.Use(config.GetConnectionString("MyDatabase")))
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

Now ```MyDatabase``` can be used statically in  ```CustomerService``` (or anywhere else):

```csharp
...

public class CustomerService
{
    public async Task<IList<Customer>> GetCustomersAsync(int offset, int limit)
    {
        return await db.SelectMany<Customer>() // <- db is used statically, note the removal of the constructor
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

For an example on configuring dbExpression for use statically in a console application, see the [sample console application](https://github.com/HatTrickLabs/dbExpression/blob/master/samples/mssql/NetCoreConsoleApp/Program.cs).

Let's walk through a few examples.

Two databases are configured for use with dbExpression via ```services.AddDbExpression(...)```.  For ```MyDatabase```, the ```MyBooleanValueConverter``` is registered in the ```MyDatabase``` service collection (```MyDatabase``` stores boolean values as strings - "T" and "F" instead of 1 and 0 - and the ```MyBooleanConverter``` manages this conversion).

```csharp
using HatTrick.DbEx.MsSql.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MyDatabase.DataService;
using MyOtherDatabase.DataService;

...

services.AddDbExpression(
    dbex => dbex.AddDatabase<MyDatabase>(database => 
        {
            database.ConnectionString.Use(config.GetConnectionString("MyDatabase"));
            database.Conversions.ForTypes(x => x.ForValueType<bool>().Use<MyBooleanValueConverter>());
        }
    ),
    dbex => dbex.AddDatabase<MyOtherDatabase>(database => database.ConnectionString.Use(config.GetConnectionString("MyOtherDatabase")))
);

...
```

The ```MyBooleanValueConverter``` is a database-specific service, and can **only** be registered/used with the ```MyDatabase``` database.

Let's continue with an example of changing the query expression factory to always return a custom query expression type for *UPDATE* operations.  The following query expression derives from ```UpdateQueryExpression``` and adds a ```Principal``` propert to the expression (for use with events, etc):

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

This factory can then be registered for use with ```MyDatabase```:

```csharp
...
    services.AddSingleton<IQueryExpressionFactory,AuthenticatedQueryExpressionFactory>();
    
    services.AddDbExpression(
        dbex => dbex.AddDatabase<MyDatabase>(database => 
            {
                database.ConnectionString.Use(config.GetConnectionString("MyDatabase"));
                database.QueryExpressions.Use<AuthenticatedQueryExpressionFactory>();
            }
        ),
        dbex => dbex.AddDatabase<MyOtherDatabase>(database => database.ConnectionString.Use(config.GetConnectionString("MyOtherDatabase")))
    );
...
```

Now, all QueryExpressions for *UPDATE* operations in ```MyDatabase``` will be backed by an instance of your custom ```AuthenticatedUpdateQueryExpression```.

To use the factory with both the ```MyDatabase``` and ```MyOtherDatabase``` databases, include the registration for the service in the configuration of both databases:
```csharp
...
    services.AddSingleton<IQueryExpressionFactory,AuthenticatedQueryExpressionFactory>();

    services.AddDbExpression(
        dbex => dbex.AddDatabase<MyDatabase>(database =>
            {
                database.ConnectionString.Use(config.GetConnectionString("MyDatabase"));
                database.QueryExpressions.Use<AuthenticatedQueryExpressionFactory>();
            }
        ),
        dbex => dbex.AddDatabase<MyOtherDatabase>(database =>
            {
                database.ConnectionString.Use(config.GetConnectionString("MyOtherDatabase"));
                database.QueryExpressions.Use<AuthenticatedQueryExpressionFactory>();
            }
        )
    );
...
```