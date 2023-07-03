import React, {useEffect, useState} from "react";
import {SizeType} from "../config/publicInterface";
import "../less/homeOne.less";
import {get} from "../config/request";
import {HomeOneDataType} from "../config/responseType";
import {handlerTips} from "../utils";
import {PageImg} from "./pageImg";
import {ModuleTitle} from "./moduleTitle";
import {Link} from "react-router-dom";

export const HomeOne: React.FC<SizeType> = ({width, height, margin}) => {
    const [data, setData] = useState<HomeOneDataType>();
    useEffect(() => {
        get<HomeOneDataType>('/home/homeOne').then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', r.msg, "获取失败！");
        }).then((r) => {
            setData(r);
        })
    }, []);
    return (
        <>
            <div className={"homeOne"} style={{width: width, height: height, margin: margin}}>
                {
                    data ?
                        <>
                            <div className={"imgBox"}>
                                <PageImg pageId={''} imgUrl={data.imgUrl} width={"90%"} height={"95%"} margin={"0"}
                                         imgWidth={"100%"}/>
                            </div>
                            <div className={"homeOneRight"}>
                                <ModuleTitle title={data.title} subTitle={data.subTitle} width={'auto'} height={"auto"}
                                             margin={"0"} textCenter={false}/>
                                {
                                    data.context.map((value) => (
                                        <span key={value.at(1)}>{value}</span>
                                    ))
                                }
                                <Link to={data.link} className={"moreBtn"}>{data.btnMsg}</Link>
                            </div>
                        </> :
                        null
                }
            </div>
        </>
    )
}