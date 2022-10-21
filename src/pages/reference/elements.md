---
title: Elements
description: Description of elements and the creation of composite elements for use with dbExpression
---

{% core-concepts caption="expression elements" %}
{% partial file="expression-elements-partial.md" /%}
{% /core-concepts %}

## Any
{% table %}
---
* `AnyElement`
* The base of all elements.  *All* other elements extend this type.  Any method that accepts an `AnyElement` will accept any other element type (nullable and non-nullable).
---
* `AnyElement<T>` 
* The base of all elements of a specific .NET CLR type, where the generic parameter `T` is a .NET CLR type.  Any method that accepts this type will accept any other element of that data type; i.e. `Int32Element` can be used anywhere that specifies an `AnyElement<int>` and `NullableInt32Element` can be used anywhere that specifies an `AnyElement<int?>`.
{% /table %}

## Object
{% table %}
---
* `AnyObjectElement` 
* Similar to `AnyElement`, but represents elements that equate to `object`.  This element isn't typically used, but has use when dbExpression cannot definitively determine the .NET CLR type.  For example, the `COALESCE` database function accepts a set of parameters that can be of different data types.  Microsoft SQL Server will return the first non-nullable item in the list during query execution.  As such, the return could be any type, so dbExpression must realize this as an `object` type.
---
* `AnyObjectElement<T>` 
* Typically used with user-defined types that are unkown to dbExpression, for example a complex type stored in the database as a primitive type * like an object serialized/deserialized as JSON in a varchar(max) field/column.  dbExpression supports (through scaffold configuration) the ability to specify your own type for a database field/column and (through runtime configuration) allows you to provide a value converter for this type.
---
* `ObjectElement` 
* a `AnyObjectElement`, for use when *non-nullable* objects are required.
---
* `NullableObjectElement` 
* a `AnyObjectElement`, for use when *nullable* objects are required.
---
* `ObjectElement<T>` 
* a `AnyObjectElement<T>`, for use when *non-nullable* objects are required.
---
* `NullableObjectElement<T>` 
* a `AnyObjectElement<T>`, for use when *nullable* objects are required.
---
* `NullElement` 
* This element is the return from the helper function `dbex.Null` to represent a server-side `NULL`.  It's typically used in filter expressions, i.e. `dbo.Table.Field == dbEx.Null`.
{% /table %}

## Primitives
### Numeric
{% table %}
---
* `AnyNumericElement` 
* An element representing *any* numeric .NET CLR type.  This element is used with fields/functions that specify a *non-nullable* numeric data type.
---
* `NullableAnyNumericElement` 
* An element representing *any* numeric .NET CLR type.  This element is used with fields/functions that specify a *nullable* numeric data type.
---
* `ByteElement` 
* An element representing the `byte` .NET CLR type.  This element is used with fields/functions that specify a `byte`.
---
* `NullableByteElement` 
* An element representing the `byte?` .NET CLR type.  This element is used with fields/functions that specify a `byte?`.
---
* `DecimalElement` 
* An element representing the `decimal` .NET CLR type.  This element is used with fields/functions that specify a `decimal`.
---
* `NullableDecimalElement` 
* An element representing the `decimal?` .NET CLR type.  This element is used with fields/functions that specify a `decimal?`.
---
* `DoubleElement` 
* An element representing the `double` .NET CLR type.  This element is used with fields/functions that specify a `double`.
---
* `NullableDoubleElement` 
* An element representing the `double?` .NET CLR type.  This element is used with fields/functions that specify a `double?`.
---
* `Int16Element` 
* An element representing the `short` .NET CLR type.  This element is used with fields/functions that specify a `short`.
---
* `NullableInt16Element` 
* An element representing the `short?` .NET CLR type.  This element is used with fields/functions that specify a `short?`.
---
* `Int32Element` 
* An element representing the `int` .NET CLR type.  This element is used with fields/functions that specify a `int`.
---
* `NullableInt32Element` 
* An element representing the `int?` .NET CLR type.  This element is used with fields/functions that specify a `int?`.
---
* `Int64Element` 
* An element representing the `long` .NET CLR type.  This element is used with fields/functions that specify a `long`.
---
* `NullableInt64Element` 
* An element representing the `long?` .NET CLR type.  This element is used with fields/functions that specify a `long?`.
---
* `SingleElement` 
* An element representing the `float` .NET CLR type.  This element is used with fields/functions that specify a `float`.
---
* `NullableSingleElement` 
* An element representing the `float?` .NET CLR type.  This element is used with fields/functions that specify a `float?`.
{% /table %}

### Boolean
{% table %}
---
* `BooleanElement` 
* An element representing the `bool` .NET CLR type.  This element is used with fields/functions that specify a `bool`.
---
* `NullableBooleanElement` 
* An element representing the `bool?` .NET CLR type.  This element is used with fields/functions that specify a `bool?`.
{% /table %}

### DateTime
Elements that map to .NET date/time data types.  `DateTime` and `DateTimeOffset` are typically interchangeable; i.e. any method accepting a `DateTimeElement` will also accept a `DateTimeOffsetElement` element, and any method accepting a `DateTimeOffsetElement` will accept a `DateTimeElement`.
{% table %}
---
* `DateTimeElement` 
* An element representing the `DateTime` .NET CLR type.  This element is used with fields/functions that specify a `DateTime`.
---
* `NullableDateTimeElement` 
* An element representing the `DateTime?` .NET CLR type.  This element is used with fields/functions that specify a `DateTime?`.
---
* `DateTimeOffsetElement` 
* An element representing the `DateTimeOffset` .NET CLR type.  This element is used with fields/functions that specify a `DateTimeOffset?`.
---
* `NullableDateTimeOffsetElement` 
* An element representing the `DateTimeOffset?` .NET CLR type.  This element is used with fields/functions that specify a `DateTimeOffset?`.
---
* `TimeSpanElement` 
* An element representing the `TimeSpan` .NET CLR type.  This element is used with fields/functions that specify a `TimeSpan`.
---
* `NullableTimeSpanElement` 
* An element representing the `TimeSpan?` .NET CLR type.  This element is used with fields/functions that specify a `TimeSpan?`.
{% /table %}

### Guid
{% table %}
---
* `GuidElement` 
* An element representing the `Guid` .NET CLR type.  This element is used with fields/functions that specify a `Guid`.
---
* `NullableGuidElement` 
* An element representing the `Guid?` .NET CLR type.  This element is used with fields/functions that specify a `Guid?`.
{% /table %}

### String
{% table %}
---
* `AnyStringElement` 
* Strings in .NET act uniquely.  They are not primitives, but sometimes they act like a primitive.  In a non-nullable context (`#nullable disable`), `string?` is not legal syntax, but any object typed as `string` can be null or non-null.  In a nullable context (`#nullable enable`), strings act much like other primitives related to nullability.  To handle all the complexities of strings, dbExpression has this additional element type, where other primitive data types do not have this corresponding "Any" element type.  This element basically represents a `string` in any context.
---
* `StringElement` 
* An element representing the `string` .NET CLR type.  This element is used with fields/functions that specify a `string`.  Fields are of this element type when they do not allow null (database constraint).
---
* `NullableStringElement` 
* An element representing the `string?` .NET CLR type.  This element is used with fields/functions that specify a `string?`.  Fields are of this element type when they allow null (database constraint).
{% /table %}

## Enum
These elements represent user-defined enum types that are unkown to dbExpression, where the generic parameter `TEnum` specifies the user-defined enum type.  dbExpression supports (through scaffold configuration) the ability to specify your own enums for a database field/column and (through runtime configuration) allows you to provide settings for managing enums.
{% table %}
---
* `EnumElement<TEnum>` 
* An element representing the `TEnum` enum type.  This element is used with fields/functions that specify a `TEnum` type.
---
* `NullableEnumElement<TEnum>` 
* An element representing the `TEnum?` enum type.  This element is used with fields/functions that specify a `TEnum?` type.
{% /table %}

## Array (byte)
{% table %}
---
* `ByteArrayElement` 
* Any field or function typed as a `byte[]`.  A typical use of this element type is when a database field/column is typed as an `image` or something similar.
---
* `NullableByteArrayElement` 
* Similar to `ByteArrayElement`, any field or function typed as a `byte[]`.  The difference between this element tyupe and a `ByteArrayElement` is this is used when the field/column allows null values.
{% /table %}

## Alias
{% table %}
---
* `AliasedElement`
* `AnyElement` that has been aliased using the `dbex.Alias` utility method.
---
* `AliasedElement<T>`
* `AnyElement` that has been aliased using the `dbex.Alias<T>` utility method.
{% /table %}

