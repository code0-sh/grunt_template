/*global fizzbuzz*/
describe('1から始まる整数を変換する', function() {
    'use strict';
    it('3の倍数のときはFizzを返す', function() {
        expect(fizzbuzz(3)).toEqual('Fizz');
    });
    it('5の倍数のときはBuzzを返す', function() {
        expect(fizzbuzz(5)).toEqual('Buzz');
    });
    it('3の倍数かつ5の倍数のときFizzBuzzを返す', function() {
        expect(fizzbuzz(15)).toEqual('FizzBuzz');
    });
    it('3と5の倍数以外はその数字を返す', function(){
      expect(fizzbuzz(2)).not.toEqual('Fizz');
      expect(fizzbuzz(2)).not.toEqual('Buzz');
      expect(fizzbuzz(2)).not.toEqual('FizzBuzz');
      expect(fizzbuzz(1)).toEqual(1);
      expect(fizzbuzz(2)).toEqual(2);
      expect(fizzbuzz(4)).toEqual(4);
    });
});
