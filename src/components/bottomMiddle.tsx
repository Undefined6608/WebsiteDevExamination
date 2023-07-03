import React from "react";
import {SizeType} from "../config/publicInterface";
import {BottomTopCenterType, BottomTopLeftType, BottomTopRightType} from "../config/responseType";
import "../less/bottomMiddle.less";

// 定义参数接口类型
interface BottomMiddleLeftParam extends SizeType {
    // 左侧
    leftData: BottomTopLeftType,
    // 中间
    centerData: BottomTopCenterType,
    // 右侧
    rightData: BottomTopRightType
}

/**
 * 定义底部中间组件
 * @param width 组件宽度
 * @param height 组件高度
 * @param margin 组件边距
 * @param leftData 左侧数据
 * @param centerData 中间数据
 * @param rightData 右侧数据
 * @constructor
 */
export const BottomMiddle: React.FC<BottomMiddleLeftParam> = ({
                                                                  width,
                                                                  height,
                                                                  margin,
                                                                  leftData,
                                                                  centerData,
                                                                  rightData
                                                              }) => {
    return (
        <>
            <div className={"bottomMiddle"} style={{width: width, height: height, margin: margin}}>
                {
                    // 判断左、中、右数据都存在
                    leftData || centerData || rightData ?
                        <div className={"bottomContainer"}>
                            <div className={"left"}>
                                <span>{leftData.one}</span>
                                <span>{leftData.two}</span>
                                <button className={"test"}>{leftData.three}</button>
                            </div>
                            <div className={"center"}>
                                <span>{centerData.title}</span>
                                <div className="centerMsg">
                                    <span>{centerData.phone}</span>
                                    <span>{centerData.email}</span>
                                </div>
                            </div>
                            <div className={"right"}>
                                <img className={"qr"} src={rightData.QRCode} alt=""/>
                                <span>{rightData.tip}</span>
                                <span>{rightData.end}</span>
                            </div>
                        </div> :
                        null
                }
            </div>
        </>
    )
}