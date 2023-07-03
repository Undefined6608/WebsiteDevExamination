import React, {ReactNode, useEffect, useState} from "react";
import {SizeType} from "../config/publicInterface";
import {get} from "../config/request";
import {HomeTwoDataType} from "../config/responseType";
import "../less/homeTwo.less";
import {handlerTips} from "../utils";
import {ModuleTitle} from "./moduleTitle";
import {Tabs} from 'antd';
import type {TabsProps} from 'antd';
import {ProductItem} from "./productItem";
import {ProductList} from "./productList";

interface HomeTwoParam extends SizeType {
    url: string
}

export const HomeTwo: React.FC<HomeTwoParam> = ({width, height, margin, url}) => {
    const [data, setData] = useState<HomeTwoDataType>();
    const [items, setItems] = useState<TabsProps['items']>([]);
    const onChange = (key: string) => {
        if (data) {
            setItems(data.type.map((value) => {
                return {
                    key: value.id,
                    label: value.name,
                    children: <ProductList key={value.id} width={"80%"} height={"80%"} margin={"0 auto"}
                                           listData={data.productList} type={key}/>
                }
            }))
        }
    };
    useEffect(() => {
        get<HomeTwoDataType>(url).then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', r.msg, "获取失败！");
        }).then((r) => {
            if (r) {
                setData(r);
                setItems(r.type.map((value) => {
                    return {
                        key: value.id,
                        label: value.name,
                        children: <ProductList width={"80%"} height={"80%"} margin={"0 auto"}
                                               listData={r.productList} type={value.id}/>,
                    }
                }))
            }
        })
    }, []);
    return (
        <>
            {
                data ?
                    <div className={"homeTwo"} style={{width: width, height: height, margin: margin}}>
                        <ModuleTitle title={data.title} subTitle={data.subTitle} textCenter={true} width={"100%"}
                                     height={"auto"} margin={"0"}/>
                        <Tabs className={"productBox"} centered={true}
                              tabBarStyle={{height: "60px", background: "var(--background-color)"}} defaultActiveKey="1"
                              items={items} onChange={onChange}/>
                    </div> :
                    null
            }
        </>
    )
}