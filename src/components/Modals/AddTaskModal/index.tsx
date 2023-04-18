import type { ISaveFile } from "@/types";
import { SAVE_FILE_KEY } from "@/views/EditFlowChartView/data";
import { Modal, Input, Checkbox, Select, Space, Typography, message } from "antd";
import React, { useState } from "react";

export interface IAddTaskModalProps {
    onOk: (content: string) => void;
    onCancel: () => void;
    isDisplay: boolean;
}

const getSaveData = (): ISaveFile[] => {
    if (typeof window !== 'undefined') {
        let data = localStorage.getItem(SAVE_FILE_KEY);
        if (data !== null) {
            try {
                data = JSON.parse(data);
                return data as ISaveFile[];
            } catch (exception) {
                console.error(exception);
            };
        }
    }

    return [];
}

const AddTaskModal: React.FC<IAddTaskModalProps> = ({ onCancel: handleCancel, onOk: handleOk, isDisplay }) => {
    const [content, setContent] = useState<string>('');
    const [checked, setChecked] = useState<boolean>(false);
    const [slot, setSlot] = useState<number>();

    const data = getSaveData();
    const options = data.map(val => ({ value: val.slot, label: `槽位: ${val.slot}, 保存时间: ${val.saveTime}` }));

    return (
        <Modal
            title='添加任务'
            centered
            open={isDisplay}
            onOk={() => {
                if (checked) {
                    const saveContent = data.find(val => val.slot === slot);
                    if (saveContent)
                        handleOk(saveContent.content);
                    else
                        message.error(`保存槽位 ${slot} 不存在`);
                }
                else
                    handleOk(content);
            }}
            onCancel={() => handleCancel()}
            width={'45%'}
            bodyStyle={{ height: '525px' }}
        >
            <Checkbox
                style={{ margin: '10px 10px' }}
                checked={checked}
                onChange={e => setChecked(e.target.checked)}>

                选择存档
            </Checkbox>
            {
                checked &&
                <div style={{ margin: '10px 10px', width: '100%' }}>
                    <Space style={{ width: '100%' }}>
                        <Typography.Text>
                            存档槽位:
                        </Typography.Text>
                        <Select<number>
                            style={{ width: '100%' }}
                            placeholder='选择存档'
                            value={slot}
                            onChange={val => setSlot(val)}
                            options={options}
                        />
                    </Space>
                </div>
            }
            {
                !checked &&
                <Input.TextArea
                    value={content}
                    style={{ height: '460px', maxHeight: '460px', minHeight: '460px' }}
                    allowClear
                    showCount
                    onChange={e => setContent(e.target.value)} />
            }

        </Modal>
    );
};

export default AddTaskModal;