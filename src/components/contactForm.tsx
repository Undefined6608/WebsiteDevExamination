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