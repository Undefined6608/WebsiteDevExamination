import React from "react";
import {SizeType} from "../config/publicInterface";
import {AboutItemType} from "../config/responseType";
import {AboutImg} from "./aboutImg";
import {ModuleTitle} from "./moduleTitle";
import "../less/aboutMsgItem.less";

interface AboutMsgItemParam extends SizeType {
    data: AboutItemType,
    layout: boolean,
    style: {
        imgWidth: string,
        imgHeight: string,
        contextWidth: string,
        contextHeight: string
    }
}

export const AboutMsgItem: React.FC<AboutMsgItemParam> = ({width, height, margin, data, layout, style}) => {
    return (
        <div className={"aboutMsgItem"}
             style={{width: width, height: height, margin: margin, flexDirection: `${layout ? 'row' : 'row-reverse'}`}}>
            <AboutImg mainImg={data.mainImg} bgImg={data.bgImg} width={style.imgWidth} height={style.imgHeight}
                      margin={"0"}/>
            <div className={"aboutMsgItemRight"}>
                <ModuleTitle title={data.title} subTitle={data.subTitle} textCenter={false} width={"100%"}
                             height={"auto"} margin={"0"}/>
                <div className={"aboutMsgItemContext"} style={{width: style.contextWidth, height: style.contextHeight}}>
                    {
                        data.context.map((value) => (
                            <span key={value.id}>{value.msg}</span>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}