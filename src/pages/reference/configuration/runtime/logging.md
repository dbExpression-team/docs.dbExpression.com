---
title: Logging
---

Configure options for logging.

## Configure using delegate

{% method-descriptor %}
```json
{
    "syntax" : "ConfigureLoggingOptions({configure})",
    "arguments" : [
        {
            "argumentName" : "configure",
            "required" : true, 
            "description" : "A delegate to configure logging settings." ,
            "types": [
                { 
                    "typeName" : "Action<LoggingOptions>"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

## LogParameterValues Option

{% method-descriptor %}
```json
{
    "syntax" : "LogParameterValues = {value}",
    "arguments" : [
        {
            "argumentName" : "value",
            "required" : true, 
            "description" : "A value that determines if parameter values will be emitted to logs with the sql statement." ,
            "defaultValue" : "false",
            "types": [
                { 
                    "typeName" : "bool"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="examples" %}
```csharp
db => db.SqlStatements.Logging.ConfigureLoggingOptions(
    options => options.LogParameterValues = true
)
```
Before execution of a SQL statement and when logging is "active", 
dbExpression will log the SQL statement including the values of any
parameters.
{% /accordian %}