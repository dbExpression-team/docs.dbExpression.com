---
title: Logging
---

dbExpression supports the logging abstractions provided in [Microsoft's logging framework](https://docs.microsoft.com/en-us/dotnet/core/extensions/logging?tabs=command-line).  
A few dbExpression services support ```ILogger```, where an instance of ```ILogger``` is injected into the service.

dbExpression generally logs as follows for the different log levels:
- ```Trace```: emits low-level messages that help resolve any issues you may be having with dbExpression.  As recommended just about everywhere, do not use this level in production.
- ```Debug```: dbExpression only emits rendered sql statements prior to execution against the database.
- ```Info```: at application startup, dbExpression will emit a message for each configured database noting that the database is ready for use.  If the database was configured to be used statically, an additional message will be emitted indicating so.
- ```Warn```, ```Error```, and ```Critical```: dbExpression does not emit any log messages, in these cases exceptions will be thrown and it is up to you to log messages.

> It is highly recommended to turn dbExpression logging "off" in production and use it solely while developing your application.

Through the [runtime configuration](/configuration/runtime) of a database with dbExpression, logging settings can be set indicating whether to emit parameter values to logs.  By default, this value is false and no parameter values will be emitted to logs.  Parameter logging is an opt-in feature.

> By default, dbExpression will **not** log parameter values to logs.

In the following, logging is configured via addition to the service collectioin.  ```MyOtherDatabase``` does not contain any sensitive data, so it is configured to allow logging of parameter values.  ```MyDatabase``` will log messages, but will not log parameter values.

```csharp
...
services.AddLogging(builder =>
    {
        builder.ClearProviders();
        builder.AddConsole();
        builder.SetMinimumLevel(LogLevel.Debug);
    });
...

services.AddDbExpression(
    dbex => dbex.AddMDatabase<MyDatabase>(database => database.ConnectionString.Use(config.GetConnectionString("MyDatabase"))),
    dbex => dbex.AddDatabase<MyOtherDatabase>(database =>
        {
            database.ConnectionString.Use(config.GetConnectionString("MyOtherDatabase"));
            database.Logging.ConfigureLoggingSettings(l => l.LogParameterValues = true); // <- safe to log parameter values
        }
    );
);

...
```

With this, both databases will emit debug (and higher) level messages to the logger.  To "turn off" logging in dbExpression, a filter needs to be added to the ```AddLogging(...)``` method:

```csharp
services.AddLogging(builder =>
    {
        builder.ClearProviders();
        builder.AddConsole();
        builder.SetMinimumLevel(LogLevel.Debug);
        builder.AddFilter("HatTrick.DbEx.*", level => false);
    });
```
dbExpression will still emit the ```Info``` messsages at application startup.