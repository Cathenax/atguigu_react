import React, { Component } from 'react'
import {
  Card,
  Form,
  Input,
  Cascader,
  Button,
  message,
} from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeftOutlined,
} from '@ant-design/icons'

import PictureWall from './picture-wall'
import LinkButton from '../../components/link-button'
import { reqCategoryList, reqAddOrUpdateProduct } from '../../api'
import RichTextEditor from './rich-text-editor'



const Item = Form.Item
const { TextArea } = Input
export const withNavigation = (Component) => {
  return (props) => <Component {...props} navigate={useNavigate()} location={useLocation()} />;
}

//Product的添加和更新子路由组件
class ProductAddUpdate extends Component {
  formRef = React.createRef();
  state = {
    options:[],
  }
  constructor (props) {
    super(props)
    //得到当前商品
    const product = this.props.location.state
    //保存一个是否是更新页面的标识
    this.isUpdate = !!product
    //保存目前商品（如果没有就是空对象）
    this.product = product || {}
    //创建用来保存ref标识的标签对象的容器
    this.picWallRef = React.createRef()
    this.richTextRef = React.createRef()
  }
  //表单提交函数
  submit = () =>{
    //进行表单验证，通过了才发送请求
    this.formRef.current.validateFields()
    .then( async (values) =>{
      //收集数据，并封装成product对象
      const {name, desc, price, categoryIdList} = values
      let pCategoryId, categoryId
      if(categoryIdList.length === 1){
        pCategoryId = '0'
        categoryId = categoryIdList[0]
      }
      else{
        pCategoryId = categoryIdList[0]
        categoryId = categoryIdList[1]
      }
      const imgs = this.picWallRef.current.getImages()
      const detail = this.richTextRef.current.getDetail()
      const product = {name, desc, price, pCategoryId, categoryId, imgs, detail}
      //如果是更新，需要_id属性
      if(this.isUpdate){
        product._id = this.product._id
      }
      //调用接口请求函数去添加或者更新
      const result = await reqAddOrUpdateProduct(product)
      //根据结果提示
      if(result.status===0){
        message.success(`${this.isUpdate ? 'Update' : 'Add'} product successfully!`)
        this.props.navigate(-1)
      }else{
        message.error(`${this.isUpdate ? 'Update' : 'Add'} product failed!`)
      }
    })
    //出错处理
    .catch(err => {
      console.log(err)
    })
  }
  //验证价格的函数
  validatePrice = (_, value) =>{
    if(value*1 > 0){
      return Promise.resolve(); //验证通过
    }
    return Promise.reject('Price must be bigger than 0.'); //验证失败
  }
  //异步获取一级/二级分类列表，并显示
  getCategoryList = async(parentId) =>{
    const result = await reqCategoryList(parentId)
    if(result.status===0){
      const categoryList = result.data
      //如果是一级分类列表
      if(parentId ==='0'){
        this.initOptions(categoryList)
      }else{
        //是二级分类列表，就返回二级列表，当前async函数返回的promise就会成功且value为categorList
        return categoryList
      }
    }
  }
  initOptions = async(categoryList) =>{
    //根据categoryList数组生成options数组并更新状态
    const options = categoryList.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }))
    //如果当前是更新二级分类商品，就需要提前加载子列表
    const { isUpdate, product } = this
    const { pCategoryId, categoryId } = product
    if(isUpdate && pCategoryId!=='0'){
      //获取对应的二级分类列表
      const subCategoryList = await this.getCategoryList(pCategoryId)
      //生成二级列表的options
      const childOptions = subCategoryList.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      //找到当前商品对应的一级option对象
      const targetOption = options.find(option => {
        return option.value === pCategoryId
      })
      //关联到当前的option上
      targetOption.children = childOptions
    }
    this.setState({ options })
  }
  //用于加载下一级列表的回调函数
  loadData = async(selectedOptions) => {
    //得到选择的option对象
    const targetOption = selectedOptions[0];
    //显示loading
    targetOption.loading = true;
    //根据选中的分类，请求获取二级分类列表
    const subCategoryList = await this.getCategoryList(targetOption.value)
    //隐藏loading
    targetOption.loading = false;
    //二级分类数组有数据
    if(subCategoryList && subCategoryList.length > 0){
      //生成一个二级列表的options
      const childOptions = subCategoryList.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }))
      //关联到当前的option上
      targetOption.children = childOptions
    }else{
      //当前选中分类没有二级分类列表
      targetOption.isLeaf = true;
    }
    this.setState({
      options:[...this.state.options],
    })
  };
  componentDidMount (){
    this.getCategoryList('0')
  }
  render() {
    const { isUpdate, product } = this
    const { pCategoryId, categoryId, imgs, detail } = product
    //用来接受级联分类ID的数组
    const categoryIdList = []
    if(isUpdate){
      //是一级分类商品
      if(pCategoryId === '0'){
        categoryIdList.push(categoryId)
      }
      else{
        //是二级分类商品
        categoryIdList.push(pCategoryId)
        categoryIdList.push(categoryId)
      }
    }
    //指定Form中Item的布局的配置对象
    const formItemLayout = {
      labelCol:{ span: 2 }, //左侧label宽度。栅格系统中一整行为24
      wrapperCol:{ span: 8 }, //指定右侧包裹的宽度，从而影响输入框宽度
    }
    const title = (
      <span>
        <LinkButton onClick={() => {this.props.navigate(-1)}}>
          <ArrowLeftOutlined style={{marginRight:10,fontSize:15}}/>
        </LinkButton>
        <span>
          {isUpdate? 'Edit Product' : 'Add Product'}
        </span>
      </span>
    )
    // this.editFormRef.current.validateFields()
    return (
      <Card title={title}>
        <Form 
          name='product-add-update-form'
          {...formItemLayout} 
          ref={this.formRef}
        >
          <Item 
            name='name'
            label='Name'
            initialValue={product.name}
            validateTrigger = "onBlur"
            rules={[
                {required: true, message: 'Please input the name of the product.'}
            ]}
          >
            <Input placeholder='Please Type Product Name Here'></Input>
          </Item>
          <Item
            name='desc' 
            label='Description'
            initialValue={product.desc}
            validateTrigger = "onBlur"
            rules={[
                {required: true, message: 'Please input the description of the product.'}
            ]}
          >
            <TextArea 
              placeholder='Please Type Product Description Here' 
              autoSize={{
                minRows: 2,
                maxRows: 8,
              }}
              allowClear
            />
          </Item>
          <Item 
            name='price'
            label='Price'
            initialValue={product.price}
            validateTrigger = "onBlur"
            rules={[
                {required: true, message: 'Please input the price of the product.'},
                {validator: this.validatePrice}
            ]}
          >
            <Input 
              type='number' 
              placeholder='Please Type Product Price Here'
              addonBefore='￥'  
            />
          </Item>
          <Item 
            name='categoryIdList' 
            label='Category'
            initialValue={categoryIdList}
            rules={[
              {required:true, message: 'Please input the category of the product.'}
            ]}
          >
            <Cascader
              options={this.state.options} //需要显示的列表数据数组
              loadData={this.loadData}  //当选择某个列表项时，加载下一级列表的监听回调
              onChange={this.onChange}
              changeOnSelect
            >
            </Cascader>
          </Item>
          <Item name='imgs' label='Image' >
            <PictureWall ref={this.picWallRef} imgs={imgs}/>
          </Item>
          <Item label='Detail' labelCol={{span:2}} wrapperCol={{span:16}}>
            <RichTextEditor ref={this.richTextRef} detail={detail}/>
          </Item>
          <Item>
            <Button type='primary' onClick={() => {this.submit()}}>Submit</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}


export default withNavigation(ProductAddUpdate);
