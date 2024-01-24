import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, message } from 'antd';
import PropTypes from 'prop-types';

import { reqDeleteImg } from '../../api';
import { BASE_IMG_URL } from '../../utils/constants'

//用于图片上传的组件，这次使用函数组件

//获取文件Base64形式编码的rul，这样可以在上传失败的时候也能显示图片预览
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);  //读取文件内容，并将其以 Data URL 的形式返回
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});

const PictureWall = forwardRef((props,ref) => {
    const [previewOpen, setPreviewOpen] = useState(false); //标识是否显示大图预览
    const [previewImage, setPreviewImage] = useState('');  //保存要预览的图片，是一个url地址
    const [previewTitle, setPreviewTitle] = useState('');  //保存预览图片的标题
    //如果是修改，通过图片名称数组获取商品图片列表对象
    const getImgsFromProps = () => {
        const {imgs} = props
        let fileList = []
        if(imgs && imgs.length > 0){
            fileList = imgs.map((img, index) => ({
                uid: -index, //唯一标识
                name: img, //文件名
                status: 'done',
                url: BASE_IMG_URL + img
            }))
        }
        return fileList
    }
    //图片文件列表
    const [fileList, setFileList] = useState(getImgsFromProps);
    //通过该函数将函数类型的子组件PirctureWall的getImages函数传递给父组件AddUpdate
    useImperativeHandle(ref, () => ({
    getImages: getImages
    }))
    //获取所有已经上传图片文件名的数组
    const getImages = () =>{
    return  fileList.map(file => file.name)
    }
    //关闭预览界面
    const handleCancel = () => setPreviewOpen(false);
    //显示指定file对应的大图
    const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    //文件发生改变时
    //fileList：所有已上传图片文件对象的数组
    //file：当前操作的图片文件（上传/删除）
    //这个方法会多次调用以监控图片目前的状态
    const handleChange = async ({ fileList: newFileList, file : currentFile }) => {
    //一旦上传成功，将当前上传的file的信息修正（name值不对，增加url值）
    if(currentFile.status === 'done'){
        const result = currentFile.response //{status:0,data:{name:,url:,}}
        if(result.status === 0){
            message.success('Success in uploading image!')
            const { name, url } = result.data
            currentFile.name = name
            currentFile.url = url
        }
        else{
            message.error('Fail in uploading image!')
        }
    }
    else if(currentFile.status === 'removed'){
        //删除图片
        const result = await reqDeleteImg(currentFile.name)
        if(result.status === 0){
            message.success('Success in deleting image!')
        }else{
            message.error('Fail in deleting image!')
        }
    }
    console.log(currentFile.status,
                currentFile === newFileList[newFileList.length-1],
                currentFile)
    //在操作（上传/删除）过程中更新FileList状态
    setFileList(newFileList)
    };
    const uploadButton = (
    <button
        style={{
        border: 0,
        background: 'none',
        }}
        type="button"
    >
        <PlusOutlined />
        <div
        style={{
            marginTop: 8,
        }}
        >
        Upload
        </div>
    </button>
    );
    return (
    <div>
        <Upload
        accept='image/*'   //设置只接受图片形式的文件
        action="/manage/img/upload"  // 上传图片文件地址
        name='image'  //请求参数名，我们的后台接口需要的参数名是image
        listType="picture-card" //卡片样式
        fileList={fileList}  //指定所有已上传的图片文件对象的数组
        onPreview={handlePreview}  //指定处理预览图片的函数
        onChange={handleChange}    //指定处理上传图片的函数
        >
        {fileList.length >= 9 ? null : uploadButton}
        </Upload>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
            alt="example"
            style={{
            width: '100%',
            }}
            src={previewImage}
        />
        </Modal>
    </div>
    );
});

PictureWall.propTypes = {
    imgs: PropTypes.array,
};
export default PictureWall;