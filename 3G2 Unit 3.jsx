import { useEffect, useMemo, useRef, useState } from "react";

export default function ChinesePinyinTypingGame() {
  const vocabList = [
    { chinese: "发掘", pinyin: "fajue", tone: "fā jué", meaning: "发现或探索 / explore or discover" },
    { chinese: "真挚", pinyin: "zhenzhi", tone: "zhēn zhì", meaning: "真诚 / sincere" },
    { chinese: "名额", pinyin: "minge", tone: "míng é", meaning: "规定的人数 / quota" },
    { chinese: "链接", pinyin: "lianjie", tone: "liàn jiē", meaning: "连接的通道 / hyperlink" },
    { chinese: "师傅", pinyin: "shifu", tone: "shī fu", meaning: "技艺高的人 / teacher or master" },
    { chinese: "裁缝", pinyin: "caifeng", tone: "cái féng", meaning: "做衣服的人 / tailor" },
    { chinese: "编织", pinyin: "bianzhi", tone: "biān zhī", meaning: "用线制作 / weave or plait" },
    { chinese: "匠人", pinyin: "jiangren", tone: "jiàng rén", meaning: "手艺人 / craftsman" },
    { chinese: "烘焙", pinyin: "hongbei", tone: "hōng bèi", meaning: "用火烤制 / bake" },
    { chinese: "讲述", pinyin: "jiangshu", tone: "jiǎng shù", meaning: "说出事情 / talk about" },
    { chinese: "黎明", pinyin: "liming", tone: "lí míng", meaning: "天刚亮的时候 / sunrise" },
    { chinese: "宵夜", pinyin: "xiaoye", tone: "xiāo yè", meaning: "晚上吃的食物 / supper" },
    { chinese: "窍门", pinyin: "qiaomen", tone: "qiào mén", meaning: "小技巧 / tips" },
    { chinese: "社区", pinyin: "shequ", tone: "shè qū", meaning: "居住区域 / community" },
    { chinese: "行业", pinyin: "hangye", tone: "háng yè", meaning: "工作领域 / industry" },
    { chinese: "鲜为人知", pinyin: "xianweirenzhi", tone: "xiǎn wéi rén zhī", meaning: "很少人知道 / rarely known" },
    { chinese: "援手", pinyin: "yuanshou", tone: "yuán shǒu", meaning: "给予帮助 / helping hand" },
    { chinese: "侥幸", pinyin: "jiaoxing", tone: "jiǎo xìng", meaning: "靠运气成功 / get lucky" },
    { chinese: "慷慨解囊", pinyin: "kangkaijienang", tone: "kāng kǎi jiě náng", meaning: "大方帮助别人 / contribute generously" },
    { chinese: "度过", pinyin: "duguo", tone: "dù guò", meaning: "经历时间 / pass" },
    { chinese: "雪中送炭", pinyin: "xuezhongsongtan", tone: "xuě zhōng sòng tàn", meaning: "在困难时帮助 / help in need" },
    { chinese: "冷漠", pinyin: "lengmo", tone: "lěng mò", meaning: "没有感情 / cold or unconcerned" },
    { chinese: "挑剔", pinyin: "tiaoti", tone: "tiāo tī", meaning: "要求过高 / picky" },
    { chinese: "营造", pinyin: "yingzao", tone: "yíng zào", meaning: "创造环境 / create" },
    { chinese: "计较", pinyin: "jijiao", tone: "jì jiào", meaning: "为小事争论 / be petty and argue" }
      ,{ chinese: "和睦", pinyin: "hemu", tone: "hé mù", meaning: "关系融洽 / harmony" },
    { chinese: "走廊", pinyin: "zoulang", tone: "zǒu láng", meaning: "连接房间的通道 / corridor" }
  ];

  const [gameMode, setGameMode] = useState("learn");
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("点击“开始游戏”，输入正确的汉语拼音。");
  const [wrongCount, setWrongCount] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finalTime, setFinalTime] = useState(null);
  const inputRef = useRef(null);

  const shuffledList = useMemo(() => {
    const arr = [...vocabList];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }, [started, gameMode]);

  const currentWord = shuffledList[questionIndex];

  useEffect(() => {
    const saved = Number(localStorage.getItem("sec2-chinese-pinyin-best") || 0);
    setBestScore(saved);
  }, []);

  

  useEffect(() => {
    if (!started) {
      return undefined;
    }

    const elapsedTimer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(elapsedTimer);
  }, [started]);

  

  const startGame = () => {
    setStarted(true);
    setScore(0);
    setQuestionIndex(0);
    setInput("");
    setWrongCount(0);
    setCompleted([]);
    setElapsedTime(0);
    setFinalTime(null);
    
    setMessage("开始吧！每个词语都会出现一次，请完成全部题目并记录总用时。");
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const nextQuestion = () => {
    setQuestionIndex((prev) => prev + 1);
    setInput("");
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  };

  const accuracyState = useMemo(() => {
    if (!input) return "";
    return currentWord.pinyin.startsWith(input.toLowerCase()) ? "good" : "bad";
  }, [input, currentWord]);

  const handleSubmit = () => {
    if (!started) return;

    const normalized = input.trim().toLowerCase();
    const answer = currentWord.pinyin.toLowerCase();

    if (normalized === answer) {
      const newScore = score + 1;
      const newCompleted = [...completed, currentWord.chinese];

      setScore(newScore);
      setCompleted(newCompleted);
      setMessage(`答对了！${currentWord.chinese} → ${currentWord.pinyin}`);

      if (questionIndex === shuffledList.length - 1) {
        setStarted(false);
        setFinalTime(newScore > 0 ? elapsedTime : 0);
        setMessage(`太棒了！你已完成全部词语练习。你用了 ${elapsedTime} 秒。`);
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem("sec2-chinese-pinyin-best", String(newScore));
        }
        return;
      }

      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem("sec2-chinese-pinyin-best", String(newScore));
      }

      nextQuestion();
    } else {
      setWrongCount((prev) => prev + 1);
      setMessage(`再试一次。提示：${currentWord.chinese} 的拼音共有 ${currentWord.pinyin.length} 个字母。`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const progress = (completed.length / vocabList.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-orange-100">
        <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-8">
          <h1 className="text-3xl sm:text-4xl font-bold">中二华文拼音打字游戏</h1>
          <p className="mt-2 text-white/90 text-base sm:text-lg">
            Secondary 2 G2 华文词语练习 · 用打字游戏快乐学习汉语拼音
          </p>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setGameMode("learn")}
                className={`px-4 py-3 rounded-2xl font-medium transition ${
                  gameMode === "learn" ? "bg-red-600 text-white shadow-lg" : "bg-red-50 text-red-700"
                }`}
              >
                学习模式
              </button>
              
              <button
                onClick={startGame}
                className="px-5 py-3 rounded-2xl bg-slate-800 text-white font-semibold hover:scale-105 transition"
              >
                {started ? "重新开始" : "开始游戏"}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="bg-red-50 rounded-2xl p-4">
                <div className="text-sm text-red-600">得分</div>
                <div className="text-2xl font-bold text-slate-800">{score}</div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4">
                <div className="text-sm text-orange-600">最高分</div>
                <div className="text-2xl font-bold text-slate-800">{bestScore}</div>
              </div>
              <div className="bg-sky-50 rounded-2xl p-4">
                <div className="text-sm text-sky-600">错误次数</div>
                <div className="text-2xl font-bold text-slate-800">{wrongCount}</div>
              </div>
              <div className="bg-emerald-50 rounded-2xl p-4">
                <div className="text-sm text-emerald-600">
                  完成词语
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {`${completed.length}/${vocabList.length}`}
                </div>
              </div>
              <div className="bg-violet-50 rounded-2xl p-4">
                <div className="text-sm text-violet-600">已用时间</div>
                <div className="text-2xl font-bold text-slate-800">
                  {started ? `${elapsedTime}s` : finalTime !== null ? `${finalTime}s` : "0s"}
                </div>
              </div>
            </div>

            <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-400 transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
              />
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 text-white rounded-3xl p-8 text-center shadow-lg">
              <div className="text-sm tracking-widest text-slate-300 mb-3">词语</div>
              <div className="text-5xl sm:text-6xl font-bold mb-4">{currentWord.chinese}</div>
              <div className="text-base sm:text-lg text-slate-200">意思：{currentWord.meaning}</div>
            </div>

            <div className="space-y-3">
              <label className="block text-lg font-semibold text-slate-700">请输入汉语拼音（不必输入声调）</label>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, "").toLowerCase())}
                onKeyDown={handleKeyDown}
                placeholder="例如：jihua"
                disabled={!started}
                className={`w-full rounded-2xl border-2 px-5 py-4 text-xl outline-none transition ${
                  accuracyState === "good"
                    ? "border-emerald-400 bg-emerald-50"
                    : accuracyState === "bad"
                    ? "border-red-400 bg-red-50"
                    : "border-slate-200"
                } ${!started ? "opacity-60 cursor-not-allowed" : ""}`}
              />

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={!started}
                  className="px-5 py-3 rounded-2xl bg-red-600 text-white font-semibold disabled:opacity-50"
                >
                  提交答案
                </button>
                <button
                  onClick={() => setMessage(`提示：${currentWord.chinese} → ${currentWord.pinyin}`)}
                  disabled={!started}
                  className="px-5 py-3 rounded-2xl bg-amber-100 text-amber-800 font-semibold disabled:opacity-50"
                >
                  查看提示
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={!started}
                  className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-700 font-semibold disabled:opacity-50"
                >
                  跳过
                </button>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="text-sm text-slate-500 mb-2">学习提示</div>
              <div className="text-lg text-slate-700 whitespace-pre-line">{message}</div>
              {!started && finalTime !== null && (
                <div className="mt-3 text-base font-semibold text-violet-700">
                  本次完成时间：{finalTime} 秒
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-orange-50 rounded-3xl p-5 border border-orange-100">
              <h2 className="text-xl font-bold text-orange-800 mb-3">游戏目标</h2>
              <ul className="space-y-2 text-slate-700 text-sm leading-6 list-disc pl-5">
                <li>认识中二课文重点词语。</li>
                <li>练习正确输入汉语拼音。</li>
                <li>完成全部词语，并计算总用时。</li>
                <li>把词语、拼音和意思联系起来。</li>
              </ul>
            </div>

            <div className="bg-sky-50 rounded-3xl p-5 border border-sky-100">
              <h2 className="text-xl font-bold text-sky-800 mb-3">词语表</h2>
              <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
                {vocabList.map((item, index) => (
                  <div
                    key={item.chinese}
                    className={`rounded-2xl p-3 border ${
                      completed.includes(item.chinese)
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="font-bold text-slate-800">{index + 1}. {item.chinese}</div>
                    <div className="text-sm text-slate-400">{item.tone}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
