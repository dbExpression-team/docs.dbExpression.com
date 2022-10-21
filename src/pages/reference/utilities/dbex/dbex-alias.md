---
title: dbex.Alias
---

Use `dbex.Alias` to create/use an alias for an expression.  When using aliases, the generic
form must be used when the resulting type must be known.

## Create an alias and generically define the return type

{% method-descriptor %}
```json
{
    "syntax" : "dbex.Alias<T>([{tableName},]{fieldName})",
    "arguments" : [
        {
            "argumentName" : "T",
            "required" : true, 
            "description" : "The typed alias for use in composite expressions or select clauses where the type information is required.",
            "types": [
                { 
                    "typeName" : "Type" 
                }
            ]
        },
        {
            "argumentName" : "tableName",
            "required" : "when aliasing requires a table name",
            "description" : "An `AnyElement` to change from nullable to non-nullable, or from non-nullable to nullable.",
            "types": [
                { 
                    "typeName" : "AnyElement"
                }
            ]
        },
        {
            "argumentName" : "fieldName",
            "required" : true, 
            "description" : "An `AnyElement` to change from nullable to non-nullable, or from non-nullable to nullable.",
            "types": [
                { 
                    "typeName" : "AnyElement" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

---

## Create an alias without return type information

{% method-descriptor %}
```json
{
    "syntax" : "dbex.Alias([{tableName},]{fieldName})",
    "arguments" : [
        {
            "argumentName" : "tableName",
            "required" : "when aliasing requires a table name", 
            "description" : "An `AnyElement` to change from nullable to non-nullable, or from non-nullable to nullable.",
            "types": [
                { 
                    "typeName" : "AnyElement" 
                }
            ]
        },
        {
            "argumentName" : "fieldName",
            "required" : true, 
            "description" : "An `AnyElement` to change from nullable to non-nullable, or from non-nullable to nullable.",
            "types": [
                { 
                    "typeName" : "AnyElement" 
                }
            ]
        }
    ]
}
```
{% /method-descriptor %}

