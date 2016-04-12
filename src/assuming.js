export default function assuming( condition ) {

    // chain states
    let _isChainResolved = false;
    let _valueHolder;
    let _condition = resolve(condition);

    const _fallthrough = {
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
        return _condition
                ? resolveChain(cb)
                : { assuming, otherwise, value };
    }

    function or( condition ) {
        return (_condition = _condition || resolve( condition ))
                ? { then, matches, or, and }
                : _fallthrough;

    }

    function and( condition ) {
        return (_condition = _condition && resolve( condition ))
                ? { then, matches, or, and }
                : _fallthrough;
    }

    function matches( value, cb ) {
        return ( resolve(value, _condition) === _condition )
                ? resolveChain(cb)
                : { matches, otherwise, value };
    }

    function otherwise( cb ) {
        resolveChain(cb);
        return {value};
    }

    function resolveChain(cb) {
        if ( !_isChainResolved ) {_valueHolder = resolve(cb, _condition); }
        _isChainResolved = true;
        return _fallthrough;
    }
    function value() { return _valueHolder }
    function resolve( cb, arg ) { return (typeof cb === 'function') ? cb.call(null, arg) : cb }
    function noop() { return _fallthrough }

}
