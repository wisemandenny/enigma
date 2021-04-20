# Enigma Machine

This project is a simulated [https://en.wikipedia.org/wiki/Enigma_machine](Enigma Machine) Node backend with ExpressJS and a React frontend. The backend can encrypt arbitrary length strings with a simulated Engima machine. This implementation does not currently have a "plug board", but it still has the 5 rotor types, their mappings, and the reflector configured.

## Encoding mode
You can encode by first choosing rotor types, setting their initial positions, then typing in your plaintext and pressing "Encrypt". You can also turn on Live Encoding with the toggle switch, which encrypts as you type, similar to the real Enigma machine (this is a little inaccurate -- only try this with messages less than 26 characters long). 

## Cracking mode
By toggling the "Cracking mode" switch, you can attempt to crack Enigma-encrypted ciphertexts with 4 different strategies. These startegies differ by their fitness functions. I implemented Index of Coincidence, Bigram Score, Trigram Score, and Quadgram score. Simply put your ciphertext into the input box, select a strategy, and then click crack. I recommend encrypting a string with the machine, and then using that ciphertext to crack, so that you can ensure that your ciphertext is valid. 

## Future plans:
* Deployment
* Performance Enhancements
* Add asynchronous workers to process the cracking
* Enable cancelling of cracks in progress
* Implement the plugboard
