import React, {useEffect, useState} from "react";
import {get} from "../config/request";
import {GetNavItemType} from "../config/responseType";
import {Link} from "react-router-dom";
import "../less/bottomTop.less";
import {SizeType} from "../config/publicInterface";
import {handlerTips} from "../utils";

/**
 * 定义底部上侧组件
 * @param width
 * @param height
 * @param margin
 * @constructor
 */
export const BottomTop: React.FC<SizeType> = ({width, height, margin}) => {
    // 定义导航栏数据状态
    const [navList, setNavList] = useState<Array<GetNavItemType>>([]);
    // 组件被调用时
    useEffect(() => {
        // 通过get请求拿到数据
        get<{ list: Array<GetNavItemType> }>('/public/navList').then((r) => {
            // 判断响应值是否为200，如果为200，则返回数据
            if (r.code === 200) return r.data;
            handlerTips('warning', r.msg);
        }).then((r) => {
            // 验证r是否存在，如果存在，则保存数据到状态中
            if (r) return setNavList(r.list);
        })
    }, [])
    return (
        <>
            <div className={"bottomTop"} style={{width: width, height: height, margin: margin}}>
                <div className="navList">
                    {
                        navList ?
                            navList.map((value) => (
                                <Link key={value.id} className={"item"} to={value.url}>{value.name}</Link>
                            )) :
                            null
                    }
                </div>
            </div>
        </>
    )
}