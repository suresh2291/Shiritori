import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-toggle-container">
      <div className="segmented-control">
        <button
          className={`segment ${i18n.language === 'en' ? 'active' : ''}`}
          onClick={() => changeLanguage('en')}
        >
          {t('enLabel')}
        </button>
        <button
          className={`segment ${i18n.language === 'ja' ? 'active' : ''}`}
          onClick={() => changeLanguage('ja')}
        >
          {t('jaLabel')}
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
