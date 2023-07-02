import React, {useEffect, useState} from "react";
import {get, handlerError} from "../config/request";
import {GetLogoType, GetSubTitle} from "../config/responseType";
import {SizeType} from "../config/publicInterface";
import "../less/headerComponent.less";
import {TitleComponent} from "./titleComponent";

export const HeaderComponent: React.FC<SizeType> = ({width, height, margin}) => {

    return (
        <div className={"header"} style={{width: width, height: height, margin: margin}}>
            <TitleComponent width={"auto"} height={"150px"} margin={"0"} />

        </div>
    )
}