import React from 'react';
import {Router, Route, Link, browserHistory} from 'react-router'
import { Row, Col } from 'antd';
import {Menu, Icon, Modal,Tabs,message,Form,Input,Button,Checkbox} from 'antd';
const FormItem=Form.Item;
const TabPane=Tabs.TabPane;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class MobileHeader extends React.Component{
    /*
    初始化state状态
    action：登录或注册
    modalVisible：模态框
    hasLogined：登录状态
    */
    constructor(){
        super();
        this.state={
            current:'top',
            modalVisible:false,
            action:'login',
            hasLogined:false,
            userNickName:'',
            userid:0
        }
    }
    //根据modalVisible状态显示模态框
    setModalVisible(value){
        this.setState({modalVisible:value})
    }

    /*
    检测用户是否登录
    判断localStorage中用户id是否存在
    */
    componentWillMount() {
        if (localStorage.userid != '') {
            this.setState({hasLogined: true});
            this.setState({userNickName: localStorage.userNickName, userid: localStorage.userid});
        }
    }
    /*
     向API进行用户注册和登录
     使用fetch进行数据交互
     */
    handleSubmit(e)
    {
        //页面开始向 API 进行提交数据
        e.preventDefault();
        var myFetchOptions = {
            method: 'GET'
        };
        var formdata= this.props.form.getFieldsValue()
        console.log(formdata)
        fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=" + this.state.action
            + "&username="+formdata.userName+"&password="+formdata.password
            +"&r_userName=" + formdata.r_userName + "&r_password="
            + formdata.r_password + "&r_confirmPassword="
            + formdata.r_confirmPassword, myFetchOptions)
            .then(response => response.json())
            .then(json => {
                this.setState({userNickName: json.NickUserName, userid: json.UserId})
                localStorage.userid= json.UserId
                localStorage.userNickName = json.NickUserName
            })
        if (this.state.action=="login") {
            this.setState({hasLogined:true})
        }
        message.success("请求成功！")
        this.setModalVisible(false)
    };
    //登录状态
    login(){
        this.setModalVisible(true)
    }
    //登录或者注册
    callback(key) {
        if (key == 1) {
            this.setState({action: 'login'})
        } else if (key == 2) {
            this.setState({action: 'register'})
        }
    }
    render(){
        let {getFieldDecorator}=this.props.form
        const userShow = this.state.hasLogined ?
            <Link to={`/usercenter`}>
                <Icon type="inbox"/>
            </Link>
            :
            <Icon type="setting" onClick={this.login.bind(this)}/>
        return(
            <div id="MobileHeader">
                <header>
                    <img src="src/images/logo.png" alt="logo"/>
                    <span>ReactNews</span>
                    {userShow}
                </header>
                <Modal title="用户中心" wrapClassName="vertical-center-modal" visible={this.state.modalVisible} onCancel= {()=>this.setModalVisible(false)} onOk={() => this.setModalVisible(false)} okText="关闭">
                    <Tabs type="card" onChange={this.callback.bind(this)}>
                        <TabPane tab="登录" key="1">
                            <Form layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
                                <FormItem label="账户">
                                    {getFieldDecorator('userName')(<Input placeholder="请输入您的账号"/>)}
                                </FormItem>
                                <FormItem label="密码">
                                    {getFieldDecorator('password')(<Input type="password" placeholder="请输入您的密码" />)}
                                </FormItem>
                                <Button type="primary" htmlType="submit">登录</Button>
                            </Form>
                        </TabPane>
                        <TabPane tab="注册" key="2">
                            <Form layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
                                <FormItem label="账户">
                                    {getFieldDecorator('r_userName')(<Input placeholder="请输入您的账户"/>)}
                                </FormItem>
                                <FormItem label="密码">
                                    {getFieldDecorator('r_password')(<Input type="password" placeholder="请输入您的密码" />)}
                                </FormItem>
                                <FormItem label="确认密码">
                                    {getFieldDecorator('r_confirmPassword')(<Input type="password" placeholder="请再次确认您的密码" />)}
                                </FormItem>
                                <Button type="primary" htmlType="submit">注册</Button>
                            </Form>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        )
    }
}
export default MobileHeader=Form.create({})(MobileHeader);