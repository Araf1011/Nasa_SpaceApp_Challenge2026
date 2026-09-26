/**
 * Web Audio API Space Sound Synthesizer
 * Generates authentic cosmic audio effects locally with zero dependencies or external network latency.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.activeLoopNodes = [];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopCurrentAudio();
    }
    return this.isMuted;
  }

  stopCurrentAudio() {
    this.activeLoopNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {
        // ignore
      }
    });
    this.activeLoopNodes = [];
  }

  // 1. Subtle HUD Telemetry Click
  playClick() {
    if (this.isMuted) return;
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // 2. Apollo Laser Pulse Echo
  playLaserPulse() {
    if (this.isMuted) return;
    this.init();
    this.stopCurrentAudio();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);

    // Echo 1.28s later (simulating Earth -> Moon roundtrip delay scaled down to 400ms!)
    setTimeout(() => {
      if (this.isMuted || !this.ctx) return;
      const echoOsc = this.ctx.createOscillator();
      const echoGain = this.ctx.createGain();

      echoOsc.type = 'sine';
      echoOsc.frequency.setValueAtTime(2200, this.ctx.currentTime);
      echoOsc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.25);

      echoGain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      echoGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      echoOsc.connect(echoGain);
      echoGain.connect(this.ctx.destination);

      echoOsc.start();
      echoOsc.stop(this.ctx.currentTime + 0.25);
    }, 450);
  }

  // 3. Perseverance Mars Wind Gusts (Filtered Noise Generator)
  playMartianWind() {
    if (this.isMuted) return;
    this.init();
    this.stopCurrentAudio();

    const bufferSize = this.ctx.sampleRate * 2.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate brown/pink noise
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(450, this.ctx.currentTime + 1.2);
    filter.frequency.linearRampToValueAtTime(220, this.ctx.currentTime + 2.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.8);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    this.activeLoopNodes.push(noise);
  }

  // 4. Voyager Interstellar Plasma Whistler Waves
  playPlasmaWaves() {
    if (this.isMuted) return;
    this.init();
    this.stopCurrentAudio();

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const mod = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const masterGain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(520, this.ctx.currentTime);
    osc1.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 1.5);
    osc1.frequency.linearRampToValueAtTime(680, this.ctx.currentTime + 3.0);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(260, this.ctx.currentTime);

    mod.type = 'sine';
    mod.frequency.setValueAtTime(4.5, this.ctx.currentTime); // 4.5 Hz flutter
    modGain.gain.setValueAtTime(40, this.ctx.currentTime);

    mod.connect(osc1.frequency);

    masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.6);
    masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 3.0);

    osc1.connect(masterGain);
    osc2.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    mod.start();
    osc1.start();
    osc2.start();
    mod.stop(this.ctx.currentTime + 3.0);
    osc1.stop(this.ctx.currentTime + 3.0);
    osc2.stop(this.ctx.currentTime + 3.0);

    this.activeLoopNodes.push(osc1, osc2, mod);
  }

  // 5. NASA Deep Space Network Radio Telemetry Bleeps
  playRadioCarrier() {
    if (this.isMuted) return;
    this.init();
    this.stopCurrentAudio();

    const freqs = [880, 1046, 1318, 1760, 2093];
    let timeOffset = 0;

    for (let i = 0; i < 6; i++) {
      const freq = freqs[i % freqs.length];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + timeOffset);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime + timeOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + timeOffset + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + timeOffset);
      osc.stop(this.ctx.currentTime + timeOffset + 0.12);

      this.activeLoopNodes.push(osc);
      timeOffset += 0.18;
    }
  }

  // 6. Badge & Level Up Fanfare
  playFanfare() {
    if (this.isMuted) return;
    this.init();
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    chord.forEach((note, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, this.ctx.currentTime + index * 0.1);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + index * 0.1 + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + index * 0.1);
      osc.stop(this.ctx.currentTime + index * 0.1 + 0.8);
    });
  }

  // 7. Rocket Booster Ignition & Ascent Rumble
  playRocketLaunch() {
    if (this.isMuted) return;
    this.init();
    this.stopCurrentAudio();

    try {
      // 1. Synthesize Rocket Engine White Noise Rumble
      const bufferSize = this.ctx.sampleRate * 4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(160, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(700, this.ctx.currentTime + 2.5);
      filter.frequency.linearRampToValueAtTime(250, this.ctx.currentTime + 4.0);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.35, this.ctx.currentTime + 1.2);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 3.0);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 4.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      // 2. Sub-bass engine throttle vibration
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(55, this.ctx.currentTime);
      subOsc.frequency.linearRampToValueAtTime(95, this.ctx.currentTime + 2.0);

      subGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.25, this.ctx.currentTime + 1.0);
      subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.8);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);

      noise.start();
      subOsc.start();
      noise.stop(this.ctx.currentTime + 4.2);
      subOsc.stop(this.ctx.currentTime + 3.8);

      this.activeLoopNodes.push(noise, subOsc);
    } catch (e) {
      console.warn('Audio launch FX fallback', e);
    }
  }

  // 8. Touchdown & Surface Contact Chime
  playTouchdown() {
    if (this.isMuted) return;
    this.init();
    this.stopCurrentAudio();

    try {
      // Thruster cutoff puff
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);

      // Triumphant double-chime (Major 6th)
      const t = this.ctx.currentTime + 0.35;
      [587.33, 880.00, 1174.66].forEach((f, idx) => {
        const chime = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(f, t + idx * 0.12);

        cGain.gain.setValueAtTime(0.15, t + idx * 0.12);
        cGain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.12 + 0.9);

        chime.connect(cGain);
        cGain.connect(this.ctx.destination);
        chime.start(t + idx * 0.12);
        chime.stop(t + idx * 0.12 + 0.9);
      });
    } catch (e) {
      console.warn('Touchdown audio error', e);
    }
  }

  // 9. Spacecraft & Satellite System Activation Ping (Futuristic Hologram Awakening)
  playSatelliteAwaken() {
    if (this.isMuted) return;
    this.init();
    try {
      const freqs = [440, 659.25, 880, 1318.5, 1760];
      const startT = this.ctx.currentTime;
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startT + idx * 0.08);

        gain.gain.setValueAtTime(0.12, startT + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + idx * 0.08 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startT + idx * 0.08);
        osc.stop(startT + idx * 0.08 + 0.5);
      });
    } catch (e) {
      console.warn('Satellite awaken audio error', e);
    }
  }

  // 10. Holographic Telemetry Typing Chirp
  playHoloTypewriter() {
    if (this.isMuted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      const rndFreq = 1600 + Math.random() * 800;
      osc.frequency.setValueAtTime(rndFreq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0005, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch (e) {
      // ignore
    }
  }

  playRelicAudio(simulationType) {
    switch (simulationType) {
      case 'laser_pulse':
        this.playLaserPulse();
        break;
      case 'martian_wind':
        this.playMartianWind();
        break;
      case 'plasma_waves':
        this.playPlasmaWaves();
        break;
      case 'satellite_awaken':
        this.playSatelliteAwaken();
        break;
      case 'radio_carrier':
      case 'radio_chime':
      default:
        this.playRadioCarrier();
        break;
    }
  }
}

export const soundFX = new SoundEngine();
