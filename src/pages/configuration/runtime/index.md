---
title: Configuration
---

dbExpression can operate "out of the box" using default implementations of factories/services.  The only *required* runtime configuration is a connection string.  But, you
can use runtime configuration to tailor dbExpression to your application's needs.  dbExpression configuration is performed in the startup of your application, typically in ```Startup.cs``` or ```Program.cs```.

> By default, dbExpression uses Microsoft SQL Server version specific services to work with supported versions of Microsoft SQL Server.

An example of the most basic startup configuration in a console application:
```csharp
using HatTrick.DbEx.MsSql.Configuration;
using HatTrick.DbEx.Sql;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimpleConsole.DataService;

#nullable enable

var config = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
    .Build();

var services = new ServiceCollection();
services.AddDbExpression(
    dbex => dbex.AddDatabase<SimpleConsoleDb>(
        database => database.ConnectionString.Use(config.GetConnectionString("Default"))
    )
);
var provider = services.BuildServiceProvider();
provider.UseStaticRuntimeFor<SimpleConsoleDb>();
```
This example requires references to the Microsoft NuGet packages
* [Microsoft.Extensions.Configuration](https://www.nuget.org/packages/Microsoft.Extensions.Configuration)
* [Microsoft.Extensions.Configuration.Json](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.Json)
* [Microsoft.Extensions.DependencyInjection](https://www.nuget.org/packages/Microsoft.Extensions.DependencyInjection).

We've included using statements for the required namespaces:
* ```HatTrick.DbEx.Sql``` [Optional] - dbExpression extension method that enables you to opt-in to using ```dbExpression``` statically (```UseStaticRuntimeFor<T>```).
* ```HatTrick.DbEx.MsSql.Configuration``` - namespace containing extension methods for configuring Microsoft SQL Server databases for use with dbExpression (```AddDatabase<T>```).
* ```SimpleConsole.DataService``` - the namespace containing the (scaffolded) database ```SimpleConsoleDb```.

The configuration uses the extension method ```AddDbExpression``` to configure a database for use with Microsoft SQL Server (```AddDatabase```).  The ```SimpleConsoleDb``` database 
(the type name that is the name of your database or the value provided as an override for the database name) in scaffolded code is configured via the provided delegate (```Action``` delegate named ```database```).  The 
delegate instructs dbExpression to use the connection string named "Default" from the ```appsettings.json``` file:
```json
{
    "ConnectionStrings": {
        "Default": "Data Source=(LocalDB)\\MSSQLLocalDB;Initial Catalog=SimpleConsoleDb;Integrated Security=true"
    }
}
```

dbExpression is now ready to assemble and execute SQL statements against the target database.