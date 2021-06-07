//Wakelock
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

  document.addEventListener('visibilitychange', () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
      requestWakeLock();
    }
  });
}
WebMidi.enable(function (err) {
  const lastNote = document.querySelector('.last-note');
  const lastNote2 = document.querySelector('.last2-note');
  const lastNote3 = document.querySelector('.last3-note');
  // const output = WebMidi.getOutputByName('Clavinova');
  const input = WebMidi.getInputByName('Clavinova');
  if (!input) return;
  input.addListener('controlchange', 1, function (e) {
    if (!(e.controller.name === 'sustenutopedal' && e.value === 127)) return;
    document.querySelector('.number').textContent++;
  });
  input.addListener('noteon', 1, e => {
    lastNote3.innerText = lastNote2.innerText;
    lastNote2.innerText = lastNote.innerText;
    lastNote.innerText = e.note.name;
  });
  /*   input.addListener('noteon', 'all', function (e) {
   
    if (e.note.number === 36) document.querySelector('.number').textContent++;
  }); */
});
