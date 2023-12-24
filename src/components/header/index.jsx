import React, { Component } from 'react'
import { useLocation } from 'react-router-dom'
import './index.css'
import { formatDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import { reqWeather } from '../../api'
import items from '../../config/menuConfig'

export const withLocation = (Component) => {
  return (props) => <Component {...props} location={useLocation()} />;
}

class Header extends Component {
  state = {
    currentTime: formatDate(Date.now()), //当前时间，字符串
    WeatherImgUrl: '',
    WeatherText: '',
  }

  getTime = () => {
    setInterval(()=>{
      const currentTime = formatDate(Date.now())
      this.setState({currentTime})
    },1000)
  }

  getWeather = async() => {
    const { WeatherImgUrl, WeatherText } = await reqWeather('Emeryville')
    this.setState({ WeatherImgUrl, WeatherText })
  }

  getTitle = () =>{
    const path = this.props.location.pathname
    let title
    items.forEach(item => {
      if(item.key === path){
        title = item.label.props.children
      }
      //查找子item
      else if(item.children){
        const cItem = item.children.find(curItem => {
          return curItem.key === path
        })
        //有值说明找到了
        if(cItem) {
          title = cItem.label.props.children
        }
      }
    })
    return  title
  }

  //第一次render后执行一次，一般在此执行异步操作：ajax或启动定时器
  componentDidMount () { 
    //获取当前时间
    this.getTime()
    this.getWeather()
  }

  render() {
    const { currentTime, WeatherImgUrl, WeatherText } = this.state
    const username = memoryUtils.user.username
    const title = this.getTitle()
    return (
      <div className='header'>
        <div className='header-top'>
          <span>Welcome, {username}</span>
          <a href="javascript:">Exit</a>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>
            {title}
          </div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <img src={WeatherImgUrl} alt="weather" />
            <span>{WeatherText}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withLocation(Header);
