# Enigma Machine

This project is a simulated [Enigma machine](https://en.wikipedia.org/wiki/Enigma_machine) implemented with a Node backend (ExpressJS) and a React frontend. The backend can encrypt arbitrary length strings with a simulated Engima machine. This implementation does not currently have a [plugboard](https://en.wikipedia.org/wiki/Enigma_machine#Plugboard), but it has the 5 [rotor types](https://en.wikipedia.org/wiki/Enigma_rotor_details) their mappings, and the [reflector](https://en.wikipedia.org/wiki/Enigma_machine#Reflector) configured.

## Encoding mode
You can encode by first choosing rotor types, setting their initial positions, then typing in your plaintext and pressing "Encrypt". You can also turn on Live Encoding with the toggle switch, which encrypts as you type, similar to the real Enigma machine (this is a little inaccurate -- only try this with messages less than 26 characters long). 

## Cracking mode
By toggling the "Cracking mode" switch, you can attempt to crack Enigma-encrypted ciphertexts with 4 different strategies. These startegies differ by their fitness functions. I implemented [Index of Coincidence](https://en.wikipedia.org/wiki/Index_of_coincidence), [Bigram score, Trigram score, and Quadgram score](http://practicalcryptography.com/cryptanalysis/text-characterisation/monogram-bigram-and-trigram-frequency-counts/). Simply put your ciphertext into the input box, select a strategy, and then click crack. I recommend encrypting a string with the machine, and then using that ciphertext to crack, so that you can ensure that your ciphertext is valid. 

Index of coincidence mode is the most thoroughly tested, and the average crack time for a 50 character message is around 3 minutes, or faster if a decryption with high-likelihood to be plaintext was found.

## Future plans:
* Deployment
* Performance Enhancements
* Add asynchronous [worker threads](https://nodejs.org/api/worker_threads.html) to process the cracking, enabling more than one crack at the same time without rebooting the server 😅
* Enable cancelling of cracks in progress
* Implement the plugboard

