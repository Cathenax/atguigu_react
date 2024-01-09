import React, { Component } from 'react'
import {
  Form,
  Select,
  Input,
} from 'antd'

const Item = Form.Item
const Option = Select.Option

//添加分类的Form组件
export default class AddForm extends Component {
  //表格提交并且检验通过后调用
  onFinish = (value) => {

  }
  //表格提交并且检验失败后调用
  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  render() {
    return (
      <Form
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
      >
        <Item>
          <Select
            defaultValue="Category"
          >
            <Option value='0'>
              A
            </Option>
            <Option value='1'>
              B
            </Option>
          </Select>
        </Item>
        <Item>
          <Input placeholder='Name of the Category'></Input>
        </Item>
      </Form>
    )
  }
}
