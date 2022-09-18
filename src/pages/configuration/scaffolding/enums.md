---
title: Enums
---

Enums are fully supported in dbExpression. Enums are challenging in the context of executed SQL statements, as Enums are almost always defined within an application domain and have to be "translated" to their numeric or string equivalent for persistence in the target database.  
dbExpression itself doesn't (and can't) understand something like ```MySuperDuperEnum``` that is defined in your application domain. To use Enums, you must tell dbExpression a little about them:

* The fully qualified type name of your Enum
* Where you plan to use them
* How you would like to convert them to and from the target database

To scaffold Enums, the *dbex.config.json* configuration file must list the fully qualified type names of each Enum.  Given the Enums in the sample [console application](https://github.com/HatTrickLabs/dbExpression/blob/master/samples/mssql/NetCoreConsoleApp/Data/_TypeCode.cs), we'll list 
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

The scaffolding process needs to know where you would like to use the Enum types instead of the inferred default data type.  For example, if the *AddressType* column in the *Address* table has a *DbType* of *int* and allows null, the scaffolded property ```AddressType``` in the ```Address``` entity would have a CLR type of ```int?```.  To change this property type from the CLR type ```int?``` to ```AddressType?```, an override must be provided in the *dbex.config.json* configuration file:
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
This configuration indicates that for the column *dbo.Address.AddressType* the scaffolded property type will be the CLR type ```AddressType?``` for the property ```AddressType``` on the ```Address``` entity.

*This is all you need to do if the Enum is stored as it's numeric value.*

If you store the value of your Enum as a string, see [Runtime Configuration (Enums)](/configuration/runtime/enums) for details on the required runtime configuration.
                
