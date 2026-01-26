// Robust language detection utility
// Returns ISO code like 'fr', 'en', 'es', 'de', 'it', 'pt', 'ja', 'zh', 'ar', 'ru', 'hi', 'tr', and more

export function detectLanguage(text: string): string {
  const t = (text || "").trim().toLowerCase();
  if (!t) return "en";

  // Unicode script detection (highest priority - most reliable)
  const hasArabic = /[\u0600-\u06FF]/.test(t);
  const hasCJK = /[\u4E00-\u9FFF\u3400-\u4DBF]/.test(t);
  const hasHiraganaKatakana = /[\u3040-\u309F\u30A0-\u30FF]/.test(t);
  const hasCyrillic = /[\u0400-\u04FF]/.test(t);
  const hasGreek = /[\u0370-\u03FF]/.test(t);
  const hasThai = /[\u0E00-\u0E7F]/.test(t);
  const hasKorean = /[\uAC00-\uD7AF\u1100-\u11FF]/.test(t);
  const hasDevanagari = /[\u0900-\u097F]/.test(t);
  const hasVietnamese = /[\u0102-\u0103\u0110-\u0111\u0128-\u0129\u0168-\u0169\u01A0-\u01A1\u1EA0-\u1EFF]/.test(t);

  if (hasArabic) return "ar";
  if (hasHiraganaKatakana) return "ja";
  if (hasCJK) return "zh";
  if (hasGreek) return "el";
  if (hasThai) return "th";
  if (hasKorean) return "ko";
  if (hasDevanagari) return "hi";
  if (hasVietnamese) return "vi";
  if (hasCyrillic) {
    if (/\b(вас|ваш|его|ему|ей|нее|них)\b/.test(t)) return "ru";
    if (/\b(вас|ваш|його|йому|їх|його|їм)\b/.test(t)) return "uk";
    return "ru"; // default Cyrillic
  }

  // Latin: Score-based matching for accurate detection
  const scores: Record<string, number> = {
    fr: 0,
    en: 0,
    es: 0,
    de: 0,
    it: 0,
    pt: 0,
    nl: 0,
  };

  // French: comprehensive keywords including common short words
  const frWords = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'être', 'avoir', 'aller', 'faire', 'pouvoir', 'vouloir', 'devoir', 'est', 'sont', 'suis', 'ai', 'avez', 'allez', 'comment', 'quoi', 'où', 'quand', 'pourquoi', 'qui', 'quel', 'quelle', 'avec', 'sans', 'dans', 'sur', 'sous', 'pour', 'par', 'mais', 'donc', 'ou', 'car', 'ni', 'bonjour', 'salut', 'merci', 'sil', 'svp', 'aujourdhui', 'ça', 'va'];
  const frRegex = new RegExp(`\\b(${frWords.join('|')})\\b`, 'g');
  scores.fr = (t.match(frRegex) || []).length;
  
  // Check for French contractions and accents
  if (/\b(c'est|qu'|l'|d'|j'|n'|m'|t'|s')\b/.test(t)) scores.fr += 2;
  if (/[àâçèéêëîïôùûü]/.test(t)) scores.fr += 1;

  // English: comprehensive keywords
  const enWords = ['the', 'is', 'are', 'have', 'has', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'be', 'been', 'being', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'this', 'that', 'these', 'those', 'can', 'may', 'might', 'must', 'shall', 'with', 'from', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'hello', 'hi', 'thanks', 'please', 'today', 'yes', 'no'];
  const enRegex = new RegExp(`\\b(${enWords.join('|')})\\b`, 'g');
  scores.en = (t.match(enRegex) || []).length;

  // Spanish: comprehensive keywords  
  const esWords = ['yo', 'tú', 'él', 'ella', 'nosotros', 'vosotros', 'ellos', 'ser', 'estar', 'tener', 'hacer', 'poder', 'querer', 'decir', 'dar', 'ir', 'venir', 'ver', 'hablar', 'es', 'son', 'estoy', 'está', 'están', 'tengo', 'tiene', 'tienen', 'hago', 'hace', 'hacen', 'qué', 'cómo', 'dónde', 'cuándo', 'por', 'qué', 'quién', 'con', 'sin', 'para', 'pero', 'hola', 'gracias', 'por', 'favor', 'hoy'];
  const esRegex = new RegExp(`\\b(${esWords.join('|')})\\b`, 'g');
  scores.es = (t.match(esRegex) || []).length;
  if (/[áéíóúñ¿¡]/.test(t)) scores.es += 1;

  // German: comprehensive keywords
  const deWords = ['ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'sein', 'haben', 'werden', 'können', 'wollen', 'ist', 'sind', 'bin', 'habe', 'hat', 'haben', 'wird', 'kann', 'will', 'was', 'wie', 'wo', 'wann', 'warum', 'wer', 'mit', 'ohne', 'für', 'aber', 'und', 'oder', 'nicht', 'hallo', 'danke', 'bitte', 'heute'];
  const deRegex = new RegExp(`\\b(${deWords.join('|')})\\b`, 'g');
  scores.de = (t.match(deRegex) || []).length;
  if (/[äöüß]/.test(t)) scores.de += 1;

  // Italian: comprehensive keywords
  const itWords = ['io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro', 'essere', 'avere', 'andare', 'fare', 'potere', 'volere', 'dovere', 'dire', 'dare', 'venire', 'sono', 'sei', 'è', 'siamo', 'siete', 'ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno', 'cosa', 'come', 'dove', 'quando', 'perché', 'chi', 'con', 'senza', 'per', 'ma', 'ciao', 'grazie', 'prego', 'oggi'];
  const itRegex = new RegExp(`\\b(${itWords.join('|')})\\b`, 'g');
  scores.it = (t.match(itRegex) || []).length;
  if (/[àèéìòù]/.test(t)) scores.it += 1;

  // Portuguese: comprehensive keywords
  const ptWords = ['eu', 'tu', 'ele', 'ela', 'nós', 'vós', 'eles', 'elas', 'ser', 'estar', 'ter', 'fazer', 'poder', 'querer', 'dizer', 'dar', 'ir', 'vir', 'ver', 'falar', 'sou', 'és', 'é', 'somos', 'são', 'tenho', 'tens', 'tem', 'temos', 'têm', 'o', 'que', 'como', 'onde', 'quando', 'por', 'quê', 'quem', 'com', 'sem', 'para', 'mas', 'olá', 'obrigado', 'obrigada', 'por', 'favor', 'hoje'];
  const ptRegex = new RegExp(`\\b(${ptWords.join('|')})\\b`, 'g');
  scores.pt = (t.match(ptRegex) || []).length;
  if (/[ãõáéíóúâêôç]/.test(t)) scores.pt += 1;

  // Dutch: comprehensive keywords
  const nlWords = ['ik', 'je', 'hij', 'zij', 'wij', 'u', 'ze', 'de', 'het', 'een', 'zijn', 'hebben', 'worden', 'kunnen', 'willen', 'moeten', 'zullen', 'gaan', 'doen', 'zeggen', 'ben', 'bent', 'is', 'heb', 'hebt', 'heeft', 'wat', 'hoe', 'waar', 'wanneer', 'waarom', 'wie', 'met', 'zonder', 'voor', 'maar', 'en', 'of', 'hallo', 'dank', 'alsjeblieft', 'vandaag'];
  const nlRegex = new RegExp(`\\b(${nlWords.join('|')})\\b`, 'g');
  scores.nl = (t.match(nlRegex) || []).length;

  // Find language with highest score
  let maxScore = 0;
  let detectedLang = 'en';
  let secondMaxScore = 0;
  let secondMaxLang = 'en';
  
  for (const [lang, score] of Object.entries(scores)) {
    if (score > maxScore) {
      secondMaxScore = maxScore;
      secondMaxLang = detectedLang;
      maxScore = score;
      detectedLang = lang;
    } else if (score > secondMaxScore) {
      secondMaxScore = score;
      secondMaxLang = lang;
    }
  }
  
  // PRIORITY: If French has decent score (≥1), prefer it over English default
  if (scores.fr >= 1 && scores.en <= 2) return 'fr';
  if (scores.es >= 1 && scores.en <= 2) return 'es';
  if (scores.de >= 1 && scores.en <= 2) return 'de';
  if (scores.it >= 1 && scores.en <= 2) return 'it';
  if (scores.pt >= 1 && scores.en <= 2) return 'pt';
  
  // Require minimum threshold of 2 matches to avoid false positives
  if (maxScore >= 2) {
    return detectedLang;
  }
  
  // If we have some score (even 1), and it's not English, return it
  if (maxScore >= 1 && detectedLang !== 'en') {
    return detectedLang;
  }

  // Default to English if nothing matches clearly
  return "en";
}
