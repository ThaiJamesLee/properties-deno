import { DuplicateKeyError, InvalidPropertyKeyError, NotAPropertiesFileError } from "./properties_error.ts";

const propertiesFileEnding = ".properties";


class Properties {

    properties: Map<string, string>;

    constructor(properties?: Map<string, string>) {
        if(properties) {
            this.validateKeys(properties);
            this.properties = properties;
        } else {
            this.properties = new Map();
        }
    }

    private validateKeys(map:Map<string, string>) {
        map.forEach((key, values) => {
            if(!keyIsValid(sanitizeString(key))) {
                throw new InvalidPropertyKeyError('Keys can not be empty or contain whitespaces!');
            }
        });
    }

    /**
     * Writes the values of the map in a .properties file.
     * @param filePath The .properties file path where the properties should be written.
     */
    async store(filePath: string) {
        requiresPropertyFileEnding(filePath);

        let propertiesInput = this.mapToString(this.properties);
    
        if(propertiesInput) {
            Deno.writeTextFile(filePath, propertiesInput);
        } 
    }


    /**
     * Reads a .properties file and store the key value pairs in a map. 
     * The keys can not be empty or contain whitespaces.
     * On load the old properties will be discarded.
     * 
     * @param filePath The path of the .properties that should be loaeded.
     */
    async load(filePath: string) {
        requiresPropertyFileEnding(filePath);

        this.properties = new Map();

        let decoder = new TextDecoder('utf-8');
        let rawProperties:string = decoder.decode(await Deno.readFile(filePath));

        let propertyLine: string[] = rawProperties.split("\n");
    
        propertyLine.forEach(element => {
            if(element.match(/.+=.+/)) {
                let tokens: string[] = element.split("=");
                let key: string = tokens[0];
                key = sanitizeString(key);
                let value = tokens[1];
                
                if(keyIsValid(key)) {
                    if(!this.properties.has(key)) {
                        this.properties.set(key, value.trimStart().trimEnd());
                    } else {
                        throw new DuplicateKeyError('A properties file can not contain multiple keys of the same name!');
                    }
                } else {
                    throw new InvalidPropertyKeyError('Keys can not be empty or contain whitespaces!');
                }
            }
        });

    }

    private mapToString(input:Map<string, string>) {
        let result: string = "";

        input.forEach((key, value) => {
            result += `${key}=${value}\n`;
        });

        return result;
    }

}

// assume already sanitizeString method called
function keyIsValid(key: string) {
    if(key) {
        if(key.match(/\s+/)) {
            return false;
        }
        return true;
    }
    return false;
}

function sanitizeString(s: string) {
    if(s.startsWith(" ")) {
        s = s.trimLeft();
    } 
    if(s.endsWith(" ")) {
        s = s.trimRight();
    }
    return s;
}

function requiresPropertyFileEnding(path: string): void {
    if(!path.endsWith(propertiesFileEnding)) {
        throw new NotAPropertiesFileError("A properties file must have the file-ending of .properties!");
    }
}


export { Properties }