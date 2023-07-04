import {PageImg} from "../components/pageImg";
import {useEffect, useState} from "react";
import {get} from "../config/request";
import {InformationDataType} from "../config/responseType";
import {handlerTips} from "../utils";
import {ModuleTitle} from "../components/moduleTitle";
import {InformationList} from "../components/informationList";

export const Information = () => {
    const [data, setData] = useState<InformationDataType>();
    useEffect(() => {
        get<InformationDataType>('/information/getInformationData').then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', '获取失败！', '请求失败！');
        }).then((r) => {
            if (r) {
                setData(r);
            }
        })
    }, []);
    return (
        <>
            <div className={"pubP"}>
                <PageImg pageId={'d'} width={'100%'} height={'380px'} margin={'0'} imgUrl={''} imgWidth={"120%"}/>
                {
                    data ?
                        <>
                            <ModuleTitle title={data.title} subTitle={data.subTitle} textCenter={true} width={"100%"}
                                         height={"auto"} margin={"30px auto"}/>
                            <InformationList data={data.list} width={"80%"} height={"auto"} margin={"30px auto"}/>
                        </> :
                        null
                }
            </div>
        </>
    )
}