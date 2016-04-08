export default function assuming( condition ) {

    const resolvedCondition = resolve(condition);

    let valueHolder;
    const noopChain = {
        assuming: noop,
        otherwise: noop,
        then: noop,
        matches: noop,
        value
    };

    return { then, matches };

    function then( cb ) {
        if ( resolvedCondition ) {
            valueHolder = resolve(cb);
            return noopChain;
        }
        return { assuming, otherwise, value };
    }

    function matches( value, cb ) {
        if ( resolve(value, resolvedCondition) === resolvedCondition ) {
            valueHolder = resolve(cb, resolvedCondition);
            return noopChain;
        }
        return { matches, otherwise, value };
    }

    function otherwise( cb ) {
        valueHolder = resolve(cb);
        return {value};
    }

    function value() { return valueHolder }
    function resolve( cb, arg ) { return (typeof cb === 'function') ? cb.call(null, arg) : cb }
    function noop() { return noopChain }

}
