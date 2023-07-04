import React, {useEffect} from "react";
import {SizeType} from "../config/publicInterface";

export const BMap: React.FC<SizeType> = ({width, height, margin}) => {
    useEffect(()=>{
        const map = new window.BMap.Map('map-container');
        // 设置地图中心点和缩放级别
        const point = new window.BMap.Point(117.933166,36.833957);
        map.centerAndZoom(point, 17);
        map.enableScrollWheelZoom();
    },[]);
    return (
        <div id={"map-container"} style={{width: width, height: height, margin: margin}}></div>
    )
}