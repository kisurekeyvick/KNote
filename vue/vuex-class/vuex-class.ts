/**
 * (1) vuex namespaced的作用以及使用方式
 * 
    vuex中的store分模块管理，需要在store的index.js中引入各个模块，
    为了解决不同模块命名冲突的问题，将不同模块的namespaced:true，
    之后在不同页面中引入getter、actions、mutations时，需要加上所属的模块名
 */

/** 
 * (2) 声明分模块的store时加上namespaced:true
 * 如下是一个project.ts的模块
 */ 
// 初始化的状态
const state = {
    userId:'',//用户id
    userName:'',//用户名称
    token:'',//token
    permission:''//权限
}
   
// getters
const getters = {
    // 获取用户信息
    getUserInfo(){
      return state;
    }
}
   
// actions
const actions = {
    async readInfo(...args) {

    }
}
   
// mutations
const mutations = {
    setUserInfo(state,payload) {
      console.log("payload:"+payload);
      console.info(payload);
      state.userId = payload.userId;
      state.userName = payload.userName;
      state.token = payload.token;
      state.permission = payload.permission;
    }
}
   
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}

/** 
 * (2) 在vuex中定义modules
 * 设置其中的modules中的project模块名字
 */
import Vue from 'vue'
import Vuex from 'vuex'
import project from './modules/project'

Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
      project
    }
})

/** 
 * (3) 在业务代码使用的时候
 */
import { namespace } from 'vuex-class'
const projectMd = namespace('project')

export default class MdApp_one extends Vue {
    /** 
     * @projectMd.State     读取state中的某一个属性
     * @projectMd.Action    拿取到actions中的readInfo方法
     */
    @projectMd.State('token') curToken: String;
    @projectMd.Action('readInfo') readInfo: Function;
}

/** 
 * 总结：
 * (1) namespace的作用就是将
 */
