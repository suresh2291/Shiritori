import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English translations
const en = {
  translation: {
    // App title and navigation
    appTitle: 'Shiritori Game',
    appSubtitle: 'Beautiful Japanese Word Game',
    back: 'Back',
    menu: 'Menu',
    
    // Game modes
    selectGameMode: 'Select Game Mode',
    humanVsHuman: 'Human vs Human',
    humanVsComputer: 'Human vs Computer',
    humanVsComputerDesc: 'Play against an AI opponent',
    humanVsHumanDesc: 'Play with a friend',
    gameMode: 'Game Mode',
    enLabel: 'EN',
    jaLabel: '日本語',
    
    // Setup and game start
    enterPlayerNames: 'Enter Player Names',
    player1Name: 'Player 1 Name',
    player2Name: 'Player 2 Name',
    yourName: 'Your Name',
    startGame: 'Start Game',
    gameStart: 'Game Start',
    
    // Game interface
    currentPlayer: 'Current Player',
    turn: 'Turn',
    timeRemaining: 'Time Remaining',
    previousWord: 'Previous Word',
    enterWord: 'Enter Word',
    submit: 'Submit',
    nextLetter: 'Next Letter',
    firstWordMessage: 'Enter the first word',
    
    // Game messages
    enterWordMessage: 'Please enter a word',
    wordAlreadyUsed: 'That word has already been used',
    invalidWordStart: 'Word must start with "{{letter}}"',
    wordEndsWithN: 'Game Over! Words ending with "ん" are not allowed',
    timeUp: 'Time\'s up!',
    computerThinking: 'Computer is thinking...',
    computerVictory: 'Computer wins!',
    humanVictory: '{{player}} wins!',
    
    // Game over
    gameOver: 'Game Over',
    congratulations: 'Congratulations!',
    winner: 'Winner',
    gameStats: 'Game Statistics',
    totalWords: 'Total Words',
    playAgain: 'Play Again',
    backToMenu: 'Back to Menu',
    
    // AI opponent
    aiOpponent: 'AI Opponent',
    aiDescription: 'Challenge an advanced AI that has learned Japanese vocabulary!',
    aiThinking: 'AI is thinking...',
    aiStatus: 'AI is thinking of a word...',
    
    // AI difficulty levels
    aiDifficulty: 'AI Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',
    easyDescription: 'AI makes random moves, good for beginners',
    mediumDescription: 'AI uses basic strategy, balanced gameplay',
    hardDescription: 'AI is aggressive and strategic, challenging',
    expertDescription: 'AI uses advanced tactics to trap players',
    
    // Game history
    gameHistory: 'Game History',
    
    // Validation messages
    pleaseEnterName: 'Please enter a name',
    pleaseEnterWord: 'Please enter a word',
    onlyJapaneseCharacters: 'Only Hiragana and Katakana characters are allowed',
    
    // Timer
    timeUpMessage: '{{player}}\'s time is up! Computer wins!',
    
    // Player indicators
    player1: 'Player 1',
    player2: 'Player 2',
    computer: 'Computer',
    ai: 'AI',
    
    // Victory messages
    playerVictory: '{{player}} wins!',
    computerVictoryMessage: 'Computer wins!',
    timeUpPlayerVictory: '{{player}}\'s time is up! {{winner}} wins!',
    
    // Turn messages
    playerTurn: '{{player}}\'s turn!',
    computerThinkingMessage: 'Computer is thinking...',
    
    // Game elements
    vs: 'VS',
    unknown: 'Unknown',
    
    // Game rules
    gameRules: 'Game Rules',
    rule1: 'Say a word that starts with the last letter of the previous word',
    rule2: 'You cannot use words that have already been used',
    rule3: 'The person who says a word ending with "ん" loses'
  }
};

// Japanese translations
const ja = {
  translation: {
    // App title and navigation
    appTitle: 'しりとりゲーム',
    appSubtitle: '美しい日本語の単語ゲーム',
    back: '戻る',
    menu: 'メニュー',
    
    // Game modes
    selectGameMode: 'ゲームモードを選択',
    humanVsHuman: '人間 vs 人間',
    humanVsComputer: '人間 vs コンピューター',
    humanVsComputerDesc: 'AI対戦相手と対戦しましょう',
    humanVsHumanDesc: '友達と一緒に遊びましょう',
    gameMode: 'ゲームモード',
    enLabel: 'EN',
    jaLabel: '日本語',
    
    // Setup and game start
    enterPlayerNames: 'プレイヤー名を入力',
    player1Name: 'プレイヤー1の名前',
    player2Name: 'プレイヤー2の名前',
    yourName: 'あなたの名前',
    startGame: 'ゲーム開始',
    gameStart: 'ゲーム開始',
    
    // Game interface
    currentPlayer: '現在のプレイヤー',
    turn: '番',
    timeRemaining: '残り時間',
    previousWord: '前の単語',
    enterWord: '単語を入力',
    submit: '送信',
    nextLetter: '次の文字',
    firstWordMessage: '最初の単語を入力してください',
    
    // Game messages
    enterWordMessage: '単語を入力してください',
    wordAlreadyUsed: 'その単語は既に使われています',
    invalidWordStart: '「{{letter}}」で始まる単語を入力してください',
    wordEndsWithN: 'ゲーム終了！「ん」で終わる単語は使えません',
    timeUp: '時間切れ！',
    computerThinking: 'コンピューターが考え中...',
    computerVictory: 'コンピューターの勝利！',
    humanVictory: '{{player}}さんの勝利！',
    
    // Game over
    gameOver: 'ゲーム終了',
    congratulations: 'おめでとうございます！',
    winner: '勝者',
    gameStats: 'ゲーム統計',
    totalWords: '総単語数',
    playAgain: 'もう一度遊ぶ',
    backToMenu: 'メニューに戻る',
    
    // AI opponent
    aiOpponent: 'AI対戦相手',
    aiDescription: '高度なアルゴリズムで日本語の単語を学習したAIと対戦しましょう！',
    aiThinking: 'AIが考え中...',
    aiStatus: 'AIが単語を考えています...',
    
    // AI difficulty levels
    aiDifficulty: 'AI難易度',
    easy: '簡単',
    medium: '普通',
    hard: '難しい',
    expert: '専門家',
    easyDescription: 'AIはランダムな手を打ち、初心者には適しています',
    mediumDescription: 'AIは基本的な戦略を使用し、バランスの取れたゲームプレイを提供します',
    hardDescription: 'AIは攻撃的で戦略的で、挑戦的です',
    expertDescription: 'AIはプレイヤーをトラップするために高度な戦術を使用します',
    
    // Game history
    gameHistory: 'ゲーム履歴',
    
    // Validation messages
    pleaseEnterName: '名前を入力してください',
    pleaseEnterWord: '単語を入力してください',
    onlyJapaneseCharacters: 'ひらがなとカタカナの文字のみ入力可能です',
    
    // Timer
    timeUpMessage: '{{player}}さんの時間切れ！コンピューターの勝利です！',
    
    // Player indicators
    player1: 'プレイヤー1',
    player2: 'プレイヤー2',
    computer: 'コンピューター',
    ai: 'AI',
    
    // Victory messages
    playerVictory: '{{player}}さんの勝利！',
    computerVictoryMessage: 'コンピューターの勝利！',
    timeUpPlayerVictory: '{{player}}さんの時間切れ！{{winner}}さんの勝利です！',
    
    // Turn messages
    playerTurn: '{{player}}さんの番です！',
    computerThinkingMessage: 'コンピューターが考え中...',
    
    // Game elements
    vs: 'VS',
    unknown: '不明',
    
    // Game rules
    gameRules: 'ゲームルール',
    rule1: '前の単語の最後の文字で始まる単語を言ってください',
    rule2: '既に使われた単語は使用できません',
    rule3: '「ん」で終わる単語を言った人が負けです'
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      ja
    },
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    react: {
      useSuspense: false,
    }
  });

export default i18n;
