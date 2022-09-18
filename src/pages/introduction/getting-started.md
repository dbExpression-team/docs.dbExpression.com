---
pageTitle: Up and running with dbExpression in 10 minutes
title: Up and running with dbExpression in 10 minutes
description: Installation and walk-thru on using dbExpression.
---

1. Create a Database and Console Application
2. Install dotnet tool and NuGet packages
3. Scaffold code using dbExpression CLI tool
4. Configure your application
5. Execute a query

## Create a Database and Console Application

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
Next, create a .NET Console Application named *SimpleConsole*.

In the project root, add a file named *appsettings.json* and add a *ConnectionStrings* section with a connection string named *Default* with the value set to the connection string of the newly created *SimpleConsoleDb* database (your *Data Source* may be different):
```js
{
    "ConnectionStrings": {
        "Default": "Data Source=(LocalDB)\\MSSQLLocalDB;Initial Catalog=SimpleConsoleDb;Integrated Security=true"
    }
}
```
Ensure the ***Copy to Output Directory* property of *appsettings.json*** file is set to "Copy always" or "Copy if newer".

## Install dbExpression dotnet tool
Install the [dbExpression CLI tool](https://www.nuget.org/packages/HatTrick.DbEx.Tools) into the *global* space:
 
```bash
PM> dotnet tool install HatTrick.DbEx.Tools --global
```

## Install NuGet Packages
1. Install [Microsoft.Extensions.Configuration.Json](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.Json) package so the app can read from the *appsettings.json* file:
 
	```bash
	PM> Install-Package Microsoft.Extensions.Configuration.Json
	```

2. Install [Microsoft.Extensions.DependencyInjection](https://www.nuget.org/packages/Microsoft.Extensions.DependencyInjection) package so dbExpression has a service collection/provider for its services:
 
	```bash
	PM> Install-Package Microsoft.Extensions.DependencyInjection
	```
    
3. Install the [dbExpression Microsoft SQL Server](https://www.nuget.org/packages/HatTrick.DbEx.MsSql) package into your project:
 
	```bash
	PM> Install-Package HatTrick.DbEx.MsSql
	```
 

## Scaffolding
The dbExpression CLI tool is used to generate code providing the foundation or 'scaffolding' that enables query expression composition and query execution.  The dbExpression CLI tool connects to your target database to extract the schema model, validate basic configuration requirements, apply configured model overrides and generate code into your project.

### Preparing for Scaffold Generation
You will need a code generation configuration file *dbex.config.json* containing a valid connection string.  To get a basic *dbex.config.json* file, you can run the following dbExpression CLI command from your terminal:

```bash
PM> dbex makeconfig
```

> The ```?``` option provides usage instructions: ```dbex makeconfig -?```

Change the ```rootNamespace``` property to a value of *SimpleConsole* and set the *connectionString* value to the same value used in the *appsettings.json* file.  Your configuration file should now resemble the following:

```js
{
    "rootNamespace": "SimpleConsole",
    "source": {
        "platform": {
            "key" : "MsSql",
            "version": "2019"
        },
        "connectionString": {
            "value": "Data Source=(LocalDB)\\MSSQLLocalDB;Initial Catalog=SimpleConsoleDb;Integrated Security=true"
        }
    },
    "nullable": "enable"
}
```

Default values will be used to generate the scaffolding code.  Defaults can be overridden in the configuration file, see the [Scaffold Configuration](/configuration/scaffolding) topic to learn how to change default values and for other scaffolding topics.  Note the *optional* additional property named ```nullable``` (defaults to "disable") which indicates the scaffolded code should support the ```nullable``` language feature.

### Generate the Scaffold Code
Once you have the *dbex.config.json* file, run the dbExpression CLI ```gen``` command to generate the scaffolding.  By default, the generated scaffold code is placed within a directory named 'DbEx' directly within your current working directory.

```bash
PM> dbex gen
```

> The ```-p``` option can be used if your *dbex.config.json* file resides in a directory different from your current working directory: ```dbex gen -p {path to dbex.config.json}```

## How does dbExpression use the generated code?
dbExpression uses the scaffolded code to enable fluent composition of SQL queries specific to your application's domain.  Some dbExpression nomenclature we'll use throughout the docs:

* **Database Accessor** - The root accessor class for building SQL queries.
* **Query Type** - The type of query executed against the database (methods correlate to one of SELECT, INSERT, UPDATE, DELETE, or Stored Procedure).
* **Entities** - Data package classes (plain old class objects) that represent the tables and views within your target database.
* **Schema Accessors** - Classes that represent each schema in your target database.
* **Entity Accessors** - Classes that represent the tables and views within each of your schemas.
* **Field Accessors** - Classes that represent the columns within each of your tables and views.
* **QueryExpression** - A compile-time expression that represents a query for execution against the target database.  Here's the anatomy of a QueryExpression:

![Expression Composition](https://dbexpressionpublic.blob.core.windows.net/docs/query-expression-composition.png)

A few more and we're ready to configure your application and write some queries:

* **Expression element** - The abstract parts that are stitched together using fluent builders to form a complete QueryExpression.  You'll see these via Intellisense when building QueryExpressions.  They have types like ```AnyElement```, which is just about anything, and ```AnyElement<int>``` which is anything typed as an ```int```; for example the integer result of a database function, integer arithmetic, or a database column typed as an *INT*.  All .NET CLR primitives have a corresponding expression element type (plus strings and byte arrays).
* **SQL statement** - A QueryExpression rendered as a string for execution against a target database.
* **Execution Pipeline** - Manages the process of assembling a QueryExpression into a SQL statement, executing against the target database, and optionally managing/mapping any returned rowset data.

## Configure your application
dbExpression requires minimal application startup configuration to operate.  Configuration of a database for use in your application only requires a connection string so it can connect to your target database to execute SQL statements.

> The only *required* runtime configuration is the connection string of your database.

Replace the code in your ```Program.cs``` file in the *SimpleConsole* application with the following:
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
With this, startup creates a ```ServiceCollection``` to register required ```dbExpression``` services for the  *SimpleConsoleDb* database.  dbExpression is configured to execute SQL statements against Microsoft SQL Server version 2019 (the values from *source.platform* in the dbex.config.json file) and will use the connection string named 'Default' from the *appsettings.json* file.

Typically for dbExpression startup configuration, you'll need these using statements:
* ```Microsoft.Extensions.Configuration``` - to read configuration files.
* ```Microsoft.Extensions.DependencyInjection``` - namepace containing the ```AddDbExpression()``` extension method to register database services.
* ```HatTrick.DbEx.MsSql.Configuration``` - enables fluent configuration of dbExpression for use with one or more Microsoft SQL Server databases.
* ```SimpleConsole.DataService``` - the namespace (created through scaffolding) that contains the *database accessor* to fluently build QueryExpressions for the *SimpleConsoleDb* database.
* ```SimpleConsole.dboData``` - the namespace (created through scaffolding) containing the entities representing the tables and views in the *dbo* schema in the database (your scaffolded code in this namespace should contain a single entity - *Person*).
* ```SimpleConsole.dboDataService``` - the namespace (created through scaffolding) that contains all *schema accessor* classes to fluently build QueryExpressions for entities in the *dbo* schema.

And to use use a static database accessor (we're using it for this walk-thru):
* ```HatTrick.DbEx.Sql``` - namespace containing the ```UseStaticRuntimeFor<T>()``` extension method, which opts-in to using ```dbExpression``` statically.

See the [Runtime Configuration](/configuration/runtime) section for instructions and usage examples of all runtime configuration options.

## Execute a Query
To execute a QueryExpression, simply add the ```Execute``` or ```ExecuteAsync``` method to the QueryExpression:

![Expression Execution](https://dbexpressionpublic.blob.core.windows.net/docs/query-expression-execution.png)

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

First, execution of the ```db.Insert``` will add "Charlie Brown" to the *Person* table in the *SimpleConsoleDb* database.
  Second, execution of the ```db.SelectOne<Person>``` will fetch a record from the database using the ```Id``` that was set 
on the ```Person``` entity after the insert.  The fetched record should be "Charlie Brown's" data that was just inserted.  
The ```db.SelectOne<Person>``` will also map the single row return from the database to an instance of a ```Person``` entity,
the variable ```charlieBrown```.

Now run the application, and you should see the following from ```Console.WriteLine```:
```csharp
Charlie Brown was born on 6/15/1959.
```

You have successfully written and executed a couple of queries using dbExpression!  Refer back to this section at any time and adapt these steps to your environment to start using dbExpression.

## Examples in the Docs
The examples throughout the remainder of this documentation assume:
* The existence of scaffolding code generated with the dbExpression CLI tool.  To build a local copy of the database and follow along with the examples:
    * Create an empty database named *MsSqlDbExTest* and build schema with the [script file in the GitHub repo](/HatTrickLabs/dbExpression/blob/master/test/HatTrick.DbEx.MsSql.Test.Database/schema.sql).
    * Load the database with data using the [script file in the GitHub repo](/HatTrickLabs/dbExpression/blob/master/test/HatTrick.DbEx.MsSql.Test.Database/data.sql). 
    * Add some images (binary data) to the database using the [script file in the GitHub repo](/HatTrickLabs/dbExpression/blob/master/test/HatTrick.DbEx.MsSql.Test.Database/images.sql).
* Please note if you plan to download the sample projects to run locally:
    * All projects target .NET 6.0
    * Visual Studio 2022 or higher is required
    * All projects are configured to opt-in to nullable feature (although not required to use dbExpression)