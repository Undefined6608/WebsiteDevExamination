// 引入React组件
import React, {useEffect, useState} from "react";
// 引入公共组件参数接口
import {SizeType} from "../config/publicInterface";
// 引入gqt请求方法
import {get} from "../config/request";
// 引入导航栏单个条目响应值类型
import {GetNavItem} from "../config/responseType";
// 引入开启提示的方法
import {handlerTips} from "../utils";
// 引入路由跳转组件
import {Link} from "react-router-dom";
// 引入导航条样式
import "../less/headerNav.less";

/**
 * 创建HeaderNav组件
 * @param width 组件宽慰
 * @param height 组件高度
 * @param margin 组件外边距
 * @constructor
 */
export const HeaderNav: React.FC<SizeType> = ({width, height, margin}) => {
    // 创建导航列表状态
    const [navList, setNavLiat] = useState<Array<GetNavItem>>([]);
    // 创建选择条目状态，默认为 a
    const [status, setStatus] = useState<string>('a');
    // 组件被调用时执行一次
    useEffect(() => {
        // 通过get请求，获取导航条的数据
        get<{ list: Array<GetNavItem> }>('/public/navList').then((r) => {
            // 如果响应值为200 则返回数据
            if (r.code === 200) return r.data.list
            // 如果不为200，则给出提示
            handlerTips('warning', r.msg);
        }).then((r) => {
            // 输出查看响应数据
            console.log(r);
            // 如果数据存在，则保存数据到状态中
            if (r) return setNavLiat(r);
        })
    }, [])
    return (
        <>
            {/*将父组件传来的组件样式设置为div样式*/}
            <div className={"headerNav"} style={{width: width, height: height, margin: margin}}>
                {/*判断导航条数据是否存在*/}
                {navList ?
                    // 如果不为空，循环遍历导航条数据
                    navList.map((value) => (
                        // 渲染为可点击的路由组件
                        <Link key={value.id} className={status === value.id ? "header-link active" : "header-link"}
                              to={value.url} children={value.name} onClick={(e) => setStatus(value.id)}/>
                    )) :
                    // 如果为空，则不渲染
                    null}
            </div>
        </>
    )
}