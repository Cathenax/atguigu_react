import React, { Component } from 'react'
import { useLocation } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Button, Menu } from 'antd';
import './index.css'
import Sider from 'antd/es/layout/Sider';
import items from '../../config/menuConfig';

export const withLocation = (Component) => {
  return (props) => <Component {...props} location={useLocation()} />;
}
class LeftNav extends Component {
  constructor(props){
    super(props);
    this.state = {
      collapsed: false,
      width: 250,
      openKey: [],
    };
    const path = this.props.location.pathname;
    //设置默认打开的子菜单
    items.map((item) => {
      //是子菜单
      if(item.children){
        //使用find函数寻找
        const openKey = item.children.find(element => {
          return path.indexOf(element.key) === 0;
        })
        //子菜单中某项的key与当前path一致
        if(openKey !== undefined){
          this.state.openKey = [item.key];
        }
      }
    })
  }
  //调整菜单宽度，分为展开和缩起
  toggleCollapsed = (iscollapsed) => {
    const newWidth = iscollapsed ? 250 : 80;
    this.setState({collapsed: !this.state.collapsed, width: newWidth});
  };
  render() {
    const collapsed = this.state.collapsed;
    //当前请求路由路径
    let path = this.props.location.pathname;
    //单独处理商品/detail界面导致不匹配选中path的问题
    if(path.indexOf('/product') === 0){//当前请求的是商品或其子路由界面
      path = '/product'
    }
    return (
      <Sider className='left_nav' 
        collapsed = {collapsed}
        width = {this.state.width}
      >
        <div className='left_nav_header'>
          <Button
            type="primary"
            onClick={() => this.toggleCollapsed(collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </Button>
          {collapsed ? null : <h1>Management</h1>}
        </div>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={this.state.openKey}
          mode="inline"
          theme="dark"
          items={items}
        />
      </Sider>
    )
  }
}

export default withLocation(LeftNav);
