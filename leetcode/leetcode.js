//1两数之和
var twoSum = function (nums, target) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (map.has(target - nums[i])) {
      return [map.get(target - nums[i]), i]
    } else {
      map.set(nums[i], i)
    }
  }
  return []
}

//三数之和 15
var threeSum = function (nums) {
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
var threeSum = function (nums) {
  if (!nums || nums.length < 3) return;
  let res = [],
    len = nums.length;
  nums.sort((a, b) => a - b);
  for (let i = 0; i < len - 2; i++) {
    if (nums[i] > 0) break;
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1,
      right = len - 1;
    while (left < right) {
      let sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        res.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum > 0) {
        right--;
      } else {
        left++;
      }
    }
  }
  return res;
}

//16最接近的三数之和
var threeSumClosest = function (nums, target) {
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
var intersect = function (nums1, nums2) {
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
      if(!res.length || nums1[i] !== res[res.length -1]) {
        res[ans] = nums1[i];
        ans++;
      }
      i++;
      j++;
    }
  }
  return res;
};

//合并两个有序数组 88
var merge = function (nums1, m, nums2, n) {
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
  return nums1;
};

//4 寻找两个正序数组的中位数
var findMedianSortedArrays = function (nums1, nums2) {
  let totalLen = nums1.length + nums2.length;
  if (totalLen % 2 == 1) {
    let midIndex = Math.ceil(totalLen / 2);
    return getKthElement(nums1, nums2, midIndex);
  } else {
    let midIndex1 = totalLen / 2;
    let midIndex2 = totalLen / 2 + 1;
    let median = getKthElement(nums1, nums2, midIndex1) + getKthElement(nums1, nums2, midIndex2);
    return median / 2;
  }

  function getKthElement(arr1, arr2, k) {
    let len1 = arr1.length,
      len2 = arr2.length;
    let index1 = 0,
      index2 = 0;
    while (true) {
      if (index1 == len1) {
        return nums2[index2 + k - 1];
      }
      if (index2 == len2) {
        return nums1[index1 + k - 1]
      }
      if (k == 1) {
        return Math.min(nums1[index1], nums2[index2])
      }

      let half = Math.floor(k / 2);
      let newIndex1 = Math.min(index1 + half, len1) - 1;
      let newIndex2 = Math.min(index2 + half, len2) - 1;
      let pivot1 = nums1[newIndex1],
        pivot2 = nums2[newIndex2];
      if (pivot1 <= pivot2) {
        k -= (newIndex1 - index1 + 1);
        index1 = newIndex1 + 1;
      } else {
        k -= (newIndex2 - index2 + 1);
        index2 = newIndex2 + 1;
      }
    }
  }
}

//回文子串 647
var countSubstrings = function (s) {
  let count = 0,
    len = s.length;
  if (len < 2) {
    return len;
  }
  let dp = new Array(len).fill(0).map(() => new Array(len).fill(false))
  for (let i = 0; i < len; i++) {
    for (let j = 0; j <= i; j++) {
      if (i == j) {
        dp[i][j] = true;
        count++;
      } else if (i - j == 1 && s[i] == s[j]) {
        dp[i][j] = true;
        count++;
      } else if (i - j > 1 && s[i] == s[j] && dp[i - 1][j + 1]) {
        dp[i][j] = true;
        count++;
      }
    }
  }
  return count;
};

//最长公共前缀 14
var longestCommonPrefix = function (strs) {
  if(!strs || strs.length === 0) return "";
  if(strs.length === 1) return strs[0];
  let ans = strs[0];
  for(let i = 0; i < strs.length; i++) {
    let j = 0;
    for(; j < ans.length && j < strs[i].length; j++) {
      if(ans[j] !== strs[i][j]) {
        break;
      }
    }
    ans = ans.subStr(0, j);
    if(ans === "") return ans;
  }
  return ans;
};
var longestCommonPrefix = function (strs) {
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
var letterCombinations = function (digits) {
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
var generateParenthesis = function (n) {
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

var generateParenthesis = function (n) {
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

var addStrings = function (num1, num2) {
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
var isAnagram = function (s, t) {
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
var myPow = function (x, n) {
  if (n === 0) return 1;
  if (n === 1) return x;
  if (n < 0) return 1 / myPow(x, -n);
  if (n % 2) return x * myPow(x, n - 1);
  return myPow(x * x, n / 2)
}
var myPow = function (x, n) {
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
var mySqrt = function (x) {
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
var mySqrt = function (x) {
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
var totalNQueens = function (n) {
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
var climbStairs = function (n) {
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
var minimumTotal = function (triangle) {
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
var maxProduct = function (nums) {
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
var maxProduct = function (nums) {
  if (!nums || nums.length === 0) return 0;
  let res = nums[0];
  let dp = [
    [0, 0],
    [0, 0]
  ]
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
var maxProduct = function (nums) {
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

//300 数组最长子序列
var lengthOfLIS = function (nums) {
  if (!nums || nums.length === 0) return 0;
  let res = 1;
  let dp = new Array(nums.length + 1).fill(1);
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1)
      }
    }
    res = Math.max(res, dp[i]);
  }
  return res;
};

//322 零钱兑换
var coinChange = function (coins, amount) {
  let max = amount + 1;
  let dp = new Array(amount + 1).fill(max);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (let j = 0; j < coins.length; j++) {
      if (coins[j] <= i) {
        dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);
      }
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
};

//72 编辑距离
var minDistance = function (word1, word2) {
  let m = word1.length,
    n = word2.length;
  let dp = new Array(m + 1).fill(0);
  for (let i = 0; i < m + 1; i++) {
    dp[i] = new Array(n + 1).fill(0)
  }
  for (let i = 0; i < m + 1; i++) {
    dp[i][0] = i
  }
  for (let j = 0; j < n + 1; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i < m + 1; i++) {
    for (let j = 1; j < n + 1; j++) {
      dp[i][j] = Math.min(dp[i - 1][j - 1] + (word1[i - 1] == word2[j - 1] ? 0 : 1), dp[i - 1][j] + 1, dp[i][
        j - 1
      ] + 1)
    }
  }
  return dp[m][n]
};

//3 无重复字符的最长子串
var lengthOfLongestSubstring = function (s) {
  let strSet = new Set();
  let rk = -1,
    len = s.length,
    ans = 0;
  for (let i = 0; i < len; i++) {
    if (i != 0) {
      strSet.delete(s.charAt(i - 1))
    }
    while (rk + 1 < len && !strSet.has(s.charAt(rk + 1))) {
      strSet.add(s.charAt(rk + 1))
        ++rk;
    }
    ans = Math.max(ans, rk - i + 1)
  }
  return ans;
}
var lengthOfLongestSubstring = function (s) {
  let strMap = new Map();
  let start = 0,
    ans = 0;
  for (let i = 0; i < s.length; i++) {
    if (strMap.has(s.charAt(i))) {
      start = Math.max(strMap.get(s.charAt(i)) + 1, start)
    }
    strMap.set(s.charAt(i), i)
    ans = Math.max(ans, i - start + 1)
  }
  return ans;
}

//2 两数相加
var addTwoNumbers = function (l1, l2) {
  let head = null,
    tail = null,
    carry = 0;
  while (l1 || l2) {
    const val1 = l1 ? l1.val : 0;
    const val2 = l2 ? l2.val : 0;
    const sum = val1 + val2 + carry;
    if (!head) {
      head = tail = new ListNode(sum % 10);
    } else {
      tail.next = new ListNode(sum % 10);
      tail = tail.next;
    }
    carry = Math.floor(sum / 10);
    if (l1) {
      l1 = l1.next;
    }
    if (l2) {
      l2 = l2.next;
    }
  }
  if (carry > 0) {
    tail.next = new ListNode(carry);
  }
  return head;
}

//5 最长回文子串
var longestPalindrome = function (s) {
  let len = s.length;
  if (len < 2) {
    return s;
  }
  let maxLen = 1;
  let begin = 0;
  let dp = new Array(len).fill(0).map(() => new Array(len).fill(true));
  for (let L = 2; L <= len; L++) {
    for (let i = 0; i < len; i++) {
      let j = L + i - 1;
      if (j >= len) {
        break;
      }
      if (s[i] != s[j]) {
        dp[i][j] = false;
      } else {
        if (j - i < 3) {
          dp[i][j] = true;
        } else {
          dp[i][j] = dp[i + 1][j - 1];
        }
      }
      if (dp[i][j] && j - i + 1 > maxLen) {
        maxLen = j - i + 1;
        begin = i;
      }
    }
  }
  return s.substring(begin, begin + maxLen);
}
var longestPalindrome = function (s) {
  let len = s.length;
  if (len < 2) {
    return s;
  }
  let res = s[0];
  let dp = new Array(len).fill(0).map(() => new Array(len).fill(0))
  for (let i = len - 1; i >= 0; i--) {
    for (let j = i; j < len; j++) {
      if (j - i === 0) {
        dp[i][j] = true;
      } else if (j - i == 1 && s[i] == s[j]) {
        dp[i][j] = true;
      } else if (s[i] == s[j] && dp[i + 1][j - 1]) {
        dp[i][j] = true;
      }
      if (dp[i][j] && j - i + 1 > res.length) {
        res = s.substring(i, j + 1);
      }
    }
  }
  return res;
}

//7 整数反转
var reverse = function (x) {
  let rev = 0;
  while (x != 0) {
    let digit = x % 10;
    x = Math.floor(x / 10);
    rev = rev * 10 + digit;
    if (rev < Math.pow(-2, 31) || rev > Math.pow(2, 31) - 1) {
      return 0;
    }
  }
  return rev;
}

//9 是否为回文数
var isPalindrome = function (x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) {
    return false;
  }
  let rev = 0;
  while (x > rev) {
    rev = rev * 10 + x % 10;
    x = Math.floor(x / 10);
  }
  return (x === rev || x === Math.floor(rev / 10))
}

//32 最长有效括号
var longestValidParentheses = function (s) {
  if (!s) return 0;
  let len = s.length;
  let dp = new Array(len).fill(0);
  let maxVal = 0;
  for (let i = 1; i < len; i++) {
    if (s[i] == ')') {
      if (s[i - 1] == '(') {
        dp[i] = 2;
        if (i - 2 >= 0) {
          dp[i] = dp[i] + dp[i - 2];
        }
      } else if (dp[i - 1] > 0) {
        if ((i - dp[i - 1] - 1) >= 0 && s[i - dp[i - 1] - 1] == '(') {
          dp[i] = dp[i - 1] + 2;
          if ((i - dp[i - 1] - 2) >= 0) {
            dp[i] = dp[i] + dp[i - dp[i - 1] - 2];
          }
        }
      }
    }
    maxVal = Math.max(maxVal, dp[i]);
  }
  return maxVal;
}

//84 柱状图中最大矩形
var largestRectangleArea = function (heights) {
  let len = heights.length,
    ans = 0;
  for (let left = 0; left < len; left++) {
    let minHeight = Infinity;
    for (let right = left; right < len; right++) {
      minHeight = Math.min(minHeight, heights[right]);
      ans = Math.max(ans, (right - left + 1) * minHeight)
    }
  }
  return ans;
}
var largestRectangleArea = function (heights) {
  let len = heights.length,
    ans = 0;
  for (let mid = 0; mid < len; mid++) {
    let height = heights[mid];
    let left = mid,
      right = mid;
    while (left - 1 >= 0 && heights[left - 1] >= height) {
      left--;
    }
    while (right + 1 < len && heights[right + 1] >= height) {
      right++;
    }
    ans = Math.max(ans, (right - left + 1) * height)
  }
  return ans;
}
var largestRectangleArea = function (heights) {
  let len = heights.length,
    ans = 0;
  let stack = [];
  for (let i = 0; i < len; i++) {
    while (stack.length && heights[stack[stack.length - 1]] > heights[i]) {
      const h = heights[stack[stack.length - 1]];
      stack.pop();
      let w = i;
      if (stack.length) {
        w = i - stack[stack.length - 1] - 1;
      }
      ans = Math.max(ans, h * w)
    }
    stack.push(i);
  }
  while (stack.length) {
    const h = heights[stack[stack.length - 1]];
    stack.pop();
    let w = len;
    if (stack.length) {
      w = len - stack[stack.length - 1] - 1;
    }
    ans = Math.max(ans, h * w);
  }
  return ans;
}
var largestRectangleArea = (heights) => {
  let maxArea = 0
  let stack = []
  heights = [0, ...heights, 0]
  for (let i = 0; i < heights.length; i++) {
    while (heights[i] < heights[stack[stack.length - 1]]) {
      const stackTopIndex = stack.pop()
      maxArea = Math.max(
        maxArea,
        heights[stackTopIndex] * (i - stack[stack.length - 1] - 1)
      )
    }
    stack.push(i)
  }
  return maxArea
}

//21 合并两个有序链表
var mergeTwoLists = function(l1, l2) {
  if(l1 === null) {
    return l2;
  } else if(l2 === null) {
    return l1;
  } else if(l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
}
var mergeTwoLists = function(l1, l2) {
  let preHead = new ListNode(-1);
  let prev = preHead;
  while(l1 != null && l2 != null) {
    if(l1.val < l2.val) {
      prev.next = l1;
      l1 = l1.next;
    } else {
      prev.next = l2;
      l2 = l2.next;
    }
    prev = prev.next
  }
  prev.next = l1 == null ? l2 : l1;
  return preHead.next;
}

//141 判断一个单链表是否有环
var hasCycle = function(head) {
  let fast = head;
  let slow = head;
  while(slow && fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if(slow == fast) {
      return true;
    }
  }
  return false;
}

//206 反转链表
var reverseList = function(head) {
  let prev = null;
  let curr = head;
  while(curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}

//876 求链表的中间节点
var middleNode = function(head) {
  let fast = head;
  let slow = head;
  while(fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}

//19 删除链表倒数第n个节点
var removeNthFromEnd = function(head, n) {
  let preHead = new ListNode(0);
  preHead.next = head;
  let fast = preHead, slow = preHead;
  while(n--) {
    fast = fast.next;
  }
  while(fast && fast.next) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return preHead;
};

//160 相交链表
var getIntersectionNode = function(headA, headB) {
  let map = new WeakMap();
  while(headA) {
    map.set(headA, true);
    headA = headA.next;
  }
  while(headB) {
    let cur = map.get(headB);
    if(cur) return headB;
    headB = headB.next;
  }
  return null;
};