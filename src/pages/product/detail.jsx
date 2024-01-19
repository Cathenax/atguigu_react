import React, { Component } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import{
  Card,
  List,
}from 'antd'
import {
  ArrowLeftOutlined,
} from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'

const Item = List.Item
export const withNavigation = (Component) => {
  return (props) => <Component {...props} navigate={useNavigate()} location={useLocation()} />;
}
//Product的详情子路由组件
class ProductDetail extends Component {
  state = {
    cName1: '', //一级分类名称
    cName2: '', //二级分类名称
  }
  async componentDidMount () {
    //得到当前商品的分类ID
    const { pCategoryId, categoryId } = this.props.location.state.product
    if(pCategoryId === '0'){ //一级分类下的商品
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      this.setState({cName1})
    }else{ //二级分类下的商品
      //这样通过多个await会导致只有前面的请求成功之后后面的请求才会发送，有效率问题
      // const result1 = await reqCategory(pCategoryId) //获取一级分类列表
      // const result2 = await reqCategory(categoryId)  //获取二级分类列表
      // const cName1 = result1.data.name
      // const cName2 = result2.data.name
      
      //一次性发送多个请求，只有都成功了才正常处理，获得的返回值是多个result的数组
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      this.setState({
        cName1,
        cName2
      })
    }
  }
  render() {
    //获取传过来的state数据
    const {name, desc, price, detail, imgs} = this.props.location.state.product
    const {cName1, cName2} = this.state
    const title = (
      <span>
        <LinkButton> 
          <ArrowLeftOutlined 
            style={{marginRight:15, fontSize:20}} 
            onClick={() => {this.props.navigate(-1)}}/>
        </LinkButton>
        <span>Product detail</span>
      </span>
    )
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='left'>Product Name:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className='left'>Product Description:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>Product Price:</span>
            <span>{price}</span>
          </Item>
          <Item>
            <span className='left'>Product's Category:</span>
            <span>{cName1}{cName2 ? '-->' + cName2 : ''}</span>
          </Item>
          <Item>
            <span className='left'>Product's Image:</span>
            <span>
              {
                imgs.map( (img) => {
                  return (
                  <img
                    key={img}
                    src={BASE_IMG_URL + img}
                    className='product-img'
                    alt='img'
                  />)
                })
              }
            </span>
          </Item>
          <Item>
            <span className='left'>Product detail:</span>
            <span dangerouslySetInnerHTML={{__html: detail}}></span>
          </Item>
        </List>
      </Card>
    )
  }
}

export default withNavigation(ProductDetail);