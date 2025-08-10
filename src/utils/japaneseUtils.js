// Japanese character utilities for Shiritori game

// Convert Katakana to Hiragana
export const katakanaToHiragana = (char) => {
  const katakanaToHiraganaMap = {
    'ァ': 'ぁ', 'ア': 'あ', 'ィ': 'ぃ', 'イ': 'い', 'ゥ': 'ぅ', 'ウ': 'う', 'ェ': 'ぇ', 'エ': 'え', 'ォ': 'ぉ', 'オ': 'お',
    'カ': 'か', 'ガ': 'が', 'キ': 'き', 'ギ': 'ぎ', 'ク': 'く', 'グ': 'ぐ', 'ケ': 'け', 'ゲ': 'げ', 'コ': 'こ', 'ゴ': 'ご',
    'サ': 'さ', 'ザ': 'ざ', 'シ': 'し', 'ジ': 'じ', 'ス': 'す', 'ズ': 'ず', 'セ': 'せ', 'ゼ': 'ぜ', 'ソ': 'そ', 'ゾ': 'ぞ',
    'タ': 'た', 'ダ': 'だ', 'チ': 'ち', 'ヂ': 'ぢ', 'ッ': 'っ', 'ツ': 'つ', 'ヅ': 'づ', 'テ': 'て', 'デ': 'で', 'ト': 'と', 'ド': 'ど',
    'ナ': 'な', 'ニ': 'に', 'ヌ': 'ぬ', 'ネ': 'ね', 'ノ': 'の',
    'ハ': 'は', 'バ': 'ば', 'パ': 'ぱ', 'ヒ': 'ひ', 'ビ': 'び', 'ピ': 'ぴ', 'フ': 'ふ', 'ブ': 'ぶ', 'プ': 'ぷ', 'ヘ': 'へ', 'ベ': 'べ', 'ペ': 'ぺ', 'ホ': 'ほ', 'ボ': 'ぼ', 'ポ': 'ぽ',
    'マ': 'ま', 'ミ': 'み', 'ム': 'む', 'メ': 'め', 'モ': 'も',
    'ャ': 'ゃ', 'ヤ': 'や', 'ュ': 'ゅ', 'ユ': 'ゆ', 'ョ': 'ょ', 'ヨ': 'よ',
    'ラ': 'ら', 'リ': 'り', 'ル': 'る', 'レ': 'れ', 'ロ': 'ろ',
    'ワ': 'わ', 'ヲ': 'を', 'ン': 'ん'
  };
  
  return katakanaToHiraganaMap[char] || char;
};

// Convert Hiragana to Katakana
export const hiraganaToKatakana = (char) => {
  const hiraganaToKatakanaMap = {
    'ぁ': 'ァ', 'あ': 'ア', 'ぃ': 'ィ', 'い': 'イ', 'ぅ': 'ゥ', 'う': 'ウ', 'ぇ': 'ェ', 'え': 'エ', 'ぉ': 'ォ', 'お': 'オ',
    'か': 'カ', 'が': 'ガ', 'き': 'キ', 'ぎ': 'ギ', 'く': 'ク', 'ぐ': 'グ', 'け': 'ケ', 'げ': 'ゲ', 'こ': 'コ', 'ご': 'ゴ',
    'さ': 'サ', 'ざ': 'ザ', 'し': 'シ', 'じ': 'ジ', 'す': 'ス', 'ず': 'ズ', 'せ': 'セ', 'ぜ': 'ゼ', 'そ': 'ソ', 'ぞ': 'ゾ',
    'た': 'タ', 'だ': 'ダ', 'ち': 'チ', 'ぢ': 'ヂ', 'っ': 'ッ', 'つ': 'ツ', 'づ': 'ヅ', 'て': 'テ', 'で': 'デ', 'と': 'ト', 'ど': 'ド',
    'な': 'ナ', 'に': 'ニ', 'ぬ': 'ヌ', 'ね': 'ネ', 'の': 'ノ',
    'は': 'ハ', 'ば': 'バ', 'ぱ': 'パ', 'ひ': 'ヒ', 'び': 'ビ', 'ぴ': 'ピ', 'ふ': 'フ', 'ぶ': 'ブ', 'ぷ': 'プ', 'へ': 'ヘ', 'べ': 'ベ', 'ぺ': 'ペ', 'ほ': 'ホ', 'ぼ': 'ボ', 'ぽ': 'ポ',
    'ま': 'マ', 'み': 'ミ', 'む': 'ム', 'め': 'メ', 'も': 'モ',
    'ゃ': 'ャ', 'や': 'ヤ', 'ゅ': 'ュ', 'ゆ': 'ユ', 'ょ': 'ョ', 'よ': 'ヨ',
    'ら': 'ラ', 'り': 'リ', 'る': 'ル', 'れ': 'レ', 'ろ': 'ロ',
    'わ': 'ワ', 'を': 'ヲ', 'ん': 'ン'
  };
  
  return hiraganaToKatakanaMap[char] || char;
};

// Normalize character to Hiragana for consistent comparison
export const normalizeToHiragana = (char) => {
  return katakanaToHiragana(char);
};

// Check if two characters match for Shiritori rules
export const charactersMatch = (char1, char2) => {
  // Normalize both characters to Hiragana for comparison
  const normalized1 = normalizeToHiragana(char1);
  const normalized2 = normalizeToHiragana(char2);
  
  console.log('charactersMatch called with:', { char1, char2, normalized1, normalized2 });
  
  // Direct match
  if (normalized1 === normalized2) {
    console.log('Direct match found');
    return true;
  }
  
  // Handle small characters (ゃ, ゅ, ょ) - they should match with their full-size equivalents
  if ((normalized1 === 'ゃ' && normalized2 === 'や') || (normalized1 === 'ゅ' && normalized2 === 'ゆ') || (normalized1 === 'ょ' && normalized2 === 'よ')) {
    console.log('Small character match found');
    return true;
  }
  if ((normalized2 === 'ゃ' && normalized1 === 'や') || (normalized2 === 'ゅ' && normalized1 === 'ゆ') || (normalized2 === 'ょ' && normalized1 === 'よ')) {
    console.log('Small character match found (reverse)');
    return true;
  }
  
  // Handle voiced consonants matching with unvoiced equivalents (both directions)
  const voicedUnvoicedPairs = [
    ['が', 'か'], ['ざ', 'さ'], ['だ', 'た'], ['ば', 'は'], ['ぱ', 'は'],
    ['ぎ', 'き'], ['じ', 'し'], ['ぢ', 'ち'], ['び', 'ひ'], ['ぴ', 'ひ'],
    ['ぐ', 'く'], ['ず', 'す'], ['づ', 'つ'], ['ぶ', 'ふ'], ['ぷ', 'ふ'],
    ['げ', 'け'], ['ぜ', 'せ'], ['で', 'て'], ['べ', 'へ'], ['ぺ', 'へ'],
    ['ご', 'こ'], ['ぞ', 'そ'], ['ど', 'と'], ['ぼ', 'ほ'], ['ぽ', 'ほ']
  ];
  
  for (const [voiced, unvoiced] of voicedUnvoicedPairs) {
    if ((normalized1 === voiced && normalized2 === unvoiced) || 
        (normalized1 === unvoiced && normalized2 === voiced)) {
      console.log('Voiced/unvoiced consonant match found:', { voiced, unvoiced });
      return true;
    }
  }
  
  console.log('No match found');
  return false;
};

// Get the target character for the next word based on the last character
export const getTargetCharacter = (lastChar) => {
  const normalized = normalizeToHiragana(lastChar);
  
  console.log('getTargetCharacter called with:', { lastChar, normalized });
  
  // Handle small characters (ゃ, ゅ, ょ) - they should match with their full-size equivalents
  if (normalized === 'ゃ') {
    console.log('Small character ゃ detected, returning や');
    return 'や';
  }
  if (normalized === 'ゅ') {
    console.log('Small character ゅ detected, returning ゆ');
    return 'ゆ';
  }
  if (normalized === 'ょ') {
    console.log('Small character ょ detected, returning よ');
    return 'よ';
  }
  
  // Handle voiced consonants - they should match with their unvoiced equivalents
  const voicedToUnvoiced = {
    'が': 'か', 'ざ': 'さ', 'だ': 'た', 'ば': 'は', 'ぱ': 'は',
    'ぎ': 'き', 'じ': 'し', 'ぢ': 'ち', 'び': 'ひ', 'ぴ': 'ひ',
    'ぐ': 'く', 'ず': 'す', 'づ': 'つ', 'ぶ': 'ふ', 'ぷ': 'ふ',
    'げ': 'け', 'ぜ': 'せ', 'で': 'て', 'べ': 'へ', 'ぺ': 'へ',
    'ご': 'こ', 'ぞ': 'そ', 'ど': 'と', 'ぼ': 'ほ', 'ぽ': 'ほ'
  };
  
  const target = voicedToUnvoiced[normalized] || normalized;
  console.log('Target character:', { original: lastChar, normalized, target });
  return target;
};

// Validate that input contains only Hiragana and Katakana characters
export const isValidJapaneseInput = (input) => {
  if (!input || typeof input !== 'string') {
    return false;
  }
  
  // Regular expression to match only Hiragana and Katakana characters
  // Hiragana: \u3040-\u309F, Katakana: \u30A0-\u30FF
  const japaneseRegex = /^[\u3040-\u309F\u30A0-\u30FF]+$/;
  
  return japaneseRegex.test(input);
};

// Get only valid Japanese characters from input (filter out non-Japanese)
export const filterJapaneseCharacters = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Keep only Hiragana and Katakana characters
  return input.replace(/[^\u3040-\u309F\u30A0-\u30FF]/g, '');
};
