/**
 * STEINWAY SPIRIO - ENGINE
 * Gerenciamento de áudio, análise de frequência em tempo real e automação.
 */

/* ==========================================================================
   CONFIGURAÇÕES & ESTADO GLOBAL
   ========================================================================== */

const state = {
    audioVolume: 0.5,
    mappedKeys: [],
    audioCache: {},
    audioSources: {},
    isInitialized: false
};

const playlist = {
    saloonClassic: [
        { key: "a", delay: 0 }, { key: "d", delay: 200 }, { key: "f", delay: 400 },
        { key: "a", delay: 600 }, { key: "d", delay: 800 }, { key: "f", delay: 1000 }
    ],
    westTheme: [
        { key: "d", delay: 0 }, { key: "f", delay: 400 }, { key: "g", delay: 800 },
        { key: "f", delay: 1200 }, { key: "d", delay: 1600 }
    ],
    ragtime: [
        { key: "a", delay: 0 }, { key: "s", delay: 150 }, { key: "d", delay: 300 },
        { key: "f", delay: 450 }, { key: "t", delay: 600 }, { key: "g", delay: 750 }
    ],
    asaBranca: [
        { key: "a", delay: 0 }, { key: "s", delay: 300 }, { key: "d", delay: 600 }, 
        { key: "k", delay: 900 }, { key: "k", delay: 1200 }, { key: "d", delay: 1500 }, 
        { key: "f", delay: 1800 }, { key: "f", delay: 2100 },
        { key: "a", delay: 2400 }, { key: "s", delay: 2700 }, { key: "d", delay: 3000 }, 
        { key: "k", delay: 3300 }, { key: "k", delay: 3600 }, { key: "f", delay: 3900 }, 
        { key: "d", delay: 4200 },
        { key: "a", delay: 4800 }, { key: "a", delay: 5100 }, { key: "s", delay: 5400 }, 
        { key: "d", delay: 5700 }, { key: "k", delay: 6000 }, { key: "k", delay: 6300 }, 
        { key: "f", delay: 6600 }, { key: "d", delay: 6900 }, { key: "s", delay: 7200 },
        { key: "s", delay: 7500 }, { key: "d", delay: 7800 }, { key: "a", delay: 8100 }
    ],
    batatinha: [
        { key: "d", delay: 0 }, { key: "d", delay: 300 }, { key: "h", delay: 600 }, 
        { key: "h", delay: 900 }, { key: "f", delay: 1200 }, { key: "f", delay: 1500 }, 
        { key: "d", delay: 1800 },
        { key: "s", delay: 2200 }, { key: "s", delay: 2500 }, { key: "g", delay: 2800 }, 
        { key: "g", delay: 3100 }, { key: "d", delay: 3400 }, { key: "d", delay: 3700 }, 
        { key: "a", delay: 4000 }
    ]
};

/* ==========================================================================
   SELETORES DO DOM
   ========================================================================== */

const ui = {
    pianoKeys: document.querySelectorAll(".piano-keys .key"),
    volumeSlider: document.getElementById("volume-slider"),
    keysCheck: document.getElementById("keys-check"),
    songSelect: document.getElementById("song-select"),
    btnSpirio: document.getElementById("btn-spirio"),
    visualizer: document.querySelector(".visualizer"),
    bars: document.querySelectorAll(".visualizer .bar")
};

/* ==========================================================================
   SISTEMA DE ÁUDIO & ANALISADOR (WEB AUDIO API)
   ========================================================================== */

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
analyser.fftSize = 64; 
analyser.connect(audioCtx.destination);

const frequencyData = new Uint8Array(analyser.frequencyBinCount);

/**
 * Mapeia e pré-conecta os elementos de áudio ao analisador.
 */
const initAudioEngine = () => {
    ui.pianoKeys.forEach(key => {
        const note = key.dataset.key;
        const audio = new Audio(`src/tunes/${note}.wav`);
        
        state.audioCache[note] = audio;
        state.mappedKeys.push(note);

        // Conecta ao pipeline de áudio apenas uma vez (evita InvalidStateError)
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        state.audioSources[note] = source;
    });
};

/* ==========================================================================
   LÓGICA DE EXECUÇÃO & VISUALIZAÇÃO
   ========================================================================== */

/**
 * Reproduz uma nota específica e dispara o feedback visual.
 */
const playTune = (key) => {
    const audio = state.audioCache[key];
    
    if (audio) {
        if (audioCtx.state === 'suspended') audioCtx.resume();

        audio.currentTime = 0;
        audio.volume = state.audioVolume;
        audio.play();

        updateVisualFeedback(key);
    }
};

/**
 * Gerencia a animação das teclas e inicia o frame do analisador.
 */
const updateVisualFeedback = (key) => {
    const keyElement = document.querySelector(`[data-key="${key}"]`);
    if (keyElement) {
        keyElement.classList.add("active");
        setTimeout(() => keyElement.classList.remove("active"), 150);
    }
    
    requestAnimationFrame(renderSpectrum);
};

/**
 * Renderiza o analisador de espectro em tempo real.
 */
const renderSpectrum = () => {
    analyser.getByteFrequencyData(frequencyData);
    
    ui.bars.forEach((bar, i) => {
        const amplitude = frequencyData[i];
        const height = (amplitude / 255) * 50;
        bar.style.height = `${height + 2}px`;
        bar.style.opacity = 0.2 + (height / 50);
    });

    // Mantém a animação enquanto houver som sendo processado
    if (frequencyData.some(v => v > 0)) {
        requestAnimationFrame(renderSpectrum);
    }
};

/* ==========================================================================
   FUNCIONALIDADES EXTRAS (SPIRIO & UI)
   ========================================================================== */

const playSpirioMode = () => {
    const selectedSong = ui.songSelect.value;
    const songData = playlist[selectedSong];
    
    if (songData) {
        songData.forEach(note => {
            setTimeout(() => playTune(note.key), note.delay);
        });
    }
};

const handleKeysVisibility = () => {
    ui.pianoKeys.forEach(key => {
        key.classList.toggle("hide", !ui.keysCheck.checked);
    });
};

/* ==========================================================================
   INICIALIZAÇÃO DE EVENTOS
   ========================================================================== */

const bindEvents = () => {
    // Cliques nas teclas
    ui.pianoKeys.forEach(key => {
        key.addEventListener("click", () => playTune(key.dataset.key));
    });

    // Teclado físico
    document.addEventListener("keydown", (e) => {
        const key = e.key.toLowerCase();
        if (state.mappedKeys.includes(key)) playTune(key);
    });

    // Controles de interface
    ui.volumeSlider.addEventListener("input", (e) => state.audioVolume = e.target.value);
    ui.keysCheck.addEventListener("change", handleKeysVisibility);
    ui.btnSpirio.addEventListener("click", playSpirioMode);
};

// Start App
const start = () => {
    initAudioEngine();
    bindEvents();
    handleKeysVisibility(); // Alinha estado inicial do switch
};

start();