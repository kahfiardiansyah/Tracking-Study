import { AmbientSound } from '../types/study';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private activeSources: AudioBufferSourceNode[] = [];
  private intervalIds: number[] = [];
  private currentSound: AmbientSound = 'none';

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public stopAmbient(): void {
    this.intervalIds.forEach((id) => window.clearInterval(id));
    this.intervalIds = [];

    this.activeSources.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // Ignore already stopped sources
      }
    });
    this.activeSources = [];

    this.activeNodes.forEach((node) => {
      try {
        node.disconnect();
      } catch {
        // Ignore disconnect errors
      }
    });
    this.activeNodes = [];

    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch {
        // Ignore
      }
      this.ambientGain = null;
    }

    this.currentSound = 'none';
  }

  private createRainLayer(ctx: AudioContext, dest: GainNode, level = 0.25): void {
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0,
      b1 = 0,
      b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.099046;
      b1 = 0.963 * b1 + white * 0.2965164;
      b2 = 0.57 * b2 + white * 1.0526913;
      data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.055;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1050;
    filter.Q.value = 0.7;

    const rainGain = ctx.createGain();
    rainGain.gain.value = level;

    source.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(dest);
    source.start();

    this.activeSources.push(source);
    this.activeNodes.push(filter, rainGain);
  }

  private createVinylCrackleLayer(ctx: AudioContext, dest: GainNode): void {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      const crackle = Math.random() > 0.9982 ? (Math.random() * 2 - 1) * 0.28 : 0;
      data[i] = lastOut * 0.45 + crackle;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;

    const vinylGain = ctx.createGain();
    vinylGain.gain.value = 0.18;

    source.connect(filter);
    filter.connect(vinylGain);
    vinylGain.connect(dest);
    source.start();

    this.activeSources.push(source);
    this.activeNodes.push(filter, vinylGain);
  }

  private startLofiChillLoop(ctx: AudioContext, dest: GainNode): void {
    // Cozy warm Lo-Fi electric piano filter bus
    const lofiFilter = ctx.createBiquadFilter();
    lofiFilter.type = 'lowpass';
    lofiFilter.frequency.value = 920;
    lofiFilter.Q.value = 0.8;
    lofiFilter.connect(dest);
    this.activeNodes.push(lofiFilter);

    // Subtle vinyl warmth
    this.createVinylCrackleLayer(ctx, dest);

    // Jazzy chill chord progression: Fmaj7 -> Em7 -> Dm7 -> Cmaj7
    const chords: number[][] = [
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [164.81, 196.0, 246.94, 293.66], // Em7
      [146.83, 174.61, 220.0, 261.63], // Dm7
      [130.81, 164.81, 196.0, 246.94], // Cmaj7
    ];

    let chordIdx = 0;
    let beatStep = 0;

    const playChord = (notes: number[]) => {
      if (!this.ctx || !this.ambientGain) return;
      const now = this.ctx.currentTime;
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const oscWarm = this.ctx!.createOscillator();
        const voiceGain = this.ctx!.createGain();

        // Warm Rhodes-like slight detune
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.045);

        oscWarm.type = 'sine';
        oscWarm.frequency.setValueAtTime(freq * 1.003, now + i * 0.045);

        voiceGain.gain.setValueAtTime(0.0001, now + i * 0.045);
        voiceGain.gain.linearRampToValueAtTime(0.075, now + i * 0.045 + 0.09);
        voiceGain.gain.exponentialRampToValueAtTime(0.018, now + 2.8);
        voiceGain.gain.linearRampToValueAtTime(0.0001, now + 3.25);

        osc.connect(voiceGain);
        oscWarm.connect(voiceGain);
        voiceGain.connect(lofiFilter);

        osc.start(now + i * 0.045);
        oscWarm.start(now + i * 0.045);
        osc.stop(now + 3.3);
        oscWarm.stop(now + 3.3);
      });
    };

    const playSoftDrum = (step: number) => {
      if (!this.ctx || !this.ambientGain) return;
      const now = this.ctx.currentTime;
      // Soft muted Lo-Fi kick on step 0 & 5
      if (step % 8 === 0 || step % 8 === 5) {
        const kick = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kick.type = 'sine';
        kick.frequency.setValueAtTime(105, now);
        kick.frequency.exponentialRampToValueAtTime(42, now + 0.14);
        kickGain.gain.setValueAtTime(0.16, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        kick.connect(kickGain);
        kickGain.connect(lofiFilter);
        kick.start(now);
        kick.stop(now + 0.17);
      }

      // Soft brushed snare/rim on step 2 & 6
      if (step % 8 === 2 || step % 8 === 6) {
        const snare = this.ctx.createOscillator();
        const snareGain = this.ctx.createGain();
        snare.type = 'triangle';
        snare.frequency.setValueAtTime(220, now);
        snare.frequency.exponentialRampToValueAtTime(120, now + 0.06);
        snareGain.gain.setValueAtTime(0.045, now);
        snareGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        snare.connect(snareGain);
        snareGain.connect(lofiFilter);
        snare.start(now);
        snare.stop(now + 0.08);
      }
    };

    // Play immediately
    playChord(chords[0]);
    playSoftDrum(0);

    // 410ms per 8th-note step (~73 BPM chill groove), new chord every 8 steps (3.28s)
    const stepTimer = window.setInterval(() => {
      if (this.currentSound !== 'lofi' && this.currentSound !== 'lofi_rain') return;
      beatStep++;
      playSoftDrum(beatStep);
      if (beatStep % 8 === 0) {
        chordIdx = (chordIdx + 1) % chords.length;
        playChord(chords[chordIdx]);
      }
    }, 410);

    this.intervalIds.push(stepTimer);
  }

  public setAmbient(sound: AmbientSound, volume: number): void {
    if (sound === 'none') {
      this.stopAmbient();
      return;
    }

    if (sound === this.currentSound && this.ambientGain && this.ctx) {
      this.updateVolume(volume);
      return;
    }

    this.stopAmbient();
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.currentSound = sound;
    const masterGain = ctx.createGain();
    const scale = sound === 'tick' ? 0.35 : sound === 'lofi' || sound === 'lofi_rain' ? 0.55 : 0.3;
    masterGain.gain.value = Math.max(0.02, Math.min(1, volume)) * scale;
    masterGain.connect(ctx.destination);
    this.ambientGain = masterGain;

    if (sound === 'lofi') {
      this.startLofiChillLoop(ctx, masterGain);
    } else if (sound === 'lofi_rain') {
      this.startLofiChillLoop(ctx, masterGain);
      this.createRainLayer(ctx, masterGain, 0.32);
    } else if (sound === 'rain') {
      this.createRainLayer(ctx, masterGain, 0.9);
    } else if (sound === 'tick') {
      const playTick = () => {
        if (!this.ctx || !this.ambientGain || this.currentSound !== 'tick') return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(760, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.035);
        env.gain.setValueAtTime(0.18, now);
        env.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(env);
        env.connect(this.ambientGain);
        osc.start(now);
        osc.stop(now + 0.045);
      };
      playTick();
      const tickTimer = window.setInterval(playTick, 1000);
      this.intervalIds.push(tickTimer);
    }
  }

  public updateVolume(volume: number): void {
    if (this.ambientGain && this.ctx && this.currentSound !== 'none') {
      const scale =
        this.currentSound === 'tick'
          ? 0.35
          : this.currentSound === 'lofi' || this.currentSound === 'lofi_rain'
            ? 0.55
            : 0.3;
      this.ambientGain.gain.setTargetAtTime(
        Math.max(0.005, Math.min(1, volume)) * scale,
        this.ctx.currentTime,
        0.06
      );
    }
  }

  public playCompletionChime(enabled: boolean): void {
    if (!enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    const now = ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);

      gain.gain.setValueAtTime(0.001, now + idx * 0.14);
      gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.14 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.14 + 1.15);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 1.2);
    });
  }

  public playPop(enabled: boolean): void {
    if (!enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(560, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }
}

export const soundEngine = new SoundEngine();
