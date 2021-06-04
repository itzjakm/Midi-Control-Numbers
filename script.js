WebMidi.enable(function (err) {
  const output = WebMidi.getOutputByName('Clavinova');
  const input = WebMidi.getInputByName('Clavinova');
  input.addListener('controlchange', 1, function (e) {
    if (!(e.controller.name === 'sustenutopedal' && e.value === 127)) return;
    document.querySelector('.number').textContent++;
    output.playNote('C3', 'all', { duration: 100 });
  });

  /*   input.addListener('noteon', 'all', function (e) {
   
    if (e.note.number === 36) document.querySelector('.number').textContent++;
  }); */
});
