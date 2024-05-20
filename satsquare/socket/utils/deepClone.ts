type ObjectType = { [key: string]: any };

/**
 * Deeply clones the given object or array.
 * 
 * @param obj - The object or array to clone.
 * @returns A deep clone of the input object or array.
 */
const deepClone = <T>(obj: T): T => {
    // Handle null or non-object types (including functions)
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    // Handle Date objects
    if (obj instanceof Date) {
        return new Date(obj.getTime()) as unknown as T;
    }

    // Handle RegExp objects
    if (obj instanceof RegExp) {
        return new RegExp(obj) as unknown as T;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map((item) => deepClone(item)) as unknown as T;
    }

    // Handle objects
    const clonedObj: ObjectType = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            clonedObj[key] = deepClone((obj as ObjectType)[key]);
        }
    }

    return clonedObj as T;
};

export default deepClone;
