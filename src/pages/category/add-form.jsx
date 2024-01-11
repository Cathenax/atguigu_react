import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Input,
} from 'antd'

const Item = Form.Item
const Option = Select.Option

//添加分类的Form组件
export default class AddForm extends Component {
  static propTypes = {
    categoryList: PropTypes.array.isRequired, //一级分类数组
    parentId: PropTypes.string.isRequired, //父分类id
    getForm: PropTypes.func.isRequired, //传递表单实例的函数
  }

  constructor(props){
    super(props)
    this.formRef = React.createRef();
  }
  // 当从父组件传递的 parentId 发生变化时更新输入框的默认值
  componentDidUpdate(prevProps) {
    if (prevProps.parentId !== this.props.parentId) {
        this.formRef.current.setFieldsValue({ parentId: this.props.parentId });
    }
  }
  componentDidMount() {
    //将表单从子组件传递到父组件，利用函数类型的props
    this.props.getForm(this.formRef)
  }
  render() {
    const {categoryList, parentId} = this.props
    return (
      <Form ref={this.formRef}>
        <Item 
          initialValue={parentId} 
          name='parentId'
        >
          <Select>
            <Option value='0'>Primary Category</Option>
            {
              categoryList.map(c => <Option value={c._id}>{c.name}</Option>)
            }
          </Select>
        </Item>
        <Item 
          initialValue='' name='categoryName'
          rules={[
            {required: true, message: 'Please input category name!'}
          ]}
        >
          <Input placeholder='Name of the Category'></Input>
        </Item>
      </Form>
    )
  }
}
