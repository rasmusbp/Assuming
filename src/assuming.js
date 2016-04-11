export default function assuming( condition ) {

    // chain states
    let isResolved = false;
    let valueHolder;
    let resolvedCondition = resolve(condition);

    const noopChain = {
        assuming: noop,
        then: noop,
        matches: noop,
        and: noop,
        or,
        otherwise,
        value
    };

    return { then, matches, or, and };

    function then( cb ) {
        if ( resolvedCondition ) {
            isResolved = true;
            valueHolder = resolve(cb);
            return noopChain;
        }
        return { assuming, otherwise, value };
    }

    function or( orCondition ) {
        const resolvedOrCondtion = resolve( orCondition );
        if ( !(resolvedCondition || resolvedOrCondtion) ) {
            return noopChain;
        }
        resolvedCondition = resolvedOrCondtion;
        return { then, matches, or, and };

    }

    function and( andCondition ) {
        return (resolvedCondition && resolve( andCondition )) ? { then, matches, or, and } : noopChain;
    }

    function matches( value, cb ) {
        if ( resolve(value, resolvedCondition) === resolvedCondition ) {
            isResolved = true;
            valueHolder = resolve(cb, resolvedCondition);
            return noopChain;
        }
        return { matches, otherwise, value };
    }

    function otherwise( cb ) {
        if ( !isResolved ) valueHolder = resolve(cb);
        return {value};
    }

    function value() { return valueHolder }
    function resolve( cb, arg ) { return (typeof cb === 'function') ? cb.call(null, arg) : cb }
    function noop() { return noopChain }

}
