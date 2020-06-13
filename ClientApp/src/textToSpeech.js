export function speak(text, onStart, onEnd) {
  const utterance = new SpeechSynthesisUtterance();
  // const voices = window.speechSynthesis.getVoices();
  // utterance.voice = voices[10];
  // utterance.voiceURI = "native";
  // utterance.pitch = 0.5;
  utterance.volume = 0.5;
  utterance.lang = 'en-US';
  utterance.rate = 1;
  utterance.text = text;
  utterance.onstart = onStart;
  utterance.onend = onEnd;

  speechSynthesis.speak(utterance);
}