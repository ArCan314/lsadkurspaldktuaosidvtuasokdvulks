import React from 'react';
import styles from "./DetailPanel.module.less";
import { theme } from 'antd';

const DetailPanel: React.FC = () => {
    const { token: { colorBgContainer } } = theme.useToken();
    return (
        <div className={styles.detailPanel} style={{ background: colorBgContainer }}>
            ASDF
        </div>
    );
};

export default DetailPanel;
