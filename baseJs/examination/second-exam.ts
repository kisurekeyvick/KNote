/**
 * (1) 给定一个整数数组，找到从三个整数中产生的最大乘积
 */
const unsortedArray = [-10, 7, 29, 30, 5, -10, -70]

// 其实就是先排好序，再找最后3位数字的乘积然后和 第一位 * 第二位 * 最后一位 的乘积做比较
function computeProduct (unsorted: Array<number>) {
    const sortedArray = unsorted.sort((a, b) => a - b)
    const LastArrayIndex = sortedArray.length - 1

    let result = 1
    let seconderesult= 1

    for (let i = LastArrayIndex; i > LastArrayIndex - 3 ; i--) {
        result = result * sortedArray[i]
    }

    seconderesult = sortedArray[0] * sortedArray[1] * sortedArray[LastArrayIndex]

    if (result > seconderesult) {
        return result
    }

    return seconderesult
}


/**
 * (2) 一个未排序的数组包含 n 个连续数字中的（n-1）个数字，找到缺失的数字，要求时间复杂度为 O(n)
 */




