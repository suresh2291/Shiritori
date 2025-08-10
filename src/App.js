import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import GameMode from './components/GameMode';
import HumanVsHuman from './components/HumanVsHuman';
import HumanVsComputer from './components/HumanVsComputer';
import LanguageSwitcher from './components/LanguageSwitcher';
import './App.css';
import './i18n';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();
  const [gameMode, setGameMode] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const [currentGameResult, setCurrentGameResult] = useState(null);

  const handleGameModeSelect = (mode) => {
    setGameMode(mode);
    setShowGameOver(false);
    setCurrentGameResult(null);
  };

  const handleBackToMenu = () => {
    setGameMode(null);
    setShowGameOver(false);
    setCurrentGameResult(null);
  };

  const handleGameEnd = (result) => {
    setGameHistory(prev => [...prev, { ...result, timestamp: new Date() }]);
    setCurrentGameResult(result);
    setShowGameOver(true);
  };

  const handleContinueToMenu = () => {
    // Clear all game-related state in the correct order
    setShowGameOver(false);
    setCurrentGameResult(null);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setGameMode(null);
    }, 100);
  };

  const handlePlayAgain = () => {
    // Reset game state and go back to the same game mode
    setShowGameOver(false);
    setCurrentGameResult(null);
    // Force component re-render by changing the key
    setGameMode(null);
    setTimeout(() => {
      setGameMode(currentGameResult.mode === 'Human vs Human' ? 'human-vs-human' : 'human-vs-computer');
    }, 100);
  };

  return (
    <div className="App">
      <motion.div 
        className="app-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <header className="app-header">
          <div className="header-content">
            <motion.h1 
              className="app-title"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('appTitle')}
            </motion.h1>
            <motion.p 
              className="app-description"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('appSubtitle')}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <LanguageSwitcher />
          </motion.div>
        </header>

        <main className="app-main">
          <AnimatePresence mode="wait">
            {!gameMode ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <GameMode onSelect={handleGameModeSelect} />
              </motion.div>
            ) : gameMode === 'human-vs-human' ? (
              <motion.div
                key={`human-vs-human-${showGameOver ? 'game-over' : 'playing'}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <HumanVsHuman 
                  onBack={handleBackToMenu}
                  onGameEnd={handleGameEnd}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`human-vs-computer-${showGameOver ? 'game-over' : 'playing'}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <HumanVsComputer 
                  onBack={handleBackToMenu}
                  onGameEnd={handleGameEnd}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {showGameOver && currentGameResult && (
          <motion.div
            className="game-over-screen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <div className="game-over-content">
              <div className="winner-announcement">
                <Trophy size={64} color="#ffd700" />
                <h2>{t('gameOver')}</h2>
              </div>
              <div className="game-result">
                <p className="result-text">{currentGameResult.result}</p>
                <p className="result-details">
                  {t('gameMode')}: {currentGameResult.mode}<br/>
                  {t('winner')}: {currentGameResult.winner}<br/>
                  {t('totalWords')}: {currentGameResult.totalWords}
                  {currentGameResult.humanScore !== undefined && currentGameResult.computerScore !== undefined && (
                    <>
                      <br/>{currentGameResult.playerName}: {currentGameResult.humanScore} {t('totalWords')}
                      <br/>{t('ai')}: {currentGameResult.computerScore} {t('totalWords')}
                    </>
                  )}
                  {currentGameResult.player1Score !== undefined && currentGameResult.player2Score !== undefined && (
                    <>
                      <br/>{currentGameResult.player1Name}: {currentGameResult.player1Score} {t('totalWords')}
                      <br/>{currentGameResult.player2Name}: {currentGameResult.player2Score} {t('totalWords')}
                    </>
                  )}
                </p>
              </div>
              <div className="game-over-actions">
                <button 
                  className="play-again-btn"
                  onClick={handlePlayAgain}
                >
                  {t('playAgain')}
                </button>
                <button 
                  className="back-to-menu-btn"
                  onClick={handleContinueToMenu}
                >
                  {t('backToMenu')}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Game History Footer - Commented out as requested
        {gameHistory.length > 0 && (
          <motion.footer 
            className="app-footer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <details className="game-history">
              <summary>{t('gameHistory')}</summary>
              <div className="history-list">
                {gameHistory.slice().reverse().map((game, index) => (
                  <div key={`${game.mode}-${game.result}-${game.timestamp.getTime()}`} className="history-item">
                    <span className="history-mode">{game.mode}</span>
                    <span className="history-result">{game.result}</span>
                    <span className="history-time">
                      {game.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </motion.footer>
        )}
        */}
      </motion.div>
    </div>
  );
}

export default App;
