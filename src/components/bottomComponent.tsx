// 引入React组件
import React, {useEffect, useState} from "react";
// 引入公共参数接口
import {SizeType} from "../config/publicInterface";
// 引入组件样式
import "../less/bottomComponent.less";
// 引入子组件
import {BottomTop} from "./bottomTop";
import {BottomMiddle} from "./bottomMiddle";
import {BottomEnd} from "./bottomEnd";
// 引入get请求方法
import {get} from "../config/request";
// 引入参数类型
import {GetBottomDataType} from "../config/responseType";
import {handlerTips} from "../utils";

/**
 * 创建BottomComponent组件
 * @param width 组件宽度
 * @param height 组件高度
 * @param margin 组件外边距
 * @constructor
 */
export const BottomComponent: React.FC<SizeType> = ({width, height, margin}) => {
    // 保存获取底部数据状态
    const [bottomData, setBottomData] = useState<GetBottomDataType>();
    // 组件被调用时
    useEffect(() => {
        // 获取数据
        get<GetBottomDataType>('/public/bottomMsgList').then((r) => {
            // console.log(r);
            if (r.code === 200) return r.data;
            handlerTips('warning', r.msg);
        }).then((r) => {
            if (r) return setBottomData(r);
        })
    }, []);
    return (
        <>
            <div className={"bottomComponent"} style={{width: width, height: height, margin: margin}}>
                <BottomTop width={"100%"} height={"150px"} margin={"0 auto"}/>
                {
                    bottomData ?
                        <>
                            <BottomMiddle leftData={bottomData.topLeft} centerData={bottomData.topCenter}
                                          rightData={bottomData.topRight} width={"100%"} height={"217px"} margin={"0"}/>
                            <BottomEnd endData={bottomData.bottom} width={"100%"} height={"94px"} margin={"0"}/>
                        </> :
                        null
                }
            </div>
        </>
    )
}