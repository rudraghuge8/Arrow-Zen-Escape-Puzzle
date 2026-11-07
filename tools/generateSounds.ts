/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs';
import path from 'node:path';

function createWavHeader(dataLength: number, sampleRate = 44100, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const buffer = Buffer.alloc(44);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);

  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // audio format (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);

  return buffer;
}

function synthesizeSound(
  durationSec: number,
  generator: (t: number, total: number) => number,
  sampleRate = 44100
): Buffer {
  const numSamples = Math.floor(sampleRate * durationSec);
  const data = Buffer.alloc(numSamples * 2);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.max(-1, Math.min(1, generator(t, durationSec)));
    const int16 = Math.floor(sample < 0 ? sample * 32768 : sample * 32767);
    data.writeInt16LE(int16, i * 2);
  }

  const header = createWavHeader(data.length, sampleRate, 1, 16);
  return Buffer.concat([header, data]);
}

async function run() {
  const soundsDir = path.resolve(process.cwd(), 'public/sounds');
  fs.mkdirSync(soundsDir, { recursive: true });

  // 1. tap.wav: short wooden tactile click
  const tapWav = synthesizeSound(0.04, (t) => {
    const env = Math.exp(-t * 90);
    return Math.sin(2 * Math.PI * (700 - t * 4000) * t) * env * 0.7;
  });
  fs.writeFileSync(path.join(soundsDir, 'tap.wav'), tapWav);

  // 2. go.wav: smooth rising slide out
  const goWav = synthesizeSound(0.22, (t, tot) => {
    const env = Math.sin((t / tot) * Math.PI) * 0.8;
    const freq = 480 + (t / tot) * 500;
    return Math.sin(2 * Math.PI * freq * t) * env;
  });
  fs.writeFileSync(path.join(soundsDir, 'go.wav'), goWav);

  // 3. blocked.wav: dull thud / bounce
  const blockedWav = synthesizeSound(0.25, (t) => {
    const env = Math.exp(-t * 18);
    const freq = 180 - t * 300;
    const saw = (freq * t) % 1 - 0.5;
    return saw * env * 0.8;
  });
  fs.writeFileSync(path.join(soundsDir, 'blocked.wav'), blockedWav);

  // 4. win.wav: four-note triumphant chime
  const winWav = synthesizeSound(0.65, (t) => {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    const noteIdx = Math.min(3, Math.floor(t / 0.12));
    const noteStart = noteIdx * 0.12;
    const localT = t - noteStart;
    const env = Math.exp(-localT * 8);
    const freq = notes[noteIdx];
    return Math.sin(2 * Math.PI * freq * t) * env * 0.65;
  });
  fs.writeFileSync(path.join(soundsDir, 'win.wav'), winWav);

  // 5. coin.wav: bright two-tone chime
  const coinWav = synthesizeSound(0.3, (t) => {
    const f1 = 987.77;
    const f2 = 1318.51;
    const env1 = Math.exp(-t * 22);
    const env2 = t > 0.08 ? Math.exp(-(t - 0.08) * 16) : 0;
    return (Math.sin(2 * Math.PI * f1 * t) * env1 + Math.sin(2 * Math.PI * f2 * t) * env2) * 0.5;
  });
  fs.writeFileSync(path.join(soundsDir, 'coin.wav'), coinWav);

  // 6. button.wav: light bubble pop
  const buttonWav = synthesizeSound(0.08, (t) => {
    const env = Math.exp(-t * 40);
    const freq = 550 + t * 1500;
    return Math.sin(2 * Math.PI * freq * t) * env * 0.7;
  });
  fs.writeFileSync(path.join(soundsDir, 'button.wav'), buttonWav);

  // 7. booster.wav: celestial upward sweep
  const boosterWav = synthesizeSound(0.38, (t, tot) => {
    const env = Math.sin((t / tot) * Math.PI) * 0.75;
    const freq = 330 + (t / tot) ** 1.5 * 1100;
    return Math.sin(2 * Math.PI * freq * t) * env;
  });
  fs.writeFileSync(path.join(soundsDir, 'booster.wav'), boosterWav);

  // 8. undo.wav: reverse swoop
  const undoWav = synthesizeSound(0.16, (t, tot) => {
    const env = Math.exp(-t * 15);
    const freq = 750 - (t / tot) * 400;
    return Math.sin(2 * Math.PI * freq * t) * env * 0.7;
  });
  fs.writeFileSync(path.join(soundsDir, 'undo.wav'), undoWav);

  console.log(`Generated 8 pristine PCM WAV sound effects in public/sounds/`);
}

run().catch(console.error);
