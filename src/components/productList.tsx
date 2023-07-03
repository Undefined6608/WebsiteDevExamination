import React from "react";
import {SizeType} from "../config/publicInterface";
import {ProductItemType} from "../config/responseType";
import {ProductItem} from "./productItem";
import "../less/productList.less";

interface ProductListParam extends SizeType {
    listData: Array<ProductItemType>,
    type: string
}

export const ProductList: React.FC<ProductListParam> = ({width, height, margin, listData, type}) => {
    return (
        <div className={"productList"} style={{width: width, height: height, margin: margin}}>
            {
                listData.map((value) => {
                    return (
                        <div key={value.id} style={{width:"22%", height:"auto", margin:"10px 1.5%"}}>
                            {
                                value.typeId === type ?
                                    <ProductItem itemData={value} width={"100%"} height={"293px"}
                                                 margin={"0"}/> :
                                    null
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}