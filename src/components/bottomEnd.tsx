import React from "react";
import {SizeType} from "../config/publicInterface";
import {BottomBottomType} from "../config/responseType";
import "../less/bottomEnd.less";

interface BottomEndParam extends SizeType {
    endData: BottomBottomType
}

export const BottomEnd: React.FC<BottomEndParam> = ({width, height, margin, endData}) => {
    return (
        <>
            {
                endData ?
                    <div className={"bottomEnd"} style={{width: width, height: height, margin: margin}}>
                        <span>{endData.one}</span>
                        <span>{endData.two}</span>
                    </div> :
                    null
            }
        </>
    )
}