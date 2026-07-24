interface LanguageSwitchProps {
  language: 'english' | 'hinglish';
  onToggle: () => void;
}

export function LanguageSwitch({ language, onToggle }: LanguageSwitchProps) {
  const isHinglish = language === 'hinglish';

  return (
    <div className="switch-button">
      <div className="switch-outer" onClick={onToggle}>
        <input
          type="checkbox"
          checked={isHinglish}
          readOnly
          aria-label={`Switch to ${isHinglish ? 'English' : 'Hinglish'}`}
        />
        <div className="button">
          <div
            className="button-toggle"
            style={{ left: isHinglish ? '58%' : '0' }}
          />
          <div
            className={`button-indicator ${isHinglish ? 'is-hinglish' : ''}`}
            style={{
              borderColor: isHinglish ? '#60d480' : '#ef565f',
              left: isHinglish ? '-68%' : '10px',
              opacity: 1,
            }}
          />
        </div>
      </div>

      <style>{`
        .switch-button {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
          height: 40px;
        }
        .switch-button .switch-outer {
          height: 100%;
          background: #252532;
          width: 90px;
          border-radius: 165px;
          box-shadow: inset 0px 5px 10px 0px #16151c, 0px 3px 6px -2px #403f4e;
          border: 1px solid #32303e;
          padding: 4px;
          box-sizing: border-box;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .switch-button .switch-outer input[type="checkbox"] {
          opacity: 0;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          position: absolute;
        }
        .switch-button .switch-outer .button-toggle {
          height: 32px;
          width: 32px;
          background: linear-gradient(#3b3a4e, #272733);
          border-radius: 100%;
          box-shadow: inset 0px 5px 4px 0px #424151, 0px 4px 15px 0px #0f0e17;
          position: relative;
          z-index: 2;
          transition: left 0.3s ease-in;
        }
        .switch-button .switch-outer .button {
          width: 100%;
          height: 100%;
          display: flex;
          position: relative;
          justify-content: space-between;
        }
        .switch-button .switch-outer .button-indicator {
          height: 20px;
          width: 20px;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 50%;
          border: 3px solid #ef565f;
          box-sizing: border-box;
          position: relative;
          transition: border-color 0.3s ease-in, left 0.3s ease-in;
        }
      `}</style>
    </div>
  );
}
