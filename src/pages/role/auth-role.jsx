import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Tree,
} from 'antd'
import items from '../../config/menuConfig.js'

const Item = Form.Item

//添加分类的Form组件
export default class AuthRole extends Component {
  static propTypes = {
    role: PropTypes.object.isRequired,  //传递角色
  }
  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
    this.setState({checkedKeys});
  };
  getTreeNodes = (items) => {
    return items.reduce((pre, item) => {
        // console.log(item.label.props)
        pre.push(
            {
                title: item.label.props? item.label.props.children : item.label,
                key: item.key,
                children: item.children ? this.getTreeNodes(item.children) : null,
            }
        )
        return pre
    },[])
  }
  initTreeNode = () => {
    const treeData = [
        {
            title: 'Platform Permissions',
            key: 'all',
            children: []
        }
    ]
    const menuItems = this.getTreeNodes(items)
    treeData[0].children = menuItems
    this.treeData = treeData
  }
  //为父组件提交最新menus数据
  getMenus = () => this.state.checkedKeys
  constructor(props){
    super(props);
    this.formRef = React.createRef();
    this.initTreeNode();
    //根据传入角色的menus生成初始状态
    const {menus} = this.props.role
    this.state = {
        checkedKeys: menus
    }
  }
  //根据新传入的role来更新checkedKeys状态
  componentDidUpdate(prevProps) {
    if (prevProps.role !== this.props.role) {
        this.setState({ checkedKeys: this.props.role.menus });
    }
  }
  render() {
    const formItemLayout = {
        labelCol: {span : 6},
        wrapperCol: {span : 15}
    }
    const {role} = this.props
    const {checkedKeys} = this.state
    const {treeData} = this
    return (
      <Form 
        {...formItemLayout}
      >
        <Item 
          label = 'Name of Role'
          name='roleName'
          initialValue={role.name} 
        >
          <Input disabled></Input>
        </Item>
        <Tree
            checkable
            defaultExpandAll={true}
            checkedKeys={checkedKeys}
            onCheck={this.onCheck}
            treeData={treeData}
        />
      </Form>
    )
  }
}
