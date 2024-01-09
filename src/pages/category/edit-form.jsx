import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {
  Form,
  Input,
} from 'antd'

const Item = Form.Item

//添加分类的Form组件
export default class EditForm extends Component {
    
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        getForm: PropTypes.func.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = {
          //从父组件接收输入框默认值
          categoryName: this.props.categoryName,
        };
        this.formRef = React.createRef();
    }
    // 当从父组件传递的 categoryName 发生变化时更新输入框的默认值
    componentDidUpdate(prevProps) {
        if (prevProps.categoryName !== this.props.categoryName) {
            this.formRef.current.setFieldsValue({ categoryName: this.props.categoryName });
        }
    }
    componentDidMount() {
        //将表单从子组件传递到父组件，利用函数类型的props
        this.props.getForm(this.formRef)
    }
    render() {
        let {categoryName} = this.state
        return (
            <Form ref={this.formRef}>
                <Item name='categoryName' initialValue={categoryName}>
                    <Input 
                        onChange={this.handleInputChange}
                        placeholder='Name of the Category'
                    ></Input>
                </Item>
            </Form>
        )
    }
}
