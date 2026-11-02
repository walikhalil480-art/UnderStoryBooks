Add-Type -AssemblyName System.Speech

$baseDir = "E:\Ebook\public\audio\somali"
$letterDir = Join-Path $baseDir "letters"
$numberDir = Join-Path $baseDir "numbers"
$phraseDir = Join-Path $baseDir "phrases"
$wordDir = Join-Path $baseDir "words"

# Ensure directories exist
New-Item -ItemType Directory -Force -Path $letterDir | Out-Null
New-Item -ItemType Directory -Force -Path $numberDir | Out-Null
New-Item -ItemType Directory -Force -Path $phraseDir | Out-Null
New-Item -ItemType Directory -Force -Path $wordDir | Out-Null

$items = @(
    # Consonants
    @{ Path = (Join-Path $letterDir "b.wav"); Text = "Bah. Boog." },
    @{ Path = (Join-Path $letterDir "t.wav"); Text = "Tah. Tahl-laah-boh." },
    @{ Path = (Join-Path $letterDir "j.wav"); Text = "Jah. Jid." },
    @{ Path = (Join-Path $letterDir "x.wav"); Text = "Hah. Hid-dig." },
    @{ Path = (Join-Path $letterDir "kh.wav"); Text = "Khah. Khah-feef." },
    @{ Path = (Join-Path $letterDir "d.wav"); Text = "Dah. Deel." },
    @{ Path = (Join-Path $letterDir "r.wav"); Text = "Rah. Rohb." },
    @{ Path = (Join-Path $letterDir "s.wav"); Text = "Sah. Saah-heeb." },
    @{ Path = (Join-Path $letterDir "sh.wav"); Text = "Shah. Shim-bir." },
    @{ Path = (Join-Path $letterDir "dh.wav"); Text = "Dhah. Dool." },
    @{ Path = (Join-Path $letterDir "c.wav"); Text = "Ah. Ah-aano." },
    @{ Path = (Join-Path $letterDir "g.wav"); Text = "Gah. Gayl." },
    @{ Path = (Join-Path $letterDir "f.wav"); Text = "Fah. Fah-rahs." },
    @{ Path = (Join-Path $letterDir "q.wav"); Text = "Kah. Kah-lin." },
    @{ Path = (Join-Path $letterDir "k.wav"); Text = "Kah. Kahl-loon." },
    @{ Path = (Join-Path $letterDir "l.wav"); Text = "Lah. Lee-baah." },
    @{ Path = (Join-Path $letterDir "m.wav"); Text = "Mah. Mah-gaah-loh." },
    @{ Path = (Join-Path $letterDir "n.wav"); Text = "Nah. Nah-bahd." },
    @{ Path = (Join-Path $letterDir "w.wav"); Text = "Wah. Wahd-doh." },
    @{ Path = (Join-Path $letterDir "h.wav"); Text = "Hah. Hoh-yoh." },
    @{ Path = (Join-Path $letterDir "y.wav"); Text = "Yah. Yahr-yahr." },

    # Short Vowels
    @{ Path = (Join-Path $letterDir "a.wav"); Text = "Ah. Ahr-day." },
    @{ Path = (Join-Path $letterDir "e.wav"); Text = "Eh. Eh-ray." },
    @{ Path = (Join-Path $letterDir "i.wav"); Text = "Ee. Eef-teen-kah." },
    @{ Path = (Join-Path $letterDir "o.wav"); Text = "Oh. Oh-rod." },
    @{ Path = (Join-Path $letterDir "u.wav"); Text = "Oo. Oo-bah." },

    # Long Vowels
    @{ Path = (Join-Path $letterDir "aa.wav"); Text = "Aah. Aah-beh." },
    @{ Path = (Join-Path $letterDir "ee.wav"); Text = "Aay. Ay-gid." },
    @{ Path = (Join-Path $letterDir "ii.wav"); Text = "Eee. Eed." },
    @{ Path = (Join-Path $letterDir "oo.wav"); Text = "Ooh. Ohn." },
    @{ Path = (Join-Path $letterDir "uu.wav"); Text = "Ooo. Oor." },

    # Numbers 1-10
    @{ Path = (Join-Path $numberDir "p-11.wav"); Text = "Kow." },
    @{ Path = (Join-Path $numberDir "p-12.wav"); Text = "Lah-bah." },
    @{ Path = (Join-Path $numberDir "p-13.wav"); Text = "Sahd-deh." },
    @{ Path = (Join-Path $numberDir "p-14.wav"); Text = "Ah-far." },
    @{ Path = (Join-Path $numberDir "p-15.wav"); Text = "Shahn." },
    @{ Path = (Join-Path $numberDir "p-16.wav"); Text = "Lih." },
    @{ Path = (Join-Path $numberDir "p-17.wav"); Text = "Tohd-doh-bah." },
    @{ Path = (Join-Path $numberDir "p-18.wav"); Text = "See-dayd." },
    @{ Path = (Join-Path $numberDir "p-19.wav"); Text = "Sah-gaal." },
    @{ Path = (Join-Path $numberDir "p-20.wav"); Text = "Toh-bahn." },

    # Common Phrases
    @{ Path = (Join-Path $phraseDir "p-1.wav"); Text = "Soo-bah wah-naag-san." },
    @{ Path = (Join-Path $phraseDir "p-2.wav"); Text = "Gah-lahb wah-naag-san." },
    @{ Path = (Join-Path $phraseDir "p-3.wav"); Text = "Hah-bayn wah-naag-san." },
    @{ Path = (Join-Path $phraseDir "p-4.wav"); Text = "Ees-kah wahr-rahn?" },
    @{ Path = (Join-Path $phraseDir "p-5.wav"); Text = "Waan fee-cahn-ah-hay, mah-had-sah-nid." },
    @{ Path = (Join-Path $phraseDir "p-6.wav"); Text = "Fahd-lahn." },
    @{ Path = (Join-Path $phraseDir "p-7.wav"); Text = "Mah-had-sah-nid." },
    @{ Path = (Join-Path $phraseDir "p-8.wav"); Text = "Ah-daa moo-dahn." },
    @{ Path = (Join-Path $phraseDir "p-9.wav"); Text = "Ee ah-fee." },
    @{ Path = (Join-Path $phraseDir "p-10.wav"); Text = "Nah-bahd gehl-yoh." },

    # Common Story Words
    @{ Path = (Join-Path $wordDir "buug.wav"); Text = "Boog." },
    @{ Path = (Join-Path $wordDir "geel.wav"); Text = "Gayl." },
    @{ Path = (Join-Path $wordDir "qalin.wav"); Text = "Kah-lin." },
    @{ Path = (Join-Path $wordDir "roob.wav"); Text = "Rohb." },
    @{ Path = (Join-Path $wordDir "dhiil.wav"); Text = "Deel." },
    @{ Path = (Join-Path $wordDir "hooyo.wav"); Text = "Hoh-yoh." },
    @{ Path = (Join-Path $wordDir "shimbir.wav"); Text = "Shim-bir." },
    @{ Path = (Join-Path $wordDir "faras.wav"); Text = "Fah-rahs." },
    @{ Path = (Join-Path $wordDir "aabe.wav"); Text = "Aah-beh." },
    @{ Path = (Join-Path $wordDir "caano.wav"); Text = "Ah-aano." },
    @{ Path = (Join-Path $wordDir "libaax.wav"); Text = "Lee-baah." },
    @{ Path = (Join-Path $wordDir "kalluun.wav"); Text = "Kahl-loon." }
)

Write-Host "Synthesizing" $items.Count "Somali audio assets..."
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = -1 # Clear, deliberate speaking rate for children

foreach ($item in $items) {
    $synth.SetOutputToWaveFile($item.Path)
    $synth.Speak($item.Text)
}

$synth.Dispose()
Write-Host "DONE: Successfully generated all Somali audio assets in $baseDir"
