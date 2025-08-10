import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Trophy, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { charactersMatch, isValidJapaneseInput, filterJapaneseCharacters } from '../utils/japaneseUtils';
import './HumanVsHuman.css';

const HumanVsHuman = ({ onBack, onGameEnd }) => {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState('setup'); // setup, playing, gameOver
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [currentWord, setCurrentWord] = useState('');
  const [usedWords, setUsedWords] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [lastWord, setLastWord] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [timer, setTimer] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Japanese words database for validation (currently unused but kept for future validation features)
  // const japaneseWords = [
  //   'りんご', 'ごりら', 'らくだ', 'だいこん', 'こんにゃく', 'くま', 'まくら', 'らっこ', 'こま', 'まつり',
  //   'りす', 'すいか', 'かめ', 'めだか', 'かさ', 'さくら', 'らん', 'んち', 'ちょう', 'うま',
  //   'まんが', 'がっこう', 'うし', 'しま', 'まつ', 'つくえ', 'えんぴつ', 'つばめ', 'めがね', 'ねこ',
  //   'こい', 'いぬ', 'ぬりえ', 'えほん', 'ほん', 'んじ', 'じかん', 'かんじ', 'じしん', 'しんぶん',
  //   'ぶん', 'んどう', 'どうぶつ', 'つり', 'りゆう', 'ゆうびん', 'びん', 'んか', 'かみ', 'みず',
  //   'ずかん', 'かん', 'んか', 'かみ', 'みず', 'ずかん', 'かん', 'んか', 'かみ', 'みず'
  // ];

  // Define functions first before using them in useEffect
  const showMessage = useCallback((msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  }, []);

  const handleGameOver = useCallback((winnerName) => {
    setIsTimerRunning(false);
    setGameState('gameOver');
    
    // Calculate individual scores for human vs human game
    const player1Score = gameHistory.filter(h => h.player === 1).length;
    const player2Score = gameHistory.filter(h => h.player === 2).length;
    
    const result = {
      mode: t('humanVsHuman'),
      result: t('playerVictory', { player: winnerName }),
      winner: winnerName,
      totalWords: usedWords.length,
      player1Score: player1Score,
      player2Score: player2Score,
      player1Name: player1Name,
      player2Name: player2Name
    };
    
    onGameEnd(result);
  }, [usedWords.length, onGameEnd, t, gameHistory, player1Name, player2Name]);

  const handleTimeUp = useCallback(() => {
    const currentPlayerName = currentPlayer === 1 ? player1Name : player2Name;
    const winnerName = currentPlayer === 1 ? player2Name : player1Name;
    showMessage(t('timeUpPlayerVictory', { player: currentPlayerName, winner: winnerName }), 'error');
    handleGameOver(winnerName);
  }, [currentPlayer, player1Name, player2Name, showMessage, handleGameOver, t]);

  // Now the useEffect hook can use the functions
  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timerRef.current);
  }, [timer, isTimerRunning, handleTimeUp]);

  const startGame = () => {
    if (!player1Name.trim() || !player2Name.trim()) {
      showMessage(t('enter Both Player Names'), 'error');
      return;
    }

    setGameState('playing');
    setCurrentPlayer(1);
    setUsedWords([]);
    setGameHistory([]);
    setLastWord('');
    setTimer(30);
    setIsTimerRunning(true);
    showMessage(t('playerTurn', { player: player1Name }), 'info');
  };

  const handleSubmitWord = () => {
    const word = currentWord.trim();
    
    if (!word) {
      showMessage(t('please Enter Word'), 'error');
      return;
    }

    // Validate that the word contains only Japanese characters
    if (!isValidJapaneseInput(word)) {
      showMessage(t('onlyJapaneseCharacters'), 'error');
      return;
    }

    if (usedWords.includes(word)) {
      showMessage(t('wordAlreadyUsed'), 'error');
      return;
    }

    // Enhanced validation for Japanese Shiritori rules
    if (lastWord) {
      const lastChar = lastWord[lastWord.length - 1];
      const firstChar = word[0];
      
      // Use the utility function to check if characters match
      if (!charactersMatch(lastChar, firstChar)) {
        showMessage(t('invalidWordStart', { letter: lastChar }), 'error');
        return;
      }
    }

    if (word.endsWith('ん')) {
      handleGameOver(currentPlayer === 1 ? player2Name : player1Name);
      return;
    }

    // Valid word
    const newUsedWords = [...usedWords, word];
    setUsedWords(newUsedWords);
    setLastWord(word);
    setGameHistory(prev => [...prev, { player: currentPlayer, word, timestamp: new Date() }]);
    
    // Switch players
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(nextPlayer);
    setCurrentWord('');
    setTimer(30);
    
    const nextPlayerName = nextPlayer === 1 ? player1Name : player2Name;
    
    showMessage(t('playerTurn', { player: nextPlayerName }), 'info');
    
    // Focus input for next player
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const resetGame = () => {
    setGameState('setup');
    setPlayer1Name('');
    setPlayer2Name('');
    setCurrentWord('');
    setUsedWords([]);
    setGameHistory([]);
    setLastWord('');
    setMessage('');
    setTimer(30);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameState === 'setup') {
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
            {t('back')}
          </button>
          <h2>{t('humanVsHuman')}</h2>
        </div>

        <div className="setup-form">
          <div className="player-input">
            <label htmlFor="player1">{t('player1Name')}</label>
            <input
              id="player1"
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              placeholder={t('enter Player1 Name')}
              className="player-name-input"
            />
          </div>
          
          <div className="player-input">
            <label htmlFor="player2">{t('player2Name')}</label>
            <input
              id="player2"
              type="text"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              placeholder={t('enter Player2 Name')}
              className="player-name-input"
            />
          </div>

          <motion.button
            className="start-game-btn"
            onClick={startGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('startGame')}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <motion.div 
        className="game-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="game-header">
          <h2>{t('gameOver')}</h2>
        </div>

        <div className="game-over-content">
          <div className="winner-announcement">
            <Trophy size={64} color="#ffd700" />
            <h3>{t('congratulations')}</h3>
            <p className="winner-name">{t('winner')}: {gameHistory.length > 0 ? (gameHistory[gameHistory.length - 1].player === 1 ? player2Name : player1Name) : t('unknown')}</p>
          </div>

          <div className="game-stats">
            <h4>{t('gameStats')}</h4>
            <p>{t('totalWords')}: {usedWords.length}</p>
            <p>{t('player1')} ({player1Name}): {gameHistory.filter(h => h.player === 1).length} {t('totalWords')}</p>
            <p>{t('player2')} ({player2Name}): {gameHistory.filter(h => h.player === 2).length} {t('totalWords')}</p>
          </div>

          <div className="game-actions">
            <button className="play-again-btn" onClick={resetGame}>
              {t('playAgain')}
            </button>
            <button className="back-to-menu-btn" onClick={onBack}>
              {t('backToMenu')}
            </button>
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
          {t('back')}
        </button>
        <h2>{t('humanVsHuman')}</h2>
      </div>

      <div className="game-info">
        <div className="player-turn">
          <div className={`player ${currentPlayer === 1 ? 'active' : ''}`}>
            <span className="player-name">{player1Name}</span>
            <span className="player-score">{gameHistory.filter(h => h.player === 1).length}</span>
          </div>
          <div className="vs">{t('vs')}</div>
          <div className={`player ${currentPlayer === 2 ? 'active' : ''}`}>
            <span className="player-name">{player2Name}</span>
            <span className="player-score">{gameHistory.filter(h => h.player === 2).length}</span>
          </div>
        </div>

        <div className="timer">
          <span className="timer-label">{t('timeRemaining')}:</span>
          <span className={`timer-value ${timer <= 10 ? 'warning' : ''}`}>
            {formatTime(timer)}
          </span>
        </div>
      </div>

      <div className="game-area">
        <div className="last-word-display">
          {lastWord ? (
            <div className="word-chain">
              <span className="chain-label">{t('previousWord')}:</span>
              <span className="last-word">{lastWord}</span>
              <span className="next-letter">→ {lastWord[lastWord.length - 1]}</span>
            </div>
          ) : (
            <div className="start-message">
              {t('firstWordMessage')}
            </div>
          )}
        </div>

        <div className="input-area">
          <div className="current-player">
            {currentPlayer === 1 ? player1Name : player2Name} {t('turn')}
          </div>
          <div className="word-input-container">
            <input
              ref={inputRef}
              type="text"
              value={currentWord}
              onChange={(e) => setCurrentWord(filterJapaneseCharacters(e.target.value))}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitWord()}
              placeholder={t('enterWord')}
              className="word-input"
              maxLength={20}
            />
            <button 
              className="submit-btn"
              onClick={handleSubmitWord}
              disabled={!currentWord.trim()}
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
              {messageType === 'error' && <AlertCircle size={20} />}
              {messageType === 'success' && <CheckCircle size={20} />}
              {messageType === 'info' && <AlertCircle size={20} />}
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Game History - Commented out as requested
      <div className="game-history">
        <h4>{t('gameHistory')}</h4>
        <div className="history-list">
          {gameHistory.slice().reverse().map((entry, index) => (
            <motion.div
              key={`${entry.player}-${entry.word}-${entry.timestamp.getTime()}`}
              className={`history-item player-${entry.player}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <span className="player-indicator">
                {entry.player === 1 ? player1Name : player2Name}
              </span>
              <span className="word">{entry.word}</span>
              <span className="timestamp">
                {entry.timestamp.toLocaleTimeString()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
      */}
    </motion.div>
  );
};

export default HumanVsHuman;
