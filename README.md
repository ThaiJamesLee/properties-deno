![CI](https://github.com/ThaiJamesLee/properties-deno/workflows/CI/badge.svg) [![nest badge](https://nest.land/badge.svg)](https://nest.land/package/properties_deno)


# properties-deno

A tool to read and write .properties files.

## usage

It is possible to initialize and load properties from a file.
```
const props = new Properties();

// load a properties file
props.load("path/to/file.properties");

```

The `store` function allows to write the properties in the Properties object to be stored in a file.

```
const props = new Properties();

// store a properties file
props.store("path/to/file.properties");
```

`Properties` can also be initialized with a `Map` as an argument in the constructor.
The keys in .properties files can not contain whitespaces.

```
const map: Map = new Map();
map.set("A_KEY", "This is a value.");

const props = new Properties(map);
```
