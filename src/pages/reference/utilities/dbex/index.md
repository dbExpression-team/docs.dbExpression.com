---
title: dbex
---

.NET CLR languages and SQL have an inherent [impedance mismatch](https://en.wikipedia.org/wiki/Object%E2%80%93relational_impedance_mismatch) as each were designed for completely different use cases.  While dbExpression aims to make compiled code resemble SQL as closely as possible, some differences require the use of utility methods to help bridge the impedance mismatch as much as possible.  With this, dbExpression exposes a `dbex` static utility class.

> `dbex` provides utilities to bridge the differences between .NET CLR languages and SQL