import React, { Component } from 'react'
import { Routes, Route } from 'react-router-dom'

import ProductHome from './home.jsx'
import ProductDetail from './detail.jsx'
import ProductAddUpdate from './add-update.jsx'

import './product.css' 

export default class Product extends Component {
  render() {
    return (
      // 注意这边的path因为已经是子路由，所以尽管实际地址是/product/detail等
      //但并不需要在Route组件的path中写上前缀/product，*代表全部匹配，记得在父组件也要加上
      <Routes>
        <Route path='*' element={<ProductHome/>}/>
        <Route path='/detail' element={<ProductDetail/>}/>
        <Route path='/addupdate' element={<ProductAddUpdate/>}/>
      </Routes>
      // <ProductHome/>
    )
  }
}
