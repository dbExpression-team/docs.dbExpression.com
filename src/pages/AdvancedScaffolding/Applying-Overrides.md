---
title: Applying Overrides
---

The *overrides* setting is an array of override object definitions.  These overrides allow detailed control of the generated scaffolding.

{% callout type="warning" title="Order of overrides matters" %}
Scaffold configuration uses a "last one wins strategy".  Any subsequent configuration provided for the *same path* will *OVERWRITE* the configuration provided previously for the *path* - configuration is *NOT MERGED*.
{% /callout %}

The following pseudo-json shows all the possible overrides available in the ```apply``` object.

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
 * Data type: bool
 * Default value: false
 * Applicable to: Schema, Table, View, Column, TableColumn, ViewColumn, Procedure, Parameter
 * Description: Setting *ignore* to true tells the code generation tool to completely ignore creating any scaffold code for the target.

## apply.name
* Data type: string
* Default value: actual object name from SQL schema
* Applicable to: Database, Schema, Table, View, Column, TableColumn, ViewColumn
* Description: Allows for overriding SQL object names during the schema to generated code mapping process.  Database engines typically have far fewer restrictions on object names than what is allowed for class names or property names in the .NET CLR.

## apply.clrType
* Data type: string
* Default value: Mapped CLR type based on SQL column type
* Applicable to: Column, TableColumn, ViewColumn
* Description: Allows for overriding the default mapped CLR type.  Mapping enumeration values to SQL string or integer is the most common use for the clrType override setting.  If the override value is a standard .NET CLR type (i.e. int, int?, string, DateTime, DateTime?, long, etc....) then you do not need to fully qualify the type name; however, if the type is a custom type like an ```Enum```, the type name must be a fully qualified type name. 

## apply.allowInsert
* Data type: bool
* Default value: true
* Applicable to: TableColumn
* Description: Allows flagging a column as not insertable.  Setting *allowInsert* to false tells the code generation tool to ignore creating the scaffold code required to directly insert the column.  The most common use for this override is for table columns that are controlled by defaults or are computed columns.

## apply.allowUpdate
* Data type: bool
* Default value: true
* Applicable to: TableColumn
* Description: Allows flagging a column as not updateable.  Setting *allowUpdate* to false tells the code generation tool to ignore creating the scaffold code required to directly update the column.  The most common use for this override is for table columns that are controlled by triggers or are computed columns.

## apply.interfaces
* Data type: array of string
* Default value: null
* Applicable to: Table, View
* Description: Allows you to add one or more interfaces that get applied to the generated POCO class.  These interface names must be fully qualified (include the namespace).

## to.path
The *path* value is used to resolve the set of objects to which the override is applied.  The format of the value follows the top down flow of the objects within a database:
schema.table|view.column.  The '*' (asterisk) character can be used within a path as a wildcard.  Providing a path of '.' (single period) will resolve the database object.
```json
"path": "dbo.Person.Id"       //resolves a single column named 'Id' within the 'dbo.Person' table
"path": "dbo.*.Id"            //resolves all columns named 'Id' for all tables and views within the 'dbo' schema
"path": "dbo.*_*"             //resolves all tables and views with names containing a '_' (underscore) character within the dbo schema
"path": "sec.P*"              //resolves all tables and views with names starting with P within the sec schema
"path": "*"                   //resolves all schema objects
"path": "."                   //resolves the database object (the root object)
"path": "*.*.CreatedAt"       //resolves all column objects named 'CreatedAt' within all tables and views in all schemas
"path": "dbo.UpdatePerson"    //resolves a single procedure named 'UpdatePerson' within the 'dbo' schema.
"path": "dbo.UpdatePerson.Id" //resolves a single parameter named 'Id' within the 'dbo.UpdatePerson' procedure
```

## to.objectType
The *objectType* value can be provided along with the *path* value to narrow the focus of the resolved items to a specific type of database object.  Allowed values are Schema, Table, View, Column, TableColumn, ViewColumn, Procedure, Parameter (case insensitive).
```json
"path": "dbo.*.CreatedAt",
"objectType": "TableColumn" //this path/objectType set resolves all columns named 'CreatedAt' within all tables within the 'dbo' schema (this would NOT include any columns named 'CreatedAt' belonging to any view).
```

```json
"path": "dbo.*.CreatedAt",
"objectType": "ViewColumn" //this path/objectType set resolves all columns named 'CreatedAt' within all views within the 'dbo' schema (this would NOT include any columns named 'CreatedAt' belonging to any table).
```