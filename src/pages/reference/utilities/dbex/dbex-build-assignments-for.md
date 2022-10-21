---
title: dbex.BuildAssignmentsFor
---

The `dbex.BuildAssignmentsFor` method is used to build assignment expressions for entities to be
used in an *UPDATE* statement.  An assignment is simply the expression that sets a field value to a
new value in the database. The method compares the instances of two entities, and returns a list of 
the differences as `EntityFieldAssignment`(s).

{% method-descriptor %}
```json
{
    "syntax" : "dbex.BuildAssignmentsFor({entity_expression})\r\t.From({original})\r\t.To({updated})",
    "arguments" : [
        {
            "argumentName" : "entity_expression",
            "required" : true, 
            "description" : "The table entity that correlates to entities of type `TEntity`." ,
            "types": [
                { 
                    "typeName" : "Table<TEntity>"
                }
            ]
        },
        {
            "argumentName" : "original",
            "required" : true, 
            "description" : "An instance of `TEntity`, this is the \"old\" state of the entity.",
            "types": [
                { 
                    "typeName" : "TEntity" 
                }
            ]
        },
        {
            "argumentName" : "updated",
            "required" : true, 
            "description" : "An instance of `TEntity`, this is the \"new\" state of the entity.  When an *UPDATE* query is executed, the database values will be the values of this entity.",
            "types": [
                { 
                    "typeName" : "TEntity" 
                }
            ]
        }
    ],
    "returns" : {
        "typeName" : "IEnumerable<EntityFieldAssignment>",
        "description" : "A list of elements that can be used in an update query."
    }
}
```
{% /method-descriptor %}

> When an *UPDATE* query is executed using the field assignments from this method, the database values 
will be the values of `{updated}`.

{% accordian caption="syntax examples" %}
```csharp

int personId = 1;

...
IList<Person> persons = db.SelectOne<Person>()
     .From(dbo.Person)
     .Where(dbo.Person.Id == personId)
     .UnionAll()
     .SelectOne()
     .From(dbo.Person)
     .Where(dbo.Person.Id == personId)
     .Execute();

Person oldPerson = persons[0];
Person newPerson = persons[1];

// change some properties on the oldPerson
newPerson.CreditLimit = 5000;
newPerson.YearOfLastCreditLimitReview = DateTime.UtcNow.Year;

// update based on the comparison.  The assignments will contain a 
// SET for CreditLimit and YearOfLastCreditLimitReview
db.Update(
        dbex.BuildAssignmentsFor(dbo.Person)
            .From(oldPerson)
            .To(newPerson)
    )
    .From(dbo.Person)
    .Where(dbo.Person.Id == personId)
    .Execute();
```
{% /accordian %}

