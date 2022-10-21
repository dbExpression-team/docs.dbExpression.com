---
title: dbex.Null
---

The helper method `dbex.Null` creates an expression to be used anywhere a `null` is needed.  dbExpression requires clarity on types, 
so `dbex.Null` should be used instead of  `null` when it is expected to produce a SQL statement with a server side `NULL`.

{% method-descriptor %}
```json
{
    "syntax" : "dbex.Null"
}
```
{% /method-descriptor %}

{% accordian caption="syntax examples" %}
```csharp
DateTime? value = db.SelectOne(
    db.fx.DateAdd(DateParts.Year, 1, db.fx.Cast(dbo.Person.CreditLimit).AsDateTime())
).From(dbo.Person)
.Where(dbo.Person.CreditLimit == dbex.Null)
.Execute();

```
{% /accordian %}

