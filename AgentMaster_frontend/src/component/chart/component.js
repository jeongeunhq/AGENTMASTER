import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';

// 📌 공통 유틸: 쿼리 파라미터 가져오기
const useQuery = () => {
  return new URLSearchParams(window.location.search);
};

// 📌 뉴스 기사 리스트
export function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const query = useQuery();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const stockCode = query.get('keyword');
        const { data } = await axios.get(`http://localhost:8080/article?stockCode=${stockCode}`);
        setArticles(data.articles);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [query]);

  const openModal = useCallback((article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  }, []);

  const goToDetail = () => {
    navigate(`/NewsDetail`, { state: selectedArticle });
  };

  return (
    <div className="Article">
      {loading ? (
        <div className="loading_main"><LoadingOutlined /> loading...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 10 }}>
          {articles.map((article) => (
            <li key={article.articleId}>
              <p className="article-title" onClick={() => openModal(article)}>
                [{article.publisher}] {article.title}
              </p>
              <hr className="article-bottom" />
            </li>
          ))}
        </ul>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="Custom"
        overlayClassName="CustomOverlay"
      >
        {selectedArticle && (
          <div className="Modal_main">
            <div className="ModalTop">
              <p className="ModalMove" onClick={goToDetail}>&lt;- 상세페이지로</p>
              <p className="ModalClose" onClick={closeModal}>X</p>
            </div>
            <div className="ModalBox">
              <p className="ModalText">{selectedArticle.summary || '기사 내용이 없습니다.'}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// 📌 주식 테이블
export function Table() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const query = useQuery();

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const stockCode = query.get('keyword');
        const { data } = await axios.get(`http://localhost:8080/stockData?stockCode=${stockCode}`);
        setData(data.StockBase[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [query]);

  if (loading || !data) {
    return <div className="loading_main"><LoadingOutlined /> loading...</div>;
  }

  return (
    <table className="custom-table">
      <tbody>
        <tr>
          <th className="divider">전일비</th>
          <th className="divider">시가</th>
          <th className="divider">금일 최고가</th>
        </tr>
        <tr>
          <td>{data.stockDiff}</td>
          <td>{data.stockStartPrice}</td>
          <td>{data.stockhighPrice}</td>
        </tr>
        <tr>
          <th className="divider">금일 최저가</th>
          <th className="divider">거래량</th>
          <th className="divider">거래대금</th>
        </tr>
        <tr>
          <td>{data.stocklowPrice}</td>
          <td>{data.stockTradingAmount}</td>
          <td>{data.stockTradingTotalPrice}</td>
        </tr>
      </tbody>
    </table>
  );
}

// 📌 단일 종목 차트
export function Rechart1() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = useQuery();

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const stockCode = query.get('keyword');
        const { data } = await axios.get(`http://localhost:8080/ChartData?stockId=${stockCode}`);
        setStockData(data.ChartData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, [query]);

  const series = useMemo(() => [{
    name: '종목가',
    data: stockData.map(item => ({
      x: new Date(item.stockDate).getTime(),
      y: item.stockPrice,
    }))
  }], [stockData]);

  const options = useMemo(() => ({
    chart: { type: 'line', zoom: { enabled: false } },
    stroke: { curve: 'smooth' },
    dataLabels: { enabled: false },
    xaxis: { type: 'datetime' },
    yaxis: { title: { text: '가격' } },
    tooltip: {
      x: { format: 'dd MMM yyyy' },
      custom: ({ dataPointIndex }) => {
        const item = stockData[dataPointIndex];
        if (!item) return '';
        return `
          <div class="custom-tooltip">
            <span>종목가: ${item.stockPrice}</span><br/>
            <span>전일대비: ${item.stockDiff}</span><br/>
            <span>등락률: ${item.stockRange}%</span>
          </div>`;
      }
    }
  }), [stockData]);

  return (
    <div className="Rechart1">
      {loading ? (
        <div className="loading_main"><LoadingOutlined /> loading...</div>
      ) : (
        <ReactApexChart options={options} series={series} type="line" height={350} />
      )}
    </div>
  );
}

// 📌 비교 차트
export function Rechart2({ keywordFromChartMain, keywordFromSearch2 }) {
  const [chartData, setChartData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [xDates, setXDates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChart = async (keyword, setData) => {
    try {
      const { data } = await axios.get(`http://localhost:8080/ChartData?stockId=${keyword}`);
      setData(data.ChartData);
      setXDates(prev => [...new Set([...prev, ...data.ChartData.map(i => i.stockDate)])]);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchChart(keywordFromChartMain, setChartData),
      fetchChart(keywordFromSearch2, setSearchData)
    ]).finally(() => setLoading(false));
  }, [keywordFromChartMain, keywordFromSearch2]);

  const series = useMemo(() => {
    const result = [{
      name: keywordFromChartMain,
      data: chartData.map(item => item.stockPrice),
    }];
    if (searchData.length) {
      result.push({
        name: keywordFromSearch2,
        data: searchData.map(item => item.stockPrice),
      });
    }
    return result;
  }, [chartData, searchData, keywordFromChartMain, keywordFromSearch2]);

  const options = useMemo(() => ({
    chart: { type: 'line', zoom: { enabled: false } },
    stroke: { width: [5, 5], curve: 'straight', dashArray: [0, 4] },
    xaxis: { categories: xDates },
    tooltip: {
      y: [{ title: { formatter: val => `${val} 종목가` } }, { title: { formatter: val => `${val} 종목가` } }],
    },
    legend: {
      tooltipHoverFormatter: (val, opts) => {
        return `${val} - ${opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]} (${opts.seriesIndex === 0 ? keywordFromChartMain : keywordFromSearch2})`;
      }
    },
    grid: { borderColor: '#D5D5D5' },
    dataLabels: { enabled: false },
  }), [xDates, keywordFromChartMain, keywordFromSearch2]);

  return (
    <div className="Rechart2">
      {loading ? (
        <div className="loading_main"><LoadingOutlined /> loading...</div>
      ) : (
        <ReactApexChart options={options} series={series} type="line" height={400} />
      )}
    </div>
  );
}
