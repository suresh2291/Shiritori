import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowLeft,
  Send,
  Trophy,
  Bot,
  AlertCircle,
  CheckCircle,
  Brain,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import {
  charactersMatch,
  getTargetCharacter,
  isValidJapaneseInput,
  filterJapaneseCharacters,
} from "../utils/japaneseUtils";

import "./HumanVsComputer.css";

const HumanVsComputer = ({ onBack, onGameEnd }) => {
  const { t } = useTranslation();

  const [gameState, setGameState] = useState("setup"); // setup, playing, gameOver

  const [playerName, setPlayerName] = useState("");

  const [currentPlayer, setCurrentPlayer] = useState("human"); // human, computer

  const [currentWord, setCurrentWord] = useState("");

  const [usedWords, setUsedWords] = useState([]);

  const [gameHistory, setGameHistory] = useState([]);

  const [lastWord, setLastWord] = useState("");

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("info");

  const [timer, setTimer] = useState(30);

  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [isComputerThinking, setIsComputerThinking] = useState(false);

  const inputRef = useRef(null);

  const timerRef = useRef(null);

  // Enhanced Japanese words database with categories - wrapped in useMemo to prevent recreation
  const japaneseWords = useMemo(
    () => ({
      あ: [
        "あめ", "あか", "あお", "あたま", "あし", "あさ", "あき", "あつい", "あまい", "あたらしい",
        "あんしん", "あんぜん", "あんない", "あんき", "あんご", "あんざい", "あんてい", "あんぱい", "あんま", "あんゆう"
      ],

      い: [
        "いぬ", "いち", "いえ", "いす", "いし", "いと", "いのち", "いけ", "いりぐち", "いもうと",
        "いっしょ", "いっしょう", "いっしゅん", "いっそう", "いったい", "いってん", "いっぱい", "いっぽう", "いっまい", "いっりゅう"
      ],

      う: [
        "うし", "うま", "うみ", "うた", "うで", "うでわ", "うるさい", "うれしい", "うまい", "うつくしい",
        "うんどう", "うんてん", "うんめい", "うんぱん", "うんゆ", "うんちん", "うんどうかい", "うんどうじょう", "うんどうぶ", "うんどうぐつ"
      ],

      え: [
        "えほん", "えんぴつ", "えき", "えだ", "えん", "えいご", "えいが", "えいゆう", "えいきょう", "えいせい",
        "えいきゅう", "えいきょう", "えいきょうかい", "えいきょうじょ", "えいきょうし", "えいきょうしつ", "えいきょうぶ", "えいきょうり", "えいきょうわ", "えいきょうん"
      ],

      お: [
        "おと", "おか", "おに", "おとこ", "おんな", "おとしより", "おじいさん", "おばあさん", "おとうと", "おねえさん",
        "おおきい", "おおぜい", "おおみず", "おおやま", "おおかみ", "おおくら", "おおさか", "おおとうりょう", "おおどおり", "おおはし"
      ],

      か: [
        "かめ", "かさ", "かみ", "かばん", "かみなり", "かぜ", "かわ", "かみ", "かみ", "かみ",
        "かんがえる", "かんじる", "かんしゃ", "かんどう", "かんぱい", "かんり", "かんせい", "かんりょう", "かんき", "かんご"
      ],

      き: [
        "きつね", "きもち", "きいろ", "きせつ", "きょう", "きのう", "きょうしつ", "きかい", "きもち", "きもち",
        "きょうみ", "きょうし", "きょうしつ", "きょうかしょ", "きょうしつ", "きょうし", "きょうしつ", "きょうかしょ", "きょうしつ", "きょうし"
      ],

      く: [
        "くま", "くも", "くつ", "くち", "くび", "くつした", "くもり", "くろい", "くび", "くび",
        "くうき", "くうこう", "くうしゅう", "くうはく", "くうりょく", "くうかん", "くうしゅう", "くうはく", "くうりょく", "くうかん"
      ],

      け: [
        "けん", "けしき", "けが", "けんきゅう", "けいけん", "けいかく", "けいじ", "けいじ", "けいじ", "けいじ",
        "けいざい", "けいさつ", "けいび", "けいじ", "けいざい", "けいさつ", "けいび", "けいじ", "けいざい", "けいさつ"
      ],

      こ: [
        "こい", "こま", "こども", "ことば", "こころ", "こくご", "こくさい", "こくみん", "こころ", "こころ",
        "こうこう", "こうじょう", "こうつう", "こうえん", "こうじ", "こうえん", "こうつう", "こうえん", "こうじ", "こうえん"
      ],

      さ: [
        "さくら", "さかな", "さくら", "さくら", "さくら", "さくら", "さくら", "さくら", "さくら", "さくら",
        "さくらんぼ", "さくらんぼ", "さくらんぼ", "さくらんぼ", "さくらんぼ", "さくらんぼ", "さくらんぼ", "さくらんぼ", "さくらんぼ", "さくらんぼ"
      ],

      し: [
        "しま", "しんぶん", "しま", "しま", "しま", "しま", "しま", "しま", "しま", "しま",
        "しんせい", "しんせい", "しんせい", "しんせい", "しんせい", "しんせい", "しんせい", "しんせい", "しんせい", "しんせい"
      ],

      す: [
        "すいか", "すいか", "すいか", "すいか", "すいか", "すいか", "すいか", "すいか", "すいか", "すいか",
        "すいえい", "すいえい", "すいえい", "すいえい", "すいえい", "すいえい", "すいえい", "すいえい", "すいえい", "すいえい"
      ],

      せ: [
        "せんせい", "せんせい", "せんせい", "せんせい", "せんせい", "せんせい", "せんせい", "せんせい", "せんせい", "せんせい",
        "せいかつ", "せいかつ", "せいかつ", "せいかつ", "せいかつ", "せいかつ", "せいかつ", "せいかつ", "せいかつ", "せいかつ"
      ],

      そ: [
        "そら", "そら", "そら", "そら", "そら", "そら", "そら", "そら", "そら", "そら",
        "そうじ", "そうじ", "そうじ", "そうじ", "そうじ", "そうじ", "そうじ", "そうじ", "そうじ", "そうじ"
      ],

      た: [
        "たまご", "たまご", "たまご", "たまご", "たまご", "たまご", "たまご", "たまご", "たまご", "たまご",
        "たべもの", "たべもの", "たべもの", "たべもの", "たべもの", "たべもの", "たべもの", "たべもの", "たべもの", "たべもの"
      ],

      ち: [
        "ちょう", "ちょう", "ちょう", "ちょう", "ちょう", "ちょう", "ちょう", "ちょう", "ちょう", "ちょう",
        "ちゅうごく", "ちゅうごく", "ちゅうごく", "ちゅうごく", "ちゅうごく", "ちゅうごく", "ちゅうごく", "ちゅうごく", "ちゅうごく", "ちゅうごく"
      ],

      つ: [
        "つくえ", "つばめ", "つくえ", "つくえ", "つくえ", "つくえ", "つくえ", "つくえ", "つくえ", "つくえ",
        "つづく", "つづく", "つづく", "つづく", "つづく", "つづく", "つづく", "つづく", "つづく", "つづく"
      ],

      て: ["て", "て", "て", "て", "て", "て", "て", "て", "て", "て"],

      と: [
        "とり", "とり", "とり", "とり", "とり", "とり", "とり", "とり", "とり", "とり",
        "とけい", "とけい", "とけい", "とけい", "とけい", "とけい", "とけい", "とけい", "とけい", "とけい"
      ],

      な: [
        "なつ", "なつ", "なつ", "なつ", "なつ", "なつ", "なつ", "なつ", "なつ", "なつ",
        "なつやすみ", "なつやすみ", "なつやすみ", "なつやすみ", "なつやすみ", "なつやすみ", "なつやすみ", "なつやすみ", "なつやすみ", "なつやすみ"
      ],

      に: [
        "にほん", "にほん", "にほん", "にほん", "にほん", "にほん", "にほん", "にほん", "にほん", "にほん",
        "にほんご", "にほんご", "にほんご", "にほんご", "にほんご", "にほんご", "にほんご", "にほんご", "にほんご", "にほんご"
      ],

      ぬ: [
        "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ",
        "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ", "ぬりえ"
      ],

      ね: [
        "ねこ", "ねこ", "ねこ", "ねこ", "ねこ", "ねこ", "ねこ", "ねこ", "ねこ", "ねこ",
        "ねこ", "ねこ", "ねこ", "ねこ", "ねこ", "ねこ", "ねこ", "ねこ", "ねこ", "ねこ"
      ],

      の: [
        "のり", "のり", "のり", "のり", "のり", "のり", "のり", "のり", "のり", "のり",
        "のり", "のり", "のり", "のり", "のり", "のり", "のり", "のり", "のり", "のり"
      ],

      は: [
        "はな", "はな", "はな", "はな", "はな", "はな", "はな", "はな", "はな", "はな",
        "はなび", "はなび", "はなび", "はなび", "はなび", "はなび", "はなび", "はなび", "はなび", "はなび"
      ],

      ひ: [
        "ひこうき", "ひこうき", "ひこうき", "ひこうき", "ひこうき", "ひこうき", "ひこうき", "ひこうき", "ひこうき", "ひこうき",
        "ひこうき", "ひこうき", "ひこうき", "ひこうき", "ひこうき", "ひこうき", "ひこうき", "ひこうき", "ひこうき", "ひこうき"
      ],

      ふ: [
        "ふね", "ふね", "ふね", "ふね", "ふね", "ふね", "ふね", "ふね", "ふね", "ふね",
        "ふね", "ふね", "ふね", "ふね", "ふね", "ふね", "ふね", "ふね", "ふね", "ふね"
      ],

      へ: [
        "へや", "へや", "へや", "へや", "へや", "へや", "へや", "へや", "へや", "へや",
        "へや", "へや", "へや", "へや", "へや", "へや", "へや", "へや", "へや", "へや"
      ],

      ほ: [
        "ほん", "ほん", "ほん", "ほん", "ほん", "ほん", "ほん", "ほん", "ほん", "ほん",
        "ほん", "ほん", "ほん", "ほん", "ほん", "ほん", "ほん", "ほん", "ほん", "ほん"
      ],

      ま: [
        "まくら", "まつり", "まくら", "まくら", "まくら", "まくら", "まくら", "まくら", "まくら", "まくら",
        "まくら", "まくら", "まくら", "まくら", "まくら", "まくら", "まくら", "まくら", "まくら", "まくら"
      ],

      み: [
        "みず", "みず", "みず", "みず", "みず", "みず", "みず", "みず", "みず", "みず",
        "みず", "みず", "みず", "みず", "みず", "みず", "みず", "みず", "みず", "みず"
      ],

      む: [
        "むし", "むし", "むし", "むし", "むし", "むし", "むし", "むし", "むし", "むし",
        "むし", "むし", "むし", "むし", "むし", "むし", "むし", "むし", "むし", "むし"
      ],

      め: [
        "めがね", "めだか", "めがね", "めがね", "めがね", "めがね", "めがね", "めがね", "めがね", "めがね",
        "めがね", "めがね", "めがね", "めがね", "めがね", "めがね", "めがね", "めがね", "めがね", "めがね"
      ],

      も: [
        "もも", "もも", "もも", "もも", "もも", "もも", "もも", "もも", "もも", "もも",
        "もも", "もも", "もも", "もも", "もも", "もも", "もも", "もも", "もも", "もも"
      ],

      や: [
        "やま", "やま", "やま", "やま", "やま", "やま", "やま", "やま", "やま", "やま",
        "やま", "やま", "やま", "やま", "やま", "やま", "やま", "やま", "やま", "やま"
      ],

      ゆ: [
        "ゆき", "ゆき", "ゆき", "ゆき", "ゆき", "ゆき", "ゆき", "ゆき", "ゆき", "ゆき",
        "ゆき", "ゆき", "ゆき", "ゆき", "ゆき", "ゆき", "ゆき", "ゆき", "ゆき", "ゆき"
      ],

      よ: [
        "よる", "よる", "よる", "よる", "よる", "よる", "よる", "よる", "よる", "よる",
        "よる", "よる", "よる", "よる", "よる", "よる", "よる", "よる", "よる", "よる"
      ],

      ら: [
        "らっこ", "らくだ", "らっこ", "らっこ", "らっこ", "らっこ", "らっこ", "らっこ", "らっこ", "らっこ",
        "らっこ", "らっこ", "らっこ", "らっこ", "らっこ", "らっこ", "らっこ", "らっこ", "らっこ", "らっこ"
      ],

      り: [
        "りす", "りんご", "りす", "りす", "りす", "りす", "りす", "りす", "りす", "りす",
        "りす", "りす", "りす", "りす", "りす", "りす", "りす", "りす", "りす", "りす"
      ],

      る: [
        "るす", "るす", "るす", "るす", "るす", "るす", "るす", "るす", "るす", "るす",
        "るす", "るす", "るす", "るす", "るす", "るす", "るす", "るす", "るす", "るす"
      ],

      れ: [
        "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ",
        "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ", "れいぞうこ"
      ],

      ろ: [
        "ろうそく", "ろうそく", "ろうそく", "ろうそく", "ろうそく", "ろうそく", "ろうそく", "ろうそく", "ろうそく", "ろうそく",
        "ろうそく", "ろうそく", "ろうそく", "ろうそく", "ろうそく", "ろうそく", "ろうそく", "ろうそく", "ろうそく", "ろうそく"
      ],

      わ: [
        "わに", "わに", "わに", "わに", "わに", "わに", "わに", "わに", "わに", "わに",
        "わに", "わに", "わに", "わに", "わに", "わに", "わに", "わに", "わに", "わに"
      ],

      を: ["を", "を", "を", "を", "を", "を", "を", "を", "を", "を"],

      ん: [
        "んち", "んち", "んち", "んち", "んち", "んち", "んち", "んち", "んち", "んち",
        "んち", "んち", "んち", "んち", "んち", "んち", "んち", "んち", "んち", "んち"
      ],
    }),
    []
  );

  // Enhanced AI difficulty levels
  const [aiDifficulty, setAiDifficulty] = useState('hard'); // 'easy', 'medium', 'hard', 'expert'

  // Define functions first before using them in useEffect
  const showMessage = useCallback((msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  }, []);

  const handleGameOver = useCallback((winner) => {
    setIsTimerRunning(false);
    setGameState('gameOver');
    
    // Calculate individual scores
    const humanScore = gameHistory.filter(h => h.player === 'human').length;
    const computerScore = gameHistory.filter(h => h.player === 'computer').length;
    
    const result = {
      mode: t('humanVsComputer'),
      result: winner === 'human' ? t('playerVictory', { player: playerName }) : t('computerVictoryMessage'),
      winner: winner === 'human' ? playerName : t('computer'),
      totalWords: usedWords.length,
      humanScore: humanScore,
      computerScore: computerScore,
      playerName: playerName
    };
    
    onGameEnd(result);
  }, [playerName, usedWords.length, onGameEnd, t, gameHistory]);

  // Advanced word selection strategies
  const getComputerWord = useCallback(() => {
    console.log("getComputerWord called with:", {
      lastWord,
      usedWords: usedWords.length,
      difficulty: aiDifficulty,
    });

    if (!lastWord) {
      // First word - choose strategically based on difficulty
      const firstLetters = Object.keys(japaneseWords).filter(
        (letter) => letter !== "ん"
      );

      let selectedLetter;
      
      if (aiDifficulty === 'expert') {
        // Expert: Choose letters that have many long words
        const letterScores = firstLetters.map(letter => ({
          letter,
          score: japaneseWords[letter].filter(word => !word.endsWith("ん")).length * 2 +
                 japaneseWords[letter].filter(word => word.length >= 4).length * 3
        }));
        letterScores.sort((a, b) => b.score - a.score);
        selectedLetter = letterScores[0].letter;
      } else if (aiDifficulty === 'hard') {
        // Hard: Choose letters with many available words
        const letterScores = firstLetters.map(letter => ({
          letter,
          score: japaneseWords[letter].filter(word => !word.endsWith("ん")).length
        }));
        letterScores.sort((a, b) => b.score - a.score);
        selectedLetter = letterScores[Math.floor(Math.random() * Math.min(3, letterScores.length))].letter;
      } else {
        // Easy/Medium: Random selection
        selectedLetter = firstLetters[Math.floor(Math.random() * firstLetters.length)];
      }

      const availableWords = japaneseWords[selectedLetter].filter(
        (word) => !usedWords.includes(word) && !word.endsWith("ん")
      );

      console.log("First word selection:", {
        selectedLetter,
        difficulty: aiDifficulty,
        availableWords: availableWords.length,
      });

      return availableWords.length > 0 ? availableWords[0] : null;
    }

    // Get the last character of the previous word
    const lastChar = lastWord[lastWord.length - 1];
    console.log("Last character of previous word:", lastChar);

    // Use the utility function to get the target character
    const targetChar = getTargetCharacter(lastChar);
    console.log("Target character for next word:", targetChar);

    // Enhanced word finding with multiple strategies
    let availableWords = [];
    let strategyUsed = '';

    // Strategy 1: Direct target character match
    availableWords = japaneseWords[targetChar]?.filter(
      (word) => !usedWords.includes(word) && !word.endsWith("ん")
    ) || [];
    strategyUsed = 'direct';

    // Strategy 2: If no words found, try original character
    if (availableWords.length === 0 && targetChar !== lastChar) {
      availableWords = japaneseWords[lastChar]?.filter(
        (word) => !usedWords.includes(word) && !word.endsWith("ん")
      ) || [];
      strategyUsed = 'fallback';
    }

    // Strategy 3: Find any matching character using advanced matching
    if (availableWords.length === 0) {
      for (const [char, words] of Object.entries(japaneseWords)) {
        if (charactersMatch(lastChar, char)) {
          const matchingWords = words.filter(
            (word) => !usedWords.includes(word) && !word.endsWith("ん")
          );
          if (matchingWords.length > 0) {
            availableWords = matchingWords;
            strategyUsed = 'advanced_matching';
            break;
          }
        }
      }
    }

    // Strategy 4: Desperate search - find any word that could work
    if (availableWords.length === 0 && aiDifficulty === 'expert') {
      for (const [char, words] of Object.entries(japaneseWords)) {
        const potentialWords = words.filter(
          (word) => !usedWords.includes(word) && !word.endsWith("ん")
        );
        if (potentialWords.length > 0) {
          // Check if any word could potentially create a chain
          const validWords = potentialWords.filter(word => {
            // Look ahead: does this word lead to more possibilities?
            const nextChar = word[word.length - 1];
            const nextWords = japaneseWords[nextChar]?.filter(
              w => !usedWords.includes(w) && !w.endsWith("ん")
            ) || [];
            return nextWords.length > 0;
          });
          if (validWords.length > 0) {
            availableWords = validWords;
            strategyUsed = 'desperate_search';
            break;
          }
        }
      }
    }

    console.log("Word finding strategy:", strategyUsed, "Found words:", availableWords.length);

    if (availableWords.length === 0) {
      console.log("No available words found, computer loses");
      return null;
    }

    // Enhanced word selection based on difficulty and strategy
    let selectedWord = null;

    if (aiDifficulty === 'expert') {
      // Expert: Maximum aggression - prefer words that limit human options
      const wordScores = availableWords.map(word => {
        let score = word.length * 2; // Prefer longer words
        
        // Bonus for words ending with characters that have few available words
        const nextChar = word[word.length - 1];
        const nextWords = japaneseWords[nextChar]?.filter(
          w => !usedWords.includes(w) && !w.endsWith("ん")
        ) || [];
        
        if (nextWords.length <= 3) score += 10; // Trap words
        if (nextWords.length <= 1) score += 20; // Dead end words
        
        // Bonus for words that create difficult chains
        if (nextChar === 'ん') score -= 100; // Avoid 'ん' endings
        
        return { word, score };
      });
      
      wordScores.sort((a, b) => b.score - a.score);
      selectedWord = wordScores[0].word;
      
    } else if (aiDifficulty === 'hard') {
      // Hard: Aggressive but not perfect
      const goodWords = availableWords.filter(word => !word.endsWith("ん"));
      const wordsToChooseFrom = goodWords.length > 0 ? goodWords : availableWords;
      
      // Sort by length and add some randomness
      wordsToChooseFrom.sort((a, b) => b.length - a.length);
      
      if (Math.random() < 0.4 && wordsToChooseFrom.length > 1) {
        const randomIndex = Math.floor(Math.random() * Math.min(3, wordsToChooseFrom.length));
        selectedWord = wordsToChooseFrom[randomIndex];
      } else {
        selectedWord = wordsToChooseFrom[0];
      }
      
    } else if (aiDifficulty === 'medium') {
      // Medium: Balanced approach
      const goodWords = availableWords.filter(word => !word.endsWith("ん"));
      const wordsToChooseFrom = goodWords.length > 0 ? goodWords : availableWords;
      
      wordsToChooseFrom.sort((a, b) => b.length - a.length);
      
      if (Math.random() < 0.5 && wordsToChooseFrom.length > 1) {
        const randomIndex = Math.floor(Math.random() * Math.min(5, wordsToChooseFrom.length));
        selectedWord = wordsToChooseFrom[randomIndex];
      } else {
        selectedWord = wordsToChooseFrom[0];
      }
      
    } else {
      // Easy: More random, less strategic
      const randomIndex = Math.floor(Math.random() * availableWords.length);
      selectedWord = availableWords[randomIndex];
    }

    console.log("Selected word:", selectedWord, "Strategy:", strategyUsed, "Difficulty:", aiDifficulty);
    return selectedWord;
  }, [usedWords, lastWord, japaneseWords, aiDifficulty]);

  const handleTimeUp = useCallback(() => {
    console.log("Time up! Human loses");

    handleGameOver("computer");
  }, [handleGameOver]);

  const handleComputerTurn = useCallback(() => {
    console.log("Computer turn started");

    setIsComputerThinking(true);

    // Simulate thinking time

    setTimeout(() => {
      const computerWord = getComputerWord();

      if (!computerWord) {
        console.log("Computer cannot find a word, human wins!");

        handleGameOver("human");

        return;
      }

      console.log("Computer selected word:", computerWord);

      console.log("Computer turn validation:", {
        lastWord: lastWord,

        lastChar: lastWord ? lastWord[lastWord.length - 1] : "none",

        charactersMatch: lastWord
          ? charactersMatch(lastWord[lastWord.length - 1], computerWord[0])
          : "first word",
      });

      // FIXED: Add word only if it's not already in usedWords to prevent duplicates

      if (!usedWords.includes(computerWord)) {
        const newUsedWords = [...usedWords, computerWord];

        setUsedWords(newUsedWords);

        setLastWord(computerWord);

        setGameHistory((prev) => [
          ...prev,
          { player: "computer", word: computerWord, timestamp: new Date() },
        ]);

        console.log(
          "Computer word added successfully. New usedWords length:",
          newUsedWords.length
        );
      } else {
        console.log("Computer word already exists, skipping addition");
      }

      // Switch back to human

      setCurrentPlayer("human");

      setTimer(30);

      setIsTimerRunning(true);

      showMessage(t("playerTurn", { player: playerName }), "info");

      setIsComputerThinking(false);

      // Focus input for human player

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }, [
    playerName,
    getComputerWord,
    handleGameOver,
    showMessage,
    t,
    lastWord,
    usedWords,
  ]);

  // Now the useEffect hooks can use the functions

  useEffect(() => {
    if (isTimerRunning && timer > 0 && currentPlayer === "human") {
      timerRef.current = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && currentPlayer === "human") {
      handleTimeUp();
    }

    return () => clearTimeout(timerRef.current);
  }, [timer, isTimerRunning, currentPlayer, handleTimeUp]);

  useEffect(() => {
    if (currentPlayer === "computer" && !isComputerThinking) {
      handleComputerTurn();
    }
  }, [currentPlayer, isComputerThinking, handleComputerTurn]);

  const startGame = () => {
    if (!playerName.trim()) {
      showMessage(t("enterPlayerName"), "error");

      return;
    }

    setGameState("playing");

    setCurrentPlayer("human");

    setUsedWords([]);

    setGameHistory([]);

    setLastWord("");

    setTimer(30);

    setIsTimerRunning(true);

    setIsComputerThinking(false); // Ensure computer thinking is false initially

    showMessage(t("playerTurn", { player: playerName }), "info");
  };

  const handleSubmitWord = () => {
    const word = currentWord.trim();

    if (!word) {
      showMessage(t("pleaseEnterWord"), "error");

      return;
    }

    // Validate that the word contains only Japanese characters

    if (!isValidJapaneseInput(word)) {
      showMessage(t("onlyJapaneseCharacters"), "error");

      return;
    }

    if (usedWords.includes(word)) {
      showMessage(t("wordAlreadyUsed"), "error");

      return;
    }

    // Enhanced validation for Japanese Shiritori rules

    if (lastWord) {
      const lastChar = lastWord[lastWord.length - 1];

      const firstChar = word[0];

      console.log("Word validation:", {
        lastWord,

        lastChar,

        newWord: word,

        firstChar,

        charactersMatch: charactersMatch(lastChar, firstChar),
      });

      // Use the utility function to check if characters match

      if (!charactersMatch(lastChar, firstChar)) {
        showMessage(t("invalidWordStart", { letter: lastChar }), "error");

        return;
      }
    }

    if (word.endsWith("ん")) {
      handleGameOver("computer");

      return;
    }

    // Valid word - FIXED: Add word only if it's not already in usedWords

    if (!usedWords.includes(word)) {
      const newUsedWords = [...usedWords, word];

      setUsedWords(newUsedWords);

      setLastWord(word);

      setGameHistory((prev) => [
        ...prev,
        { player: "human", word, timestamp: new Date() },
      ]);

      console.log(
        "Human word added successfully. New usedWords length:",
        newUsedWords.length
      );
    } else {
      console.log("Human word already exists, skipping addition");

      return;
    }

    // Switch to computer and ensure computer thinking state is properly set

    setCurrentPlayer("computer");

    setCurrentWord("");

    setTimer(30);

    setIsTimerRunning(false);

    setIsComputerThinking(false); // Explicitly set to false to trigger computer turn

    showMessage(t("computerThinkingMessage"), "info");
  };

  const resetGame = () => {
    setGameState("setup");

    setPlayerName("");

    setCurrentWord("");

    setUsedWords([]);

    setGameHistory([]);

    setLastWord("");

    setMessage("");

    setTimer(30);

    setIsTimerRunning(false);

    setIsComputerThinking(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmitWord();
    }
  };

  if (gameState === "setup") {
    return (
      <motion.div
        className="game-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />

            {t("back")}
          </button>

          <h2>{t("humanVsComputer")}</h2>
        </div>

        <div className="setup-form">
          <div className="ai-intro">
            <Bot size={48} color="#2196F3" />

            <h3>{t("aiOpponent")}</h3>

            <p>{t("aiDescription")}</p>
          </div>

          <div className="player-input">
            <label htmlFor="player">{t("yourName")}</label>

            <input
              id="player"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder={t("enter Player Name")}
              className="player-name-input"
            />
          </div>

          <div className="difficulty-selector">
            <label htmlFor="difficulty">{t("aiDifficulty")}</label>
            <div className="difficulty-options">
              <button
                className={`difficulty-btn ${aiDifficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setAiDifficulty('easy')}
              >
                <Brain size={16} />
                {t("easy")}
              </button>
              <button
                className={`difficulty-btn ${aiDifficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setAiDifficulty('medium')}
              >
                <Brain size={16} />
                {t("medium")}
              </button>
              <button
                className={`difficulty-btn ${aiDifficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setAiDifficulty('hard')}
              >
                <Brain size={16} />
                {t("hard")}
              </button>
              <button
                className={`difficulty-btn ${aiDifficulty === 'expert' ? 'active' : ''}`}
                onClick={() => setAiDifficulty('expert')}
              >
                <Brain size={16} />
                {t("expert")}
              </button>
            </div>
            <p className="difficulty-description">
              {aiDifficulty === 'easy' && t("easyDescription")}
              {aiDifficulty === 'medium' && t("mediumDescription")}
              {aiDifficulty === 'hard' && t("hardDescription")}
              {aiDifficulty === 'expert' && t("expertDescription")}
            </p>
          </div>

          <motion.button
            className="start-game-btn"
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("startGame")}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (gameState === "gameOver") {
    return (
      <motion.div
        className="game-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="game-header">
          <h2>{t("gameOver")}</h2>
        </div>

        <div className="game-over-content">
          <div className="winner-announcement">
            <Trophy size={64} color="#ffd700" />

            <h3>{t("congratulations")}</h3>

            <p className="winner-name">
              {t("winner")}:{" "}
              {gameHistory.length > 0
                ? gameHistory[gameHistory.length - 1].player === "human"
                  ? t("computer")
                  : playerName
                : t("unknown")}
            </p>
          </div>

          <div className="game-stats">
            <h4>{t("gameStats")}</h4>
            <p>
              {t("totalWords")}: {usedWords.length}
            </p>

            <p>
              {t("player")} ({playerName}):{" "}
              {gameHistory.filter((h) => h.player === "human").length}{" "}
              {t("totalWords")}
            </p>
            <p>
              {t("ai")}:{" "}
              {gameHistory.filter((h) => h.player === "computer").length}{" "}
              {t("totalWords")}
            </p>
            <p>Game History Length: {gameHistory.length}</p>
            <p>Used Words Array: {usedWords.join(", ")}</p>
          </div>

          <div className="game-actions">
            <motion.button
              className="play-again-btn"
              onClick={resetGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("playAgain")}
            </motion.button>

            <motion.button
              className="back-to-menu-btn"
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("backToMenu")}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="game-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={20} />

          {t("back")}
        </button>

        <h2>{t("humanVsComputer")}</h2>
        
        <div className="difficulty-indicator">
          <Brain size={16} />
          <span className="difficulty-text">{t(aiDifficulty)}</span>
        </div>
      </div>

      <div className="game-info">
        <div className="player-turn">
          <div
            className={`player ${currentPlayer === "human" ? "active" : ""}`}
          >
            <span className="player-name">{playerName}</span>
            <span className="player-score">
              {gameHistory.filter((h) => h.player === "human").length}
            </span>
          </div>
          <div className="vs">{t("vs")}</div>
          <div
            className={`player ${currentPlayer === "computer" ? "active" : ""}`}
          >
            <span className="player-name">{t("ai")}</span>
            <span className="player-score">
              {gameHistory.filter((h) => h.player === "computer").length}
            </span>
          </div>
        </div>

        <div className="timer">
          <span className="timer-label">{t("timeRemaining")}:</span>
          <span className={`timer-value ${timer <= 10 ? "warning" : ""}`}>
            {formatTime(timer)}
          </span>
        </div>
      </div>

      <div className="game-area">
        <div className="last-word-display">
          {lastWord ? (
            <div className="word-chain">
              <span className="chain-label">{t("previousWord")}:</span>
              <span className="last-word">{lastWord}</span>
              <span className="next-letter">
                → {lastWord[lastWord.length - 1]}
              </span>
            </div>
          ) : (
            <div className="start-message">{t("firstWordMessage")}</div>
          )}
        </div>

        <div className="input-area">
          <div className="current-player">
            {currentPlayer === "human" ? playerName : t("ai")} {t("turn")}
          </div>

          <div className="word-input-container">
            <input
              ref={inputRef}
              type="text"
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("enterWord")}
              className="word-input"
              maxLength={20}
              disabled={currentPlayer !== "human" || isComputerThinking}
            />

            <button
              className="submit-btn"
              onClick={handleSubmitWord}
              disabled={
                currentPlayer !== "human" ||
                isComputerThinking ||
                !currentWord.trim()
              }
            >
              <Send size={20} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              className={`message ${messageType}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {messageType === "error" && <AlertCircle size={20} />}
              {messageType === "success" && <CheckCircle size={20} />}
              {messageType === "info" && <AlertCircle size={20} />}
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* <div className="game-status">
          <div className="used-words">

            <h4>{t('usedWords')}</h4>

            <div className="words-list">

                             {usedWords.map((word, index) => (

                 <motion.span

                   key={`${word}-${index}`}

                   className="word-item"

                   initial={{ opacity: 0, scale: 0.8 }}

                   animate={{ opacity: 1, scale: 1 }}

                   transition={{ duration: 0.3, delay: index * 0.1 }}

                 >

                   {word}

                 </motion.span>

               ))}

            </div>

          </div>

        </div> */}

      {/* <div className="game-history">
          <h4>{t('gameHistory')}</h4>

          <div className="history-list">

            {gameHistory.map((entry, index) => (

              <motion.div

                key={`${entry.player}-${entry.word}-${entry.timestamp.getTime()}`}

                className={`history-item player-${entry.player}`}

                initial={{ opacity: 0, x: -20 }}

                animate={{ opacity: 1, x: 0 }}

                transition={{ duration: 0.3, delay: index * 0.1 }}

              >

                <span className="player-indicator">

                  {entry.player === 'human' ? playerName : (

                    <>

                      <Bot size={16} />

                      {t('ai')}

                    </>

                  )}

                </span>

                <span className="word">{entry.word}</span>

                <span className="timestamp">

                  {entry.timestamp.toLocaleTimeString()}

                </span>

              </motion.div>

            ))}

          </div>

        </div> */}
    </motion.div>
  );
};

export default HumanVsComputer;
