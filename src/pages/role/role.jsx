import React, { Component } from 'react'
import {
  Card,
  Table,
  Button,
  Modal,
  message,
}from "antd"

import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddRole from './add-role'
import AuthRole from './auth-role'
import memoryUtils from '../../utils/memoryUtils'
import { formatDate } from '../../utils/dateUtils.js'

export default class Role extends Component {
  state = {
    roles: [], //所有角色的列表 a list of all roles
    role: {},  //选中的角色 a role that is chosen
    showAdd: false, //是否显示添加界面 the showing status of the add role modal
    showAuth: false, //是否显示设置权限界面 the showing status of the set permissions role modal
  }
  initColumn = () => {
    this.columns = [
      {
        title:'Name of Role',
        dataIndex:'name',
      },
      {
        title:'Create Time',
        dataIndex:'create_time',
        render: (create_time) => formatDate(create_time)
      },
      {
        title:'Authorization Time',
        dataIndex:'auth_time',
        render: (auth_time) => formatDate(auth_time) //可以简写成formateDate，因为render需要指定的就是一个传入auth_time返回一个值的函数
      },
      {
        title:'Authorizer',
        dataIndex:'auth_name',
      }
    ]
  }
  onRow = (role) => {
    return {
      onClick: event => { //点击行 click on a row
        this.setState({role})
      }
    }
  }
  getRoles = async() => {
    const result = await reqRoles();
    if(result.status === 0){
      const roles = result.data
      this.setState({roles})
    }
  }
  setRole = (selectedRowKeys,selectedRows) => {
    const role = selectedRows[0]
    this.setState({role})
  }
  //添加角色 add a new role
  addRole = () => {
    //validate fields
    this.addFormRef.current.validateFields()
    .then( async (values) => {
      const { roleName } = values
      //清除输入数据 clear the information in the modal
      this.addFormRef.current.resetFields()
      const result = await reqAddRole(roleName)
      if(result.status === 0){
        message.success('Success in adding a new role!')
        // this.getRoles()
        const role = result.data
        // const roles = [...this.state.roles] 
        // roles.push(role)
        //更新roles  update roles
        this.setState(state => ({
          roles: [...state.roles, role] //这边用这一句是新产生了一个数组，因为react不推荐直接更新state数据
        }))
      }else{
        message.error('Failed in adding a new role!')
      }
    })
    //出错处理
    .catch(err => {
      console.log(err)
    })
    //隐藏确认框  hide the modal
    this.setState({showAdd:false})
  }
  //更新角色 update a role
  updateRole = async () => {
    const role = this.state.role
    //获得最新的menus数据
    const menus = this.updateFormRef.current.getMenus()
    //role只是引用，所以实际上state里的数据也变了
    role.menus = menus
    //指定授权人
    role.auth_name = memoryUtils.user.username
    //请求更新
    const result = await reqUpdateRole(role)
    if(result.status === 0){
      message.success('Success in updating the permissions!')
      role.auth_time = result.data.auth_time
      this.setState({
        roles: [...this.state.roles]
      })
    }
    //隐藏确认框  hide the modal
    this.setState({showAuth:false})
  }
  componentDidMount () {
    this.getRoles()
  }
  constructor (props){
    super(props);
    this.initColumn();
    this.updateFormRef = React.createRef();
  }
  render() {
    const { roles, role, showAdd, showAuth } = this.state
    const title = (
      <span>
        <Button type='primary' style={{marginRight:20}} onClick={() => this.setState({showAdd:true})}>Add Role</Button>
        <Button type='primary' disabled={!role._id} onClick={() => {this.setState({showAuth:true})}}>Set Role Permissions</Button>
      </span>
    )
    
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          dataSource={roles} 
          columns={this.columns}
          pagination={{defaultPageSize: PAGE_SIZE, showQuickJumper: true}}
          rowSelection={{type: 'radio', selectedRowKeys:[role._id], onChange:this.setRole}}
          onRow={this.onRow}
        >
        </Table>
        <Modal 
          title="Add Role" 
          open={showAdd} 
          onOk={this.addRole} 
          onCancel={() => {
            //清除输入数据 clear the information in the modal
            this.addFormRef.current.resetFields()
            this.setState({showAdd:false})
          }}
        >
          <AddRole
            getForm={(formRef) => {this.addFormRef = formRef}}
          />
        </Modal>
        <Modal 
          title="Set Role Permissions" 
          open={showAuth} 
          onOk={this.updateRole} 
          onCancel={() => {
            //清除输入数据 clear the information in the modal
            //利用componentDidUpdate来更新，所以把role中的值重新复制了一下
            const newRole = {...role}
            this.setState({showAuth:false, role: newRole})
          }}
        >
          <AuthRole
            role = {role}
            ref={this.updateFormRef}
          />
        </Modal>
      </Card>
    )
  }
}
