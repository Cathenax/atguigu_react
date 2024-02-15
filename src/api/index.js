/*
包含应用中所有接口请求函数的模块
每个返回值都是promise
*/

import { message } from "antd"
import ajax from "./ajax"
import jsonp from "jsonp"

/* export function reqLogin(username, password) {
        return ajax('/login', {username, password}, 'POST')
}*/
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

export const reqAddUser = (user) => ajax('/manage/user/add', user, 'POST')

// jsonp for requesting weather information
// jsonp，请求天气接口
export const reqWeather = (city) => {
        return new Promise((resolve, reject)=>{
            //首先根据city name找location key
                let url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=vYfGN2l7OOeU5Evkt8AuIfek1aUAwKIE&q=${city}`
                jsonp(url, (err, data)=>{
                        if(!err){
                                const locationKey = data[0].Key  
                                console.log('jsonp(search for location key)', locationKey)
                                url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=vYfGN2l7OOeU5Evkt8AuIfek1aUAwKIE`
                                jsonp(url, (err, data)=>{
                                        if(!err){
                                                console.log('jsonp(weather)', err, data)
                                                const { WeatherIcon, WeatherText } = data[0]
                                                const WeatherImgUrl = `https://developer.accuweather.com/sites/default/files/`
                                                        + (WeatherIcon < 10? `0${WeatherIcon}`:`${WeatherIcon}`) + `-s.png`
                                                resolve({ WeatherImgUrl, WeatherText })
                                        }
                                        else{
                                                message.error('Failed in getting weather from location key!')
                                        }
                                })   
                        }
                        else{
                                message.error('Failed in getting location key from city name!')
                        }
                })  
        })
        

}

//获取一级/二级分类列表
export const reqCategoryList = (parentId) => ajax('/manage/category/list', {parentId})

//添加分类(传参为两个数据)
export const reqAddCategory = (categoryName, parentId) => ajax('/manage/category/add', {categoryName, parentId}, 'POST')

//添加分类(传参为一个对象类型的数据)
export const reqEditCategory = ({categoryId, categoryName}) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST')

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})

//搜索商品分页列表（根据产品名称/描述）
//searchType：搜索的类型，值为productName/productDesc
export const reqSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax('/manage/product/search',{
        pageNum, 
        pageSize, 
        [searchType]:searchName,
})

//获取一个分类
export const reqCategory = (categoryId) => ajax('/manage/category/info', {categoryId})

//更新商品状态
//update the status of a product
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')

//删除商品的图片
//delete the image of a product
export const reqDeleteImg = (name) => ajax('/manage/img/delete', {name}, 'POST')

//添加或者修改商品
//add or update products
export const reqAddOrUpdateProduct = (product) => ajax(
        '/manage/product/' + (product._id ? 'update':'add'),
        product, 'POST')

//获取所有角色的列表
//get the list of all roles
export const reqRoles = () => ajax('/manage/role/list')

//添加角色
//add a new role
export const reqAddRole = (roleName) => ajax('/manage/role/add', {roleName}, 'POST')

//更新角色
//update a role
export const reqUpdateRole = (role) => ajax('/manage/role/update', role, 'POST')