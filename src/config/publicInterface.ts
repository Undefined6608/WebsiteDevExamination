// 定义提示类型接口
export type NotificationType = 'success' | 'info' | 'warning' | 'error';
// 定义页面传参公共接口
export type SizeType = {
    // 页面宽度
    width: string,
    // 页面高度
    height: string,
    // 外边距
    margin: string
}