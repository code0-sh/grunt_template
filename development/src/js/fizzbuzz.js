var fizzbuzz = function(n) {
    'use strict';
    if (n % 3 === 0 && n % 5 === 0) {
        return 'FizzBuzz';
    } else if (n % 3 === 0) {
        return 'Fizz';
    } else if (n % 5 === 0) {
        return 'Buzz';
    } else {
        return n;
    }
};