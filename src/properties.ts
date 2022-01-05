import {
  DuplicateKeyError,
  InvalidPropertyKeyError,
} from "./propertiesError.ts";
import {
  keyIsValid,
  mapToString,
  requiresPropertyFileEnding,
  sanitizeString,
} from "./utils.ts";

export interface IProperties {
  [key: string]: string;
}

/**
 * Proprties class to create and load .properties files.
 */
export class Properties {
  /**
   * Constructs a property instance.
   * Optionally with a given Map.
   * @param properties Optional argument. Initializes a new map if no Map is passed.
   */
  constructor(public readonly properties: IProperties = {}) {
    this.validateKeys(properties);
  }

  /**
   * Check the keys of the given Map.
   * @param map Map to be checked.
   */
  private validateKeys(map: IProperties): void {
    for (const key of Object.keys(map)) {
      if (!keyIsValid(sanitizeString(key))) {
        throw new InvalidPropertyKeyError(
          "Keys can not be empty or contain whitespaces!",
        );
      }
    }
  }

  /**
   * Writes the values of the map in a .properties file.
   * @param filePath The .properties file path where the properties should be written.
   */
  async store(filePath: string): Promise<void> {
    requiresPropertyFileEnding(filePath);

    const propertiesInput = mapToString(this.properties);

    if (propertiesInput) {
      Deno.writeTextFile(filePath, propertiesInput);
    }
  }

  /**
   * Reads a .properties file and store the key value pairs in a map.
   * The keys can not be empty or contain whitespaces.
   * On load the old properties will be discarded.
   *
   * @param filePath The path of the .properties that should be loaded.
   */
  async load(filePath: string): Promise<void> {
    requiresPropertyFileEnding(filePath);

    const decoder = new TextDecoder("utf-8");
    const rawProperties: string = decoder.decode(await Deno.readFile(filePath));

    this.parse(rawProperties);
  }

  /**
   * Reads the properties string.
   * Expects format: "PROPERTY_1=value1\nPROPERTY_2=value2\n..."
   * @param text String containing properties.
   */
  parse(text: string): void {
    const propertyLine: string[] = text.split("\n");

    propertyLine.forEach((element) => {
      if (element.match(/.+=.+/)) {
        // Index 0 contains key and index 1 contains value
        const tokens: string[] = element.split("=");
        const key: string = sanitizeString(tokens[0]);
        // Fallback if value is undefined to empty string
        const value: string = tokens[1] || "";

        if (keyIsValid(key)) {
          if (!this.properties[key]) {
            this.properties[key] = value.trimStart().trimEnd();
          } else {
            throw new DuplicateKeyError(
              "A properties file can not contain multiple keys of the same name!",
            );
          }
        } else {
          throw new InvalidPropertyKeyError(
            "Keys can not be empty or contain whitespaces!",
          );
        }
      }
    });
  }
}
