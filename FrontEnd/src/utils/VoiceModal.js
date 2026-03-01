import Swal from 'sweetalert2';

/**
 * showVoiceSearchModal
 * Opens a SweetAlert2 modal with a YouTube-style "Listening" UI.
 * Returns a promise that resolves with the final transcript string.
 */
export const showVoiceSearchModal = () => {
    return new Promise((resolve, reject) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            reject('Speech recognition not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = false;

        let finalTranscript = '';
        let isClosedManually = false;

        const swalInstance = Swal.fire({
            title: '<div class="listening-text">Listening...</div>',
            html: `
                <div class="youtube-mic-container">
                    <div class="youtube-pulse-ring"></div>
                    <div class="youtube-pulse-ring"></div>
                    <div class="youtube-pulse-ring"></div>
                    <div class="youtube-mic-btn">
                        <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                        </svg>
                    </div>
                </div>
                <div id="transcript-display" class="transcript-display">Speak now...</div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            allowOutsideClick: true,
            backdrop: `rgba(0,0,0,0.6)`,
            customClass: {
                popup: 'rounded-3xl border-none shadow-none bg-transparent overflow-visible',
                htmlContainer: 'p-0 overflow-visible',
                title: 'text-left pt-6 pl-6'
            },
            didOpen: () => {
                recognition.start();
            },
            willClose: () => {
                isClosedManually = true;
                recognition.stop();
            }
        });

        recognition.onresult = (event) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            const display = document.getElementById('transcript-display');
            if (display) {
                display.innerText = finalTranscript || interimTranscript || 'Listening...';
                if (finalTranscript) {
                    display.classList.remove('text-gray-500');
                    display.classList.add('text-gray-900', 'dark:text-white', 'font-medium');
                }
            }
        };

        recognition.onend = () => {
            if (finalTranscript) {
                // Wait a tiny bit so user sees their final word
                setTimeout(() => {
                    Swal.close();
                    resolve(finalTranscript);
                }, 500);
            } else if (!isClosedManually) {
                // If it ended without transcript and wasn't closed by user, maybe it timed out.
                // We can either resolve empty or just close.
                Swal.close();
                reject('No speech detected');
            }
        };

        recognition.onerror = (event) => {
            if (event.error !== 'no-speech') {
                Swal.close();
                reject(`Voice error: ${event.error}`);
            }
        };
    });
};
