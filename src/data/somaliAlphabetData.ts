export interface SomaliLetter {
  letter: string;
  nameSomali: string;
  type: 'consonant' | 'short_vowel' | 'long_vowel';
  ipa: string;
  phoneticHint: string;
  exampleWord: string;
  exampleEnglish: string;
  exampleSentence: string;
  exampleSentenceEnglish: string;
  pictureUrl: string;
}

export const SOMALI_CONSONANTS: SomaliLetter[] = [
  {
    letter: 'B',
    nameSomali: 'Ba',
    type: 'consonant',
    ipa: '/b/',
    phoneticHint: 'Like B in "book"',
    exampleWord: 'Buug',
    exampleEnglish: 'Book',
    exampleSentence: 'Ayaan waxay akhrinaysaa buug qurux badan.',
    exampleSentenceEnglish: 'Ayaan is reading a beautiful book.',
    pictureUrl: '/illustrations/somali-kids/vocab-buug.svg'
  },
  {
    letter: 'T',
    nameSomali: 'Ta',
    type: 'consonant',
    ipa: '/t/',
    phoneticHint: 'Like T in "table"',
    exampleWord: 'Tallaabo',
    exampleEnglish: 'Step / Progress',
    exampleSentence: 'Tallaabo kasta waa guul cusub.',
    exampleSentenceEnglish: 'Every step is a new achievement.',
    pictureUrl: '/illustrations/somali-kids/vocab-qalin.svg'
  },
  {
    letter: 'J',
    nameSomali: 'Ja',
    type: 'consonant',
    ipa: '/dʒ/',
    phoneticHint: 'Like J in "jump"',
    exampleWord: 'Jid',
    exampleEnglish: 'Path / Road',
    exampleSentence: 'Jidka aqoontu waa iftiin.',
    exampleSentenceEnglish: 'The path of knowledge is light.',
    pictureUrl: '/illustrations/somali-kids/vocab-waddo.svg'
  },
  {
    letter: 'X',
    nameSomali: 'Xa',
    type: 'consonant',
    ipa: '/ħ/',
    phoneticHint: 'Voiceless pharyngeal fricative (soft breathy H deep in throat)',
    exampleWord: 'Xiddig',
    exampleEnglish: 'Star',
    exampleSentence: 'Xiddigtu habeenkii way dhalaalaysaa.',
    exampleSentenceEnglish: 'The star shines in the night sky.',
    pictureUrl: '/illustrations/somali-kids/vocab-xiddig.svg'
  },
  {
    letter: 'KH',
    nameSomali: 'Kha',
    type: 'consonant',
    ipa: '/x/',
    phoneticHint: 'Like "ch" in Scottish "loch"',
    exampleWord: 'Khafiif',
    exampleEnglish: 'Gentle / Light',
    exampleSentence: 'Dabayl khafiif ah ayaa dhacaysa.',
    exampleSentenceEnglish: 'A gentle breeze is blowing.',
    pictureUrl: '/illustrations/somali-kids/vocab-dabayl.svg'
  },
  {
    letter: 'D',
    nameSomali: 'Da',
    type: 'consonant',
    ipa: '/d/',
    phoneticHint: 'Dental D (tongue touches front teeth)',
    exampleWord: 'Dhiil',
    exampleEnglish: 'Milk Vessel',
    exampleSentence: 'Dhiisha caanaha waxaa lagu tolay harag.',
    exampleSentenceEnglish: 'The milk vessel was crafted with woven leather.',
    pictureUrl: '/illustrations/somali-kids/vocab-dhiil.svg'
  },
  {
    letter: 'R',
    nameSomali: 'Ra',
    type: 'consonant',
    ipa: '/r/',
    phoneticHint: 'Rolled/tapped R',
    exampleWord: 'Roob',
    exampleEnglish: 'Rain',
    exampleSentence: 'Roobka gugu waa barwaaqo.',
    exampleSentenceEnglish: 'The spring rain brings prosperity.',
    pictureUrl: '/illustrations/somali-kids/vocab-roob.svg'
  },
  {
    letter: 'S',
    nameSomali: 'Sa',
    type: 'consonant',
    ipa: '/s/',
    phoneticHint: 'Like S in "sun"',
    exampleWord: 'Saaxiib',
    exampleEnglish: 'Friend',
    exampleSentence: 'Saaxiib fiican waa wehel qaali ah.',
    exampleSentenceEnglish: 'A true friend is a precious companion.',
    pictureUrl: '/illustrations/somali-kids/vocab-saaxiib.svg'
  },
  {
    letter: 'SH',
    nameSomali: 'Sha',
    type: 'consonant',
    ipa: '/ʃ/',
    phoneticHint: 'Like SH in "shine"',
    exampleWord: 'Shimbir',
    exampleEnglish: 'Bird',
    exampleSentence: 'Shimbirtu geedka dusheeda ayay heesaysaa.',
    exampleSentenceEnglish: 'The bird is singing on top of the tree.',
    pictureUrl: '/illustrations/somali-kids/vocab-shimbir.svg'
  },
  {
    letter: 'DH',
    nameSomali: 'Dha',
    type: 'consonant',
    ipa: '/ɖ/',
    phoneticHint: 'Retroflex D (curled tongue hitting roof of mouth)',
    exampleWord: 'Dhul',
    exampleEnglish: 'Earth / Land',
    exampleSentence: 'Dhulkeenu waa cagaar iyo qurux.',
    exampleSentenceEnglish: 'Our land is green and beautiful.',
    pictureUrl: '/illustrations/somali-kids/vocab-beero.svg'
  },
  {
    letter: 'C',
    nameSomali: 'Cayn',
    type: 'consonant',
    ipa: '/ʕ/',
    phoneticHint: 'Voiced pharyngeal fricative (warm sound deep in throat)',
    exampleWord: 'Caano',
    exampleEnglish: 'Milk',
    exampleSentence: 'Caanaha geelu waa nafaqo iyo caafimaad.',
    exampleSentenceEnglish: 'Camel milk is full of nourishment and health.',
    pictureUrl: '/illustrations/somali-kids/vocab-caano.svg'
  },
  {
    letter: 'G',
    nameSomali: 'Ga',
    type: 'consonant',
    ipa: '/ɡ/',
    phoneticHint: 'Hard G like in "go"',
    exampleWord: 'Geel',
    exampleEnglish: 'Camel',
    exampleSentence: 'Geelu waa hantida qaaliga ah ee reer miyiga.',
    exampleSentenceEnglish: 'The camel is the cherished treasure of nomadic life.',
    pictureUrl: '/illustrations/somali-kids/vocab-geel.svg'
  },
  {
    letter: 'F',
    nameSomali: 'Fa',
    type: 'consonant',
    ipa: '/f/',
    phoneticHint: 'Like F in "flower"',
    exampleWord: 'Faras',
    exampleEnglish: 'Horse',
    exampleSentence: 'Farasku wuxuu ku ordayaa dooxada.',
    exampleSentenceEnglish: 'The horse is running across the valley.',
    pictureUrl: '/illustrations/somali-kids/vocab-faras.svg'
  },
  {
    letter: 'Q',
    nameSomali: 'Qa',
    type: 'consonant',
    ipa: '/q/',
    phoneticHint: 'Uvular stop (deep K sound at the back of throat)',
    exampleWord: 'Qalin',
    exampleEnglish: 'Pen / Pencil',
    exampleSentence: 'Qalinku wuxuu qorayaa erayo xikmad leh.',
    exampleSentenceEnglish: 'The pen writes words of wisdom.',
    pictureUrl: '/illustrations/somali-kids/vocab-qalin.svg'
  },
  {
    letter: 'K',
    nameSomali: 'Ka',
    type: 'consonant',
    ipa: '/k/',
    phoneticHint: 'Like K in "kite"',
    exampleWord: 'Kalluun',
    exampleEnglish: 'Fish',
    exampleSentence: 'Kalluunku wuxuu ku dabaalanayaa badda.',
    exampleSentenceEnglish: 'The fish swims gracefully in the sea.',
    pictureUrl: '/illustrations/somali-kids/vocab-kalluun.svg'
  },
  {
    letter: 'L',
    nameSomali: 'La',
    type: 'consonant',
    ipa: '/l/',
    phoneticHint: 'Like L in "light"',
    exampleWord: 'Libaax',
    exampleEnglish: 'Lion',
    exampleSentence: 'Libaaxu waa boqorka kaynta.',
    exampleSentenceEnglish: 'The lion is the king of the savanna.',
    pictureUrl: '/illustrations/somali-kids/vocab-libaax.svg'
  },
  {
    letter: 'M',
    nameSomali: 'Ma',
    type: 'consonant',
    ipa: '/m/',
    phoneticHint: 'Like M in "moon"',
    exampleWord: 'Magaalo',
    exampleEnglish: 'City / Town',
    exampleSentence: 'Magaaladu subaxdii way mashquul tahay.',
    exampleSentenceEnglish: 'The city is bustling in the morning.',
    pictureUrl: '/illustrations/somali-kids/vocab-magaalo.svg'
  },
  {
    letter: 'N',
    nameSomali: 'Na',
    type: 'consonant',
    ipa: '/n/',
    phoneticHint: 'Like N in "nest"',
    exampleWord: 'Nabad',
    exampleEnglish: 'Peace',
    exampleSentence: 'Nabaddu waa aasaaska nolosha.',
    exampleSentenceEnglish: 'Peace is the foundation of life.',
    pictureUrl: '/illustrations/somali-kids/vocab-nabad.svg'
  },
  {
    letter: 'W',
    nameSomali: 'Wa',
    type: 'consonant',
    ipa: '/w/',
    phoneticHint: 'Like W in "water"',
    exampleWord: 'Waddo',
    exampleEnglish: 'Road / Avenue',
    exampleSentence: 'Waddada dugsiga waa mid toosan.',
    exampleSentenceEnglish: 'The road to school is straight.',
    pictureUrl: '/illustrations/somali-kids/vocab-waddo.svg'
  },
  {
    letter: 'H',
    nameSomali: 'Ha',
    type: 'consonant',
    ipa: '/h/',
    phoneticHint: 'Like H in "hope"',
    exampleWord: 'Hooyo',
    exampleEnglish: 'Mother',
    exampleSentence: 'Hooyadu waa macallinka koowaad ee nolosha.',
    exampleSentenceEnglish: 'Mother is the first teacher in life.',
    pictureUrl: '/illustrations/somali-kids/vocab-hooyo.svg'
  },
  {
    letter: 'Y',
    nameSomali: 'Ya',
    type: 'consonant',
    ipa: '/j/',
    phoneticHint: 'Like Y in "yes"',
    exampleWord: 'Yaryar',
    exampleEnglish: 'Little / Young ones',
    exampleSentence: 'Carruurta yaryar waxay baranayaan heeso.',
    exampleSentenceEnglish: 'The young children are learning rhymes.',
    pictureUrl: '/illustrations/somali-kids/vocab-carruur.svg'
  }
];

export const SOMALI_SHORT_VOWELS: SomaliLetter[] = [
  {
    letter: 'A',
    nameSomali: 'A Gaaban',
    type: 'short_vowel',
    ipa: '/æ/',
    phoneticHint: 'Short A like in "cat"',
    exampleWord: 'Arday',
    exampleEnglish: 'Student',
    exampleSentence: 'Ardaygu wuxuu si fiican u dhageystay casharka.',
    exampleSentenceEnglish: 'The student listened carefully to the lesson.',
    pictureUrl: '/illustrations/somali-kids/vocab-buug.svg'
  },
  {
    letter: 'E',
    nameSomali: 'E Gaaban',
    type: 'short_vowel',
    ipa: '/e/',
    phoneticHint: 'Short E like in "bed"',
    exampleWord: 'Erey',
    exampleEnglish: 'Word',
    exampleSentence: 'Erey kasta macno qaali ah ayuu leeyahay.',
    exampleSentenceEnglish: 'Every word carries valuable meaning.',
    pictureUrl: '/illustrations/somali-kids/vocab-qalin.svg'
  },
  {
    letter: 'I',
    nameSomali: 'I Gaaban',
    type: 'short_vowel',
    ipa: '/i/',
    phoneticHint: 'Short I like in "bit"',
    exampleWord: 'Iftiinka',
    exampleEnglish: 'Light',
    exampleSentence: 'Iftiinka cadceeddu wuxuu soo baxay aroortii.',
    exampleSentenceEnglish: 'The morning sunlight broke out at dawn.',
    pictureUrl: '/illustrations/somali-kids/vocab-cadceed.svg'
  },
  {
    letter: 'O',
    nameSomali: 'O Gaaban',
    type: 'short_vowel',
    ipa: '/ɔ/',
    phoneticHint: 'Short O like in "pot"',
    exampleWord: 'Orod',
    exampleEnglish: 'Run / Speed',
    exampleSentence: 'Orodka degdegga ah wuxuu xoojiyaa jirka.',
    exampleSentenceEnglish: 'Running briskly strengthens the body.',
    pictureUrl: '/illustrations/somali-kids/vocab-faras.svg'
  },
  {
    letter: 'U',
    nameSomali: 'U Gaaban',
    type: 'short_vowel',
    ipa: '/u/',
    phoneticHint: 'Short U like in "put"',
    exampleWord: 'Ubax',
    exampleEnglish: 'Flower',
    exampleSentence: 'Ubaxa guga wuxuu u carfayaa si macaan.',
    exampleSentenceEnglish: 'The spring flower smells delightfully sweet.',
    pictureUrl: '/illustrations/somali-kids/vocab-ubax.svg'
  }
];

export const SOMALI_LONG_VOWELS: SomaliLetter[] = [
  {
    letter: 'AA',
    nameSomali: 'AA Dheer',
    type: 'long_vowel',
    ipa: '/aː/',
    phoneticHint: 'Sustained AA like in "father"',
    exampleWord: 'Aabe',
    exampleEnglish: 'Father',
    exampleSentence: 'Aabbuhu wuxuu u sheegay carruurta sheeko xikmad leh.',
    exampleSentenceEnglish: 'Father told the children a wise bedtime story.',
    pictureUrl: '/illustrations/somali-kids/vocab-aabe.svg'
  },
  {
    letter: 'EE',
    nameSomali: 'EE Dheer',
    type: 'long_vowel',
    ipa: '/eː/',
    phoneticHint: 'Sustained EE like in "café" held longer',
    exampleWord: 'Eegid',
    exampleEnglish: 'Looking / Observing',
    exampleSentence: 'Eegidda dabeecadda waxay furtaa caqliga.',
    exampleSentenceEnglish: 'Observing nature broadens the mind.',
    pictureUrl: '/illustrations/somali-kids/vocab-saacad.svg'
  },
  {
    letter: 'II',
    nameSomali: 'II Dheer',
    type: 'long_vowel',
    ipa: '/iː/',
    phoneticHint: 'Sustained II like in "see"',
    exampleWord: 'Iid',
    exampleEnglish: 'Celebration / Festival',
    exampleSentence: 'Maalinta ciidda qof kastaa wuxuu xidhaa dhar cusub.',
    exampleSentenceEnglish: 'On festival day everyone wears new clothes.',
    pictureUrl: '/illustrations/somali-kids/vocab-farxad.svg'
  },
  {
    letter: 'OO',
    nameSomali: 'OO Dheer',
    type: 'long_vowel',
    ipa: '/oː/',
    phoneticHint: 'Sustained OO like in "boat"',
    exampleWord: 'Oon',
    exampleEnglish: 'Thirst / Quenching',
    exampleSentence: 'Biyo qabow ayaa jabiyay oonkii socotada.',
    exampleSentenceEnglish: 'Cold water quenched the traveler’s thirst.',
    pictureUrl: '/illustrations/somali-kids/vocab-biyo.svg'
  },
  {
    letter: 'UU',
    nameSomali: 'UU Dheer',
    type: 'long_vowel',
    ipa: '/uː/',
    phoneticHint: 'Sustained UU like in "moon"',
    exampleWord: 'Uur-damiir',
    exampleEnglish: 'Pure Conscience / Goodwill',
    exampleSentence: 'Uur-damiir saafi ah ayaa keena xasilooni.',
    exampleSentenceEnglish: 'A clear conscience brings peace of mind.',
    pictureUrl: '/illustrations/somali-kids/vocab-nabad.svg'
  }
];

export interface PhraseItem {
  id: string;
  somali: string;
  english: string;
  phonetic: string;
  category: 'salaan' | 'asluub' | 'tiro' | 'midab' | 'maalmo';
}

export const SOMALI_PHRASES: PhraseItem[] = [
  // Greetings
  {
    id: 'p-1',
    somali: 'Subax wanaagsan',
    english: 'Good morning',
    phonetic: 'soo-bah wah-naag-san',
    category: 'salaan'
  },
  {
    id: 'p-2',
    somali: 'Galab wanaagsan',
    english: 'Good afternoon',
    phonetic: 'gah-lahb wah-naag-san',
    category: 'salaan'
  },
  {
    id: 'p-3',
    somali: 'Habeen wanaagsan',
    english: 'Good night',
    phonetic: 'hah-bayn wah-naag-san',
    category: 'salaan'
  },
  {
    id: 'p-4',
    somali: 'Iska warran?',
    english: 'How are you?',
    phonetic: 'is-kah wahr-rahn?',
    category: 'salaan'
  },
  {
    id: 'p-5',
    somali: 'Waan fiicanahay, mahadsanid',
    english: 'I am doing well, thank you',
    phonetic: 'waan fee-cahn-ah-hay, mah-had-sah-nid',
    category: 'salaan'
  },

  // Courtesy
  {
    id: 'p-6',
    somali: 'Fadlan',
    english: 'Please',
    phonetic: 'fahd-lahn',
    category: 'asluub'
  },
  {
    id: 'p-7',
    somali: 'Mahadsanid',
    english: 'Thank you',
    phonetic: 'mah-had-sah-nid',
    category: 'asluub'
  },
  {
    id: 'p-8',
    somali: 'Adaa mudan',
    english: 'You are welcome',
    phonetic: 'ah-daa moo-dahn',
    category: 'asluub'
  },
  {
    id: 'p-9',
    somali: 'I cafi',
    english: 'Excuse me / Forgive me',
    phonetic: 'ee cah-fee',
    category: 'asluub'
  },
  {
    id: 'p-10',
    somali: 'Nabad gelyo',
    english: 'Goodbye / Go in peace',
    phonetic: 'nah-bahd gehl-yoh',
    category: 'asluub'
  },

  // Numbers 1-10
  { id: 'p-11', somali: 'Kow (1)', english: 'One (1)', phonetic: 'kow', category: 'tiro' },
  { id: 'p-12', somali: 'Laba (2)', english: 'Two (2)', phonetic: 'lah-bah', category: 'tiro' },
  { id: 'p-13', somali: 'Saddex (3)', english: 'Three (3)', phonetic: 'sahd-deh', category: 'tiro' },
  { id: 'p-14', somali: 'Afar (4)', english: 'Four (4)', phonetic: 'ah-far', category: 'tiro' },
  { id: 'p-15', somali: 'Shan (5)', english: 'Five (5)', phonetic: 'shahn', category: 'tiro' },
  { id: 'p-16', somali: 'Lix (6)', english: 'Six (6)', phonetic: 'lih', category: 'tiro' },
  { id: 'p-17', somali: 'Toddoba (7)', english: 'Seven (7)', phonetic: 'tohd-doh-bah', category: 'tiro' },
  { id: 'p-18', somali: 'Sideed (8)', english: 'Eight (8)', phonetic: 'see-dayd', category: 'tiro' },
  { id: 'p-19', somali: 'Sagaal (9)', english: 'Nine (9)', phonetic: 'sah-gaal', category: 'tiro' },
  { id: 'p-20', somali: 'Toban (10)', english: 'Ten (10)', phonetic: 'toh-bahn', category: 'tiro' },

  // Colors
  { id: 'p-21', somali: 'Gaduud / Cas', english: 'Red', phonetic: 'gah-dood / cahs', category: 'midab' },
  { id: 'p-22', somali: 'Buluug', english: 'Blue', phonetic: 'boo-loog', category: 'midab' },
  { id: 'p-23', somali: 'Cagaar', english: 'Green', phonetic: 'cah-gaar', category: 'midab' },
  { id: 'p-24', somali: 'Jaalle / Huruud', english: 'Yellow', phonetic: 'jaal-leh / hoo-rood', category: 'midab' },
  { id: 'p-25', somali: 'Cad', english: 'White', phonetic: 'cahd', category: 'midab' },
  { id: 'p-26', somali: 'Madow', english: 'Black', phonetic: 'mah-dow', category: 'midab' },

  // Days of Week
  { id: 'p-27', somali: 'Sabti', english: 'Saturday', phonetic: 'sahb-tee', category: 'maalmo' },
  { id: 'p-28', somali: 'Axad', english: 'Sunday', phonetic: 'ah-hahd', category: 'maalmo' },
  { id: 'p-29', somali: 'Isniin', english: 'Monday', phonetic: 'is-neen', category: 'maalmo' },
  { id: 'p-30', somali: 'Talaado', english: 'Tuesday', phonetic: 'tah-laa-doh', category: 'maalmo' },
  { id: 'p-31', somali: 'Arbaco', english: 'Wednesday', phonetic: 'ahr-bah-coh', category: 'maalmo' },
  { id: 'p-32', somali: 'Khamiis', english: 'Thursday', phonetic: 'khah-mees', category: 'maalmo' },
  { id: 'p-33', somali: 'Jimce', english: 'Friday', phonetic: 'jim-ceh', category: 'maalmo' }
];
