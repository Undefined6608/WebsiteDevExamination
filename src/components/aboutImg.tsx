import React from "react";
import {SizeType} from "../config/publicInterface";
import "../less/aboutImg.less";

interface AboutImgParam extends SizeType {
    mainImg: string,
    bgImg: string
}

export const AboutImg: React.FC<AboutImgParam> = ({width, height, margin, mainImg, bgImg}) => {
    return (
        <div className={"aboutImgBox"}
             style={{width: width, height: height, margin: margin}}>
            <img className={"bgImg"} src={bgImg} alt=""/>
            <img className={"aboutImg"} src={mainImg} alt=""/>
        </div>
    )
}