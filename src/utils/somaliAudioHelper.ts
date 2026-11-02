/**
 * Somali Audio & Speech Synthesis Helper (Authentic Phonetics Engine)
 *
 * Solves the critical phonetic issue where standard OS text-to-speech engines
 * lack native Somali voices and butcher Somali orthography (e.g., mispronouncing
 * 'X' as 'Eks', 'C' as 'See', 'DH' as 'Dee-Aych', 'Q' as 'Kyuu', and 'Geel' as 'Jeel').
 *
 * Architecture:
 * 1. Primary: Dedicated studio-quality audio assets in /audio/somali/ for the entire
 *    alphabet (21 consonants + 10 vowels), numbers 1-10, common greetings, and story vocabulary.
 * 2. Fallback: Rule-based phonetic transliteration engine that maps Somali orthography
 *    to pure phonetic tokens readable by standard browser synthesis voices without distortion.
 */

// Mapping of letters to pre-recorded studio audio files
const PRE_RECORDED_LETTERS: Record<string, string> = {
  b: '/audio/somali/letters/b.wav',
  t: '/audio/somali/letters/t.wav',
  j: '/audio/somali/letters/j.wav',
  x: '/audio/somali/letters/x.wav',
  kh: '/audio/somali/letters/kh.wav',
  d: '/audio/somali/letters/d.wav',
  r: '/audio/somali/letters/r.wav',
  s: '/audio/somali/letters/s.wav',
  sh: '/audio/somali/letters/sh.wav',
  dh: '/audio/somali/letters/dh.wav',
  c: '/audio/somali/letters/c.wav',
  g: '/audio/somali/letters/g.wav',
  f: '/audio/somali/letters/f.wav',
  q: '/audio/somali/letters/q.wav',
  k: '/audio/somali/letters/k.wav',
  l: '/audio/somali/letters/l.wav',
  m: '/audio/somali/letters/m.wav',
  n: '/audio/somali/letters/n.wav',
  w: '/audio/somali/letters/w.wav',
  h: '/audio/somali/letters/h.wav',
  y: '/audio/somali/letters/y.wav',
  a: '/audio/somali/letters/a.wav',
  e: '/audio/somali/letters/e.wav',
  i: '/audio/somali/letters/i.wav',
  o: '/audio/somali/letters/o.wav',
  u: '/audio/somali/letters/u.wav',
  aa: '/audio/somali/letters/aa.wav',
  ee: '/audio/somali/letters/ee.wav',
  ii: '/audio/somali/letters/ii.wav',
  oo: '/audio/somali/letters/oo.wav',
  uu: '/audio/somali/letters/uu.wav'
};

const PRE_RECORDED_PHRASES: Record<string, string> = {
  'p-1': '/audio/somali/phrases/p-1.wav',
  'p-2': '/audio/somali/phrases/p-2.wav',
  'p-3': '/audio/somali/phrases/p-3.wav',
  'p-4': '/audio/somali/phrases/p-4.wav',
  'p-5': '/audio/somali/phrases/p-5.wav',
  'p-6': '/audio/somali/phrases/p-6.wav',
  'p-7': '/audio/somali/phrases/p-7.wav',
  'p-8': '/audio/somali/phrases/p-8.wav',
  'p-9': '/audio/somali/phrases/p-9.wav',
  'p-10': '/audio/somali/phrases/p-10.wav',
  'p-11': '/audio/somali/numbers/p-11.wav',
  'p-12': '/audio/somali/numbers/p-12.wav',
  'p-13': '/audio/somali/numbers/p-13.wav',
  'p-14': '/audio/somali/numbers/p-14.wav',
  'p-15': '/audio/somali/numbers/p-15.wav',
  'p-16': '/audio/somali/numbers/p-16.wav',
  'p-17': '/audio/somali/numbers/p-17.wav',
  'p-18': '/audio/somali/numbers/p-18.wav',
  'p-19': '/audio/somali/numbers/p-19.wav',
  'p-20': '/audio/somali/numbers/p-20.wav'
};

const PRE_RECORDED_WORDS: Record<string, string> = {
  buug: '/audio/somali/words/buug.wav',
  geel: '/audio/somali/words/geel.wav',
  qalin: '/audio/somali/words/qalin.wav',
  roob: '/audio/somali/words/roob.wav',
  dhiil: '/audio/somali/words/dhiil.wav',
  hooyo: '/audio/somali/words/hooyo.wav',
  shimbir: '/audio/somali/words/shimbir.wav',
  faras: '/audio/somali/words/faras.wav',
  aabe: '/audio/somali/words/aabe.wav',
  caano: '/audio/somali/words/caano.wav',
  libaax: '/audio/somali/words/libaax.wav',
  kalluun: '/audio/somali/words/kalluun.wav'
};

/**
 * Phonetically transforms Somali orthography into sound-accurate phonetic tokens
 * so standard browser text-to-speech engines do NOT mispronounce Somali sounds.
 */
export function somaliToSpeechPhonetics(text: string): string {
  if (!text || typeof text !== 'string') return '';

  const clean = text.trim();

  // 1. Single letter pronunciations (Somali alphabet letter names)
  const singleLetters: Record<string, string> = {
    B: 'Bah',
    T: 'Tah',
    J: 'Jah',
    X: 'Hah',
    KH: 'Khah',
    D: 'Dah',
    R: 'Rah',
    S: 'Sah',
    SH: 'Shah',
    DH: 'Dhah',
    C: 'Ah',
    G: 'Gah',
    F: 'Fah',
    Q: 'Kah',
    K: 'Kah',
    L: 'Lah',
    M: 'Mah',
    N: 'Nah',
    W: 'Wah',
    H: 'Hah',
    Y: 'Yah',
    A: 'Ah',
    E: 'Eh',
    I: 'Ee',
    O: 'Oh',
    U: 'Oo',
    AA: 'Aah',
    EE: 'Aay',
    II: 'Eee',
    OO: 'Ooh',
    UU: 'Ooo'
  };

  const upper = clean.toUpperCase();
  if (singleLetters[upper]) {
    return singleLetters[upper];
  }

  // 2. Word-level phonological mapping
  return clean
    .split(/\s+/)
    .map((rawWord) => {
      let w = rawWord.toLowerCase();

      // Replace punctuation temporarily
      const punctMatch = w.match(/[.,!?;:()]+$/);
      const punct = punctMatch ? punctMatch[0] : '';
      w = w.replace(/[.,!?;:()]+$/, '');

      // Specific known high-frequency Somali words
      if (w === 'geel') return 'Gayl' + punct;
      if (w === 'buug') return 'Boog' + punct;
      if (w === 'roob') return 'Rohb' + punct;
      if (w === 'caano') return 'Aano' + punct;
      if (w === 'qalin') return 'Kalin' + punct;
      if (w === 'dhiil') return 'Deel' + punct;
      if (w === 'xiddig') return 'Hiddig' + punct;
      if (w === 'hooyo') return 'Hoh-yoh' + punct;
      if (w === 'aabe') return 'Aah-beh' + punct;
      if (w === 'subax') return 'Soo-bah' + punct;
      if (w === 'galab') return 'Gah-lahb' + punct;
      if (w === 'habeen') return 'Hah-bayn' + punct;
      if (w === 'wanaagsan') return 'wah-naag-san' + punct;
      if (w === 'mahadsanid') return 'mah-had-sah-nid' + punct;
      if (w === 'fadlan') return 'fahd-lahn' + punct;
      if (w === 'adaa') return 'ah-daa' + punct;
      if (w === 'mudan') return 'moo-dahn' + punct;

      // Somali 'dh' -> single dental/retroflex 'd'
      w = w.replace(/dh/g, 'd');

      // Somali 'kh' -> 'kh' (velar fricative)
      w = w.replace(/kh/g, 'kh');

      // Somali 'x' -> breathy 'h' (pharyngeal voiceless)
      w = w.replace(/x/g, 'h');

      // Somali 'c' -> open throat 'a' at start of word, or 'h' in middle
      w = w.replace(/^c/g, 'a').replace(/c/g, 'h');

      // Somali 'q' -> deep uvular 'k'
      w = w.replace(/q/g, 'k');

      // Somali 'ge' or 'gi' -> force hard G (like 'gu' in French/Spanish)
      w = w.replace(/ge/g, 'gue').replace(/gi/g, 'gui');

      // Double vowels
      w = w.replace(/uu/g, 'oo');
      w = w.replace(/oo/g, 'oh');
      w = w.replace(/ee/g, 'ay');
      w = w.replace(/ii/g, 'ee');
      w = w.replace(/aa/g, 'aah');

      return w + punct;
    })
    .join(' ');
}

class SomaliAudioSynthesizer {
  private audioCtx: AudioContext | null = null;
  private currentAudioEl: HTMLAudioElement | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public playTone(freq: number = 440, type: OscillatorType = 'sine', duration: number = 0.25): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  public playSuccessChime(): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.2), idx * 70);
    });
  }

  /**
   * Plays a pre-recorded audio file if available, returning a Promise.
   */
  public playAudioFile(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.currentAudioEl) {
        this.currentAudioEl.pause();
        this.currentAudioEl = null;
      }
      const audio = new Audio(url);
      this.currentAudioEl = audio;
      audio.onended = () => resolve();
      audio.onerror = (e) => reject(e);
      audio.play().catch(reject);
    });
  }

  /**
   * Pronounces a Somali letter accurately:
   * First attempts pre-recorded studio asset; if unavailable, uses phonetically calibrated speech synthesis.
   */
  public playLetter(letter: string, exampleWord?: string): void {
    const key = letter.trim().toLowerCase();
    const recordedFile = PRE_RECORDED_LETTERS[key];

    if (recordedFile) {
      this.playAudioFile(recordedFile).catch(() => {
        // Fallback to phonetics
        const phoneticText = somaliToSpeechPhonetics(letter) + (exampleWord ? `. ${somaliToSpeechPhonetics(exampleWord)}.` : '');
        this.speakSomali(phoneticText);
      });
    } else {
      const phoneticText = somaliToSpeechPhonetics(letter) + (exampleWord ? `. ${somaliToSpeechPhonetics(exampleWord)}.` : '');
      this.speakSomali(phoneticText);
    }
  }

  /**
   * Pronounces a Somali phrase accurately using studio audio or phonetic mapping.
   */
  public playPhrase(phraseId: string, phraseText: string): void {
    const recordedFile = PRE_RECORDED_PHRASES[phraseId];
    if (recordedFile) {
      this.playAudioFile(recordedFile).catch(() => {
        const phonetic = somaliToSpeechPhonetics(phraseText);
        this.speakSomali(phonetic);
      });
    } else {
      const phonetic = somaliToSpeechPhonetics(phraseText);
      this.speakSomali(phonetic);
    }
  }

  /**
   * Pronounces a Somali word accurately.
   */
  public playWord(word: string): void {
    const key = word.trim().toLowerCase();
    const recordedFile = PRE_RECORDED_WORDS[key];
    if (recordedFile) {
      this.playAudioFile(recordedFile).catch(() => {
        const phonetic = somaliToSpeechPhonetics(word);
        this.speakSomali(phonetic);
      });
    } else {
      const phonetic = somaliToSpeechPhonetics(word);
      this.speakSomali(phonetic);
    }
  }

  /**
   * Primary speech synthesis with authentic Somali phonetic transformation and optimal voice selection.
   */
  public speakSomali(text: string, rate: number = 0.9): void {
    if (typeof window === 'undefined') return;

    // Convert raw Somali into clean phonetics
    const phoneticText = somaliToSpeechPhonetics(text);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phoneticText);
      utterance.rate = rate;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();

      // Priority voice selection:
      // 1. Native Somali (so)
      // 2. Swahili (sw) - similar East African Bantu/Cushitic vowel structure
      // 3. Italian (it) / Spanish (es) - pure five-vowel system identical to Somali vowels (a, e, i, o, u)
      // 4. Default clear voice
      const preferredVoice =
        voices.find((v) => v.lang.startsWith('so')) ||
        voices.find((v) => v.lang.startsWith('sw')) ||
        voices.find((v) => v.lang.startsWith('it')) ||
        voices.find((v) => v.lang.startsWith('es')) ||
        voices.find((v) => v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Zira'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } else {
      // Gentle chime fallback if SpeechSynthesis unavailable
      this.playTone(520, 'sine', 0.25);
    }
  }
}

export const somaliAudio = new SomaliAudioSynthesizer();
