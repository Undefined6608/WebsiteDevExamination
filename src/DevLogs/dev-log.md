# 项目开发日志

## 23.7.1

### 一、创建项目

在`github`上创建`WebsiteDevExamination`，使用`git clone git@github.com:Undefined6608/WebsiteDevExamination.git`将其克隆到本地

### 二、初始化项目

在`WebStorm`中创建`vite`项目：

```shell
npx create-vite
```

选择`Template`为`React`并且勾选`Use TypeScript template`

创建后运行以下命令：

```shell
npm i
```

### 三、创建项目内部文件夹

项目文件夹对应存储类型：

| 文件夹名称 | 作用                |
| ---------- | ------------------- |
| assets     | 存储静态数据        |
| components | 存储组件            |
| config     | 存储配置文件        |
| DevLog     | 存储开发日志        |
| less       | 存储less/层叠样式表 |
| pages      | 存储页面组件        |
| router     | 存储路由            |
| utils      | 存储工具文件        |

项目整体结构

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-02_10-18-12.png)

### 四、创建公共文件

| 文件名及其位置            | 作用               |
| ------------------------- | ------------------ |
| config/publicInterface.ts | 公共接口文件       |
| config/request.ts         | 封装fetch          |
| config/responseType.ts    | 服务器响应数据接口 |
| utils/index.ts            | 工具文件           |

### 五、安装/配置依赖

用到的依赖及作用：

| 依赖             | 作用                                |
| ---------------- | ----------------------------------- |
| ant-design/icons | AntDesign组件库图标                 |
| antd             | AntDesign组件库                     |
| pubsub-js        | 订阅与发布依赖                      |
| less             | CSS与编译器                         |
| less-loader      | CSS与编译器，与上面的less都需要安装 |
| react-router-dom | 路由，用于控制页面显示              |

安装命令：

```shell
npm i ant-design/icons antd
npm i pubsub-js
npm i less less-loader
npm install react-router-dom @types/react-router-dom
```

配置：

`less`配置：在`vite.config.ts`中：

```ts
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
})
```

跨域配置：在`vite.config.ts`中：

```ts
server: {
        proxy: {
            // 设置你需要跨域的请求地址
            '/api': {
                target: 'http://192.168.126.1:4000/', // 替换成你的API地址
                changeOrigin: true
            },
        },
    }
```

`router`路由配置：

在`pages`文件夹中创建`home.tsx`、`about.tsx`、`product.tsx`、`information.tsx`、`contact.tsx`页面组件

在`router`文件夹下创建`appRouter.tsx`文件：

```tsx
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Home} from "../pages/home";
import {About} from "../pages/about";
import {Product} from "../pages/product";
import {Information} from "../pages/information";
import {Contact} from "../pages/contact";

export const AppRouter = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route path={"/"} element={<Home/>}></Route>
                    <Route path={"/about"} element={<About/>}></Route>
                    <Route path={"/product"} element={<Product/>}></Route>
                    <Route path={"/information"} element={<Information/>}></Route>
                    <Route path={"/contact"} element={<Contact/>}></Route>
                </Routes>
            </Router>
        </>
    )
}
```

在`App.tsx`中：

```tsx
import './App.less'
import {AppRouter} from "./router/appRouter";

function App() {
    return (
        <div className="App">
            <AppRouter />
        </div>
    )
}

export default App

```

### 六、封装依赖

`fetch`：在`config/request.ts`中：

```ts
import PubSub from "pubsub-js";
import {NotificationType} from "./publicInterface";

// 定义后端地址
export const BASE_URL = '/api';

// 定义返回值类型模型
// T:接受的返回值类型
interface ApiResponse<T> {
    // 响应值
    code: number;
    // 响应信息
    msg: string;
    // 响应数据
    data: T;
}

// 网络连接失败
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
        throw new Error('网络请求失败');
    }
    return await response.json();
}

// get请求
export async function get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(BASE_URL + url);
    return await handleResponse<T>(response);
}

// post请求
export async function post<T>(url: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(BASE_URL + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    return await handleResponse<T>(response);
}
```

## 23.7.2

> 本项目开发的顺序为：从小到大开发
>
> - 公共小组件
> - 公共大组件
> - 页面内部组件
> - 页面调用上面的组件

开始编写项目

### I、定义公共接口

在`publicInteerface.ts`中：

```ts
// 定义页面传参公共接口
export type SizeType = {
    // 页面宽度
    width: string,
    // 页面高度
    height: string,
    // 外边距
    margin: string
}
```

### II、提示组件

利用`Ant Design`的`notification`实现提示。

在`publicInterface.ts`中：

```ts
// 定义提示类型接口
export type NotificationType = 'success' | 'info' | 'warning' | 'error';
```

在`components`中创建`tipsComponent.tsx`组件：

```tsx
// 引入React相关组件
import React, {useEffect} from "react";
// 引入AntDesign组件
import {notification} from "antd";
// 引入PubSub实现订阅与发布
import PubSub from "pubsub-js";
// 引入提示类型接口
import {NotificationType} from "../config/publicInterface";
// 定义传入的数据格式
type MsgType = { type: NotificationType, message: string, description: string };

// 定义TipsComponent组件
export const TipsComponent: React.FC = () => {
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        // 开启提示方法
        const openNotificationWithIcon = (msg: MsgType) => {
            // 修改api实现不同的提示
            api[msg.type]({
                message: msg.message,
                description: msg.description,
            });
        };
        // 通过订阅的方式进行控制提示框的显示
        const tipsToken = PubSub.subscribe('tips', (_, msg: MsgType) => {
            openNotificationWithIcon(msg);
        })
        // 在页面销毁时调用
        return () => {
            // 清除订阅
            PubSub.unsubscribe(tipsToken);
        }
    }, [])
    return (
        <>
            {/*显示组件*/}
            {contextHolder}
        </>
    )
}
```

挂载到路由上，在`appRouter.tex`中：

```tsx
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Home} from "../pages/home";
import {About} from "../pages/about";
import {Product} from "../pages/product";
import {Information} from "../pages/information";
import {Contact} from "../pages/contact";
import {TipsComponent} from "../components/tipsComponent";

export const AppRouter = () => {
    return (
        <>
            <Router>
                {/*挂载提示组件*/}
                <TipsComponent />
                {/*路由显示不同的页面*/}
                <Routes>
                    <Route path={"/"} element={<Home/>}></Route>
                    <Route path={"/about"} element={<About/>}></Route>
                    <Route path={"/product"} element={<Product/>}></Route>
                    <Route path={"/information"} element={<Information/>}></Route>
                    <Route path={"/contact"} element={<Contact/>}></Route>
                </Routes>

            </Router>
        </>
    )
}
```

在`utils/index.ts`工具文件里，写入开启提示的方法，在其他文件中可以通过调用以下方法 进行开启提示。

```ts
import {NotificationType} from "../config/publicInterface";
import PubSub from "pubsub-js";

/**
 * 提示
 * @param type 提示类型
 * @param description
 * @param message
 */
export const handlerTips = (type: NotificationType, description: string, message?: string | '请求失败') => {
    return PubSub.publish('tips', {type: type, message: message, description: description});
}
```

样式展示：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-16-50.png)

### III、头部左侧标题组件

在`config/responseType.ts`中：

```ts
// logo的类型
export type GetLogoType = {
    icon: string
}
// 副标题的类型
export type GetSubTitleType = {
    title: string
}
```

在`components`目录下创建`titleComponent.tsx`：

```tsx
// 引入React依赖
import React, {useEffect, useState} from "react";
// 引入gqt请求方法
import {get} from "../config/request";
// 引入logo和副标题响应值类型
import {GetLogoType, GetSubTitleType} from "../config/responseType";
// 引入组件样式
import "../less/titleComponent.less";
// 引入公共组件参数接口
import {SizeType} from "../config/publicInterface";
// 引入开启提示的方法
import {handlerTips} from "../utils";

export const TitleComponent: React.FC<SizeType> = ({width, height, margin}) => {
    // 定义logo状态
    const [logo, setLogo] = useState<string>('');
    // 定义副标题状态
    const [subTitle, setSubTitle] = useState<string>('');
    // 组件创建完成后
    useEffect(() => {
        // 调取api接口获取logo
        get<GetLogoType>('/public/logo').then((r) => {
            // 如果等于200，返回data数据
            if (r.code === 200) return r.data;
            // 开启提示
            handlerTips('warning', r.msg);
        }).then((r) => {
            // 输出获取到的数据
            // console.log(r);
            // 如果存在logo地址，则保存logo地址
            if (r) return setLogo(r.icon);
        })
        // 同理
        get<GetSubTitleType>('/public/subTitle').then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', r.msg);
        }).then((r) => {
            // console.log(r);
            if (r) return setSubTitle(r.title);
        })
    }, []);
    return (
        <>
            {/*将父组件传来的组件样式设置为div样式*/}
            <div className="headerTitle" style={{width: width, height: height, margin: margin}}>
                {/*logo图片显示*/}
                <img className={"logo"} src={logo} alt=""/>
                {/*副标题显示*/}
                <span className="subtitle"> {subTitle} </span>
            </div>
        </>
    )
}
```

在`less`目录下创建`titleComponent.less`:

```less
.headerTitle {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .logo {
    width: auto;
    height: 50%;
    margin-right: 30px;
  }

  .subtitle {
    font-size: 24px;
    font-family: 'fontface__幼圆__7__752086772492', serif;
    height: 60px;
    display: flex;
    align-items: flex-end;
  }
}
```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-02_13-28-11.png)



### IV、头部右侧导航列表

在`config/responseType.ts`中：

```ts
// 导航列表内部对象类型
export type GetNavItemType = {
    id: string,
    name: string,
    subName: string,
    url: string
}
```

在`components`中创建`headerNav.tsx`：

```tsx
// 引入React组件
import React, {useEffect, useState} from "react";
// 引入公共组件参数接口
import {SizeType} from "../config/publicInterface";
// 引入gqt请求方法
import {get} from "../config/request";
// 引入导航栏单个条目响应值类型
import {GetNavItemType} from "../config/responseType";
// 引入开启提示的方法
import {handlerTips} from "../utils";
// 引入路由跳转组件
import {Link} from "react-router-dom";
// 引入导航条样式
import "../less/headerNav.less";

/**
 * 创建HeaderNav组件
 * @param width 组件宽慰
 * @param height 组件高度
 * @param margin 组件外边距
 * @constructor
 */
export const HeaderNav: React.FC<SizeType> = ({width, height, margin}) => {
    // 创建导航列表状态
    const [navList, setNavLiat] = useState<Array<GetNavItemType>>([]);
    // 创建选择条目状态，默认为 a
    const [status, setStatus] = useState<string>('a');
    // 组件被调用时执行一次
    useEffect(() => {
        // 通过get请求，获取导航条的数据
        get<{ list: Array<GetNavItemType> }>('/public/navList').then((r) => {
            // 如果响应值为200 则返回数据
            if (r.code === 200) return r.data.list
            // 如果不为200，则给出提示
            handlerTips('warning', r.msg);
        }).then((r) => {
            // 输出查看响应数据
            // console.log(r);
            // 如果数据存在，则保存数据到状态中
            if (r) return setNavLiat(r);
        })
    }, [])
    return (
        <>
            {/*将父组件传来的组件样式设置为div样式*/}
            <div className={"headerNav"} style={{width: width, height: height, margin: margin}}>
                {/*判断导航条数据是否存在*/}
                {navList ?
                    // 如果不为空，循环遍历导航条数据
                    navList.map((value) => (
                        // 渲染为可点击的路由组件
                        <Link key={value.id} className={status === value.id ? "header-link active" : "header-link"}
                              to={value.url} children={value.name} onClick={(e) => setStatus(value.id)}/>
                    )) :
                    // 如果为空，则不渲染
                    null}
            </div>
        </>
    )
}
```

在`less`文件夹中创建`headerNav.less`：

```less
.headerNav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--border-black);

  .header-link {
    display: inline-block;
    flex: 1;
    height: 100%;
    text-align: center;
    line-height: 40px;
    text-decoration: none;
    color: var(--color);
    background-color: var(--background-color);
  }

  .active {
    color: var(--background-color);
    background-color: var(--color);
  }
}
```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-02_13-47-17.png)

### V、头部组件

在`components`中创建`headerComponent.tsx`：

```tsx
// 引入React
import React from "react";
// 引入公共组件参数接口
import {SizeType} from "../config/publicInterface";
// 引入头部组件样式
import "../less/headerComponent.less";
// 引入子组件
import {TitleComponent} from "./titleComponent";
import {HeaderNav} from "./headerNav";

/**
 * 创建头部组件
 * @param width 组件宽度
 * @param height 组件高度
 * @param margin 组件外边距
 * @constructor
 */
export const HeaderComponent: React.FC<SizeType> = ({width, height, margin}) => {
    return (
        <>
            {/*将父组件传来的组件样式设置为div样式*/}
            <div className={"header"} style={{width: width, height: height, margin: margin}}>
                {/*挂载头部左侧标题组件*/}
                <TitleComponent width={"330"} height={"150px"} margin={"0"}/>
                {/*挂载头部右侧导航列表*/}
                <HeaderNav width={"646px"} height={"40px"} margin={"0"}/>
            </div>
        </>
    )
}
```

在`less`文件夹中创建`headerComponent.less`：

```less
.header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
}
```

将头部组件挂载到路由上，形成公共组件，在`appRouter.tsx`中：

```tsx
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Home} from "../pages/home";
import {About} from "../pages/about";
import {Product} from "../pages/product";
import {Information} from "../pages/information";
import {Contact} from "../pages/contact";
import {HeaderComponent} from "../components/headerComponent";
import {TipsComponent} from "../components/tipsComponent";

export const AppRouter = () => {
    return (
        <>
            <Router>
                {/*挂载头部公共组件*/}
                <HeaderComponent width={'100%'} height={'120px'} margin={"0"} />
                {/*挂载提示组件*/}
                <TipsComponent />
                {/*路由显示不同的页面*/}
                <Routes>
                    <Route path={"/"} element={<Home/>}></Route>
                    <Route path={"/about"} element={<About/>}></Route>
                    <Route path={"/product"} element={<Product/>}></Route>
                    <Route path={"/information"} element={<Information/>}></Route>
                    <Route path={"/contact"} element={<Contact/>}></Route>
                </Routes>

            </Router>
        </>
    )
}
```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-02_13-53-35.png)

### VI、定义页面公共样式

在`less`目录下创建`publicPage.less`：

```less
.pubP{
  width: 100%;
  min-height: calc(100vh - 120px);
}
```

## 23.7.3

### I、底部上方组件

底部上方为一个导航栏，接口类型和头部右侧导航列表一致。

```ts
// 导航列表内部对象类型
export type GetNavItemType = {
    id: string,
    name: string,
    subName: string,
    url: string
}
```

在`components`文件夹中新建`bottomTop.tsx`：

```tsx
import React, {useEffect, useState} from "react";
import {get} from "../config/request";
import {GetNavItemType} from "../config/responseType";
import {Link} from "react-router-dom";
import "../less/bottomTop.less";
import {SizeType} from "../config/publicInterface";
import {handlerTips} from "../utils";

/**
 * 定义底部上侧组件
 * @param width
 * @param height
 * @param margin
 * @constructor
 */
export const BottomTop: React.FC<SizeType> = ({width, height, margin}) => {
    // 定义导航栏数据状态
    const [navList, setNavList] = useState<Array<GetNavItemType>>([]);
    // 组件被调用时
    useEffect(() => {
        // 通过get请求拿到数据
        get<{ list: Array<GetNavItemType> }>('/public/navList').then((r) => {
            // 判断响应值是否为200，如果为200，则返回数据
            if (r.code === 200) return r.data;
            handlerTips('warning', r.msg);
        }).then((r) => {
            // 验证r是否存在，如果存在，则保存数据到状态中
            if (r) return setNavList(r.list);
        })
    }, [])
    return (
        <>
            <div className={"bottomTop"} style={{width: width, height: height, margin: margin}}>
                <div className="navList">
                    {
                        navList ?
                            navList.map((value) => (
                                <Link key={value.id} className={"item"} to={value.url}>{value.name}</Link>
                            )) :
                            null
                    }
                </div>
            </div>
        </>
    )
}
```

在`less`文件夹中新建`bottomTop.less`：

```less
.bottomTop {
  background-color: var(--light-black-background-color);

  .navList{
    width: 90%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-start;
    border-bottom: 1px solid #333333;

    .item {
      width: auto;
      text-decoration: none;
      color: var(--light-black-color);
      margin-right: 60px;
      padding: 10px;
    }
  }
}
```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-19-11.png)

### II、中部组件

通过`postman`测试出接口返回值，根据返回值来定义返回值类型，在`config/responseType.ts`中：

```ts
// 底部中部左侧数据类型
export type BottomTopLeftType = {
    one: string,
    two: string,
    three: string
}
// 底部中部中间数据类型
export type BottomTopCenterType = {
    title: string,
    phone: string,
    email: string
}
// 底部中部右侧数据类型
export type BottomTopRightType = {
    QRCode: string,
    tip: string,
    end: string
}
```

在`components`文件夹中创建`bottomMiddle.tsx`：

```tsx
import React from "react";
import {SizeType} from "../config/publicInterface";
import {BottomTopCenterType, BottomTopLeftType, BottomTopRightType} from "../config/responseType";
import "../less/bottomMiddle.less";

// 定义参数接口类型
interface BottomMiddleLeftParam extends SizeType {
    // 左侧
    leftData: BottomTopLeftType,
    // 中间
    centerData: BottomTopCenterType,
    // 右侧
    rightData: BottomTopRightType
}

/**
 * 定义底部中间组件
 * @param width 组件宽度
 * @param height 组件高度
 * @param margin 组件边距
 * @param leftData 左侧数据
 * @param centerData 中间数据
 * @param rightData 右侧数据
 * @constructor
 */
export const BottomMiddle: React.FC<BottomMiddleLeftParam> = ({
                                                                  width,
                                                                  height,
                                                                  margin,
                                                                  leftData,
                                                                  centerData,
                                                                  rightData
                                                              }) => {
    return (
        <>
            <div className={"bottomMiddle"} style={{width: width, height: height, margin: margin}}>
                {
                    // 判断左、中、右数据都存在
                    leftData || centerData || rightData ?
                        <div className={"bottomContainer"}>
                            <div className={"left"}>
                                <span>{leftData.one}</span>
                                <span>{leftData.two}</span>
                                <button className={"test"}>{leftData.three}</button>
                            </div>
                            <div className={"center"}>
                                <span>{centerData.title}</span>
                                <div className="centerMsg">
                                    <span>{centerData.phone}</span>
                                    <span>{centerData.email}</span>
                                </div>
                            </div>
                            <div className={"right"}>
                                <img className={"qr"} src={rightData.QRCode} alt=""/>
                                <span>{rightData.tip}</span>
                                <span>{rightData.end}</span>
                            </div>
                        </div> :
                        null
                }
            </div>
        </>
    )
}
```

在`less`文件夹中创建`bottomMiddle.less`：

```less
.bottomMiddle {
  background-color: var(--light-black-background-color);

  .bottomContainer {
    width: 90%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-around;

    .left, .center, .right {
      width: 30%;
      height: 90%;
      display: flex;
      flex-direction: column;
      align-content: flex-start;
      justify-content: space-around;
      margin-bottom: 10px;
      align-items: center;

      .centerMsg {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
      }

      span {
        padding: 5px;
      }

      .qr{
        width: 127px;
      }

      .test{
        width: 120px;
        height: 34px;
        border: 1px solid var(--light-black-color);
        line-height: 34px;
        color: var(--light-black-color);
        border-radius: 5px;
        background-color: #00000000;
      }
    }
  }
}
```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-20-00.png)

### III、底部下方组件

通过`postman`测试出接口返回值，根据返回值来定义返回值类型，在`config/responseType.ts`中：

```ts
// 底部底部下方数据类型
export type bottomBottomType = {
    one: string,
    two: string
}
```

在`components`目录下创建`bottomEnd.tsx`：

```tsx
import React from "react";
import {SizeType} from "../config/publicInterface";
import {BottomBottomType} from "../config/responseType";
import "../less/bottomEnd.less";

interface BottomEndParam extends SizeType {
    endData: BottomBottomType
}

export const BottomEnd: React.FC<BottomEndParam> = ({width, height, margin, endData}) => {
    return (
        <>
            {
                endData ?
                    <div className={"bottomEnd"} style={{width: width, height: height, margin: margin}}>
                        <span>{endData.one}</span>
                        <span>{endData.two}</span>
                    </div> :
                    null
            }
        </>
    )
}
```

在`less`目录下创建`bottomEnd.less`：

```less
.bottomEnd{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #5f5f5f;
}
```

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-20-42.png)

### IV、底部组件

通过`postman`测试出接口返回值，根据返回值来定义返回值类型，在`config/responseType.ts`中：

```ts
// 底部组件数据类型
export type GetBottomDataType = {
    // 中部左侧数据类型
    topLeft: bottomTopLeftType,
    // 中部中间数据类型
    topCenter: bottomTopCenterType,
    // 中部右侧数据类型
    topRight: bottomTopRightType,
    // 底部下方数据类型
    bottom: bottomBottomType
}
```

在`components`目录下，创建`bottomComponent.tsx`：

```tsx
// 引入React组件
import React, {useEffect, useState} from "react";
// 引入公共参数接口
import {SizeType} from "../config/publicInterface";
// 引入组件样式
import "../less/bottomComponent.less";
// 引入子组件
import {BottomTop} from "./bottomTop";
import {BottomMiddle} from "./bottomMiddle";
import {BottomEnd} from "./bottomEnd";
// 引入get请求方法
import {get} from "../config/request";
// 引入参数类型
import {GetBottomDataType} from "../config/responseType";

/**
 * 创建BottomComponent组件
 * @param width 组件宽度
 * @param height 组件高度
 * @param margin 组件外边距
 * @constructor
 */
export const BottomComponent: React.FC<SizeType> = ({width, height, margin}) => {
    // 保存获取底部数据状态
    const [bottomData, setBottomData] = useState<GetBottomDataType>();
    // 组件被调用时
    useEffect(() => {
        // 获取数据
        get<GetBottomDataType>('/public/bottomMsgList').then((r) => {
            console.log(r);
            if (r.code === 200) return r.data;
        }).then((r) => {
            if (r) return setBottomData(r);
        })
    }, []);
    return (
        <>
            <div className={"bottomComponent"} style={{width: width, height: height, margin: margin}}>
                <BottomTop width={"100%"} height={"150px"} margin={"0 auto"}/>
                {
                    bottomData ?
                        <>
                            <BottomMiddle leftData={bottomData.topLeft} centerData={bottomData.topCenter}
                                          rightData={bottomData.topRight} width={"100%"} height={"217px"} margin={"0"}/>
                            <BottomEnd endData={bottomData.bottom} width={"100%"} height={"94px"} margin={"0"}/>
                        </> :
                        null
                }
            </div>
        </>
    )
}
```

在`less`目录下

```less
.bottomComponent{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: var(--black-background-color);
  color: var(--light-black-color);
  font-size: 14px;
}
```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-21-32.png)

### V、页面图片组件

通过`postman`测试出接口返回值，根据返回值来定义返回值类型，在`config/responseType.ts`中：

```ts
// 底部底部下方数据类型
export type bottomBottomType = {
    one: string,
    two: string
}
```

在`components`目录下创建`PageImg.tsx`：

```tsx
import {SizeType} from "../config/publicInterface";
import React, {useEffect, useState} from "react";
import {get} from "../config/request";
import {PageTopImgType} from "../config/responseType";
import {handlerTips} from "../utils";
import "../less/pageImg.less";

interface PageImgParam extends SizeType {
    pageId: string,
    imgUrl:string
}

export const PageImg: React.FC<PageImgParam> = ({width, height, margin, pageId,imgUrl}) => {
    const [imgData, setImgData] = useState<PageTopImgType>();
    useEffect(() => {
        if (!pageId && !imgUrl) {
            handlerTips('warning', '图片地址为空！','错误：');
            return;
        }
        if (!pageId) {
            setImgData({id:crypto.randomUUID(),imgUrl:imgUrl,alt:'图片加载错误'});
            return;
        }
        get<PageTopImgType>('/public/topImg?pageId=' + pageId).then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', r.msg);
        }).then((r) => {
            setImgData(r);
        })
    }, [pageId])
    return (
        <>
            {
                imgData ?
                    <div className={"pageTopImgBox"} style={{width: width, height: height, margin: margin}}>
                        <img className={"pageTopImg"} src={imgData.imgUrl} alt={imgData.alt}/>
                    </div> :
                    null
            }
        </>
    )
}
```

在`less`目录下创建`pageTopImg.less`：

```less
.pageTopImgBox{
  overflow: hidden;
  .pageTopImg{
    width: 120%;
    height: 100%;
  }
}
```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-22-39.png)

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-23-29.png)

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-27-48.png)

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-28-55.png)

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-29-39.png)

### VI、模块标题

在`components`目录下创建`moduleTitle.tsx`：

```tsx
import React from "react";
import {SizeType} from "../config/publicInterface";
import "../less/moduleTitle.less";

interface ModuleTitleParam extends SizeType {
    title: string,
    subTitle: string,
    textCenter: boolean
}

export const ModuleTitle: React.FC<ModuleTitleParam> = ({width, height, margin, title, subTitle, textCenter}) => {
    return (
        <>
            {
                title && subTitle ?
                    <div className={"moduleTitle"} style={textCenter ? {
                        width: width,
                        height: height,
                        margin: margin,
                        alignItems: "center"
                    } : {width: width, height: height, margin: margin}}>
                        <span className={"mainTitle"}>{title}</span>
                        <span className={"subTitle"}>{subTitle}</span>
                    </div> :
                    null
            }
        </>
    )
}
```

在`less`目录下创建`moduleTitle.less`：

```tsx
.moduleTitle{
  display: flex;
  flex-direction: column;
  .mainTitle{
    font-size: 28px;
    color: var(--color);
  }

  .subTitle{
    font-size: 14px;
    color: var(--sub-color);
  }
}
```

### VII、主页第一个模块

在`config/responseType.ts`中：

```ts
// 首页第一个模块数据类型
export type HomeOneDataType = {
    title: string,
    subTitle: string,
    imgUrl: string,
    context: Array<string>,
    btnMsg: string,
    link: string
};
```

在`components`目录中新建`homeOne.tsx`：

```tsx
import React, {useEffect, useState} from "react";
import {SizeType} from "../config/publicInterface";
import "../less/homeOne.less";
import {get} from "../config/request";
import {HomeOneDataType} from "../config/responseType";
import {handlerTips} from "../utils";
import {PageImg} from "./pageImg";
import {ModuleTitle} from "./moduleTitle";
import {Link} from "react-router-dom";

export const HomeOne: React.FC<SizeType> = ({width, height, margin}) => {
    const [data, setData] = useState<HomeOneDataType>();
    useEffect(() => {
        get<HomeOneDataType>('/home/homeOne').then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', r.msg, "获取失败！");
        }).then((r) => {
            setData(r);
        })
    }, [])
    return (
        <>
            <div className={"homeOne"} style={{width: width, height: height, margin: margin}}>
                {
                    data ?
                        <>
                            <div className={"imgBox"}>
                                <PageImg pageId={''} imgUrl={data.imgUrl} width={"90%"} height={"95%"} margin={"0"}
                                         imgWidth={"100%"}/>
                            </div>
                            <div className={"homeOneRight"}>
                                <ModuleTitle title={data.title} subTitle={data.subTitle} width={'auto'} height={"auto"}
                                             margin={"0"} textCenter={false}/>
                                {
                                    data.context.map((value) => (
                                        <span key={value.at(1)}>{value}</span>
                                    ))
                                }
                                <Link to={data.link} className={"moreBtn"}>{data.btnMsg}</Link>
                            </div>
                        </> :
                        null
                }
            </div>
        </>
    )
}
```

在`less`目录下新建`homeOne.less`:

```less
.homeOne {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;

  .imgBox {
    width: 430px;
    height: 570px;
    border: 1px solid var(--img-border-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .homeOneRight {
    width: 645px;
    height: 570px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    color: var(--light-black-color);

    .moreBtn{
      width: 134px;
      height: 40px;
      background-color: #00000000;
      border: 1px solid var(--sub-color);
      color: var(--sub-color);
      text-align: center;
      text-decoration: none;
      line-height: 40px;
    }
  }
}
```

### VIII、单个产品模块

在`config/responseType.ts`中：

```ts
// 定义单个产品数据类型
export type ProductItemType = {
    id: string,
    typeId: string,
    itemImg: string,
    name: string
}
```

在`components`目录中新建`productItem.tsx`：

```tsx
import React from "react";
import {SizeType} from "../config/publicInterface";
import {ProductItemType} from "../config/responseType";
import "../less/productItem.less";

interface ProductItemParam extends SizeType {
    itemData: ProductItemType
}

export const ProductItem: React.FC<ProductItemParam> = ({width, height, margin, itemData}) => {
    return (
        <div key={itemData.id} className={'productItem'} style={{width: width, height: height, margin: margin}}>
            <img className={"product-item-img"} src={itemData.itemImg} alt=""/>
            <span className={"product-item-name"}>{itemData.name}</span>
        </div>
    )
}
```

在`less`目录下新建`productItem.less`:

```less
.productItem{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  .product-item-img{
    width: 90%;
    height: 80%;
  }

  .product-item-name{
    font-size: 14px;
    color: var(--light-black-color);
  }
}
```

### IX、产品列表模块

在`components`目录中新建`productList.tsx`：

```tsx
import React from "react";
import {SizeType} from "../config/publicInterface";
import {ProductItemType} from "../config/responseType";
import {ProductItem} from "./productItem";
import "../less/productList.less";

interface ProductListParam extends SizeType {
    listData: Array<ProductItemType>
}

export const ProductList: React.FC<ProductListParam> = ({width, height, margin, listData}) => {
    return (
        <div className={"productList"} style={{width: width, height: height, margin: margin}}>
            {
                listData.map((value) => {
                    return (
                        <ProductItem key={value.id} itemData={value} width={"22%"} height={"293px"}
                                     margin={"10px 1.5%"}/>
                    )
                })
            }
        </div>
    )
}
```

在`less`目录下新建`productList.less`:

```less
.productList{
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
```



### X、主页第二个模块

在`config/responseType.ts`中：

```ts
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
```

在`components`目录中新建`homeTwo.tsx`：

```tsx
import React, {ReactNode, useEffect, useState} from "react";
import {SizeType} from "../config/publicInterface";
import {get} from "../config/request";
import {HomeTwoDataType} from "../config/responseType";
import "../less/homeTwo.less";
import {handlerTips} from "../utils";
import {ModuleTitle} from "./moduleTitle";
import {Tabs} from 'antd';
import type {TabsProps} from 'antd';
import {ProductItem} from "./productItem";
import {ProductList} from "./productList";

interface HomeTwoParam extends SizeType {
    url: string
}

export const HomeTwo: React.FC<HomeTwoParam> = ({width, height, margin, url}) => {
    const [data, setData] = useState<HomeTwoDataType>();
    const [items, setItems] = useState<TabsProps['items']>([]);
    const onChange = (key: string) => {
        if (data) {
            setItems(data.type.map((value) => {
                return {
                    key: value.id,
                    label: value.name,
                    children: <ProductList key={value.id} width={"80%"} height={"80%"} margin={"0 auto"}
                                           listData={data.productList} type={key}/>
                }
            }))
        }
    };
    useEffect(() => {
        get<HomeTwoDataType>(url).then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', r.msg, "获取失败！");
        }).then((r) => {
            if (r) {
                setData(r);
                setItems(r.type.map((value) => {
                    return {
                        key: value.id,
                        label: value.name,
                        children: <ProductList width={"80%"} height={"80%"} margin={"0 auto"}
                                               listData={r.productList} type={value.id}/>,
                    }
                }))
            }
        })
    }, []);
    return (
        <>
            {
                data ?
                    <div className={"homeTwo"} style={{width: width, height: height, margin: margin}}>
                        <ModuleTitle title={data.title} subTitle={data.subTitle} textCenter={true} width={"100%"}
                                     height={"auto"} margin={"0"}/>
                        <Tabs className={"productBox"} centered={true}
                              tabBarStyle={{height: "60px", background: "var(--background-color)"}} defaultActiveKey="1"
                              items={items} onChange={onChange}/>
                    </div> :
                    null
            }
        </>
    )
}
```

在`less`目录下新建`homeTwo.less`:

```less
.homeTwo{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .productBox{
    width: 100%;
    height: auto;
    background-color: var(--duck-white-background-color);

    .ant-tabs-nav-wrap{
      justify-content: space-around;
    }
  }
}
```

### XI、主页第三个模块

在`config/responseType.ts`中：

```ts
// 首页第三个模块数据类型
export type HomeThreeDataType = {
    oneTitle: string,
    oneSubTitle: string,
    twoTitle: string,
    twoSubTitle: string
};
```

在`components`目录中新建`homeThree.tsx`：

```tsx
import React, {useEffect, useState} from "react";
import {SizeType} from "../config/publicInterface";
import "../less/homeThree.less";
import {HomeThreeDataType} from "../config/responseType";
import {get} from "../config/request";
import {handlerTips} from "../utils";

interface HomeThreeParam extends SizeType {
    bgImgUrl: string,
}

export const HomeThree: React.FC<HomeThreeParam> = ({width, height, margin, bgImgUrl}) => {
    const [data, setData] = useState<HomeThreeDataType>();
    useEffect(() => {
        get<HomeThreeDataType>('/home/homeThree').then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', "获取失败！", "请求错误!");
        }).then((r) => {
            setData(r);
        })
    }, []);
    return (
        <div className={"homeThree"}
             style={{width: width, height: height, margin: margin, background: `url(${bgImgUrl}) no-repeat`}}>
            {
                data ?
                    <>
                        <div className="home-three-top">
                            <span className={"oneTitle"}>{data.oneTitle}</span>
                            <span className={"oneSubtitle"}>{data.oneSubTitle}</span>
                        </div>
                        <div className="home-three-bottom">
                            <span className={"twoTitle"}>{data.twoTitle}</span>
                            <span className={"twoSubtitle"}>{data.twoSubTitle}</span>
                        </div>
                    </> :
                    null
            }
        </div>
    )
}
```

在`less`目录下新建`homeThree.less`:

```less
.homeThree {
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: space-around;
  color: #ffffff;
  font-family: fontface__思源黑体light__17__671161003103, serif;

  .home-three-top, .home-three-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    span {
      display: inline-block;
    }

    .oneTitle {
      font-size: 48px;
      font-weight: bold;
    }

    .twoTitle{
      font-size: 36px;
      font-weight: bold;
    }

    .oneSubtitle, .twoSubtitle {
      font-size: 18px;
      margin-top: 20px;
    }
  }


}
```

### XII、单个联系方式组件

在`config/responseType.ts`中：

```ts
// 定义单个联系方式数据类型
export type ContactItemType = {
    id:string,
    icon:string,
    mtd:string,
    val:string
};
```

在`components`目录中新建`contactItem.tsx`：

```tsx
import React from "react";
import {SizeType} from "../config/publicInterface";
import {ContactItemType} from "../config/responseType";
import "../less/contactItem.less";

interface ContactItemParam extends SizeType {
    data: ContactItemType
}

export const ContactItem: React.FC<ContactItemParam> = ({width, height, margin, data}) => {
    return (
        <div className={"contactItem"} style={{width: width, height: height, margin: margin}}>
            <img className={"contactItemIcon"} src={data.icon} alt=""/>
            <div className="contactItemMsg">
                <span className={"mtd"}>{data.mtd}</span>
                <span className={"val"}>{data.val}</span>
            </div>
        </div>
    )
}
```

在`less`目录下新建`contactItem.less`:

```less
.contactItem {
  border: 1px solid var(--color);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;

  .contactItemIcon {
    width: 40px;
    height: 40px;
  }

  .contactItemMsg {
    width: 60%;
    height: 80%;
    display: flex;
    color: #666666;
    flex-direction: column;
    justify-content: space-around;

    .mtd {
      font-size: 16px;
    }

    .val {
      font-size: 12px;
    }
  }
}
```

### XIII、联系方式列表

在`components`目录中新建`contactList.tsx`：

```tsx
import React from "react";
import {SizeType} from "../config/publicInterface";
import {ContactItemType} from "../config/responseType";
import "../less/contactList.less";
import {ContactItem} from "./contactItem";

interface ContactListParam extends SizeType {
    data: Array<ContactItemType>
}

export const ContactList: React.FC<ContactListParam> = ({width, height, margin, data}) => {
    return (
        <div className={"contactList"} style={{width: width, height: height, margin: margin}}>
            {
                data.map((value) => (
                    <ContactItem key={value.id} data={value} width={"340px"} height={"100%"} margin={"0"}/>
                ))
            }
        </div>
    )
}
```

在`less`目录下新建`contactList.less`:

```less
.contactList{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
}
```

### XIV、主页第四个模块

在`config/responseType.ts`中：

```ts
// 首页第四个模块数据类型
export type HomeFourDataType = {
    title:string,
    subTitle:string,
    list:Array<ContactItemType>
};
```

在`components`目录中新建`homeFour.tsx`：

```tsx
import React, {useEffect, useState} from "react";
import {SizeType} from "../config/publicInterface";
import {HomeFourDataType} from "../config/responseType";
import {get} from "../config/request";
import {handlerTips} from "../utils";
import {ModuleTitle} from "./moduleTitle";
import "../less/homeFour.less";
import {ContactList} from "./contactList";

export const HomeFour: React.FC<SizeType> = ({width, height, margin}) => {
    const [data, setData] = useState<HomeFourDataType>();
    useEffect(() => {
        get<HomeFourDataType>('/home/homeFour').then((r) => {
            if (r.code === 200) return r.data;
            handlerTips('warning', "失败！", "请求失败");
        }).then((r) => {
            if (r) setData(r);
        })
    }, []);
    return (
        <>
            {
                data ?
                    <div className={"homeFour"} style={{width: width, height: height, margin: margin}}>
                        <ModuleTitle title={data.title} subTitle={data.subTitle} textCenter={true} width={"100%"}
                                     height={"auto"} margin={"0"}/>
                        <ContactList data={data.list} width={"100%"} height={"100px"} margin={"60px"}/>
                    </div> :
                    null
            }
        </>
    )
}
```

在`less`目录下新建`homeFour.less`:

```less
.homeFour{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
```

### XV、主页模块

在`config/responseType.ts`中：

```ts
// 主页图片列表类型
export type HomeImgType = {
    imgUrl: string[]
};
```

在`home.tsx`中：

```tsx
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
```

### XVI、产品中心模块

在`components`目录中新建`product.tsx`：

```tsx
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
```

## 23.7.4

### I、关于我们图片模块

在`components`文件夹中新建`aboutImg.tsx`：

```tsx
import React from "react";
import {SizeType} from "../config/publicInterface";
import "../less/aboutImg.less";

interface AboutImgParam extends SizeType {
    mainImg: string,
    bgImg: string
}

export const AboutImg: React.FC<AboutImgParam> = ({width, height, margin, mainImg, bgImg}) => {
    return (
        <div className={"aboutImgBox"}
             style={{width: width, height: height, margin: margin}}>
            <img className={"bgImg"} src={bgImg} alt=""/>
            <img className={"aboutImg"} src={mainImg} alt=""/>
        </div>
    )
}
```

在`less`文件夹中新建`aboutImg.less`：

```less
.aboutImgBox{
  position: relative;
  .bgImg{
    width: 100%;
    height: 100%;
  }
  .aboutImg{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 30px;
    right: 30px;
  }
}
```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-19-11.png)



### II、关于我们单个条目

在`responseType.ts`中：

```ts
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
```

在`components`文件夹中新建`aboutItem.tsx`：

```tsx
import React from "react";
import {SizeType} from "../config/publicInterface";
import {AboutItemType} from "../config/responseType";
import {AboutImg} from "./aboutImg";
import {ModuleTitle} from "./moduleTitle";
import "../less/aboutMsgItem.less";

interface AboutMsgItemParam extends SizeType {
    data: AboutItemType,
    layout: boolean,
    style: {
        imgWidth: string,
        imgHeight: string,
        contextWidth: string,
        contextHeight: string
    }
}

export const AboutMsgItem: React.FC<AboutMsgItemParam> = ({width, height, margin, data, layout, style}) => {
    return (
        <div className={"aboutMsgItem"}
             style={{width: width, height: height, margin: margin, flexDirection: `${layout ? 'row' : 'row-reverse'}`}}>
            <AboutImg mainImg={data.mainImg} bgImg={data.bgImg} width={style.imgWidth} height={style.imgHeight}
                      margin={"0"}/>
            <div className={"aboutMsgItemRight"}>
                <ModuleTitle title={data.title} subTitle={data.subTitle} textCenter={false} width={"100%"}
                             height={"auto"} margin={"0"}/>
                <div className={"aboutMsgItemContext"} style={{width: style.contextWidth, height: style.contextHeight}}>
                    {
                        data.context.map((value) => (
                            <span key={value.id}>{value.msg}</span>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
```

在`less`文件夹中新建`aboutItem.less`：

```less
.aboutMsgItem{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .aboutMsgItemRight{
    width: 60%;
    height: 60%;
    display: flex;
    margin-left: 10px;
    flex-direction: column;
    justify-content: space-around;

    .aboutMsgItemContext{
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      color: var(--light-black-color);
    }
  }
}
```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-19-11.png)



### III、关于我们列表模块

在`responseType.ts`中：

```ts
// 关于喜敷页面数据类型
export type AboutListType = Array<AboutItemType>;
```

在`components`文件夹中新建`aboutList.tsx`：

```tsx
import React, {useState} from "react";
import {SizeType} from "../config/publicInterface";
import {AboutListType} from "../config/responseType";
import {AboutMsgItem} from "./aboutMsgItem";
import "../less/aboutMsgList.less";

interface AboutMsgListParam extends SizeType {
    data: AboutListType
}

export const AboutMsgList: React.FC<AboutMsgListParam> = ({width, height, margin, data}) => {
    return (
        <>
            {
                data ?
                    <div className={"aboutMsgList"} style={{width: width, height: height, margin: margin}}>
                        {
                            <>
                                <AboutMsgItem key={data[0].id} data={data[0]} layout={true} width={"100%"}
                                              height={"800px"} margin={"0"} style={{
                                    imgWidth: "420px",
                                    imgHeight: "600px",
                                    contextWidth: "100%",
                                    contextHeight: "400px"
                                }}/>
                                <AboutMsgItem key={data[1].id} data={data[1]} layout={false} width={"100%"}
                                              height={"600px"} margin={"0"} style={{
                                    imgWidth: "420px",
                                    imgHeight: "388px",
                                    contextWidth: "50%",
                                    contextHeight: "200px"
                                }}/>
                            </>
                        }
                    </div> :
                    null
            }
        </>
    )
}
```

在`less`文件夹中新建`aboutList.less`：

```less
.aboutMsgList{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-19-11.png)



### IV、关于我们页面

在`components`文件夹中新建`about.tsx`：

```tsx
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
```

### V、联系我们地图模块

在`index.html`中：

```ts
<script type="text/javascript" src="https://api.map.baidu.com/api?v=3.0&ak=YOU-AK"></script>
```

在`components`文件夹中新建`bMap.tsx`：

```tsx
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
```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-19-11.png)



### VI、联系我们表单模块

在`components`文件夹中新建`contactForm.tsx`：

```tsx
import React from "react";
import {SizeType} from "../config/publicInterface";
import {Button, Form, Input} from "antd";
import {post} from "../config/request";
import {handlerTips} from "../utils";


interface DataNodeType {
    value: string;
    label: string;
    children?: DataNodeType[];
}

export const ContactForm: React.FC<SizeType> = ({width, height, margin}) => {
    const [form] = Form.useForm();
    const onFinish = (values: any) => {
        post<object>('/contact/pushForm', {
            name: values.name,
            phone: values.phone,
            email: values.email,
            context: values.context
        }).then((r) => {
            if (r.code === 200) return handlerTips('success', '表单提交成功！', '成功');
            handlerTips('warning', r.msg, '表单提交失败！');
        })
    };
    return (
        <div className={"contactForm"} style={{width: width, height: height, margin: margin}}>
            <Form
                form={form}
                name="register"
                style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center"}}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="name"
                    label="姓名"
                    style={{width: "30%"}}
                    rules={[
                        {
                            required: true,
                            message: '姓名不能为空！',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="email"
                    label="邮箱"
                    style={{width: "30%"}}
                    rules={[
                        {
                            type: 'email',
                            message: '邮箱格式错误!',
                        },
                        {
                            required: true,
                            message: '邮箱不能为空!',
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="电话"
                    style={{width: "30%"}}
                    tooltip="What do you want others to call you?"
                    rules={[{required: true, message: '电话号码不能为空！', whitespace: true}]}
                >
                    <Input/>
                </Form.Item>

                <Form.Item
                    name="context"
                    label="内容"
                    style={{width: "33%"}}
                    rules={[{required: true, message: '请输入内容'}]}
                >
                    <Input.TextArea showCount maxLength={100}/>
                </Form.Item>
                <Form.Item style={{width: "33%", height: "40px"}}>
                    <Button type="primary" style={{width: "100%", height: "100%"}} htmlType="submit">
                        提交留言
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-19-11.png)



### VII、联系我们页面

在`contact.tsx`中：

```tsx
import {PageImg} from "../components/pageImg";
import {HomeFour} from "../components/homeFour";
import {BMap} from "../components/bMap";
import {ContactForm} from "../components/contactForm";

export const Contact = () => {
    return(
        <>
            <div className={"pubP"}>
                <PageImg pageId={'e'} width={'100%'} height={'800px'} margin={'0'} imgUrl={''} imgWidth={"120%"}/>
                <HomeFour width={"90%"} height={"395px"} margin={"0 auto"} />
                <BMap width={"80%"} height={"460px"} margin={"30px auto"}/>
                <ContactForm width={"80%"} height={"288"} margin={"100px auto"}/>
            </div>
        </>
    )
}
```

### II、关于我们单个条目

在`responseType.ts`中：

```ts

```

在`components`文件夹中新建`aboutItem.tsx`：

```tsx

```

在`less`文件夹中新建`aboutItem.less`：

```less

```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-19-11.png)



### II、关于我们单个条目

在`responseType.ts`中：

```ts

```

在`components`文件夹中新建`aboutItem.tsx`：

```tsx

```

在`less`文件夹中新建`aboutItem.less`：

```less

```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-19-11.png)



### II、关于我们单个条目

在`responseType.ts`中：

```ts

```

在`components`文件夹中新建`aboutItem.tsx`：

```tsx

```

在`less`文件夹中新建`aboutItem.less`：

```less

```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-19-11.png)



### II、关于我们单个条目

在`responseType.ts`中：

```ts

```

在`components`文件夹中新建`aboutItem.tsx`：

```tsx

```

在`less`文件夹中新建`aboutItem.less`：

```less

```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-19-11.png)



### II、关于我们单个条目

在`responseType.ts`中：

```ts

```

在`components`文件夹中新建`aboutItem.tsx`：

```tsx

```

在`less`文件夹中新建`aboutItem.less`：

```less

```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-19-11.png)



### II、关于我们单个条目

在`responseType.ts`中：

```ts

```

在`components`文件夹中新建`aboutItem.tsx`：

```tsx

```

在`less`文件夹中新建`aboutItem.less`：

```less

```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-19-11.png)



### II、关于我们单个条目

在`responseType.ts`中：

```ts

```

在`components`文件夹中新建`aboutItem.tsx`：

```tsx

```

在`less`文件夹中新建`aboutItem.less`：

```less

```

效果图：

![](http://39.101.72.168:81/image/examination/log/Snipaste_2023-07-03_11-19-11.png)









































