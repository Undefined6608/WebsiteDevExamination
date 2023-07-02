import React, {useEffect, useState} from "react";
import {get, handlerError} from "../config/request";
import {GetLogoType, GetSubTitle} from "../config/responseType";
import "../less/titleComponent.less";
import {SizeType} from "../config/publicInterface";

export const TitleComponent: React.FC<SizeType> = ({width, height, margin}) => {
    const [icon, setIcon] = useState<string>('');
    const [subTitle, setSubTitle] = useState<string>('');
    useEffect(() => {
        get<GetLogoType>('/public/logo').then((r) => {
            if (r.code !== 200) {
                handlerError('warning', r.msg);
            }
            return r.data;
        }).then((r) => {
            console.log(r);
            if (!r.icon) return;
            setIcon(r.icon);
        })
        get<GetSubTitle>('/public/subTitle').then((r) => {
            if (r.code !== 200) {
                handlerError('warning', r.msg);
            }
            return r.data;
        }).then((r) => {
            console.log(r);
            if (!r.title) return;
            setSubTitle(r.title);
        })
    }, []);
    return (
        <div className="headerTitle" style={{width: width, height: height, margin: margin}}>
            <img className={"logo"} src={icon} alt=""/>
            <span className="subtitle">
                    {subTitle}
                </span>
        </div>
    )
}