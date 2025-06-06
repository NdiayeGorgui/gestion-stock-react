import React, { useEffect, useState } from 'react';
import './Settings.css';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },

];

const fontSizes = ['small', 'medium', 'large'];

export default function Settings() {
  const { t, i18n } = useTranslation();
  const [darkTheme, setDarkTheme] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'dark';
    const savedLang = localStorage.getItem('language') || 'en';
    const savedFont = localStorage.getItem('fontSize') || 'medium';
    const savedNotif = localStorage.getItem('notifications') !== 'false';

    setDarkTheme(savedTheme);
    setLanguage(savedLang);
    setFontSize(savedFont);
    setNotifications(savedNotif);

    document.body.className = `${savedTheme ? 'dark' : 'light'} ${savedFont}-font`;
    i18n.changeLanguage(savedLang); // ✅ Applique la langue au chargement
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkTheme;
    setDarkTheme(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.body.classList.toggle('dark', newTheme);
    document.body.classList.toggle('light', !newTheme);
  };

  const handleFontSizeChange = (value) => {
    setFontSize(value);
    localStorage.setItem('fontSize', value);
    document.body.classList.remove('small-font', 'medium-font', 'large-font');
    document.body.classList.add(`${value}-font`);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    i18n.changeLanguage(newLang); // ✅ Changement de langue ici
  };

  const resetSettings = () => {
    setDarkTheme(false);
    setNotifications(true);
    setLanguage('en');
    setFontSize('medium');
    localStorage.clear();
    document.body.className = 'light medium-font';
    i18n.changeLanguage('en'); // ✅ Réinitialise la langue
  };

  return (
    <div className="settings-page">
      <h2>⚙️ {t('settings')}</h2>

      <div className="setting-item">
        <label>
          <input type="checkbox" checked={darkTheme} onChange={toggleTheme} />
          {t('dark_mode')}
        </label>
      </div>

      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => {
              setNotifications(e.target.checked);
              localStorage.setItem('notifications', e.target.checked);
            }}
          />
          {t('enable_notifications')}
        </label>
      </div>

      <div className="setting-item">
        <label>{t('language')}:</label>
        <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="setting-item">
        <label>{t('font_size')}:</label>
        <select value={fontSize} onChange={(e) => handleFontSizeChange(e.target.value)}>
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <button className="reset-button" onClick={resetSettings}>
        {t('reset')}
      </button>
    </div>
  );
}
