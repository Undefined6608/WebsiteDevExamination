import React, {useState} from "react";
import {SizeType} from "../config/publicInterface";
import {AboutListType} from "../config/responseType";
import {AboutMsgItem} from "./aboutMsgItem";
import "../less/aboutMsgList.less";

interface AboutMsgListParam extends SizeType {
    data: AboutListType
}

export const AboutMsgList: React.FC<AboutMsgListParam> = ({width, height, margin, data}) => {
    return (
        <>
            {
                data ?
                    <div className={"aboutMsgList"} style={{width: width, height: height, margin: margin}}>
                        {
                            <>
                                <AboutMsgItem key={data[0].id} data={data[0]} layout={true} width={"100%"}
                                              height={"800px"} margin={"0"} style={{
                                    imgWidth: "420px",
                                    imgHeight: "600px",
                                    contextWidth: "100%",
                                    contextHeight: "400px"
                                }}/>
                                <AboutMsgItem key={data[1].id} data={data[1]} layout={false} width={"100%"}
                                              height={"600px"} margin={"0"} style={{
                                    imgWidth: "420px",
                                    imgHeight: "388px",
                                    contextWidth: "50%",
                                    contextHeight: "200px"
                                }}/>
                            </>
                        }
                    </div> :
                    null
            }
        </>
    )
}