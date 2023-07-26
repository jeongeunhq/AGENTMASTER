import React, { useState, useRef,useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';
import Autosuggest from 'react-autosuggest';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';


export function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const socket = socketIOClient('/'); // 소켓 연결

    // 서버로부터 업데이트된 데이터 수신
    socket.on('articles', (data) => {
      setArticles(data);
    });

    // 임시 데이터
    const temporaryData = [
      { id: 1, title: '기사 1' },
      { id: 2, title: '기사 2' },
      { id: 3, title: '기사 3' },
    ];
    setArticles(temporaryData);

    return () => {
      socket.disconnect(); // 컴포넌트가 언마운트될 때 소켓 연결 해제
    };
  }, []);

  return (
    <div className="Article">
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {articles.map((article) => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>
    </div>
  );
}

export function Table() {
  const data = [
    { id: 1, name: '전일', price: 7730 },
    { id: 2, name: '고가', price: 9630 },
    { id: 3, name: '거래량', price: 39193815 },
    { id: 4, name: '시가', price: 7930 },
    { id: 5, name: '저가', price: 7930 },
    { id: 6, name: '거래대금', price: '349,695백만' },
  ];
  const rows = [];
  for (let i = 0; i < data.length; i += 3) {
    rows.push(
      <tr key={i}>
        {data.slice(i, i + 3).map((item, index) => (
          <React.Fragment key={item.id}>
            <td>{item.name}</td>
            <td>{item.price}</td>
          </React.Fragment>
        ))}
      </tr>
    );
  }

  return (
    <div>
      <table className="custom-table">
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export function Rechart1() {
  const data = [
    {
      name: '오전 10:00',
      백광산업: 4000,
      amt: 2400,
    },
    {
      name: '오전 12:00',
      백광산업: 3000,
      amt: 2210,
    },
    {
      name: '오후 2:00',
      백광산업: 2000,
      amt: 2290,
    },
  ];

  return (
    <ResponsiveContainer width={800} height={500}>
      <LineChart
       
        data={data}
        margin={{
          top: 70,
          left: 100,
          bottom: 5,
          right: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="백광산업"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Label
          value="백광산업"
          position="top"
          offset={10}
          style={{ fill: 'black' }}
        />
      
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Rechart2() {
  const data = [
    {
      name: '오전 10:00',
      백광산업: 4000,
      LX인터내셔널: 2400,
      amt: 2400,
    },
    {
      name: '오전 12:00',
      백광산업: 3000,
      LX인터내셔널: 1398,
      amt: 2210,
    },
    {
      name: '오후 2:00',
      백광산업: 2000,
      LX인터내셔널: 9800,
      amt: 2290,
    },
  ];

  return (
    <ResponsiveContainer width={800} height={500}>
      <LineChart
        data={data}
        margin={{
          top: 70,
          left: 110,
          bottom: 5,
          right: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="백광산업"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="LX인터내셔널" stroke="#82ca9d" />
        <Label
          value="백광산업"
          position="top"
          offset={10}
          style={{ fill: 'black' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}


export function Search2() {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const searchInputRef = useRef(null);
  const resultContainerRef = useRef(null);
  const webSocketRef = useRef(null);

  useEffect(() => {
    webSocketRef.current = new WebSocket('ws://your-websocket-server-url'); // 웹소켓 서버 URL로 대체하세요

    webSocketRef.current.onopen = () => {
      console.log('웹소켓 연결이 성립되었습니다.');
    };

    webSocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSuggestions(data); // 데이터가 서버로부터 제안 배열로 오는 것을 가정합니다
      setIsOpen(data.length > 0); // 제안이 있을 때만 드롭다운을 보여줍니다
    };

    webSocketRef.current.onclose = () => {
      console.log('웹소켓 연결이 종료되었습니다.');
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (webSocketRef.current) {
        webSocketRef.current.close();
      }
    };
  }, []);

  const sendWebSocketMessage = (message) => {
    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
      webSocketRef.current.send(JSON.stringify({ query: message }));
    }
  };

  const onSuggestionsFetchRequested = ({ value }) => {
    sendWebSocketMessage(value); // 웹소켓을 통해 서버로 검색어를 보냅니다
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (resultContainerRef.current && !resultContainerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const handleSearch = () => {
    console.log('검색어:', value);
    setSearchHistory([...searchHistory, value]);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    setValue(suggestion);
    setIsOpen(false);
  };

  const renderSuggestion = (suggestion) => {
    return <div>{suggestion}</div>;
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', width: '700px', background: '#9bccfb', marginTop: '30px', marginLeft: '150px', zIndex: 1 }}>
        {isOpen && (
          <ul className='search-list' style={{ listStyle: 'none', padding: 0 }}>
            {searchHistory.map((searchItem, index) => (
              <li key={index}>{searchItem}</li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          getSuggestionValue={(suggestion) => suggestion}
          renderSuggestion={renderSuggestion}
          inputProps={{
            value: value,
            onChange: (event, { newValue }) => setValue(newValue),
            style: {
              backgroundColor: 'white',
              border: '3px solid #9bccfb',
              padding: '10px',
              borderRadius: '5px',
              width: '700px',
              marginLeft: '150px',
              marginTop: '50px',
            },
            ref: searchInputRef,
          }}
        />
        <IconButton
          type="submit"
          sx={{ p: '10px' }}
          aria-label="search"
          size="large"
          style={{ marginLeft: '-50px', marginTop: '50px' }}
          onClick={handleSearch}
        >
          <SearchIcon fontSize="large" />
        </IconButton>
      </div>
    </div>
  );
}