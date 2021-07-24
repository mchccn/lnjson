import fs from "fs";
import path from "path";

const main = require.main?.path ?? process.cwd();

export default function lnjson<T extends any = any>(ln: string, interval: number = 0): T {
    if (interval < 0) throw new Error(`Linked JSON save interval must be a positive number.`);

    let target = {};

    try {
        if (!fs.existsSync(path.join(main, ln))) {
            fs.writeFileSync(path.join(main, ln), "{}");
        } else {
            target = JSON.parse(fs.readFileSync(path.join(main, ln), "utf8"));
        }
    } catch {
        throw new Error(`Unable to initiate linked JSON.`);
    }

    const save = () => fs.writeFileSync(path.join(main, ln), JSON.stringify(target, undefined, 4));

    if (interval) setInterval(save, interval);

    return new Proxy(target, {
        apply() {
            throw new Error(`Cannot call linked JSON as a function.`);
        },
        construct() {
            throw new Error(`Cannot use the 'new' operator with linked JSON.`);
        },
        defineProperty(target, p, attributes) {
            try {
                return Reflect.defineProperty(target, p, attributes);
            } finally {
                if (!interval) save();
            }
        },
        deleteProperty(target, p) {
            try {
                return Reflect.deleteProperty(target, p);
            } finally {
                if (!interval) save();
            }
        },
        getOwnPropertyDescriptor(target, p) {
            return Reflect.getOwnPropertyDescriptor(target, p);
        },
        get(target, p, receiver) {
            return Reflect.get(target, p, receiver);
        },
        has(target, p) {
            return Reflect.has(target, p);
        },
        set(target, p, value, receiver) {
            try {
                return Reflect.set(target, p, value, receiver);
            } finally {
                if (!interval) save();
            }
        },
        ownKeys(target) {
            return Reflect.ownKeys(target);
        },
        isExtensible(target) {
            return Reflect.isExtensible(target);
        },
        preventExtensions(target) {
            return Reflect.preventExtensions(target);
        },
        getPrototypeOf(target) {
            return Reflect.getPrototypeOf(target);
        },
        setPrototypeOf(target, prototype) {
            return Reflect.setPrototypeOf(target, prototype);
        },
    }) as T;
}
