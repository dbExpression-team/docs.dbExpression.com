---
title: Object Overrides
---

The *overrides* setting is an array of override object definitions.  These overrides allow detailed control of the generated scaffolding.

{% callout type="warning" title="Order of overrides matters" %}
Scaffold configuration uses a "last one wins strategy".  Any subsequent configuration provided for the *same path* will *OVERWRITE* the configuration provided previously for the *path* - configuration is *NOT MERGED*.
{% /callout %}

The following pseudo-json shows all the possible overrides available in the `apply` object.

```json
{
   "apply": {
       "ignore": true|false,
       "name": "{nameOverride}",
       "clrType": "clrTypeName",
       "allowInsert": true|false,
       "allowUpdate": true|false,
       "interfaces": [ "{interfaceName}" ],
       "to": {
           "path": "{schemaPath}",
           "objectType": "{Schema|Table|View|Column|TableColumn|ViewColumn|Procedure|Parameter}"
       }
   } 
}
```

## apply.ignore
Setting `ignore` to `true` tells the code generation tool to completely ignore creating any code for the target.
{% table %}
---
* Data type
* `bool`
---
* Default value
* `false`
---
* Applicable to
* database object types
    * Schema
    * Table
    * View
    * Column
    * TableColumn
    * ViewColumn
    * Procedure
    * Parameter
{% /table %}

## apply.name
Allows for overriding SQL object names during the code generation process.  Database engines typically have far fewer restrictions on object 
names than what is allowed for class names or property names in the .NET CLR, use the name property to ensure C# compliant names.
{% table %}
---
* Data type
* `bool`
---
* Default value
* `false`
---
* Applicable to
* database object types
    * Database
    * Schema
    * Table
    * View
    * Column
    * TableColumn
    * ViewColumn
{% /table %}

## apply.clrType
Allows for overriding the default mapped CLR type.  Mapping enumeration values to SQL string or integer is the most common use for the `clrType` override setting.  
If the override value is a standard .NET CLR type (i.e. `int`, `int?`, `string`, `DateTime`, `DateTime?`, `long`, etc.) then you do not need to fully qualify 
the type name.  However, if the type is a custom type like an `Enum`, the type name must be a fully qualified type name. 
{% table %}
---
* Data type
* `string`
---
* Default value
* actual object name from SQL schema
---
* Applicable to
* database object types
    * Column
    * TableColumn
    * ViewColumn
{% /table %}

## apply.allowInsert
Allows flagging a column as not insertable.  Setting `allowInsert` to `false` tells the code generation process to ignore creating the scaffold code required 
to directly insert the column.  The most common use for this override is for table columns that are controlled by defaults or they are defined as computed columns.
{% table %}
---
* Data type
* `bool`
---
* Default value
* `true`
---
* Applicable to
* database object types
    * TableColumn
{% /table %}

## apply.allowUpdate
Allows flagging a column as not updateable.  Setting `allowUpdate` to `false` tells the code generation process to ignore creating the scaffold code required 
to directly update the column.  The most common use for this override is for table columns that are controlled by triggers or they are defined as computed columns.
{% table %}
---
* Data type
* `bool`
---
* Default value
* `true`
---
* Applicable to
* database object types
    * TableColumn
{% /table %}

## apply.interfaces
Allows you to add one or more interfaces that get applied to the generated POCO class.  These interface names must be fully qualified (include the namespace).
{% table %}
---
* Data type
* `string[]`
---
* Default value
* `null`
---
* Applicable to
* database object types
    * Table
    * View
{% /table %}

## apply.to.path
The `path` value is used to resolve the set of objects to which the override is applied.  The format of the value follows the top down flow of the objects within a database:
schema.table|view.column.  The `*` (asterisk) character can be used within a path as a wildcard.  Providing a path of `.` (single period) will resolve the database object.
{% table %}
---
* Data type
* `string`
---
* Default value
* `null`
---
* Applicable to
* database object types
    * Database
    * Schema
    * Table
    * View
    * Column
    * TableColumn
    * ViewColumn 
    * Procedure
    * Parameter (case insensitive)
{% /table %}
{% accordian caption="syntax examples" %}
```json
"path": "dbo.Person.Id"         //resolves a single column named 'Id' 
                                //within the 'dbo.Person' table
"path": "dbo.*.Id"              //resolves all columns named 'Id' for 
                                //all tables and views within the 'dbo' schema
"path": "dbo.*_*"               //resolves all tables and views with names 
                                //containing a '_' (underscore) character 
                                //within the dbo schema
"path": "sec.P*"                //resolves all tables and views with names 
                                //starting with P within the sec schema
"path": "*"                     //resolves all schema objects
"path": "."                     //resolves the database object (the root object)
"path": "*.*.CreatedAt"         //resolves all column objects named 'CreatedAt' 
                                //within all tables and views in all schemas
"path": "dbo.UpdatePerson"      //resolves a single procedure named 'UpdatePerson' 
                                //within the 'dbo' schema.
"path": "dbo.UpdatePerson.Id"   //resolves a single parameter named 'Id' 
                                //within the 'dbo.UpdatePerson' procedure
```
{% /accordian %}

## apply.to.object
The `objectType` value can be provided along with the `path` value to narrow the focus of the resolved items to a specific type of database object.  Allowed values are Schema, Table, View, Column, TableColumn, ViewColumn, Procedure, Parameter (case insensitive).
{% table %}
---
* Data type
* `string`
---
* Default value
* `null`
---
* Applicable to
* database object types
    * Schema
    * Table
    * View
    * Column
    * TableColumn
    * ViewColumn 
    * Procedure
    * Parameter (case insensitive)
{% /table %}
{% accordian caption="syntax examples" %}
```json
"path": "dbo.*.CreatedAt",
"objectType": "TableColumn" //this path/objectType set resolves all 
                            //columns named 'CreatedAt' within all 
                            //tables within the 'dbo' schema (this 
                            //would NOT include any columns named 
                            //'CreatedAt' belonging to any view).
```
{% /accordian %}