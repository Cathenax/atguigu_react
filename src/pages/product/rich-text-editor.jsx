import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
    }

    constructor(props){
        super(props);
        const html = this.props.detail
        if(html){ //如果有值，根据html字符串创建一个对应的编辑对象，显示
            const contentBlock = htmlToDraft(html)
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState)
            this.state = {
                editorState,
            };
        }else{
            this.state = {
                editorState: EditorState.createEmpty(), //创建一个没有内容的编辑对象
            }
        }
    }

    //输入过程中实时回调
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    //返回输入数据对应的html格式的字符串
    getDetail = () =>{
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    render() {
        const { editorState } = this.state;
        return (
            <Editor
            editorState={editorState}
            editorStyle={{border:'1px solid black', minHeight:200, paddingLeft: 10}}
            onEditorStateChange={this.onEditorStateChange}
            />
        );
    }
}