/**
 * https://leetcode-cn.com/problems/two-sum/
 * 
  1. 两数之和
    给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 的那 两个 整数，并返回它们的数组下标。

    你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

    你可以按任意顺序返回答案。

    示例 1：

    输入：nums = [2,7,11,15], target = 9
    输出：[0,1]
    解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
    示例 2：

    输入：nums = [3,2,4], target = 6
    输出：[1,2]
    示例 3：

    输入：nums = [3,3], target = 6
    输出：[0,1]
    

    提示：

    2 <= nums.length <= 103
    -109 <= nums[i] <= 109
    -109 <= target <= 109
    只会存在一个有效答案
 * 
 */
/** 个人解题思路 */
function twoSum(nums: number[], target: number): number[] {
  const result: number[] = []
  
  for (let i = 0; i < nums.length; i++) {
    const restNum = target - nums[i]
    const restNumIndex = nums.findIndex(item => item === restNum)

    if (restNumIndex > -1 && restNumIndex !== i) {
      result.push(i, restNumIndex)
      break
    }
  }

  return result
}

/** 最优解 */

