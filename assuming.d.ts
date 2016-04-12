interface IThenCallback {
    ( cb: Function | any ): {
        assuming: IAssuming,
        otherwise: IOtherwiseCallback,
        value<T>(): T
    }
}

interface IOtherwiseCallback {
    ( cb: Function | any ): {
        value<T>(): T
    }
}

interface IMatchesCallback {
    (cb: Function | any, value: any ): {
        otherwise: IOtherwiseCallback,
        value<T>(): T
    }
}

interface IAndOrCallback {
    (cb: Function | any): {
        then: IThenCallback,
        or: IAndOrCallback,
        and: IAndOrCallback
    }
}

export interface IAssuming {
    ( condition: any ) : {

        // Then method
        then<T>(cb: () => T | any) : {
            assuming: IAssuming,
            otherwise<T>(cb: () => T | any): {
                value<P>(): T | P
            },
            value<P>(): P
        }

    }
}