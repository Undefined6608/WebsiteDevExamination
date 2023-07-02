// 引入React
import React from "react";
// 引入公共组件参数接口
import {SizeType} from "../config/publicInterface";
// 引入头部组件样式
import "../less/headerComponent.less";
// 引入子组件
import {TitleComponent} from "./titleComponent";
import {HeaderNav} from "./headerNav";

/**
 * 创建头部组件
 * @param width 组件宽度
 * @param height 组件高度
 * @param margin 组件外边距
 * @constructor
 */
export const HeaderComponent: React.FC<SizeType> = ({width, height, margin}) => {
    return (
        <>
            {/*将父组件传来的组件样式设置为div样式*/}
            <div className={"header"} style={{width: width, height: height, margin: margin}}>
                {/*挂载头部左侧标题组件*/}
                <TitleComponent width={"330"} height={"120px"} margin={"0"}/>
                {/*挂载头部右侧导航列表*/}
                <HeaderNav width={"646px"} height={"35px"} margin={"0"}/>
            </div>
        </>
    )
}