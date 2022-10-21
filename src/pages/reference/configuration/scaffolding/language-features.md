---
title: Language Features
---

As Microsoft releases new language features supporting an opt-in process, dbExpression will expose those same opt-in features as they impact
the scaffolded code. If your environment/project will opt-in to a language feature, simply replicate that opt-in in the scaffold configuration file.

The following pseudo-json shows all language feature related properties:

```json
{
   "nullable": "{enable|disable}"
}
```

## nullable
Opts-in/out of using the `nullable` language feature by including a `#nullable enable`
 or `#nullable disable` preprocessor directive in generated files.  The ommission of the `nullable`
 property from the configuration file will result in NO preprocessor directive for `nullable` in the generated files.
{% table %}
---
* Data type
* `string`
---
* Default value
* `null`
---
* Valid values
*
   * `enable`
   * `disable`
{% /table %}
{% accordian caption="syntax examples" %}
the following will opt-in to the `nullable` language feature in scaffolded code:
```json
{
   "nullable": "enable"
}
```
{% /accordian %}