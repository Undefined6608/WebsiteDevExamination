// logo的类型
export type GetLogoType = {
    icon: string
};
// 副标题的类型
export type GetSubTitleType = {
    title: string
};
// 导航列表内部对象类型
export type GetNavItemType = {
    id: string,
    name: string,
    subName: string,
    url: string
};
// 底部中部左侧数据类型
export type BottomTopLeftType = {
    one: string,
    two: string,
    three: string
};
// 底部中部中间数据类型
export type BottomTopCenterType = {
    title: string,
    phone: string,
    email: string
};
// 底部中部右侧数据类型
export type BottomTopRightType = {
    QRCode: string,
    tip: string,
    end: string
};
// 底部底部下方数据类型
export type BottomBottomType = {
    one: string,
    two: string
};
// 底部组件数据类型
export type GetBottomDataType = {
    // 中部左侧数据类型
    topLeft: BottomTopLeftType,
    // 中部中间数据类型
    topCenter: BottomTopCenterType,
    // 中部右侧数据类型
    topRight: BottomTopRightType,
    // 底部下方数据类型
    bottom: BottomBottomType
};
// 页面顶部图片类型
export type PageTopImgType = {
    id: string,
    imgUrl: string,
    alt: string
};
// 首页第一个模块数据类型
export type HomeOneDataType = {
    title: string,
    subTitle: string,
    imgUrl: string,
    context: Array<string>,
    btnMsg: string,
    link: string
};
// 首页图片集合
export type HomeImgList = Array<string>;
// 定义单个产品数据类型
export type ProductItemType = {
    id: string,
    typeId: string,
    itemImg: string,
    name: string
}
// 首页第二个模块数据类型
export type HomeTwoDataType = {
    title: string,
    subTitle: string,
    type: Array<{
        id: string,
        name: string
    }>,
    productList: Array<ProductItemType>
};
// 首页第三个模块数据类型
export type HomeThreeDataType = {
    oneTitle: string,
    oneSubTitle: string,
    twoTitle: string,
    twoSubTitle: string
};
// 定义单个联系方式数据类型
export type ContactItemType = {
    id: string,
    icon: string,
    mtd: string,
    val: string
};
// 首页第四个模块数据类型
export type HomeFourDataType = {
    title: string,
    subTitle: string,
    list: Array<ContactItemType>
};
// 关于喜敷页面单个数据类型
export type AboutItemType = {
    id: string,
    title: string,
    subTitle: string,
    mainImg: string,
    bgImg: string,
    context: Array<{
        id: string,
        msg: string
    }>
};
// 关于喜敷页面数据类型
export type AboutListType = Array<AboutItemType>;
// 喜敷资讯单个条目类型
export type InformationItemType = {
    id: string,
    month: string,
    day: string,
    title: string,
    context: string
};
// 喜敷资讯数据格式
export type InformationDataType = {
    title: string,
    subTitle: string,
    list: Array<InformationItemType>
};