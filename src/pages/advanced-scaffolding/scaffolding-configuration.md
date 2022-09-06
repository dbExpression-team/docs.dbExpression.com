---
title: Scaffolding Configuration
---

dbExpression scaffolding is a code generation process with the dbExpression dotnet CLI tool.  The scaffolding process generates a thin layer of code that provides the foundation, or 'scaffolding', required to compose and execute QueryExpressions.  Provided a simple json config file, the ```dbex gen``` command of the CLI tool does the following:
* Connects to your target database
* Extracts the full schema model
* Validates basic configuration requirements
* Applies configured model overrides 
* Generates the source code scaffolding into your target project

## Example Configuration File
The following is an example *dbex.config.json* file (there may be more here than you will ever need):
```js
{
    "source": {
        "type": "MsSqlDb",
        "connectionString": {
            "value": "server=localhost;initial catalog=SampleDatabase;integrated security=true"
        }
    },
    "workingDirectory": "./",
    "outputDirectory": "./Generated",
    "rootNamespace": "Sample",
    "nullable": "disable",
    "enums": [
        "Sample.Data.AddressType"
    ],
    "overrides": [{
            "apply": {
                "ignore": true,
                "to": {
                    "path": "dbo.sysdiagrams"
                }
            }
        }, {
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


See other sample *dbex.config.json* files in the sample projects included within the dbExpression repository:
* [console application](https://github.com/HatTrickLabs/dbExpression/tree/master/samples/mssql/NetCoreConsoleApp/dbex.config.json)
* [server side blazor application](https://github.com/HatTrickLabs/dbExpression/tree/master/samples/mssql/ServerSideBlazorApp/dbex.config.json)

## Working Directory
The *workingDirectory* setting allows you to override your actual working directory context for code generation.  This configuration setting is optional and will default to the actual working directory of the command line or shell from which the generation process is executed.  The value can be absolute (fully qualified) or relative.  If a relative path is used, the path is relative to the dbex.config.json file.  Providing ``` "workingDirectory": "./" ``` would shift the working directory to the same path as the json configuration file.

## Output Directory
The *outputDirectory* setting controls the output path of the generated code.  The value can be absolute (fully qualified) or relative to the current working directory.  If the provided path does not exist the tool will attempt to create the directory for you.  This configuration setting is optional and will default to *{workingDirectory}/DbEx* if not provided.

## Root Namespace
The *rootNamespace* setting controls the root namespace of the generated code.  This setting is optional and defaults to *DbEx* if not provided.

## Nullable
The *nullable* setting controls if the generated code supports the C# language feature of nullable reference types.  This setting is optional and defaults to *disable* if not provided.  Valid values are *enable* and *disable*.

## Enum Declaration
The *enums* setting is an array of string values containing the fully qualified names of all enumerations you intend to use as clrType overrides for column to property mapping. Enumeration typed properties require special treatment and must be known when scaffolding code.
