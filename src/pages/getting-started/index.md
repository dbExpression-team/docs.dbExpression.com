---
title: Getting started with dbExpression
description: Installation and walk-thru on using dbExpression.
---

1. Create a Database and Console Application
2. Install dbExpression dotnet tool and NuGet packages
3. Scaffold code using dbExpression CLI tool
4. Configure your application
5. Execute a query

## 1. Create a Database and Console Application

Let's start by creating an empty database named *SimpleConsoleDb* and add a table named *Person*:
```sql
    CREATE TABLE [dbo].[Person](
    	[Id] INT IDENTITY(1,1) NOT NULL,
    	[FirstName] VARCHAR(100) NOT NULL,
    	[LastName] VARCHAR(100) NOT NULL,
    	[BirthDate] DATE NULL,
    	CONSTRAINT [PK_Person] PRIMARY KEY CLUSTERED ([Id]) 
    )
    GO
```
Next, we'll create a .NET 6.0 Console Application named *SimpleConsole*.

```bash
PS C:\> dotnet new console --framework net6.0 --name SimpleConsole
```

In the project root, add a file named *appsettings.json* and add a *ConnectionStrings* section with a connection string named *Default* with the value set to the connection string of the newly created *SimpleConsoleDb* database (your *Data Source* may be different):
```js
{
    "ConnectionStrings": {
        "Default": "Data Source=(LocalDB)\\MSSQLLocalDB;Initial Catalog=SimpleConsoleDb;Integrated Security=true"
    }
}
```
Ensure the *Copy to Output Directory* property of *appsettings.json* file is set to "Copy always" or "Copy if newer".

## 2. Install dbExpression dotnet tool and NuGet packages

### Install dotnet tool

Install the [dbExpression CLI tool](https://www.nuget.org/packages/HatTrick.DbEx.Tools) into the *global* space:
 
```bash
PM> dotnet tool install HatTrick.DbEx.Tools --global
```

### Install NuGet Packages

1. Install [Microsoft.Extensions.Configuration.Json](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.Json) package so the app can read from the *appsettings.json* file:
 
	```bash
	PM> Install-Package Microsoft.Extensions.Configuration.Json
	```

2. Install the [dbExpression Microsoft SQL Server](https://www.nuget.org/packages/HatTrick.DbEx.MsSql) package into your project:
 
	```bash
	PM> Install-Package HatTrick.DbEx.MsSql
	```
 

## 3. Scaffold code using dbExpression CLI tool

The dbExpression CLI tool is used to generate code providing the foundation or 'scaffolding' that enables query expression composition and query execution.  The dbExpression CLI tool connects to your target database to extract the schema model, validate basic configuration requirements, apply configured model overrides and generate code into your project.

### Preparing for Scaffold Generation

You will need a code generation configuration file (*dbex.config.json*) containing a valid connection string.  To get a basic *dbex.config.json* file, you can run the following dbExpression CLI command from your terminal:

```bash
PM> dbex makeconfig
```

> The `?` option provides usage instructions: `dbex makeconfig -?`

In the config file, change:
- the version (`source.platform.version`) to the version of your database, we're using 2019
- the `connectionString` value to the same value used in the *appsettings.json* file
- the `nullable` value to enable, disable, or simply remove the property
- the `rootNamespace` property to a value of *SimpleConsole*

Your configuration file should now resemble the following:

```js
{
    "nullable": "enable",
    "source": {
        "platform": {
            "key" : "MsSql",
            "version": "2019"
        },
        "connectionString": {
            "value": "Data Source=(LocalDB)\\MSSQLLocalDB;Initial Catalog=SimpleConsoleDb;Integrated Security=true"
        }
    },
    "rootNamespace": "SimpleConsole"
}
```

We'll use the default values for all other properties in the file to generate the scaffolding code.  Defaults can be overridden in the configuration file, see the [Scaffold Configuration](./core-concepts/configuration/scaffolding) topic to learn how to change default values and for other scaffolding topics.  Note the *optional* additional property named `nullable` (defaults to "disable") which indicates the scaffolded code should support the `nullable` language feature.

### Generate the Scaffold Code

Once you have the *dbex.config.json* file complete, run the dbExpression CLI `gen` command to generate the scaffolding.  By default, the generated scaffold code is placed within a directory named 'DbEx' directly within your current working directory.

```bash
PM> dbex gen
```

> The `-p` option can be used if your *dbex.config.json* file resides in a directory different from your current working directory: `dbex gen -p {path to dbex.config.json}`

## 4. Configure your application
dbExpression requires minimal application startup configuration to operate.  Configuration of a database for use in your application only requires a connection string so it can connect to your target database to execute SQL statements.

> The only *required* runtime configuration is the connection string of your database.

Replace the code in your `Program.cs` file in the *SimpleConsole* application with the following:
```csharp
using HatTrick.DbEx.MsSql.Configuration;
using HatTrick.DbEx.Sql;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimpleConsole.DataService;
using SimpleConsole.dboData;
using SimpleConsole.dboDataService;

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
With this, startup creates a `ServiceCollection` to register required `dbExpression` services for the  *SimpleConsoleDb* database.  dbExpression is configured to execute SQL statements against Microsoft SQL Server version 2019 (the values from *source.platform* in the dbex.config.json file) and will use the connection string named 'Default' from the *appsettings.json* file.

Typically for dbExpression startup configuration, you'll need these using statements:
* `Microsoft.Extensions.Configuration` - to read configuration files.
* `Microsoft.Extensions.DependencyInjection` - namepace containing the `AddDbExpression()` extension method to register database services.
* `HatTrick.DbEx.MsSql.Configuration` - enables fluent configuration of dbExpression for use with one or more Microsoft SQL Server databases.
* `SimpleConsole.DataService` - the namespace (created through scaffolding) that contains the *database accessor* to fluently build queries for the *SimpleConsoleDb* database.
* `SimpleConsole.dboData` - the namespace (created through scaffolding) containing the entities representing the tables and views in the *dbo* schema in the database (your scaffolded code in this namespace should contain a single entity - *Person*).
* `SimpleConsole.dboDataService` - the namespace (created through scaffolding) that contains all *schema accessor* classes to fluently build queries for entities in the *dbo* schema.

And to use use a static database accessor (we're using it for this walk-thru):
* `HatTrick.DbEx.Sql` - namespace containing the `UseStaticRuntimeFor<T>()` extension method, which opts-in to using `dbExpression` statically.

See the [Runtime Configuration](/configuration/runtime) section for instructions and usage examples of all runtime configuration options.

## 5. Execute a Query

Let's provide some additional code after the existing configuration code to insert and select from the *Person* table:
```csharp
using HatTrick.DbEx.MsSql.Configuration;
using HatTrick.DbEx.Sql;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SimpleConsole.DataService;
using SimpleConsole.dboData;
using SimpleConsole.dboDataService;

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

//initialize a Person entity with attributes of Charlie Brown
Person person = new()
{
    FirstName = "Charlie",
    LastName = "Brown",
    BirthDate = new DateTime(1959, 6, 15)
};

//add Charlie Brown to the SimpleConsoleDb database
db.Insert(person)
    .Into(dbo.Person)
    .Execute();

//read Charlie Brown from the database
Person? charlieBrown = db.SelectOne<Person>()
    .From(dbo.Person)
    .Where(dbo.Person.Id == person.Id)
    .Execute();

if (charlieBrown is null)
{
    Console.WriteLine($"Uh-oh!, {person.FirstName} {person.LastName} was not found.");
}
else
{
    Console.WriteLine($"{charlieBrown.FirstName} {charlieBrown.LastName} was born on {charlieBrown.BirthDate?.ToShortDateString()}.");
}

Console.Read();
```

First, execution of the `db.Insert` will add "Charlie Brown" to the *Person* table in the *SimpleConsoleDb* database.
  Second, execution of the `db.SelectOne<Person>` will fetch a record from the database using the `Id` that was set 
on the `Person` entity after the insert.  The fetched record should be "Charlie Brown's" data that was just inserted.  
The `db.SelectOne<Person>` will also map the single row return from the database to an instance of a `Person` entity,
the variable `charlieBrown`.

Now run the application, and you should see the following from `Console.WriteLine`:
```csharp
Charlie Brown was born on 6/15/1959.
```

You have successfully written and executed a couple of queries using dbExpression!

## Core Concepts

We'll cover a couple of other high-level features of dbExpression, and then move to the next section of the docs which cover the core concepts 
of dbExpression (with full examples).  To follow along and run the query examples on your own, 
we'll assume the existence of scaffolding code generated with the dbExpression CLI tool.  To build a local copy of the database:
* Create an empty database named *MsSqlDbExTest* (you can call it anything you like, just change the script file references) and build schema with the [script file in the GitHub repo](https://github.com/HatTrickLabs/dbExpression/blob/master/test/HatTrick.DbEx.MsSql.Test.Integration/schema.sql).
* Load the database with data using the [script file in the GitHub repo](https://github.com/HatTrickLabs/dbExpression/blob/master/test/HatTrick.DbEx.MsSql.Test.Integration/data.sql). 
* Add some images (binary data) to the database using the [script file in the GitHub repo](https://github.com/HatTrickLabs/dbExpression/blob/master/test/HatTrick.DbEx.MsSql.Test.Integration/images.sql).

If you download/clone the sample projects to run locally:
* All projects target .NET 6.0
* Visual Studio 2022 or higher is required
* All projects are configured to opt-in to the nullable feature (although not required to use dbExpression)