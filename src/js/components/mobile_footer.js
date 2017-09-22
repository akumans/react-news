import React from 'react';
import { Row, Col } from 'antd';
export default class MobileFooter extends React.Component{
    render(){
        return(
            <div id="MobileFooters">
                <footer>
                    <Row>
                        <Col span={2}></Col>
                        <Col span={20} class="footer">
                            &copy;&nbsp;2017 Akumans. All Rights Reserved
                        </Col>
                        <Col span={2}></Col>
                    </Row>
                </footer>
            </div>
        )
    }
}