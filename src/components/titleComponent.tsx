// 引入React依赖
import React, {useEffect, useState} from "react";
// 引入gqt请求方法
import {get} from "../config/request";
// 引入logo和副标题响应值类型
import {GetLogoType, GetSubTitleType} from "../config/responseType";
// 引入组件样式
import "../less/titleComponent.less";
// 引入公共组件参数接口
import {SizeType} from "../config/publicInterface";
// 引入开启提示的方法
import {handlerTips} from "../utils";

export const TitleComponent: React.FC<SizeType> = ({width, height, margin}) => {
    // 定义logo状态
    const [logo, setLogo] = useState<string>('');
    // 定义副标题状态
    const [subTitle, setSubTitle] = useState<string>('');
    // 组件创建完成后
    useEffect(() => {
        // 调取api接口获取logo
        get<GetLogoType>('/public/logo').then((r) => {
            // 如果等于200，返回data数据
            if (r.code === 200) return r.data;
            // 开启提示
            handlerTips('warning', r.msg);
        }).then((r) => {
            // 输出获取到的数据
            // console.log(r);
            // 如果存在logo地址，则保存logo地址
            if (r) return setLogo(r.icon);
        })
        // 同理
        get<GetSubTitleType>('/public/subTitle').then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', r.msg);
        }).then((r) => {
            // console.log(r);
            if (r) return setSubTitle(r.title);
        })
    }, []);
    return (
        <>
            {/*将父组件传来的组件样式设置为div样式*/}
            <div className="headerTitle" style={{width: width, height: height, margin: margin}}>
                {/*logo图片显示*/}
                <img className={"logo"} src={logo} alt=""/>
                {/*副标题显示*/}
                <span className="subtitle"> {subTitle} </span>
            </div>
        </>
    )
}