import React, { Component } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd'; 
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left_nav';
import Header from '../../components/header';
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Content } = Layout;
const contentStyle = {
  margin: 20,
};
const footerStyle = {
  textAlign: 'center',
  color: '#cccccc',
  backgroundColor: '#4096ff',
};
const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: '100%',
  maxWidth: '100%',
  height: '100%',
};
// 管理的路由组件
export default class Admin extends Component {
  
  render() {
    const user = memoryUtils.user;
    if(!user || !user._id){
      //未登录，自动跳转到登录
      return <Navigate to='/login' />
    }
    return (
      <Layout style={layoutStyle}>
      <LeftNav /> 
      <Layout>
        <Header>Header</Header>
        <Content style={contentStyle}>
          <Routes>
            <Route path='/home' element={<Home/>}></Route>
            <Route path='/category' element={<Category/>}></Route>
            <Route path='/product/*' element={<Product/>}></Route>
            <Route path='/role' element={<Role/>}></Route>
            <Route path='/user' element={<User/>}></Route>
            <Route path='/charts/bar' element={<Bar/>}></Route>
            <Route path='/charts/line' element={<Line/>}></Route>
            <Route path='/charts/pie' element={<Pie/>}></Route>
            <Route path='/' element={<Navigate to='/home'/>}></Route>
          </Routes>
        </Content>
        <Footer style={footerStyle}>Code by Cathenax, React learning--12/17/2023</Footer>
      </Layout>
    </Layout>
    )
  }
}
