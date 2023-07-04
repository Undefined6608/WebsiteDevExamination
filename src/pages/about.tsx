import {PageImg} from "../components/pageImg";
import {useEffect, useState} from "react";
import {AboutListType} from "../config/responseType";
import {get} from "../config/request";
import {handlerTips} from "../utils";
import {AboutMsgList} from "../components/aboutMsgList";

export const About = () => {
    const [data, setData] = useState<{ list: AboutListType }>();
    useEffect(() => {
        get<{ list: AboutListType }>('/about/getAboutList').then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', '数据错误！', '请求失败!');
        }).then((r) => {
            setData(r);
        })
    }, []);
    return (
        <>
            <div className={"pubP"}>
                <PageImg pageId={'b'} width={'100%'} height={'380px'} margin={'0'} imgUrl={''} imgWidth={"120%"}/>
                {
                    data ?
                        <AboutMsgList data={data.list} width={"80%"} height={"1337px"} margin={"0 auto"}/> :
                        null
                }
            </div>
        </>
    )
}