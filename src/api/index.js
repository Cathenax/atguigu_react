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