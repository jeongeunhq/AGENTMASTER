//요약화면 스크랩기능 구현 컴포넌트
//현재는 클릭 시 스크랩 버튼 변경 기능만 있음
//로그인 기능 구현 이후 스크랩 버튼 클릭 시 기사를 저장하는 기능 추가 예정

import { Tooltip } from "antd";
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { useState } from "react";


function Scrap(){
    const [scrapIcon, setScrapIcon] = useState(<StarOutlined style={{fontSize:'27px'}}/>);
    const [selected, setSelected] = useState(false);

    //아이콘을 클릭하면 실행하는 함수. 이후 저장 기능을 추가할 예정
    const clickIcon = () => {
        selected ? setSelected(false) : setSelected(true);
        selected ? (
            setScrapIcon(<StarFilled style={{fontSize:'27px'}}/>)
            ) : (setScrapIcon(<StarOutlined style={{fontSize:'27px'}}/>));
    };

    return(
        <div onClick={clickIcon}>
            <Tooltip title ="저장">
                {scrapIcon}
            </Tooltip>
        </div>
    );
}

export default Scrap;