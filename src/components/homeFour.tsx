import React, {useEffect, useState} from "react";
import {SizeType} from "../config/publicInterface";
import {HomeFourDataType} from "../config/responseType";
import {get} from "../config/request";
import {handlerTips} from "../utils";
import {ModuleTitle} from "./moduleTitle";
import "../less/homeFour.less";
import {ContactList} from "./contactList";

export const HomeFour: React.FC<SizeType> = ({width, height, margin}) => {
    const [data, setData] = useState<HomeFourDataType>();
    useEffect(() => {
        get<HomeFourDataType>('/home/homeFour').then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', "失败！", "请求失败");
        }).then((r) => {
            if (r) setData(r);
        })
    }, []);
    return (
        <>
            {
                data ?
                    <div className={"homeFour"} style={{width: width, height: height, margin: margin}}>
                        <ModuleTitle title={data.title} subTitle={data.subTitle} textCenter={true} width={"100%"}
                                     height={"auto"} margin={"0"}/>
                        <ContactList data={data.list} width={"100%"} height={"100px"} margin={"60px"}/>
                    </div> :
                    null
            }
        </>
    )
}