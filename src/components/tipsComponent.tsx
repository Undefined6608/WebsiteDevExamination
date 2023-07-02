// 引入React相关组件
import React, {useEffect} from "react";
// 引入AntDesign组件
import {notification} from "antd";
// 引入PubSub实现订阅与发布
import PubSub from "pubsub-js";
// 引入提示类型接口
import {NotificationType} from "../config/publicInterface";
// 定义传入的数据格式
type MsgType = { type: NotificationType, message: string, description: string };

// 定义TipsComponent组件
export const TipsComponent: React.FC = () => {
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        // 开启提示方法
        const openNotificationWithIcon = (msg: MsgType) => {
            // 修改api实现不同的提示
            api[msg.type]({
                message: msg.message,
                description: msg.description,
            });
        };
        // 通过订阅的方式进行控制提示框的显示
        const tipsToken = PubSub.subscribe('tips', (_, msg: MsgType) => {
            openNotificationWithIcon(msg);
        })
        // 在页面销毁时调用
        return () => {
            // 清除订阅
            PubSub.unsubscribe(tipsToken);
        }
    }, [])
    return (
        <>
            {/*显示组件*/}
            {contextHolder}
        </>
    )
}