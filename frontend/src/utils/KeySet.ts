/**
 * A primary-key mapped storage for string-indexable objects.
 */
export class KeySet<Type> {
    pkKey: keyof Type
    container: {[key: string]: Type}

    constructor(pkKey: keyof Type) {
        this.pkKey = pkKey
        this.container = {}
    }

    /**
     * Get the `pk` of an object for this {@link KeySet}.
     *
     * @param obj - The object to get the `pk` of.
     * @throws Error - If the obtained `pk` is not a `string`.
     */
    pk(obj: Type): string {
        const pk = obj[this.pkKey]
        if(typeof pk !== "string") {
            throw new Error(`Failed to get pk from ${obj}`)
        }
        return pk
    }

    /**
     * Add or replace an object to this {@link KeySet}.
     *
     * @param obj - The object to add/replace.
     * @throws Error - If the obtained `pk` is not a `string`.
     */
    put(obj: Type): void {
        const pk = this.pk(obj)
        this.container[pk] = obj
    }

    /**
     * {@link put Put} all the objects in the array to this {@link KeySet}.
     *
     * @param objs - The array of objects to {@link put}.
     * @throws Error - If the obtained `pk` is not a `string`.
     */
    putAll(objs: Type[]): void {
        objs.forEach(obj => this.put(obj))
    }

    /**
     * Remove and return an object from this {@link KeySet}.
     *
     * @param pk - The key of the object to remove.
     */
    pop(pk: string): Type {
        const val = this.container[pk]
        delete this.container[pk]
        return val
    }

    /**
     * Return the object with a certain `pk`.
     *
     * @param pk - The key of the object to get.
     */
    get(pk: string): Type {
        const val = this.container[pk]
        return val
    }
}
