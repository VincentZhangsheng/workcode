var floatObj = function () {
  function isInteger(obj) {
    return Math.floor(obj) === obj
  }

  function toInteger(floatNum) {
    var ret = {
      times: 1,
      num: 0
    };
    if (isInteger(floatNum)) {
      ret.num = floatNum;
      return ret
    }

    var strfi = floatNum + '',
      dotPos = strfi.indexOf('.'),
      len = strfi.substr(dotPos + 1).length,
      times = Math.pow(10, len),
      intNum = parseInt(floatNum * times + 0.5, 10);

    ret.times = times;
    ret.num = intNum;
    return ret;
  }

  function operation(a, b, digits, op) {
    var o1 = toInteger(a),
      o2 = toInteger(b),
      n1 = o1.num,
      n2 = o2.num,
      t1 = o1.times,
      t2 = o2.times,
      max = t1 > t2 ? t1 : t2,
      result = null;

    switch (op) {
      case 'add':
        if (t1 === t2) {
          result = n1 + n2;
        } else if (t1 > t2) {
          result = n1 + n2 * (t1 / t2)
        } else {
          result = n1 * (t2 / t1) + n2
        }
        return result / max;

      case 'subtract':
        if (t1 === t2) {
          result = n1 - n2;
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2);
        } else {
          result = n1 * (t2 / t1) - n2;
        }
        return result / max;

      case 'multiply':
        result = (n1 * n2) / (t1 * t2);
        return result;

      case 'divide':
        result = (n1 / n2) * (t2 / t1);
        return result;
    }
  }

  function add(a, b, digits) {
    return operation(a, b, digits, 'add');
  }

  function subtract(a, b, digits) {
    return operation(a, b, digits, 'substact');
  }

  function multiply(a, b, digits) {
    return operation(a, b, digits, 'multiply');
  }

  function divide(a, b, digits) {
    return operation(a, b, digits, 'divide');
  }

  return {
    add: add,
    subtract: subtract,
    multiply: multiply,
    divide: divide
  }
}();
console.log(floatObj.add(1.2, 3.1));