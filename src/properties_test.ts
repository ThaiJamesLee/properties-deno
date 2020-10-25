import { Properties } from "./properties.ts";
import { DuplicateKeyError, InvalidPropertyKeyError, NotAPropertiesFileError } from "./properties_error.ts";
import { assertThrowsAsync, assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts"
 
const props = new Properties();
            

Deno.test("Assert Throws InvalidPropertyKeyError", async function (): Promise<void> {
    await assertThrowsAsync(
        async (): Promise<void> => {
            await props.load("testfile2.properties");
        },
        InvalidPropertyKeyError,
        "Keys can not be empty or contain whitespaces!",
      );

    await assertThrowsAsync(
        async (): Promise<void> => {
            let map = new Map();
            map.set("A Key", "Test value")

            let prop = new Properties(map);
        },
        InvalidPropertyKeyError,
        "Keys can not be empty or contain whitespaces!",
    );
});


Deno.test("Assert Throws NotAPropertiesFileError", async function (): Promise<void> {
    await assertThrowsAsync(
        async (): Promise<void> => {
            await props.load("testfile2.props");
        },
        NotAPropertiesFileError,
        "A properties file must have the file-ending of .properties!",
      );
});


Deno.test("Assert Throws DuplicateKeyError", async function (): Promise<void> {
    await assertThrowsAsync(
        async (): Promise<void> => {
            await props.load("testfile3.properties");
        },
        DuplicateKeyError,
        "A properties file can not contain multiple keys of the same name!",
      );
});


Deno.test("Assert Loading Test", async () => {
    await props.load("testfile.properties");
    let propertyMap = props.properties;

    assertEquals(propertyMap.get("A_KEY"), "A test key.");
    assertEquals(propertyMap.get("A_SECOND_KEY"), "A second test key.");
    assertEquals(propertyMap.get("A_THIRD_KEY"), "A third test key.");
    assertEquals(propertyMap.get("A_FOURTH_KEY"), "A fourth test key.");
});

