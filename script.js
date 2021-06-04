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
