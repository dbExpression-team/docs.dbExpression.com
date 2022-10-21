---
title: Output Options
---

Configure options for the styling of SQL statements.

## Configure using delegate

{% method-descriptor %}
```json
{
    "syntax" : "ConfigureAssemblyOptions({configure})",
    "arguments" : [
        {
            "argumentName" : "configure",
            "required" : true, 
            "description" : "A delegate to configure the options controlling the styling of SQL statements.",
            "types": [
                { 
                    "typeName" : "Action<SqlStatementAssemblyOptions>"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

## PrependCommaOnSelectClause Option

{% method-descriptor %}
```json
{
    "syntax" : "PrependCommaOnSelectClause = {value}",
    "arguments" : [
        {
            "argumentName" : "value",
            "required" : true, 
            "description" : "A value that determines if select clause fields have commas prepended.",
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

{% accordian caption="syntax examples" %}
```csharp
db => db.SqlStatements.Assembly.ConfigureOutputSettings(
    options => options.PrependCommaOnSelectClause = true
)
```
Would render commas *at the beginning of each line*:
```sql
SELECT
    [dbo].[Person].[Id]
    ,[dbo].[Person].[FirstName]
    ,[dbo].[Person].[LastName]
FROM
    [dbo].[Person];
```
And
```csharp
db => db.SqlStatements.Assembly.ConfigureOutputSettings(
    options => options.PrependCommaOnSelectClause = false
)
```
Would render commas *at the end of each line*:
```sql
SELECT
    [dbo].[Person].[Id],
    [dbo].[Person].[FirstName],
    [dbo].[Person].[LastName]
FROM
    [dbo].[Person];
```
{% /accordian %}

---

## Delimiter Option

{% method-descriptor %}
```json
{
    "syntax" : "Delimiter.Begin = {value}",
    "arguments" : [
        {
            "argumentName" : "value",
            "required" : true, 
            "description" : "A value used as the beginning character for database objects.",
            "defaultValue" : "[",
            "types": [
                { 
                    "typeName" : "char"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% method-descriptor %}
```json
{
    "syntax" : "Delimiter.End = {value}",
    "arguments" : [
        {
            "argumentName" : "value",
            "required" : true,
            "defaultValue" : "]", 
            "description" : "A value used as the ending character for database objects.",
            "types": [
                { 
                    "typeName" : "char"
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
```csharp
db => db.SqlStatements.Assembly.ConfigureOutputSettings(
    s => 
    { 
        s.IdentifierDelimiter.Begin = '\''; //escaped single quote
        s.IdentifierDelimiter.End = '\''; 
    }
)
```
Would render:
```sql
SELECT
    'dbo'.'Person'.'Id',
    'dbo'.'Person'.'FirstName',
    'dbo'.'Person'.'LastName'
FROM
    'dbo'.'Person';
```
{% /accordian %}

---

## StatementTerminator Option

{% method-descriptor %}
```json
{
    "syntax" : "StatementTerminator = {value}",
    "arguments" : [
        {
            "argumentName" : "value",
            "required" : true, 
            "description" : "A value used as the ending character for sql statements.",
            "defaultValue" : ";",
            "types": [
                { 
                    "typeName" : "char" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

{% accordian caption="examples" %}
```csharp
db => db.SqlStatements.Assembly.ConfigureOutputSettings(
    s => s.StatementTerminator = '!'
)
```
Would render:
```sql
SELECT
    [dbo].[Person].[Id],
    [dbo].[Person].[FirstName],
    [dbo].[Person].[LastName]
FROM
    [dbo].[Person]!
```
{% /accordian %}