import React from "react";
import {SizeType} from "../config/publicInterface";
import {ContactItemType} from "../config/responseType";
import "../less/contactList.less";
import {ContactItem} from "./contactItem";

interface ContactListParam extends SizeType {
    data: Array<ContactItemType>
}

export const ContactList: React.FC<ContactListParam> = ({width, height, margin, data}) => {
    return (
        <div className={"contactList"} style={{width: width, height: height, margin: margin}}>
            {
                data.map((value) => (
                    <ContactItem key={value.id} data={value} width={"340px"} height={"100%"} margin={"0"}/>
                ))
            }
        </div>
    )
}