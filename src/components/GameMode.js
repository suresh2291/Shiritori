import React from 'react';
import { motion } from 'framer-motion';
import { Users, Bot, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './GameMode.css';

const GameMode = ({ onSelect }) => {
  const { t } = useTranslation();
  
  const gameModes = [
    {
      id: 'human-vs-human',
      title: t('humanVsHuman'),
      subtitle: t('humanVsHuman'),
      description: t('humanVsHumanDesc'),
      icon: Users,
      color: '#4CAF50',
      delay: 0.1
    },
    {
      id: 'human-vs-computer',
      title: t('humanVsComputer'),
      subtitle: t('humanVsComputer'),
      description: t('humanVsComputerDesc'),
      icon: Bot,
      color: '#2196F3',
      delay: 0.2
    }
  ];

  return (
    <div className="game-mode-container">
      <motion.h2 
        className="mode-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {t('selectGameMode')}
        <span className="mode-subtitle">{t('selectGameMode')}</span>
      </motion.h2>
      
      <div className="mode-options">
        {gameModes.map((mode) => {
          const IconComponent = mode.icon;
          return (
            <motion.div
              key={mode.id}
              className="mode-option"
              style={{ '--accent-color': mode.color }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: mode.delay }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="mode-icon">
                <IconComponent size={48} color={mode.color} />
              </div>
              <div className="mode-content">
                <h3 className="mode-name">{mode.title}</h3>
                <p className="mode-english">{mode.subtitle}</p>
                <p className="mode-description">{mode.description}</p>
              </div>
              <motion.button
                className="mode-select-btn"
                onClick={() => onSelect(mode.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Play size={20} />
                {t('startGame')}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className="game-rules"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h3>{t('gameRules')}</h3>
        <div className="rules-content">
          <div className="rule-item">
            <span className="rule-number">1</span>
            <p>{t('rule1')}</p>
          </div>
          <div className="rule-item">
            <span className="rule-number">2</span>
            <p>{t('rule2')}</p>
          </div>
          <div className="rule-item">
            <span className="rule-number">3</span>
            <p>{t('rule3')}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameMode;
