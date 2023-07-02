// 引入React相关组件
import React, {useEffect} from "react";
// 引入AntDesign组件
import {notification} from "antd";
// 引入PubSub实现订阅与发布
import PubSub from "pubsub-js";
// 定义提示类型接口
type NotificationType = 'success' | 'info' | 'warning' | 'error';
// 定义传入的数据格式
type MsgType = { type: NotificationType, message: string, description: string };

export const TipsComponent: React.FC = () => {
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        const openNotificationWithIcon = (msg: MsgType) => {
            api[msg.type]({
                message: msg.message,
                description: msg.description,
            });
        };
        const tipsToken = PubSub.subscribe('tips', (_, msg: MsgType) => {
            openNotificationWithIcon(msg);
        })
        return () => {
            PubSub.unsubscribe(tipsToken);
        }
    }, [])
    return (
        <>
            {contextHolder}
        </>
    )
}