import { Properties } from "./properties.ts";
import { DuplicateKeyError, InvalidPropertyKeyError, NotAPropertiesFileError } from "./properties_error.ts";
import { assertThrowsAsync, assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts"
 
const props = new Properties();

const testfiles = [
    {
        file: "./testfile.properties",
        content: "A_KEY=A test key.\nA_SECOND_KEY =A second test key.\nA_THIRD_KEY = A third test key.\n\nA_FOURTH_KEY= A fourth test key.        \n"
    },
    {
        file: "./testfile2.properties",
        content: " = a test value\n= test value 2\nA Key = Test Value 3"
    },
    {
        file: "./testfile3.properties",
        content: "A_KEY=A test key.\nA_SECOND_KEY =A second test key.\nA_THIRD_KEY = A third test key.\n\n\nA_FOURTH_KEY= A fourth test key.\nA_FIFTH_KEY =a fifth test key\nA_SECOND_KEY =the second test key a second time."
    }
]

Deno.test("Assert Throws InvalidPropertyKeyError", async function (): Promise<void> {
    await assertThrowsAsync(
        async (): Promise<void> => {
            await Deno.writeTextFile(testfiles[1].file, testfiles[1].content);
            await props.load("./testfile2.properties");
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
    await Deno.remove("./testfile2.properties");
});


Deno.test("Assert Throws NotAPropertiesFileError", async function (): Promise<void> {
    await assertThrowsAsync(
        async (): Promise<void> => {
            await props.load("./testfile2.props");
        },
        NotAPropertiesFileError,
        "A properties file must have the file-ending of .properties!",
      );
});


Deno.test("Assert Throws DuplicateKeyError", async function (): Promise<void> {
    await assertThrowsAsync(
        async (): Promise<void> => {
            await Deno.writeTextFile(testfiles[2].file, testfiles[2].content);
            await props.load("./testfile3.properties");
        },
        DuplicateKeyError,
        "A properties file can not contain multiple keys of the same name!",
      );
      await Deno.remove("./testfile3.properties");
});


Deno.test("Assert Loading Test", async () => {
    await Deno.writeTextFile(testfiles[0].file, testfiles[0].content);

    await props.load("./testfile.properties");
    let propertyMap = props.properties;

    assertEquals(propertyMap.get("A_KEY"), "A test key.");
    assertEquals(propertyMap.get("A_SECOND_KEY"), "A second test key.");
    assertEquals(propertyMap.get("A_THIRD_KEY"), "A third test key.");
    assertEquals(propertyMap.get("A_FOURTH_KEY"), "A fourth test key.");

    await Deno.remove("./testfile.properties");
});

