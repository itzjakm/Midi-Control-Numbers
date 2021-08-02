//Midi
document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault();
});
//Wakelock
// import WebMidi from 'webmidi';
let relaseWakeLock;
if ('wakeLock' in navigator) {
  // The wake lock sentinel.
  let wakeLock = null;

  // Function that attempts to request a screen wake lock.
  // eslint-disable-next-line no-inner-declarations
  async function requestWakeLock() {
    try {
      wakeLock = await navigator.wakeLock.request();
      wakeLock.addEventListener('release', () => {
        // eslint-disable-next-line no-console
        console.log('Screen Wake Lock released:', wakeLock.released);
      });
      // eslint-disable-next-line no-console
      console.log('Screen Wake Lock released:', wakeLock.released);
    } catch (err) {
      // eslint-disable-next-line no-console
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

/*global WebMidi*/
WebMidi.enable(err => {
  const lastNote = document.querySelector('.last-note');
  const lastNote2 = document.querySelector('.last2-note');
  const lastNote3 = document.querySelector('.last3-note');
  const notesInput = document.querySelector('.notes');
  const octaveInput = document.querySelector('.octave');
  const input = !WebMidi.inputs.length
    ? document.querySelector('.error').classList.remove('hidden') && null
    : WebMidi.inputs.length === 1 && WebMidi.getInputByName('Clavinova')
    ? WebMidi.getInputByName('Clavinova')
    // eslint-disable-next-line no-alert
    : WebMidi.getInputByName(prompt(WebMidi.inputs.join(',')));
  if (!input) {
    return relaseWakeLock();
  }
  const noteArr = [];
  input.addListener('noteon', 1, e => {
    lastNote3.innerText = lastNote2.innerText;
    lastNote2.innerText = lastNote.innerText;
    lastNote.innerText = e.note.name;
    if (+octaveInput.value !== e.note.octave) {
      octaveInput.placeholder = e.note.octave;
      return e.note.octave;
    }
    noteArr.push(e.note.name.toLowerCase());
    const arrCompare = notesInput.value
      .replaceAll(' ', '')
      .toLowerCase()
      .split(',');
    if (
      noteArr.slice(-arrCompare.length).every((el, i) => el === arrCompare[i]) &&
      noteArr.length >= arrCompare.length
    )
      document.querySelector('.number').textContent += 1;
  });
  //Pedal
  input.addListener('controlchange', 1, e => {
    if (e.controller.name === 'sustenutopedal' && e.value === 127) {
      document.querySelector('.number').textContent = 0;
      noteArr.length = 0;
      return;
    }
    if (!(e.controller.name === 'softpedal' && e.value === 127)) return;
    document.querySelector('.number').textContent += 1;
  });
  document.querySelector('.presets').addEventListener('click', e => {
    if (e.target.type !== 'radio') return;
    notesInput.value = e.target.value;
  });
});
