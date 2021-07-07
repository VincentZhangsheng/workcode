//原型链继承
function Person(name) {
	this.name = name
}
Person.prototype.sayName = function() {
	console.log(this.name)
}

function Student() {}
Student.prototype = new Person();

//构造函数继承
function Person(name) {
	this.name = name;
	this.sayName = function() {
		console.log(this.name)
	}
}

function Student(name) {
	Person.call(this, name)
}
Student.prototype = new Person();

//寄生组合继承
function Person(name) {
	this.name = name;
}
Person.prototype.sayName = function() {
	console.log(this.name)
}

function Student(name, grade) {
	Person.call(this, name);
	this.grade = grade;
}
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;
Student.prototype.sayGrade = function() {
	console.log(this.grade);
}

//es6 class继承
class Person {
	constructor(name) {
		this.name = name;
	}
	sayName() {
		console.log(this.name)
	}
}
class Student extends Person {
	constructor(name, grade) {
		super(name)
		this.grade = grade
	}
}

//防抖
function debounce(fn, wait, immediate) {
	var timer = null;
	return function() {
		var context = this;
		var args = arguments;
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		timer = setTimeout(() => {
			fn.apply(context, args);
		}, wait);
	}
}
//防抖+立即执行
function debounce(fn, wait, immediate) {
	var timer = null,
		result;
	var debounced = function() {
		var context = this;
		var args = arguments;
		if (timer) {
			clearTimeout(timer)
		}
		if (immediate) {
			var callNow = !timer;
			timer = setTimeout(function() {
				timer = null
			}, wait)
			if (callNow) result = fn.apply(context, args);
		} else {
			timer = setTimeout(function() {
				fn.apply(context, args)
			}, wait)
		}
		return result
	}
	debounced.cancel = function() {
		clearTimeout(timer);
		timer = null;
	}
	return debounced;
}

//节流
function throttle(fn, delay) {
	var preTime = Date.now();
	return function() {
		var context = this;
		var args = arguments;
		var nowTime = Date.now();
		if (nowTime - preTime >= delay) {
			preTime = Date.now();
			return fn.apply(context, args);
		}
	}
}
/* 
节流 + 支持取消
options.leading 来表示是否可以立即执行一次，
opitons.trailing 表示结束调用的时候是否还要执行一次，默认都是 true。
注意设置的时候不能同时将 leading 或 trailing 设置为 false。 
*/
function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if(!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if(!timeout) context = args = null;
  }

  var throttled = function() {
    var _now = Date.now();
    if (!previous && options.leading === false) previous = _now;
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if(remaining <= 0 && remaining > wait) {
      if(timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if(!timeout) context = args = null;
    } else if(!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  }

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  }

  return throttled;
}

//柯里化
function curry(fn) {
	return function curried(...args) {
		if (args.length == fn.length) {
			return fn.apply(this, args);
		} else {
			return function(...arg) {
				return curried.apply(this, args.concat(arg))
			}
		}
	}
}

/*
 * call
 * 使用一个指定的this和一个或多个参数来调用一个函数
 * this可能传入null;
 * 传入不固定个数的参数;
 * 函数可能有返回值
 */
Function.prototype.myCall = function(context) {
	if(typeof this !== "function") {
		throw new TypeError("error")
	}
	context = context || window;
	let args = [...arguments].slice(1), result = null;
	context.fn = this;
	result = context.fn(...args);
	delete context.fn;
	return result;
}

/*
 * apply
 * 使用一个指定的this和不固定个数参数来调用一个函数
 * this可能传入null;
 * 传入一个数组;
 * 函数可能有返回值
 */
Function.prototype.myApply = function(context) {
	if(typeof this !== "function") {
		throw new TypeError("error");
	}
	let result = null;
	context = context || window;
	context.fn = this;
	if(arguments[1]) {
		result = context.fn(...arguments[1]);
	} else {
		result = context.fn()
	}
	delete context.fn;
	return result;
}

/*
 * bind
 * 创建一个新的函数，在bind被调用时，这个新函数的this被指定为bind的第一个参数，
 * 而其余参数将作为新函数的参数，供使用时调用
 * 改变this指向;
 * 接受参数列表;
 * return一个函数；
 * 遇到new这样优先级高于bind方法的时候，bind改变this指向会无效
 */
Function.prototype.myBind = function(context) {
	var self = this;
	var args = [...arguments].slice(1);
	var fb = function() {
		var bindArgs = [...arguments].slice(1);
		return self.apply(this instanceof fb ? fb : context, args.concat(bindArgs));
	}
	var fn = function() {}
	fn.prototype = this.prototype;
	fb.prototype = new fn();
	return fb;
}

//类型判断
function getObjectType(obj) {
	if (typeof obj !== 'object') {
		return typeof obj;
	}
	return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');
}

//深拷贝
function deepClone(obj, map = new WeakMap()) {
	if (map.get(obj)) return obj;
	if (obj instanceof Date) return new Date(obj);
	if (obj instanceof RegExp) return new RegExp(obj);
	if (typeof obj === "object" || typeof obj === "function") {
		map.set(obj, true);
		let cloneObj = Array.isArray(obj) ? [] : {};
		for (let prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				cloneObj[prop] = deepClone(obj[prop], map)
			}
		}
		return cloneObj
	} else {
		return obj;
	}
}

//LazyMan
function _LazyMan(name) {
  this.name = name;
  this.tasks = [];
  this.default();
  var _this = this;
  setTimeout(function() {
    _this.next();
  }, 0)
}
_LazyMan.prototype.default = function() {
  var _this = this;
  var task = function() {
    console.log(`Hi! this is ${_this.name}`);
    _this.next();
  }
  this.tasks.push(task);
  return this;
}
_LazyMan.prototype.next = function(){
  var task = this.tasks.shift();
  task && task();
}
_LazyMan.prototype.sleep = function(num) {
  var _this = this;
  var task = function() {
    setTimeout(function() {
      console.log(`wait for ${num}`);
      _this.next();
    }, num * 1000)
  }
  this.tasks.push(task);
  return this;
}
_LazyMan.prototype.sleepFirst = function(num) {
  var _this = this;
  var task = function() {
    setTimeout(function() {
      console.log(`Wait first after ${num}`);
      _this.next();
    }, 1000 * num)
  }
  this.tasks.unshift(task);
  return this;
}
_LazyMan.prototype.eat = function(some) {
  var task = function() {
    console.log(`Eating ${some}`)
  }
  this.tasks.push(task);
  return this;
}
function LazyMan(name) {
  return new _LazyMan(name)
}

//promise
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(excutor) {
	this.status = PENDING;
	this.value = undefined;
	this.reason = undefined;

	fulfilledCallback = [];
	rejectedCallback = [];

	const resolve = value => {
		if (this.status === PENDING) {
			this.status = FULFILLED;
			this.value = value;
			setTimeout(() => {
				this.fulfilledCallback.forEach(fn => fn(value))
			})
		}
	}

	const reject = reason => {
		if (this.status === PENDING) {
			this.status = REJECTED;
			this.reason = reason;
			setTimeout(() => {
				this.rejectedCallback.forEach(fn => fn(reason))
			})
		}
	}

	try {
		excutor(resolve, reject)
	} catch (err) {
		throw err;
	}
}
MyPromise.prototype.then = function(onResolve, onReject) {
	onResolve = typeof onResolve === "function" ? onResolve : value => value;
	onReject = typeof onReject === "function" ? onReject : reason => {
		throw reason
	};

	return new MyPromise((resolve, reject) => {
		function handleFunc(func, value) {
			try {
				const result = func(value);
				if (result instanceof MyPromise) {
					result.then(resolve, reject);
				} else {
					resolve(result)
				}
			} catch (err) {
				reject(err)
			}
		}

		if (this.status === FULFILLED) {
			setTimeout(() => {
				handleFunc(onResolve, this.value);
			});
		}

		if (this.status === REJECTED) {
			setTimeout(() => {
				handleFunc(onReject, this.reason)
			})
		}

		if (this.status === PENDING) {
			this.fulfilledCallback.push(value => {
				handleFunc(onResolve, value)
			})
			this.rejectedCallback.push(reason => {
				handleFunc(onReject, reason)
			})
		}
	})
}
MyPromise.reject = function(reason) {
	return new MyPromise((resolve, reject) => {
		reject(reason)
	})
}
MyPromise.resolve = function(value) {
	return new MyPromise((resolve, reject) => {
		if (value instanceof MyPromise) {
			value.then(resolve, reject);
		} else {
			resolve(value)
		}
	})
}
MyPromise.all = function(promiseArr) {
	let index = 0,
		result = [];
	return new MyPromise((resolve, reject) => {
		promiseArr.forEach((p, i) => {
			MyPromise.resolve(p).then(val => {
				index++;
				result[i] = val;
				if (index === promiseArr.length) {
					resolve(result)
				}
			}, err => {
				reject(err)
			})
		})
	})
}
MyPromise.race = function(promiseArr) {
  return new MyPromise((resolve, reject) => {
    promiseArr.forEach(p => {
      MyPromise.resolve(p).then(val => {
        resolve(val)
      }, err => {
        reject(err)
      })
    })
  })
}