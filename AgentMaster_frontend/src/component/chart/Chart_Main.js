import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

import trophy from './img/trophy.png';
import rank1 from './img/rank1.png';
import rank2 from './img/rank2.png';
import rank3 from './img/rank3.png';
import rank4 from './img/rank4.png';
import rank5 from './img/rank5.png';
import rank6 from './img/rank6.png';
import rank7 from './img/rank7.png';
import rank8 from './img/rank8.png';
import rank9 from './img/rank9.png';
import rank10 from './img/rank10.png';

const rankIcons = {
  1: rank1, 2: rank2, 3: rank3, 4: rank4, 5: rank5,
  6: rank6, 7: rank7, 8: rank8, 9: rank9, 10: rank10,
};

export default function MainPage() {
  const navigate = useNavigate();

  const [newsData, setNewsData] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const fetchNews = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/ChartMain/TodayNews');
      setNewsData(data.Today);
    } catch {
      setNewsData([{ title: 'Sample Title', summary: '나랏말싸미123듕13귁에 다라' }]);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);

  const fetchTableData = useCallback(async (type = 'TopRate') => {
    try {
      setTableLoading(true);
      const { data } = await axios.get(`http://localhost:8080/${type}`);
      setTableData(data.TopRate);
    } catch {
      alert('데이터를 불러오지 못했습니다.');
    } finally {
      setTableLoading(false);
    }
  }, []);

  const [rankingData, setRankingData] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(true);

  const fetchRanking = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:8080/Ranking');
      const sorted = data.Ranking
        .sort((a, b) => b.ranking[0].profit - a.ranking[0].profit)
        .slice(0, 10)
        .map((item, i) => ({
          ...item,
          ranking: [{ ...item.ranking[0], rank: i + 1 }]
        }));
      setRankingData(sorted);
    } catch {
      console.error("랭킹 데이터를 불러오는 데 실패했습니다.");
    } finally {
      setRankingLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    fetchTableData();
    fetchRanking();
  }, [fetchNews, fetchTableData, fetchRanking]);

  const handleNewsClick = (articleId) => {
    navigate(`/newsDetail?id=${articleId}`, { state: { id: articleId } });
  };

  const handleSimulClick = () => {
    const user = sessionStorage.getItem("user");
    if (user) {
      navigate(`/SimulMain`);
    } else {
      alert("로그인이 필요한 기능입니다!");
      navigate(`/`);
    }
  };

  const handleStockClick = (stockName) => {
    navigate(`/ChartDetail?keyword=${stockName}`);
  };

  const types = [
    { label: '상한가', value: 'TopReturn' },
    { label: '하한가', value: 'BottomReturn' },
    { label: '상승', value: 'TopRate' },
    { label: '하락', value: 'BottomRate' },
    { label: '거래량상위', value: 'TopVolume' },
  ];

  return (
    <div className="main-container">
      <section className="chartNews">
        {newsLoading ? (
          <div className="loading_main"><LoadingOutlined /> loading...</div>
        ) : (
          <>
            <h1 className="news-title">오늘의 뉴스</h1>
            <hr className="news-divider" />
            <div className="news-container">
              {newsData.map((article) => (
                <div key={article.articleId} className="news-item" onClick={() => handleNewsClick(article.articleId)}>
                  <p>{article.title}</p>
                  <p className="news-summary">{article.summary}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="table-parent-container">
        <div className="table-buttons">
          {types.map((t) => (
            <button key={t.value} onClick={() => fetchTableData(t.value)}>{t.label}</button>
          ))}
          <button className='test' onClick={handleSimulClick}>모의투자 해보기</button>
        </div>
        <div className="table-container">
          <table className="table2">
            <thead>
              <tr>
                <th>순위</th><th>종목명</th><th>현재가</th><th>전일비</th><th>등락률</th><th>거래량</th>
              </tr>
            </thead>
            <tbody>
              {tableLoading ? (
                <tr><td colSpan={6}><LoadingOutlined /> loading...</td></tr>
              ) : (
                tableData.map((item) => (
                  <tr key={item.stockId}>
                    <td>{item.rank}</td>
                    <td className="link-button" onClick={() => handleStockClick(item.stockName)}>{item.stockName}</td>
                    <td>{item.stockPrice}</td>
                    <td>{item.stockDiff}</td>
                    <td>{item.stockRange}</td>
                    <td>{item.stockVolume}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mockTitle">
        <img className="trophy" src={trophy} alt="trophy" />
        <h2>모의투자 랭킹</h2>
        <div className="mock-ranking-container">
          {rankingLoading ? (
            <div className="loading_main"><LoadingOutlined /> loading...</div>
          ) : (
            <div className="ranking-list">
              <div className="ranking-left">
                <ul className="title"><li>순위 <span className="item-text">수익률</span> <span className="item-titleId">ID</span></li></ul>
                <ul className="dot-list">
                  {rankingData.slice(0, 5).map((item) => (
                    <li key={item.ranking[0].rank} className="ranking-item">
                      <img src={rankIcons[item.ranking[0].rank]} alt={`Rank ${item.ranking[0].rank}`} className="rank-icon" />
                      <span className="item-text">{item.ranking[0].profit}%</span>
                      <span className="item-id">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="ranking-right">
                <ul className="dot-list">
                  {rankingData.slice(5, 10).map((item) => (
                    <li key={item.ranking[0].rank} className="ranking-item">
                      <img src={rankIcons[item.ranking[0].rank]} alt={`Rank ${item.ranking[0].rank}`} className="rank-icon" />
                      <span className="item-text">{item.ranking[0].profit}%</span>
                      <span className="item-id">{item.name}</span>
                    </li>
                  ))}
                </ul>
                <div className="dot-line" />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
