* `GetValue<T>()` - Execution of the stored procedure returns a scalar value with type `T`.
* `GetValues<T>()` - Execution of the stored procedure returns a list of scalar values with type `T`.
* `GetValue<T>(Func<ISqlFieldReader,T>)` - Execution of the stored procedure returns an object of type `T`.
* `GetValues<T>(Func<ISqlFieldReader,T>)` - Execution of the stored procedure returns a list of objects with type `T`.
* `GetValue()` - Execution of the stored procedure returns a single `dynamic` object, where the properties of the dynamic object are determined by the returned rowset.
* `GetValues()` - Execution of the stored procedure returns a list of `dynamic` objects, where the properties of each dynamic object are determined by the returned rowset(s).