import React from "react";
import {SizeType} from "../config/publicInterface";
import {InformationItemType} from "../config/responseType";
import {InformationItem} from "./informationItem";
import "../less/informationList.less";

interface InformationListParam extends SizeType {
    data: Array<InformationItemType>
}

export const InformationList: React.FC<InformationListParam> = ({width, height, margin, data}) => {
    return (
        <div className={"information-list"} style={{width: width, height: height, margin: margin}}>
            {
                data.map((value) => (
                    <InformationItem key={value.id} data={value} width={"100%"} height={"150px"} margin={"0"}/>
                ))
            }
        </div>
    )
}