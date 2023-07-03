import React, {useEffect, useState} from "react";
import {SizeType} from "../config/publicInterface";
import "../less/homeThree.less";
import {HomeThreeDataType} from "../config/responseType";
import {get} from "../config/request";
import {handlerTips} from "../utils";

interface HomeThreeParam extends SizeType {
    bgImgUrl: string,
}

export const HomeThree: React.FC<HomeThreeParam> = ({width, height, margin, bgImgUrl}) => {
    const [data, setData] = useState<HomeThreeDataType>();
    useEffect(() => {
        get<HomeThreeDataType>('/home/homeThree').then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', "获取失败！", "请求错误!");
        }).then((r) => {
            setData(r);
        })
    }, []);
    return (
        <div className={"homeThree"}
             style={{width: width, height: height, margin: margin, background: `url(${bgImgUrl}) no-repeat`}}>
            {
                data ?
                    <>
                        <div className="home-three-top">
                            <span className={"oneTitle"}>{data.oneTitle}</span>
                            <span className={"oneSubtitle"}>{data.oneSubTitle}</span>
                        </div>
                        <div className="home-three-bottom">
                            <span className={"twoTitle"}>{data.twoTitle}</span>
                            <span className={"twoSubtitle"}>{data.twoSubTitle}</span>
                        </div>
                    </> :
                    null
            }
        </div>
    )
}