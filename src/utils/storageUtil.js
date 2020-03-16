// localStorage读写操作
// 后期可以引入store库,兼容所有浏览器

import store from 'store'

const USER_KEY ='user_key'  //先初始化key

export default{
    saveUser (user){
        // localStorage.setItem(USER_KEY,JSON.stringify(user))
        store.set(USER_KEY,user)  //自动序列化value
    },

    getUser (){
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },

    removeUser (){
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }

}