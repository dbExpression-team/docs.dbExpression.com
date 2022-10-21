---
title: dbex.Coerce
---

`dbex.Coerce` changes the expression element type from a nullable to a non-nullable type, 
or from a non-nullable to a nullable type.

{% method-descriptor %}
```json
{
    "syntax" : "dbex.Coerce({expression})",
    "arguments" : [
        {
            "argumentName" : "expression",
            "required" : true, 
            "description" : "An `AnyElement` to change from nullable to non-nullable, or from non-nullable to nullable." ,
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

{% accordian caption="syntax examples" %}
The following "flips" the resulting return type from `DateTime?` (*BirthDate* allows null) to `DateTime`
```csharp
DateTime birthDate = db.SelectOne(
        dbex.Coerce(dbo.Person.BirthDate)
    )
    .From(dbo.Person)
    .Where(dbo.Person.BirthDate != dbex.Null)
    .Execute();
```
{% /accorian %}