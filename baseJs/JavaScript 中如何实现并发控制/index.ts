/**
 * https://mp.weixin.qq.com/s/_cRGIFF29oEaDqSygWH3aQ
 * 
 * JavaScript 中如何实现并发控制？
 */

/**
 * 描述：
 * 假设有 6 个待办任务要执行，而我们希望限制同时执行的任务个数，即最多只有 2 个任务能同时执行。
 * 当 正在执行任务列表 中的任何 1 个任务完成后，程序会自动从 待办任务列表 中获取新的待办任务并把该任务添加到 正在执行任务列表 中。
 * 
 * 【并发控制(1).webp】
 * 【并发控制(2).webp】
 * 【并发控制(3).webp】
 */

/**
 * asyncPool ES7 实现
 * 
 * poolLimit（数字类型）：表示限制的并发数
 * array（数组类型）：表示任务数组
 * iteratorFn（函数类型）：表示迭代函数，用于实现对每个任务项进行处理，该函数会返回一个 Promise 对象或异步函数
 */
async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = []; // 存储所有的异步任务
  const executing = []; // 存储正在执行的异步任务

  for (const item of array) {
    // 调用iteratorFn函数创建异步任务
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    // 保存新的异步任务
    ret.push(p); 

    // 当poolLimit值小于或等于总任务个数时，进行并发控制
    if (poolLimit <= array.length) {
      // 当任务完成后，从正在执行的任务数组中移除已完成的任务
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      // 保存正在执行的异步任务
      executing.push(e); 
      if (executing.length >= poolLimit) {
        // 等待较快的任务执行完成
        await Promise.race(executing); 
      }
    }
  }

  return Promise.all(ret);
}
/**
 * 在以上代码中，充分利用了 Promise.all 和 Promise.race 函数特点，再结合 ES7 中提供的 async await 特性，最终实现了并发控制的功能。
 * 利用 await Promise.race(executing); 这行语句，我们会等待 正在执行任务列表 中较快的任务执行完成之后，才会继续执行下一次循环。
 */

// 使用
const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i));
asyncPool(2, [1000, 5000, 3000, 2000], timeout);

/**
 * asyncPool ES6 实现
 * 
 * poolLimit（数字类型）：表示限制的并发数
 * array（数组类型）：表示任务数组
 * iteratorFn（函数类型）：表示迭代函数，用于实现对每个任务项进行处理，该函数会返回一个 Promise 对象或异步函数
 */
 function asyncPool_ES6(poolLimit, array, iteratorFn) {
  let i = 0;
  // 存储所有的异步任务
  const ret = []; 
  // 存储正在执行的异步任务
  const executing = []; 

  const enqueue = function () {
    if (i === array.length) {
      return Promise.resolve();
    }
    
    // 获取新的任务项
    const item = array[i++]; 
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);

    let r = Promise.resolve();

    // 当poolLimit值小于或等于总任务个数时，进行并发控制
    if (poolLimit <= array.length) {
      // 当任务完成后，从正在执行的任务数组中移除已完成的任务
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        r = Promise.race(executing); 
      }
    }
 
    // 正在执行任务列表 中较快的任务执行完成之后，才会从array数组中获取新的待办任务
    return r.then(() => enqueue());
  };

  return enqueue().then(() => Promise.all(ret));
}
