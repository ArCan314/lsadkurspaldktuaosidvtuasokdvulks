import React from 'react';
import {
    DesktopOutlined,
    PieChartOutlined,
} from '@ant-design/icons';
import { MenuProps } from 'antd';
import router from 'next/router';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

export const menuData: MenuItem[] = [
    getItem('分析页', '1a'),
    getItem('人员管理', '1b'),
    getItem('颜色自定义', '1c'),
    getItem('活动管理', '1d'),
    getItem('供应伙伴推荐', '1e'),
    getItem('链接预测', '1f'),
];

export const handleMainMenuClick = (key: string) => {
    if (key === '1a')
        router.push('/');
    else if (key === '1b')
        router.push('/human-resource');
    else if (key === '1c')
        router.push('/background-color');
    else if (key === '1d')
        router.push('/activities');
    else if (key === '1e')
        router.push('/recommend');
    else if (key === '1f')
        router.push('/predication');
}