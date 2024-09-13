export class ObjectUtils {
    static DeepCopy = (inObject: Object | [] | any) => {
        let outObject: any
        let value
        let key: string

        if (typeof inObject !== 'object' || inObject === null) {
            return inObject
        }

        outObject = Array.isArray(inObject) ? [] : {}

        for (key in inObject) {
            value = inObject[key]
            outObject[key] = ObjectUtils.DeepCopy(value)
        }

        return outObject
    }

    static Clone(obj: any) {
        const clone: any = {}

        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                clone[key] = obj[key].slice(0)
            } else {
                clone[key] = obj[key]
            }
        }

        return clone
    }

    static Merge(obj1: any, obj2: any) {
        const clone = this.Clone(obj1)

        for (const key in obj2) {
            if (!clone.hasOwnProperty(key)) {
                clone[key] = obj2[key]
            }
        }

        return clone
    }

    static Extend(...args: any) {
        let options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false

        // Handle a deep copy situation
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {}

            // skip the boolean and the target
            i = 2
        }

        // extend Phaser if only one argument is passed
        if (length === i) {
            target = this
            --i
        }

        for (; i < length; i++) {
            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {
                // Extend the base object
                for (name in options) {
                    src = target[name]
                    copy = options[name]

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (this.IsPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : []
                        } else {
                            clone = src && this.IsPlainObject(src) ? src : {}
                        }

                        // Never move original objects, clone them
                        target[name] = this.Extend(deep, clone, copy)

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy
                    }
                }
            }
        }

        // Return the modified object
        return target
    }

    static IsPlainObject(obj: any) {
        // Not plain objects:
        // - Any object or value whose internal [[Class]] property is not "[object Object]"
        // - DOM nodes
        // - window
        if (typeof (obj) !== 'object' || obj.nodeType || obj === obj.window) {
            return false
        }

        // Support: Firefox <20
        // The try/catch suppresses exceptions thrown when attempting to access
        // the "constructor" property of certain host objects, ie. |window.location|
        // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
        try {
            if (obj.constructor && !({}).hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false
            }
        } catch (e) {
            return false
        }

        // If the function hasn't returned already, we're confident that
        // |obj| is a plain object, created by {} or constructed with new Object
        return true
    }

    static GetValue = function (source: any, key: string, defaultValue: any = null) {
        if (!source || typeof source === 'number') {
            return defaultValue
        } else if (source.hasOwnProperty(key)) {
            return source[key]
        } else if (key.indexOf('.') !== -1) {
            let keys = key.split('.')
            let parent = source
            let value = defaultValue

            //  Use for loop here so we can break early
            for (let i = 0; i < keys.length; i++) {
                if (parent.hasOwnProperty(keys[i])) {
                    //  Yes it has a key property, let's carry on down
                    value = parent[keys[i]]

                    parent = parent[keys[i]]
                } else {
                    //  Can't go any further, so reset to default
                    value = defaultValue
                    break;
                }
            }

            return value
        } else {
            return defaultValue
        }
    }
}