//排序
var dataStore = [72, 1, 68, 95, 75, 54, 58, 10, 35, 6, 28, 13, 88, 99, 31, 78, 2, 77, 82, 72];
//1、冒泡排序
function bubbleSort(data) {
  var temp = 0;
  for (var i = data.length; i > 0; i--) {
    for (var j = 0; j < i - 1; j++) {
      if (data[j] > data[j + 1]) {
        temp = data[j];
        data[j] = data[j + 1];
        data[j + 1] = temp;
      }
    }
  }
  return data;
}
// console.log(bubbleSort(dataStore));

//2、选择排序
function selectSort(data) {
  for (var i = 0; i < data.length; i++) {
    var min = data[i];
    var temp;
    var index = i;
    for (var j = i + 1; j < data.length; j++) {
      if (data[j] < min) {
        min = data[j];
        index = j;
      }
    }
    temp = data[i];
    data[i] = min;
    data[index] = temp;
  }
  return data;
}
// console.log(selectSort(dataStore))

//3、插入排序
function insertionSort(data) {
  var len = data.length;
  for (var i = 1; i < len; i++) {
    var key = data[i];
    var j = i - 1;
    while (j >= 0 && data[j] > key) {
      data[j + 1] = data[j];
      j--;
    }
    data[j + 1] = key;
  }
  return data;
}
// console.log(insertionSort(dataStore));

//4、希尔排序
function shallSort(data) {
  var increment = data.length;
  var i;
  var temp;
  do {
    increment = Math.floor(increment / 3) + 1;
    for (i = increment; i < data.length; i++) {
      if (data[i] < data[i - increment]) {
        temp = data[i];
        for (var j = i - increment; j >= 0 && temp < data[j]; j -= increment) {
          data[j + increment] = data[j];
        }
        data[j + increment] = temp;
      }
    }
  }
  while (increment > 1);
  return data;
}
// console.log(shallSort(dataStore));

//5、归并排序
function mergeSort(data) {
  var len = data.length;
  if (len < 2) {
    return data;
  }
  var middle = Math.floor(len / 2);
  var left = data.slice(0, middle);
  var right = data.slice(middle);
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  var result = [];
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }
  while (left.length) {
    result.push(left.shift())
  }
  while (right.length) {
    result.push(right.shift())
  }
  return result;
}
// console.log(mergeSort(dataStore));

//6、快速排序
function quickSort(data) {
  if (data.length == 0) {
    return [];
  }
  var left = [];
  var right = [];
  var pivot = data[0];
  for (var i = 1; i < data.length; i++) {
    if (data[i] < pivot) {
      left.push(data[i]);
    } else {
      right.push(data[i]);
    }
  }
  return quickSort(left).concat(pivot, quickSort(right));
}
console.log(quickSort(dataStore));