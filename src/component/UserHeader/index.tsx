import React from 'react';

import { Layout, Space, Typography, theme } from 'antd';
import { BellOutlined, SearchOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faGlobe } from '@fortawesome/free-solid-svg-icons';

const { Header } = Layout;

export default function UserHeader() {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Header style={{ padding: 0, background: colorBgContainer }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginRight: 20 }} >
                <Space size='large'>
                    <Typography.Link><SearchOutlined style={{ fontSize: 18, color: 'black' }} /></Typography.Link>
                    <Typography.Link><BellOutlined style={{ fontSize: 18, color: 'black' }} /></Typography.Link>
                    <div>
                        <Space size='small'>
                            <FontAwesomeIcon icon={faCircle} style={{ fontSize: 21, color: 'brown', marginTop: '4px' }} />
                            <Typography.Link style={{ fontSize: 18, color: 'black', textAlign: 'center' }}>用户名</Typography.Link>
                        </Space>
                    </div>
                    <Typography.Link><FontAwesomeIcon icon={faGlobe} style={{ fontSize: 18, color: 'black' }} /></Typography.Link>
                </Space>
            </div>
        </Header>);
}
