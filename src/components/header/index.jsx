import React, { Component } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import './index.css'
import { formatDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils';
import { reqWeather } from '../../api'
import items from '../../config/menuConfig'
import LinkButton from '../link-button';

export const withLocationandNavigate = (Component) => {
  return (props) => <Component {...props} location={useLocation()} navigate = {useNavigate()}/>;
}

class Header extends Component {
  state = {
    currentTime: formatDate(Date.now()), //当前时间，字符串
    WeatherImgUrl: '',
    WeatherText: '',
  }

  getTime = () => {
    this.intervalId = setInterval(()=>{
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

  logout = () =>{
    Modal.confirm({
      title: 'Do you want to exit?',
      icon: <ExclamationCircleFilled />,
      content: 'This will delete your login information',
      okType: 'default',
      onOk: () => {  //用箭头函数是因为箭头函数的this能指向组件
        //删除user数据
        memoryUtils.user = {} 
        storageUtils.removeUser()
        //跳转到login
        this.props.navigate('/login',{replace:true});
      },
      onCancel() {
      },
    });
  }

  //第一次render后执行一次，一般在此执行异步操作：ajax或启动定时器
  componentDidMount () { 
    //获取当前时间
    this.getTime()
    // this.getWeather()
  }

  //在组件卸载前停止计时器等
  componentWillUnmount () {
    clearInterval(this.intervalId)
  }

  render() {
    const { currentTime, WeatherImgUrl, WeatherText } = this.state
    const username = memoryUtils.user.username
    const title = this.getTitle()
    return (
      <div className='header'>
        <div className='header-top'>
          <span>Welcome, {username}</span>
          <LinkButton onClick={this.logout}>Exit</LinkButton>
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

export default withLocationandNavigate(Header);
