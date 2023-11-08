//주식 메인화면에서 종목을 검색하는 곳에 사용되는 버튼을 나타내는 곳입니다.

import "./css/Chart_Search_button.css";
import React from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { SearchOutlined } from "@ant-design/icons";

const Chart_Search_button = ({ btnClick }) => {
    return (
        
        <div className="chartSearchBtn">
            <Button 
                variant="outline-primary" 
                onClick={btnClick}
                style={{
                        border: 'none', 
                        borderRadius: '100%', 
                        padding: '0'
                }} 
            >
                <SearchOutlined 
                    style={{ 
                        display: 'block', 
                        fontSize: '35px',
                        color:'#50B3FF'
                        
                    }} 
                />
            </Button>
        </div>
    )
}

Chart_Search_button.propTypes = {
    btnClick: PropTypes.func.isRequired,
}

export default Chart_Search_button;