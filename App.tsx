
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// --- Constants & Data ---

interface Fortune {
  id: number;
  title: string;
  poem: string;
  interpretation: string;
  award: string;
  recommendation: string;
  code: string;
}

interface FortuneRecord {
  timestamp: number;
  fortuneId: number;
  title: string;
  code: string;
  award: string;
}

const FORTUNES: Fortune[] = [
  {
    id: 1,
    title: "【大吉】踏踏聚寶籤",
    poem: "四腳落地皆是金，掌下自有聚寶盆。\n一步一印生財路，越跑越旺富滿門。",
    interpretation: "你家寵物最近是不是喜歡在家裡跑來跑去，或是喜歡用腳掌抓抓挖挖？別阻止牠！這叫「腳踏七星，步步生財」。牠每跑一步，都是在幫你把外面的錢「踩」進家裡；牠用力抓地/挖砂，是在幫你「掘金」啊！",
    award: "獲得 $168 護掌金",
    recommendation: "既然這雙腳是用來賺錢的，當然要保養好！用【爪子清潔慕斯】或【環境除臭液】，讓這條「財路」乾乾淨淨。",
    code: "MUZNY168"
  },
  {
    id: 2,
    title: "【上吉】蹭蹭貴人籤",
    poem: "身帶奇香人緣好，轉身擺尾貴人到。\n撒嬌一聲值千金，桃花朵朵開懷抱。",
    interpretation: "恭喜！你家寵物是你的最強公關。當牠主動用身體磨蹭你、對你翻肚子或是對著你搖尾巴時，牠其實是在把身上的「人緣好運傳染給你！這代表今年你將會有貴人相助，業績或訂單會像牠的毛一樣黏著你不放。",
    award: "獲得 $88 桃花金",
    recommendation: "保持好味道，貴人才會近！隨身帶著【除臭噴霧】或使用【洗毛精】，讓寵物隨時香噴噴，魅力值點滿。",
    code: "MUZNY088"
  },
  {
    id: 3,
    title: "【上上】黃金萬兩籤",
    poem: "每日產出黃金堆，財庫豐盈不吃虧。\n流水便是生財水，淨化得宜發大財。",
    interpretation: "俗話說「肥水不落外人田」。寵物每天製造的便便（黃金）和尿尿（財水），雖然味道重了點，但那可是財庫滿溢的象徵！只要這隻神獸還在拉，就代表你家產能持續運轉，財源滾滾而來。",
    award: "獲得 $88 淨化金",
    recommendation: "保持好味道，貴人才會近！使用【洗毛精】，讓寵物隨時香噴噴，魅力值點滿。",
    code: "MUZNY88"
  },
  {
    id: 4,
    title: "【中吉】大口納財籤",
    poem: "能吃能咬福氣厚，口張便把四方收。\n咬定青山不放鬆，緊咬錢脈不讓溜。",
    interpretation: "覺得寵物愛亂咬東西或貪吃嗎？這其實是「咬住機會不放」的吉兆！牠那張嘴是用來「吞納百財」的。愛吃代表食祿豐厚，愛咬代表行動力強。今年你也會像牠一樣，看到賺錢的機會就狠狠咬住！",
    award: "獲得 滿千折百 優惠券",
    recommendation: "吃完要擦嘴，咬完要清潔！用【舒口水】或【洗碗慕斯】，保證「入口」的都是好運。",
    code: "MUZNY100"
  },
  {
    id: 5,
    title: "【吉】金身護體籤",
    poem: "毛色晶亮納財福，金身護體病不入。\n梳理穢氣精氣足，歲歲平安便是富。",
    interpretation: "你家寵物最近是不是常把自己舔得乾乾淨淨，或是舒服地伸懶腰、曬太陽？這代表牠正在修煉「金剛不壞之身」！毛色發亮代表財庫光鮮，精神好運勢旺。「健康就是最大的財富」，牠身體強健，幫你省下大筆醫藥費，這就是最穩當的守財之道！",
    award: "獲得 全館 95 折 平安券",
    recommendation: "既然要練金身，皮膚保養不能少！用【草本木酢乳膏】或【肌膚木酢液】，幫牠建立天然防護罩，讓蟲蟲都不敢靠近，健康久久。",
    code: "MUZNY95"
  }
];

enum GameState {
  START,
  ANIMATING,
  RESULT,
  HISTORY
}

// --- Components ---

const StartScreen: React.FC<{ onStart: () => void, onShowHistory: () => void, hasDrawn: boolean }> = ({ onStart, onShowHistory, hasDrawn }) => (
  <div className="flex flex-col items-center text-center p-6 bg-cream-bg rounded-3xl shadow-2xl border-4 border-newyear-red">
    <div className="mb-4 text-newyear-red text-6xl animate-float">🐎</div>
    <h1 className="text-3xl font-black text-newyear-red mb-2 tracking-widest">
      新春求好籤
    </h1>
    <h2 className="text-xl font-bold text-newyear-gold mb-8">
      紅包馬上到
    </h2>
    
    <div className="relative mb-10">
      <div className="text-8xl filter drop-shadow-lg">🏮</div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl mt-2">🧧</div>
    </div>

    <div className="mb-8">
      <p className="text-gray-700 leading-relaxed px-4">
        馬年大吉大利，<br/>抽取最高 <span className="text-newyear-red font-bold text-xl">$168</span> 開運金
      </p>
      <p className="text-red-500 text-xs mt-2 font-bold bg-red-50 py-1 px-3 rounded-full inline-block">
        ※ 靈籤誠心，每人限求一籤 ※
      </p>
    </div>

    <div className="w-full space-y-4">
      <button 
        onClick={onStart}
        className={`w-full text-white font-black py-4 px-8 rounded-full text-xl shadow-lg transition-all transform hover:scale-105 border-b-4 active:border-b-0 active:translate-y-1 ${
          hasDrawn 
            ? 'bg-newyear-gold border-yellow-800' 
            : 'bg-newyear-red animate-pulse-slow border-red-900'
        }`}
      >
        {hasDrawn ? '查看我的靈籤' : '立即求籤'} <i className={`fas ${hasDrawn ? 'fa-eye' : 'fa-hand-sparkles'} ml-2`}></i>
      </button>
      
      {hasDrawn && (
        <button 
          onClick={onShowHistory}
          className="w-full bg-white text-newyear-red font-bold py-3 px-8 rounded-full text-lg border-2 border-newyear-red shadow hover:bg-red-50 transition-all"
        >
          查看歷史紀錄
        </button>
      )}
    </div>
  </div>
);

const AnimationScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-10 h-[450px]">
    <div className="text-center relative">
      <div className="relative w-64 h-72 flex flex-col items-center justify-center mb-12">
        <div className="absolute top-[-20px] left-1/2 text-8xl animate-hand-pick z-50 pointer-events-none select-none">
          🤚
        </div>
        <div className="relative w-40 h-48 animate-shake">
          <div className="absolute -top-20 left-0 right-0 flex justify-center items-end space-x-[-10px] z-10">
            <div className="w-3 h-32 bg-yellow-500 border-2 border-amber-800 rounded-full transform -rotate-15 origin-bottom"></div>
            <div className="w-3 h-36 bg-yellow-400 border-2 border-amber-800 rounded-full transform -rotate-6 origin-bottom shadow-lg"></div>
            <div className="w-4 h-44 bg-yellow-300 border-2 border-amber-900 rounded-full transform rotate-3 origin-bottom -translate-y-2 shadow-xl z-20 animate-stick-rise relative">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-8 bg-red-600 rounded-sm"></div>
            </div>
            <div className="w-3 h-36 bg-yellow-400 border-2 border-amber-800 rounded-full transform rotate-12 origin-bottom"></div>
            <div className="w-3 h-32 bg-yellow-500 border-2 border-amber-800 rounded-full transform rotate-20 origin-bottom"></div>
          </div>
          <div className="absolute inset-0 bg-newyear-red border-4 border-newyear-gold rounded-b-3xl rounded-t-lg z-30 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
             <div className="w-24 h-24 border-2 border-newyear-gold rounded-full flex items-center justify-center bg-red-800 shadow-inner">
                <div className="w-20 h-20 border border-newyear-gold rounded-full flex items-center justify-center">
                   <span className="text-newyear-gold font-black text-4xl font-serif">籤</span>
                </div>
             </div>
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] pointer-events-none"></div>
             <div className="mt-2 text-newyear-gold text-[10px] tracking-widest font-bold opacity-80">木酢寵物達人</div>
          </div>
          <div className="absolute top-3 left-3 w-full h-full bg-black rounded-b-3xl rounded-t-lg -z-10 blur-md opacity-30"></div>
        </div>
      </div>
      <div className="space-y-3">
        <h3 className="text-newyear-red text-2xl font-black tracking-[0.3em] animate-pulse">
          神獸感應中...
        </h3>
        <p className="text-newyear-gold font-bold text-lg animate-bounce">正在為您挑選馬年上好靈籤</p>
      </div>
    </div>
  </div>
);

const HistoryScreen: React.FC<{ history: FortuneRecord[], onBack: () => void }> = ({ history, onBack }) => {
  const formatDate = (ts: number) => {
    const d = new Date(ts);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center p-4 w-full animate-draw">
      <div className="bg-cream-bg w-full rounded-2xl shadow-xl border-2 border-newyear-gold overflow-hidden">
        <div className="bg-newyear-red text-white py-4 px-6 flex justify-between items-center">
          <h2 className="text-xl font-black tracking-widest">抽籤紀錄</h2>
          <button onClick={onBack} className="text-white hover:text-newyear-gold transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-4 max-h-[400px] overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <i className="fas fa-history text-4xl mb-2 opacity-20"></i>
              <p>尚無任何求籤紀錄</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...history].reverse().map((record, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-newyear-red font-bold text-sm">{record.title}</span>
                    <span className="text-gray-400 text-[10px]">{formatDate(record.timestamp)}</span>
                  </div>
                  <div className="text-newyear-gold font-black text-md mb-1">{record.award}</div>
                  <div className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                    <span className="font-mono text-gray-500">折扣碼：{record.code}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(record.code)}
                      className="text-newyear-red font-bold hover:underline"
                    >
                      複製
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={onBack}
        className="mt-6 w-full bg-newyear-red text-white font-bold py-3 rounded-full shadow hover:bg-red-700 transition-all"
      >
        返回主畫面
      </button>
    </div>
  );
};

const ResultScreen: React.FC<{ fortune: Fortune, onShowHistory: () => void }> = ({ fortune, onShowHistory }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fortune.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-draw flex flex-col items-center p-4">
      <div className="bg-white w-full rounded-xl shadow-2xl overflow-hidden border-2 border-newyear-gold relative">
        <div className="bg-newyear-red text-white py-4 px-6 text-center">
          <h2 className="text-2xl font-black tracking-widest">{fortune.title}</h2>
        </div>

        <div className="p-6 fortune-paper">
          <div className="mb-8 p-4 border-2 border-newyear-gold bg-red-50 relative">
             <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-newyear-gold text-white text-xs px-2 py-0.5 rounded">
              新春籤詩
            </div>
            <div className="text-center italic text-base font-bold text-newyear-red leading-relaxed whitespace-pre-line">
              {fortune.poem}
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-newyear-gold">
              <h5 className="font-bold text-newyear-red mb-1">【解籤】</h5>
              <p className="text-gray-700 leading-relaxed text-sm">
                {fortune.interpretation}
              </p>
            </div>
          </div>

          <div className="mb-6 bg-yellow-100 p-4 rounded-xl border-2 border-dashed border-newyear-gold">
            <h5 className="text-center font-black text-newyear-red mb-2 text-lg">
              🏮 開運法寶 🏮
            </h5>
            <div className="text-center text-2xl font-black text-red-600 mb-2">
              {fortune.award}
            </div>
            <div className="flex items-center justify-between bg-white p-2 rounded border border-newyear-gold">
              <code className="text-gray-600 font-mono text-sm">{fortune.code}</code>
              <button 
                onClick={handleCopy}
                className={`text-xs px-3 py-1 rounded transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-newyear-gold text-white'}`}
              >
                {copied ? '已複製' : '複製折扣碼'}
              </button>
            </div>
          </div>

          <div className="mb-6 text-sm">
            <h5 className="font-bold text-newyear-red mb-1">💡 木酢推薦：</h5>
            <p className="text-gray-600 italic">
              {fortune.recommendation}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full mt-6 grid grid-cols-2 gap-4">
        <button 
          onClick={() => window.open('https://lihi.cc/apXps', '_blank')}
          className="bg-newyear-gold text-white font-bold py-3 px-4 rounded-full shadow hover:bg-yellow-600 transition-all text-sm flex items-center justify-center"
        >
          <i className="fas fa-shopping-bag mr-2"></i> 立即使用
        </button>
        <button 
          onClick={onShowHistory}
          className="bg-white text-newyear-red border-2 border-newyear-red font-bold py-3 px-4 rounded-full shadow hover:bg-red-50 transition-all text-sm flex items-center justify-center"
        >
          <i className="fas fa-history mr-2"></i> 查看紀錄
        </button>
      </div>

      <p className="mt-6 text-gray-400 text-xs">© 2026 木酢達人 - 祝您馬到成功</p>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [state, setState] = useState<GameState>(GameState.START);
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);
  const [history, setHistory] = useState<FortuneRecord[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fortune_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage when updated
  useEffect(() => {
    localStorage.setItem('fortune_history', JSON.stringify(history));
  }, [history]);

  const hasDrawn = useMemo(() => history.length > 0, [history]);

  const startDraw = useCallback(() => {
    // If user already has a history, directly show the latest result instead of re-drawing
    if (hasDrawn) {
      const lastRecord = history[history.length - 1];
      const fortune = FORTUNES.find(f => f.id === lastRecord.fortuneId) || FORTUNES[0];
      setCurrentFortune(fortune);
      setState(GameState.RESULT);
      return;
    }

    setState(GameState.ANIMATING);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * FORTUNES.length);
      const fortune = FORTUNES[randomIndex];
      
      const newRecord: FortuneRecord = {
        timestamp: Date.now(),
        fortuneId: fortune.id,
        title: fortune.title,
        code: fortune.code,
        award: fortune.award
      };
      
      setHistory([newRecord]); // Enforcement: Replace or set as single record
      setCurrentFortune(fortune);
      setState(GameState.RESULT);
    }, 3000); 
  }, [hasDrawn, history]);

  const resetGame = useCallback(() => {
    setState(GameState.START);
    setCurrentFortune(null);
  }, []);

  return (
    <div className="relative min-h-[600px] flex items-center justify-center">
      <div className="fixed top-4 left-4 text-3xl opacity-20">🧧</div>
      <div className="fixed top-4 right-4 text-3xl opacity-20">🧧</div>
      <div className="fixed bottom-4 left-4 text-3xl opacity-20 rotate-12">🐎</div>
      <div className="fixed bottom-4 right-4 text-3xl opacity-20 -rotate-12">🍊</div>

      <main className="w-full">
        {state === GameState.START && (
          <StartScreen 
            onStart={startDraw} 
            onShowHistory={() => setState(GameState.HISTORY)} 
            hasDrawn={hasDrawn}
          />
        )}

        {state === GameState.ANIMATING && (
          <AnimationScreen />
        )}

        {state === GameState.RESULT && currentFortune && (
          <ResultScreen fortune={currentFortune} onShowHistory={() => setState(GameState.HISTORY)} />
        )}

        {state === GameState.HISTORY && (
          <HistoryScreen 
            history={history} 
            onBack={resetGame} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
