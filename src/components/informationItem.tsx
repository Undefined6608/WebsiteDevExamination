import React from "react";
import {SizeType} from "../config/publicInterface";
import {InformationItemType} from "../config/responseType";
import "../less/informationItem.less";

interface InformationItemParam extends SizeType {
    data: InformationItemType
}

export const InformationItem: React.FC<InformationItemParam> = ({width, height, margin, data}) => {
    return (
        <div className={"information-item"} style={{width: width, height: height, margin: margin}}>
            <div className={"information-item-icon"}>
                <span className={"day"}>{data.day}</span>
                <span className={"month"}>{data.month}</span>
            </div>
            <div className={"information-item-right"}>
                <span className={"information-item-title"}>{data.title}</span>
                <span className={"information-item-context"}>{data.context}</span>
            </div>
        </div>
    )
}