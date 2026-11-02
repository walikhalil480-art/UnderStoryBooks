import {
  ChildrenStoryCategorySlug,
  ChildrenStoryLevelId,
  StoryLessonQuestion,
  StoryVocabularyItem
} from '../types';

export interface StoryBlueprint {
  id: string;
  title: string;
  englishTitle: string;
  subtitle: string;
  levelId: ChildrenStoryLevelId;
  categorySlug: ChildrenStoryCategorySlug;
  estimatedReadingMinutes: number;
  learningPathOrder: number;
  xpReward: number;
  description: string;
  somaliSummary: string;
  moralSomali: string;
  moralEnglish: string;
  paintedCoverOverride?: string;
  sentences: Array<{
    somaliText: string;
    englishTranslation: string;
    sceneCaption: string;
  }>;
  vocabulary: Array<{
    somaliWord: string;
    englishMeaning: string;
    pronunciationGuide: string;
    partOfSpeech: 'Magac (Noun)' | 'Fal (Verb)' | 'Sifo (Adjective)' | 'Weedho (Phrase)';
    exampleSomali: string;
    exampleEnglish: string;
    pictureKey: string;
  }>;
  comprehensionQuestion: {
    promptSomali: string;
    promptEnglish: string;
    options: [string, string, string];
    correctAnswer: string;
    explanationSomali: string;
    explanationEnglish: string;
  };
  trueFalseQuestion: {
    promptSomali: string;
    promptEnglish: string;
    correctBoolean: boolean;
    explanationSomali: string;
    explanationEnglish: string;
  };
  blankQuestion: {
    sentenceTemplate: string;
    promptEnglish: string;
    correctAnswer: string;
    acceptedAnswers: string[];
    options: [string, string, string];
    explanationSomali: string;
  };
  completeSentenceQuestion: {
    sentenceTemplate: string;
    promptEnglish: string;
    correctAnswer: string;
    acceptedAnswers: string[];
    options: [string, string, string];
    explanationSomali: string;
  };
}

export const CATEGORY_LABELS: Record<
  ChildrenStoryCategorySlug,
  { somali: string; english: string; description: string }
> = {
  xayawaanka: {
    somali: 'Xayawaanka',
    english: 'Animals',
    description: 'Stories about camels, birds, kittens, goats, lions, tortoises, and wildlife.'
  },
  qoyska: {
    somali: 'Qoyska',
    english: 'Family',
    description: 'Warm stories about parents, grandparents, siblings, and helping at home.'
  },
  dugsiga: {
    somali: 'Dugsiga',
    english: 'School',
    description: 'Learning to read, write, count, and share with classmates at school.'
  },
  saaxiibtinimada: {
    somali: 'Saaxiibtinimada',
    english: 'Friendship',
    description: 'Kindness, cooperation, honesty, and playing together with friends.'
  },
  dhaqanka: {
    somali: 'Dhaqanka Soomaaliyeed',
    english: 'Somali Culture',
    description: 'Heritage, hospitality, traditional crafts, pastoral life, and proverbs.'
  },
  dabeecadda: {
    somali: 'Dabeecadda',
    english: 'Nature',
    description: 'Rain seasons, acacia trees, rivers, mountains, oceans, and caring for the earth.'
  },
  habeenkii: {
    somali: 'Sheekooyin Habeenkii',
    english: 'Bedtime Stories',
    description: 'Calm evening tales beneath the moon and stars for peaceful rest.'
  },
  tacabur: {
    somali: 'Hal-abuur iyo Tacabur',
    english: 'Imagination & Adventure',
    description: 'Curious journeys across hills, valleys, and coastal horizons.'
  }
};

export const LEVEL_LABELS: Record<
  ChildrenStoryLevelId,
  {
    somali: string;
    english: string;
    ageRange: string;
    difficulty:
      | 'Level 1 — Bilowga (Ages 3–5)'
      | 'Level 2 — Akhriste Yar (Ages 6–8)'
      | 'Level 3 — Akhriste Horumarsan (Ages 9–12)';
    summary: string;
  }
> = {
  'level-1': {
    somali: 'Heerka 1 — Bilowga',
    english: 'Level 1 — Beginner',
    ageRange: 'Ages 3–5 • Da’da 3–5 sano',
    difficulty: 'Level 1 — Bilowga (Ages 3–5)',
    summary: 'Very short sentences, familiar objects, colours, animals, and warm daily greetings.'
  },
  'level-2': {
    somali: 'Heerka 2 — Akhriste Yar',
    english: 'Level 2 — Young Reader',
    ageRange: 'Ages 6–8 • Da’da 6–8 sano',
    difficulty: 'Level 2 — Akhriste Yar (Ages 6–8)',
    summary: 'Short adventures, family life, school, friendship, nature, and everyday discoveries.'
  },
  'level-3': {
    somali: 'Heerka 3 — Akhriste Horumarsan',
    english: 'Level 3 — Advanced Reader',
    ageRange: 'Ages 9–12 • Da’da 9–12 sano',
    difficulty: 'Level 3 — Akhriste Horumarsan (Ages 9–12)',
    summary: 'Longer stories about courage, honesty, problem-solving, Somali culture, and environmental stewardship.'
  }
};

export const SOMALI_KIDS_30_STORY_BLUEPRINTS: StoryBlueprint[] = [
  // ============================================================================
  // LEVEL 1 — BILOWGA (AGES 3–5): 10 COMPLETE ORIGINAL STORIES
  // ============================================================================
  {
    id: 'geelkii-yaraa',
    title: 'Geelkii yaraa',
    englishTitle: 'The Little Camel',
    subtitle: 'Safarkii Dalmar ee Ceelka Biyaha Macaan',
    levelId: 'level-1',
    categorySlug: 'xayawaanka',
    estimatedReadingMinutes: 4,
    learningPathOrder: 1,
    xpReward: 40,
    paintedCoverOverride: '/illustrations/somali-kids/geelkii-yaraa-painted-cover.jpg',
    description:
      'Follow Dalmar, a curious young camel in the Somali countryside, as he walks with his mother across the red sand dunes to discover the well of sweet water.',
    somaliSummary:
      'Dalmar waa geel yar oo xiiso badan oo hooyadiis u raacaya ceelka biyaha macaan ee miyiga.',
    moralSomali: 'Dulqaadka iyo dhageysiga waalidku waxay ku gaarsiiyaan meel barwaaqo ah.',
    moralEnglish: 'Patience and listening to your parents guide you safely to good places.',
    sentences: [
      {
        somaliText: 'Subax wanaagsan oo qorraxdu diirran tahay, geel yar oo la yiraahdo Dalmar ayaa ku toosay miyiga.',
        englishTranslation: 'On a bright morning when the sun was warm, a little camel named Dalmar woke up in the countryside.',
        sceneCaption: 'Sunrise over the red-sand Haud savannah as young Dalmar wakes up.'
      },
      {
        somaliText: 'Dalmar wuxuu lahaa dhogor jilicsan oo bunni dahabi ah iyo indho waaweyn oo aad ula yaaban adduunka.',
        englishTranslation: 'Dalmar had soft golden-brown fur and big eyes that wondered eagerly at the world.',
        sceneCaption: 'Dalmar looks out across the acacia plains with bright, curious eyes.'
      },
      {
        somaliText: 'Hooyadiis, oo ahayd hal weyn oo xasilloon, ayaa ku tiri: "Maanta waxaan u soconnaa ceelka biyaha macaan."',
        englishTranslation: 'His mother, who was a tall and calm she-camel, said to him: "Today we are walking to the well of sweet water."',
        sceneCaption: 'Dalmar’s mother guides him gently along the morning caravan trail.'
      },
      {
        somaliText: 'Dalmar aad ayuu u farxay, lugihiisa dhaadheer ayuuna ku boodbooday ciidda cas.',
        englishTranslation: 'Dalmar was very happy, and with his long legs he skipped playfully across the red sand.',
        sceneCaption: 'The little camel trots and skips across the warm terracotta sand.'
      },
      {
        somaliText: 'Jidka dhexdiisa, wuxuu ku arkay shimbir yar oo ku heesaysa geedka quraca korkiisa.',
        englishTranslation: 'Along the path, he saw a little bird singing on top of the umbrella thorn acacia tree.',
        sceneCaption: 'A weaver bird sings from the flat crown of an umbrella thorn acacia.'
      },
      {
        somaliText: '"Nabad, shimbir yahay!" ayuu yiri geelkii yaraa. "Ma taqaannaa halka uu ku yaallo ceelka biyaha?"',
        englishTranslation: '"Peace, little bird!" said the little camel. "Do you know where the water well is located?"',
        sceneCaption: 'Dalmar pauses beneath the shade of the acacia to greet the bird.'
      },
      {
        somaliText: 'Shimbirtii waxay u tilmaamtay dhinaca buurta cagaaran, halkaas oo neecaw qabow ka imaanaysay.',
        englishTranslation: 'The bird pointed toward the green hill, where a cool breeze was blowing from.',
        sceneCaption: 'The bird flutters its wings toward the green valley beyond the ridge.'
      },
      {
        somaliText: 'Markii uu Dalmar daalay, hooyadiis ayaa uga sheekaysay sida geelu ugu adkaysto safarka dheer.',
        englishTranslation: 'When Dalmar grew tired, his mother told him stories about how camels endure the long journey.',
        sceneCaption: 'Mother and calf walk side by side as the midday sun shines overhead.'
      },
      {
        somaliText: 'Ugu dambayntii, waxay gaareen ceelkii, Dalmarna wuxuu cabbay biyo qabow oo nadiif ah.',
        englishTranslation: 'Finally, they reached the well, and Dalmar drank cool, clean water.',
        sceneCaption: 'Cool, clear water shimmers at the oasis well surrounded by green palms.'
      },
      {
        somaliText: 'Fiidkii markii xiddiguhu soo baxeen, geelkii yaraa wuxuu ku seexday hooyadiis agteeda isagoo dhoolla-caddaynaya.',
        englishTranslation: 'In the evening when the stars came out, the little camel fell asleep beside his mother while smiling.',
        sceneCaption: 'Beneath a quiet canopy of stars, Dalmar rests peacefully beside his mother.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Geel',
        englishMeaning: 'Camel',
        pronunciationGuide: 'GEEL (long "ee" vowel)',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Geelkii yaraa wuxuu ku toosay miyiga.',
        exampleEnglish: 'The little camel woke up in the countryside.',
        pictureKey: 'camel'
      },
      {
        somaliWord: 'Qorrax',
        englishMeaning: 'Sun',
        pronunciationGuide: 'QOR-rax (uvular "q" + rolled "rr")',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Subaxdii qorraxdu way diirran tahay.',
        exampleEnglish: 'In the morning the sun is warm.',
        pictureKey: 'sun'
      },
      {
        somaliWord: 'Biyo',
        englishMeaning: 'Water',
        pronunciationGuide: 'BI-yo',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Dalmar wuxuu cabbay biyo qabow.',
        exampleEnglish: 'Dalmar drank cool water.',
        pictureKey: 'water_well'
      },
      {
        somaliWord: 'Shimbir',
        englishMeaning: 'Bird',
        pronunciationGuide: 'SHIM-bir',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Shimbir yar ayaa geedka ku heesaysa.',
        exampleEnglish: 'A little bird is singing in the tree.',
        pictureKey: 'bird'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxaa geelkii yaraa (Dalmar) sameeyay subaxdii?',
      promptEnglish: 'What did the little camel (Dalmar) do in the morning?',
      options: ['Wuu toosay oo wuu farxay.', 'Wuu ooyay.', 'Badda ayuu ku dabaashay.'],
      correctAnswer: 'Wuu toosay oo wuu farxay.',
      explanationSomali: 'Sax! Subaxdii Dalmar wuxuu ku toosay miyiga wuuna ku farxay safarka ceelka.',
      explanationEnglish: 'Correct! In the morning Dalmar woke up in the countryside and rejoiced.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Dalmar wuxuu la socday hooyadiis markii ay u socdeen ceelka biyaha.',
      promptEnglish: 'True or False: Dalmar walked with his mother on the way to the water well.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Dalmar wuxuu la socday hooyadiis oo ahayd hal weyn oo xasilloon.',
      explanationEnglish: 'True! Dalmar walked alongside his calm mother camel.'
    },
    blankQuestion: {
      sentenceTemplate: 'Geelkii yaraa wuxuu cabbay _____ qabow oo nadiif ah.',
      promptEnglish: 'Complete the sentence: The little camel drank cool, clean _____.',
      correctAnswer: 'biyo',
      acceptedAnswers: ['biyo', 'biyaha'],
      options: ['biyo', 'ciid', 'dhagax'],
      explanationSomali: 'Dalmar markii uu gaaray ceelkii wuxuu cabbay biyo qabow oo nadiif ah.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Jidka dhexdiisa, wuxuu ku arkay _____ yar oo ku heesaysa geedka quraca.',
      promptEnglish: 'Along the path, he saw a little _____ singing in the acacia tree.',
      correctAnswer: 'shimbir',
      acceptedAnswers: ['shimbir', 'shimbirtii'],
      options: ['shimbir', 'kalluun', 'doon'],
      explanationSomali: 'Wuxuu geedka quraca korkiisa ku arkay shimbir yar oo heesaysa.'
    }
  },
  {
    id: 'shimbirtii-iyo-roobka',
    title: 'Shimbirtii Yaraa iyo Roobka Gu’ga',
    englishTitle: 'The Little Bird and the Spring Rain',
    subtitle: 'Heesta Barwaaqada ee Xilliga Gu’ga',
    levelId: 'level-1',
    categorySlug: 'dabeecadda',
    estimatedReadingMinutes: 3,
    learningPathOrder: 2,
    xpReward: 40,
    paintedCoverOverride: '/illustrations/somali-kids/shimbirtii-iyo-roobka-painted-cover.jpg',
    description:
      'A gentle story about a young weaver bird watching the clouds gather for the Gu’ spring rains that turn the Somali savannah green.',
    somaliSummary:
      'Sheeko gaaban oo ku saabsan shimbir yar oo sugaysa roobka barwaaqada ee gu’ga iyo sida dhirta miyigu u cagaarato.',
    moralSomali: 'Roobku wuxuu keenaa nolol, cagaar, iyo farxad.',
    moralEnglish: 'Rain brings new life, greenery, and gratitude to all living things.',
    sentences: [
      {
        somaliText: 'Shimbir yar oo la yiraahdo Canab ayaa ku noolayd geedka quraca korkiisa.',
        englishTranslation: 'A little bird named Canab lived at the top of the umbrella thorn acacia tree.',
        sceneCaption: 'Canab the little bird perches on a high acacia branch.'
      },
      {
        somaliText: 'Subax walba waxay eegi jirtay daruuraha cadcad ee cirka maraya.',
        englishTranslation: 'Every morning she used to look up at the white clouds moving across the sky.',
        sceneCaption: 'Soft white clouds drift across the wide morning sky.'
      },
      {
        somaliText: 'Maalin maalmaha ka mid ah, neecaw qabow ayaa soo dhacday, roobka gu’ga ayaana bilowday.',
        englishTranslation: 'One day, a cool breeze blew across the land, and the spring rain began to fall.',
        sceneCaption: 'Gentle spring raindrops fall across the dry grassland.'
      },
      {
        somaliText: 'Dhibcaha roobka ayaa ku dhacay caleemaha geedaha iyo ciidda miyiga.',
        englishTranslation: 'Raindrops fell softly onto the tree leaves and the countryside soil.',
        sceneCaption: 'Leaves glisten with fresh rainwater droplets.'
      },
      {
        somaliText: 'Geedaha iyo ubaxyada miyiga ayaa isla markiiba noqday kuwo cagaaran oo qurux badan.',
        englishTranslation: 'The trees and wildflowers of the countryside soon turned green and beautiful.',
        sceneCaption: 'Green shoots and bright blossoms open across the valley.'
      },
      {
        somaliText: 'Shimbirtii yaraa waxay qaadday hees farxad leh oo ay ku soo dhawaynayso biyaha macaan.',
        englishTranslation: 'The little bird sang a joyful song welcoming the sweet rain water.',
        sceneCaption: 'Birds and animals gather happily around the fresh rainwater pools.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Roob',
        englishMeaning: 'Rain',
        pronunciationGuide: 'ROOB (long "oo" vowel)',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Roobka gu’ga ayaa bilowday.',
        exampleEnglish: 'The spring rain began to fall.',
        pictureKey: 'rain_cloud'
      },
      {
        somaliWord: 'Geed',
        englishMeaning: 'Tree',
        pronunciationGuide: 'GEED',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Shimbirtu waxay saaran tahay geed.',
        exampleEnglish: 'The bird is perched on a tree.',
        pictureKey: 'acacia_tree'
      },
      {
        somaliWord: 'Ubax',
        englishMeaning: 'Flower',
        pronunciationGuide: 'U-bax',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Ubaxyada miyiga ayaa soo baxay.',
        exampleEnglish: 'The wildflowers of the countryside bloomed.',
        pictureKey: 'flower_garden'
      },
      {
        somaliWord: 'Shimbir',
        englishMeaning: 'Bird',
        pronunciationGuide: 'SHIM-bir',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Shimbirtii yaraa way heestay.',
        exampleEnglish: 'The little bird sang.',
        pictureKey: 'bird'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxaa dhacay markii roobka gu’ga uu da’ay?',
      promptEnglish: 'What happened when the spring rain fell?',
      options: [
        'Geedaha iyo ubaxyada ayaa cagaar noqday.',
        'Baraf cad ayaa dhulka qariyay.',
        'Shimbirtii way carartay.'
      ],
      correctAnswer: 'Geedaha iyo ubaxyada ayaa cagaar noqday.',
      explanationSomali: 'Sax! Roobka gu’ga ka dib, geedaha iyo ubaxyada miyiga waxay noqdeen cagaar qurux badan.',
      explanationEnglish: 'Correct! After the spring rain, the trees and wildflowers turned green and beautiful.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Shimbirtii yaraa waxay qaadday hees farxad leh markii roobku da’ay.',
      promptEnglish: 'True or False: The little bird sang a joyful song when the rain fell.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Shimbirtii yaraa aad ayay ugu faraxday roobka gu’ga.',
      explanationEnglish: 'True! The little bird sang a joyful song welcoming the rain.'
    },
    blankQuestion: {
      sentenceTemplate: 'Maalin maalmaha ka mid ah, _____ gu’ga ayaa bilowday.',
      promptEnglish: 'One day, the spring _____ began to fall.',
      correctAnswer: 'roobka',
      acceptedAnswers: ['roobka', 'roob'],
      options: ['roobka', 'dabka', 'kubadda'],
      explanationSomali: 'Roobka gu’ga ayaa bilowday ka dib markii neecaw qabow soo dhacday.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Shimbir yar ayaa ku noolayd _____ quraca korkiisa.',
      promptEnglish: 'A little bird lived on top of the acacia _____.',
      correctAnswer: 'geedka',
      acceptedAnswers: ['geedka', 'geed'],
      options: ['geedka', 'badda', 'baabuurka'],
      explanationSomali: 'Shimbirtu waxay ku noolayd geedka quraca korkiisa.'
    }
  },
  {
    id: 'bisaddii-baroor',
    title: 'Bisaddii Yarayd ee Baroor',
    englishTitle: 'Baroor the Little Kitten',
    subtitle: 'Bisad Jecel Caanaha Diirran iyo Ciyaarta',
    levelId: 'level-1',
    categorySlug: 'xayawaanka',
    estimatedReadingMinutes: 3,
    learningPathOrder: 3,
    xpReward: 40,
    description:
      'Baroor is a playful spotted kitten who searches the family courtyard for her morning bowl of warm milk.',
    somaliSummary:
      'Baroor waa bisad yar oo ciyaar badan oo barxadda guriga ka raadinaysa caano diirran.',
    moralSomali: 'Xayawaanka guriga jooga waxay mudan yihiin daryeel iyo naxariis.',
    moralEnglish: 'Home animals deserve gentle care and kindness every day.',
    sentences: [
      {
        somaliText: 'Guriga reer Axmed waxaa joogta bisad yar oo la yiraahdo Baroor.',
        englishTranslation: 'At the Axmed family home lives a little cat named Baroor.',
        sceneCaption: 'Baroor the little spotted cat stretches in the sunny courtyard.'
      },
      {
        somaliText: 'Baroor waxay leedahay dhogor cad iyo baro bunni ah oo qurux badan.',
        englishTranslation: 'Baroor has white fur with beautiful brown spots.',
        sceneCaption: 'Close view of Baroor’s soft coat and bright whiskers.'
      },
      {
        somaliText: 'Subaxdii waxay ku dhawaaqdaa "Miyaw, miyaw!" iyadoo raadinaysa Sahra.',
        englishTranslation: 'In the morning she calls out "Meow, meow!" while looking for Sahra.',
        sceneCaption: 'Baroor trots across the woven mat calling softly.'
      },
      {
        somaliText: 'Sahra oo ah gabadh yar ayaa dhiisha ka soo shubtay caano diirran.',
        englishTranslation: 'Sahra, a young girl, poured warm milk from the traditional milk vessel.',
        sceneCaption: 'Sahra pours fresh milk into a clean wooden bowl.'
      },
      {
        somaliText: 'Bisaddii yaraa waxay cabtay caanihii, ka dibna kubbad yar ayay ku ciyaartay.',
        englishTranslation: 'The little cat drank the milk, and afterward played with a small ball.',
        sceneCaption: 'Baroor happily bats a woven ball across the courtyard.'
      },
      {
        somaliText: 'Markii ay daashay, waxay ku dul seexatay dermada hooska geedka.',
        englishTranslation: 'When she grew tired, she curled up to sleep on the woven mat in the tree shade.',
        sceneCaption: 'Baroor sleeps peacefully on the colorful woven mat.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Bisad',
        englishMeaning: 'Cat / Kitten',
        pronunciationGuide: 'BI-sad',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Bisad yar ayaa guriga joogta.',
        exampleEnglish: 'A little cat is at the house.',
        pictureKey: 'cat'
      },
      {
        somaliWord: 'Caano',
        englishMeaning: 'Milk',
        pronunciationGuide: 'CAA-no (pharyngeal "c" + long "aa")',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Bisaddu waxay cabtay caano diirran.',
        exampleEnglish: 'The cat drank warm milk.',
        pictureKey: 'milk_dhiil'
      },
      {
        somaliWord: 'Dermo',
        englishMeaning: 'Woven sleeping mat',
        pronunciationGuide: 'DER-mo',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Waxay ku seexatay dermada.',
        exampleEnglish: 'She slept on the woven mat.',
        pictureKey: 'woven_mat'
      },
      {
        somaliWord: 'Guri',
        englishMeaning: 'House / Home',
        pronunciationGuide: 'GU-ri',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Guriga reer Axmed waa nadiif.',
        exampleEnglish: 'The Axmed family home is clean.',
        pictureKey: 'somali_aqal'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay Sahra siisay bisaddii yarayd ee Baroor?',
      promptEnglish: 'What did Sahra give to Baroor the little kitten?',
      options: ['Caano diirran.', 'Buug cusub.', 'Kabaha dugsiga.'],
      correctAnswer: 'Caano diirran.',
      explanationSomali: 'Sax! Sahra waxay dhiisha ka soo shubtay caano diirran oo ay siisay Baroor.',
      explanationEnglish: 'Correct! Sahra poured warm milk for Baroor.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Baroor markii ay caanaha cabtay ka dib waxay ku seexatay dermada.',
      promptEnglish: 'True or False: After playing and drinking milk, Baroor slept on the woven mat.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Markii ay ciyaartay oo daashay waxay ku seexatay dermada hooska geedka.',
      explanationEnglish: 'True! She curled up to sleep on the woven mat under the shade.'
    },
    blankQuestion: {
      sentenceTemplate: 'Bisaddii yaraa waxay cabtay _____, ka dibna kubbad ayay ku ciyaartay.',
      promptEnglish: 'The little cat drank the _____, and then played with a ball.',
      correctAnswer: 'caanihii',
      acceptedAnswers: ['caanihii', 'caano'],
      options: ['caanihii', 'qorraxda', 'xiddigaha'],
      explanationSomali: 'Bisaddu waxay cabtay caanihii diirranaa.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Subaxdii Baroor waxay ku dhawaaqdaa "_____" iyadoo raadinaysa Sahra.',
      promptEnglish: 'In the morning Baroor calls out "_____" while looking for Sahra.',
      correctAnswer: 'Miyaw',
      acceptedAnswers: ['miyaw', 'miyaw, miyaw'],
      options: ['Miyaw', 'aw-aw', 'ci-ci'],
      explanationSomali: 'Codka bisaddu waa "Miyaw, miyaw!"'
    }
  },
  {
    id: 'riyo-yar-oo-geesi-ah',
    title: 'Ri’dii Yarayd ee Biciid',
    englishTitle: 'The Brave Little Kid Goat',
    subtitle: 'Ri’ Yar oo Buurta Cagaaran Fuushay',
    levelId: 'level-1',
    categorySlug: 'xayawaanka',
    estimatedReadingMinutes: 3,
    learningPathOrder: 4,
    xpReward: 40,
    description:
      'A lively little white kid goat climbs a grassy hill with his herd and learns to stay close to his companions.',
    somaliSummary:
      'Ri’ yar oo cad ayaa buurta cagaaran la fuulaysa adhiga iyadoo baranaysa wada-jirka.',
    moralSomali: 'Markaad kooxdaada la socoto, safarku waa mid ammaan ah.',
    moralEnglish: 'Staying together with your group keeps everyone safe on the journey.',
    sentences: [
      {
        somaliText: 'Miyiga cagaaran waxaa ku nool ri’ yar oo cad oo aad u firfircoon.',
        englishTranslation: 'In the green countryside lives a small white kid goat who is very lively.',
        sceneCaption: 'A small white kid goat hops across the green hillside.'
      },
      {
        somaliText: 'Ri’da yari waxay jeceshahay inay ku booddo dhagaxaanta buurta.',
        englishTranslation: 'The little goat loves to jump across the rocks on the hill.',
        sceneCaption: 'The little goat leaps lightly onto a smooth hillside stone.'
      },
      {
        somaliText: 'Subaxdii, adhiga oo dhan ayaa u baxay daaqa cawska cusub.',
        englishTranslation: 'In the morning, the whole flock went out to graze on the fresh grass.',
        sceneCaption: 'Goats graze peacefully together in the green valley.'
      },
      {
        somaliText: 'Ri’dii yarayd waxay aragtay caleemo macaan oo ku yaalla geed gaaban.',
        englishTranslation: 'The little goat saw sweet leaves growing on a low bush.',
        sceneCaption: 'Fresh green leaves sprout on a low savannah shrub.'
      },
      {
        somaliText: 'Waxay u yeertay riyaha kale si ay u wada cunaan caleemaha cagaaran.',
        englishTranslation: 'She called the other goats so they could eat the green leaves together.',
        sceneCaption: 'The little goat shares the leafy shrub with her friends.'
      },
      {
        somaliText: 'Galabtii, adhigii oo dheregsan ayaa si nabad ah ugu soo laabtay xerada.',
        englishTranslation: 'In the afternoon, the well-fed flock returned safely to the corral.',
        sceneCaption: 'The flock walks home together under the warm afternoon sun.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Ri’',
        englishMeaning: 'Goat',
        pronunciationGuide: 'RI’ (short vowel with glottal stop)',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Ri’ yar oo cad ayaa buurta fuushay.',
        exampleEnglish: 'A little white goat climbed the hill.',
        pictureKey: 'goat'
      },
      {
        somaliWord: 'Buur',
        englishMeaning: 'Hill / Mountain',
        pronunciationGuide: 'BUUR',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Buurta dusha sare waa cagaar.',
        exampleEnglish: 'The top of the hill is green.',
        pictureKey: 'mountain_hill'
      },
      {
        somaliWord: 'Geed',
        englishMeaning: 'Tree / Bush',
        pronunciationGuide: 'GEED',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Caleemaha geedku waa macaan.',
        exampleEnglish: 'The leaves of the tree are sweet.',
        pictureKey: 'acacia_tree'
      },
      {
        somaliWord: 'Qorrax',
        englishMeaning: 'Sun',
        pronunciationGuide: 'QOR-rax',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Galabtii qorraxdu way sii dhacaysaa.',
        exampleEnglish: 'In the afternoon the sun begins to set.',
        pictureKey: 'sun'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay ri’dii yarayd samaysay markii ay aragtay caleemaha macaan?',
      promptEnglish: 'What did the little goat do when she saw the sweet leaves?',
      options: [
        'Waxay u yeertay riyaha kale si ay u wada cunaan.',
        'Way iska seexatay.',
        'Biyaha ayay ku tuurtay.'
      ],
      correctAnswer: 'Waxay u yeertay riyaha kale si ay u wada cunaan.',
      explanationSomali: 'Sax! Ri’dii yarayd waxay la wadaagtay caleemaha riyaha kale.',
      explanationEnglish: 'Correct! The little goat called the others to share the green leaves.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Galabtii adhigii si nabad ah ayuu ugu soo laabtay xerada.',
      promptEnglish: 'True or False: In the afternoon the flock returned safely to the corral.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Adhigu isagoo dheregsan ayuu xerada ku soo laabtay.',
      explanationEnglish: 'True! The well-fed flock returned safely to the home enclosure.'
    },
    blankQuestion: {
      sentenceTemplate: 'Ri’da yari waxay jeceshahay inay ku booddo dhagaxaanta _____.',
      promptEnglish: 'The little goat loves to jump across the rocks on the _____.',
      correctAnswer: 'buurta',
      acceptedAnswers: ['buurta', 'buur'],
      options: ['buurta', 'doonta', 'buugga'],
      explanationSomali: 'Waxay ku booddaa dhagaxaanta buurta.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Subaxdii, adhiga oo dhan ayaa u baxay daaqa _____ cusub.',
      promptEnglish: 'In the morning, the whole flock went out to graze on the fresh _____.',
      correctAnswer: 'cawska',
      acceptedAnswers: ['cawska', 'caws'],
      options: ['cawska', 'qalinka', 'faynuuska'],
      explanationSomali: 'Adhigu wuxuu daaqaa cawska cusub ee cagaaran.'
    }
  },
  {
    id: 'qorraxda-subaxdii',
    title: 'Qorraxda Subaxdii iyo Rooble',
    englishTitle: 'The Morning Sun and Little Rooble',
    subtitle: 'Subax Cusub oo Nuur iyo Farxad Leh',
    levelId: 'level-1',
    categorySlug: 'qoyska',
    estimatedReadingMinutes: 3,
    learningPathOrder: 5,
    xpReward: 40,
    description:
      'Little Rooble wakes up as the golden morning sun shines through his window, washes his face, and greets his mother and father.',
    somaliSummary:
      'Rooble oo subaxdii hore toosaya markii qorraxdu soo baxdo, wejiga dhaqanaya, waalidkiisna salaamaya.',
    moralSomali: 'Toosidda hore iyo nadaafaddu waxay keenaan maalin wanaagsan.',
    moralEnglish: 'Waking up early and keeping clean starts every day with energy and joy.',
    sentences: [
      {
        somaliText: 'Qorraxda dahabiga ah ayaa subaxdii ka soo iftiintay daaqadda guriga.',
        englishTranslation: 'The golden sun shone brightly through the house window in the morning.',
        sceneCaption: 'Warm morning sunlight streams into the courtyard.'
      },
      {
        somaliText: 'Rooble oo ah wiil yar ayaa sariirta ka kacay isagoo dhoolla-caddaynaya.',
        englishTranslation: 'Rooble, a young boy, got up from his bed while smiling.',
        sceneCaption: 'Rooble wakes up refreshed and stretches his arms.'
      },
      {
        somaliText: 'Wuxuu ku dhaqday wejigiisa iyo gacmihiisa biyo nadiif ah.',
        englishTranslation: 'He washed his face and hands with clean water.',
        sceneCaption: 'Rooble washes his hands with clear water.'
      },
      {
        somaliText: 'Hooyo iyo Aabbe ayuu ku yiri: "Subax wanaagsan!"',
        englishTranslation: 'He said to his mother and father: "Good morning!"',
        sceneCaption: 'Rooble greets his parents warmly in the courtyard.'
      },
      {
        somaliText: 'Qoysku wuxuu wada cunay quraac macaan oo ah canjeero iyo caano.',
        englishTranslation: 'The family ate a delicious breakfast of canjeero flatbread and milk together.',
        sceneCaption: 'The family sits together on the mat sharing breakfast.'
      },
      {
        somaliText: 'Ka dib, Rooble wuxuu diyaar u noqday inuu ciyaaro oo wax barto.',
        englishTranslation: 'Afterward, Rooble was ready to play and learn new things.',
        sceneCaption: 'Rooble holds his picture book under the bright morning sun.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Qorrax',
        englishMeaning: 'Sun',
        pronunciationGuide: 'QOR-rax',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Qorraxda subaxdii way nuuraysaa.',
        exampleEnglish: 'The morning sun is shining.',
        pictureKey: 'sun'
      },
      {
        somaliWord: 'Qoys',
        englishMeaning: 'Family',
        pronunciationGuide: 'QOYS',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Qoysku wuxuu wada cunay quraac.',
        exampleEnglish: 'The family ate breakfast together.',
        pictureKey: 'family_courtyard'
      },
      {
        somaliWord: 'Biyo',
        englishMeaning: 'Water',
        pronunciationGuide: 'BI-yo',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Gacmaha ku dhaqo biyo nadiif ah.',
        exampleEnglish: 'Wash your hands with clean water.',
        pictureKey: 'water_well'
      },
      {
        somaliWord: 'Caano',
        englishMeaning: 'Milk',
        pronunciationGuide: 'CAA-no',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Rooble wuxuu cabbay caano.',
        exampleEnglish: 'Rooble drank milk.',
        pictureKey: 'milk_dhiil'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay Rooble iyo qoyskiisu ku quraacdeen subaxdii?',
      promptEnglish: 'What did Rooble and his family eat for breakfast in the morning?',
      options: ['Canjeero iyo caano.', 'Kalluun iyo bariis.', 'nacnac oo keliya.'],
      correctAnswer: 'Canjeero iyo caano.',
      explanationSomali: 'Sax! Qoysku wuxuu wada cunay quraac macaan oo ah canjeero iyo caano.',
      explanationEnglish: 'Correct! The family shared canjeero flatbread and milk.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Rooble wuxuu ku yiri waalidkiis "Subax wanaagsan!"',
      promptEnglish: 'True or False: Rooble said "Good morning!" to his parents.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Rooble si edeb leh ayuu u salaamay Hooyo iyo Aabbe.',
      explanationEnglish: 'True! Rooble politely greeted his mother and father.'
    },
    blankQuestion: {
      sentenceTemplate: 'Wuxuu ku dhaqday wejigiisa iyo gacmihiisa _____ nadiif ah.',
      promptEnglish: 'He washed his face and hands with clean _____.',
      correctAnswer: 'biyo',
      acceptedAnswers: ['biyo'],
      options: ['biyo', 'ciid', 'caleemo'],
      explanationSomali: 'Rooble wuxuu gacmaha iyo wejiga ku dhaqday biyo nadiif ah.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Hooyo iyo Aabbe ayuu ku yiri: "_____ wanaagsan!"',
      promptEnglish: 'He said to his mother and father: "Good _____!"',
      correctAnswer: 'Subax',
      acceptedAnswers: ['subax'],
      options: ['Subax', 'Habeen', 'Sanad'],
      explanationSomali: 'Subaxdii waxaa lagu salaamaa "Subax wanaagsan!"'
    }
  },
  {
    id: 'buuggii-cagaarnaa',
    title: 'Buuggii Cagaarnaa ee Hodan',
    englishTitle: 'Hodan’s Green Storybook',
    subtitle: 'Barashada Sawirrada iyo Erayada Cusub',
    levelId: 'level-1',
    categorySlug: 'dugsiga',
    estimatedReadingMinutes: 3,
    learningPathOrder: 6,
    xpReward: 40,
    description:
      'Hodan receives a bright green picture book and discovers drawings of Somali animals, trees, and stars on every page.',
    somaliSummary:
      'Hodan waxay heshay buug cagaaran oo sawirro qurux badan leh, waxayna ka baratay magacyada xayawaanka.',
    moralSomali: 'Buugaagtu waa furaha aqoonta iyo farxadda.',
    moralEnglish: 'Books open the door to knowledge and joyful discovery.',
    sentences: [
      {
        somaliText: 'Hodan waxay leedahay buug cusub oo midabkiisu yahay cagaar.',
        englishTranslation: 'Hodan has a new book whose colour is green.',
        sceneCaption: 'Hodan holds her bright green storybook with both hands.'
      },
      {
        somaliText: 'Bogga koowaad waxay ku aragtay sawirka geel weyn iyo geed quraac ah.',
        englishTranslation: 'On the first page she saw a picture of a tall camel and an acacia tree.',
        sceneCaption: 'The open book shows illustrations of a camel and a green tree.'
      },
      {
        somaliText: 'Bogga labaad waxaa ku sawiran shimbir buluug ah iyo qorrax huruud ah.',
        englishTranslation: 'On the second page are drawn a blue bird and a yellow sun.',
        sceneCaption: 'Hodan points her finger at the bird and the sun.'
      },
      {
        somaliText: 'Walaalkeed Cali ayaa la fariistay si ay u wada akhriyaan erayada.',
        englishTranslation: 'Her brother Cali sat down with her so they could read the words together.',
        sceneCaption: 'Hodan and Cali read side by side on the study bench.'
      },
      {
        somaliText: 'Hodan waxay farta ku fiiqday xarafka "B" oo ku qoran sabuuradda.',
        englishTranslation: 'Hodan pointed with her finger at the letter "B" written on the slate.',
        sceneCaption: 'Somali letters B, T, J are written neatly on the classroom slate.'
      },
      {
        somaliText: 'Markii ay dhammeeyeen akhriska, Hodan waxay si taxaddar leh buuggii u gelisay boorsadeeda.',
        englishTranslation: 'When they finished reading, Hodan carefully placed the book into her bag.',
        sceneCaption: 'Hodan keeps her beloved green book safe and clean.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Buug',
        englishMeaning: 'Book',
        pronunciationGuide: 'BUUG',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Hodan waxay akhrinaysaa buug cagaaran.',
        exampleEnglish: 'Hodan is reading a green book.',
        pictureKey: 'school_book'
      },
      {
        somaliWord: 'Sabuurad',
        englishMeaning: 'Chalkboard / Writing slate',
        pronunciationGuide: 'sa-BUU-rad',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Xarfaha waxaa lagu qoray sabuuradda.',
        exampleEnglish: 'The letters were written on the chalkboard.',
        pictureKey: 'pencil_slate'
      },
      {
        somaliWord: 'Shimbir',
        englishMeaning: 'Bird',
        pronunciationGuide: 'SHIM-bir',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Bogga waxaa ku sawiran shimbir.',
        exampleEnglish: 'A bird is drawn on the page.',
        pictureKey: 'bird'
      },
      {
        somaliWord: 'Geel',
        englishMeaning: 'Camel',
        pronunciationGuide: 'GEEL',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Sawirka geelu waa mid qurux badan.',
        exampleEnglish: 'The picture of the camel is beautiful.',
        pictureKey: 'camel'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Muxuu ahaa midabka buugga cusub ee Hodan?',
      promptEnglish: 'What colour was Hodan’s new book?',
      options: ['Cagaar (Green).', 'Madow (Black).', 'Guduud (Red).'],
      correctAnswer: 'Cagaar (Green).',
      explanationSomali: 'Sax! Buugga cusub ee Hodan midabkiisu wuxuu ahaa cagaar.',
      explanationEnglish: 'Correct! Hodan’s new storybook was green.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Hodan iyo walaalkeed Cali way wada akhriyeen buugga.',
      promptEnglish: 'True or False: Hodan and her brother Cali read the book together.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Cali wuxuu la fariistay Hodan si ay u wada akhriyaan.',
      explanationEnglish: 'True! Her brother Cali sat down to read the words with her.'
    },
    blankQuestion: {
      sentenceTemplate: 'Hodan waxay leedahay _____ cusub oo midabkiisu yahay cagaar.',
      promptEnglish: 'Hodan has a new _____ whose colour is green.',
      correctAnswer: 'buug',
      acceptedAnswers: ['buug', 'buuggii'],
      options: ['buug', 'doon', 'kalluun'],
      explanationSomali: 'Hodan waxay haysatay buug cusub oo cagaaran.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Bogga koowaad waxay ku aragtay sawirka _____ weyn iyo geed quraac ah.',
      promptEnglish: 'On the first page she saw a picture of a tall _____ and an acacia tree.',
      correctAnswer: 'geel',
      acceptedAnswers: ['geel'],
      options: ['geel', 'faynuus', 'roob'],
      explanationSomali: 'Bogga koowaad waxaa ku sawirnaa geel weyn.'
    }
  },
  {
    id: 'xiddigaha-habeenkii',
    title: 'Xiddigaha Habeenkii iyo Dayaxa',
    englishTitle: 'The Night Stars and the Moon',
    subtitle: 'Tirinta Xiddigaha Nuuraya ee Cirka',
    levelId: 'level-1',
    categorySlug: 'habeenkii',
    estimatedReadingMinutes: 3,
    learningPathOrder: 7,
    xpReward: 40,
    description:
      'Before bedtime, little Warsame sits with his father outside their Somali aqal to count the glowing stars and greet the crescent moon.',
    somaliSummary:
      'Warsame oo habeenkii aabbihiis la fariistay bannaanka aqalka si uu u tiriyo xiddigaha nuuraya.',
    moralSomali: 'Habeenkii waa waqti xasilloon oo nasasho iyo riyo wanaagsan leh.',
    moralEnglish: 'Nighttime brings calm beauty, wonder, and peaceful rest.',
    sentences: [
      {
        somaliText: 'Markii qorraxdu dhacday, cirku wuxuu noqday mid deggen oo madow.',
        englishTranslation: 'When the sun set, the sky became calm and dark.',
        sceneCaption: 'Twilight settles gently over the Somali countryside.'
      },
      {
        somaliText: 'Dayax nuuraya iyo xiddigo badan ayaa cirka ka soo muuqday.',
        englishTranslation: 'A glowing moon and many stars appeared in the sky.',
        sceneCaption: 'A golden crescent moon and bright stars shine overhead.'
      },
      {
        somaliText: 'Warsame iyo aabbihiis waxay ku fariisteen dermo taal aqalka hortiisa.',
        englishTranslation: 'Warsame and his father sat on a woven mat in front of the traditional home.',
        sceneCaption: 'Father and son sit beside a warm lantern outside the aqal.'
      },
      {
        somaliText: '"Hal, labo, saddex, afar, shan!" Warsame ayaa farta ku tiriyay xiddigaha.',
        englishTranslation: '"One, two, three, four, five!" Warsame counted the stars with his finger.',
        sceneCaption: 'Warsame points upward counting five bright stars.'
      },
      {
        somaliText: 'Neecaw qabow oo udgoon ayaa ka soo dhacday dhanka geedaha.',
        englishTranslation: 'A cool, fragrant breeze blew gently from the direction of the trees.',
        sceneCaption: 'The night breeze rustles the acacia leaves softly.'
      },
      {
        somaliText: 'Warsame indhihiisii way cuslaadeen, wuxuuna ku seexday nabad iyo riyo macaan.',
        englishTranslation: 'Warsame’s eyes grew sleepy, and he fell asleep in peace and sweet dreams.',
        sceneCaption: 'Warsame sleeps peacefully under the starry night sky.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Xiddig',
        englishMeaning: 'Star',
        pronunciationGuide: 'XID-dig (pharyngeal "x" + geminate "dd")',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Warsame wuxuu tiriyay shan xiddig.',
        exampleEnglish: 'Warsame counted five stars.',
        pictureKey: 'moon_stars'
      },
      {
        somaliWord: 'Aqal',
        englishMeaning: 'Traditional Somali dome home',
        pronunciationGuide: 'A-qal',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Waxay fariisteen aqalka hortiisa.',
        exampleEnglish: 'They sat in front of the traditional home.',
        pictureKey: 'somali_aqal'
      },
      {
        somaliWord: 'Faynuus',
        englishMeaning: 'Lantern',
        pronunciationGuide: 'fay-NUUS',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Faynuusku wuxuu bixinayaa iftiin diirran.',
        exampleEnglish: 'The lantern gives off a warm light.',
        pictureKey: 'lantern'
      },
      {
        somaliWord: 'Dermo',
        englishMeaning: 'Woven mat',
        pronunciationGuide: 'DER-mo',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Dermada dusha sare waa jilicsan tahay.',
        exampleEnglish: 'The surface of the woven mat is soft.',
        pictureKey: 'woven_mat'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Muxuu Warsame farta ku tiriyay habeenkii?',
      promptEnglish: 'What did Warsame count with his finger at night?',
      options: ['Xiddigaha cirka.', 'Kalluunka badda.', 'Baabuurta waddada.'],
      correctAnswer: 'Xiddigaha cirka.',
      explanationSomali: 'Sax! Warsame wuxuu tiriyay xiddigaha nuuraya ee cirka: "Hal, labo, saddex, afar, shan!"',
      explanationEnglish: 'Correct! Warsame counted the glowing stars in the night sky.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Dayaxa iyo xiddiguhu waxay soo baxaan habeenkii markii qorraxdu dhacdo.',
      promptEnglish: 'True or False: The moon and stars appear at night after the sun sets.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Habeenkii markii qorraxdu dhacdo ayaa dayaxa iyo xiddigaha la arkaa.',
      explanationEnglish: 'True! The moon and stars shine in the night sky.'
    },
    blankQuestion: {
      sentenceTemplate: 'Dayax nuuraya iyo _____ badan ayaa cirka ka soo muuqday.',
      promptEnglish: 'A glowing moon and many _____ appeared in the sky.',
      correctAnswer: 'xiddigo',
      acceptedAnswers: ['xiddigo', 'xiddigaha', 'xiddig'],
      options: ['xiddigo', 'kalluun', 'qalin'],
      explanationSomali: 'Habeenkii cirka waxaa ka soo muuqda dayax iyo xiddigo badan.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: '"Hal, labo, _____, afar, shan!" Warsame ayaa tiriyay.',
      promptEnglish: '"One, two, _____, four, five!" Warsame counted.',
      correctAnswer: 'saddex',
      acceptedAnswers: ['saddex'],
      options: ['saddex', 'toban', 'boqol'],
      explanationSomali: 'Tirada u dhexaysa labo iyo afar waa saddex (3).'
    }
  },
  {
    id: 'kalluunkii-dahabiga',
    title: 'Kalluunkii Dahabiga ahaa ee Badda',
    englishTitle: 'The Golden Fish of the Sea',
    subtitle: 'Safar Gaaban oo Hirarka Badda Buluugga ah Dhexdooda',
    levelId: 'level-1',
    categorySlug: 'tacabur',
    estimatedReadingMinutes: 3,
    learningPathOrder: 8,
    xpReward: 40,
    description:
      'In the clear blue waters of the Somali coast, a little golden fish swims past coral reefs and greets a passing wooden sailboat.',
    somaliSummary:
      'Kalluun yar oo midab dahabi ah leh ayaa ku dabaalanaya biyaha nadiifka ah ee xeebta Soomaaliya.',
    moralSomali: 'Baddeennu waa deegaan qurux badan oo mudan in la ilaaliyo.',
    moralEnglish: 'Our ocean is a vibrant home full of life that we must keep clean.',
    sentences: [
      {
        somaliText: 'Badda buluugga ah ee xeebta waxaa ku nool kalluun yar oo midab dahabi ah leh.',
        englishTranslation: 'In the blue sea along the coast lives a little fish with a golden colour.',
        sceneCaption: 'A golden fish swims gracefully through clear turquoise water.'
      },
      {
        somaliText: 'Kalluunku wuxuu jecel yahay inuu ku dhex dabaasho dhagaxaanta shacaabiga.',
        englishTranslation: 'The fish loves to swim among the colourful coral reef stones.',
        sceneCaption: 'Schools of small fish dart around the underwater reef.'
      },
      {
        somaliText: 'Subaxdii, ilayska qorraxda ayaa biyaha badda ka dhigay sidii muraayad dhalaalaysa.',
        englishTranslation: 'In the morning, the sunlight made the sea water sparkle like a shining mirror.',
        sceneCaption: 'Sunbeams shimmer across the surface of the sea.'
      },
      {
        somaliText: 'Kalluunkii yaraa wuxuu kor u eegay doon alwaax ah oo shiraac cad leh.',
        englishTranslation: 'The little fish looked up at a wooden sailboat with a white sail.',
        sceneCaption: 'A traditional wooden dhow glides gently across the waves.'
      },
      {
        somaliText: 'Carruur saaran doonta ayaa u gacan haatisay kalluunkii quruxda badnaa.',
        englishTranslation: 'Children aboard the boat waved happily at the beautiful fish.',
        sceneCaption: 'Smiling children peer over the boat rail at the golden fish.'
      },
      {
        somaliText: 'Kalluunkii wuxuu ku laabtay saaxiibbadiis isagoo ku faraxsan badda nadiifka ah.',
        englishTranslation: 'The fish returned to his friends feeling happy in the clean sea.',
        sceneCaption: 'The golden fish swims alongside his companions in the deep blue water.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Kalluun',
        englishMeaning: 'Fish',
        pronunciationGuide: 'kal-LUUN',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Kalluun dahabi ah ayaa badda ku dabaalanaya.',
        exampleEnglish: 'A golden fish is swimming in the sea.',
        pictureKey: 'fish'
      },
      {
        somaliWord: 'Doon',
        englishMeaning: 'Boat / Sailboat',
        pronunciationGuide: 'DOON',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Doontu waxay leedahay shiraac cad.',
        exampleEnglish: 'The boat has a white sail.',
        pictureKey: 'sailboat_doon'
      },
      {
        somaliWord: 'Qorrax',
        englishMeaning: 'Sun',
        pronunciationGuide: 'QOR-rax',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Ilayska qorraxda ayaa biyaha nuuriyay.',
        exampleEnglish: 'The light of the sun brightened the water.',
        pictureKey: 'sun'
      },
      {
        somaliWord: 'Biyo',
        englishMeaning: 'Water',
        pronunciationGuide: 'BI-yo',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Biyaha baddu waa buluug.',
        exampleEnglish: 'The water of the sea is blue.',
        pictureKey: 'water_well'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Muxuu kalluunkii yaraa kor u eegay markii uu dabaalanayay?',
      promptEnglish: 'What did the little fish look up at while swimming?',
      options: ['Doon alwaax ah oo shiraac cad leh.', 'Buur dheer.', 'Geel socda.'],
      correctAnswer: 'Doon alwaax ah oo shiraac cad leh.',
      explanationSomali: 'Sax! Kalluunku wuxuu kor u eegay doon shiraac cad leh oo badda maraysa.',
      explanationEnglish: 'Correct! The little fish looked up at a wooden sailboat with a white sail.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Kalluunku wuxuu ku nool yahay badda buluugga ah.',
      promptEnglish: 'True or False: The fish lives in the blue sea.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Kalluunku wuxuu ku dabaashaa biyaha badda.',
      explanationEnglish: 'True! The fish swims in the clear blue sea.'
    },
    blankQuestion: {
      sentenceTemplate: 'Badda buluugga ah waxaa ku nool _____ yar oo midab dahabi ah leh.',
      promptEnglish: 'In the blue sea lives a little _____ with a golden colour.',
      correctAnswer: 'kalluun',
      acceptedAnswers: ['kalluun', 'kalluunkii'],
      options: ['kalluun', 'libaax', 'buug'],
      explanationSomali: 'Badda waxaa ku nool kalluun yar oo dahabi ah.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Kalluunkii yaraa wuxuu kor u eegay _____ alwaax ah oo shiraac cad leh.',
      promptEnglish: 'The little fish looked up at a wooden _____ with a white sail.',
      correctAnswer: 'doon',
      acceptedAnswers: ['doon', 'doontii'],
      options: ['doon', 'sabuurad', 'dermo'],
      explanationSomali: 'Badda dusha sare waxaa maraysay doon shiraac cad leh.'
    }
  },
  {
    id: 'ubaxii-beerteenna',
    title: 'Ubaxii Yaraa ee Beerteenna',
    englishTitle: 'The Little Flower in Our Garden',
    subtitle: 'Sida Iniin Yar u Noqoto Ubax Qurux Badan',
    levelId: 'level-1',
    categorySlug: 'dabeecadda',
    estimatedReadingMinutes: 3,
    learningPathOrder: 9,
    xpReward: 40,
    description:
      'Little Maryan plants a tiny seed in the family garden, waters it every morning, and watches a bright blossom open.',
    somaliSummary:
      'Maryan oo iniin yar ku beertay beerta guriga, maalin walbana waraabisay ilaa uu ubax qurux badan ka soo baxay.',
    moralSomali: 'Shaqada yar ee maalin walba la qabto waxay dhashaa miro qurux badan.',
    moralEnglish: 'Gentle daily care helps small beginnings blossom into something wonderful.',
    sentences: [
      {
        somaliText: 'Maryan waxay ciidda beerta ku aastay iniin yar.',
        englishTranslation: 'Maryan planted a tiny seed in the garden soil.',
        sceneCaption: 'Maryan kneels in the garden patting warm soil over a seed.'
      },
      {
        somaliText: 'Subax walba waxay ku shubi jirtay biyo qabow.',
        englishTranslation: 'Every morning she poured cool water over it.',
        sceneCaption: 'Water droplets nourish the garden bed.'
      },
      {
        somaliText: 'Qorraxda diirran ayaa iyaduna u iftiimisay beerta.',
        englishTranslation: 'The warm sun also shone down upon the garden.',
        sceneCaption: 'Golden sunlight warms the sprouting green stem.'
      },
      {
        somaliText: 'Toddobaad ka dib, caleen yar oo cagaaran ayaa ciidda ka soo baxday.',
        englishTranslation: 'After a week, a tiny green leaf sprouted from the soil.',
        sceneCaption: 'Two bright green leaves emerge from the earth.'
      },
      {
        somaliText: 'Dhawaan waxaa furmay ubax guduudan oo aad u udgoon.',
        englishTranslation: 'Soon a fragrant red flower blossomed open.',
        sceneCaption: 'A vibrant red and gold flower blooms in the garden.'
      },
      {
        somaliText: 'Shimbiraha iyo balanbaallista ayaa u yimid inay eegaan ubaxa Maryan.',
        englishTranslation: 'Birds and butterflies came to admire Maryan’s flower.',
        sceneCaption: 'A songbird perches nearby admiring the garden blossom.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Ubax',
        englishMeaning: 'Flower',
        pronunciationGuide: 'U-bax',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Ubax guduudan ayaa beerta ka soo baxay.',
        exampleEnglish: 'A red flower bloomed in the garden.',
        pictureKey: 'flower_garden'
      },
      {
        somaliWord: 'Biyo',
        englishMeaning: 'Water',
        pronunciationGuide: 'BI-yo',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Maryan waxay ubaxa ku waraabisay biyo.',
        exampleEnglish: 'Maryan watered the flower with water.',
        pictureKey: 'water_well'
      },
      {
        somaliWord: 'Qorrax',
        englishMeaning: 'Sun',
        pronunciationGuide: 'QOR-rax',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Dhirtu waxay u baahan tahay iftiinka qorraxda.',
        exampleEnglish: 'Plants need the light of the sun.',
        pictureKey: 'sun'
      },
      {
        somaliWord: 'Shimbir',
        englishMeaning: 'Bird',
        pronunciationGuide: 'SHIM-bir',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Shimbir ayaa ubaxa ag fariisatay.',
        exampleEnglish: 'A bird perched near the flower.',
        pictureKey: 'bird'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay Maryan subax walba ku shubi jirtay iniinta ay beertay?',
      promptEnglish: 'What did Maryan pour every morning on the seed she planted?',
      options: ['Biyo qabow.', 'Ciid qallalan.', 'Dhagaxaan.'],
      correctAnswer: 'Biyo qabow.',
      explanationSomali: 'Sax! Maryan subax walba waxay ku waraabin jirtay biyo qabow.',
      explanationEnglish: 'Correct! Every morning Maryan watered the seed with cool water.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Dhirtu waxay u baahan tahay biyo iyo iftiinka qorraxda si ay u korto.',
      promptEnglish: 'True or False: Plants need water and sunlight to grow.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Biyaha iyo qorraxdu waxay ka caawiyeen iniinta inay noqoto ubax.',
      explanationEnglish: 'True! Water and warm sunlight helped the seed grow into a flower.'
    },
    blankQuestion: {
      sentenceTemplate: 'Dhawaan waxaa furmay _____ guduudan oo aad u udgoon.',
      promptEnglish: 'Soon a fragrant red _____ blossomed open.',
      correctAnswer: 'ubax',
      acceptedAnswers: ['ubax', 'ubaxii'],
      options: ['ubax', 'doon', 'buug'],
      explanationSomali: 'Iniintii waxay noqotay ubax guduudan oo udgoon.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Maryan waxay ciidda beerta ku aastay _____ yar.',
      promptEnglish: 'Maryan planted a tiny _____ in the garden soil.',
      correctAnswer: 'iniin',
      acceptedAnswers: ['iniin'],
      options: ['iniin', 'kubbad', 'faynuus'],
      explanationSomali: 'Maryan waxay ciidda ku aastay iniin yar.'
    }
  },
  {
    id: 'salaanta-wanaagsan',
    title: 'Salaanta Wanaagsan ee Samatar',
    englishTitle: 'Samatar’s Kind Greeting',
    subtitle: 'Erayga "Nabad" iyo Dhoolla-caddaynta',
    levelId: 'level-1',
    categorySlug: 'saaxiibtinimada',
    estimatedReadingMinutes: 3,
    learningPathOrder: 10,
    xpReward: 40,
    description:
      'Young Samatar walks through his neighbourhood greeting elders and friends with "Assalaamu Calaykum" and "Subax wanaagsan".',
    somaliSummary:
      'Samatar waa wiil yar oo edeb badan oo qof walba oo uu arko ku salaama weji furan iyo nabad.',
    moralSomali: 'Salaanta wanaagsan waxay dhalisaa jacayl iyo saaxiibtinimo.',
    moralEnglish: 'A warm greeting brings peace, respect, and friendship to everyone you meet.',
    sentences: [
      {
        somaliText: 'Samatar waa wiil yar oo jecel dadka deriska ah iyo saaxiibbadiis.',
        englishTranslation: 'Samatar is a young boy who loves his neighbours and his friends.',
        sceneCaption: 'Samatar steps out into the sunny village lane.'
      },
      {
        somaliText: 'Markii uu arko waayeelka, wuxuu ku yiraahdaa: "Assalaamu Calaykum, awoowe!"',
        englishTranslation: 'When he sees an elder, he says: "Peace be upon you, grandfather!"',
        sceneCaption: 'Samatar greets his grandfather respectfully beneath the shade tree.'
      },
      {
        somaliText: 'Awoowe wuxuu ugu jawaabaa dhoolla-caddayn iyo duco wanaagsan.',
        englishTranslation: 'Grandfather replies with a warm smile and a kind blessing.',
        sceneCaption: 'Grandfather smiles kindly and pats Samatar’s shoulder.'
      },
      {
        somaliText: 'Garoonka ciyaarta wuxuu kula kulmay saaxiibkiis Liibaan.',
        englishTranslation: 'At the playground he met his friend Liibaan.',
        sceneCaption: 'Samatar and Liibaan wave to each other in the courtyard.'
      },
      {
        somaliText: '"Ma nabad baa, saaxiib?" ayuu weydiiyay Samatar isagoo faraxsan.',
        englishTranslation: '"Is there peace, my friend?" asked Samatar happily.',
        sceneCaption: 'The two friends shake hands joyfully.'
      },
      {
        somaliText: '"Waa nabad iyo barwaaqo!" ayuu ku jawaabay Liibaan, wayna wada ciyaareen.',
        englishTranslation: '"It is peace and prosperity!" answered Liibaan, and they played together.',
        sceneCaption: 'Samatar and Liibaan play together happily.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Nabad',
        englishMeaning: 'Peace / Hello',
        pronunciationGuide: 'NA-bad',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Ma nabad baa, saaxiib?',
        exampleEnglish: 'Are you well (is there peace), friend?',
        pictureKey: 'family_courtyard'
      },
      {
        somaliWord: 'Saaxiib',
        englishMeaning: 'Friend',
        pronunciationGuide: 'saa-XIIB',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Liibaan waa saaxiib wanaagsan.',
        exampleEnglish: 'Liibaan is a good friend.',
        pictureKey: 'family_courtyard'
      },
      {
        somaliWord: 'Guri',
        englishMeaning: 'Home',
        pronunciationGuide: 'GU-ri',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Deriska gurigeenna waa dad fiican.',
        exampleEnglish: 'Our home neighbours are kind people.',
        pictureKey: 'somali_aqal'
      },
      {
        somaliWord: 'Dermo',
        englishMeaning: 'Woven mat',
        pronunciationGuide: 'DER-mo',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Awoowe wuxuu ku fadhiyaa dermo.',
        exampleEnglish: 'Grandfather is sitting on a woven mat.',
        pictureKey: 'woven_mat'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxaa Liibaan ku jawaabay markii Samatar ku yiri "Ma nabad baa?"',
      promptEnglish: 'What did Liibaan reply when Samatar asked "Ma nabad baa?"',
      options: [
        '"Waa nabad iyo barwaaqo!"',
        '"Ma garanayo."',
        '"Waan xanaaqsanahay."'
      ],
      correctAnswer: '"Waa nabad iyo barwaaqo!"',
      explanationSomali: 'Sax! Liibaan wuxuu ku jawaabay: "Waa nabad iyo barwaaqo!"',
      explanationEnglish: 'Correct! In Somali, "Waa nabad iyo barwaaqo" is a warm traditional reply.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Samatar si xushmad leh ayuu u salaamaa dadka waayeelka ah.',
      promptEnglish: 'True or False: Samatar greets elders respectfully.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Samatar wuxuu awoowe ku salaamay weji furan iyo xushmad.',
      explanationEnglish: 'True! Samatar greets elders with respect and kindness.'
    },
    blankQuestion: {
      sentenceTemplate: '"Ma _____ baa, saaxiib?" ayuu weydiiyay Samatar.',
      promptEnglish: '"Is there _____, my friend?" asked Samatar.',
      correctAnswer: 'nabad',
      acceptedAnswers: ['nabad'],
      options: ['nabad', 'roob', 'buur'],
      explanationSomali: 'Salaanta Soomaalida waxaa lagu weydiiyaa: "Ma nabad baa?"'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Garoonka ciyaarta wuxuu kula kulmay _____ Liibaan.',
      promptEnglish: 'At the playground he met his _____ Liibaan.',
      correctAnswer: 'saaxiibkiis',
      acceptedAnswers: ['saaxiibkiis', 'saaxiib'],
      options: ['saaxiibkiis', 'kalluunkiis', 'doontiis'],
      explanationSomali: 'Samatar wuxuu la kulmay saaxiibkiis Liibaan.'
    }
  },

  // ============================================================================
  // LEVEL 2 — AKHRISTE YAR (AGES 6–8): 10 COMPLETE ORIGINAL STORIES
  // ============================================================================
  {
    id: 'qoyska-caasha',
    title: 'Qoyska Caasha iyo Galabtii Sheekada',
    englishTitle: 'Caasha’s Family and Story Afternoon',
    subtitle: 'Wada-shaqaynta Qoyska iyo Sheekooyinka Ayeeyo',
    levelId: 'level-2',
    categorySlug: 'qoyska',
    estimatedReadingMinutes: 5,
    learningPathOrder: 11,
    xpReward: 50,
    paintedCoverOverride: '/illustrations/somali-kids/qoyska-caasha-painted-cover.jpg',
    description:
      'Every Friday afternoon, Caasha and her brother help tidy the courtyard, prepare traditional spiced tea and milk, and gather on the woven mat to read with their grandmother.',
    somaliSummary:
      'Maalin kasta oo Jimce ah, Caasha iyo qoyskeedu waxay wada nadiifiyaan barxadda guriga, ka dibna ayeeyo ayay buug la akhriyaan.',
    moralSomali: 'Qoyska is-caawiya wuxuu ku noolaadaa farxad iyo is-jacayl.',
    moralEnglish: 'A family that helps one another shares deeper joy and togetherness.',
    sentences: [
      {
        somaliText: 'Maalin kasta oo Jimce ah, qoyska Caasha waxay ku kulmaan barxadda weyn ee gurigooda.',
        englishTranslation: 'Every Friday, Caasha’s family gathers in the spacious courtyard of their home.',
        sceneCaption: 'The sunlit family courtyard surrounded by green plants.'
      },
      {
        somaliText: 'Caasha iyo walaalkeed Fu’aad waxay fidiyaan dermo midabbo badan leh oo lagu fariisto.',
        englishTranslation: 'Caasha and her brother Fu’aad spread out a colourful woven mat to sit upon.',
        sceneCaption: 'Caasha and Fu’aad unroll the traditional woven mat.'
      },
      {
        somaliText: 'Hooyo waxay diyaarisaa shaah udgoon oo qorfe iyo heyl lagu daray, carruurtana caano ayay u shubtaa.',
        englishTranslation: 'Mother prepares fragrant tea spiced with cinnamon and cardamom, and pours milk for the children.',
        sceneCaption: 'A traditional dhiil milk vessel and cups rest on a wooden tray.'
      },
      {
        somaliText: 'Ayeeyo Cambaro waxay soo qaaddaa buug weyn oo ay ku qoran yihiin sheekooyin iyo maahmaahyo Soomaaliyeed.',
        englishTranslation: 'Grandmother Cambaro brings a large book filled with Somali stories and proverbs.',
        sceneCaption: 'Grandmother opens the illustrated storybook in her lap.'
      },
      {
        somaliText: 'Caasha ayaa cod dheer ku akhrisa cutubka koowaad, qoyska oo dhanna si aamusnaan leh ayuu u dhageystaa.',
        englishTranslation: 'Caasha reads the first chapter aloud, and the whole family listens attentively.',
        sceneCaption: 'Caasha reads confidently while her family smiles.'
      },
      {
        somaliText: 'Aabbe wuxuu carruurta weydiiyaa macnaha erayada cusub ee ay ka barteen sheekada.',
        englishTranslation: 'Father asks the children the meanings of the new words they learned from the story.',
        sceneCaption: 'Fu’aad raises his hand eagerly to explain a Somali proverb.'
      },
      {
        somaliText: 'Galabtaasi waxay ku dhammaataa qosol, wada-sheekaysi, iyo jacayl qoys oo diirran.',
        englishTranslation: 'That afternoon ends with laughter, conversation, and warm family love.',
        sceneCaption: 'The multigenerational family enjoys the golden late-afternoon light.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Qoys',
        englishMeaning: 'Family',
        pronunciationGuide: 'QOYS',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Qoyska Caasha aad ayay isu jecel yihiin.',
        exampleEnglish: 'Caasha’s family loves one another dearly.',
        pictureKey: 'family_courtyard'
      },
      {
        somaliWord: 'Dhiil',
        englishMeaning: 'Traditional woven/wooden milk vessel',
        pronunciationGuide: 'DHIIL (retroflex "dh" + long "ii")',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Caanaha waxaa lagu shubaa dhiil.',
        exampleEnglish: 'Milk is kept in a traditional dhiil vessel.',
        pictureKey: 'milk_dhiil'
      },
      {
        somaliWord: 'Dermo',
        englishMeaning: 'Handwoven mat',
        pronunciationGuide: 'DER-mo',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Waxay fidiyeen dermo midabbo badan leh.',
        exampleEnglish: 'They spread out a colourful woven mat.',
        pictureKey: 'woven_mat'
      },
      {
        somaliWord: 'Buug',
        englishMeaning: 'Book',
        pronunciationGuide: 'BUUG',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Ayeeyo waxay soo qaadday buug sheeko ah.',
        exampleEnglish: 'Grandmother brought a storybook.',
        pictureKey: 'school_book'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay Ayeeyo Cambaro u soo qaadday carruurta galabtii Jimcaha?',
      promptEnglish: 'What did Grandmother Cambaro bring for the children on Friday afternoon?',
      options: [
        'Buug weyn oo ay ku qoran yihiin sheekooyin iyo maahmaahyo.',
        'Baaskiil cusub.',
        'Shabaag kalluumaysi.'
      ],
      correctAnswer: 'Buug weyn oo ay ku qoran yihiin sheekooyin iyo maahmaahyo.',
      explanationSomali: 'Sax! Ayeeyo Cambaro waxay soo qaadday buug weyn oo sheekooyin iyo maahmaahyo Soomaaliyeed ah.',
      explanationEnglish: 'Correct! Grandmother brought a large book of Somali stories and proverbs.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Caasha ayaa cod dheer ku akhrisay cutubka koowaad ee buugga.',
      promptEnglish: 'True or False: Caasha read the first chapter of the book aloud.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Caasha ayaa qoyska u akhrisay cutubka koowaad.',
      explanationEnglish: 'True! Caasha read the first chapter aloud while her family listened.'
    },
    blankQuestion: {
      sentenceTemplate: 'Caasha iyo walaalkeed waxay fidiyaan _____ midabbo badan leh.',
      promptEnglish: 'Caasha and her brother spread out a colourful _____.',
      correctAnswer: 'dermo',
      acceptedAnswers: ['dermo', 'dermada'],
      options: ['dermo', 'buur', 'doon'],
      explanationSomali: 'Barxadda guriga waxay ku fidiyeen dermo lagu fariisto.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Aabbe wuxuu carruurta weydiiyaa macnaha _____ cusub ee sheekada.',
      promptEnglish: 'Father asks the children the meanings of the new _____ in the story.',
      correctAnswer: 'erayada',
      acceptedAnswers: ['erayada', 'erayo'],
      options: ['erayada', 'dhagaxaanta', 'daruuraha'],
      explanationSomali: 'Aabbe wuxuu weydiiyaa macnaha erayada cusub.'
    }
  },
  {
    id: 'maalintii-koowaad-dugsiga',
    title: 'Maalintii Koowaad ee Dugsiga',
    englishTitle: 'The First Day of School',
    subtitle: 'Guuleed oo Baranaya Fasalka iyo Macallinkiisa Cusub',
    levelId: 'level-2',
    categorySlug: 'dugsiga',
    estimatedReadingMinutes: 5,
    learningPathOrder: 12,
    xpReward: 50,
    description:
      'On his first day of school, Guuleed feels a little shy at the classroom door, until Teacher Xasan and a friendly classmate invite him to write his name on the chalkboard.',
    somaliSummary:
      'Guuleed oo maalintiisii koowaad ee dugsiga la kulmaya macallin naxariis badan iyo arday saaxiibtinimo leh.',
    moralSomali: 'Dugsigu waa goob aqoonta iyo saaxiibbada wanaagsan laga helo.',
    moralEnglish: 'Courage on your first day of school opens the door to learning and new friendships.',
    sentences: [
      {
        somaliText: 'Guuleed wuxuu xirtay dharkiisii nadiifka ahaa ee dugsiga, boorsadiisana wuxuu ku ritay buug iyo qalin.',
        englishTranslation: 'Guuleed put on his clean school uniform and packed a notebook and pencil into his bag.',
        sceneCaption: 'Guuleed stands ready with his school bag in the morning.'
      },
      {
        somaliText: 'Markii uu gaaray albaabka fasalka, yara xishood ayaa galay sababtoo ah ardayda ma uusan aqoon.',
        englishTranslation: 'When he reached the classroom door, he felt a little shy because he did not know the students yet.',
        sceneCaption: 'Guuleed peeks into the bright classroom.'
      },
      {
        somaliText: 'Macallin Xasan ayaa u dhoolla-caddeeyay oo ku yiri: "Soo dhawoow, Guuleed! Halkan soo fariiso."',
        englishTranslation: 'Teacher Xasan smiled at him and said: "Welcome, Guuleed! Come sit right here."',
        sceneCaption: 'Teacher Xasan welcomes Guuleed warmly beside the chalkboard.'
      },
      {
        somaliText: 'Wiil la yiraahdo Sharmaarke oo kursiga xiga fadhiyay ayaa la wadaagay qalinkiisa midabka leh.',
        englishTranslation: 'A boy named Sharmaarke sitting at the next desk shared his coloured pencils with him.',
        sceneCaption: 'Sharmaarke offers Guuleed a bright green pencil.'
      },
      {
        somaliText: 'Macallinku wuxuu sabuuradda ku qoray xarfaha Af-Soomaaliga, ardayduna si farxad leh ayay ugu dhawaaqeen.',
        englishTranslation: 'The teacher wrote the Somali alphabet letters on the board, and the students pronounced them joyfully.',
        sceneCaption: 'Students read the Somali alphabet aloud together.'
      },
      {
        somaliText: 'Guuleed wuxuu sabuuradda ku qoray magaciisa, fasalka oo dhanna sacab ayuu u tumay.',
        englishTranslation: 'Guuleed wrote his own name on the chalkboard, and the whole class applauded for him.',
        sceneCaption: 'Guuleed beams with pride after writing his name.'
      },
      {
        somaliText: 'Duhurkii markii uu guriga ku noqday, wuxuu hooyadiis u sheegay inuu aad u jeclaaday dugsiga.',
        englishTranslation: 'At noon when he returned home, he told his mother that he loved school very much.',
        sceneCaption: 'Guuleed eagerly shows his notebook to his mother.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Dugsi',
        englishMeaning: 'School',
        pronunciationGuide: 'DUG-si',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Guuleed aad ayuu u jeclaaday dugsiga.',
        exampleEnglish: 'Guuleed loved school very much.',
        pictureKey: 'pencil_slate'
      },
      {
        somaliWord: 'Buug',
        englishMeaning: 'Book / Notebook',
        pronunciationGuide: 'BUUG',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Boorsada waxaa ku jira buug iyo qalin.',
        exampleEnglish: 'In the bag are a book and a pencil.',
        pictureKey: 'school_book'
      },
      {
        somaliWord: 'Sabuurad',
        englishMeaning: 'Chalkboard',
        pronunciationGuide: 'sa-BUU-rad',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Guuleed wuxuu magaciisa ku qoray sabuuradda.',
        exampleEnglish: 'Guuleed wrote his name on the chalkboard.',
        pictureKey: 'pencil_slate'
      },
      {
        somaliWord: 'Saaxiib',
        englishMeaning: 'Friend / Classmate',
        pronunciationGuide: 'saa-XIIB',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Sharmaarke wuxuu noqday saaxiibka Guuleed.',
        exampleEnglish: 'Sharmaarke became Guuleed’s friend.',
        pictureKey: 'family_courtyard'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Muxuu Guuleed ku qoray sabuuradda fasalka?',
      promptEnglish: 'What did Guuleed write on the classroom chalkboard?',
      options: ['Magaciisa.', 'Sheeko dheer.', 'Tirada xiddigaha.'],
      correctAnswer: 'Magaciisa.',
      explanationSomali: 'Sax! Guuleed wuxuu sabuuradda ku qoray magaciisa, ardayduna sacab ayay u tumeen.',
      explanationEnglish: 'Correct! Guuleed wrote his name on the chalkboard.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Sharmaarke wuxuu Guuleed la wadaagay qalinkiisa midabka leh.',
      promptEnglish: 'True or False: Sharmaarke shared his coloured pencil with Guuleed.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Sharmaarke si saaxiibtinimo leh ayuu ula wadaagay qalinkiisa.',
      explanationEnglish: 'True! Sharmaarke kindly shared his coloured pencil.'
    },
    blankQuestion: {
      sentenceTemplate: 'Macallinku wuxuu _____ ku qoray xarfaha Af-Soomaaliga.',
      promptEnglish: 'The teacher wrote the Somali letters on the _____.',
      correctAnswer: 'sabuuradda',
      acceptedAnswers: ['sabuuradda', 'sabuurad'],
      options: ['sabuuradda', 'doonta', 'ceelka'],
      explanationSomali: 'Macallin Xasan wuxuu xarfaha ku qoray sabuuradda.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Boorsadiisa wuxuu ku ritay _____ iyo qalin.',
      promptEnglish: 'He packed a _____ and a pencil into his bag.',
      correctAnswer: 'buug',
      acceptedAnswers: ['buug'],
      options: ['buug', 'kalluun', 'geel'],
      explanationSomali: 'Guuleed wuxuu boorsada ku ritay buug iyo qalin.'
    }
  },
  {
    id: 'laba-saaxiib-iyo-geedka',
    title: 'Laba Saaxiib iyo Geedka Haracsan',
    englishTitle: 'Two Friends and the Shady Tree',
    subtitle: 'Sida Wada-jirka loogu Beero Geed Cusub',
    levelId: 'level-2',
    categorySlug: 'saaxiibtinimada',
    estimatedReadingMinutes: 4,
    learningPathOrder: 13,
    xpReward: 50,
    description:
      'Best friends Fartuun and Leyla work together to plant and protect a young sapling near their playground so everyone will have cool shade.',
    somaliSummary:
      'Fartuun iyo Leyla oo ah laba saaxiib oo iska kaashanaya beerista iyo ilaalinta geed yar.',
    moralSomali: 'Hawl wada-jir loo qabto miro waara ayay dhashaa.',
    moralEnglish: 'Working together with a friend creates lasting blessings for the whole community.',
    sentences: [
      {
        somaliText: 'Fartuun iyo Leyla waa laba saaxiib oo ku wada barbaarray isku xaafad.',
        englishTranslation: 'Fartuun and Leyla are two close friends who grew up in the same neighbourhood.',
        sceneCaption: 'Fartuun and Leyla walk together carrying a small tree sapling.'
      },
      {
        somaliText: 'Maalin kulul ayay arkeen in barxadda ciyaarta aysan lahayn geed hoos laga harsado.',
        englishTranslation: 'On a hot day they noticed that the playground had no tree to provide cool shade.',
        sceneCaption: 'The sunny courtyard has open soil waiting for a tree.'
      },
      {
        somaliText: 'Waxay go’aansadeen inay wada beeraan geed talaal ah oo weynaada.',
        englishTranslation: 'They decided to plant a young sapling together that would grow tall.',
        sceneCaption: 'Together they dig a neat hole in the earth.'
      },
      {
        somaliText: 'Fartuun waxay keentay baaldi biyo ah, Leylana waxay geedka ku wareejisay ood yar oo ka ilaalisa riyaha.',
        englishTranslation: 'Fartuun brought a bucket of water, and Leyla built a small protective fence around the tree to keep goats away.',
        sceneCaption: 'Leyla places small branches around the sapling while Fartuun waters it.'
      },
      {
        somaliText: 'Maalin kasta dugsiga ka dib, labada saaxiib way soo booqan jireen geedkooda.',
        englishTranslation: 'Every day after school, the two friends visited and cared for their tree.',
        sceneCaption: 'The sapling grows taller with bright green branches.'
      },
      {
        somaliText: 'Sannad ka dib, geedkii wuxuu yeeshay laamo ballaaran oo carruurta xaafaddu hoos fariistaan.',
        englishTranslation: 'A year later, the tree had wide leafy branches where the neighbourhood children sat in the shade.',
        sceneCaption: 'Children read and play beneath the cool shade of the tree.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Geed',
        englishMeaning: 'Tree',
        pronunciationGuide: 'GEED',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Waxay wada beereen geed cusub.',
        exampleEnglish: 'They planted a new tree together.',
        pictureKey: 'acacia_tree'
      },
      {
        somaliWord: 'Saaxiib',
        englishMeaning: 'Friend',
        pronunciationGuide: 'saa-XIIB',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Fartuun iyo Leyla waa laba saaxiib.',
        exampleEnglish: 'Fartuun and Leyla are two friends.',
        pictureKey: 'family_courtyard'
      },
      {
        somaliWord: 'Biyo',
        englishMeaning: 'Water',
        pronunciationGuide: 'BI-yo',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Fartuun waxay keentay baaldi biyo ah.',
        exampleEnglish: 'Fartuun brought a bucket of water.',
        pictureKey: 'water_well'
      },
      {
        somaliWord: 'Ri’',
        englishMeaning: 'Goat',
        pronunciationGuide: 'RI’',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Oodda ayaa geedka ka ilaalisa riyaha.',
        exampleEnglish: 'The fence protects the tree from goats.',
        pictureKey: 'goat'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay Leyla ku wareejisay geedka yar si ay u ilaaliso?',
      promptEnglish: 'What did Leyla place around the young tree to protect it?',
      options: [
        'Ood yar oo ka ilaalisa riyaha.',
        'Biyo badan.',
        'Buugaag dugsi.'
      ],
      correctAnswer: 'Ood yar oo ka ilaalisa riyaha.',
      explanationSomali: 'Sax! Leyla waxay geedka ku wareejisay ood yar si aysan riyuhu u cunin.',
      explanationEnglish: 'Correct! Leyla built a small fence around the sapling to protect it from goats.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Geedkii markii uu weynaaday carruurta xaafadda ayaa hoos fariisatay.',
      promptEnglish: 'True or False: When the tree grew tall, the neighbourhood children sat in its shade.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Geedkii wuxuu yeeshay laamo ballaaran oo harac fiican leh.',
      explanationEnglish: 'True! The tree grew wide branches offering cool shade.'
    },
    blankQuestion: {
      sentenceTemplate: 'Fartuun waxay keentay baaldi _____ ah si ay geedka u waraabiso.',
      promptEnglish: 'Fartuun brought a bucket of _____ to water the tree.',
      correctAnswer: 'biyo',
      acceptedAnswers: ['biyo'],
      options: ['biyo', 'dhagax', 'caano'],
      explanationSomali: 'Geedka waxaa lagu waraabiyaa biyo.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Waxay go’aansadeen inay wada beeraan _____ talaal ah.',
      promptEnglish: 'They decided to plant a young _____ together.',
      correctAnswer: 'geed',
      acceptedAnswers: ['geed'],
      options: ['geed', 'faynuus', 'doon'],
      explanationSomali: 'Labada saaxiib waxay wada beereen geed.'
    }
  },
  {
    id: 'suuqa-khudaarta',
    title: 'Suuqa Khudaarta iyo Xisaabta',
    englishTitle: 'The Vegetable Market and Counting',
    subtitle: 'Cumar oo Hooyadiis kala Shaqaynaya Dambiisha Suuqa',
    levelId: 'level-2',
    categorySlug: 'qoyska',
    estimatedReadingMinutes: 4,
    learningPathOrder: 14,
    xpReward: 50,
    description:
      'Cumar accompanies his mother to the bustling morning market, carrying the woven basket and using his school math skills to count ripe mangoes, bananas, and tomatoes.',
    somaliSummary:
      'Cumar oo hooyadiis u raacay suuqa khudaarta, dambiisha u sida, xisaabtana ku tirinaya miraha.',
    moralSomali: 'Aqoonta aad dugsiga ka barato waxay kaa caawisaa nolosha maalinlaha ah.',
    moralEnglish: 'What you learn at school helps you serve your family in everyday life.',
    sentences: [
      {
        somaliText: 'Subaxdii Sabtida, Cumar wuxuu qaaday dambiil weyn oo caws ka samaysan wuxuuna raacay hooyadiis.',
        englishTranslation: 'On Saturday morning, Cumar picked up a large woven straw basket and went with his mother.',
        sceneCaption: 'Cumar carries a traditional woven basket beside his mother.'
      },
      {
        somaliText: 'Suuqa khudaarta wuxuu ahaa mid cammiran oo ay yaallaan miro midabbo kala duwan leh.',
        englishTranslation: 'The fruit and vegetable market was lively and filled with produce of many colours.',
        sceneCaption: 'Bright stalls display mangoes, bananas, limes, and tomatoes.'
      },
      {
        somaliText: 'Hooyo waxay dooratay afar cambe oo bisil iyo lix moos oo huruud ah.',
        englishTranslation: 'Mother selected four ripe mangoes and six yellow bananas.',
        sceneCaption: 'Ripe golden mangoes and bananas are placed into the basket.'
      },
      {
        somaliText: '"Cumarow, isugeynta afarta cambe iyo lixda moos waa imisa?" ayay weydiisay hooyadiis.',
        englishTranslation: '"Cumar, what is the sum of the four mangoes and the six bananas?" asked his mother.',
        sceneCaption: 'Cumar thinks carefully and counts the fruit.'
      },
      {
        somaliText: '"Afar lagu daray lix waa toban mirood, hooyo!" ayuu Cumar si kalsooni leh ugu jawaabay.',
        englishTranslation: '"Four plus six is ten fruits, Mother!" Cumar answered confidently.',
        sceneCaption: 'The market vendor smiles and praises Cumar’s quick counting.'
      },
      {
        somaliText: 'Guriga ayay ku soo laabteen iyagoo sida khudaar cusub oo qoyska oo dhan ku filan.',
        englishTranslation: 'They returned home carrying fresh produce enough for the whole family.',
        sceneCaption: 'Cumar and his mother wash the fresh fruit at home.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Dambiil',
        englishMeaning: 'Woven market basket',
        pronunciationGuide: 'dam-BIIL',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Cumar wuxuu qaaday dambiil weyn.',
        exampleEnglish: 'Cumar carried a large woven basket.',
        pictureKey: 'market_basket'
      },
      {
        somaliWord: 'Toban',
        englishMeaning: 'Ten (10)',
        pronunciationGuide: 'TO-ban',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Afar lagu daray lix waa toban.',
        exampleEnglish: 'Four plus six is ten.',
        pictureKey: 'pencil_slate'
      },
      {
        somaliWord: 'Qoys',
        englishMeaning: 'Family',
        pronunciationGuide: 'QOYS',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Khudaartu waxay ku filan tahay qoyska.',
        exampleEnglish: 'The produce is enough for the family.',
        pictureKey: 'family_courtyard'
      },
      {
        somaliWord: 'Qorrax',
        englishMeaning: 'Sun',
        pronunciationGuide: 'QOR-rax',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Subaxdii qorraxdu waa iftiin.',
        exampleEnglish: 'In the morning the sun is bright.',
        pictureKey: 'sun'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Imisa mirood ayay isku noqdeen afarta cambe iyo lixda moos?',
      promptEnglish: 'How many fruits in total were the four mangoes and six bananas?',
      options: ['Toban (10) mirood.', 'Shan (5) mirood.', 'Labaatan (20) mirood.'],
      correctAnswer: 'Toban (10) mirood.',
      explanationSomali: 'Sax! Afar lagu daray lix (4 + 6) waa toban (10) mirood.',
      explanationEnglish: 'Correct! Four plus six equals ten fruits.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Cumar wuxuu hooyadiis u qaaday dambiisha suuqa.',
      promptEnglish: 'True or False: Cumar carried the market basket for his mother.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Cumar wuxuu hooyadiis ka caawiyay qaadista dambiisha.',
      explanationEnglish: 'True! Cumar helped his mother carry the woven market basket.'
    },
    blankQuestion: {
      sentenceTemplate: 'Cumar wuxuu qaaday _____ weyn oo caws ka samaysan.',
      promptEnglish: 'Cumar picked up a large woven straw _____.',
      correctAnswer: 'dambiil',
      acceptedAnswers: ['dambiil', 'dambiisha'],
      options: ['dambiil', 'doon', 'buur'],
      explanationSomali: 'Khudaarta waxaa lagu ritaa dambiil caws ka samaysan.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: '"Afar lagu daray lix waa _____ mirood, hooyo!" ayuu yiri Cumar.',
      promptEnglish: '"Four plus six is _____ fruits, Mother!" said Cumar.',
      correctAnswer: 'toban',
      acceptedAnswers: ['toban'],
      options: ['toban', 'saddex', 'hal'],
      explanationSomali: '4 + 6 = 10 (toban).'
    }
  },
  {
    id: 'diinkii-xigmadda-lahaa',
    title: 'Diinkii Xigmadda Lahaa iyo Jiilaalka',
    englishTitle: 'The Wise Tortoise and the Dry Season',
    subtitle: 'Sheeko Xayawaan oo Ku Saabsan Fikirka iyo Dulqaadka',
    levelId: 'level-2',
    categorySlug: 'xayawaanka',
    estimatedReadingMinutes: 5,
    learningPathOrder: 15,
    xpReward: 50,
    description:
      'When the dry season arrives and the shallow ponds dry up, the patient tortoise remembers an ancient shaded spring at the foot of the rocky hill.',
    somaliSummary:
      'Diin xigmad badan oo xilliga jiilaalka xayawaanka kale u tilmaamaya il-biyood qabow oo buurta hoosteeda ku taal.',
    moralSomali: 'Deggenaanta iyo xigmaddu waxay ka xoog badan yihiin degdegga.',
    moralEnglish: 'Calm wisdom and steady patience solve problems better than haste.',
    sentences: [
      {
        somaliText: 'Xilligii jiilaalka, balliyadii yaryaraa ee miyiga way gureen, xayawaankiina biyo ayay raadiyeen.',
        englishTranslation: 'During the dry season, the small countryside ponds dried up, and the animals searched for water.',
        sceneCaption: 'Animals gather beneath an acacia tree looking across the dry plain.'
      },
      {
        somaliText: 'Bakaylihii iyo dhurwaagii meel walba way u carareen iyagoo aan waxba ka fekerin.',
        englishTranslation: 'The hare and the hyena ran in every direction without thinking carefully.',
        sceneCaption: 'Dust rises as the hasty animals rush back and forth.'
      },
      {
        somaliText: 'Diinkii duqa ahaa ee xigmadda lahaa wuxuu si deggen u xusuustay il-biyood qadiimi ah.',
        englishTranslation: 'The wise old tortoise calmly remembered an ancient natural spring.',
        sceneCaption: 'The tortoise pauses thoughtfully and looks toward the shaded cliff.'
      },
      {
        somaliText: '"I soo raaca, oo talaabo xasilloon ku socda," ayuu diinkii ku yiri xayawaankii.',
        englishTranslation: '"Follow me, and walk with steady steps," the tortoise said to the animals.',
        sceneCaption: 'The tortoise leads the animals along a shaded rocky trail.'
      },
      {
        somaliText: 'Talaabo-talaabo ayuu uga hor kacay ilaa ay gaareen hooska dhagax weyn oo biyo qabow ka burqanayaan.',
        englishTranslation: 'Step by step he led them until they reached the shade of a great boulder where cool water bubbled forth.',
        sceneCaption: 'Clear spring water flows into a stone basin beneath the trees.'
      },
      {
        somaliText: 'Xayawaankii oo dhan waxay u mahadceliyeen diinkii xigmadda iyo samirka badnaa.',
        englishTranslation: 'All the animals thanked the tortoise for his wisdom and patience.',
        sceneCaption: 'The animals drink peacefully together beside the wise tortoise.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Diin',
        englishMeaning: 'Tortoise',
        pronunciationGuide: 'DIIN',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Diinkii wuxuu lahaa xigmad iyo samir.',
        exampleEnglish: 'The tortoise had wisdom and patience.',
        pictureKey: 'tortoise'
      },
      {
        somaliWord: 'Ceel',
        englishMeaning: 'Well / Water spring',
        pronunciationGuide: 'CEEL (pharyngeal "c")',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Waxay gaareen il-biyood iyo ceel qabow.',
        exampleEnglish: 'They reached a cool water spring and well.',
        pictureKey: 'water_well'
      },
      {
        somaliWord: 'Buur',
        englishMeaning: 'Hill / Rocky cliff',
        pronunciationGuide: 'BUUR',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Biyuhu waxay ka burqanayeen buurta hoosteeda.',
        exampleEnglish: 'The water bubbled at the foot of the hill.',
        pictureKey: 'mountain_hill'
      },
      {
        somaliWord: 'Geed',
        englishMeaning: 'Tree',
        pronunciationGuide: 'GEED',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Hooska geedka ayay ku nasteeen.',
        exampleEnglish: 'They rested in the shade of the tree.',
        pictureKey: 'acacia_tree'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Sidee ayuu diinkii ku helay biyaha xilligii jiilaalka?',
      promptEnglish: 'How did the tortoise find water during the dry season?',
      options: [
        'Si deggen ayuu u fekeray oo wuxuu xusuustay il-biyood qadiimi ah.',
        'Wuu orday isagoo aan fekerin.',
        'Daruuraha ayuu fuulay.'
      ],
      correctAnswer: 'Si deggen ayuu u fekeray oo wuxuu xusuustay il-biyood qadiimi ah.',
      explanationSomali: 'Sax! Diinkii xigmadda lahaa si deggen ayuu u xusuustay halka il-biyoodku ku yaallo.',
      explanationEnglish: 'Correct! The wise tortoise thought calmly and remembered the ancient spring.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Xayawaankii oo dhan waxay u mahadceliyeen diinkii.',
      promptEnglish: 'True or False: All the animals thanked the tortoise.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Xayawaanku aad ayay ugu mahadceliyeen xigmadda diinka.',
      explanationEnglish: 'True! The animals were grateful for the tortoise’s guidance.'
    },
    blankQuestion: {
      sentenceTemplate: 'Diinkii duqa ahaa ee xigmadda lahaa wuxuu xusuustay _____ qadiimi ah.',
      promptEnglish: 'The wise old tortoise remembered an ancient _____.',
      correctAnswer: 'il-biyood',
      acceptedAnswers: ['il-biyood', 'ceel', 'biyo'],
      options: ['il-biyood', 'baabuur', 'sabuurad'],
      explanationSomali: 'Diinku wuxuu xusuustay il-biyood qabow oo dhagaxa hoostiisa ku taal.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: '"I soo raaca, oo _____ xasilloon ku socda," ayuu yiri diinkii.',
      promptEnglish: '"Follow me, and walk with steady _____," said the tortoise.',
      correctAnswer: 'talaabo',
      acceptedAnswers: ['talaabo'],
      options: ['talaabo', 'qaylo', 'hurdo'],
      explanationSomali: 'Diinku wuxuu kula taliyay inay talaabo xasilloon ku socdaan.'
    }
  },
  {
    id: 'doonta-xeebta-berbera',
    title: 'Doonta Cad ee Xeebta Berbera',
    englishTitle: 'The White Sailboat on the Berbera Coast',
    subtitle: 'jamaal iyo Aabbihiis oo Daawanaya Maraakiibta iyo Doomaha',
    levelId: 'level-2',
    categorySlug: 'tacabur',
    estimatedReadingMinutes: 5,
    learningPathOrder: 16,
    xpReward: 50,
    description:
      'Jamaal visits the historic port coast of Berbera with his father and learns how traditional wooden sailboats use the sea wind to travel.',
    somaliSummary:
      'Jamaal oo aabbihiis u raacay xeebta Berbera si uu u barto sida doomaha shiraaca lihi ugu socdaan dabaysha badda.',
    moralSomali: 'Aqoonta badda iyo dabayshu waa xirfad fac weyn oo Soomaaliyeed.',
    moralEnglish: 'Understanding the sea and the wind connects us to centuries of Somali maritime heritage.',
    sentences: [
      {
        somaliText: 'Subax jimce ah, Jamaal iyo aabbihiis waxay u lugeeyeen xeebta bacaadka cad ee Berbera.',
        englishTranslation: 'On a Friday morning, Jamaal and his father walked along the white sandy beach of Berbera.',
        sceneCaption: 'Father and son walk along the sunny Berbera shoreline.'
      },
      {
        somaliText: 'Dabaysha badda ayaa si macaan u soo dhacaysay, hirarkuna xeebta ayay ku soo jabayeen.',
        englishTranslation: 'The sea breeze blew pleasantly, and the gentle waves rolled onto the shore.',
        sceneCaption: 'Turquoise waves lap gently against the golden sand.'
      },
      {
        somaliText: 'Jamaal wuxuu farta ku fiiqay doon weyn oo alwaax ah oo shiraaceeda cad dabayshu buuxisay.',
        englishTranslation: 'Jamaal pointed at a large wooden boat whose white sail was filled by the wind.',
        sceneCaption: 'A traditional Somali dhow sails across the horizon.'
      },
      {
        somaliText: '"Aabbe, sidee ayay doontu u socotaa iyadoo aan matoor lahayn?" ayuu weydiiyay Jamaal.',
        englishTranslation: '"Father, how does the boat move without an engine?" asked Jamaal.',
        sceneCaption: 'Jamaal looks up curiously at his father.'
      },
      {
        somaliText: 'Aabbihiis ayaa u sharxay in shiraaca cad uu qabto xoogga dabaysha, taasina ay doonta hore u riixdo.',
        englishTranslation: 'His father explained that the white sail catches the power of the wind, which pushes the boat forward.',
        sceneCaption: 'Wind lines fill the triangular sail of the boat.'
      },
      {
        somaliText: 'Kalluumaysatadii doonta saarnaa ayaa xeebta ku soo xirtay iyagoo wada kalluun cusub.',
        englishTranslation: 'The fishermen aboard the boat docked at the shore bringing fresh fish.',
        sceneCaption: 'Fishermen moor their wooden boat near the harbour.'
      },
      {
        somaliText: 'Jamaal wuxuu ku riyooday inuu maalin uun noqdo badmaax yaqaanna jihooyinka badda.',
        englishTranslation: 'Jamaal dreamed of one day becoming a navigator who knows the directions of the sea.',
        sceneCaption: 'Jamaal gazes out across the sparkling sea.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Doon',
        englishMeaning: 'Sailboat / Wooden dhow',
        pronunciationGuide: 'DOON',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Doontu waxay ku socotaa xoogga dabaysha.',
        exampleEnglish: 'The boat moves by the power of the wind.',
        pictureKey: 'sailboat_doon'
      },
      {
        somaliWord: 'Kalluun',
        englishMeaning: 'Fish',
        pronunciationGuide: 'kal-LUUN',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Kalluumaysatadu waxay keeneen kalluun cusub.',
        exampleEnglish: 'The fishermen brought fresh fish.',
        pictureKey: 'fish'
      },
      {
        somaliWord: 'Qorrax',
        englishMeaning: 'Sun',
        pronunciationGuide: 'QOR-rax',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Qorraxda xeebtu waa mid dhalaalaysa.',
        exampleEnglish: 'The coastal sun is bright.',
        pictureKey: 'sun'
      },
      {
        somaliWord: 'Xiddig',
        englishMeaning: 'Star (used by sailors)',
        pronunciationGuide: 'XID-dig',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Badmaaxdu habeenkii waxay eegaan xiddigaha.',
        exampleEnglish: 'Sailors look at the stars at night.',
        pictureKey: 'moon_stars'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxaa hore u riixa doonta shiraaca leh?',
      promptEnglish: 'What pushes the sailboat forward across the water?',
      options: [
        'Xoogga dabaysha ee shiraaca gala.',
        'Geel jiidaya.',
        'Dhagaxaanta badda.'
      ],
      correctAnswer: 'Xoogga dabaysha ee shiraaca gala.',
      explanationSomali: 'Sax! Shiraaca cad wuxuu qabtaa xoogga dabaysha badda, taasina doonta ayay hore u waddaa.',
      explanationEnglish: 'Correct! The white sail catches the wind to propel the boat forward.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Jamaal iyo aabbihiis waxay booqdeen xeebta Berbera.',
      promptEnglish: 'True or False: Jamaal and his father visited the Berbera coast.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Waxay subax jimce ah u lugeeyeen xeebta bacaadka cad ee Berbera.',
      explanationEnglish: 'True! They walked along the white sandy beach of Berbera.'
    },
    blankQuestion: {
      sentenceTemplate: 'Shiraaca cad wuxuu qabtaa xoogga _____, taasina doonta ayay hore u riixdaa.',
      promptEnglish: 'The white sail catches the power of the _____, pushing the boat forward.',
      correctAnswer: 'dabaysha',
      acceptedAnswers: ['dabaysha', 'dabayl'],
      options: ['dabaysha', 'ciidda', 'buugga'],
      explanationSomali: 'Shiraacu wuxuu ku shaqeeyaa xoogga dabaysha.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Kalluumaysatadii doonta saarnaa waxay keeneen _____ cusub.',
      promptEnglish: 'The fishermen aboard the boat brought fresh _____.',
      correctAnswer: 'kalluun',
      acceptedAnswers: ['kalluun'],
      options: ['kalluun', 'canjeero', 'sabuurad'],
      explanationSomali: 'Kalluumaysatadu badda waxay ka soo dabtaan kalluun.'
    }
  },
  {
    id: 'roobkii-la-sugayay',
    title: 'Roobkii La Sugayay ee Tuulada',
    englishTitle: 'The Long-Awaited Village Rain',
    subtitle: 'Sida Reer Miyigu ugu Diyaar-garoobaan Xilliga Roobka',
    levelId: 'level-2',
    categorySlug: 'dabeecadda',
    estimatedReadingMinutes: 4,
    learningPathOrder: 17,
    xpReward: 50,
    description:
      'As dark rain clouds gather over the valley, young Hani helps her family prepare the rainwater cisterns and celebrates the return of green pastures.',
    somaliSummary:
      'Hani oo qoyskeeda kala qayb-qaadanaysa diyaarinta berkedaha biyaha ka hor inta uusan da’in roobka mahiigaanka ah.',
    moralSomali: 'Kaydsiga biyaha roobku waa xigmad lagama maarmaan u ah nolosha.',
    moralEnglish: 'Preparing ahead and conserving rainwater sustains the whole community.',
    sentences: [
      {
        somaliText: 'Daruuro waaweyn oo biyo sida ayaa galabtii isku gadaamay cirka tuulada.',
        englishTranslation: 'Large rain-bearing clouds gathered across the village sky in the afternoon.',
        sceneCaption: 'Deep grey clouds roll over the green hills.'
      },
      {
        somaliText: 'Hani iyo walaalaheed waxay nadiifiyeen mareegta biyaha u leexisa berkedda guriga.',
        englishTranslation: 'Hani and her siblings cleaned the channel that directs rainwater into the home cistern.',
        sceneCaption: 'Children sweep leaves away from the clean stone water channel.'
      },
      {
        somaliText: 'Daqiiqado ka dib, roob mahiigaan ah oo qabow ayaa si xoog leh u da’ay.',
        englishTranslation: 'Minutes later, a cool, abundant rain began to fall steadily.',
        sceneCaption: 'Fresh rain showers pour across the valley and rooftops.'
      },
      {
        somaliText: 'Berkeddii biyaha ayaa buuxsantay, dhirtii oommanaydna caleemaheeda ayaa soo noolaaday.',
        englishTranslation: 'The water cistern filled up, and the thirsty plants revived their green leaves.',
        sceneCaption: 'Clean rainwater fills the stone reservoir.'
      },
      {
        somaliText: 'Riyihii iyo geeliiba waxay heleen biyo badan iyo caws cusub oo soo biqilay.',
        englishTranslation: 'Both the goats and the camels found plenty of water and freshly sprouted grass.',
        sceneCaption: 'Goats and camels graze happily on the green hillside.'
      },
      {
        somaliText: 'Qoysaska tuulada oo dhan waxay ku farxeen barwaaqada iyo nimcada roobka.',
        englishTranslation: 'All the village families rejoiced in the prosperity and blessing of the rain.',
        sceneCaption: 'A rainbow arches over the green Somali valley.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Roob',
        englishMeaning: 'Rain',
        pronunciationGuide: 'ROOB',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Roob mahiigaan ah ayaa da’ay.',
        exampleEnglish: 'An abundant rain fell.',
        pictureKey: 'rain_cloud'
      },
      {
        somaliWord: 'Daruur',
        englishMeaning: 'Cloud',
        pronunciationGuide: 'da-RUUR',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Daruuro waaweyn ayaa cirka maraya.',
        exampleEnglish: 'Large clouds are moving across the sky.',
        pictureKey: 'rain_cloud'
      },
      {
        somaliWord: 'Ri’',
        englishMeaning: 'Goat',
        pronunciationGuide: 'RI’',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Riyuhu waxay daaqayaan caws cusub.',
        exampleEnglish: 'The goats are grazing on fresh grass.',
        pictureKey: 'goat'
      },
      {
        somaliWord: 'Ubax',
        englishMeaning: 'Flower',
        pronunciationGuide: 'U-bax',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Roobka ka dib ubaxyo badan ayaa soo baxay.',
        exampleEnglish: 'After the rain many flowers bloomed.',
        pictureKey: 'flower_garden'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay Hani iyo walaalaheed nadiifiyeen ka hor inta uusan roobku da’in?',
      promptEnglish: 'What did Hani and her siblings clean before the rain fell?',
      options: [
        'Mareegta biyaha u leexisa berkedda guriga.',
        'Baabuurka suuqa.',
        'Doonta badda.'
      ],
      correctAnswer: 'Mareegta biyaha u leexisa berkedda guriga.',
      explanationSomali: 'Sax! Waxay nadiifiyeen mareegta biyaha si berkeddu u buuxsanto biyo nadiif ah.',
      explanationEnglish: 'Correct! They cleaned the water channel so clean rainwater would fill the cistern.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Roobku wuxuu keenay biyo badan iyo caws cusub oo xayawaanku daaqaan.',
      promptEnglish: 'True or False: The rain brought plenty of water and fresh grass for the animals.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Riyihii iyo geeliiba waxay heleen biyo iyo caws cusub.',
      explanationEnglish: 'True! The animals enjoyed fresh water and new green pasture.'
    },
    blankQuestion: {
      sentenceTemplate: 'Daruuro waaweyn oo _____ sida ayaa galabtii cirka isku gadaamay.',
      promptEnglish: 'Large clouds carrying _____ gathered across the afternoon sky.',
      correctAnswer: 'biyo',
      acceptedAnswers: ['biyo', 'roob'],
      options: ['biyo', 'ciid', 'dab'],
      explanationSomali: 'Daruuraha roobku waxay sidaan biyo.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Berkeddii biyaha ayaa buuxsantay, _____ oommanaydna way soo noolaadeen.',
      promptEnglish: 'The water cistern filled up, and the thirsty _____ revived.',
      correctAnswer: 'dhirtii',
      acceptedAnswers: ['dhirtii', 'dhirta', 'geedihii'],
      options: ['dhirtii', 'kabihii', 'buugaagtii'],
      explanationSomali: 'Dhirtii oommanayd ayaa roobka ku soo noolaatay.'
    }
  },
  {
    id: 'sheekadii-ayeeyo-xaliimo',
    title: 'Sheekadii Habeenkii ee Ayeeyo Xaliimo',
    englishTitle: 'Grandmother Xaliimo’s Bedtime Tale',
    subtitle: 'Iftiinka Faynuuska iyo Xigmadda Hore',
    levelId: 'level-2',
    categorySlug: 'habeenkii',
    estimatedReadingMinutes: 5,
    learningPathOrder: 18,
    xpReward: 50,
    description:
      'By the warm glow of a lantern, Grandmother Xaliimo tells her grandchildren a soothing bedtime story about how the night breeze sings to the desert trees.',
    somaliSummary:
      'Ayeeyo Xaliimo oo habeenkii iftiinka faynuuska ugu sheekaynaysa carruurta sheeko deggen oo hurdo macaan keenta.',
    moralSomali: 'Sheekooyinka waayeelku waxay xambaarsan yihiin aqoon iyo xasillooni.',
    moralEnglish: 'Stories told by elders carry cultural memory and calm wisdom.',
    sentences: [
      {
        somaliText: 'Habeenkii markii cashada la cunay, Ayeeyo Xaliimo waxay shidday faynuus iftiin diirran leh.',
        englishTranslation: 'At night after dinner was eaten, Grandmother Xaliimo lit a lantern with a warm glow.',
        sceneCaption: 'A golden lantern illuminates the woven mat inside the room.'
      },
      {
        somaliText: 'Carruurtu waxay ku soo urureen ayeeyo agteeda iyagoo huwan go’yaal jilicsan.',
        englishTranslation: 'The children gathered beside their grandmother wrapped in soft blankets.',
        sceneCaption: 'Children sit cozily on the mat listening to Grandmother.'
      },
      {
        somaliText: 'Ayeeyo waxay bilowday sheeko ku saabsan sidii xiddigaha cirku ugu iftiimi jireen socotada habeenkii.',
        englishTranslation: 'Grandmother began a story about how the sky stars used to guide night travellers.',
        sceneCaption: 'Outside the window, stars twinkle above the quiet hills.'
      },
      {
        somaliText: 'Codkeeda deggen wuxuu u ekaa neecawda habeenkii ee ruxaysa caleemaha geedka.',
        englishTranslation: 'Her calm voice sounded like the night breeze rustling the tree leaves.',
        sceneCaption: 'Acacia branches sway gently beneath the crescent moon.'
      },
      {
        somaliText: 'Carruurtu waxay barteen magaca xiddigta Waaberi iyo sida loogu mahadceliyo nimcada nabadda.',
        englishTranslation: 'The children learned the name of the Morning Star and how to be thankful for the blessing of peace.',
        sceneCaption: 'A bright star shines in the dark sky.'
      },
      {
        somaliText: 'Intii aysan sheekadii dhammaan, carruurtii oo dhan waxay galeen hurdo macaan oo xasilloon.',
        englishTranslation: 'Before the story even finished, all the children drifted into a sweet, peaceful sleep.',
        sceneCaption: 'Grandmother smiles softly as the children sleep.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Faynuus',
        englishMeaning: 'Lantern',
        pronunciationGuide: 'fay-NUUS',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Ayeeyo waxay shidday faynuus.',
        exampleEnglish: 'Grandmother lit a lantern.',
        pictureKey: 'lantern'
      },
      {
        somaliWord: 'Xiddig',
        englishMeaning: 'Star',
        pronunciationGuide: 'XID-dig',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Xiddiguhu waxay iftiimiyaan habeenkii.',
        exampleEnglish: 'The stars illuminate the night.',
        pictureKey: 'moon_stars'
      },
      {
        somaliWord: 'Dermo',
        englishMeaning: 'Woven mat',
        pronunciationGuide: 'DER-mo',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Carruurtu waxay ku fadhiyaan dermada.',
        exampleEnglish: 'The children are sitting on the woven mat.',
        pictureKey: 'woven_mat'
      },
      {
        somaliWord: 'Qoys',
        englishMeaning: 'Family',
        pronunciationGuide: 'QOYS',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Qoysku habeenkii wuu wada nastaa.',
        exampleEnglish: 'The family rests together at night.',
        pictureKey: 'family_courtyard'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay Ayeeyo Xaliimo uga sheekaysay carruurta habeenkii?',
      promptEnglish: 'What did Grandmother Xaliimo tell the children a story about at night?',
      options: [
        'Sidii xiddigaha cirku ugu iftiimi jireen socotada habeenkii.',
        'Sida baabuurta loo kaxeeyo.',
        'Ciyaarta kubadda cagta.'
      ],
      correctAnswer: 'Sidii xiddigaha cirku ugu iftiimi jireen socotada habeenkii.',
      explanationSomali: 'Sax! Ayeeyo waxay uga sheekaysay xiddigaha cirka iyo xiddigta Waaberi.',
      explanationEnglish: 'Correct! She told them how the stars guided night travellers.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Ayeeyo Xaliimo waxay shidday faynuus iftiin diirran leh.',
      promptEnglish: 'True or False: Grandmother Xaliimo lit a lantern with a warm glow.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Faynuuska iftiinkiisa diirran ayay carruurtu ku ag fariisteen.',
      explanationEnglish: 'True! She lit a warm lantern after dinner.'
    },
    blankQuestion: {
      sentenceTemplate: 'Ayeeyo Xaliimo waxay shidday _____ iftiin diirran leh.',
      promptEnglish: 'Grandmother Xaliimo lit a _____ with a warm glow.',
      correctAnswer: 'faynuus',
      acceptedAnswers: ['faynuus', 'faynuuskii'],
      options: ['faynuus', 'doon', 'dambiil'],
      explanationSomali: 'Habeenkii waxay iftiinsadeen faynuus.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Intii aysan sheekadii dhammaan, carruurtii waxay galeen _____ macaan.',
      promptEnglish: 'Before the story finished, the children drifted into a sweet _____.',
      correctAnswer: 'hurdo',
      acceptedAnswers: ['hurdo'],
      options: ['hurdo', 'orod', 'qaylo'],
      explanationSomali: 'Sheekada deggen ee ayeeyo waxay carruurta gelisay hurdo macaan.'
    }
  },
  {
    id: 'safarkii-buurta-daallo',
    title: 'Safarkii Buurta Cagaaran ee Daallo',
    englishTitle: 'Journey to the Green Mountain of Daallo',
    subtitle: 'Kaymaha Ceeryaanta Leh iyo Shimbiraha Naadirka ah',
    levelId: 'level-2',
    categorySlug: 'tacabur',
    estimatedReadingMinutes: 5,
    learningPathOrder: 19,
    xpReward: 50,
    description:
      'Saciid and his older sister travel up the winding mountain road to Daallo Forest, where mist touches giant juniper trees and rare birds sing.',
    somaliSummary:
      'Saciid iyo walaashiis oo booqanaya buurta Daallo, halkaas oo ay ku arkaan geedo dhaadheer, ceeryaamo qabow, iyo shimbiro qurux badan.',
    moralSomali: 'Dabeecadda dalkeenna waxaa ku duugan qurux cajiib ah oo mudan in la barto.',
    moralEnglish: 'Exploring our homeland’s mountains and forests fills us with wonder and respect for nature.',
    sentences: [
      {
        somaliText: 'Saciid iyo walaashiis Nasteexo waxay subax hore u safreen buurta dheer ee Daallo.',
        englishTranslation: 'Saciid and his sister Nasteexo travelled early in the morning to the high mountain of Daallo.',
        sceneCaption: 'Tall green mountain peaks rise into the morning mist.'
      },
      {
        somaliText: 'Marba marka ay buurta kor u sii fuulaan, hawadu waxay noqonaysay mid qabow oo udgoon.',
        englishTranslation: 'The higher they climbed up the mountain, the cooler and more fragrant the air became.',
        sceneCaption: 'Cool mist drifts through ancient mountain trees.'
      },
      {
        somaliText: 'Waxay arkeen geedo dayib ah oo aad u dhaadheer iyo ceeryaamo cad oo laamaha dhex maraysa.',
        englishTranslation: 'They saw tall juniper trees and white mist weaving through the branches.',
        sceneCaption: 'Saciid and Nasteexo look up at the towering forest canopy.'
      },
      {
        somaliText: 'Shimbir midabbo badan leh ayaa geedka dushiisa ka heestay cod macaan.',
        englishTranslation: 'A brightly coloured bird sang a sweet melody from the top of a tree.',
        sceneCaption: 'A rare mountain bird perches on a mossy branch.'
      },
      {
        somaliText: 'Dusha sare ee buurta waxay ka eego-daawadeen dooxooyinka iyo badda fog.',
        englishTranslation: 'From the summit of the mountain they looked out across the valleys and the distant sea.',
        sceneCaption: 'A breathtaking view from the cliff edge toward the distant coast.'
      },
      {
        somaliText: 'Saciid wuxuu buuggiisa xusuus-qorka ku sawiray geedaha iyo shimbiraha Daallo.',
        englishTranslation: 'Saciid sketched the trees and birds of Daallo in his notebook.',
        sceneCaption: 'Saciid draws the mountain landscape in his sketchbook.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Buur',
        englishMeaning: 'Mountain',
        pronunciationGuide: 'BUUR',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Buurta Daallo waa mid aad u qurux badan.',
        exampleEnglish: 'Mount Daallo is very beautiful.',
        pictureKey: 'mountain_hill'
      },
      {
        somaliWord: 'Geed',
        englishMeaning: 'Tree',
        pronunciationGuide: 'GEED',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Buurta waxaa ku yaal geedo dhaadheer.',
        exampleEnglish: 'Tall trees grow on the mountain.',
        pictureKey: 'acacia_tree'
      },
      {
        somaliWord: 'Shimbir',
        englishMeaning: 'Bird',
        pronunciationGuide: 'SHIM-bir',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Shimbir midabbo badan leh ayaa heestay.',
        exampleEnglish: 'A colourful bird sang.',
        pictureKey: 'bird'
      },
      {
        somaliWord: 'Buug',
        englishMeaning: 'Notebook / Book',
        pronunciationGuide: 'BUUG',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Saciid wuxuu wax ku sawiray buuggiisa.',
        exampleEnglish: 'Saciid drew in his notebook.',
        pictureKey: 'school_book'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Muxuu Saciid ku sawiray buuggiisa xusuus-qorka?',
      promptEnglish: 'What did Saciid draw in his notebook?',
      options: [
        'Geedaha iyo shimbiraha buurta Daallo.',
        'Baabuurta magaalada.',
        'Cuntooyinka suuqa.'
      ],
      correctAnswer: 'Geedaha iyo shimbiraha buurta Daallo.',
      explanationSomali: 'Sax! Saciid wuxuu buuggiisa ku sawiray geedaha dhaadheer iyo shimbiraha buurta Daallo.',
      explanationEnglish: 'Correct! Saciid sketched the mountain trees and birds in his notebook.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Hawada buurta Daallo waa mid qabow oo udgoon.',
      promptEnglish: 'True or False: The air on Mount Daallo is cool and fragrant.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Buurta sare hawadeedu waa mid qabow oo ceeryaamo iyo dhir udgoon leh.',
      explanationEnglish: 'True! The high mountain forest has cool, misty, fragrant air.'
    },
    blankQuestion: {
      sentenceTemplate: 'Saciid iyo walaashiis waxay subax hore u safreen _____ dheer ee Daallo.',
      promptEnglish: 'Saciid and his sister travelled early in the morning to the high _____ of Daallo.',
      correctAnswer: 'buurta',
      acceptedAnswers: ['buurta', 'buur'],
      options: ['buurta', 'badda', 'suuqa'],
      explanationSomali: 'Daallo waa buur cagaaran oo caan ah.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Waxay arkeen geedo dhaadheer iyo _____ cad oo laamaha dhex maraysa.',
      promptEnglish: 'They saw tall trees and white _____ weaving through the branches.',
      correctAnswer: 'ceeryaamo',
      acceptedAnswers: ['ceeryaamo'],
      options: ['ceeryaamo', 'ciid', 'kubbad'],
      explanationSomali: 'Buurta Daallo waxaa caan ku ah ceeryaamada cad.'
    }
  },
  {
    id: 'faraska-booddo',
    title: 'ubadkii Geela iyo Dooxada Nugaal',
    englishTitle: 'The Young Camels of the Nugaal Valley',
    subtitle: 'Tartanka Saaxiibtinimo ee Dooxada Cagaaran',
    levelId: 'level-2',
    categorySlug: 'dhaqanka',
    estimatedReadingMinutes: 5,
    learningPathOrder: 20,
    xpReward: 50,
    description:
      'In the broad Nugaal valley after the rains, young pastoral children watch the newborn camel calves play and learn traditional songs praising the herd.',
    somaliSummary:
      'Carruurta reer miyiga ee dooxada Nugaal oo daawanaya nirgaha yaryar ee ciyaaraya isla markaana baranaya suugaanta xoolaha.',
    moralSomali: 'Suugaanta iyo dhaqanka xoolo-dhaqatadu waa dhaxal qaali ah.',
    moralEnglish: 'Somali pastoral poetry and care for animals are treasured cultural traditions.',
    sentences: [
      {
        somaliText: 'Dooxada ballaaran ee Nugaal waxay xilliga barwaaqada u egtahay roog cagaaran oo la fidiyay.',
        englishTranslation: 'During the prosperous rainy season, the wide Nugaal valley looks like a spread-out green carpet.',
        sceneCaption: 'Rolling green pastures stretch across the Nugaal valley.'
      },
      {
        somaliText: 'Nirgaha yaryar ee geela ayaa subaxdii ku wada ordaya bannaanka xerada agteeda.',
        englishTranslation: 'The young camel calves run playfully together in the open meadow near the enclosure in the morning.',
        sceneCaption: 'Young camel calves trot joyfully across the green valley.'
      },
      {
        somaliText: 'Idil iyo walaalkeed waxay ka caawiyeen aabbahood in biyaha loo shubo xoolaha.',
        englishTranslation: 'Idil and her brother helped their father pour water into the troughs for the animals.',
        sceneCaption: 'Children help fill the wooden water trough at the well.'
      },
      {
        somaliText: 'Aabbe wuxuu qaaday hees-howleed dhaqameed oo lagu ammaanayo geela markii la waraabinayo.',
        englishTranslation: 'Father sang a traditional pastoral work song praising the camels as they were watered.',
        sceneCaption: 'Camels gather calmly at the well while listening to the work song.'
      },
      {
        somaliText: 'Idil waxay xifdisay miraha heesta, waxayna baratay magacyada geela.',
        englishTranslation: 'Idil memorized the verses of the song and learned the traditional names of the camels.',
        sceneCaption: 'Idil smiles as she strokes the soft coat of a young calf.'
      },
      {
        somaliText: 'Fiidkii waxay wada cabbeen caano daray ah iyagoo ku faraxsan nolosha miyiga.',
        englishTranslation: 'In the evening they drank fresh milk together, rejoicing in the pastoral life.',
        sceneCaption: 'Fresh milk is served in a carved dhiil vessel under the evening sky.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Geel',
        englishMeaning: 'Camel',
        pronunciationGuide: 'GEEL',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Geelu waa laf-dhabarta dhaqanka miyiga.',
        exampleEnglish: 'The camel is the backbone of pastoral culture.',
        pictureKey: 'camel'
      },
      {
        somaliWord: 'Dhiil',
        englishMeaning: 'Milk vessel',
        pronunciationGuide: 'DHIIL',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Fiidkii waxay dhiisha ka cabbeen caano.',
        exampleEnglish: 'In the evening they drank milk from the dhiil.',
        pictureKey: 'milk_dhiil'
      },
      {
        somaliWord: 'Ceel',
        englishMeaning: 'Well',
        pronunciationGuide: 'CEEL',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Xoolaha waxaa laga waraabiyay ceelka.',
        exampleEnglish: 'The animals were watered at the well.',
        pictureKey: 'water_well'
      },
      {
        somaliWord: 'Buur',
        englishMeaning: 'Hill / Ridge',
        pronunciationGuide: 'BUUR',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Dooxada Nugaal waxaa ku wareegsan buuro gaagaaban.',
        exampleEnglish: 'Low hills surround the Nugaal valley.',
        pictureKey: 'mountain_hill'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay Idil xifdisay markii xoolaha la waraabinayay?',
      promptEnglish: 'What did Idil memorize while the animals were being watered?',
      options: [
        'Miraha hees-howleedka dhaqameed iyo magacyada geela.',
        'Magacyada magaalooyinka fog.',
        'Sida doonta loo kaxeeyo.'
      ],
      correctAnswer: 'Miraha hees-howleedka dhaqameed iyo magacyada geela.',
      explanationSomali: 'Sax! Idil waxay aabbaheed ka baratay hees-howleedka geela lagu waraabiyo.',
      explanationEnglish: 'Correct! Idil memorized the traditional pastoral work song and camel names.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Dooxada Nugaal xilliga barwaaqada waxay noqotaa cagaar qurux badan.',
      promptEnglish: 'True or False: During the rainy season, the Nugaal valley becomes lush and green.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Dooxadu waxay u egtahay roog cagaaran oo la fidiyay.',
      explanationEnglish: 'True! The valley turns into a wide green pasture.'
    },
    blankQuestion: {
      sentenceTemplate: 'Aabbe wuxuu qaaday _____ dhaqameed oo lagu ammaanayo geela.',
      promptEnglish: 'Father sang a traditional _____ praising the camels.',
      correctAnswer: 'hees-howleed',
      acceptedAnswers: ['hees-howleed', 'hees'],
      options: ['hees-howleed', 'qalin', 'dambiil'],
      explanationSomali: 'Marka geela la waraabinayo waxaa loo qaadaa hees-howleed.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Fiidkii waxay wada cabbeen _____ daray ah iyagoo ku faraxsan miyiga.',
      promptEnglish: 'In the evening they drank fresh _____ together.',
      correctAnswer: 'caano',
      acceptedAnswers: ['caano'],
      options: ['caano', 'ciid', 'qalin'],
      explanationSomali: 'Waxay fiidkii wada cabbeen caano daray ah.'
    }
  },

  // ============================================================================
  // LEVEL 3 — AKHRISTE HORUMARSAN (AGES 9–12): 10 COMPLETE ORIGINAL STORIES
  // ============================================================================
  {
    id: 'ceelkii-la-wadaagay',
    title: 'Ceelkii Nabadda iyo Wadaagga',
    englishTitle: 'The Well of Peace and Sharing',
    subtitle: 'Sidee Laba Beelood ugu Heshiiyeen Wadaagga Biyaha',
    levelId: 'level-3',
    categorySlug: 'dhaqanka',
    estimatedReadingMinutes: 6,
    learningPathOrder: 21,
    xpReward: 65,
    description:
      'When two pastoral communities arrive at the valley well at the same time during a dry spell, twelve-year-old Hanad proposes a fair schedule and a shared stone trough so every herd drinks in peace.',
    somaliSummary:
      'Hanad oo ah wiil dhallinyaro ah oo fikrad caddaalad ah ku xallinaya sidii laba kooxood oo xoolo-dhaqato ah si nabad ah ugu wadaagi lahaayeen biyaha ceelka.',
    moralSomali: 'Caddaaladda, wada-tashiga, iyo wadaaggu waxay xoojiyaan nabadda bulshada.',
    moralEnglish: 'Fairness, dialogue, and sharing turn potential conflict into lasting community peace.',
    sentences: [
      {
        somaliText: 'Guga oo daahay awgiis, ceelka weyn ee Dooxada dhexe wuxuu noqday isha keliya ee biyaha laga helo.',
        englishTranslation: 'Because the spring rains were delayed, the great well in the central valley became the only source of water.',
        sceneCaption: 'Pastoral herds approach the stone well in the wide valley.'
      },
      {
        somaliText: 'Subax kaliya ayaa laba kooxood oo xoolo-dhaqato ah isugu yimaadeen ceelka, mid walbana wuxuu rabay inuu hor waraabsado.',
        englishTranslation: 'On the same morning two groups of herders arrived at the well together, and each wanted to water their animals first.',
        sceneCaption: 'Elders and herders stand beside the well discussing the turn order.'
      },
      {
        somaliText: 'Hanad oo ah wiil laba iyo toban jir ah oo caqli badan ayaa odayaasha weydiistay inuu fikrad soo jeediyo.',
        englishTranslation: 'Hanad, a thoughtful twelve-year-old boy, respectfully asked the elders for permission to suggest an idea.',
        sceneCaption: 'Young Hanad speaks respectfully before the gathered elders.'
      },
      {
        somaliText: '"Haddii aan wada dhisno laba dar oo dhaadheer oo is-barbar yaal, oo aan wada dawlisanno biyaha, labada xero isku mar ayay cabbi karaan," ayuu yiri Hanad.',
        englishTranslation: '"If we build two long troughs side by side and draw the water together, both herds can drink at the same time," said Hanad.',
        sceneCaption: 'Hanad sketches the two parallel troughs in the sand.'
      },
      {
        somaliText: 'Odayaashii waxay la dhaceen xigmadda wiilka yar, dhallinyaradiina si wada-jir ah ayay uga shaqeeyeen ceelka.',
        englishTranslation: 'The elders admired the young boy’s wisdom, and the youth worked together side by side at the well.',
        sceneCaption: 'Both communities cooperate to fill the twin water troughs.'
      },
      {
        somaliText: 'Geelii iyo adhigii labada dhinacba si xasilloon ayay u cabbeen biyihii iyadoo aan muran dhicin.',
        englishTranslation: 'The camels and flocks of both sides drank the water calmly without any dispute.',
        sceneCaption: 'Camels drink peacefully while herders share tea under the acacia.'
      },
      {
        somaliText: 'Maalintaas wixii ka dambeeyay, ceelkaas waxaa loo bixiyay "Ceelkii Nabadda iyo Wadaagga".',
        englishTranslation: 'From that day onward, the well was named "The Well of Peace and Sharing".',
        sceneCaption: 'A carved stone marker stands beside the peaceful oasis well.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Ceel',
        englishMeaning: 'Water well',
        pronunciationGuide: 'CEEL',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Ceelka waxaa loo bixiyay Ceelkii Nabadda.',
        exampleEnglish: 'The well was named the Well of Peace.',
        pictureKey: 'water_well'
      },
      {
        somaliWord: 'Nabad',
        englishMeaning: 'Peace / Harmony',
        pronunciationGuide: 'NA-bad',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Labada kooxood si nabad ah ayay biyaha u wadaageen.',
        exampleEnglish: 'The two groups shared the water in peace.',
        pictureKey: 'family_courtyard'
      },
      {
        somaliWord: 'Geel',
        englishMeaning: 'Camels',
        pronunciationGuide: 'GEEL',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Geelii labada dhinac isku mar ayay cabbeen.',
        exampleEnglish: 'The camels of both sides drank at the same time.',
        pictureKey: 'camel'
      },
      {
        somaliWord: 'Geed',
        englishMeaning: 'Shade tree (meeting place)',
        pronunciationGuide: 'GEED',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Odayaashu waxay ku tashadeen geedka hoostiisa.',
        exampleEnglish: 'The elders conferred beneath the shade tree.',
        pictureKey: 'acacia_tree'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay ahayd fikraddii xigmadda lahayd ee Hanad u soo jeediyay odayaasha?',
      promptEnglish: 'What wise idea did Hanad propose to the elders at the well?',
      options: [
        'In la wada dhiso laba dar oo biyaha si wada-jir ah loo soo dawliso si labada xeraba isku mar u cabbaan.',
        'In ceelka la xiro oo cidna aysan cabbin.',
        'In la sugo ilaa bisha dambe.'
      ],
      correctAnswer:
        'In la wada dhiso laba dar oo biyaha si wada-jir ah loo soo dawliso si labada xeraba isku mar u cabbaan.',
      explanationSomali: 'Sax! Hanad wuxuu soo jeediyay iskaashi iyo laba dar oo is-barbar yaal.',
      explanationEnglish: 'Correct! Hanad proposed building twin troughs and drawing water cooperatively.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Odayaashii way diideen fikraddii Hanad.',
      promptEnglish: 'True or False: The elders rejected Hanad’s idea.',
      correctBoolean: false,
      explanationSomali: 'Waa been! Odayaashii aad ayay ula dhaceen xigmadda Hanad wayna qaateen taladiisa.',
      explanationEnglish: 'False! The elders admired Hanad’s wisdom and put his cooperative plan into action.'
    },
    blankQuestion: {
      sentenceTemplate: 'Maalintaas wixii ka dambeeyay, ceelkaas waxaa loo bixiyay "Ceelkii _____ iyo Wadaagga".',
      promptEnglish: 'From that day onward, the well was named "The Well of _____ and Sharing".',
      correctAnswer: 'Nabadda',
      acceptedAnswers: ['nabadda', 'nabad'],
      options: ['Nabadda', 'Dagaalka', 'Xanaaqa'],
      explanationSomali: 'Ceelka waxaa loogu magac daray Ceelkii Nabadda iyo Wadaagga.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Geelii iyo adhigii labada dhinacba si _____ ah ayay u cabbeen biyihii.',
      promptEnglish: 'The camels and flocks of both sides drank the water in a _____ manner.',
      correctAnswer: 'xasilloon',
      acceptedAnswers: ['xasilloon', 'nabad'],
      options: ['xasilloon', 'khatar', 'qaylo'],
      explanationSomali: 'Xooluhu si xasilloon oo muran la’aan ah ayay biyaha u cabbeen.'
    }
  },
  {
    id: 'runta-iyo-amaanada',
    title: 'Runta iyo Amaanada: Kiishkii Lacagta',
    englishTitle: 'Truth and Honesty: The Lost Purse',
    subtitle: 'Sagal oo Soo Celisay Hanti Luntay oo ay Jidka ka Heshay',
    levelId: 'level-3',
    categorySlug: 'saaxiibtinimada',
    estimatedReadingMinutes: 6,
    learningPathOrder: 22,
    xpReward: 65,
    description:
      'On her way home from school, Sagal finds a leather pouch dropped by an elderly merchant near the market and searches diligently until she returns it intact.',
    somaliSummary:
      'Sagal oo jidka dugsiga ka heshay kiish yar oo ay ku jirto lacag uu lahaa oday ganacsade ah, si daacadnimo lehna ugu celisay.',
    moralSomali: 'Amaanada oo la xafido iyo runta oo la sheego waa astaanta qofka sharafta leh.',
    moralEnglish: 'Protecting trust and returning what belongs to others is the mark of true integrity.',
    sentences: [
      {
        somaliText: 'Sagal oo dugsiga ka soorawaxday ayaa jidka suuqa agtiisa ku aragtay kiish yar oo maqaar ka samaysan.',
        englishTranslation: 'While walking home from school, Sagal noticed a small leather pouch near the market path.',
        sceneCaption: 'Sagal spots a stitched leather pouch beside the market walkway.'
      },
      {
        somaliText: 'Markii ay furtay si ay u eegto cidda leh, waxay ku dhex aragtay lacag iyo warqad ay ku qoran tahay "Xaaji Maxamuud".',
        englishTranslation: 'When she opened it to check who owned it, she saw money inside along with a note bearing the name "Xaaji Maxamuud".',
        sceneCaption: 'Sagal reads the name written on the slip of paper inside.'
      },
      {
        somaliText: 'In kasta oo ay gaajoonaysay oo suuqa macmacaan yaallay, Sagal waxay xusuusatay casharkii waalidkeed ee amaanada.',
        englishTranslation: 'Although she was hungry and sweet treats were sold in the market, Sagal remembered her parents’ teaching about honesty.',
        sceneCaption: 'Sagal holds the pouch safely against her school bag.'
      },
      {
        somaliText: 'Waxay u tagtay guddoomiyaha suuqa oo ay weydiisay halka uu ku yaallo dukaanka Xaaji Maxamuud.',
        englishTranslation: 'She went to the market elder and asked where Xaaji Maxamuud’s shop was located.',
        sceneCaption: 'A market vendor points Sagal toward the spice and grain shop.'
      },
      {
        somaliText: 'Xaaji Maxamuud oo murugaysan oo raadinaya lacagtii uu ku bixin lahaa deynta ayaa arkay Sagal oo u sidda kiishkii.',
        englishTranslation: 'Xaaji Maxamuud, who was worriedly searching for the money needed to pay his suppliers, saw Sagal bringing him the pouch.',
        sceneCaption: 'Sagal hands the intact leather pouch to the grateful elder merchant.'
      },
      {
        somaliText: 'Markii uu tiriyay lacagtii oo dhan oo aan hal shilin ka dhinayn, indhihiisa ilmo farxadeed ayaa ku soo istaagtay.',
        englishTranslation: 'When he counted all the money and found not a single coin missing, tears of gratitude filled his eyes.',
        sceneCaption: 'Xaaji Maxamuud blesses Sagal and gifts her a basket of dates and a new book.'
      },
      {
        somaliText: 'Maamulaha dugsiga ayaa subaxdii xigtay Sagal ku abaalmariyay billadda daacadnimada iyo amaanada.',
        englishTranslation: 'The next morning the school principal honoured Sagal with a medal for honesty and trustworthiness.',
        sceneCaption: 'Classmates applaud Sagal at the morning school assembly.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Dambiil',
        englishMeaning: 'Market basket',
        pronunciationGuide: 'dam-BIIL',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Xaajigu wuxuu Sagal siiyay dambiil timir ah.',
        exampleEnglish: 'The elder gave Sagal a basket of dates.',
        pictureKey: 'market_basket'
      },
      {
        somaliWord: 'Buug',
        englishMeaning: 'Book',
        pronunciationGuide: 'BUUG',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Sagal waxaa lagu abaalmariyay buug sheeko ah.',
        exampleEnglish: 'Sagal was rewarded with a storybook.',
        pictureKey: 'school_book'
      },
      {
        somaliWord: 'Dugsi',
        englishMeaning: 'School',
        pronunciationGuide: 'DUG-si',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Dugsiga oo dhan ayaa ku faanay daacadnimada Sagal.',
        exampleEnglish: 'The whole school was proud of Sagal’s honesty.',
        pictureKey: 'pencil_slate'
      },
      {
        somaliWord: 'Qoys',
        englishMeaning: 'Family',
        pronunciationGuide: 'QOYS',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Qoyskeedu waxay bareen ilaalinta amaanada.',
        exampleEnglish: 'Her family taught her to uphold trust.',
        pictureKey: 'family_courtyard'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay Sagal ku ogaatay qofka iska leh kiishkii lacagta ee luntay?',
      promptEnglish: 'How did Sagal find out who owned the lost pouch of money?',
      options: [
        'Warqad ku dhex jirtay oo ay ku qornayd magaca "Xaaji Maxamuud".',
        'Shimbir ayaa u sheegtay.',
        'Sabuuradda dugsiga ayaa lagu qoray.'
      ],
      correctAnswer: 'Warqad ku dhex jirtay oo ay ku qornayd magaca "Xaaji Maxamuud".',
      explanationSomali: 'Sax! Kiishka gudihiisa waxaa ku jirtay warqad uu ku qoran yahay magaca Xaaji Maxamuud.',
      explanationEnglish: 'Correct! Inside the pouch was a slip of paper with Xaaji Maxamuud’s name.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Sagal waxay lacagtii oo dhan u celisay Xaaji Maxamuud iyadoo aan waxba ka dhinayn.',
      promptEnglish: 'True or False: Sagal returned all the money to Xaaji Maxamuud without anything missing.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Sagal waxay muujisay daacadnimo iyo amaano buuxda.',
      explanationEnglish: 'True! Not a single coin was missing when she returned the pouch.'
    },
    blankQuestion: {
      sentenceTemplate: 'Maamulaha dugsiga ayaa Sagal ku abaalmariyay billadda _____ iyo amaanada.',
      promptEnglish: 'The school principal honoured Sagal with a medal for _____ and trustworthiness.',
      correctAnswer: 'daacadnimada',
      acceptedAnswers: ['daacadnimada', 'daacadnimo', 'runta'],
      options: ['daacadnimada', 'ciyaarta', 'orodka'],
      explanationSomali: 'Sagal waxay mutaysatay billadda daacadnimada iyo amaanada.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Sagal waxay xusuusatay casharkii waalidkeed ee ilaalinta _____.',
      promptEnglish: 'Sagal remembered her parents’ teaching about upholding _____.',
      correctAnswer: 'amaanada',
      acceptedAnswers: ['amaanada', 'amaano'],
      options: ['amaanada', 'hurdada', 'dabaysha'],
      explanationSomali: 'Waalidkeed waxay bareen ilaalinta amaanada.'
    }
  },
  {
    id: 'ilaaliyaha-dhirta-miyiga',
    title: 'Ilaaliyaha Dhirta Miyiga',
    englishTitle: 'Guardian of the Countryside Trees',
    subtitle: 'Cabdiraxmaan oo Tuulada Baraya Joojinta Jarista Geedaha Qoyan',
    levelId: 'level-3',
    categorySlug: 'dabeecadda',
    estimatedReadingMinutes: 6,
    learningPathOrder: 23,
    xpReward: 65,
    description:
      'When soil erosion threatens the village riverbank after too many trees are cut down, young Cabdiraxmaan organizes a youth tree-planting campaign.',
    somaliSummary:
      'Cabdiraxmaan oo dhallinyarada tuulada ku hoggaaminaya olole dhir-beeris ah si looga hortago nabaad-guurka ciidda.',
    moralSomali: 'Ilaalinta dhirta iyo deegaanku waa ilaalinta mustaqbalka dalkeenna.',
    moralEnglish: 'Protecting living trees and planting new ones safeguards the land for future generations.',
    sentences: [
      {
        somaliText: 'Cabdiraxmaan wuxuu dareemay in dooxadii tuuladooda ay dabayshu ciidda ka qaadayso ka dib markii geedo badan la jaray.',
        englishTranslation: 'Cabdiraxmaan noticed that the wind was eroding the soil in their village valley after many trees had been cut down.',
        sceneCaption: 'Cabdiraxmaan examines dry eroded soil where trees once stood.'
      },
      {
        somaliText: 'Wuxuu macallinkiisa sayniska ka bartay in xididdada geeduhu ay qabtaan ciidda isla markaana soo jiitaan biyaha roobka.',
        englishTranslation: 'He learned from his science teacher that tree roots hold the soil together and help absorb rainwater.',
        sceneCaption: 'A classroom diagram shows how deep acacia roots anchor the earth.'
      },
      {
        somaliText: 'Jimcihii xigay, Cabdiraxmaan wuxuu la hadlay odayaasha iyo dhallinyarada tuulada isagoo sharxay khatarta nabaad-guurka.',
        englishTranslation: 'The following Friday, Cabdiraxmaan spoke to the village elders and youth, explaining the danger of soil erosion.',
        sceneCaption: 'Villagers listen attentively to Cabdiraxmaan under the meeting tree.'
      },
      {
        somaliText: 'Tuulada oo dhan waxay ku heshiisay xeer cusub: in aan la jarin geed qoyan, qof walbana uu beero laba geed.',
        englishTranslation: 'The entire village agreed on a new rule: never to cut a living tree, and for every person to plant two saplings.',
        sceneCaption: 'Families and students carry trays of green tree seedlings.'
      },
      {
        somaliText: 'Ardayda dugsiga waxay jiinka togagga ku beereen laba boqol oo geed oo quraac iyo gob ah.',
        englishTranslation: 'The school students planted two hundred acacia and Ziziphus trees along the banks of the seasonal streams.',
        sceneCaption: 'Students plant rows of young trees along the valley bank.'
      },
      {
        somaliText: 'Laba xilli-roobaad ka dib, dooxadii waxay mar kale noqotay kayn cagaaran oo shimbiruhu ku hoydaan.',
        englishTranslation: 'Two rainy seasons later, the valley once again became a lush green woodland where birds made their homes.',
        sceneCaption: 'Green trees, wildflowers, and birds flourish across the restored valley.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Geed',
        englishMeaning: 'Tree',
        pronunciationGuide: 'GEED',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Xididdada geeduhu waxay qabtaan ciidda.',
        exampleEnglish: 'Tree roots hold the soil.',
        pictureKey: 'acacia_tree'
      },
      {
        somaliWord: 'Roob',
        englishMeaning: 'Rain',
        pronunciationGuide: 'ROOB',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Dhirtu waxay ceshataa biyaha roobka.',
        exampleEnglish: 'Plants retain rainwater.',
        pictureKey: 'rain_cloud'
      },
      {
        somaliWord: 'Ubax',
        englishMeaning: 'Flower / Blossom',
        pronunciationGuide: 'U-bax',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Dooxada waxaa ka soo baxay dhir iyo ubax.',
        exampleEnglish: 'Trees and flowers grew in the valley.',
        pictureKey: 'flower_garden'
      },
      {
        somaliWord: 'Shimbir',
        englishMeaning: 'Bird',
        pronunciationGuide: 'SHIM-bir',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Shimbiruhu waxay ku hoydaan laamaha geedaha.',
        exampleEnglish: 'Birds nest in the branches of trees.',
        pictureKey: 'bird'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay faa’iido u leeyihiin xididdada geeduhu sida Cabdiraxmaan uu ka bartay dugsiga?',
      promptEnglish: 'What benefit do tree roots provide according to what Cabdiraxmaan learned at school?',
      options: [
        'Waxay qabtaan ciidda waxayna soo jiitaan biyaha roobka.',
        'Waxay kaxeeyaan doomaha badda.',
        'Waxay dhisaan guryaha dhagaxa ah.'
      ],
      correctAnswer: 'Waxay qabtaan ciidda waxayna soo jiitaan biyaha roobka.',
      explanationSomali: 'Sax! Xididdada geeduhu waxay ka hortagaan nabaad-guurka ciidda.',
      explanationEnglish: 'Correct! Tree roots anchor the soil and help retain rainwater.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Tuuladu waxay ku heshiisay in aan la jarin geed qoyan oo qof walba beero laba geed.',
      promptEnglish: 'True or False: The village agreed not to cut living trees and for everyone to plant two saplings.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Xeerkaas cusub wuxuu soo celiyay cagaarkii dooxada.',
      explanationEnglish: 'True! That community agreement restored the valley woodland.'
    },
    blankQuestion: {
      sentenceTemplate: 'Ardayda dugsiga waxay beereen laba boqol oo _____ oo quraac iyo gob ah.',
      promptEnglish: 'The school students planted two hundred acacia and Ziziphus _____.',
      correctAnswer: 'geed',
      acceptedAnswers: ['geed', 'geedo'],
      options: ['geed', 'faynuus', 'doon'],
      explanationSomali: 'Ardaydu waxay beereen laba boqol oo geed.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Xididdada geeduhu waxay ka hortagaan _____ ciidda.',
      promptEnglish: 'Tree roots prevent soil _____.',
      correctAnswer: 'nabaad-guurka',
      acceptedAnswers: ['nabaad-guurka', 'nabaadguurka'],
      options: ['nabaad-guurka', 'qorraxda', 'xiddigaha'],
      explanationSomali: 'Beerista dhirta waxay joojisaa nabaad-guurka ciidda.'
    }
  },
  {
    id: 'xiddig-iyaha-badmaaxa',
    title: 'Xiddig-Aqoonkii Yar ee Badmaaxa',
    englishTitle: 'The Young Star-Navigator of the Sea',
    subtitle: 'Sida Xiddigta Jahada Waqooyi loogu Hago Doomaha Habeenkii',
    levelId: 'level-3',
    categorySlug: 'tacabur',
    estimatedReadingMinutes: 6,
    learningPathOrder: 24,
    xpReward: 65,
    description:
      'When fog and nightfall overtake a fishing boat off the coast of Marka, young Nuur uses the traditional Somali star-navigation lessons of his grandfather to guide the boat safely to harbour.',
    somaliSummary:
      'Nuur oo ah wiil dhallinyaro ah oo awoowgiis ka bartay cilmiga xiddigiska Soomaalida, kaas oo habeenkii doontooda ku hagaya xiddigta Jahada.',
    moralSomali: 'Cilmiga xiddigiska iyo deggenaanta xilliga adag waxay badbaadiyaan nafta.',
    moralEnglish: 'Traditional knowledge and calm presence of mind guide us safely through dark waters.',
    sentences: [
      {
        somaliText: 'Nuur wuxuu awoowgiis oo ahaa naakhuude ruug-caddaa ah ka bartay magacyada xiddigaha iyo jihooyinka badda.',
        englishTranslation: 'Nuur learned the names of the stars and the sea directions from his grandfather, a veteran sea captain.',
        sceneCaption: 'Grandfather shows Nuur the constellations from the deck of a wooden dhow.'
      },
      {
        somaliText: 'Galab iyagoo badda ku maqan ayaa daruuro culus soo mareen, diiraddii yaraana way ka jabtay.',
        englishTranslation: 'One afternoon while out at sea, heavy clouds rolled in and their small compass broke.',
        sceneCaption: 'Waves rise around the wooden sailboat as dusk approaches.'
      },
      {
        somaliText: 'Markii habeenkii dumay ee daruurihii kala baxeen, kalluumaysatadii waxay garan waayeen dhanka xeebtu ka xigto.',
        englishTranslation: 'When night fell and the clouds parted, the fishermen could not tell which direction led back to shore.',
        sceneCaption: 'A vast starry sky opens above the dark ocean.'
      },
      {
        somaliText: 'Nuur ayaa kor u eegay cirka, wuxuuna isla markiiba gartay Xiddigta Jahada (Waqooyi) oo aan meesheeda ka dhaqaaqin.',
        englishTranslation: 'Nuur looked up at the sky and immediately identified the North Star (Jahada), which remains fixed in place.',
        sceneCaption: 'Nuur points steadily toward the bright North Star.'
      },
      {
        somaliText: '"Haddii Xiddigta Jahadu naga xigto midigta, xeebta Marka waxay naga xigtaa galbeedka tooska ah," ayuu yiri Nuur.',
        englishTranslation: '"If the North Star is on our right side, the coast of Marka lies straight to the west," said Nuur.',
        sceneCaption: 'The helmsman turns the wooden rudder westward.'
      },
      {
        somaliText: 'Saacad ka dib, waxay meel fog ka arkeen iftiinka faynuusyada dekadda Marka oo soo dhawaynaya.',
        englishTranslation: 'An hour later, they spotted in the distance the warm lantern lights of Marka harbour welcoming them home.',
        sceneCaption: 'Golden harbour lanterns glow along the coastline.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Xiddig',
        englishMeaning: 'Star',
        pronunciationGuide: 'XID-dig',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Nuur wuxuu gartay Xiddigta Jahada.',
        exampleEnglish: 'Nuur identified the North Star.',
        pictureKey: 'moon_stars'
      },
      {
        somaliWord: 'Doon',
        englishMeaning: 'Sailboat / Dhow',
        pronunciationGuide: 'DOON',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Doontii si ammaan ah ayay xeebta ku timid.',
        exampleEnglish: 'The boat arrived safely at the shore.',
        pictureKey: 'sailboat_doon'
      },
      {
        somaliWord: 'Faynuus',
        englishMeaning: 'Lantern / Harbour light',
        pronunciationGuide: 'fay-NUUS',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Waxay arkeen iftiinka faynuusyada dekadda.',
        exampleEnglish: 'They saw the glow of the harbour lanterns.',
        pictureKey: 'lantern'
      },
      {
        somaliWord: 'Kalluun',
        englishMeaning: 'Fish',
        pronunciationGuide: 'kal-LUUN',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Doontu waxay siday kalluun badan.',
        exampleEnglish: 'The boat carried plenty of fish.',
        pictureKey: 'fish'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Sidee ayuu Nuur ku gartay jihada xeebta Marka markii diiraddu jabtay?',
      promptEnglish: 'How did Nuur determine the direction of the Marka coast when the compass broke?',
      options: [
        'Wuxuu eegay Xiddigta Jahada (Waqooyi) ee cirka ku sugan.',
        'Wuxuu weydiiyay kalluunka badda.',
        'Wuxuu sugay laba maalmood.'
      ],
      correctAnswer: 'Wuxuu eegay Xiddigta Jahada (Waqooyi) ee cirka ku sugan.',
      explanationSomali: 'Sax! Xiddigta Jahadu ma guurto, badmaaxiintuna waxay ku gartaan afarta jiho.',
      explanationEnglish: 'Correct! Somali navigators use the fixed North Star (Xiddigta Jahada) to orient all four directions.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Nuur cilmiga xiddigaha wuxuu ka bartay awoowgiis oo ahaa naakhuude.',
      promptEnglish: 'True or False: Nuur learned star navigation from his grandfather who was a sea captain.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Awoowgiis ayaa baray magacyada xiddigaha iyo jihooyinka badda.',
      explanationEnglish: 'True! His grandfather taught him traditional maritime star navigation.'
    },
    blankQuestion: {
      sentenceTemplate: 'Nuur wuxuu cirka ka gartay _____ Jahada oo aan meesheeda ka dhaqaaqin.',
      promptEnglish: 'Nuur identified in the sky the North _____ which remains fixed in place.',
      correctAnswer: 'Xiddigta',
      acceptedAnswers: ['xiddigta', 'xiddig'],
      options: ['Xiddigta', 'Daruurta', 'Shimbirta'],
      explanationSomali: 'Xiddigta Jahadu waa xiddigta tilmaanta jihada waqooyi.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Saacad ka dib, waxay arkeen iftiinka _____ dekadda Marka.',
      promptEnglish: 'An hour later, they saw the light of the _____ of Marka harbour.',
      correctAnswer: 'faynuusyada',
      acceptedAnswers: ['faynuusyada', 'faynuuska', 'nalalka'],
      options: ['faynuusyada', 'buuraha', 'geedaha'],
      explanationSomali: 'Iftiinka faynuusyada dekadda ayaa u muuqday.'
    }
  },
  {
    id: 'libaaxii-iyo-jiirkii-yaraa',
    title: 'Libaaxii Weynaa iyo Jiirkii Yaraa',
    englishTitle: 'The Great Lion and the Little Mouse',
    subtitle: 'Abaal-gudka Naxariista iyo Saaxiibtinimada',
    levelId: 'level-3',
    categorySlug: 'xayawaanka',
    estimatedReadingMinutes: 6,
    learningPathOrder: 25,
    xpReward: 65,
    description:
      'A classic Somali fable retold: a mighty lion spares a tiny field mouse beneath an acacia tree, and days later the little mouse gnaws through a hunter’s rope net to set the lion free.',
    somaliSummary:
      'Sheeko-xariiro caan ah oo ku saabsan libaax cafiyay jiir yar, ka dibna jiirkii yaraa uu ilkihiisa ku jaray shabaq uu libaaxu ku dhacay.',
    moralSomali: 'Weligaa ha yaraysan wanaagga aad u samayso cid kasta, waayo qof yar ayaa ku badbaadin kara.',
    moralEnglish: 'No act of kindness is ever wasted; even the smallest friend can help the strongest.',
    sentences: [
      {
        somaliText: 'Maalin kulul, libaax weyn oo ah boqorka kaynta ayaa hoos seexday geed quraac ah.',
        englishTranslation: 'On a warm day, a great lion, king of the woodland, slept beneath the shade of an acacia tree.',
        sceneCaption: 'A golden-maned lion rests beneath an umbrella acacia tree.'
      },
      {
        somaliText: 'Jiir yar oo cawska dhex ordaya ayaa si kama’ ah u dul maray cagta libaaxa, markaasuu libaaxii toosay.',
        englishTranslation: 'A tiny mouse running through the grass accidentally ran across the lion’s paw, waking the lion up.',
        sceneCaption: 'The tiny mouse trembles before the giant lion’s paw.'
      },
      {
        somaliText: '"I cafi, boqorow! Maalin uun waan kuu abaal-gudi doonaa," ayuu ku baryootamay jiirkii yaraa.',
        englishTranslation: '"Forgive me, O King! One day I will repay your kindness," pleaded the little mouse.',
        sceneCaption: 'The lion smiles gently and lifts his paw to let the mouse go.'
      },
      {
        somaliText: 'Libaaxii wuu qoslay oo si naxariis leh ayuu u sii daayay jiirkii yaraa.',
        englishTranslation: 'The lion chuckled and mercifully set the little mouse free.',
        sceneCaption: 'The little mouse scurries safely into the tall grass.'
      },
      {
        somaliText: 'Maalmo ka dib, libaaxii wuxuu ku dhacay shabaq xadhko adag ka samaysan oo ugaadhsato dhigtay.',
        englishTranslation: 'Days later, the lion became trapped in a net woven of thick ropes set by hunters.',
        sceneCaption: 'The mighty lion struggles inside a heavy rope net.'
      },
      {
        somaliText: 'Jiirkii yaraa ayaa maqlay cida libaaxa, wuxuuna ku soo orday si uu ilkihiisa afka badan ugu gooyo xadhkaha shabaqa.',
        englishTranslation: 'The little mouse heard the lion’s roar and ran over to gnaw through the net ropes with his sharp teeth.',
        sceneCaption: 'The mouse chews steadily through the main knot of the rope.'
      },
      {
        somaliText: 'Libaaxii oo xoroobay ayaa u mahadceliyay saaxiibkiisa yaraa, wuxuuna ogaaday in naxariistu aysan weligeed lumin.',
        englishTranslation: 'Freed at last, the lion thanked his tiny friend and realized that kindness is never lost.',
        sceneCaption: 'The lion and the little mouse walk side by side in friendship.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Libaax',
        englishMeaning: 'Lion',
        pronunciationGuide: 'li-BAAX',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Libaaxii wuxuu cafiyay jiirkii yaraa.',
        exampleEnglish: 'The lion forgave the little mouse.',
        pictureKey: 'lion'
      },
      {
        somaliWord: 'Geed',
        englishMeaning: 'Tree',
        pronunciationGuide: 'GEED',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Libaaxu wuxuu hoos seexday geed quraac ah.',
        exampleEnglish: 'The lion slept beneath an acacia tree.',
        pictureKey: 'acacia_tree'
      },
      {
        somaliWord: 'Saaxiib',
        englishMeaning: 'Friend',
        pronunciationGuide: 'saa-XIIB',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Jiirkii yaraa wuxuu noqday saaxiib daacad ah.',
        exampleEnglish: 'The little mouse proved to be a loyal friend.',
        pictureKey: 'family_courtyard'
      },
      {
        somaliWord: 'Qorrax',
        englishMeaning: 'Sun',
        pronunciationGuide: 'QOR-rax',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Maalintu waxay ahayd mid qorrax kulul leh.',
        exampleEnglish: 'The day had warm sunshine.',
        pictureKey: 'sun'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Sidee ayuu jiirkii yaraa ku badbaadiyay libaaxii weynaa?',
      promptEnglish: 'How did the little mouse rescue the great lion?',
      options: [
        'Ilkihiisa afka badan ayuu ku jaray xadhkaha shabaqa.',
        'Biyo ayuu ku shubay.',
        'Odayaasha tuulada ayuu u yeeray.'
      ],
      correctAnswer: 'Ilkihiisa afka badan ayuu ku jaray xadhkaha shabaqa.',
      explanationSomali: 'Sax! Jiirkii yaraa wuxuu ilkihiisa ku gooyay xadhkaha adag ee shabaqa.',
      explanationEnglish: 'Correct! The mouse gnawed through the thick ropes with his sharp teeth.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Naxariistii uu libaaxu u muujiyay jiirka ayaa markii dambe badbaadisay libaaxa laftiisa.',
      promptEnglish: 'True or False: The kindness the lion showed the mouse later saved the lion himself.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Wanaagga aad samayso wuu kuu soo laabtaa.',
      explanationEnglish: 'True! Because the lion spared the mouse, the mouse later freed him.'
    },
    blankQuestion: {
      sentenceTemplate: 'Jiirkii yaraa wuxuu ilkihiisa afka badan ku gooyay xadhkaha _____.',
      promptEnglish: 'The little mouse gnawed through the ropes of the _____ with his sharp teeth.',
      correctAnswer: 'shabaqa',
      acceptedAnswers: ['shabaqa', 'shabaq'],
      options: ['shabaqa', 'buugga', 'faynuuska'],
      explanationSomali: 'Libaaxu wuxuu ku jiray shabaq xadhko adag ka samaysan.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Libaaxii wuxuu ogaaday in _____ aysan weligeed lumin.',
      promptEnglish: 'The lion realized that _____ is never wasted.',
      correctAnswer: 'naxariistu',
      acceptedAnswers: ['naxariistu', 'naxariis', 'wanaaggu'],
      options: ['naxariistu', 'cadhadu', 'kibirku'],
      explanationSomali: 'Sheekadu waxay na baraysaa in naxariistu aysan weligeed lumin.'
    }
  },
  {
    id: 'tartankii-akhriska-dugsiga',
    title: 'Tartankii Akhriska iyo Maktabadda Dugsiga',
    englishTitle: 'The School Reading Contest and the Library',
    subtitle: 'Deeqa oo Saaxiibbadeed ku Dhiirrigelisay Jacaylka Buugaagta',
    levelId: 'level-3',
    categorySlug: 'dugsiga',
    estimatedReadingMinutes: 6,
    learningPathOrder: 26,
    xpReward: 65,
    description:
      'Instead of competing alone in the annual Somali reading tournament, Deeqa forms a daily afternoon reading circle in the school library so her entire class improves together.',
    somaliSummary:
      'Deeqa oo ardayda fasalkeeda u samaysay goob akhris oo wada-jir ah si ay dhammaantood ugu guulaystaan tartanka akhriska Af-Soomaaliga.',
    moralSomali: 'Aqoonta oo la wadaago way kordhaa, guusha wada-jirkuna way ka macaan tahay guusha kelinimada.',
    moralEnglish: 'Knowledge grows when shared, and lifting others up is the highest achievement.',
    sentences: [
      {
        somaliText: 'Dugsiga Hoose iyo Dhexe ee Iftiin wuxuu ku dhawaaqay tartan weyn oo lagu tartamayo akhriska sheekooyinka Af-Soomaaliga.',
        englishTranslation: 'Iftiin Primary and Middle School announced a grand tournament for reading Somali stories.',
        sceneCaption: 'A poster on the school noticeboard announces the Somali Reading Contest.'
      },
      {
        somaliText: 'Deeqa oo ahayd gabadh aad u jecel akhriska waxay aragtay in qaar ka mid ah ardayda fasalkeedu ay ku adag yihiin erayada dhaadheer.',
        englishTranslation: 'Deeqa, who loved reading deeply, noticed that some of her classmates struggled with longer words.',
        sceneCaption: 'Deeqa sits with her classmates in the school library.'
      },
      {
        somaliText: 'Halkii ay keligeed is-diyaarin lahayd, Deeqa waxay aasaastay "Naadiga Akhriska Galabtii" ee maktabadda dugsiga.',
        englishTranslation: 'Instead of preparing all alone, Deeqa founded the "Afternoon Reading Club" in the school library.',
        sceneCaption: 'Students gather around a wooden library table with Somali storybooks.'
      },
      {
        somaliText: 'Maalin kasta waxay sabuuradda ku qori jireen shan eray oo cusub, wayna iska dhageysan jireen akhriska.',
        englishTranslation: 'Every day they wrote five new words on the chalkboard and listened to one another read aloud.',
        sceneCaption: 'Deeqa points to segmented Somali syllables on the board.'
      },
      {
        somaliText: 'Maalintii tartanka, fasalka Deeqa oo dhan wuxuu muujiyay akhris faseex ah iyo faham sare.',
        englishTranslation: 'On the day of the tournament, Deeqa’s entire class demonstrated fluent reading and deep comprehension.',
        sceneCaption: 'Students read confidently on stage before teachers and parents.'
      },
      {
        somaliText: 'Guddigii garsoorka waxay fasalka Deeqa gudoonsiiyeen koobka koowaad iyo konton buug oo cusub oo maktabadda lagu daro.',
        englishTranslation: 'The judging panel awarded Deeqa’s class the first-place trophy and fifty new books for the school library.',
        sceneCaption: 'The class celebrates together holding their new library books.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Buug',
        englishMeaning: 'Book',
        pronunciationGuide: 'BUUG',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Maktabadda waxaa lagu daray konton buug oo cusub.',
        exampleEnglish: 'Fifty new books were added to the library.',
        pictureKey: 'school_book'
      },
      {
        somaliWord: 'Sabuurad',
        englishMeaning: 'Chalkboard',
        pronunciationGuide: 'sa-BUU-rad',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Erayada cusub waxay ku qoreen sabuuradda.',
        exampleEnglish: 'They wrote the new words on the chalkboard.',
        pictureKey: 'pencil_slate'
      },
      {
        somaliWord: 'Saaxiib',
        englishMeaning: 'Classmate / Friend',
        pronunciationGuide: 'saa-XIIB',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Deeqa waxay caawisay saaxiibbadeed.',
        exampleEnglish: 'Deeqa helped her classmates.',
        pictureKey: 'family_courtyard'
      },
      {
        somaliWord: 'Dugsi',
        englishMeaning: 'School',
        pronunciationGuide: 'DUG-si',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Dugsiga Iftiin wuxuu qabtay tartan akhris.',
        exampleEnglish: 'Iftiin School held a reading contest.',
        pictureKey: 'pencil_slate'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay Deeqa samaysay si ay u caawiso ardayda fasalkeeda ka hor tartanka?',
      promptEnglish: 'What did Deeqa do to help her classmates before the reading contest?',
      options: [
        'Waxay aasaastay Naadiga Akhriska Galabtii ee maktabadda dugsiga.',
        'Buugaagtii oo dhan ayay qarisay.',
        'Tartanka way ka hartay.'
      ],
      correctAnswer: 'Waxay aasaastay Naadiga Akhriska Galabtii ee maktabadda dugsiga.',
      explanationSomali: 'Sax! Deeqa waxay ardayda u samaysay naadi akhris oo ay maalin walba ku wada tababartaan.',
      explanationEnglish: 'Correct! Deeqa started an afternoon reading club so everyone could practice together.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Fasalka Deeqa wuxuu ku guulaystay koobka koowaad iyo konton buug oo cusub.',
      promptEnglish: 'True or False: Deeqa’s class won first place and fifty new books for the library.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Iskaashigooda awgiis fasalka oo dhan ayaa guulaystay.',
      explanationEnglish: 'True! Their teamwork won fifty new books for the school library.'
    },
    blankQuestion: {
      sentenceTemplate: 'Maalin kasta waxay _____ ku qori jireen shan eray oo cusub.',
      promptEnglish: 'Every day they wrote five new words on the _____.',
      correctAnswer: 'sabuuradda',
      acceptedAnswers: ['sabuuradda', 'sabuurad'],
      options: ['sabuuradda', 'doonta', 'dambiisha'],
      explanationSomali: 'Erayada cusub waxaa lagu qorayay sabuuradda.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Guddigii garsoorka waxay siiyeen konton _____ oo cusub oo maktabadda lagu daro.',
      promptEnglish: 'The judging panel awarded fifty new _____ to be added to the library.',
      correctAnswer: 'buug',
      acceptedAnswers: ['buug', 'buugaag'],
      options: ['buug', 'faynuus', 'kalluun'],
      explanationSomali: 'Abaalmarintu waxay ahayd konton buug oo cusub.'
    }
  },
  {
    id: 'dhismaha-aqalka-soomaaliga',
    title: 'Farshaxanka iyo Dhismaha Aqalka Soomaaliga',
    englishTitle: 'The Craft and Building of the Somali Aqal',
    subtitle: 'hibo oo Hooyadeed iyo Ayeeyadeed ka Baranaysa Farsamada Dhaqanka',
    levelId: 'level-3',
    categorySlug: 'dhaqanka',
    estimatedReadingMinutes: 6,
    learningPathOrder: 27,
    xpReward: 65,
    description:
      'Eleven-year-old Hibo learns the remarkable engineering and weaving artistry of the traditional Somali dome home (Aqal Soomaali), from curved udub pillars to handwoven kebed mats.',
    somaliSummary:
      'Hibo oo baranaysa injineernimada iyo farshaxanka lagu dhiso Aqalka Soomaaliga, sida udubbada, dhigaha, iyo kebedda.',
    moralSomali: 'Aqoonta farshaxanka iyo dhismaha dhaqankeennu waa xigmad fac weyn.',
    moralEnglish: 'Traditional Somali craftsmanship combines ecological wisdom, beauty, and engineering.',
    sentences: [
      {
        somaliText: 'Hibo waxay fasaxa dugsiga ku booqatay reerka ayeeyadeed oo deggen deegaan cagaaran oo miyi ah.',
        englishTranslation: 'During the school holiday, Hibo visited her grandmother’s family living in a green pastoral settlement.',
        sceneCaption: 'A traditional Somali aqal stands gracefully beneath acacia trees.'
      },
      {
        somaliText: 'Waxay aragtay dumarka reerka oo si xirfad leh uga shaqaynaya dhismaha aqal cusub oo qurux badan.',
        englishTranslation: 'She watched the women of the settlement skilfully constructing a beautiful new traditional home.',
        sceneCaption: 'Curved wooden arches are tied together in a strong dome frame.'
      },
      {
        somaliText: 'Ayeeyadeed ayaa u sharxday sida dhigaha qalloocan iyo udubbada dhexe ay aqalka uga dhigaan mid u adkaysta dabaysha.',
        englishTranslation: 'Her grandmother explained how the curved arches and central pillars make the dome home resilient against strong winds.',
        sceneCaption: 'Grandmother shows Hibo how the woven rope knots secure the frame.'
      },
      {
        somaliText: 'Hibo waxay gacanteeda ku taabatay kebedda iyo dermada midabbada dabiiciga ah lagu xardhay.',
        englishTranslation: 'Hibo touched with her own hands the thick roof mats and sleeping mats decorated with natural geometric dyes.',
        sceneCaption: 'Intricate geometric patterns adorn the handwoven kebed mat.'
      },
      {
        somaliText: 'Gudaha aqalka wuxuu ahaa mid qabow marka qorraxdu kulushahay, habeenkiina diirran.',
        englishTranslation: 'Inside, the aqal remained naturally cool when the sun was hot, and warm during the night.',
        sceneCaption: 'Sunlight filters softly into the tidy interior with carved wooden vessels.'
      },
      {
        somaliText: 'Hibo waxay qortay warbixin cilmiyeed oo ay ardayda dugsigeeda ugu sharxayso injineernimada Aqalka Soomaaliga.',
        englishTranslation: 'Hibo wrote a research report to explain to her school classmates the eco-friendly engineering of the Somali Aqal.',
        sceneCaption: 'Hibo presents her illustrated report and woven sample at school.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Aqal',
        englishMeaning: 'Traditional Somali dome house',
        pronunciationGuide: 'A-qal',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Aqalka Soomaaligu wuxuu ka samaysan yahay dhir dabiici ah.',
        exampleEnglish: 'The Somali aqal is crafted from natural plant materials.',
        pictureKey: 'somali_aqal'
      },
      {
        somaliWord: 'Dermo',
        englishMeaning: 'Handwoven geometric mat',
        pronunciationGuide: 'DER-mo',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Dermada waxaa lagu xardhay midabbo qurux badan.',
        exampleEnglish: 'The woven mat is decorated with beautiful colours.',
        pictureKey: 'woven_mat'
      },
      {
        somaliWord: 'Dhiil',
        englishMeaning: 'Carved/woven milk vessel',
        pronunciationGuide: 'DHIIL',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Gudaha aqalka waxaa taal dhiil caano ah.',
        exampleEnglish: 'Inside the aqal stands a milk vessel.',
        pictureKey: 'milk_dhiil'
      },
      {
        somaliWord: 'Buug',
        englishMeaning: 'Research notebook / Book',
        pronunciationGuide: 'BUUG',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Hibo waxay warbixinteeda ku qortay buuggeeda.',
        exampleEnglish: 'Hibo wrote her report in her notebook.',
        pictureKey: 'school_book'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Waa sidee cimilada gudaha Aqalka Soomaaliga marka qorraxdu kulushahay?',
      promptEnglish: 'What is the temperature like inside the Somali Aqal when the sun is hot outside?',
      options: [
        'Gudihiisu waa mid qabow maalintii, habeenkiina diirran.',
        'Aad ayuu u kululaadaa.',
        'Roobka ayaa gudaha u soo daata.'
      ],
      correctAnswer: 'Gudihiisu waa mid qabow maalintii, habeenkiina diirran.',
      explanationSomali: 'Sax! Dhismaha dabiiciga ah ee aqalku wuxuu ka dhigaa mid qabow maalintii, habeenkiina diirran.',
      explanationEnglish: 'Correct! The natural woven mats insulate the home, keeping it cool by day and warm at night.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Dhigaha qalloocan iyo udubbada dhexe waxay aqalka ka dhigaan mid u adkaysta dabaysha.',
      promptEnglish: 'True or False: The curved arches and central pillars make the aqal strong against the wind.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Qaabka goobada ah ee dhigaha ayaa dabaysha iska caabbiya.',
      explanationEnglish: 'True! The aerodynamic dome structure resists strong savannah winds.'
    },
    blankQuestion: {
      sentenceTemplate: 'Hibo waxay qortay warbixin ku saabsan injineernimada _____ Soomaaliga.',
      promptEnglish: 'Hibo wrote a report about the engineering of the Somali _____.',
      correctAnswer: 'Aqalka',
      acceptedAnswers: ['aqalka', 'aqal'],
      options: ['Aqalka', 'Baabuurka', 'Tareenka'],
      explanationSomali: 'Warbixinta Hibo waxay ku saabsanayd dhismaha Aqalka Soomaaliga.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Hibo waxay taabatay kebedda iyo _____ midabbada dabiiciga ah lagu xardhay.',
      promptEnglish: 'Hibo touched the roof mats and the _____ decorated with natural dyes.',
      correctAnswer: 'dermada',
      acceptedAnswers: ['dermada', 'dermo'],
      options: ['dermada', 'sabuuradda', 'doonta'],
      explanationSomali: 'Dermada iyo kebedda waxaa lagu xardhaa midabbo dabiici ah.'
    }
  },
  {
    id: 'maroodigii-iyo-webiga-shabeelle',
    title: 'Maroodigii Da’da Weynaa iyo Webiga',
    englishTitle: 'The Elder Elephant and the River',
    subtitle: 'IlaalintaWaddada Xayawaanka iyo Beeraha Webiga Jiinkiisa',
    levelId: 'level-3',
    categorySlug: 'xayawaanka',
    estimatedReadingMinutes: 6,
    learningPathOrder: 28,
    xpReward: 65,
    description:
      'Along the fertile banks of the Shabelle River, young Mahad helps village farmers leave a dedicated green corridor open so a family of elephants can reach the water without trampling the crops.',
    somaliSummary:
      'Mahad oo beeralayda tuulada ku dhiirrigeliyay inay jid nabad ah u baneeyaan maroodiyaasha u socda biyaha webiga.',
    moralSomali: 'Dadka iyo duurjoogtu way wada noolaan karaan haddii la isticmaalo xigmad iyo naxariis.',
    moralEnglish: 'People and wildlife can coexist peacefully through thoughtful planning and respect.',
    sentences: [
      {
        somaliText: 'Tuulada Mahad waxay ku taal jiinka webiga Shabeelle, halkaas oo beeruhu ka baxaan.',
        englishTranslation: 'Mahad’s village lies along the bank of the Shabelle River, where lush farms grow.',
        sceneCaption: 'Green farmland borders the winding river beneath acacia trees.'
      },
      {
        somaliText: 'Xilligii abaarta, raxan maroodiyaal ah oo uu hoggaaminayo maroodi da’ weyn ayaa u soo dhaqaaqday dhanka webiga.',
        englishTranslation: 'During the dry season, a herd of elephants led by an elder elephant moved toward the river.',
        sceneCaption: 'A family of elephants walks majestically across the valley.'
      },
      {
        somaliText: 'Beeralaydii waxay ka walwaleen in maroodiyaashu ay kuumaraan dalagga galleyda iyo mooska.',
        englishTranslation: 'The farmers worried that the elephants might trample their crops of maize and bananas.',
        sceneCaption: 'Farmers gather at the edge of their fields.'
      },
      {
        somaliText: 'Mahad oo daraaseeyay dhaqanka maroodiga ayaa ogaaday in maroodiyaashu ay mar walba raacaan jidkii hore ee awoowayaashood.',
        englishTranslation: 'Mahad, who had studied elephant behaviour, realized that elephants always follow their ancestral migration path.',
        sceneCaption: 'Mahad points out the old wide trail leading between two hills to the river.'
      },
      {
        somaliText: 'Tuuladu waxay banaysay marin ballaaran oo toos u taga biyaha webiga, waxayna geesaha beeraha ku xireen shinni-xanaano.',
        englishTranslation: 'The village cleared a wide corridor leading straight to the river water and placed beehive fences along the farm borders.',
        sceneCaption: 'The elephants walk calmly down the open green corridor to drink.'
      },
      {
        somaliText: 'Maroodiyaashii si nabad ah ayay webiga uga cabbeen iyagoo aan hal geed oo beer ah dhaawicin.',
        englishTranslation: 'The elephants drank peacefully from the river without damaging a single farm plant.',
        sceneCaption: 'Young elephant calves splash happily at the riverbank.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Maroodi',
        englishMeaning: 'Elephant',
        pronunciationGuide: 'ma-ROO-di',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Maroodiyaashu waxay raaceen marinkii loo baneeyay.',
        exampleEnglish: 'The elephants followed the corridor cleared for them.',
        pictureKey: 'elephant'
      },
      {
        somaliWord: 'Biyo',
        englishMeaning: 'Water',
        pronunciationGuide: 'BI-yo',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Waxay webiga ka cabbeen biyo.',
        exampleEnglish: 'They drank water from the river.',
        pictureKey: 'water_well'
      },
      {
        somaliWord: 'Geed',
        englishMeaning: 'Tree / Plant',
        pronunciationGuide: 'GEED',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Ma aysan dhaawicin hal geed oo beer ah.',
        exampleEnglish: 'They did not harm a single farm tree.',
        pictureKey: 'acacia_tree'
      },
      {
        somaliWord: 'Buur',
        englishMeaning: 'Hill',
        pronunciationGuide: 'BUUR',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Marinku wuxuu dhex maraa laba buurood.',
        exampleEnglish: 'The corridor passes between two hills.',
        pictureKey: 'mountain_hill'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Sidee ayay tuuladu ku badbaadisay beeraha iyadoo maroodiyaashana u ogolaatay inay cabbaan?',
      promptEnglish: 'How did the village protect the farms while allowing the elephants to drink?',
      options: [
        'Waxay u baneeyeen marin toos u taga webiga waxayna beeraha ku wareejiyeen shinni.',
        'Webigii ayay xireen.',
        'Beerihii oo dhan ayay guuriyeen.'
      ],
      correctAnswer:
        'Waxay u baneeyeen marin toos u taga webiga waxayna beeraha ku wareejiyeen shinni.',
      explanationSomali: 'Sax! Marinka furan iyo xeyndaabka shinnida ayaa labada dhinacba badbaadiyay.',
      explanationEnglish: 'Correct! Clearing the ancestral corridor and using beehive fences protected both crops and elephants.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Maroodiyaashii si nabad ah ayay webiga uga cabbeen iyagoo aan beeraha dhaawicin.',
      promptEnglish: 'True or False: The elephants drank peacefully from the river without harming the farms.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Qorshaha xigmadda leh ee Mahad wuxuu keenay nabad.',
      explanationEnglish: 'True! Both the farmers and the elephant herd thrived.'
    },
    blankQuestion: {
      sentenceTemplate: 'Raxan _____ ah ayaa u soo dhaqaaqday dhanka webiga Shabeelle.',
      promptEnglish: 'A herd of _____ moved toward the Shabelle River.',
      correctAnswer: 'maroodiyaal',
      acceptedAnswers: ['maroodiyaal', 'maroodi'],
      options: ['maroodiyaal', 'kalluun', 'shimbiro'],
      explanationSomali: 'Sheekadu waxay ku saabsan tahay raxan maroodiyaal ah.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Tuuladu waxay banaysay _____ ballaaran oo toos u taga biyaha webiga.',
      promptEnglish: 'The village cleared a wide _____ leading straight to the river water.',
      correctAnswer: 'marin',
      acceptedAnswers: ['marin', 'jid', 'waddo'],
      options: ['marin', 'faynuus', 'buug'],
      explanationSomali: 'Marinka loo baneeyay ayaa maroodiyaasha u sahlay inay webiga gaaraan.'
    }
  },
  {
    id: 'nabadda-tuulada-barwaaqo',
    title: 'Buundadii Iskaashiga ee Tuulada Barwaaqo',
    englishTitle: 'The Bridge of Cooperation in Barwaaqo Village',
    subtitle: 'Sida Dhallinyaradu u Dhiseen Buundo Isku Xirta Dugsiga iyo Tuulada',
    levelId: 'level-3',
    categorySlug: 'saaxiibtinimada',
    estimatedReadingMinutes: 6,
    learningPathOrder: 29,
    xpReward: 65,
    description:
      'When heavy rains swell the seasonal stream between two halves of Barwaaqo village, students and parents unite to build a sturdy stone-and-timber footbridge so young children can cross safely to school.',
    somaliSummary:
      'Ardayda iyo waalidiinta tuulada Barwaaqo oo iska kaashaday dhismaha buundo adag oo carruurtu si ammaan ah uga gudbaan xilliga roobka.',
    moralSomali: 'Midnimada iyo iskaashiga bulshadu waxay ka gudbaan caqabad kasta.',
    moralEnglish: 'Community unity and shared effort build bridges over every obstacle.',
    sentences: [
      {
        somaliText: 'Tuulada Barwaaqo waxaa dhex mara tog weyn oo xilliga roobka biyo badan keena.',
        englishTranslation: 'Through Barwaaqo village runs a wide seasonal stream that fills with water during the rains.',
        sceneCaption: 'Rainwater flows briskly through the stream dividing the village.'
      },
      {
        somaliText: 'Markii roobku da’o, carruurta yaryar way ku adkaan jirtay inay u tallaabaan dhanka dugsiga.',
        englishTranslation: 'Whenever the rain fell, it became difficult for the younger children to cross over to the school side.',
        sceneCaption: 'Young students wait on the bank looking across toward their school.'
      },
      {
        somaliText: 'Khaalid iyo Muna oo ah ardayda fasalka lixaad ayaa macallinkooda iyo waalidiinta u soobandhigay qorshe buundo lagu dhisayo.',
        englishTranslation: 'Khaalid and Muna, sixth-grade students, presented to their teacher and parents a plan to build a footbridge.',
        sceneCaption: 'Khaalid and Muna show a neat drawing of a stone-and-wood bridge.'
      },
      {
        somaliText: 'Qoys walba wuxuu keenay dhagaxaan siman, alwaax adag, iyo xadhko lagu xiro tiirarka.',
        englishTranslation: 'Every family contributed smooth stones, strong timber planks, and ropes to secure the railings.',
        sceneCaption: 'Villagers and youth work together laying the bridge foundation.'
      },
      {
        somaliText: 'Saddex maalmood oo shaqo wada-jir ah ka dib, buundo adag oo leh biraha gacanta lagu qabsado ayaa la dhammaystiray.',
        englishTranslation: 'After three days of cooperative work, a sturdy bridge with safe handrails was completed.',
        sceneCaption: 'A solid timber-and-stone bridge spans the flowing stream.'
      },
      {
        somaliText: 'Carruurtii yaryarayd waxay buundada uga gudbeen farxad iyo ammaan iyagoo u socda dugsigooda.',
        englishTranslation: 'The young children crossed the bridge in joy and safety on their way to school.',
        sceneCaption: 'Children walk safely across the bridge carrying their schoolbooks.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Dugsi',
        englishMeaning: 'School',
        pronunciationGuide: 'DUG-si',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Buundadu waxay isku xirtay tuulada iyo dugsiga.',
        exampleEnglish: 'The bridge connected the village and the school.',
        pictureKey: 'pencil_slate'
      },
      {
        somaliWord: 'Qoys',
        englishMeaning: 'Family / Household',
        pronunciationGuide: 'QOYS',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Qoys walba wuxuu ka qayb-qaatay dhismaha.',
        exampleEnglish: 'Every family participated in the construction.',
        pictureKey: 'family_courtyard'
      },
      {
        somaliWord: 'Roob',
        englishMeaning: 'Rain',
        pronunciationGuide: 'ROOB',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Xilliga roobka toggu wuu buuxsamaa.',
        exampleEnglish: 'During the rain the stream fills up.',
        pictureKey: 'rain_cloud'
      },
      {
        somaliWord: 'Buug',
        englishMeaning: 'Book',
        pronunciationGuide: 'BUUG',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Carruurtu waxay wataan buugaagtooda.',
        exampleEnglish: 'The children carry their books.',
        pictureKey: 'school_book'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay tuulada Barwaaqo u dhistay buundada cusub?',
      promptEnglish: 'Why did Barwaaqo village build the new footbridge?',
      options: [
        'Si carruurtu si ammaan ah ugu gudbaan dhanka dugsiga xilliga roobka.',
        'Si doomaha waaweyn loogu xiro.',
        'Si xiddigaha looga tiriyo.'
      ],
      correctAnswer: 'Si carruurtu si ammaan ah ugu gudbaan dhanka dugsiga xilliga roobka.',
      explanationSomali: 'Sax! Buundadu waxay carruurta u suurtagelisay inay si ammaan ah ku tagaan dugsiga.',
      explanationEnglish: 'Correct! The bridge enabled children to cross the stream safely to school.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Qoysaska tuulada oo dhan way iska kaashadeen dhismaha buundada.',
      promptEnglish: 'True or False: All the families in the village cooperated to build the bridge.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Qoys walba wuxuu keenay dhagaxaan iyo alwaax, si wada-jir ah ayayna u dhiseen.',
      explanationEnglish: 'True! Every household contributed materials and labour.'
    },
    blankQuestion: {
      sentenceTemplate: 'Saddex maalmood ka dib, _____ adag oo leh biraha gacanta lagu qabsado ayaa la dhammaystiray.',
      promptEnglish: 'After three days, a sturdy _____ with safe handrails was completed.',
      correctAnswer: 'buundo',
      acceptedAnswers: ['buundo', 'buundadii'],
      options: ['buundo', 'doon', 'dambiil'],
      explanationSomali: 'Waxay dhiseen buundo adag oo togga dul marta.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Carruurtii yaryarayd waxay buundada uga gudbeen farxad iyagoo u socda _____.',
      promptEnglish: 'The young children crossed the bridge joyfully on their way to _____.',
      correctAnswer: 'dugsigooda',
      acceptedAnswers: ['dugsigooda', 'dugsiga', 'dugsi'],
      options: ['dugsigooda', 'badda', 'buurta'],
      explanationSomali: 'Carruurtu waxay u socdeen dugsigooda.'
    }
  },
  {
    id: 'rijada-habeenka-curashada',
    title: 'Habeenka Curashada Sanadka iyo Riyada Mustaqbalka',
    englishTitle: 'New Year’s Eve and Dreams of the Future',
    subtitle: 'Sheeko Habeenkii oo Ku Saabsan Hadafka, Akhriska, iyo Dadaalka',
    levelId: 'level-3',
    categorySlug: 'habeenkii',
    estimatedReadingMinutes: 6,
    learningPathOrder: 30,
    xpReward: 70,
    description:
      'On a quiet starry evening marking the start of a new year, Yasmiin and her family reflect on the books they read, share gratitude, and write down their learning goals for the year ahead.',
    somaliSummary:
      'Yasmiin iyo qoyskeeda oo habeen xasilloon oo xiddiguhu nuurayaan dib u eegaya waxyaabihii ay barteen, qoranayana yoolalka sanadka cusub.',
    moralSomali: 'Qofka yool cad samaysta oo maalin walba wax akhriya wuxuu gaaraa riyadiisa.',
    moralEnglish: 'Setting thoughtful goals and reading every day turns dreams into reality.',
    sentences: [
      {
        somaliText: 'Habeen xasilloon oo bil cusub iyo sanad cusub bilaabanayaan, qoyska Yasmiin waxay ku kulmeen barxadda guriga.',
        englishTranslation: 'On a calm evening marking the start of a new month and a new year, Yasmiin’s family gathered in the courtyard.',
        sceneCaption: 'A glowing lantern and starry sky illuminate the peaceful courtyard.'
      },
      {
        somaliText: 'Faynuus iftiin diirran leh ayaa dhex yaallay dermada, cirkana waxaa ka muuqday dayax iyo xiddigo dhalaalaya.',
        englishTranslation: 'A warm lantern stood in the centre of the woven mat, and a bright moon and stars shone in the sky.',
        sceneCaption: 'The crescent moon reflects softly above the family home.'
      },
      {
        somaliText: 'Qof walba wuxuu ka sheekeeyay sheekadii ugu fiicnayd ee uu akhriyay sanadkii dhammaaday iyo casharkii uu ka bartay.',
        englishTranslation: 'Everyone shared the favourite story they had read during the past year and the lesson they had learned from it.',
        sceneCaption: 'Yasmiin holds up her favourite Somali storybook.'
      },
      {
        somaliText: 'Yasmiin waxay sheegtay inay baratay boqol eray oo cusub oo Af-Soomaali ah iyo sida loo qoro sheekooyin gaagaaban.',
        englishTranslation: 'Yasmiin shared that she had learned a hundred new Somali words and how to write short stories of her own.',
        sceneCaption: 'Yasmiin opens her handwritten story notebook.'
      },
      {
        somaliText: 'Aabbe iyo Hooyo waxay carruurta siiyeen buugaag cusub oo ay ku qortaan riyooyinka iyo yoolalka sanadka cusub.',
        englishTranslation: 'Father and Mother gifted the children new notebooks in which to write their dreams and goals for the new year.',
        sceneCaption: 'Parents present clean bound notebooks to the smiling children.'
      },
      {
        somaliText: 'Yasmiin waxay bogga koowaad ku qortay: "Sanadkan waxaan akhrin doonaa soddon sheeko, waxaana caawin doonaa carruurta yaryar."',
        englishTranslation: 'On the first page Yasmiin wrote: "This year I will read thirty stories, and I will help younger children learn to read."',
        sceneCaption: 'Yasmiin writes her resolution neatly by lantern light.'
      },
      {
        somaliText: 'Habeenkaasi wuxuu ku dhammaaday duco, rajo wanaagsan, iyo hurdo xasilloon.',
        englishTranslation: 'That evening concluded with blessings, bright hope, and peaceful sleep.',
        sceneCaption: 'Stars shine over the quiet sleeping house.'
      }
    ],
    vocabulary: [
      {
        somaliWord: 'Xiddig',
        englishMeaning: 'Star',
        pronunciationGuide: 'XID-dig',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Cirka waxaa ka muuqday xiddigo dhalaalaya.',
        exampleEnglish: 'Shining stars appeared in the sky.',
        pictureKey: 'moon_stars'
      },
      {
        somaliWord: 'Faynuus',
        englishMeaning: 'Lantern',
        pronunciationGuide: 'fay-NUUS',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Faynuus iftiin diirran leh ayaa dhex yaallay dermada.',
        exampleEnglish: 'A warm lantern stood on the woven mat.',
        pictureKey: 'lantern'
      },
      {
        somaliWord: 'Buug',
        englishMeaning: 'Book / Notebook',
        pronunciationGuide: 'BUUG',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Yasmiin waxay heshay buug cusub.',
        exampleEnglish: 'Yasmiin received a new notebook.',
        pictureKey: 'school_book'
      },
      {
        somaliWord: 'Qoys',
        englishMeaning: 'Family',
        pronunciationGuide: 'QOYS',
        partOfSpeech: 'Magac (Noun)',
        exampleSomali: 'Qoyska Yasmiin waxay wadaageen riyooyinkooda.',
        exampleEnglish: 'Yasmiin’s family shared their dreams.',
        pictureKey: 'family_courtyard'
      }
    ],
    comprehensionQuestion: {
      promptSomali: 'Maxay Yasmiin ku qortay bogga koowaad ee buuggeeda cusub?',
      promptEnglish: 'What did Yasmiin write on the first page of her new notebook?',
      options: [
        'Inay akhrin doonto soddon sheeko oo ay caawin doonto carruurta yaryar.',
        'Inay joojin doonto akhriska.',
        'Inay maalin walba seexan doonto.'
      ],
      correctAnswer: 'Inay akhrin doonto soddon sheeko oo ay caawin doonto carruurta yaryar.',
      explanationSomali: 'Sax! Yasmiin waxay ballan-qaadday inay akhrido soddon sheeko oo ay caawiso carruurta yaryar.',
      explanationEnglish: 'Correct! Yasmiin resolved to read thirty stories and help younger children read.'
    },
    trueFalseQuestion: {
      promptSomali: 'Run mise Been: Yasmiin waxay sanadkii dhammaaday baratay boqol eray oo cusub oo Af-Soomaali ah.',
      promptEnglish: 'True or False: Yasmiin learned a hundred new Somali words during the past year.',
      correctBoolean: true,
      explanationSomali: 'Waa run! Dadaalkeeda akhriska ayay ku baratay boqol eray oo cusub.',
      explanationEnglish: 'True! Through her daily reading she mastered a hundred new Somali words.'
    },
    blankQuestion: {
      sentenceTemplate: 'Aabbe iyo Hooyo waxay carruurta siiyeen _____ cusub oo ay ku qortaan yoolalkooda.',
      promptEnglish: 'Father and Mother gifted the children new _____ to write their goals in.',
      correctAnswer: 'buugaag',
      acceptedAnswers: ['buugaag', 'buug'],
      options: ['buugaag', 'doomo', 'shabaqyo'],
      explanationSomali: 'Waalidku waxay siiyeen buugaag cusub.'
    },
    completeSentenceQuestion: {
      sentenceTemplate: 'Habeenkaasi wuxuu ku dhammaaday duco, _____ wanaagsan, iyo hurdo xasilloon.',
      promptEnglish: 'That evening ended with blessings, bright _____, and peaceful sleep.',
      correctAnswer: 'rajo',
      acceptedAnswers: ['rajo', 'riyo'],
      options: ['rajo', 'qaylo', 'cabsi'],
      explanationSomali: 'Habeenkaasi wuxuu ku dhammaaday duco iyo rajo wanaagsan.'
    }
  }
];
