import React,{Component} from 'react';
import { ConfigProvider } from 'antd'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login/login';
import Admin from './pages/admin/admin';

export default class App extends Component{
  render(){
    return (
      <BrowserRouter>
        <ConfigProvider 
            theme={{
              token: {
                colorPrimary: '#008B8B',
                borderRadius: 2,

                // // 派生变量，影响范围小
                // colorBgContainer: '#f6ffed',
              },
              components: {
                Menu: {
                  darkItemSelectedBg: '#008B8B',
                },
                Button: {
                  colorPrimary: '#008B8B',
                }
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