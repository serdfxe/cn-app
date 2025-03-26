import React from 'react';

import { Divider, Flex, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';
import Settings from './Settings';

const SettingsPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <h1 style={{paddingLeft: 42, margin: 0, justifyContent: "space-between"}} className='flex align-items-center'>
                <Flex gap="small">
                    <SettingOutlined style={{margin: "0 8px 0 0"}}/>
                    <strong style={{width: '-webkit-fill-available'}}>
                    <Typography.Title style={{margin: 0}}>
                        Settings
                    </Typography.Title>
                    </strong>
                </Flex>
            </h1>   
            <Divider />
            <Settings />
        </>
    );
};

export default SettingsPage;