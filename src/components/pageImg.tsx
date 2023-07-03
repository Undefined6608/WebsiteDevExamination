import {SizeType} from "../config/publicInterface";
import React, {useEffect, useState} from "react";
import {get} from "../config/request";
import {PageTopImgType} from "../config/responseType";
import {handlerTips} from "../utils";
import "../less/pageImg.less";

interface PageImgParam extends SizeType {
    pageId: string,
    imgUrl: string,
    imgWidth:string
}

export const PageImg: React.FC<PageImgParam> = ({width, height, margin, pageId, imgUrl,imgWidth}) => {
    const [imgData, setImgData] = useState<PageTopImgType>();
    useEffect(() => {
        if (!pageId && !imgUrl) {
            handlerTips('warning', '图片地址为空！', '错误：');
            return;
        }
        if (!pageId) {
            setImgData({id: crypto.randomUUID(), imgUrl: imgUrl, alt: '图片加载错误'});
            return;
        }
        get<PageTopImgType>('/public/topImg?pageId=' + pageId).then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', r.msg);
        }).then((r) => {
            setImgData(r);
        })
    }, [pageId])
    return (
        <>
            {
                imgData ?
                    <div className={"pageTopImgBox"} style={{width: width, height: height, margin: margin}}>
                        <img className={"pageTopImg"} src={imgData.imgUrl} alt={imgData.alt}
                             style={{width: imgWidth}}/>
                    </div> :
                    null
            }
        </>
    )
}