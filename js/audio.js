// Web Audio API Retro 8-Bit Sound Synthesizer (Zero external dependencies)
class PixelAudio {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.initOnFirstInteraction = this.initOnFirstInteraction.bind(this);
        window.addEventListener('click', this.initOnFirstInteraction, { once: true });
        window.addEventListener('keydown', this.initOnFirstInteraction, { once: true });
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initOnFirstInteraction() {
        this.init();
    }

    toggleSound() {
        this.enabled = !this.enabled;
        if (!this.enabled && this.bgmPlaying) {
            this.stopBgm();
        }
        return this.enabled;
    }

    playClick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playElevator() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(0.12, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.35);
        });
    }

    playAgentSelect() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const chord = [330, 440, 554.37, 659.25];
        chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);
            gain.gain.setValueAtTime(0.1, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.28);
        });
    }

    playType() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const freqs = [600, 750, 900, 1100];
        const freq = freqs[Math.floor(Math.random() * freqs.length)];
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.035);
    }

    playMeetingStart() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);
            gain.gain.setValueAtTime(0.08, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.45);
        });
    }

    playSuccess() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + idx * 0.1);
            gain.gain.setValueAtTime(0.08, now + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.4);
        });
    }

    toggleBgm() {
        if (this.bgmPlaying) {
            this.stopBgm();
            return false;
        } else {
            this.startBgm();
            return true;
        }
    }

    startBgm() {
        this.init();
        if (!this.ctx) return;
        this.bgmPlaying = true;
        let step = 0;
        const chords = [
            [261.63, 329.63, 392.00], // C major
            [220.00, 261.63, 329.63], // A minor
            [174.61, 220.00, 261.63], // F major
            [196.00, 246.94, 293.66], // G major
        ];
        
        const playBeat = () => {
            if (!this.bgmPlaying || !this.ctx) return;
            const now = this.ctx.currentTime;
            const chord = chords[Math.floor(step / 4) % chords.length];
            const bass = chord[0] / 2;
            
            // Bass note
            const bassOsc = this.ctx.createOscillator();
            const bassGain = this.ctx.createGain();
            bassOsc.type = 'triangle';
            bassOsc.frequency.setValueAtTime(bass, now);
            bassGain.gain.setValueAtTime(0.04, now);
            bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            bassOsc.connect(bassGain);
            bassGain.connect(this.ctx.destination);
            bassOsc.start(now);
            bassOsc.stop(now + 0.4);

            // Arp note
            const arpNote = chord[step % chord.length];
            const arpOsc = this.ctx.createOscillator();
            const arpGain = this.ctx.createGain();
            arpOsc.type = 'sine';
            arpOsc.frequency.setValueAtTime(arpNote, now);
            arpGain.gain.setValueAtTime(0.02, now);
            arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            arpOsc.connect(arpGain);
            arpGain.connect(this.ctx.destination);
            arpOsc.start(now);
            arpOsc.stop(now + 0.3);

            step++;
            this.bgmTimer = setTimeout(playBeat, 350);
        };
        playBeat();
    }

    stopBgm() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    playPowerUp() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.42);
    }

    playLaser() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(990, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
    }

    // Casino-style Progressive Step Success Sound
    // Scales pitch, tempo, coin clinks and multipliers as tasks complete
    playCasinoStepSuccess(stepIndex = 0, totalSteps = 10) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Progressive pitch scaling: escalates chromatically / pentatonically with each step
        const clampedStep = Math.max(0, stepIndex);
        const pitchRatio = Math.pow(1.059463, Math.min(clampedStep, 36)); // Up to 3 octaves higher
        const baseRoot = 440 * pitchRatio; // Starts at A4 (440Hz) and climbs upward

        // 1. Dual Metallic Slot Coin Clink (crisp high pings in slot tray)
        const coinFreq1 = Math.min(3800, 1600 * Math.pow(1.04, Math.min(clampedStep, 24)));
        const coinFreq2 = Math.min(4800, 2400 * Math.pow(1.04, Math.min(clampedStep, 24)));

        [coinFreq1, coinFreq2].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.02);
            gain.gain.setValueAtTime(0.09, now + idx * 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.02 + 0.05);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.02);
            osc.stop(now + idx * 0.02 + 0.06);
        });

        // 2. Progressive Ascending Arpeggio (Root, Major 3rd, 5th, Octave)
        const chordIntervals = [1.0, 1.2599, 1.4983, 2.0];
        const stepArpSpeed = Math.max(0.035, 0.06 - Math.min(clampedStep, 30) * 0.001); // Snappier as combo grows

        chordIntervals.forEach((interval, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = clampedStep >= 10 ? 'sawtooth' : 'triangle';
            const f = baseRoot * interval;
            const startTime = now + 0.03 + (idx * stepArpSpeed);

            osc.frequency.setValueAtTime(Math.min(3600, f), startTime);
            gain.gain.setValueAtTime(0.08, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.16);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + 0.18);
        });

        // 3. Multiplier Ding / Coin Count-Up Roll for High Combos (Step 5+, 15+, 30+)
        if (clampedStep >= 4) {
            const extraPings = clampedStep >= 20 ? 3 : (clampedStep >= 10 ? 2 : 1);
            for (let p = 0; p < extraPings; p++) {
                const tickOsc = this.ctx.createOscillator();
                const tickGain = this.ctx.createGain();
                tickOsc.type = 'square';
                const tickTime = now + 0.20 + (p * 0.04);
                tickOsc.frequency.setValueAtTime(Math.min(4200, 2093 * (1 + p * 0.15)), tickTime);
                tickGain.gain.setValueAtTime(0.04, tickTime);
                tickGain.gain.exponentialRampToValueAtTime(0.0001, tickTime + 0.035);
                tickOsc.connect(tickGain);
                tickGain.connect(this.ctx.destination);
                tickOsc.start(tickTime);
                tickOsc.stop(tickTime + 0.04);
            }
        }
    }

    // Full Slot Machine Jackpot Fanfare & Coin Shower
    playCasinoJackpot() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Part 1: Rapid escalating fanfare arpeggios (C major across 4 octaves)
        const fanfareNotes = [
            261.63, 329.63, 392.00, 523.25, 659.25, 783.99,
            1046.50, 1318.51, 1567.98, 2093.00, 2637.02
        ];
        fanfareNotes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            const noteStart = now + idx * 0.055;
            osc.frequency.setValueAtTime(freq, noteStart);
            gain.gain.setValueAtTime(0.11, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.22);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(noteStart);
            osc.stop(noteStart + 0.25);
        });

        // Part 2: Cascading Coin Shower (35 rapid metallic coin pings)
        const coinShowerStart = now + 0.55;
        for (let i = 0; i < 35; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            const f = 1600 + Math.random() * 2200;
            const dropTime = coinShowerStart + (i * 0.032) + (Math.random() * 0.015);
            osc.frequency.setValueAtTime(f, dropTime);
            gain.gain.setValueAtTime(0.07, dropTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, dropTime + 0.05);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(dropTime);
            osc.stop(dropTime + 0.055);
        }

        // Part 3: Grand Finale Triumphant Chord (C6 + E6 + G6 + C7)
        const chordStart = now + 1.25;
        const grandChord = [1046.50, 1318.51, 1567.98, 2093.00];
        grandChord.forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, chordStart);
            gain.gain.setValueAtTime(0.07, chordStart);
            gain.gain.exponentialRampToValueAtTime(0.0001, chordStart + 0.85);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(chordStart);
            osc.stop(chordStart + 0.9);
        });
    }

    playStepSuccess(stepIndex = 0, totalSteps = 1) {
        this.playCasinoStepSuccess(stepIndex, totalSteps);
    }

    playArcadeCoin() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc1.type = 'square';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(987.77, now); // B5
        osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc1.connect(gain);
        gain.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.38);
    }

    playCoffeeBrew() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        // White noise burst for hissing espresso steam
        const bufferSize = this.ctx.sampleRate * 0.25;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1800;
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        noise.start(now);
    }

    playServerPing() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now);
        osc.frequency.setValueAtTime(2349.32, now + 0.04);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
    }

    playWaterBubble() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
    }

    playAgentDrop() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    }

    playRallyMarch() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + idx * 0.06);
            gain.gain.setValueAtTime(0.09, now + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + idx * 0.06);
            osc.stop(now + idx * 0.06 + 0.18);
        });
    }

    playWhistle() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.setValueAtTime(1800, now + 0.06);
        osc.frequency.setValueAtTime(1600, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
    }

    playSprintType() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        for (let i = 0; i < 5; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            const f = 700 + Math.random() * 500;
            osc.frequency.setValueAtTime(f, now + i * 0.035);
            gain.gain.setValueAtTime(0.04, now + i * 0.035);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.035 + 0.03);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + i * 0.035);
            osc.stop(now + i * 0.035 + 0.035);
        }
    }

    playCultBell() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        // Subtle, mystical singing bowl / ethereal temple chime (soft, peaceful, sacred)
        const fundamental = 432; // A4 healing harmonic
        const harmonics = [1, 2.01, 3.02];
        harmonics.forEach((mult, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine'; // Pure gentle sine wave (zero harshness)
            osc.frequency.setValueAtTime(fundamental * mult, now);
            
            // Soft attack to prevent click/pop, gentle low volume (subtle)
            const peakGain = 0.04 / (i + 1);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(peakGain, now + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 1.25);
        });
    }

    playCultChant() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        // Minor ritual triad swell (D minor: D3, F3, A3)
        const freqs = [146.83, 174.61, 220.00];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.06, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 1.25);
        });
    }

    playDivineLightning() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        // Crackling lightning zap
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2200, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    playSacrificeBoom() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        // Deep explosion / bug exorcism boom
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
    }
}

window.pixelAudio = new PixelAudio();

