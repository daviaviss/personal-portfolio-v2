
const CHORDS = [
  { bass: 41, pad: [53, 57, 60, 64], lead: [72, 76, 79, 81, 84] },
  { bass: 40, pad: [52, 55, 59, 62], lead: [71, 74, 76, 79, 83] },
  { bass: 38, pad: [50, 53, 57, 60, 64], lead: [72, 74, 77, 81, 84] },
  { bass: 36, pad: [48, 52, 55, 59], lead: [67, 71, 74, 76, 79] },
];

const CHORD_SECONDS = 9;
const PAD_ATTACK = 3;
const PAD_RELEASE = 4;
const LEAD_DECAY = 3;
const LOOKAHEAD = 1.5;
const VOLUME = 0.55;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let padBus: AudioNode | null = null;
let leadBus: AudioNode | null = null;

let playing = false;
let step = 0;
let nextChordAt = 0;
let tickId: ReturnType<typeof setInterval> | undefined;
let suspendId: ReturnType<typeof setTimeout> | undefined;

const sources = new Set<OscillatorNode>();
const listeners = new Set<() => void>();

const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

function impulse(audio: AudioContext, seconds: number) {
  const length = Math.floor(audio.sampleRate * seconds);
  const buffer = audio.createBuffer(2, length, audio.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
    }
  }
  return buffer;
}

function build() {
  const audio = new AudioContext();

  const out = audio.createGain();
  out.gain.value = 0;
  const limiter = audio.createDynamicsCompressor();
  out.connect(limiter).connect(audio.destination);

  const reverb = audio.createConvolver();
  reverb.buffer = impulse(audio, 4);
  const wet = audio.createGain();
  wet.gain.value = 0.45;
  reverb.connect(wet).connect(out);

  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 850;
  filter.Q.value = 0.4;
  filter.connect(out);
  filter.connect(reverb);

  const lfo = audio.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoDepth = audio.createGain();
  lfoDepth.gain.value = 260;
  lfo.connect(lfoDepth).connect(filter.frequency);
  lfo.start();

  const lead = audio.createGain();
  const delay = audio.createDelay(1);
  delay.delayTime.value = 0.46;
  const feedback = audio.createGain();
  feedback.gain.value = 0.38;
  const echo = audio.createGain();
  echo.gain.value = 0.5;
  lead.connect(out);
  lead.connect(reverb);
  lead.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(echo);
  echo.connect(out);
  echo.connect(reverb);

  ctx = audio;
  master = out;
  padBus = filter;
  leadBus = lead;
}

function voice(
  type: OscillatorType,
  freq: number,
  detune: number,
  envelope: GainNode,
  start: number,
  stop: number
) {
  const osc = ctx!.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  osc.connect(envelope);
  osc.onended = () => {
    sources.delete(osc);
    osc.disconnect();
  };
  sources.add(osc);
  osc.start(start);
  osc.stop(stop);
}

function sustained(
  type: OscillatorType,
  midi: number,
  detunes: number[],
  peak: number,
  at: number
) {
  const end = at + CHORD_SECONDS + PAD_RELEASE;
  const envelope = ctx!.createGain();
  envelope.gain.setValueAtTime(0, at);
  envelope.gain.linearRampToValueAtTime(peak, at + PAD_ATTACK);
  envelope.gain.setValueAtTime(peak, at + CHORD_SECONDS);
  envelope.gain.linearRampToValueAtTime(0, end);
  envelope.connect(padBus!);
  detunes.forEach((d) => voice(type, hz(midi), d, envelope, at, end + 0.1));
}

function pluck(midi: number, at: number) {
  const envelope = ctx!.createGain();
  envelope.gain.setValueAtTime(0, at);
  envelope.gain.linearRampToValueAtTime(0.06, at + 0.02);
  envelope.gain.exponentialRampToValueAtTime(0.0001, at + LEAD_DECAY);
  envelope.connect(leadBus!);
  voice("triangle", hz(midi), 0, envelope, at, at + LEAD_DECAY + 0.1);
}

function scheduleChord(at: number, chord: (typeof CHORDS)[number]) {
  sustained("sine", chord.bass, [0], 0.11, at);
  chord.pad.forEach((midi) => sustained("sawtooth", midi, [-7, 7], 0.03, at));

  const slots = [0, 1, 2, 3, 4, 5, 6, 7]
    .sort(() => Math.random() - 0.5)
    .slice(0, 2 + Math.floor(Math.random() * 3));
  slots.forEach((slot) => {
    const midi = chord.lead[Math.floor(Math.random() * chord.lead.length)];
    pluck(midi, at + (slot * CHORD_SECONDS) / 8);
  });
}

function tick() {
  while (nextChordAt < ctx!.currentTime + LOOKAHEAD) {
    scheduleChord(nextChordAt, CHORDS[step % CHORDS.length]);
    step++;
    nextChordAt += CHORD_SECONDS;
  }
}

function start() {
  if (!ctx) build();
  clearTimeout(suspendId);
  void ctx!.resume();

  const now = ctx!.currentTime;
  master!.gain.cancelScheduledValues(now);
  master!.gain.setTargetAtTime(VOLUME, now, 0.8);

  nextChordAt = Math.max(nextChordAt, now + 0.1);
  tick();
  tickId = setInterval(tick, 500);
}

function stop() {
  clearInterval(tickId);

  const now = ctx!.currentTime;
  master!.gain.cancelScheduledValues(now);
  master!.gain.setTargetAtTime(0, now, 0.3);

  suspendId = setTimeout(() => {
    sources.forEach((osc) => osc.stop());
    nextChordAt = 0;
    void ctx!.suspend();
  }, 1500);
}

export function toggleAmbient() {
  playing = !playing;
  if (playing) start();
  else stop();
  listeners.forEach((fn) => fn());
  return playing;
}

export function subscribeAmbient(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

export const isAmbientPlaying = () => playing;
