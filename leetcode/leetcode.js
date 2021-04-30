//1两数之和
var twoSum = function(nums, target) {
	let map = new Map();
	for (let i = 0; i < nums.length; i++) {
		if (map.has(target - nums[i])) {
			return [map.get(target - nums[i]), i];
		} else {
			map.set(nums[i], i)
		}
	}
	return [];
}

//三数之和 15
var threeSum = function(nums) {
	if (!nums || nums.length < 3) return;
	let res = [],
		len = nums.length;
	nums.sort((a, b) => a - b);
	for (let i = 0; i < len - 2; i++) {
		if (nums[i] > 0) break;
		if (i > 0 && nums[i] === nums[i - 1]) continue;
		let map = new Map();
		for (let j = i + 1; j < len; j++) {
			if (map.has(nums[j])) {
				res.push(map.get(nums[j]).concat([nums[j]]))
			} else {
				let mark = 0 - nums[i] - nums[j];
				map.set(mark, [nums[i], nums[j]])
			}
		}
	}
	return res
}
var threeSum = function(nums) {
	if (!nums || nums.length < 3) return;
	let res = [];
	let len = nums.length;
	nums.sort((a, b) => a - b);
	for (let i = 0; i < len - 2; i++) {
		if (nums[i] > 0) break;
		if (i > 0 && nums[i] === nums[i - 1]) continue;

		let left = i + 1,
			right = len - 1;
		while (left < right) {
			if (nums[i] + nums[left] + nums[right] === 0) {
				res.push([nums[i], nums[left], nums[right]]);
				while (left < right && nums[left] === nums[left + 1]) left++;
				while (left < right && nums[right] === nums[right - 1]) right--;
				left++;
				right--
			} else if (nums[i] + nums[left] + nums[right] > 0) {
				right--
			} else {
				left++
			}
		}
	}
	return res;
}

//16最接近的三数之和
var threeSumClosest = function(nums, target) {
	nums.sort((a, b) => a - b);
	let res = nums[0] + nums[1] + nums[nums.length - 1];
	for (let i = 0; i < nums.length - 2; i++) {
		let left = i + 1,
			right = nums.length - 1;
		while (left < right) {
			let sum = nums[i] + nums[left] + nums[right];
			sum > target ? right-- : left++;
			if (Math.abs(sum - target) < Math.abs(res - target)) {
				res = sum;
			}
		}
	}
	return res;
};

//数组交集 350
var intersect = function(nums1, nums2) {
	nums1.sort((a, b) => a - b);
	nums2.sort((a, b) => a - b);
	let i = 0,
		j = 0,
		ans = 0,
		res = [];
	while (i < nums1.length && j < nums2.length) {
		if (nums1[i] < nums2[j]) {
			i++;
		} else if (nums1[i] > nums2[j]) {
			j++;
		} else {
			res[ans] = nums1[i];
			i++;
			j++;
			ans++;
		}
	}
	return res;
};

//合并两个有序数组 88
var merge = function(nums1, m, nums2, n) {
	let i = m - 1,
		j = n - 1,
		k = m + n - 1;
	while (i >= 0 && j >= 0) {
		if (nums1[i] >= nums2[j]) {
			nums1[k] = nums1[i]
			i--;
			k--;
		} else {
			nums1[k] = nums2[j];
			j--;
			k--
		}
	}
	while (j >= 0) {
		nums1[k] = nums2[j];
		j--;
		k--;
	}
};

//回文子串 647
var countSubstrings = function(s) {
	let count = 0;
	let len = s.length;
	if (len < 2) return len;
	let dp = new Array(len);
	for (let i = 0; i < len; i++) {
		dp[i] = new Array(len).fill(false)
	}
	for (let j = 0; j < len; j++) {
		for (let k = 0; k <= j; k++) {
			if (k == j) {
				dp[k][j] = true;
				count++
			} else if (j - k == 1 && s[k] == s[j]) {
				dp[k][j] = true;
				count++
			} else if (j - k > 1 && s[k] == s[j] && dp[k + 1][j - 1]) {
				dp[k][j] = true;
				count++
			}
		}
	}
	return count;
};

//最长公共前缀 14
var longestCommonPrefix = function(strs) {
	if (!strs || strs.length == 0) return "";
	if (strs.length == 1) return strs[0];
	let ans = strs[0],
		len = strs.length;
	for (let i = 1; i < len; i++) {
		let j = 0;
		for (; j < ans.length && j < strs[i].length; j++) {
			if (ans[j] != strs[i][j]) break;
		}
		ans = ans.substr(0, j);
		if (ans === "") return ans;
	}
	return ans;
};
var longestCommonPrefix = function(strs) {
	if (!strs || strs.length == 0) return "";
	if (strs.length == 1) return strs[0];
	let min = 0,
		max = 0;
	for (let i = 1, len = strs.length; i < len; i++) {
		if (strs[min] > strs[i]) min = i;
		if (strs[max] < strs[i]) max = i;
	}
	for (let j = 0, len = strs[min].length; j < len; j++) {
		if (strs[min].charAt(j) != strs[max].charAt(j)) {
			return strs[min].substring(0, j);
		}
	}
	return strs[min]
}

//电话号码的字母组合 17
var letterCombinations = function(digits) {
	if (digits.length === 0) return [];
	const map = {
		2: 'abc',
		3: 'def',
		4: 'ghi',
		5: 'jkl',
		6: 'mno',
		7: 'pqrs',
		8: 'tuv',
		9: 'wxyz'
	}
	let res = [];
	const dfs = (str, index) => {
		if (index >= digits.length) {
			res.push(str);
			return
		}
		const letters = map[digits[index]];
		for (let l of letters) {
			dfs(str + l, index + 1);
		}
	}
	dfs("", 0);
	return res;
};

//有效括号生成22
var generateParenthesis = function(n) {
	let res = [];

	function generate(str, left, right) {
		if (str.length == 2 * n) {
			res.push(str);
			return
		}
		if (left > 0) {
			generate(str + "(", left - 1, right);
		}
		if (right > left) {
			generate(str + ")", left, right - 1);
		}
	}
	generate("", n, n);
	return res
};

var generateParenthesis = function(n) {
	let res = [];

	function _gen(left, right, str) {
		if (left === n && right === n) {
			res.push(str);
			return
		}
		if (left < n) {
			_gen(left + 1, right, str + "(")
		}
		if (right < left && right < n) {
			_gen(left, right + 1, str + ")")
		}
	}
	_gen(0, 0, "");
	return res;
}

//快排
let quickSort = arr => {
	quick(arr, 0, arr.length - 1)
}

let quick = (arr, left, right) => {
	if (left < right) {
		let datum = arr[Math.floor(Math.random() * (right - left + 1)) + left],
			i = left,
			j = right;
		while (i <= j) {
			while (arr[i] < datum) {
				i++
			}
			while (arr[j] > datum) {
				j--
			}
			if (i <= j) {
				let temp = arr[i];
				arr[i] = arr[j];
				arr[j] = temp;
				i += 1;
				j -= 1;
			}
		}
		if (left < i - 1) {
			quick(arr, left, i - 1)
		}
		if (i < right) {
			quick(arr, i, right)
		}
	}
}

var addStrings = function(num1, num2) {
	let a = num1.length,
		b = num2.length,
		temp = 0,
		result = "";
	while (a || b) {
		a ? temp += +num1[--a] : "";
		b ? temp += +num2[--b] : "";

		result = temp % 10 + result;
		temp = temp > 9 ? 1 : 0;
	}
	if (temp) result = 1 + result;
	return result;
}

//242字母异位词
var isAnagram = function(s, t) {
	if (s.length !== t.length) {
		return false;
	}
	let hash = Array(26).fill(0);
	let codeA = "a".charCodeAt();
	for (let i = 0; i < s.length; i++) {
		hash[s.charCodeAt(i) - codeA]++;
		hash[t.charCodeAt(i) - codeA]--;
	}
	for (let val of hash) {
		if (val !== 0) {
			return false;
		}
	}
	return true;
}

//50 Pow(x, n)
var myPow = function(x, n) {
	if (n === 0) return 1;
	if (n === 1) return x;
	if (n < 0) return 1 / myPow(x, -n);
	if (n % 2) return x * myPow(x, n - 1);
	return myPow(x * x, n / 2)
}
var myPow = function(x, n) {
	if (n === 0) return 1;
	if (n === 1) return x;
	let pow = 1;
	if (n < 0) {
		x = 1 / x;
		n = -n;
	};
	while (n) {
		if (n & 1) {
			pow *= x;
		}
		x *= x;
		n >>= 1;
	}
	return pow;
}

//69 x的平方根
var mySqrt = function(x) {
	if (x < 2) return x
	var left = 0;
	var right = x;
	while (left <= right) {
		var mid = left + ((right - left) / 2);
		if (mid === x / mid) {
			return mid;
		} else if (mid > x / mid) {
			right = mid - 1;
		} else {
			left = mid + 1;
		}
	}
	return right;
};
var mySqrt = function(x) {
	if (x < 2) {
		return x;
	}
	var tmp = x;

	function sqrt(x) {
		var sqrtx = (x + tmp / x) / 2;
		if (sqrtx === x) {
			return x;
		} else {
			return sqrt(sqrtx);
		}
	}
	return sqrt(x);
};

//52 N皇后
var totalNQueens = function(n) {
	if (n < 1) return [];
	let result = [],
		cols = new Set(),
		pie = new Set(),
		na = new Set();

	function backtrack(n, row, cur_state) {
		if (row >= n) {
			result.push(cur_state);
			return;
		}
		for (let i = 0; i < n; i++) {
			if (cols.has(i) || pie.has(row + i) || na.has(row - i)) {
				continue;
			}
			cols.add(i);
			pie.add(row + i);
			na.add(row - i);

			backtrack(n, row + 1, cur_state.concat([i]));

			cols.delete(i);
			pie.delete(row + i);
			na.delete(row - i);
		}
	}
	backtrack(n, 0, [])
	result = result.map(solve => {
		return solve.map(item => {
			let arr = new Array(n).fill(".");
			arr[item] = "Q";
			return arr.join("")
		})
	})
	return result;
};

//70 爬楼梯
var climbStairs = function(n) {
	if (n === 0 || n === 1 || n === 2) return n;
	let prev = 1,
		cur = 2;
	for (let i = 2; i < n; i++) {
		let temp = prev + cur;
		prev = cur;
		cur = temp;
	}
	return cur
};

//120 三角形最小路径和
var minimumTotal = function(triangle) {
	if (!triangle || triangle.length == 0) return 0;
	let dp = triangle;
	for (let i = dp.length - 2; i >= 0; i--) {
		for (let j = 0; j < dp[i].length; j++) {
			dp[i][j] = Math.min(dp[i + 1][j], dp[i + 1][j + 1]) + dp[i][j];
		}
	}
	return dp[0][0];
};

//152 乘积最大子数组
var maxProduct = function(nums) {
	if (!nums || nums.length === 0) return 0;
	let res = nums[0];
	let dp = [];
	for (let i = 0; i < nums.length; i++) {
		dp[i] = [0, 0];
	}
	dp[0][0] = nums[0];
	dp[0][1] = nums[0];
	for (let i = 1; i < nums.length; i++) {
		if (nums[i] >= 0) {
			dp[i][0] = Math.max(dp[i - 1][0] * nums[i], nums[i]);
			dp[i][1] = Math.min(dp[i - 1][1] * nums[i], nums[i]);
		} else {
			dp[i][0] = Math.max(dp[i - 1][1] * nums[i], nums[i]);
			dp[i][1] = Math.min(dp[i - 1][0] * nums[i], nums[i]);
		}
		res = Math.max(res, dp[i][0])
	}
	return res
}
var maxProduct = function(nums) {
	if (!nums || nums.length === 0) return 0;
	let res = nums[0];
	let dp = [[0, 0],[0, 0]]
	dp[0][0] = nums[0];
	dp[0][1] = nums[0];
	for (let i = 1; i < nums.length; i++) {
		let x = i % 2,
			y = (i - 1) % 2;
		dp[x][0] = Math.max(dp[y][0] * nums[i], dp[y][1] * nums[i], nums[i]);
		dp[x][1] = Math.min(dp[y][0] * nums[i], dp[y][1] * nums[i], nums[i]);
		console.log(dp[x])
		res = Math.max(res, dp[x][0]);
	}
	return res;
}
var maxProduct = function(nums) {
	if (!nums || nums.length === 0) return 0;
	let res = nums[0],
		curMax = nums[0],
		curMin = nums[0],
		temp1 = 0,
		temp2 = 0;
	for (let i = 1; i < nums.length; i++) {
		temp1 = curMin * nums[i];
		temp2 = curMax * nums[i];
		curMin = Math.min(temp1, temp2, nums[i]);
		curMax = Math.max(temp1, temp2, nums[i]);
		res = Math.max(curMax, curMin);
	}
	return res;
}
