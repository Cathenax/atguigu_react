import React, { Component } from 'react'
import { Routes, Route } from 'react-router-dom'

import ProductHome from './home'
import ProductDetail from './detail'
import ProductAddUpdate from './add-update'

export default class Product extends Component {
  render() {
    return (
      <Routes>
        <Route exact path='/product' element={<ProductHome/>}></Route>
        <Route exact path='/product/detail' element={<ProductDetail/>}></Route>
        <Route exact path='/product/addupdate' element={<ProductAddUpdate/>}></Route>
      </Routes>
    )
  }
}
