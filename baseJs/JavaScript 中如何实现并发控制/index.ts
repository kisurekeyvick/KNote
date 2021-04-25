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
/**
 * 在 ES6 的实现版本中，通过内部封装的 enqueue 函数来实现核心的控制逻辑。
 * 当 Promise.race(executing) 返回的 Promise 对象变成已完成状态时，才会调用 enqueue 函数，从 array 数组中获取新的待办任务。
 */


/**
 * 手写 Promise.all
 * 
 * Promise.all(iterable) 方法会返回一个 promise 对象，当输入的所有 promise 对象的状态都变成 resolved 时，
 * 返回的 promise 对象就会以数组的形式，返回每个 promise 对象 resolve 后的结果。
 * 当输入的任何一个 promise 对象状态变成 rejected 时，则返回的 promise 对象会 reject 对应的错误信息。
 */
Promise.all = function (iterators) {
  return new Promise((resolve, reject) => {
    if (!iterators || iterators.length === 0) {
      resolve([]);
    } else {
      let count = 0; // 计数器，用于判断所有任务是否执行完成
      let result = []; // 结果数组
      for (let i = 0; i < iterators.length; i++) {
        // 考虑到iterators[i]可能是普通对象，则统一包装为Promise对象
        Promise.resolve(iterators[i]).then(
          (data) => {
            result[i] = data; // 按顺序保存对应的结果
            // 当所有任务都执行完成后，再统一返回结果
            if (++count === iterators.length) {
              resolve(result);
            }
          },
          (err) => {
            reject(err); // 任何一个Promise对象执行失败，则调用reject()方法
            return;
          }
        );
      }
    }
  });
};
/**
 * 需要注意的是对于 Promise.all 的标准实现来说，它的参数是一个可迭代对象，比如 Array、String 或 Set 等
 */


/**
 * 手写 Promise.race
 * 
 * Promise.race(iterable) 方法会返回一个 promise 对象，一旦迭代器中的某个 promise 对象 resolved 或 rejected，
 * 返回的 promise 对象就会 resolve 或 reject 相应的值。
 */
 Promise.race = function (iterators) {
  return new Promise((resolve, reject) => {
    for (const iter of iterators) {
      Promise.resolve(iter)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
};

