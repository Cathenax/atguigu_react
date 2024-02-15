import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input,
} from 'antd'

const Item = Form.Item

//添加分类的Form组件
export default class AddRole extends Component {
  static propTypes = {
    getForm: PropTypes.func.isRequired, //传递表单实例的函数
  }

  constructor(props){
    super(props)
    this.formRef = React.createRef();
  }
  componentDidMount() {
    //将表单从子组件传递到父组件，利用函数类型的props
    this.props.getForm(this.formRef)
  }
  render() {
    const formItemLayout = {
        labelCol: {span : 6},
        wrapperCol: {span : 15}
    }
    return (
      <Form 
        ref={this.formRef}
        {...formItemLayout}
      >
        <Item 
          label = 'Name of Role'
          initialValue='' name='roleName'
          rules={[
            {required: true, message: 'Please input role name!'}
          ]}
        >
          <Input placeholder='Name of the Role'></Input>
        </Item>
      </Form>
    )
  }
}
