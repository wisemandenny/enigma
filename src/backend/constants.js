const Alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
const Numerals = ['I', 'II', 'III', 'IV', 'V']
const RotorSettings = {
  'I' : {
    turnover: 'Q',
    notch: 'Y',
    mapping: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ'
  },
  'II': {
    turnover: 'E',
    notch: 'M',
    mapping: 'AJDKSIRUXBLHWTMCQGZNPYFVOE'
  },
  'III': {
    turnover: 'V',
    notch: 'D',
    mapping: 'BDFHJLCPRTXVZNYEIWGAKMUSQO'
  },
  'IV': {
    turnover: 'J',
    notch: 'R',
    mapping: 'ESOVPZJAYQUIRHXLNFTGKDCMWB'
  },
  'V': {
    turnover: 'Z',
    notch: 'H',
    mapping: 'VZBRGITYUPSDNHLXAWMJQOFECK'
  }
}

const Reflector = {
  mapping: 'YRUHQSLDPXNGOKMIEBFZCWVJAT'
}

const Bigrams = [
  { ngram: new RegExp('TH', 'g'), frequency: 2.71 },        
  { ngram: new RegExp('EN', 'g'), frequency: 1.13 },        
  { ngram: new RegExp('NG', 'g'), frequency: 0.89 },
  { ngram: new RegExp('HE', 'g'), frequency: 2.33 },        
  { ngram: new RegExp('AT', 'g'), frequency: 1.12 },        
  { ngram: new RegExp('AL', 'g'), frequency: 0.88 },
  { ngram: new RegExp('IN', 'g'), frequency: 2.03 },        
  { ngram: new RegExp('ED', 'g'), frequency: 1.08 },        
  { ngram: new RegExp('IT', 'g'), frequency: 0.88 },
  { ngram: new RegExp('ER', 'g'), frequency: 1.78 },        
  { ngram: new RegExp('ND', 'g'), frequency: 1.07 },        
  { ngram: new RegExp('AS', 'g'), frequency: 0.87 },
  { ngram: new RegExp('AN', 'g'), frequency: 1.61 },        
  { ngram: new RegExp('TO', 'g'), frequency: 1.07 },        
  { ngram: new RegExp('IS', 'g'), frequency: 0.86 },
  { ngram: new RegExp('RE', 'g'), frequency: 1.41 },        
  { ngram: new RegExp('OR', 'g'), frequency: 1.06 },        
  { ngram: new RegExp('HA', 'g'), frequency: 0.83 },
  { ngram: new RegExp('ES', 'g'), frequency: 1.32 },        
  { ngram: new RegExp('EA', 'g'), frequency: 1.00 },        
  { ngram: new RegExp('ET', 'g'), frequency: 0.76 },
  { ngram: new RegExp('ON', 'g'), frequency: 1.32 },        
  { ngram: new RegExp('TI', 'g'), frequency: 0.99 },        
  { ngram: new RegExp('SE', 'g'), frequency: 0.73 },
  { ngram: new RegExp('ST', 'g'), frequency: 1.25 },        
  { ngram: new RegExp('AR', 'g'), frequency: 0.98 },        
  { ngram: new RegExp('OU', 'g'), frequency: 0.72 },
  { ngram: new RegExp('NT', 'g'), frequency: 1.17 },        
  { ngram: new RegExp('TE', 'g'), frequency: 0.98 },        
  { ngram: new RegExp('OF', 'g'), frequency: 0.71 }
]

const Trigrams = [
  { ngram: new RegExp('THE', 'g'), frequency: 1.81 },        
  { ngram: new RegExp('ERE', 'g'), frequency: 0.31 },        
  { ngram: new RegExp('HES', 'g'), frequency: 0.24 },
  { ngram: new RegExp('AND', 'g'), frequency: 0.73 },        
  { ngram: new RegExp('TIO', 'g'), frequency: 0.31 },        
  { ngram: new RegExp('VER', 'g'), frequency: 0.24 },
  { ngram: new RegExp('ING', 'g'), frequency: 0.72 },        
  { ngram: new RegExp('TER', 'g'), frequency: 0.30 },        
  { ngram: new RegExp('HIS', 'g'), frequency: 0.24 },
  { ngram: new RegExp('ENT', 'g'), frequency: 0.42 },        
  { ngram: new RegExp('EST', 'g'), frequency: 0.28 },        
  { ngram: new RegExp('OFT', 'g'), frequency: 0.22 },
  { ngram: new RegExp('ION', 'g'), frequency: 0.42 },        
  { ngram: new RegExp('ERS', 'g'), frequency: 0.28 },        
  { ngram: new RegExp('ITH', 'g'), frequency: 0.21 },
  { ngram: new RegExp('HER', 'g'), frequency: 0.36 },        
  { ngram: new RegExp('ATI', 'g'), frequency: 0.26 },        
  { ngram: new RegExp('FTH', 'g'), frequency: 0.21 },
  { ngram: new RegExp('FOR', 'g'), frequency: 0.34 },        
  { ngram: new RegExp('HAT', 'g'), frequency: 0.26 },        
  { ngram: new RegExp('STH', 'g'), frequency: 0.21 },
  { ngram: new RegExp('THA', 'g'), frequency: 0.33 },        
  { ngram: new RegExp('ATE', 'g'), frequency: 0.25 },        
  { ngram: new RegExp('OTH', 'g'), frequency: 0.21 },
  { ngram: new RegExp('NTH', 'g'), frequency: 0.33 },        
  { ngram: new RegExp('ALL', 'g'), frequency: 0.25 },        
  { ngram: new RegExp('RES', 'g'), frequency: 0.21 },
  { ngram: new RegExp('INT', 'g'), frequency: 0.32 },        
  { ngram: new RegExp('ETH', 'g'), frequency: 0.24 },        
  { ngram: new RegExp('ONT', 'g'), frequency: 0.20 }
]

const Quadgrams = [
  { ngram: new RegExp('TION', 'g'), frequency:  0.31 },        
  { ngram: new RegExp('OTHE', 'g'), frequency:  0.16 },        
  { ngram: new RegExp('THEM', 'g'), frequency:  0.12 },
  { ngram: new RegExp('NTHE', 'g'), frequency:  0.27 },        
  { ngram: new RegExp('TTHE', 'g'), frequency:  0.16 },        
  { ngram: new RegExp('RTHE', 'g'), frequency:  0.12 },
  { ngram: new RegExp('THER', 'g'), frequency:  0.24 },        
  { ngram: new RegExp('DTHE', 'g'), frequency:  0.15 },        
  { ngram: new RegExp('THEP', 'g'), frequency:  0.11 },
  { ngram: new RegExp('THAT', 'g'), frequency:  0.21 },        
  { ngram: new RegExp('INGT', 'g'), frequency:  0.15 },        
  { ngram: new RegExp('FROM', 'g'), frequency:  0.10 },
  { ngram: new RegExp('OFTH', 'g'), frequency:  0.19 },        
  { ngram: new RegExp('ETHE', 'g'), frequency:  0.15 },        
  { ngram: new RegExp('THIS', 'g'), frequency:  0.10 },
  { ngram: new RegExp('FTHE', 'g'), frequency:  0.19 },        
  { ngram: new RegExp('SAND', 'g'), frequency:  0.14 },        
  { ngram: new RegExp('TING', 'g'), frequency:  0.10 },
  { ngram: new RegExp('THES', 'g'), frequency:  0.18 },        
  { ngram: new RegExp('STHE', 'g'), frequency:  0.14 },        
  { ngram: new RegExp('THEI', 'g'), frequency:  0.10 },
  { ngram: new RegExp('WITH', 'g'), frequency:  0.18 },        
  { ngram: new RegExp('HERE', 'g'), frequency:  0.13 },        
  { ngram: new RegExp('NGTH', 'g'), frequency:  0.10 },
  { ngram: new RegExp('INTH', 'g'), frequency:  0.17 },        
  { ngram: new RegExp('THEC', 'g'), frequency:  0.13 },        
  { ngram: new RegExp('IONS', 'g'), frequency:  0.10 },
  { ngram: new RegExp('ATIO', 'g'), frequency:  0.17 },        
  { ngram: new RegExp('MENT', 'g'), frequency:  0.12 },        
  { ngram: new RegExp('ANDT', 'g'), frequency:  0.10 }
]

module.exports =  { Alphabet, Numerals, RotorSettings, Reflector, Bigrams, Trigrams, Quadgrams }