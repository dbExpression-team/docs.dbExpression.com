---
title: Enums
---

Enums are fully supported in dbExpression. Enums are challenging in the context of executing SQL statements, as enums are defined within an application 
domain and have to be "translated" to their numeric or string equivalent for persistence in the target database. To use enums with their constant value 
when authoring queries with dbExpression, scaffolding configuration is required.

> Scaffolding configuration is required to use the constant value of an enum when authoring queries in dbExpression.

## Scaffolding Configuration

dbExpression itself doesn't (and can't) understand something like ```MySuperDuperEnum``` that is defined in your application domain. You must tell 
dbExpression a little about your enums:

* The fully qualified type name of your enum
* Where you plan to use them

To scaffold enums, the *dbexpression.config.json* configuration file must list the fully qualified type names of each enum.  Given the enums in the sample [console application](https://github.com/dbexpression-team/dbexpression/blob/master/samples/mssql/NetCoreConsoleApp/Data/_TypeCode.cs), we'll list 
those in the ```enums``` array of the configuration file:
```json
{
...
"enums": [
        "SimpleConsole.Data.AddressType",
        "SimpleConsole.Data.GenderType",
        "SimpleConsole.Data.ProductCategoryType",
        "SimpleConsole.Data.PaymentMethodType",
        "SimpleConsole.Data.PaymentSourceType",
        "SimpleConsole.Data.AccessAuditResult"
    ]
...
}
```

The scaffolding process needs to know where you would like to use the enum types instead of the inferred default data type.  

For example, if the *AddressType* column in the *Address* table has a *DbType* of *int* and allows null, the scaffolded property `AddressType` 
in the `Address` entity would have a CLR type of `int?`.  To change this property type from the CLR type `int?` to `AddressType?`, an override must 
be provided in the *dbexpression.config.json* configuration file:
```json
{
    ...
    {
        "apply": {
            "clrType": "SimpleConsole.Data.AddressType?",
            "to": {
                "path": "dbo.Address.AddressType"
            }
        }
    }
    ...
}
```
> See the Reference section on [Object Overrides](../../reference/configuration/scaffolding/object-overrides) for a full explanation of override properties and values.

This configuration indicates that for the column *dbo.Address.AddressType* the scaffolded property type will be the CLR type ```AddressType?``` for the property ```AddressType``` on the ```Address``` entity.

*This is all you need to do if the Enum is stored as it's numeric value.*                

## Runtime Configuration

Runtime configuration is required to persist enum values as strings, or to provide your own persistence strategy.

### Persisting Enum Values as Strings

To persist enum values as strings, use the `PersistAsString()` method in runtime configuration to specify a value converter that will
convert enum values from their numeric type to their name:

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

> See the Reference section on [Value Converters](../../reference/configuration/runtime/value-converters) for a full explanation of configuring value converters.


This runtime configuration specifies that **all** uses of the `AddressType` and `PaymentMethodType` CLR types are persisted using the name/string value of the enum. 
Configuration using `PersistAsString()` will manage both the non-nullable and nullable versions of provided enum values.

Using this also assumes your target database column has a data type (*varchar*, etc) that can accept and persist the string version of the enum.

> Configuration to persist an enum type as a string is global.  dbExpression does not support persisting an enum type as a string in one table 
and it's numeric value in a different table.

### Providing a Delegate for Persisting Enum Values

You have full control of the conversion of enum values as they are written to and read from the target database.  Given the example above for an `AddressType` 
eum, the following configuration (purely for example) will ensure every `Address` type with an `AddressType` value of `Mailing` is persisted with a 
leading underscore and correctly converted when read from the target database:

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

When configuring enums (and other primitive types) using delegates, delegates must manage `null`, regardless of the nullability of the target property on an entity.

*But why?* It's possible to logically create a `null` value for a field even though the property is defined as non-nullable.  Think of a *LEFT JOIN* that returns a null value for a column that's marked *NOT NULL*.    Let's say the `AddressType` property on the `Address` entity does not allow null values.  With (default) scaffolding, a null `AddressType` can't be mapped to an `Address` entity. It's possible (and perfectly viable) to have a `null` value for `AddressType` when queries are structured to do just that.  In the following example, a `Person` is not required to have an address, so returning a `Person` with no `Address` will result in a `null` for the `AddressType` field:

{% code-example %}
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
```sql
SELECT TOP(1)
    [t0].[FirstName],
    [t0].[LastName],
    [t1].[AddressType]
FROM
    [dbo].[Person] AS [t0]
    LEFT JOIN [dbo].[Person_Address] AS [t2] ON [t0].[Id] = [t2].[PersonId]
    LEFT JOIN [dbo].[Address] AS [t1] ON [t2].[AddressId] = [t1].[Id];
```
{% /code-example %}

In the dynamic result from execution of this query, the `AddressType` property may be a `null` value - and again this is perfectly viable based on the query. As conversions for `AddressType` use the overriden delegate to convert values, it must handle the `null` value to avoid a runtime exception.

                
