import React, { Component } from 'react'
import {
  Card,
  Table,
  Button,
  message,
  Modal,
} from 'antd'
import {
  PlusOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'

import './category.css'
import LinkButton from '../../components/link-button'
import { reqCategoryList, reqAddCategory, reqEditCategory } from '../../api'
import AddForm from './add-form'
import EditForm from './edit-form'

export default class Category extends Component {
  state = {
    loading: false, //是否正在获取数据
    categoryList:[], //一级分类列表
    subCategoryList: [], //二级分类列表
    parentId: '0', //当前需要显示的分类列表的父分类Id
    parentName: '', //当前需要显示的分类列表的父分类名称
    showStatus: 0, //标识添加和更新的确认框是否显示，0代表都不显示，1代表显示添加确认框，2代表显示更新确认框
  }
  constructor(props){
    super(props)
    this.initColumns()
  }
  //初始化Table所有列
  initColumns = () => {
    this.columns = [
      {
        title: 'Category Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Actions',
        width: 300,
        dataIndex: '',
        key: 'actions',
        render: (category) => (
          <span>
            <LinkButton onClick = {() => {this.showEditModal(category)}}>Edit</LinkButton>
            {category.parentId === '0' ? 
            <LinkButton onClick={() => {this.showSubCategoryList(category)}}>Show SubCategory</LinkButton>:null}
          </span>
        )
      },
    ];
  }
  //异步获取一级或二级分类列表
  getCategoryList = async() => {
    //在发请求前显示loading
    this.setState({loading: true})
    const { parentId } = this.state
    const result =  await reqCategoryList(parentId)
    //请求结束，隐藏loading
    this.setState({loading: false})
    if(result.status === 0){
      //一级分类列表
      const categoryList = result.data
      if(parentId === '0'){
        this.setState({ 
        categoryList
        })
      }else{
        this.setState({ 
          subCategoryList: categoryList
        })
      }
    }
    else{
      message.error('Error in getting Catrgory List!')
    }
  }
  //显示一级列表对应的二级列表
  showSubCategoryList = (category) => {
    //更新状态
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {  //因为setState是个异步更新函数，所以这里用回调函数，在状态更新并且重新render后执行
      //获取二级分类列表显示
      this.getCategoryList()
    })
  }
  //显示一级分类列表
  showCategoryList = () => {
    //更新为显示一级列表的状态
    this.setState({
      parentId: '0',
      parentName: '',
      subCategoryList: [],
    })
  }
  //显示添加对话框
  showAddModal = () => {
    this.setState({showStatus:1})
  }
  //显示添加对话框
  showEditModal = (category) => {
    //保存对象
    this.category = category
    //更新状态
    this.setState({showStatus:2})
  }
  //响应点击取消：隐藏确定框
  handleCancel = () => {
    //清除输入数据
    this.formRef.current.resetFields()
    this.setState({showStatus:0})
  }
  //添加分类
  addCategory = () => {
    console.log('addCategory()')
    this.setState({showStatus:0})
  }
  //更新分类
  editCategory = async () => {
    console.log('editCategory()')
    //隐藏确定框
    this.setState({showStatus:0})
    //准备数据
    const categoryId = this.category._id
    const categoryName = this.formRef.current.getFieldValue('categoryName')
    console.log(categoryId, categoryName)
    //清除输入数据
    this.formRef.current.resetFields()
    //发请求更新分类
    const result = await reqEditCategory({categoryId, categoryName})
    if(result.status === 0){
      //重新显示列表
      this.getCategoryList()
    }
    
  }
  //发异步ajax请求
  componentDidMount() {
    //获取一级分类列表显示
    this.getCategoryList()
  }

  render() {
    //读取状态数据
    const {loading, categoryList, subCategoryList, parentId, parentName, showStatus} = this.state
    let category 
    category = this.category || {}
    const title = parentId === '0'? 'Category List' : (
      <span>
        <LinkButton onClick={this.showCategoryList}>Category List</LinkButton>
        <ArrowRightOutlined style={{marginRight:10}}/>
        <span>{parentName}</span>
      </span>)
    const extra = (
      <Button type='primary' onClick={this.showAddModal}>
        <PlusOutlined />
        Add
      </Button>
    )
    return (
      <div className='category'>
        <Card
          title={title}
          extra={extra}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <Table 
            bordered
            rowKey='_id'
            dataSource={parentId === '0' ? categoryList : subCategoryList} 
            columns={this.columns}
            pagination={{defaultPageSize: 5, showQuickJumper: true,}}
            loading={loading}
          />
          <Modal title="Add Category" open={showStatus === 1 ? true:false} onOk={this.addCategory} onCancel={this.handleCancel}>
            <AddForm></AddForm>
          </Modal>
          <Modal title="Edit Category" open={showStatus === 2 ? true:false} onOk={this.editCategory} onCancel={this.handleCancel}>
            <EditForm 
              categoryName={category.name} 
              getForm={(formRef) => {this.formRef = formRef}}
            ></EditForm>
          </Modal>
        </Card>
      </div>
    )
  }
}
