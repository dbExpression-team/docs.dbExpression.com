---
title: dbex.SelectAllFor
---


The `dbex.SelectAllFor` method returns a list of `AnyElement`(s), each element in the list
is actually a `FieldExpression` representing a column in a database table.

> `dbex.SelectAllFor` returns a list of `AnyElement` which each can be used anywhere accepting
an `AnyElement`.  The design intent of the method is to return a list for use as the select expressions
in `SelectOne` or `SelectMany` queries.

{% method-descriptor %}
```json
{
    "syntax" : "dbex.SelectAllFor({entity_expression}[,{prefix|aliasingDelegate}])",
    "arguments" : [
        {
            "argumentName" : "entity_expression",
            "required" : true, 
            "description" : "The table entity that correlates to entities of type `TEntity`.",
            "types": [
                { 
                    "typeName" : "Table<TEntity>" 
                }
            ]
        },
        {
            "argumentName" : "prefix",
            "required" : false, 
            "description" : "Used to create an alias for each element by prefixing the property name with the value.",
            "types": [
                { 
                    "typeName" : "string" 
                }
            ]
        },
        {
            "argumentName" : "aliasingDelegate",
            "required" : false, 
            "description" : "A delegate that receives the name of an entity property and returns a new name for that property to use as an alias.",
            "types": [
                { 
                    "typeName" : "Func<string,string>" 
                }
            ]
        }
    ],
    "returns" : {
        "typeName" : "IEnumerable<AnyElement>",
        "description" : "A list of expressions, one for each property of the entity."
    }
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
```csharp
IEnumerable<dynamic> person_purchases = db.SelectMany(
        dbex.SelectAllFor(dbo.Person, "Person_"),
        dbo.Purchase.Id,
        dbo.Purchase.PurchaseDate
    )
    .From(dbo.Person)
    .InnerJoin(dbo.Purchase).On(dbo.Person.Id == dbo.Purchase.PersonId)
    .Execute();
```
{% /accordian %}


