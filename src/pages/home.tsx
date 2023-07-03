import {PageImg} from "../components/pageImg";
import {HomeOne} from "../components/homeOne";
import {get} from "../config/request";
import {HomeImgList} from "../config/responseType";
import {handlerTips} from "../utils";
import {useEffect, useState} from "react";
import {HomeTwo} from "../components/homeTwo";
import {HomeThree} from "../components/homeThree";
import {HomeFour} from "../components/homeFour";

export const Home = () => {
    const [imgList, setImgList] = useState<{ imgUrl: HomeImgList }>();
    useEffect(() => {
        get<{ imgUrl: HomeImgList }>('/home/getHomeImgList').then((r) => {
            if (r.code === 200) return r.data;
            handlerTips("warning", "图片获取失败！", "请求失败！");
        }).then((r) => {
            // console.log(r);
            setImgList(r);
        });
    }, [])
    return (
        <>
            <div className={"pubP"}>
                <PageImg pageId={'a'} width={'100%'} height={'600px'} margin={'0'} imgUrl={''} imgWidth={"120%"}/>
                <HomeOne width={"90%"} height={"714px"} margin={"0 auto"}/>
                {
                    imgList ?
                        <PageImg pageId={''} imgUrl={imgList.imgUrl[0]} width={'100%'} height={'380px'} margin={'0'}
                                 imgWidth={"115%"}/> :
                        null
                }
                <HomeTwo width={"100%"} height={"auto"} margin={"60px auto 0"} url={"/home/homeTwo"}/>
                {
                    imgList ?
                        <HomeThree bgImgUrl={imgList.imgUrl[1]} width={"100%"} height={"388px"} margin={"0"}/> :
                        null
                }
                <HomeFour width={"90%"} height={"395px"} margin={"0 auto"} />
            </div>
        </>
    )
}