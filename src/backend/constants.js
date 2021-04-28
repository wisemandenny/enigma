const Alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
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
  { ngram: 'TH', frequency: 2.71 },        
  { ngram: 'EN', frequency: 1.13 },        
  { ngram: 'NG', frequency: 0.89 },
  { ngram: 'HE', frequency: 2.33 },        
  { ngram: 'AT', frequency: 1.12 },        
  { ngram: 'AL', frequency: 0.88 },
  { ngram: 'IN', frequency: 2.03 },        
  { ngram: 'ED', frequency: 1.08 },        
  { ngram: 'IT', frequency: 0.88 },
  { ngram: 'ER', frequency: 1.78 },        
  { ngram: 'ND', frequency: 1.07 },        
  { ngram: 'AS', frequency: 0.87 },
  { ngram: 'AN', frequency: 1.61 },        
  { ngram: 'TO', frequency: 1.07 },        
  { ngram: 'IS', frequency: 0.86 },
  { ngram: 'RE', frequency: 1.41 },        
  { ngram: 'OR', frequency: 1.06 },        
  { ngram: 'HA', frequency: 0.83 },
  { ngram: 'ES', frequency: 1.32 },        
  { ngram: 'EA', frequency: 1.00 },        
  { ngram: 'ET', frequency: 0.76 },
  { ngram: 'ON', frequency: 1.32 },        
  { ngram: 'TI', frequency: 0.99 },        
  { ngram: 'SE', frequency: 0.73 },
  { ngram: 'ST', frequency: 1.25 },        
  { ngram: 'AR', frequency: 0.98 },        
  { ngram: 'OU', frequency: 0.72 },
  { ngram: 'NT', frequency: 1.17 },        
  { ngram: 'TE', frequency: 0.98 },        
  { ngram: 'OF', frequency: 0.71 }
]

const Trigrams = [
  { ngram: 'THE', frequency: 1.81 },        
  { ngram: 'ERE', frequency: 0.31 },        
  { ngram: 'HES', frequency: 0.24 },
  { ngram: 'AND', frequency: 0.73 },        
  { ngram: 'TIO', frequency: 0.31 },        
  { ngram: 'VER', frequency: 0.24 },
  { ngram: 'ING', frequency: 0.72 },        
  { ngram: 'TER', frequency: 0.30 },        
  { ngram: 'HIS', frequency: 0.24 },
  { ngram: 'ENT', frequency: 0.42 },        
  { ngram: 'EST', frequency: 0.28 },        
  { ngram: 'OFT', frequency: 0.22 },
  { ngram: 'ION', frequency: 0.42 },        
  { ngram: 'ERS', frequency: 0.28 },        
  { ngram: 'ITH', frequency: 0.21 },
  { ngram: 'HER', frequency: 0.36 },        
  { ngram: 'ATI', frequency: 0.26 },        
  { ngram: 'FTH', frequency: 0.21 },
  { ngram: 'FOR', frequency: 0.34 },        
  { ngram: 'HAT', frequency: 0.26 },        
  { ngram: 'STH', frequency: 0.21 },
  { ngram: 'THA', frequency: 0.33 },        
  { ngram: 'ATE', frequency: 0.25 },        
  { ngram: 'OTH', frequency: 0.21 },
  { ngram: 'NTH', frequency: 0.33 },        
  { ngram: 'ALL', frequency: 0.25 },        
  { ngram: 'RES', frequency: 0.21 },
  { ngram: 'INT', frequency: 0.32 },        
  { ngram: 'ETH', frequency: 0.24 },        
  { ngram: 'ONT', frequency: 0.20 }
]

const Quadgrams = [
  { ngram: 'TION', frequency:  0.31 },        
  { ngram: 'OTHE', frequency:  0.16 },        
  { ngram: 'THEM', frequency:  0.12 },
  { ngram: 'NTHE', frequency:  0.27 },        
  { ngram: 'TTHE', frequency:  0.16 },        
  { ngram: 'RTHE', frequency:  0.12 },
  { ngram: 'THER', frequency:  0.24 },        
  { ngram: 'DTHE', frequency:  0.15 },        
  { ngram: 'THEP', frequency:  0.11 },
  { ngram: 'THAT', frequency:  0.21 },        
  { ngram: 'INGT', frequency:  0.15 },        
  { ngram: 'FROM', frequency:  0.10 },
  { ngram: 'OFTH', frequency:  0.19 },        
  { ngram: 'ETHE', frequency:  0.15 },        
  { ngram: 'THIS', frequency:  0.10 },
  { ngram: 'FTHE', frequency:  0.19 },        
  { ngram: 'SAND', frequency:  0.14 },        
  { ngram: 'TING', frequency:  0.10 },
  { ngram: 'THES', frequency:  0.18 },        
  { ngram: 'STHE', frequency:  0.14 },        
  { ngram: 'THEI', frequency:  0.10 },
  { ngram: 'WITH', frequency:  0.18 },        
  { ngram: 'HERE', frequency:  0.13 },        
  { ngram: 'NGTH', frequency:  0.10 },
  { ngram: 'INTH', frequency:  0.17 },        
  { ngram: 'THEC', frequency:  0.13 },        
  { ngram: 'IONS', frequency:  0.10 },
  { ngram: 'ATIO', frequency:  0.17 },        
  { ngram: 'MENT', frequency:  0.12 },        
  { ngram: 'ANDT', frequency:  0.10 }
]

module.exports =  { Alphabet, RotorSettings, Reflector, Bigrams, Trigrams, Quadgrams }