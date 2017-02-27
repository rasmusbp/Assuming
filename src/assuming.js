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

    function then( expr ) {
        return _condition
                ? resolveChain(expr)
                : { assuming, otherwise, value };
    }

    function or( condition ) {
        return (_condition = _condition || resolve( condition ))
                ? { then, or, and }
                : _fallthrough;

    }

    function and( condition ) {
        return (_condition = _condition && resolve( condition ))
                ? { then, or, and }
                : _fallthrough;
    }

    function matches( value, expr ) {
        return ( resolve(value, _condition) === _condition )
                ? resolveChain(expr)
                : { matches, otherwise, value };
    }

    function otherwise( expr ) {
        resolveChain(expr);
        return {value};
    }

    function resolveChain(expr) {
        if ( !_isChainResolved ) {_valueHolder = resolve(expr, _condition); }
        _isChainResolved = true;
        return _fallthrough;
    }
    function value() { return _valueHolder }
    function resolve( expr, arg ) { return (typeof expr === 'function') ? expr.call(null, arg) : expr }
    function noop() { return _fallthrough }

}