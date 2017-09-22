import React from 'react';
import {Row, Col,BackTop} from 'antd';
import MobileFooter from "./mobile_footer";
import MobileHeader from "./mobile_header";
import CommonComments from "./common_comments";
export default class MobileNewsDetails extends React.Component{
    constructor(){
        super();
        this.state={
            newsItem:''
        }
    }

    //获取对应uniquekey文章
    componentDidMount(){
        var myFetchOptions = {
            method: 'GET'
        }
        fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnewsitem&uniquekey="+this.props.params.uniquekey,myFetchOptions)
            .then(response=>response.json())
            .then(json=>{
                this.setState({newsItem:json})
                document.title=this.state.newsItem.title+"|React News | React 驱动的新闻平台"
            })
    }
    //html转义
    createMarkup(){
        return {__html:this.state.newsItem.pagecontent}
    }
    render(){
        return(
            <div id="mobileDetailsContainer">
                <MobileHeader/>
                <div className="ucmobileList">
                <Row>
                    <Col span={24} className="container">
                        <div className="article-content" dangerouslySetInnerHTML={this.createMarkup()}></div>
                        <hr/>
                        <CommonComments uniquekey={this.props.params.uniquekey}/>
                    </Col>
                </Row>
                <MobileFooter/>
                <BackTop/>
                </div>
            </div>
        )
    }
}