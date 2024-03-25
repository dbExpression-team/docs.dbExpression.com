---
title: Scaffolding
---

dbExpression scaffolding is a code generation process initiated via the dbExpression dotnet CLI tool.  The scaffolding process generates 
a static model that provides the foundation, or 'scaffolding', required to compose and execute queries for a specific version of Microsoft SQL Server.  

Provided a simple json config file, the `dbex gen` command of the CLI tool does the following:
* Connects to your target database
* Extracts the full schema model
* Validates basic configuration requirements
* Applies configured model overrides 
* Generates code files (the static model of the target database) into your project

## Example Configuration File
The following is an example *dbex.config.json* file (there may be more here than you will ever need):
```json
{
    "source": {
        "platform": {
            "key" : "MsSql",
            "version": "2019"
        },
        "connectionString": {
            "value": "server=localhost;initial catalog=SampleDatabase;integrated security=true"
        }
    },
    "workingDirectory": "./",
    "outputDirectory": "./Generated",
    "rootNamespace": "Sample",
    "databaseAccessor": "db",
    "languageFeatures" : {
        "nullable": "disable"
    },
    "enums": [
        "Sample.Data.AddressType"
    ],
    "overrides": [
        {
            "apply": {
                "ignore": true,
                "to": {
                    "path": "dbo.sysdiagrams"
                }
            }
        }, 
        {
            "apply": {
                "clrType": "Sample.Data.AddressType",
                "to": {
                    "path": "dbo.Address.AddressType"
                }
            }
        }
    ]
}
```
> The [Reference section on scaffold configuration](../../reference/configuration/scaffolding/object-overrides) details the properties of the configuration file 
and how to use them.

See other sample `dbex.config.json` files in the sample projects included in the dbExpression repository:
* [console application](https://github.com/dbexpression-team/dbexpression/tree/master/samples/mssql/NetCoreConsoleApp/dbex.config.json)
* [server side blazor application](https://github.com/dbexpression-team/dbexpression/tree/master/samples/mssql/ServerSideBlazorApp/dbex.config.json)
