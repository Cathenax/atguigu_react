import React,{Component} from 'react';
import {message,Button,ConfigProvider} from 'antd'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login/login';
import Admin from './pages/admin/admin';

ConfigProvider.config({
  prefixCls: 'ant',
  iconPrefixCls: 'anticon',

  // 5.6.0+
  // 请优先考虑使用 hooks 版本
  theme: { token: { colorPrimary: 'red' } },
});

export default class App extends Component{
  render(){
    return (
      <BrowserRouter>
        <ConfigProvider 
            theme={{
              token: {
                // Seed Token，影响范围大
                colorPrimary: '#008B8B',
                borderRadius: 2,

                // 派生变量，影响范围小
                colorBgContainer: '#f6ffed',
              },
              components: {
                Menu: {
                  darkItemSelectedBg: '#008B8B',
                },
              }
            }}
        >
          <Routes>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='*' element={<Admin/>}></Route>
          </Routes>
        </ConfigProvider>
      </BrowserRouter>
      
    )
  }
}