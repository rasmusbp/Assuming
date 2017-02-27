interface IAssumable<T> {
    then<U>(expr: any) : {
        assuming: IAssuming,
        otherwise(expr: any): {
            value<P>() : P | U
        },
        value<P>() : P | U
    };
    matches: IMatchesCallback;
    and: IAndOrCallback;
    or: IAndOrCallback;
}

interface IMatchesCallback<T> {
    <T>(expr: () => T | T) : {
        matches: IMatchesCallback
        otherwise<U>(expr: () => U | T): {
            value<P>(): P | T
        },
        value: <P>() => P | T
    }
}

interface IAndOrCallback<T> {
    <T>(expr: () => T | T) : {
        or: IAndOrCallback,
        and: IAndOrCallback
    }
}

export interface IAssuming {
    ( condition: any ) : IAssumable;
}