import React, { Fragment } from "react";
import { Button, Tooltip } from "antd";
import styles from "./ToolBarPanel.module.less";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToolBarIconType, ToolBarItem, toolBarData } from "./data";

export interface ToolBarPanelProps {
    onIconClick: (type: ToolBarIconType) => void,
    isIconDisabled: [ToolBarIconType, boolean][],
};

const data = toolBarData;

const generateToolBar = (onIconClick: ToolBarPanelProps['onIconClick'], data: ToolBarItem[][], isIconDisabled: ToolBarPanelProps['isIconDisabled']) => {
    const isIconDisabledMap = new Map<ToolBarIconType, boolean>(isIconDisabled);

    return data.map((groups, groupInd, arr) =>
    (
        <Fragment key={`toolbar-group-${groupInd}`}>
            {
                ...groups.map((item, ind) =>
                (
                    <Tooltip title={item.title} placement="bottom" key={`tooltip-${groupInd}-${ind}`}>
                        <span
                            className={isIconDisabledMap.get(item.type) ? styles.command : styles.disable}
                            key={`toolbar-command-${groupInd}-${ind}`}
                            onClick={() => isIconDisabledMap.get(item.type) && onIconClick(item.type)} >
                            <FontAwesomeIcon
                                icon={item.icon}
                                key={`toolbar-icon-${groupInd}-${ind}`}
                                className={styles.icon}
                                id={`toolbar-icon-${item.type}`}
                            />
                        </span>
                    </Tooltip>
                ))
            }

            {groupInd !== arr.length && <span className={styles.separator} key={`sep-${groupInd}`} />}
        </Fragment>
    ));
};

const ToolBarPanel: React.FC<ToolBarPanelProps> = ({ onIconClick: handleIconClick, isIconDisabled }) => {
    const toRender = generateToolBar(handleIconClick, data, isIconDisabled);

    return (
        <div className={styles.toolbar}>
            {toRender}
            <div
                style={{ marginLeft: 'auto' }}>
                <Button
                    style={{ marginRight: '30px' }}
                    onClick={() => handleIconClick('saveManage')}>
                    存档管理
                </Button>
                <Button
                    style={{ marginRight: '30px' }}
                    onClick={() => handleIconClick('unitList')}>
                    设备列表
                </Button>
            </div>
        </div>
    );
};

export default ToolBarPanel;