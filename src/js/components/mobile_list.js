import React from 'react';
import {Row,Col,Carousel} from 'antd';
import {Router, Route, Link, browserHistory} from 'react-router';
import Tloader from 'react-touch-loader';

export default class MobileList extends React.Component{
    /*
     初始化state状态
     news：新闻内容
     count：显示条数
     hasMore：显示更多
     refreshedAt:标识符
     */
    constructor(){
        super();
        this.state={
            news:'',
            count:5,
            hasMore:0,
            initializing:1,
            refreshedAt:Date.now()
        }
    }
    //获取新闻json
    componentWillMount(){
        var myFetchOptions = {
            method: 'GET'
        }
        fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnews&type="+this.props.type+"&count="+this.props.count,myFetchOptions)
            .then(response=>response.json())
            .then(json=>this.setState({news:json}))
    }
    //下拉加载更多
    loadMore(resolve){
        setTimeout(()=>{
            var count=this.state.count
            this.setState({
                count:count+5
            })
            var myFetchOptions = {
                method: 'GET'
            }
            //hsaMore加载更多范围
            fetch("http://newsapi.gugujiankong.com/Handler.ashx?action=getnews&type="+this.props.type+"&count="+this.state.count,myFetchOptions)
                .then(response=>response.json())
                .then(json=>this.setState({news:json}))
            this.setState({
                hasMore:count>0&&count<100
            })
            resolve()
        },200)
    }
    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                hasMore:1,
                initializing:2
            })
        },200)
    }
    render(){
        var {hasMore,initializing,refreshedAt}=this.state
        const {news}=this.state
        const newsList=news.length
            ? news.map((newsItem,index)=>(
                <section key={index} className="m_article list-item special_section clearfix">
                    <Link to={`details/${newsItem.uniquekey}`}>
                        <div className="m_article_img">
                            <img src={newsItem.thumbnail_pic_s}  alt={newsItem.title}/>
                        </div>
                        <div className="m_article_info">
                            <div className="m_article_title">
                                <span>{newsItem.title}</span>
                            </div>
                            <div className="m_article_desc clearfix">
                                <div className="m_article_desc_l">
                                    <span className="m_article_channel">{newsItem.realtype}</span>
                                    <span className="m_article_time">{newsItem.date}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>
            ))
            : '没有加载到任何新闻'
        return(
            <div class="">
                <Row>
                    <Col span={24}>
                        <Tloader className="main" onLoadMore={this.loadMore.bind(this)} hasMore={hasMore} initializing={initializing}>
                            {newsList}
                        </Tloader>
                    </Col>
                </Row>
            </div>
        )
    }
}