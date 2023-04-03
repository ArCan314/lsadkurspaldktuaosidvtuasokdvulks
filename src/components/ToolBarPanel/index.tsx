import React from "react";
import { Tooltip } from "antd";
import styles from "./ToolBarPanel.module.less";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faMagnifyingGlass, faMagnifyingGlassMinus, faMagnifyingGlassPlus, faMaximize, faPaste, faRotateLeft, faRotateRight, faTrash } from "@fortawesome/free-solid-svg-icons";

const ToolBarPanel: React.FC = () => {
    return (
        <div className={styles.toolbar}>
            <Tooltip title={"撤销"} placement="bottom">
                <span className={styles.command} data-command="undo">
                    <FontAwesomeIcon icon={faRotateLeft} className={styles.icon} />
                </span>
            </Tooltip>
            <Tooltip title={'重做'} placement="bottom">
                <span className={styles.command} data-command="redo">
                    <FontAwesomeIcon icon={faRotateRight} className={styles.icon} />
                </span>
            </Tooltip>
            <span className={styles.separator} />
            <Tooltip title={'复制'} placement="bottom">
                <span className={styles.command} data-command="copy">
                    <FontAwesomeIcon icon={faCopy} className={styles.icon} />
                </span>
            </Tooltip>
            <Tooltip title={'粘贴'} placement="bottom">
                <span className={styles.command} data-command="paste">
                    <FontAwesomeIcon icon={faPaste} className={styles.icon} />
                </span>
            </Tooltip>
            <Tooltip title={'删除'} placement="bottom">
                <span className={styles.command} data-command="delete">
                    <FontAwesomeIcon icon={faTrash} className={styles.icon} />
                </span>
            </Tooltip>
            <span className={styles.separator} />
            <Tooltip title={'放大'} placement="bottom">
                <span className={styles.command} data-command="zoomIn">
                    <FontAwesomeIcon icon={faMagnifyingGlassPlus} className={styles.icon} />
                </span>
            </Tooltip>
            <Tooltip title={'缩小'} placement="bottom">
                <span className={styles.command} data-command="zoomOut">
                    <FontAwesomeIcon icon={faMagnifyingGlassMinus} className={styles.icon} />
                </span>
            </Tooltip>
            <Tooltip title={'实际大小'} placement="bottom">
                <span className={styles.command} data-command="resetZoom">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.icon} />
                </span>
            </Tooltip>
            <Tooltip title={'适应屏幕'} placement="bottom">
                <span className={styles.command} data-command="autoFit">
                    <FontAwesomeIcon icon={faMaximize} className={styles.icon} />
                </span>
            </Tooltip>
        </div>
    );
};

export default ToolBarPanel;