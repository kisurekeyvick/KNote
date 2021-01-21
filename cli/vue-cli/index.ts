/**
 * https://mp.weixin.qq.com/s/nhJBoROH4VGMlJ2iFBhTIw
 * 
 * 关于vue-cli的一些知识点
 */

/**
 * bin/vue.js 里的代码不少，无非就是在 vue  上注册了 create / add / ui  等命令
 * 本文只分析 create  部分
 */
// 检查 node 版本
checkNodeVersion(requiredVersion, '@vue/cli');

// 挂载 create 命令
program.command('create <app-name>').action((name, cmd) => {
  // 获取额外参数
  const options = cleanArgs(cmd);
  // 执行 create 方法
  require('../lib/create')(name, options);
});

// cleanArgs  是获取 vue create  后面通过 -  传入的参数，通过 vue create --help 可以获取执行的参数列表。
// 获取参数之后就是执行真正的 create  方法了


/**
 * (1) 输入命令有误，猜测用户意图
 * 
 * 如果用户在终端中输入 vue creat xxx  而不是 vue create xxx，会怎么样呢？
 * 则会提示：如图【输入错误命令友好提示.webp】
 */
// 源码如下：
const leven = require('leven');

// 如果不是当前已挂载的命令，会猜测用户意图
program.arguments('<command>').action(cmd => {
  suggestCommands(cmd);
});

// 猜测用户意图
function suggestCommands(unknownCommand) {
  const availableCommands = program.commands.map(cmd => cmd._name);

  let suggestion;

  availableCommands.forEach(cmd => {
    const isBestMatch =
      leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand);
    if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
      suggestion = cmd;
    }
  });

  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)}?`));
  }
}
/**
 * 代码中使用了 leven 了这个包，这是用于计算字符串编辑距离算法的 JS 实现，Vue CLI 这里使用了这个包，
 * 来分别计算输入的命令和当前已挂载的所有命令的编辑举例，从而猜测用户实际想输入的命令是哪个。
 */


/**
 * (2) Node 期望版本
 * 
 * Vue CLI 也是先检查了一下当前 Node 版本是否符合要求
 * - 当前 Node 版本： process.version
 * - 期望的 Node 版本： require("../package.json").engines.node
 */
/**
 * 推荐 Node LTS 版本
 */
const EOL_NODE_MAJORS = ['8.x', '9.x', '11.x', '13.x'];
for (const major of EOL_NODE_MAJORS) {
  if (semver.satisfies(process.version, major)) {
    console.log(
      chalk.red(
        `You are using Node ${process.version}.\n` +
          `Node.js ${major} has already reached end-of-life and will not be supported in future major releases.\n` +
          `It's strongly recommended to use an active LTS version instead.`
      )
    );
  }
}
/**
 * 简单来说，Node 的主版本分为奇数版本和偶数版本。每个版本发布之后会持续六个月的时间，六个月之后，奇数版本将变为 EOL 状态，
 * 而偶数版本变为 **Active LTS **状态并且长期支持。
 * 所以我们在生产环境使用 Node 的时候，应该尽量使用它的 LTS 版本，而不是 EOL 的版本。
 * 
 * EOL 版本：A End-Of-Life version of Node 
 * LTS 版本: A long-term supported version of Node
 */


/**
 * (3) 判断是否在当前路径
 * 
 * 在执行 vue create  的时候，是必须指定一个 app-name ，
 * 否则会报错： Missing required argument <app-name> 。
 * 
 * 那如果用户已经自己创建了一个目录，想在当前这个空目录下创建一个项目呢？
 * 当然，Vue CLI 也是支持的，执行 vue create .  就 OK 了
 */
// lib/create.js  中就有相关代码是在处理这个逻辑的
async function create(projectName, options) {
  // 判断传入的 projectName 是否是 .
  const inCurrent = projectName === '.';
  // path.relative 会返回第一个参数到第二个参数的相对路径
  // 这里就是用来获取当前目录的目录名
  const name = inCurrent ? path.relative('../', cwd) : projectName;
  // 最终初始化项目的路径
  const targetDir = path.resolve(cwd, projectName || '.');
}


/**
 * (4) 检查应用名
 * 
 * Vue CLI 会通过 validate-npm-package-name  这个包来检查输入的 projectName 是否符合规范。
 */
const result = validateProjectName(name);
if (!result.validForNewPackages) {
  console.error(chalk.red(`Invalid project name: "${name}"`));
  exit(1);
}


/**
 * (5) 若目标文件夹已存在，是否覆盖
 * 
 * 如下代码(
 *  这段代码比较简单，就是判断 target  目录是否存在，然后通过交互询问用户是否覆盖（对应的是操作是删除原目录）
 * )
 */
// 是否 vue create -m
if (fs.existsSync(targetDir) && !options.merge) {
  // 是否 vue create -f
  if (options.force) {
    await fs.remove(targetDir);
  } else {
    await clearConsole();
    // 如果是初始化在当前路径，就只是确认一下是否在当前目录创建
    if (inCurrent) {
      const { ok } = await inquirer.prompt([
        {
          name: 'ok',
          type: 'confirm',
          message: `Generate project in current directory?`,
        },
      ]);
      if (!ok) {
        return;
      }
    } else {
      // 如果有目标目录，则询问如何处理：Overwrite / Merge / Cancel
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(
            targetDir
          )} already exists. Pick an action:`,
          choices: [
            { name: 'Overwrite', value: 'overwrite' },
            { name: 'Merge', value: 'merge' },
            { name: 'Cancel', value: false },
          ],
        },
      ]);
      // 如果选择 Cancel，则直接中止
      // 如果选择 Overwrite，则先删除原目录
      // 如果选择 Merge，不用预处理啥
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
        await fs.remove(targetDir);
      }
    }
  }
}


/**
 * (6) 整体错误捕获
 * 
 * 在 create  方法的最外层，放了一个 catch  方法，捕获内部所有抛出的错误，将当前的 spinner  状态停止，退出进程。
 */
module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false); // do not persist
    error(err);
    if (!process.env.VUE_CLI_TEST) {
      process.exit(1);
    }
  })
}


/**
 * (7) Creator  类的的构造函数
 */
module.exports = class Creator extends EventEmitter {
  constructor(name, context, promptModules) {
    super();

    this.name = name;
    this.context = process.env.VUE_CLI_CONTEXT = context;
    // 获取了 preset 和 feature 的 交互选择列表，在 vue create 的时候提供选择
    const { presetPrompt, featurePrompt } = this.resolveIntroPrompts();
    this.presetPrompt = presetPrompt;
    this.featurePrompt = featurePrompt;

    // 交互选择列表：是否输出一些文件
    this.outroPrompts = this.resolveOutroPrompts();

    this.injectedPrompts = [];
    this.promptCompleteCbs = [];
    this.afterInvokeCbs = [];
    this.afterAnyInvokeCbs = [];

    this.run = this.run.bind(this);

    const promptAPI = new PromptModuleAPI(this);
    // 将默认的一些配置注入到交互列表中
    promptModules.forEach(m => m(promptAPI));
  }
}
/**
 * 这里主要将逻辑都封装在 resolveIntroPrompts / resolveOutroPrompts  和 PromptModuleAPI  这几个方法中
 */



/**
 * (8) Preset（预设）
 * 
 * Creator  类的实例方法 create  接受两个参数
 * cliOptions：终端命令行传入的参数
 * preset：Vue CLI 的预设
 * 
 * 
 * Preset 是什么?
 * 官方解释是一个包含创建新项目所需预定义选项和插件的 JSON 对象，让用户无需在命令提示中选择它们
 * 
 * 例如：
    {
      "useConfigFiles": true,
      "cssPreprocessor": "sass",
      "plugins": {
        "@vue/cli-plugin-babel": {},
        "@vue/cli-plugin-eslint": {
          "config": "airbnb",
          "lintOn": ["save", "commit"]
        }
      },
      "configs": {
        "vue": {...},
        "postcss": {...},
        "eslintConfig": {...},
        "jest": {...}
      }
    }
 * 在 CLI 中允许使用本地的 preset 和远程的 preset
 */


/**
 * (9) prompt
 * 
 * 在 Creator 中的方法 getPromptModules，是获取了一些用于交互的模块
 * 
 */ 
exports.getPromptModules = () => {
  return [
    'vueVersion',
    'babel',
    'typescript',
    'pwa',
    'router',
    'vuex',
    'cssPreprocessors',
    'linter',
    'unit',
    'e2e',
  ].map(file => require(`../promptModules/${file}`));
}

module.exports = cli => {
  cli.injectFeature({
    name: '',
    value: '',
    short: '',
    description: '',
    link: '',
    checked: true,
  });

  cli.injectPrompt({
    name: '',
    when: answers => answers.features.includes(''),
    message: '',
    type: 'list',
    choices: [],
    default: '2',
  });

  cli.onPromptComplete((answers, options) => {});
};
/**
 * injectFeature 和 injectPrompt就是用户交互的一些配置选项
 */

/**
 * Feature：Vue CLI 在选择自定义配置时的顶层选项：
 * 【Feature：Vue CLI .webp】
 */

/**
 * Prompt：选择具体 Feature 对应的二级选项，
 * 比如选择了 Choose Vue version 这个 Feature，会要求用户选择是 2.x 还是 3.x：
 * 【Prompt.webp】
 * 
 * onPromptComplete 注册了一个回调方法，在完成交互之后执行。
 */ 



/**
 * (10) 
 */


