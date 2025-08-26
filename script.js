
        document.addEventListener('DOMContentLoaded', () => {
            // --- DOM Element References ---
            const startBtn = document.getElementById('start-btn');
            const statusIndicator = document.getElementById('status-indicator');
            const statusIcon = document.getElementById('status-icon');
            const userCommandEl = document.getElementById('user-command');
            const assistantResponseEl = document.getElementById('assistant-response');
            const unsupportedMessage = document.getElementById('unsupported-message');

            // --- Speech Recognition & Synthesis Setup ---
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            
            // 1. Browser Support Check
            if (!SpeechRecognition) {
                startBtn.disabled = true;
                unsupportedMessage.classList.remove('hidden');
                return; // Stop execution if not supported
            }

            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false; // We only want final results

            let utterance = new SpeechSynthesisUtterance();
            utterance.lang = 'en-US';

            // --- State Management ---
            let isListening = false;

            // --- UI Update Functions ---
            function updateStatus(status) {
                statusIndicator.classList.remove('listening', 'speaking');
                statusIcon.className = 'fas text-3xl text-gray-400'; // Reset icon

                if (status === 'listening') {
                    statusIndicator.classList.add('listening', 'border-blue-500');
                    statusIcon.classList.add('fa-microphone-lines');
                } else if (status === 'speaking') {
                    statusIndicator.classList.add('speaking', 'border-green-500');
                    statusIcon.classList.add('fa-volume-high');
                } else { // idle
                    statusIndicator.classList.remove('border-blue-500', 'border-green-500');
                    statusIcon.classList.add('fa-microphone');
                }
            }

            // --- Core Functions ---

            /**
             * Converts text to speech and updates the UI.
             * @param {string} text - The text for the assistant to speak.
             */
            function speak(text) {
                assistantResponseEl.textContent = text;
                utterance.text = text;
                
                utterance.onstart = () => {
                    updateStatus('speaking');
                };
                
                // When speaking ends, return to idle state
                utterance.onend = () => {
                    updateStatus('idle');
                };
                
                window.speechSynthesis.speak(utterance);
            }
            
            /**
             * A helper function to open websites and provide feedback.
             * @param {string} url - The URL to open.
             * @param {string} speakText - The confirmation text to speak.
             */
            function openWebsite(url, speakText) {
                speak(speakText);
                window.open(url, "_blank");
            }

            // --- Command Handling ---

            // Using an object for scalable command management
            const commands = {
                'open youtube': () => openWebsite("https://www.youtube.com", "Opening YouTube..."),
                'open whatsapp': () => openWebsite("https://www.whatsapp.com", "Opening WhatsApp..."),
                'open instagram': () => openWebsite("https://www.instagram.com", "Opening Instagram..."),
                'open facebook': () => openWebsite("https://www.facebook.com", "Opening Facebook..."),
                'open google': () => openWebsite("https://www.google.com", "Opening Google..."),
                'open w3schools': () => openWebsite("https://www.w3schools.com", "Opening W3Schools..."),
                'what time is it': () => {
                    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                    speak(`The current time is ${time}`);
                },
                "what is today's date": () => {
                    const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    speak(`Today's date is ${date}`);
                },
            };

            /**
             * Processes the recognized command and executes the corresponding action.
             * @param {string} command - The transcribed text from the user.
             */
            function handleCommands(command) {
                userCommandEl.textContent = command;
                let handled = false;

                // Check for exact matches in the commands object
                if (command in commands) {
                    commands[command]();
                    handled = true;
                } 
                // Handle more complex, pattern-based commands
                else if (command.startsWith('search for')) {
                    const query = command.substring('search for'.length).trim();
                    openWebsite(`https://www.google.com/search?q=${query}`, `Searching Google for ${query}`);
                    handled = true;
                } 
                else if (command.startsWith('calculate')) {
                    const expression = command.substring('calculate'.length).trim().replace(/x/g, '*').replace(/ /g, '');
                    try {
                        // Using Function constructor for safer evaluation than eval()
                        const result = new Function('return ' + expression)();
                        speak(`The result of ${expression.replace(/\*/g, ' times ')} is ${result}`);
                    } catch (error) {
                        speak("Sorry, I couldn't calculate that. Please state it clearly, for example, 'calculate 5 times 5'.");
                    }
                    handled = true;
                }

                // Default fallback if no command is matched
                if (!handled) {
                    openWebsite(`https://www.google.com/search?q=${command}`, `I'm not sure about that. Here are some results for ${command}`);
                }
            }

            // --- Event Listeners ---

            // Main button to start the interaction
            startBtn.addEventListener('click', () => {
                if (isListening) {
                    recognition.stop();
                    return;
                }
                speak("Hello, how can I help you?");
                // Wait for the greeting to finish before starting to listen
                utterance.onend = () => {
                    recognition.start();
                };
            });

            // Fires when the speech recognition service starts listening
            recognition.onstart = () => {
                isListening = true;
                startBtn.textContent = "Listening... (Click to Stop)";
                updateStatus('listening');
            };

            // Fires when a final result is recognized
            recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase().trim();
                handleCommands(command);
            };
            
            // Fires when the recognition service stops
            recognition.onend = () => {
                isListening = false;
                startBtn.textContent = "Activate Assistant";
                updateStatus('idle');
            };

            // Fires on a recognition error
            recognition.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                let errorMessage = "Sorry, something went wrong.";
                if (event.error === 'no-speech' || event.error === 'audio-capture') {
                    errorMessage = "I didn't hear anything. Please try again.";
                } else if (event.error === 'not-allowed') {
                    errorMessage = "Microphone access was denied. Please enable it in your browser settings.";
                }
                speak(errorMessage);
            };
        });
    
