import React from "react";
import {SizeType} from "../config/publicInterface";
import {ContactItemType} from "../config/responseType";
import "../less/contactItem.less";

interface ContactItemParam extends SizeType {
    data: ContactItemType
}

export const ContactItem: React.FC<ContactItemParam> = ({width, height, margin, data}) => {
    return (
        <div className={"contactItem"} style={{width: width, height: height, margin: margin}}>
            <img className={"contactItemIcon"} src={data.icon} alt=""/>
            <div className="contactItemMsg">
                <span className={"mtd"}>{data.mtd}</span>
                <span className={"val"}>{data.val}</span>
            </div>
        </div>
    )
}