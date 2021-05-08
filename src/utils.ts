import { PROPERTIES_FILE_ENDING } from "./constants.ts"
import { NotAPropertiesFileError } from "./properties_error.ts"

/**
 * Removes empty spaces left and right of the string.
 */
export function sanitizeString(s: string):string {
    if(s.startsWith(" ")) {
        s = s.trimLeft();
    } 
    if(s.endsWith(" ")) {
        s = s.trimRight();
    }
    return s;
}

/**
 * Converts the map to a string.
 * @param input A map of property key and values.
 * @returns Returns a string with concatenated key value pairs with line breaks.
 */
export function mapToString(input: Map<string, string>):string {
    let result: string = "";

    input.forEach((value, key) => {
        result += `${key}=${value}\n`;
    });

    return result;
}

// assume already sanitizeString method called
export function keyIsValid(key: string):boolean {
    if(key) {
        if(key.match(/\s+/)) {
            return false;
        }
        return true;
    }
    return false;
}


export function requiresPropertyFileEnding(path: string): void {
    if(!path.endsWith(PROPERTIES_FILE_ENDING)) {
        throw new NotAPropertiesFileError("A properties file must have the file-ending of .properties!");
    }
}
