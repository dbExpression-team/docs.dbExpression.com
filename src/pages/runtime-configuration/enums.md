---
title: Enums
---

## Persisting Enum Values as Strings
To persist Enum values as strings, additional runtime configuration is required.

```csharp
dbExpression.Configure(
    dbex => {

        dbex.AddDatabase<SimpleConsoleDb>(
            database => {
                ...
                database.Conversions.ForTypes(c => c
                        .ForEnumType<AddressType>().PersistAsString()
                        .ForEnumType<PaymentMethodType>().PersistAsString()
                );
                ...
            }
        );
    }
);
```

This runtime configuration specifies that **all** uses of the ```AddressType``` and ```PaymentMethodType``` CLR types are persisted using the string value of the Enum.  Configuration using ```PersistAsString()``` will manage both the non-nullable and nullable versions of the provided Enum.

Using this also assumes your target database column has a data type (varchar, etc) that can accept and persist the string version of the Enum.

> Configuration to persist an Enum type as a string is global.  dbExpression does not support persisting an Enum type as a string in one table and it's numeric value in a different table.

## Providing a Delegate for Persisting Enum Values
You have full control of the conversion of Enums as they are written to and read from the target database.  Given the example above for an ```AddressType``` Enum, the following configuration (purely for example) will ensure every ```Address``` type with an ```AddressType``` value of ```Mailing``` is persisted with a leading underscore and correctly converted when read from the target database:

```csharp
dbExpression.Configure(
    dbex => {

        dbex.AddDatabase<SimpleConsoleDb>(
            database => {
                ...
                database.Conversions.ForTypes(c => c
                        .ForEnumType<AddressType>().Use(
                        to => {
                            if (to == AddressType.Mailing)
                                return $"_{AddressType.Mailing}";
                            return to;
                        },
                        from => {
                            var addressType = from as string;
                            if (string.IsNullOrWhiteSpace(addressType))
                                return null;
                            if (addressType == $"_{AddressType.Mailing}")
                                return AddressType.Mailing;
                            return (AddressType?)Enum.Parse(typeof(AddressType), addressType, true);
                        }
                    )
                );
                ...
            }
        );
    }
);
```

When configuring Enums (and other primitive types) using delegates, delegates must manage ```null```, regardless of the nullability of the target property on an entity.

*But why?* It's possible to logically create a ```null``` value for a field even though the property is defined as non-nullable.  Think of a *LEFT JOIN* that returns a null value for a column that's marked *NOT NULL*.    Let's say the ```AddressType``` property on the ```Address``` entity does not allow null values.  With (default) scaffolding, a null ```AddressType``` can't be mapped to an ```Address``` entity. It's possible (and perfectly viable) to have a ```null``` value for ```AddressType``` when queries are structured to do just that.  In the following example, a ```Person``` is not required to have an address, so returning a ```Person``` with no ```Address``` will result in a ```null``` for the ```AddressType``` field:

```csharp
db.SelectOne(
        dbo.Person.FirstName,
        dbo.Person.LastName,
        dbo.Address.AddressType
    )
    .From(dbo.Person)
    .LeftJoin(dbo.PersonAddress).On(dbo.Person.Id == dbo.PersonAddress.PersonId)
    .LeftJoin(dbo.Address).On(dbo.PersonAddress.AddressId == dbo.Address.Id)
    .Execute();
```

{% collapsable title="SQL statement" %}
```sql
SELECT
	[dbo].[Person].[FirstName]
	,[dbo].[Person].[LastName]
	,[dbo].[Address].[AddressType]
FROM
	[dbo].[Person]
	LEFT JOIN [dbo].[Person_Address] ON [dbo].[Person].[Id] = [dbo].[Person_Address].[PersonId]
	LEFT JOIN [dbo].[Address] ON [dbo].[Person_Address].[AddressId] = [dbo].[Address].[Id];
```
{% /collapsable %}

In the dynamic result from execution of this query, the ```AddressType``` property may be a ```null``` value - and again this is perfectly viable based on the query. As conversions for ```AddressType``` use the overriden delegate to convert values, it must handle the ```null``` value or an exception would occur in the delegate.

                
