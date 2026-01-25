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

  // Latin: Strict multi-keyword matching to avoid false positives
  
  // English: match 3+ common function words
  const enKeywords = /\b(the|is|are|have|has|do|does|did|will|would|should|could|be|been|being|a|an|and|or|but|if|then|what|which|who|when|where|why|how)\b/g;
  if ((t.match(enKeywords) || []).length >= 3) return "en";

  // French: match 3+ French-specific words
  const frKeywords = /\b(je|tu|il|elle|nous|vous|ils|elles|être|avoir|aller|faire|pouvoir|vouloir|devoir|qu'|c'est|l'|d'|à|au|aux)\b/g;
  if ((t.match(frKeywords) || []).length >= 3) return "fr";

  // Spanish: match 3+ Spanish-specific words
  const esKeywords = /\b(yo|tú|él|ella|nosotros|vosotros|ellos|ser|estar|tener|hacer|poder|querer|decir|dar|ir|venir|ver|hablar)\b/g;
  if ((t.match(esKeywords) || []).length >= 3) return "es";

  // German: match 3+ German-specific words
  const deKeywords = /\b(ich|du|er|sie|es|wir|ihr|der|die|das|den|dem|des|ein|eine|sein|haben|werden|können|wollen)\b/g;
  if ((t.match(deKeywords) || []).length >= 3) return "de";

  // Italian: match 3+ Italian-specific words
  const itKeywords = /\b(io|tu|lui|lei|noi|voi|loro|essere|avere|andare|fare|potere|volere|dovere|dire|dare|venire)\b/g;
  if ((t.match(itKeywords) || []).length >= 3) return "it";

  // Portuguese: match 3+ Portuguese-specific words
  const ptKeywords = /\b(eu|tu|ele|ela|nós|vós|eles|elas|ser|estar|ter|fazer|poder|querer|dizer|dar|ir|vir|ver|falar)\b/g;
  if ((t.match(ptKeywords) || []).length >= 3) return "pt";

  // Romanian: match 3+ Romanian-specific words (careful: overlap with Latin languages)
  const roKeywords = /\b(eu|tu|el|ea|noi|voi|lor|sunt|ești|este|suntem|sunteți|fi|avea|face|putea|vrea|zice|da|merge)\b/g;
  if ((t.match(roKeywords) || []).length >= 3) return "ro";

  // Dutch: match 3+ Dutch-specific words
  const nlKeywords = /\b(ik|je|hij|zij|wij|u|ze|de|het|een|zijn|hebben|worden|kunnen|willen|moeten|zullen|gaan|doen|zeggen)\b/g;
  if ((t.match(nlKeywords) || []).length >= 3) return "nl";

  // Polish: match 3+ Polish-specific words
  const plKeywords = /\b(ja|ty|on|ona|ono|my|wy|oni|one|być|mieć|robić|móc|chcieć|powiedzieć|dać|iść|przyjść|widzieć|mówić)\b/g;
  if ((t.match(plKeywords) || []).length >= 3) return "pl";

  // Swedish: match 3+ Swedish-specific words
  const svKeywords = /\b(jag|du|han|hon|vi|ni|de|vara|ha|gå|kunna|vilja|måste|ska|säga|ge|komma|se|tala)\b/g;
  if ((t.match(svKeywords) || []).length >= 3) return "sv";

  // Norwegian: match 3+ Norwegian-specific words
  const noKeywords = /\b(jeg|du|han|hun|vi|dere|de|være|ha|gå|kunne|ville|må|skal|si|gi|komme|se|snakke)\b/g;
  if ((t.match(noKeywords) || []).length >= 3) return "no";

  // Danish: match 3+ Danish-specific words
  const daKeywords = /\b(jeg|du|han|hun|vi|de|være|have|gå|kunne|ville|skal|sige|give|komme|se|tale)\b/g;
  if ((t.match(daKeywords) || []).length >= 3) return "da";

  // Finnish: match 3+ Finnish-specific words
  const fiKeywords = /\b(minä|sinä|hän|se|me|te|he|olla|omistaa|mennä|voida|haluta|pitää|sanoa|antaa|tulla|nähdä|puhua)\b/g;
  if ((t.match(fiKeywords) || []).length >= 3) return "fi";

  // Czech: match 3+ Czech-specific words
  const csKeywords = /\b(já|ty|on|ona|ono|my|vy|oni|ony|být|mít|jít|moci|chtít|muset|říci|dát|přijít|vidět|mluvit)\b/g;
  if ((t.match(csKeywords) || []).length >= 3) return "cs";

  // Hungarian: match 3+ Hungarian-specific words
  const huKeywords = /\b(én|te|ő|mi|ti|ők|van|lenni|menni|tudni|akarni|kell|mondani|adni|jönni|látni|beszélni)\b/g;
  if ((t.match(huKeywords) || []).length >= 3) return "hu";

  // Turkish: match 3+ Turkish-specific words
  const trKeywords = /\b(ben|sen|o|biz|siz|onlar|olmak|gitmek|gelmek|görmek|konuşmak|söylemek|vermek|almak|yapmak|vermek)\b/g;
  if ((t.match(trKeywords) || []).length >= 3) return "tr";

  // Ukrainian: match 3+ Ukrainian-specific words (Cyrillic already checked above)
  const ukKeywords = /\b(я|ти|він|вона|воно|ми|ви|вони|бути|мати|йти|мочи|хотіти|сказати|дати|прийти|бачити|говорити)\b/g;
  if ((t.match(ukKeywords) || []).length >= 3) return "uk";

  // Indonesian: match 3+ Indonesian-specific words
  const idKeywords = /\b(saya|anda|dia|kami|kalian|mereka|adalah|mempunyai|pergi|dapat|ingin|harus|berkata|memberi|datang|melihat|berbicara)\b/g;
  if ((t.match(idKeywords) || []).length >= 3) return "id";

  // Default to English if nothing matches clearly
  return "en";
}
