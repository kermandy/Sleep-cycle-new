import React, { useState } from 'react';

function App() {
  const [wakeUpResults, setWakeUpResults] = useState([]);
  const [bedTimeResults, setBedTimeResults] = useState([]);
  const [targetTime, setTargetTime] = useState("07:00");

  const cycles = [4, 5, 6, 7];

  const calculateTimes = (isForward) => {
    const results = [];
    const baseTime = new Date();
    
    if (!isForward) {
      const [h, m] = targetTime.split(':');
      baseTime.setHours(parseInt(h), parseInt(m), 0, 0);
      if (baseTime < new Date()) baseTime.setDate(baseTime.getDate() + 1);
    }

    cycles.forEach(cycle => {
      const msInCycle = cycle * 90 * 60000;
      const buffer = 15 * 60000;
      const resultDate = isForward 
        ? new Date(new Date().getTime() + buffer + msInCycle)
        : new Date(baseTime.getTime() - msInCycle - buffer);

      results.push({
        cycle,
        hours: cycle * 1.5,
        time: resultDate.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false }),
        isOptimal: cycle === 5 || cycle === 6
      });
    });

    if (isForward) {
      setWakeUpResults(results);
      setBedTimeResults([]);
    } else {
      setBedTimeResults(results);
      setWakeUpResults([]);
    }
  };

  return (
    <div className="container">
      {/* 這裡放入你原本的 CSS 樣式，或是寫在 index.css */}
      <h1>睡眠週期計算機 🌙</h1>
      <p className="subtitle">以 90 分鐘為一週期，已包含 15 分鐘入睡緩衝</p>

      <div className="action-box">
        <h2>如果我現在立刻去睡...</h2>
        <button onClick={() => calculateTimes(true)}>計算起床鬧鐘時間</button>
        <ResultList results={wakeUpResults} title="建議鬧鐘設定為：" />
      </div>

      <div className="action-box">
        <h2>如果我想要在...起床</h2>
        <input type="time" value={targetTime} onChange={(e) => setTargetTime(e.target.value)} />
        <button onClick={() => calculateTimes(false)}>計算幾點該躺平</button>
        <ResultList results={bedTimeResults} title="建議躺平睡覺的時間：" />
      </div>
    </div>
  );
}

const ResultList = ({ results, title }) => {
  if (results.length === 0) return null;
  return (
    <div className="results-area">
      <h3 style={{color: '#ffffff', borderBottom: '1px solid #4a4ade', paddingBottom: '10px'}}>{title}</h3>
      {results.map((res, i) => (
        <div key={i} className={`cycle-card ${res.isOptimal ? 'optimal' : ''}`}>
          <div className="cycle-info">
            <span className="cycle-count">{res.cycle} 個週期</span>
            <span className="cycle-hours">睡滿 {res.hours} 小時</span>
          </div>
          <div className="time-display">{res.time}</div>
        </div>
      ))}
    </div>
  );
};

export default App;