import React from "react";
import {SizeType} from "../config/publicInterface";
import "../less/moduleTitle.less";

interface ModuleTitleParam extends SizeType {
    title: string,
    subTitle: string,
    textCenter: boolean
}

export const ModuleTitle: React.FC<ModuleTitleParam> = ({width, height, margin, title, subTitle, textCenter}) => {
    return (
        <>
            {
                title && subTitle ?
                    <div className={"moduleTitle"} style={textCenter ? {
                        width: width,
                        height: height,
                        margin: margin,
                        alignItems: "center"
                    } : {width: width, height: height, margin: margin}}>
                        <span className={"mainTitle"}>{title}</span>
                        <span className={"subTitle"}>{subTitle}</span>
                    </div> :
                    null
            }
        </>
    )
}