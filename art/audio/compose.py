"""
Soundtracks for the two 15-second films, synthesised from scratch (no samples, no
licences). Every sound effect is placed on the same timeline the films use
(art/src/scenes/ParadaFilm.tsx, TalaFilm.tsx), so a beep lands on the frame the
plate is read and a pop lands on the frame each chip appears.

    python3 audio/compose.py          # writes public/audio/{parada,tala}.mp3
    (the film compositions play them; render.mjs muxes them into the films)

Needs numpy and scipy.
"""

from pathlib import Path

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48_000
DUR = 15.0
N = int(SR * DUR)
rng = np.random.default_rng(20260928)  # deterministic: same audio every run
OUT = Path(__file__).resolve().parent.parent / "public" / "audio"


# ─── building blocks ──────────────────────────────────────────────────────────

def t_of(dur):
    return np.arange(int(SR * dur)) / SR


def env(n, attack=0.005, release=0.05, decay=None):
    """Attack/release envelope over n samples; optional exponential decay (seconds to -60 dB)."""
    e = np.ones(n)
    a = max(1, int(attack * SR))
    r = max(1, int(release * SR))
    e[:a] = np.linspace(0, 1, a) ** 2
    if r < n:
        e[-r:] *= np.linspace(1, 0, r) ** 2
    if decay:
        e *= np.exp(-6.9 * np.arange(n) / (decay * SR))
    return e


def filt(x, kind, freq, order=2):
    sos = butter(order, freq, btype=kind, fs=SR, output="sos")
    return sosfilt(sos, x)


def noise(dur):
    return rng.standard_normal(int(SR * dur))


def saw(freq, dur, detune_cents=(0,)):
    t = t_of(dur)
    out = np.zeros_like(t)
    for c in detune_cents:
        f = freq * 2 ** (c / 1200)
        out += 2 * ((t * f + rng.random()) % 1.0) - 1
    return out / len(detune_cents)


def sweep_bandpass(x, f0, f1, q=2.5):
    """State-variable band-pass whose centre glides from f0 to f1 (log)."""
    n = len(x)
    fc = f0 * (f1 / f0) ** (np.arange(n) / max(1, n - 1))
    g = np.tan(np.pi * np.clip(fc, 20, SR * 0.45) / SR)
    k = 1 / q
    y = np.zeros(n)
    ic1 = ic2 = 0.0
    for i in range(n):
        gi = g[i]
        a1 = 1 / (1 + gi * (gi + k))
        v1 = a1 * ic1 + gi * a1 * (x[i] - ic2)
        v2 = ic2 + gi * v1
        ic1 = 2 * v1 - ic1
        ic2 = 2 * v2 - ic2
        y[i] = v1
    return y


def note(name):
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    pitch, octave = name[:-1], int(name[-1])
    return 440 * 2 ** ((names[pitch] + 12 * (octave + 1) - 69) / 12)


class Track:
    def __init__(self):
        self.l = np.zeros(N)
        self.r = np.zeros(N)

    def add(self, sound, at, gain=1.0, pan=0.0):
        """Place a mono sound at `at` seconds; pan -1 (left) … 1 (right)."""
        i = int(at * SR)
        if i >= N:
            return
        s = sound[: N - i] * gain
        self.l[i : i + len(s)] += s * np.sqrt((1 - pan) / 2)
        self.r[i : i + len(s)] += s * np.sqrt((1 + pan) / 2)

    def stereo(self):
        return np.stack([self.l, self.r])


def reverb(stereo, seconds=2.0, wet=0.22):
    """Convolution with a decaying-noise impulse — a soft room, no files needed."""
    n = int(seconds * SR)
    ir = rng.standard_normal((2, n)) * np.exp(-6.9 * np.arange(n) / n)
    ir = filt(ir, "lowpass", 6000)
    ir /= np.abs(ir).sum(axis=1, keepdims=True) ** 0.5 * 12
    out = stereo.copy()
    for c in range(2):
        out[c] += wet * fftconvolve(stereo[c], ir[c])[:N]
    return out


def master(stereo, fade_in=0.05, fade_out=1.2):
    x = filt(stereo, "highpass", 35, 2)  # no sub-rumble laptops can't play anyway
    x[:, : int(fade_in * SR)] *= np.linspace(0, 1, int(fade_in * SR))
    fo = int(fade_out * SR)
    x[:, -fo:] *= np.linspace(1, 0, fo) ** 1.5
    x = np.tanh(x * 1.1) / np.tanh(1.1)  # gentle glue, no hard clipping
    return x / np.abs(x).max() * 10 ** (-1.0 / 20)  # peak at -1 dBFS


def write_wav(path, stereo):
    from scipy.io import wavfile

    path.parent.mkdir(parents=True, exist_ok=True)
    wavfile.write(path, SR, (stereo.T * 32767).astype(np.int16))
    print("✓", path.relative_to(path.parents[2]))


# ─── instruments ──────────────────────────────────────────────────────────────

def keys(freq, dur=1.6, bright=1.0):
    """Soft electric-piano tone: a few decaying harmonics, a touch of tremolo."""
    t = t_of(dur)
    tone = np.zeros_like(t)
    for h, a in ((1, 1.0), (2, 0.42 * bright), (3, 0.18 * bright), (4, 0.08 * bright)):
        tone += a * np.sin(2 * np.pi * freq * h * t) * np.exp(-t * (2.2 + h * 1.4))
    tone *= 1 + 0.08 * np.sin(2 * np.pi * 5.2 * t)
    return tone * env(len(t), 0.004, 0.15)


def pad(freqs, dur, cutoff=1400, attack=1.0, release=1.4):
    x = sum(saw(f, dur, (-7, 0, 6)) for f in freqs) / len(freqs)
    x = filt(x, "lowpass", cutoff, 2)
    return x * env(len(x), attack, release)


def bass(freq, dur):
    t = t_of(dur)
    x = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * freq * 2 * t)
    return np.tanh(1.6 * x) * env(len(t), 0.01, 0.12, decay=dur * 1.4)


def kick():
    t = t_of(0.45)
    f = 45 + 70 * np.exp(-t * 30)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    return x + 0.3 * filt(noise(0.45), "highpass", 2000) * np.exp(-t * 180)


def hat(open_=False):
    d = 0.18 if open_ else 0.05
    return filt(noise(d), "highpass", 7000) * env(int(d * SR), 0.001, 0.01, decay=d)


def shaker():
    return filt(noise(0.09), "bandpass", (5000, 11000)) * env(int(0.09 * SR), 0.02, 0.04)


def whoosh(dur=0.9, up=True, lo=250, hi=5000):
    x = sweep_bandpass(noise(dur), lo if up else hi, hi if up else lo, q=1.8)
    shape = np.sin(np.pi * np.linspace(0, 1, len(x))) ** (1.6 if up else 0.8)
    return x * shape * 0.9


def riser(dur=1.5):
    x = sweep_bandpass(noise(dur), 200, 6000, q=3) + 0.15 * saw(110, dur, (-12, 0, 12)) * np.linspace(0, 1, int(dur * SR))
    return x * np.linspace(0, 1, len(x)) ** 2.2


def beep(freq, dur=0.09):
    t = t_of(dur)
    x = np.sin(2 * np.pi * freq * t) + 0.2 * np.sign(np.sin(2 * np.pi * freq * t))
    return filt(x, "lowpass", 5000) * env(len(t), 0.003, 0.02)


def blip(freq, dur=0.035):
    t = t_of(dur)
    f = freq * (1 + 0.5 * t / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.001, 0.012)


def chime(freq, dur=2.2):
    """Bell: inharmonic partials with different decays."""
    t = t_of(dur)
    x = np.zeros_like(t)
    for ratio, amp, dec in ((1, 1, 1.8), (2.76, 0.5, 1.0), (5.4, 0.25, 0.5), (8.93, 0.12, 0.25)):
        x += amp * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-6.9 * t / dec)
    return x * env(len(t), 0.002, 0.2)


def servo(dur=0.8, f0=140, f1=230):
    t = t_of(dur)
    f = f0 + (f1 - f0) * np.sin(np.pi / 2 * t / dur)
    x = 2 * ((np.cumsum(f) / SR) % 1) - 1
    x = filt(x, "lowpass", 900) * (1 + 0.35 * np.sin(2 * np.pi * 21 * t))
    x += 0.25 * filt(noise(dur), "bandpass", (1500, 4000)) * (np.sin(2 * np.pi * 42 * t) > 0.6)
    return x * env(len(t), 0.03, 0.1)


def engine(dur, f0=38, f1=52, road=0.5):
    """Idling engine + tyre roar: low pulsing saw and low-passed noise."""
    t = t_of(dur)
    f = f0 + (f1 - f0) * np.sin(np.pi * t / dur)
    firing = 2 * ((np.cumsum(f) / SR) % 1) - 1
    x = filt(firing, "lowpass", 220, 2) * (0.8 + 0.2 * np.sin(2 * np.pi * f * 0.5 * t))
    x += road * filt(noise(dur), "lowpass", 500) * 0.6
    return x * env(len(t), 0.25, 0.4)


def squeak(dur=0.22):
    t = t_of(dur)
    f = 2600 - 700 * t / dur
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.01, 0.08) * 0.25


def thump():
    t = t_of(0.3)
    return np.sin(2 * np.pi * (60 + 30 * np.exp(-t * 25)) * t) * np.exp(-t * 14)


def pop(freq=520):
    t = t_of(0.16)
    f = freq * (1 + 0.8 * (1 - np.exp(-t * 60)))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.002, 0.05, decay=0.14)


def pencil(dur, rate=11.0):
    """Graphite on paper: band-passed noise in stroke-length grains."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    grain = np.clip(np.sin(2 * np.pi * rate * t + 2.5 * np.sin(2 * np.pi * 2.3 * t)), 0, 1) ** 0.6
    # every stroke presses a little differently
    strokes = 0.55 + 0.45 * rng.random(int(dur * rate) + 2)
    grain *= strokes[(t * rate).astype(int)]
    x = filt(noise(dur), "bandpass", (1800, 7000), 2) * grain
    x += 0.4 * filt(noise(dur), "bandpass", (400, 1200), 1) * grain
    return x * env(n, 0.03, 0.08)


# ─── PARADA ───────────────────────────────────────────────────────────────────
# Timeline (s): title 0.1 · car arrives 1.6–4.1 · plate read 4.2–5.6 (decode 4.4–5.5,
# "registered" 5.6) · barrier up 5.9–6.7 · parks 6.6–9.2 · count 12→11 at 9.0 ·
# barrier down 9.6–10.4 · pipeline 9.6–12.6 · end card 12.8.

def parada():
    music, sfx = Track(), Track()
    beat = 60 / 100
    chords = [
        (["A2"], ["A3", "C4", "E4", "G4", "B4"]),
        (["F2"], ["F3", "A3", "C4", "E4", "G4"]),
        (["C3"], ["C3", "E3", "G3", "B3", "D4"]),
        (["G2"], ["G3", "B3", "D4", "F#4", "A4"]),
    ]
    bar = 4 * beat
    for b in range(7):
        root, voicing = chords[b % 4]
        start = b * bar
        music.add(pad([note(n) for n in voicing], bar + 1.2, cutoff=1100 + 200 * (b % 2)), start, 0.16)
        if 1.2 < start + bar and start < 13.2:
            for k in range(4):
                if start + k * beat >= 1.6:
                    music.add(bass(note(root[0]), beat * 0.9), start + k * beat, 0.24)
    # drums: kick on 1 and 3, hats on the off-beats, from the car's arrival to the end card
    t = 1.6
    i = 0
    while t < 12.7:
        if i % 2 == 0 and not (4.3 < t < 5.6):  # drop the kick while the plate is read
            music.add(kick(), t, 0.42)
        music.add(hat(open_=(i % 4 == 3)), t + beat / 2, 0.12, pan=0.3)
        music.add(shaker(), t + beat / 4, 0.05, pan=-0.35)
        t += beat
        i += 1
    # arpeggio sparkle over the pipeline
    arp = ["E5", "A5", "C6", "E6", "G5", "C6"]
    for k in range(12):
        music.add(keys(note(arp[k % len(arp)]), 0.8), 9.6 + k * beat / 2, 0.07, pan=0.4 * np.sin(k))

    # intro
    sfx.add(riser(1.5), 0.0, 0.25)
    sfx.add(whoosh(0.8), 0.05, 0.45)
    sfx.add(thump(), 0.25, 0.6)
    sfx.add(keys(note("A4"), 2.4), 0.25, 0.22)
    sfx.add(keys(note("E5"), 2.4), 0.25, 0.16)
    # the car
    sfx.add(engine(3.0, 42, 58, road=0.7), 1.3, 0.42, pan=0.5)
    sfx.add(squeak(), 3.95, 0.5, pan=0.4)
    sfx.add(engine(1.6, 36, 38, road=0.1), 4.1, 0.25, pan=0.4)  # idling at the gate
    # plate read
    sfx.add(beep(1320, 0.12), 4.25, 0.3, pan=0.3)
    sfx.add(whoosh(1.1, lo=1500, hi=9000), 4.3, 0.12, pan=0.3)
    for k in range(int((5.5 - 4.4) / 0.055)):
        sfx.add(blip(1800 + 900 * ((k * 7) % 5)), 4.4 + k * 0.055, 0.1, pan=0.4)
    sfx.add(chime(note("E6")), 5.6, 0.22, pan=0.2)
    sfx.add(chime(note("A6")), 5.72, 0.2, pan=0.2)
    # barrier and parking
    sfx.add(servo(0.85), 5.88, 0.35, pan=0.45)
    sfx.add(engine(2.8, 40, 55, road=0.5), 6.5, 0.34, pan=0.1)
    sfx.add(squeak(0.18), 8.95, 0.35, pan=-0.2)
    sfx.add(thump(), 9.0, 0.5)
    sfx.add(blip(1100, 0.06), 9.0, 0.3)
    sfx.add(blip(1650, 0.08), 9.07, 0.3)
    sfx.add(servo(0.85, 230, 140), 9.6, 0.25, pan=0.45)
    # pipeline: a blip per node, then packets
    for k in range(6):
        sfx.add(blip(900 + 180 * k, 0.05), 9.6 + k * 0.2, 0.22, pan=-0.6 + 0.24 * k)
    for k in range(4):
        sfx.add(whoosh(0.35, lo=2000, hi=8000), 10.5 + k * 0.867, 0.08, pan=-0.5 + 0.35 * k)
    # end card
    sfx.add(whoosh(1.0, up=False), 12.6, 0.4)
    sfx.add(thump(), 12.8, 0.6)
    for n in ("A3", "E4", "A4", "C5", "E5"):
        sfx.add(keys(note(n), 2.2), 12.8, 0.14)
    sfx.add(chime(note("A5"), 2.5), 12.85, 0.12)

    mix = reverb(music.stereo(), 2.2, 0.28) * 0.9 + reverb(sfx.stereo(), 1.2, 0.12)
    return master(mix)


# ─── Tala ─────────────────────────────────────────────────────────────────────
# Timeline (s): title 0.1 · writing 2.0–6.6 (word to 0.78, cross 0.78–0.86, swash
# after) · day → night 7.2–8.8 · feature chips from 10.2, one every 0.133 s · end 13.1.

def tala():
    music, sfx = Track(), Track()
    beat = 60 / 84
    day = [["C3", "E4", "G4", "B4"], ["A2", "C4", "E4", "G4"], ["F2", "A3", "C4", "E4"], ["G2", "B3", "D4", "E4"]]
    night = [["A2", "C4", "E4", "B4"], ["E2", "B3", "D4", "G4"], ["F2", "A3", "C4", "G4"], ["C3", "E4", "G4", "D5"]]
    bar = 2 * beat
    t = 0.0
    k = 0
    while t < DUR:
        chord = (day if t < 7.6 else night)[k % 4]
        for i, n in enumerate(chord):
            f = note(n) * (0.5 if t >= 7.6 and i == 0 else 1)
            music.add(keys(f, bar + 1.0, bright=0.7 if t < 7.6 else 0.45), t + i * 0.02, 0.2 if i else 0.28, pan=-0.2 + 0.13 * i)
        t += bar
        k += 1
    # a slow pad underneath, darker after dusk
    music.add(pad([note(n) for n in ("C3", "G3", "E4")], 7.8, cutoff=1500, attack=2.0), 0.0, 0.08)
    music.add(pad([note(n) for n in ("A2", "E3", "C4")], 7.6, cutoff=800, attack=1.2), 7.4, 0.1)
    # melody during the writing — pentatonic, unhurried
    mel = ["E5", "G5", "A5", "G5", "E5", "D5", "C5", "D5", "E5", "G5"]
    for i, n in enumerate(mel):
        music.add(keys(note(n), 1.2), 2.0 + i * beat / 2 * 1.3, 0.1, pan=0.25)
    # shaker keeps time softly
    t = 2.0
    while t < 12.9:
        music.add(shaker(), t, 0.05, pan=0.3)
        music.add(shaker(), t + beat / 2, 0.03, pan=-0.3)
        t += beat

    # intro shimmer
    sfx.add(whoosh(0.9, lo=800, hi=9000), 0.0, 0.2)
    for i, n in enumerate(("C6", "E6", "G6", "C7")):
        sfx.add(chime(note(n), 1.6), 0.12 + i * 0.12, 0.06, pan=-0.3 + 0.2 * i)
    # the pencil: the word, a lift, the crossbar, the swash
    sfx.add(pencil(3.4), 2.05, 0.5, pan=0.35)
    sfx.add(pencil(0.35, rate=6), 5.7, 0.45, pan=0.3)  # cross the t
    sfx.add(pencil(0.55, rate=4), 6.05, 0.45, pan=0.4)  # swash underline
    sfx.add(blip(2400, 0.02), 5.55, 0.08, pan=0.35)  # the pencil lifts
    # day to night: a descending sparkle, a low swell
    for i, n in enumerate(("G6", "E6", "D6", "C6", "A5", "G5", "E5")):
        sfx.add(chime(note(n), 1.8), 7.2 + i * 0.16, 0.08, pan=0.6 - 0.2 * i)
    sfx.add(whoosh(1.6, up=False, lo=150, hi=2500), 7.2, 0.35)
    sfx.add(thump(), 8.6, 0.25)
    # twinkles at night
    for i, (n, at) in enumerate((("E7", 8.9), ("B6", 9.4), ("G7", 9.8))):
        sfx.add(chime(note(n), 1.0), at, 0.04, pan=(-1) ** i * 0.6)
    # feature chips pop in
    scale = ["C5", "D5", "E5", "G5", "A5", "C6", "D6", "E6"]
    for i, n in enumerate(scale):
        sfx.add(pop(note(n)), 10.2 + i * 4 / 30, 0.28, pan=-0.5 + i * 0.14)
    # end card
    sfx.add(whoosh(0.8, up=False, lo=300, hi=6000), 12.9, 0.25)
    for n in ("A3", "C4", "E4", "B4", "E5"):
        sfx.add(keys(note(n), 2.2, bright=0.5), 13.1, 0.16)
    sfx.add(chime(note("E6"), 2.2), 13.15, 0.08)

    mix = reverb(music.stereo(), 2.6, 0.3) * 0.9 + reverb(sfx.stereo(), 1.5, 0.18)
    return master(mix)


def to_mp3(wav):
    """Encode with the ffmpeg Remotion ships, so no system ffmpeg is needed."""
    import os
    import subprocess

    ff = Path(__file__).resolve().parent.parent / "node_modules" / "@remotion" / "compositor-linux-x64-gnu"
    exe = ff / "ffmpeg" if (ff / "ffmpeg").exists() else "ffmpeg"
    env_ = {**os.environ, "LD_LIBRARY_PATH": str(ff)}
    mp3 = wav.with_suffix(".mp3")
    subprocess.run([str(exe), "-y", "-loglevel", "error", "-i", str(wav), "-c:a", "libmp3lame", "-b:a", "256k", str(mp3)], check=True, env=env_)
    wav.unlink()
    print("✓", mp3.relative_to(mp3.parents[2]))


if __name__ == "__main__":
    for name, make in (("parada", parada), ("tala", tala)):
        path = OUT / f"{name}.wav"
        write_wav(path, make())
        to_mp3(path)
