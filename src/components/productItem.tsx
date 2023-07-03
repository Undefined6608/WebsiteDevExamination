import React from "react";
import {SizeType} from "../config/publicInterface";
import {ProductItemType} from "../config/responseType";
import "../less/productItem.less";

interface ProductItemParam extends SizeType {
    itemData: ProductItemType
}

export const ProductItem: React.FC<ProductItemParam> = ({width, height, margin, itemData}) => {
    return (
        <div className={'productItem'} style={{width: width, height: height, margin: margin}}>
            <img className={"product-item-img"} src={itemData.itemImg} alt=""/>
            <span className={"product-item-name"}>{itemData.name}</span>
        </div>
    )
}