import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Home} from "../pages/home";
import {About} from "../pages/about";
import {Product} from "../pages/product";
import {Information} from "../pages/information";
import {Contact} from "../pages/contact";
import {HeaderComponent} from "../components/headerComponent";
import {TipsComponent} from "../components/tipsComponent";
import {BottomComponent} from "../components/bottomComponent";
import "../less/publicPage.less";

export const AppRouter = () => {
    return (
        <>
            <Router>
                {/*挂载头部公共组件*/}
                <HeaderComponent width={'100%'} height={'120px'} margin={"0"}/>
                {/*挂载提示组件*/}
                <TipsComponent/>
                {/*路由显示不同的页面*/}
                <Routes>
                    <Route path={"/"} element={<Home/>}></Route>
                    <Route path={"/about"} element={<About/>}></Route>
                    <Route path={"/product"} element={<Product/>}></Route>
                    <Route path={"/information"} element={<Information/>}></Route>
                    <Route path={"/contact"} element={<Contact/>}></Route>
                </Routes>
                {/*挂载底部组件为公共组件*/}
                <BottomComponent width={"100%"} height={"auto"} margin={"0"}/>
            </Router>
        </>
    )
}