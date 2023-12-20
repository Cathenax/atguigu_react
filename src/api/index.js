/*
包含应用中所有接口请求函数的模块
每个返回值都是promise
*/

import ajax from "./ajax"

/* export function reqLogin(username, password) {
        return ajax('/login', {username, password}, 'POST')
}*/
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')