import React, { useState } from 'react';
import { Card, Image, Input, Modal, Typography, Upload, message } from 'antd';
import { SettingOutlined, UploadOutlined } from "@ant-design/icons";
import { patchBlock } from '../../../../client/notes/block';
import Meta from 'antd/es/card/Meta';
import { getToken } from '../../../../client/auth';
import { config } from '../../../../config';

const { Dragger } = Upload;

const ImageBlock = ({ block }) => {
    const [textContent, setTextContent] = useState(block.properties.text ? block.properties.text[0][0] : "");
    const [imageContent, setImageContent] = useState(block.properties.image ? block.properties.image[0][0] : null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    let [newProps, setNewProps] = useState(null);

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
        setNewProps(null);
    }

    const submitModal = () => {
        patchBlock(block.id, {
            properties: {
                ...block.properties,
                ...newProps,
            }
        })
            .then(data => {
                closeModal();
                if (!newProps) {
                    return;
                }

                if ("text" in newProps) {
                    setTextContent(newProps.text[0][0]);
                }

                if ("image" in newProps) {
                    setImageContent(newProps.image[0][0]);
                }
            })
    }

    const onEdit = (prop, val) => {
        setNewProps({
            [prop]: [[val]],
        });
    }

    const uploadProps = {
        name: 'file',
        multiple: false,
        action: `${config.baseURL}/media/media`,
        headers: {
            'Authorization': 'Bearer ' + getToken(),
        },
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('You can only upload image files!');
            }
            return isImage;
        },
        onChange: (info) => {
            if (info.file.status === 'uploading') {
                setIsUploading(true);
                return;
            }
            if (info.file.status === 'done') {
                setIsUploading(false);
                const { filename } = info.file.response;
                const imageUrl = `${config.baseURL}/media/media/${filename}`;
                setImageContent(imageUrl);
                setNewProps({
                    image: [[imageUrl]]
                });
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                setIsUploading(false);
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <>
            <Modal
                title="Settings"
                open={isModalOpen}
                onCancel={closeModal}
                onClose={closeModal}
                onOk={submitModal}
                okButtonProps={{ loading: isUploading }}
            >   
                <Typography.Paragraph>
                    Text
                    <Input 
                        defaultValue={textContent} 
                        onChange={(e) => onEdit('text', e.target.value)} 
                    />
                </Typography.Paragraph>
                <Typography.Paragraph>
                    Image URL
                    <Input 
                        defaultValue={imageContent} 
                        onChange={(e) => onEdit('image', e.target.value)} 
                    />
                </Typography.Paragraph>
                <Typography.Paragraph>
                    Or upload from computer:
                    <Dragger 
                        {...uploadProps}
                        disabled={isUploading}
                    >
                        <p className="ant-upload-drag-icon">
                            <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">
                            {isUploading ? 'Uploading...' : 'Click or drag file to this area to upload'}
                        </p>
                        <p className="ant-upload-hint">
                            Support for a single image upload
                        </p>
                    </Dragger>
                </Typography.Paragraph>
            </Modal>
            <Card
                style={{
                    width: '50%',
                    overflow: 'hidden',
                }}
                cover={
                    <Image 
                        alt="Image" 
                        src={imageContent} 
                        style={{minHeight: "100px"}} 
                        className='flex aling-items-center'
                    />
                }
                actions={[
                    <SettingOutlined key="setting" onClick={openModal}/>,
                ]}   
            >
                <Meta title={textContent === '' ? "Untitled" : textContent}/>
            </Card>
        </>
    );
};

export default ImageBlock;