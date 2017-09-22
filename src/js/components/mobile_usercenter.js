import React from 'react';
import {Router, Route, Link, browserHistory} from 'react-router';
import {Row,Col,Modal,Menu,Icon,Tabs,message,Form,Input,Button,Checkbox,Card,notification,Upload} from 'antd';
const FormItem=Form.Item;
const TabPane=Tabs.TabPane;
const SubMenu=Menu.SubMenu;
const MenuItemGroup=Menu.ItemGroup;
import MobileHeader from "./mobile_header";
import MobileFooter from "./mobile_footer";

export default class MobileUserCenter extends React.Component{
    /*
    usercollection：用户收藏列表
    usercomments：用户评论列表
    previewImage：预览图片
    previewVisible：模态框弹出
    */
    constructor(){
        super();
        this.state={
            usercollection:'',
            usercomments:'',
            previewImage:'',
            previewVisible:false
        }
    }

    //获取用户收藏列表，获取用户评论列表
    componentDidMount() {
        var myFetchOptions = {
            method: 'GET'
        }

        fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getuc&userid=" + localStorage.userid, myFetchOptions)
            .then(response=>response.json())
            .then(json=>{
                this.setState({usercollection:json})
            })
        fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getusercomments&userid=" + localStorage.userid, myFetchOptions)
            .then(response=>response.json())
            .then(json=>{
                this.setState({usercomments:json});
            });
    }
    setModalVisible(value)
    {
        this.setState({previewVisible: value})
    }
    render(){
        //antD图片上传插件
        const props={
            action:'http://newapi.gugujiankong.com/handler.ashx',
            headers:{
                "Access-Control-Allow-Origin":"*"
            },
            listType:'picture-card',
            defaultFileList:[{
                uid:-1,
                name:'xxx.png',
                state:'done',
                url:'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png',
                thumbUrl: 'https://os.alipayobjects.com/rmsportal/NDbkJhpzmLxtPhB.png'
            }],
            onPreview: (file) => {
                this.setState({previewImage: file.url, previewVisible: true});
            }
        }
        //循环用户收藏列表，用户评论列表
        const {usercollection,usercomments}=this.state
        const usercollectionList=usercollection.length
            ?
            usercollection.map((uc,index)=>(
                <Card key={index} title={uc.uniquekey} extra={<a href={`/#/details/${uc.uniquekey}`}>查看文章</a>}>
                    <p>{uc.Title}</p>
                </Card>
            ))
            :
            '您还没有收藏任何的新闻，快去收藏一些新闻吧'

        const usercommentsList = usercomments.length
            ?
            usercomments.map((comment,index)=>(
                <Card key={index} title={`于 ${comment.datetime} 评论了文章 ${comment.uniquekey}`} extra={<a href={`/#/details/${comment.uniquekey}`}>查看</a>}>
                    <p>{comment.Comments}</p>
                </Card>
            ))
            :
            '您还没有发表过任何评论。'

        return(
            <div id="PCUserCenter">
                <MobileHeader/>
                <Row className="RowUserCenter">
                    <Col span={24}>
                        <Tabs>
                            <TabPane tab="我的收藏列表" key="1">
                                <div className="comment">
                                    <Row>
                                        <Col span={24}>
                                            {usercollectionList}
                                        </Col>
                                    </Row>
                                </div>
                            </TabPane>
                            <TabPane tab="我的评论列表" key="2">
                                {usercommentsList}
                            </TabPane>
                            <TabPane tab="头像设置" key="3">
                                <div className="clearfix">
                                    <Upload {...props}>
                                        <Icon type="plus"/>
                                        <div className="ant-upload-text">上传照片</div>
                                    </Upload>
                                    <Modal visible={this.state.previewVisible} footer={null} onCancel= {()=>this.setModalVisible(false)}>
                                        <img alt="预览" src={this.state.previewImage}/>
                                    </Modal>
                                </div>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
                <MobileFooter/>
            </div>
        )
    }
}
