//Midi
document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault();
});
WebMidi.enable(function (err) {
  const lastNote = document.querySelector('.last-note');
  const lastNote2 = document.querySelector('.last2-note');
  const lastNote3 = document.querySelector('.last3-note');
  const notesInput = document.querySelector('.notes');
  const octaveInput = document.querySelector('.octave');
  const input = !WebMidi.inputs.length
    ? document.querySelector('.error').classList.remove('hidden') && null
    : WebMidi.inputs.length === 1 && WebMidi.getInputByName('Clavinova')
    ? WebMidi.getInputByName('Clavinova')
    : WebMidi.getInputByName(prompt(WebMidi.inputs.join(',')));
  if (!input) {
    return relaseWakeLock();
  }
  const noteArr = [];
  input.addListener('noteon', 1, e => {
    lastNote3.innerText = lastNote2.innerText;
    lastNote2.innerText = lastNote.innerText;
    lastNote.innerText = e.note.name;
    if (+octaveInput.value !== e.note.octave)
      return (octaveInput.placeholder = e.note.octave);
    noteArr.push(e.note.name.toLowerCase());
    const arrCompare = notesInput.value
      .replaceAll(' ', '')
      .toLowerCase()
      .split(',');
    if (
      noteArr.slice(-arrCompare.length).every((e, i) => e === arrCompare[i]) &&
      noteArr.length >= arrCompare.length
    )
      document.querySelector('.number').textContent++;
  });
  //Pedal
  input.addListener('controlchange', 1, function (e) {
    if (e.controller.name === 'sustenutopedal' && e.value === 127) {
      document.querySelector('.number').textContent = 0;
      noteArr.length = 0;
      return;
    }
    if (!(e.controller.name === 'softpedal' && e.value === 127)) return;
    document.querySelector('.number').textContent++;
  });
});

//Wakelock
// import WebMidi from 'webmidi';
let relaseWakeLock;
if ('wakeLock' in navigator) {
  // The wake lock sentinel.
  let wakeLock = null;

  // Function that attempts to request a screen wake lock.
  async function requestWakeLock() {
    try {
      wakeLock = await navigator.wakeLock.request();
      wakeLock.addEventListener('release', () => {
        console.log('Screen Wake Lock released:', wakeLock.released);
      });
      console.log('Screen Wake Lock released:', wakeLock.released);
    } catch (err) {
      console.error(`${err.name}, ${err.message}`);
    }
  }
  requestWakeLock();
  relaseWakeLock = function () {
    wakeLock.release();
    wakeLock = null;
  };
  document.addEventListener('visibilitychange', () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  });
}
