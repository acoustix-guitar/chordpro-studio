var abcjsEditor;

function initAbcEditor() {
    const inputEl = document.getElementById("abc-input");
    const paperEl = document.getElementById("abc-paper");
    
    if (!inputEl || !paperEl) return;

    if (typeof ABCJS === 'undefined') {
        console.warn("ABCJS not loaded, retrying...");
        setTimeout(initAbcEditor, 500);
        return;
    }

    try {
        // Initialize the editor
        abcjsEditor = new ABCJS.Editor("abc-input", {
            canvas_id: "abc-paper",
            warnings_id: "abc-warnings",
            synth: {
                el: "#abc-audio",
                options: { 
                    displayLoop: true, 
                    displayRestart: true, 
                    displayPlay: true, 
                    displayProgress: true, 
                    displayWarp: true 
                }
            },
            abcjsParams: {
                add_classes: true,
                responsive: "resize",
                paddingright: 30,
                paddingleft: 10,
                paddingbottom: 0,
                staffwidth: 740
            }
        });
        
        console.log("ABC Editor initialized.");
    } catch (e) {
        console.error("ABC Editor init error:", e);
        // Fallback render
        ABCJS.renderAbc("abc-paper", inputEl.value, { 
            responsive: "resize", 
            add_classes: true,
            paddingright: 30,
            paddingleft: 10,
            paddingbottom: 0,
            staffwidth: 740
        });
    }

    const midiBtn = document.getElementById("abc-midi-download-btn");
    if (midiBtn) {
        midiBtn.onclick = downloadMidi;
    }
}

function downloadMidi() {
    const abc = document.getElementById("abc-input").value;
    if (!abc) return;
    
    if (typeof ABCJS !== 'undefined' && ABCJS.synth && ABCJS.synth.getMidiFile) {
        const midi = ABCJS.synth.getMidiFile(abc, { midiOutputType: "encoded" });
        const a = document.getElementById("abc-midi-download-link");
        if (a) {
            a.setAttribute("href", midi);
            a.click();
        }
    } else {
        alert("MIDI export is not available.");
    }
}

function insertAbcToEditor() {
    const abcText = document.getElementById('abc-input').value;
    if (!abcText.trim()) return;
    
    const formattedAbc = `\n{start_of_abc}\n${abcText}\n{end_of_abc}\n`;
    
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    
    saveHistory();
    input.value = text.substring(0, start) + formattedAbc + text.substring(end);
    input.selectionStart = input.selectionEnd = start + formattedAbc.length;
    input.focus();
    updatePreview();
    autoSaveSession();
}

function observeWarningsDiv() {
    const warningsDiv = document.getElementById('abc-warnings');
    if (warningsDiv) {
        const observer = new MutationObserver(() => {
            if (warningsDiv.innerHTML === "No errors" || warningsDiv.innerHTML === "") {
                warningsDiv.style.display = 'none';
            } else {
                warningsDiv.style.display = 'block';
            }
        });
        observer.observe(warningsDiv, { childList: true });
    }
}

document.addEventListener('DOMContentLoaded', observeWarningsDiv);
