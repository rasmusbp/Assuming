import {expect} from 'chai';
import assuming from '../src/assuming';

describe('methods', function () {
    describe('assuming()', function () {

        it('should take both a function and an expression as argument', () => {

            const result = assuming( 1 === 1 )
                .then('ok')
                .value();

            expect(result).to.equal('ok');

            const resultMethod = assuming(() => 1 === 0)
                .then('ok')
                .otherwise('not ok')
                .value();

            expect(resultMethod).to.equal('not ok');

        });

    });

    describe('then()', function () {

        it('should take both a function and an expression as argument', () => {

            const result = assuming( 1 === 1 )
                .then('ok')
                .value();

            expect(result).to.equal('ok');

            const resultMethod = assuming( 1 === 1 )
                .then(() => 'ok')
                .value();

            expect(resultMethod).to.equal('ok');

        });

    });

    describe('otherwise()', function () {

        it('should take both a function and an expression as argument', () => {

            const result = assuming( 1 === 0 )
                .then('ok')
                .otherwise('not ok')
                .value();

            expect(result).to.equal('not ok');

            const resultMethod = assuming( 1 === 0 )
                .then('ok')
                .otherwise(() => 'not ok')
                .value();

            expect(resultMethod).to.equal('not ok');

        });

    });

    describe('mathes()', function () {

        it('should take both a function and an expression as argument', () => {

            const result = assuming( 1 )
                .matches(1, 'ok')
                .value();

            expect(result).to.equal('ok');

            const resultMethod = assuming( 1 )
                .matches(1, () => 'ok')
                .value();

            expect(resultMethod).to.equal('ok');

            const resultMethod2 = assuming( 1 )
                .matches(() => 1, () => 'ok')
                .value();

            expect(resultMethod2).to.equal('ok');

        });

    });

    describe('and()', function () {

        it('should take both a function and an expression as argument', () => {

            const result = assuming( 1 === 1 )
                .and(1 === 1)
                .then('ok')
                .value();

            expect(result).to.equal('ok');

            const resultMethod = assuming( 1 === 1 )
                .and(() => 1 === 0)
                .then(() => 'ok')
                .otherwise('not ok')
                .value();

            expect(resultMethod).to.equal('not ok');

        });

    });

    describe('or()', function () {

        it('should take both a function and an expression as argument', () => {

            const result = assuming( 1 === 1 )
                .or(1 === 0)
                .then('ok')
                .value();

            expect(result).to.equal('ok');

            const resultMethod = assuming( 1 === 0 )
                .or(() => 1 === 0)
                .then(() => 'ok')
                .otherwise('not ok')
                .value();

            expect(resultMethod).to.equal('not ok');

        });

    });



});

describe('simple if/else statements', function () {

    it('should return the value of the `then` method if condition is truthy', () => {

        const result = assuming(1 === 1)
            .then('ok')
            .otherwise('not ok')
            .value();

            expect(result).to.equal('ok');

    });

    it('should return `undefined` condition is falsy, but no `otherwise` method is defined', () => {

        const result = assuming(1 === 0)
            .then('ok')
            .value();

        expect(result).to.equal(undefined);

    });

    it('should return the value of the `otherwise` method if condition is falsy', () => {

        const result = assuming(1 === 0)
            .then('ok')
            .otherwise('not ok')
            .value();

        expect(result).to.equal('not ok');

    });

});

describe('and/or gates', function () {

    it('should return the value of the `then` method if `and` condition is also truthy', () => {

        const result = assuming(1 === 1)
            .and(2 === 2)
            .then('ok')
            .otherwise('not ok')
            .value();

        expect(result).to.equal('ok');

    });

    it('should return the value of the `otherwise` method if `and` condition is falsy', () => {

        const result = assuming(1 === 1)
            .and(2 === 0)
            .then('ok')
            .otherwise('not ok')
            .value();

        expect(result).to.equal('not ok');

    });

    it('should be able to chain `and` methods ', () => {

        const result = assuming(1 === 1)
            .and(2 === 2)
            .and(3 === 3)
            .and(4 === 4)
            .then('ok')
            .otherwise('not ok')
            .value();

        expect(result).to.equal('ok');

        const result2 = assuming(1 === 1)
            .and(2 === 2)
            .and(3 === 3)
            .and(3 === 4)
            .then('ok')
            .otherwise('not ok')
            .value();

        expect(result2).to.equal('not ok');

    });

    it('should return the value of the `then` method if either "main" condition or `or` condition is truthy', () => {

        const result = assuming(1 === 1)
            .or(2 === 2)
            .then('ok')
            .otherwise('not ok')
            .value();

        expect(result).to.equal('ok');


        const result2 = assuming(1 === 0)
            .or(2 === 2)
            .then('ok')
            .otherwise('not ok')
            .value();

        expect(result2).to.equal('ok');

    });

    it('should return the value of the `otherwise` method if all of the `or` condition is false', () => {

        const result = assuming(1 === 0)
            .or(2 === 0)
            .or(3 === 0)
            .or(4 === 0)
            .then('ok')
            .otherwise('not ok')
            .value();

        expect(result).to.equal('not ok');

    });

   it('should be able to chain `and` + `or` methods', () => {

        const result = assuming(1 === 1)
            .and(2 === 0)
            .or(3 === 3)
            .then('ok')
            .otherwise('not ok')
            .value();

        expect(result).to.equal('ok');

        const result2 = assuming(1 === 1)
            .and(2 === 2)
            .or(3 === 0)
            .then('ok')
            .otherwise('not ok')
            .value();

        expect(result2).to.equal('ok');

       const result3 = assuming(1 === 1)
           .and(2 === 0)
           .or(3 === 0)
           .then('ok')
           .otherwise('not ok')
           .value();

       expect(result3).to.equal('not ok');

       const result4 = assuming(1 === 1)
           .and(2 === 2)
           .or(3 === 0)
           .or(4 === 4)
           .then('ok')
           .otherwise('not ok')
           .value();

       expect(result4).to.equal('ok');

       const result5 = assuming(1 === 1)
           .and(2 === 2)
           .or(3 === 3)
           .and(4 === 0)
           .then('ok')
           .otherwise('not ok')
           .value();

       expect(result5).to.equal('not ok');

       const result6 = assuming(1 === 1)
           .or(2 === 0)
           .and(4 === 4)
           .then('ok')
           .otherwise('not ok')
           .value();

       expect(result6).to.equal('ok');

       const result7 = assuming(1 === 1)
           .or(2 === 2)
           .and(4 === 0)
           .then('ok')
           .otherwise('not ok')
           .value();

       expect(result7).to.equal('not ok');

   });


});

describe('complex if/else if/else statements', function () {
    it('should be able to use the `assuming` method as a "else if" block', () => {

        const value = 2;
        const result =  assuming( value === 0)
            .then('is zero')
            .assuming( value === 1 )
            .then('is one')
            .assuming( value === 2 )
            .then('is two')
            .value();

        expect(result).to.equal('is two');

        const value2 = 1;
        const result2 =  assuming( value2 === 0 )
            .then('is zero')
            .assuming( value2 === 1 )
            .then('is one')
            .assuming( value2 === 2 )
            .then('is two')
            .value();

        expect(result2).to.equal('is one');

        const value3 = 3;
        const result3 =  assuming(value3 === 0)
            .then('is zero')
            .assuming( value3 === 1 )
            .then('is one')
            .assuming( value3 === 2 )
            .then('is two')
            .otherwise('no match')
            .value();

        expect(result3).to.equal('no match');

    });
});

describe('switch cases', function () {
    it('should be able to use `matches` methods as a "case" block', () => {

        const value = 3;
        const result = assuming(value)
            .matches(0, 'is zero')
            .matches(1, 'is one')
            .matches(2, 'is two')
            .matches(3, 'is three')
            .matches(4, 'is four')
            .value();

        expect(result).to.equal('is three');

    });

    it('in a `matches` chain the `otherwise` method should act like the `default` block', () => {

        const value = 3;
        const result = assuming(value)
            .matches(0, 'is zero')
            .matches(1, 'is one')
            .matches(2, 'is two')
            .otherwise('no match')
            .value();

        expect(result).to.equal('no match');

    });
});
