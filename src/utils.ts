import { PROPERTIES_FILE_ENDING } from "./constants.ts"
import { NotAPropertiesFileError } from "./propertiesError.ts"

/**
 * Removes empty spaces left and right of the string.
 */
export function sanitizeString(s: string):string {
    if(s.startsWith(" ")) {
        s = s.trimStart();
    } 
    if(s.endsWith(" ")) {
        s = s.trimEnd();
    }
    return s;
}

/**
 * Converts the map to a string.
 * @param input A map of property key and values.
 * @returns Returns a string with concatenated key value pairs with line breaks.
 */
export function mapToString(input: Record<string, string>):string {
    const result: string[] = [];

    for(const [key, value] of Object.entries(input)) {
        result.push(`${key}=${value}`)
    }

    return result.join('\n');
}

/**
 * Check if the string is a valid property key.
 * @param key The string to check.
 * @returns Returns true if the string is a valid property key. Otherwise, return false.
 */
export function keyIsValid(key?: string):boolean {
    if(!key) {
        return false
    }
    // Contains white space.
    return !key.match(/\s+/);
}

/**
 * Check if file path is a properties file.
 * Throws an {@link NotAPropertiesFileError} if it is not the case.
 * @param path File path to check.
 */
export function requiresPropertyFileEnding(path: string): void {
    if(!path.endsWith(PROPERTIES_FILE_ENDING)) {
        throw new NotAPropertiesFileError("A properties file must have the file-ending of .properties!");
    }
}
