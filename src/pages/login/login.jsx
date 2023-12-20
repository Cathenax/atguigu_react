import React, { Component } from 'react'
import { Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, Navigate } from 'react-router-dom'
import './login.css'
import {reqLogin, reqAddUser} from '../../api/index.js'
import memoryUtils from '../../utils/memoryUtils.js';
import storageUtils from '../../utils/storageUtils.js';
import logo from '../../assets/images/logo.png'

export const withNavigation = (Component) => {
  return (props) => <Component {...props} navigate={useNavigate()} />;
}

// 登录的路由组件
class Login extends Component {
  formRef = React.createRef();

  //表格提交并且检验通过后调用
  onFinish = async (values) => {
    /*
    //返回promise的方法，未采用；实际想要的是成功后的结果，使用async和await
    //在返回promise的表达式左侧写await：不想要promise，想要promise异步执行成功的value数据
    //在await所在函数（最近的）定义的左侧写async
    reqLogin(username, password).then(response => {
      console.log('Success in ajax', response.data)
    }).catch(error => {
      console.log(error)
    });
    */
    //ajax
    const {username, password} = values;
    const result = await reqLogin(username, password);
    // console.log('Success in ajax', response.data);
    if(result.status === 0){
      message.success('Login success!');
      const user = result.data;
      memoryUtils.user = user; //将user信息存入内存
      storageUtils.saveUser(user); //将user信息保存到local
      //跳转到管理界面
      this.props.navigate('/',{replace:true});
    }else{
      message.error(result.msg);
    }
  };

  //表格提交并且检验失败后调用
  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  render() {
    //如果用户已经登录，自动跳转到后台界面
    const user = memoryUtils.user
    if(user && user._id){
      return <Navigate to ='/' />
    }
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt="logo" />
          <h1>React: Management System</h1>
        </header>
        <section className='login-content'>
          <h2>Login</h2>
          <Form
            name="normal_login"
            className="login-form"
            autoComplete="off"
            ref={this.formRef}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >
            <Form.Item
              name="username"
              validateTrigger = "onBlur"
              rules={[
                { required: true, whitespace: true, message: 'Please input your Username' },
                { min: 4, message: 'Password must be 4 - 12 characters'},
                { max: 12, message: 'Password must be 4 - 12 characters'},
                { pattern: /^[a-zA-Z0-9_]+$/, message: 
                  'Username must be consist of character, number or underscore'},
              ]}    
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      
            </Form.Item>
            <Form.Item
              name="password"
              validateTrigger = "onBlur"
              rules={[
                { required: true, message: 'Please input your Password' },
                { min: 4, message: 'Password must be 4 - 12 characters'},
                { max: 12, message: 'Password must be 4 - 12 characters'},
                { pattern: /^[a-zA-Z0-9_]+$/, message: 
                  'Password must be consist of character, number or underscore'},
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}

export default withNavigation(Login);
