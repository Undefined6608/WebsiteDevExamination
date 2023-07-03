import {PageImg} from "../components/pageImg";
import {HomeTwo} from "../components/homeTwo";
import React from "react";
import {Pagination} from "antd";

export const Product = () => {
    return (
        <>
            <div className={"pubP"}>
                <PageImg pageId={'c'} width={'100%'} height={'800px'} margin={'0'} imgUrl={''} imgWidth={"120%"}/>
                <HomeTwo width={"100%"} height={"500px"} margin={"0"} url={"/product/productList"}/>
                <Pagination simple defaultCurrent={1} total={10} style={{textAlign:"center",marginBottom:"300px"}}/>
            </div>
        </>
    )
}