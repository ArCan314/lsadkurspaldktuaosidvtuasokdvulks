import { Modal, Input } from "antd";
import React, { useState } from "react";

export interface IImportModalProps {
    onOk: (content: string) => void;
    onCancel: () => void;
    isDisplay: boolean;
}

const ImportModal: React.FC<IImportModalProps> = ({ onCancel: handleCancel, onOk: handleOk, isDisplay }) => {
    const [content, setContent] = useState<string>('');

    return (
        <Modal
            title='导入数据'
            centered
            open={isDisplay}
            onOk={() => handleOk(content)}
            onCancel={() => handleCancel()}
            width={'45%'}
            bodyStyle={{ height: '525px' }}
        >
            <Input.TextArea
                value={content}
                style={{ height: '510px', maxHeight: '510px', minHeight: '510px' }}
                allowClear
                showCount
                onChange={e => setContent(e.target.value)} />
        </Modal>
    );
};

export default ImportModal;