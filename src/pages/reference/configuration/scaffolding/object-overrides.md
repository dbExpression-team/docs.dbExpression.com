---
title: Object Overrides
---

The *overrides* setting is an array of override object definitions.  These overrides allow detailed control of the generated scaffolding.

{% callout type="warning" title="Order of overrides matters" %}
Scaffold configuration uses a "last one wins strategy", so the order of the `apply` objects provided in the configuration file can be
adjusted to result in the desired scaffolding output.
{% /callout %}

The following pseudo-json shows all the possible overrides available in the `apply` object.

```json
{
   "apply": {
       "ignore": true|false,
       "name": "{a different name for the entity}",
       "clrType": "{clr type name for properties of the entity}",
       "baseType": "{type name the entity should extend}",
       "allowInsert": true|false,
       "allowUpdate": true|false,
       "interfaces": {
            "add": [ "{list of interface type names the entity should implement}" ],
            "remove": [ "{list of interface type names to remove from the entity's implementations}" ]
       },
       "to": {
           "path": "{the schema path to apply the override}",
           "objectType": "{Schema|Table|View|Column|TableColumn|ViewColumn|Procedure|Parameter}"
       }
   } 
}
```

## apply.ignore
Setting `ignore` to `true` instructs the code generation tool to completely ignore creating any code for the target.
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
Allows for overriding SQL object names during the code generation process.  Database engines typically have far fewer restrictions on object names than what is allowed for class names or property names in 
the .NET CLR, use the `name` property to ensure C# compliant property names.
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
Allows for overriding the default mapped CLR type.  Mapping enumeration values to SQL string or integer is the most common use for the `clrType` override setting.  If the override value is a standard .NET CLR type (i.e. `int`, `int?`, `string`, `DateTime`, `DateTime?`, `long`, etc.) then you do not need to fully qualify the type name.  However, if the type is a custom type (like an `Enum`), the type name must be a fully qualified type name. 
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

## apply.baseType
Specify a type all generated POCO class(es) matching the `path` parameter should extend.  The type name must be a fully qualified type name. 
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
    * Table
    * View
{% /table %}

## apply.allowInsert
Allows flagging a column as not insertable.  Setting `allowInsert` to `false` tells the code generation process to ignore creating the scaffold code required to directly insert the column value.  The most common use for this override is for table columns that are controlled by defaults or they are defined as computed columns.
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
Allows flagging a column as not updateable.  Setting `allowUpdate` to `false` tells the code generation process to ignore creating the scaffold code required to directly update the column.  The most common use for this override is for table columns that are controlled by triggers or they are defined as computed columns.
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
Allows the addition and removal of one or more interfaces that are applied to the generated POCO class(es) matching the `path` parameter.  The interface names must be fully qualified (include the namespace).  Use of add/remove enables fine grained control of interfaces applied
to the set of matching POCO classes.  For each `apply`, interfaces provided through `remove` are processed after `add`, and `apply`'s
are processed in the order they are provided in the configuration file (see syntax examples).
{% table %}
---
* Applicable to
* database object types
    * Table
    * View
{% /table %}

## apply.interfaces.add
The list of interfaces to add to all POCOs matching the `path` parameter.
{% table %}
---
* Data type
* `string[]`
---
* Default value
* `empty array`
{% /table %}

## apply.interfaces.remove
The list of interfaces to remove from all POCOs matching the `path` parameter.
{% table %}
---
* Data type
* `string[]`
---
* Default value
* `empty array`
{% /table %}

{% accordian caption="syntax examples" %}
Add the `IInterface` and `IOtherInterface` interfaces to all POCO classes, then remove the `Namespace.IInterface` interface from the `SpecificTable` POCO.  The `SpecificTable` POCO will still have the `IOtherInterface` interface.
            
```json
{
    "apply": {
        "interfaces": {
            "add": [ "Namespace.IInterface", "Namespace.IOtherInterface" ]
        },
        "to": {
            "path": "dbo.*",
            "objectType": "table"
        }
    },
    "apply": {
        "interfaces": {
            "remove": [ "Namespace.IInterface" ]
        },
        "to": {
            "path": "dbo.SpecificTable",
            "objectType": "table" //not required as path is specific
        }
    }
}
```

No interfaces will be added to the `SpecificTable` POCO as 'remove' is evaluated after 'add'.

```json
{
    "apply": {
        "interfaces": {
            "add": [ "Namespace.IInterface" ],
            "remove": [ "Namespace.IInterface" ]
        },
        "to": {
            "path": "dbo.SpecificTable"
        }
    }
}
```
{% /accordian %}

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

## apply.to.objectType
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