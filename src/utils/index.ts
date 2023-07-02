import {NotificationType} from "../config/publicInterface";
import PubSub from "pubsub-js";

/**
 * 提示
 * @param type 提示类型
 * @param description
 * @param message
 */
export const handlerTips = (type: NotificationType, description: string, message?: string | '请求失败') => {
    return PubSub.publish('tips', {type: type, message: message, description: description});
}