import React, { Component } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Select,
  Input,
  Button,
  Table,
  message,
}from 'antd'
import {
  PlusOutlined,
} from '@ant-design/icons'

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

const Option = Select.Option
export const withNavigation = (Component) => {
  return (props) => <Component {...props} navigate={useNavigate()} />;
}
//Product的默认子路由组件
class ProductHome extends Component {
  state = {
    products: [], //商品的数组
    total: 0, //商品总数量
    loading: false,
    searchName: '', //搜索的关键字
    searchType: 'productName', //搜索的方式（根据名称/描述）
  }
  constructor(props){
    super(props)
    this.initColumns()
  }
  //更新指定商品状态
  updateStatus = async (productId, newStatus) => {
    const result = await reqUpdateStatus(productId, newStatus)
    if(result.status === 0){
      message.success('Successfully updated the product!')
      this.getProducts(this.pageNum)
    }
  }
   //初始化Table所有列
  initColumns = () => {
    this.columns = [
      {
        title: 'Product Name',
        width: 200,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Descriptions',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: 'Price',
        width: 100,
        dataIndex: 'price',
        key: 'price',
        render: (price) => '￥' + price //当前指定了dataIndex，所以传入的是对应的属性值，否则传入的是一整行的数据
      },
      {
        title: 'Status',
        width: 100,
        // dataIndex: 'status',
        key: 'status',
        render: (product) => {
          const {status, _id} = product
          const newStatus = status === 1? 2 : 1
          return (
            <span>
              <Button 
                type='primary' 
                onClick={() => {this.updateStatus(_id, newStatus)}}
              >
                {status === 1 ? 'Delist' : 'List'}
              </Button>
              <span>{status === 1 ? 'On Sale' : 'Not On Sale'}</span>
            </span>
          )
        }
      },
      {
        title: 'Actions',
        width: 100,
        key: 'actions',
        render: (product) => (
          <span>
           <LinkButton onClick={() => {this.props.navigate('/product/detail', { state: {product} })}}>Details</LinkButton>
           <LinkButton>Edit</LinkButton>
          </span>
        )
      },
    ];
  }
  //获取指定页码的列表数据显示，分为两种情况：1.直接显示，2.进行搜索显示
  getProducts = async(pageNum) => {
    this.pageNum = pageNum //保存pageNum，给其他方法使用
    this.setState({loading:true}) //显示loading
    const {searchName, searchType} = this.state
    let result
    //如果关键字有值，说明现在是进行搜索分页
    if(searchName){
      result = await reqSearchProducts({pageNum, pageSize:PAGE_SIZE, searchName, searchType})

    }else{//直接显示
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({loading:false}) //隐藏loading
    if(result.status === 0){
      //取出分页数据，更新状态，显示分页列表
      const {total, list} = result.data
      this.setState({products: list, total: total})
    }
  }
  componentDidMount = () => {
    this.getProducts(1)
  }
  render() {
    const {products, total, loading, searchType, searchName} = this.state
    const title = (
      <span>
        <Select 
          value={searchType} 
          onChange={(value) =>{this.setState({searchType:value})}}
        >
          <Option value='productName'>Search by name</Option>
          <Option value='productDesc'>Search by description</Option>
        </Select>
        <Input 
          placeholder='Key words' 
          style={{width:150,margin:'0 15px'}} 
          value={searchName}
          onChange={(event) =>{this.setState({searchName:event.target.value})}}
          ></Input>
        <Button type='primary' onClick={() => {this.getProducts(1)}}>Search</Button>
      </span>
    )
    const extra = (
      <Button type='primary'>
        <PlusOutlined/>
        Add Products
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id' 
          dataSource={products} 
          columns={this.columns} 
          loading={loading}
          responsive //响应式设计
          scroll={{ x: 800, y: 400 }} // 根据需要设置 x 和 y 的值
          pagination={{
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true, 
            total:total,
            onChange: this.getProducts
          }}
        />
      </Card>
    )
  }
}

export default withNavigation(ProductHome);
