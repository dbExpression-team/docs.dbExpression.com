---
title: dbex.GetDefaultMappingFor
---

The `dbex.GetDefaultMappingFor` method returns a delegate for mapping data to an instance of an entity.  The method 
is most commonly used in conjunction with `dbex.SelectAllFor`.

{% method-descriptor %}
```json
{
    "syntax" : "dbex.GetDefaultMappingFor({entity_expression})",
    "arguments" : [
        {
            "argumentName" : "entity_expression",
            "required" : true, 
            "description" : "The table entity for the entity type the mapping applies to.",
            "types": [
                { 
                    "typeName" : "Table<TEntity>" 
                }
            ]
        }
    ],
    "returns" : {
        "typeName" : "Action<ISqlFieldReader, TEntity>",
        "description" : "A delegate that receives a field reader and an instance of an entity."
    }
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
```csharp
IList<Person> persons = db.SelectMany<Person>()
    .From(dbo.Person)
    .Execute(row => 
        { 
            var person = new Person(); 
            dbex.GetDefaultMappingFor(dbo.Person).Invoke(row, person);
            if (DateTime.UtcNow.Year - person.YearOfLastCreditLimitReview > 5)
            {
                person.CreditLimit = 0;
            }
            return person; 
        }
    );
```
{% /accordian %}


