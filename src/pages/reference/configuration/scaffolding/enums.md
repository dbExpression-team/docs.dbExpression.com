---
title: Enums
---

To scaffold Enums, the fully qualified type names of each `Enum` must be provided in scaffold configuration.
The scaffolding process needs to know where you would like to use the Enum types instead of the inferred database data type.  

For example, if the *AddressType* column in the *Address* table has a *DbType* of *int* and allows null, the scaffolded property `AddressType` in the `Address` entity would have a CLR type of `int?`.  To change this property type from the CLR type `int?` to `AddressType?`, an override must be provided in the *dbex.config.json* configuration file:
```json
{
    ...
    "enums": [
        {typename}[, ...{n-typename}]
    ]
    ...
}
```

## Example
For example, if the *AddressType* column in the *Address* table has a *DbType* of *int* and allows null, the scaffolded property `AddressType` in the `Address` entity would have a CLR type of `int?`.  To change this property type from the CLR type `int?` to `AddressType?`, an override must be provided in the *dbex.config.json* configuration file:
```json
{
    ...
    "enums": [
        "SimpleConsole.Data.AddressType"
    ]
    ...

    ...
    "overrides": {
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
This configuration indicates that for the column *dbo.Address.AddressType* the scaffolded property type will be the CLR type `AddressType?` for the property `AddressType` on the `Address` entity.
