---
title: General Options
---

The following pseudo-json shows the various general properties available in the scaffold configuration file:

```json
{
   "source": {
        "platform" : {
            "key": "{key}",
            "version": "{version}"
        }
   },
   "rootNamespace": "{rootNamespace}",
   "outputDirectory": "{outputDirectory}",
   "workingDirectory": "{workingDirectory}"
}
```

## source
The `source` option specifies the database platform and version the code generation process will use while generating scaffolding.  dbExpression
uses version specific services by default, so it is important to use the correct value for version.

> dbExpression uses version specific services, so it is important to use the correct version of Microsoft SQL Server.

### source.platform.key
Indicates the database platform.  Currently, the only supported value is `MsSql`.
{% table %}
---
* Data type
* `string`
---
* Default value
* `null`
---
* Valid values
* `MsSql` (Microsoft SQL Server)
{% /table %}
{% accordian caption="syntax examples" %}
The following will scaffold code specific to Microsoft SQL Server 2019:
```json
{
   "source": {
      "platform" : {
            "key": "MsSql",
            "version": "2019"
      }
   }
}
```
{% /accordian %}

### source.platform.version
Indicates the database platform version.
{% table %}
---
* Data type
* `string`
---
* Default value
* `null`
---
* Valid values
* [any supported version of Microsoft SQL Server](../../mssql/versions)
{% /table %}
{% accordian caption="syntax examples" %}
The following will scaffold code specific to Microsoft SQL Server 2014:
```json
{
   "source": {
      "platform" : {
            "key": "MsSql",
            "version": "2014"
      }
   }
}
```
{% /accordian %}

## rootNamespace
The `rootNamespace` option specifies the prefix of namespaces generated in scaffolded code.  dbExpression uses the following namespaces in the scaffold code:
* `{rootNamespace}.{databaseName}Data`
* `{rootNamespace}.DataService`
* `{rootNamespace}.{schemaName}DataService`

When providing a value for `rootNamespace`, provide a value that means something in your domain.

{% table %}
---
* Data type
* `string`
---
* Default value
* `null`
{% /table %}
{% accordian caption="syntax examples" %}
Given a database named *Sales* that is used in an application that manages sales data, "Sales" would be a viable option for `rootNamespace`::
```json
{
   "rootNamespace": "Sales"
}
```
{% /accordian %}

## databaseAccessor
> This option is only relevant when using dbExpression in static mode.  

The `databaseAccessor` option specifies the typename of the scaffolded database.  When providing a value for `databaseAccessor`, provide a value that means something in your domain.

{% table %}
---
* Data type
* `string`
---
* Default value
* `db`
{% /table %}
{% accordian caption="syntax examples" %}
given a database named *Sales* that is used in an application that manages sales data, "sales" would be a viable option for `databaseAccessor`:
```json
{
   "databaseAccessor": "sales"
}
```
The `databaseAccessor` would expose `sales` for fluently building queries:
```csharp
var value = sales.SelectOne(dbo.Order.Id).From(dbo.Order).Execute();
```
{% /accordian %}

## outputDirectory
The `outputDirectory` option specifies where the generated files will be placed.  Values are relative to the location of the config file.

{% table %}
---
* Data type
* `string`
---
* Default value
* `null`
{% /table %}
{% accordian caption="syntax examples" %}
The following will output the generated files in the same directory as the config file:
```json
{
   "outputDirectory": "."
}
```
And the following will output the generated files into a subdirectory (named "Generated") of the directory the config file is in:
The following will output the generated files in the same directory as the config file:
```json
{
   "outputDirectory": "./Generated"
}
```
{% /accordian %}

## workingDirectory
The `workingDirectory` option specifies the working directory of the scaffold generation process.  Use the `workingDirectory` option when the
`outputDirectory` value should be relative to this value.

{% table %}
---
* Data type
* `string`
---
* Default value
* `null`
{% /table %}
{% accordian caption="syntax examples" %}
The following will output the generated files into a subdirectory (named "Generated"), a subdirectory of the directory the config file is in:
```json
{
   "outputDirectory": ".",
   "workingDirectory": "./Generated"
}
```
{% /accordian %}