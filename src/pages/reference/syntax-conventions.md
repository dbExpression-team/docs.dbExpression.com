---
title: Syntax Conventions
---

The reference section uses some nomenclature that helps convey the use of dbExpression.  When C# method signatures
are listed, this nomenclature (hopefully) helps remove the clutter from the intent of the signature.  It also allows
for detail of a common signature pattern that may actually have multiple implemented signatures due to different parameter
types and/or different method overloads.

{% table %}
* Convention
* Applies to
* Description
---
* `{ }`
* C#
* Required expression element or value.  You provide what's between the curly braces.
---
* `{value1|value2}` {% rowspan="2" %}
* C#
* Required expression element with specified valid values, where only one of the specified values is required.
---
* JSON
* Required javascript value with specified valid values, where only one of the specified values is required.
---
* `[ ]` {% rowspan="2" %}
* C#
* Any item or method inside the brackets is optional.
---
* JSON
* Symbolizes a javascript array.
---
* `[, ...{n}]`
* C#
* The preceding item can be repeated any number of times and separated by a comma, where `n` specifies the number of repetitions.
---
* *italic*
* SQL
* Database specific object types, names, or data types
{% /table %}
