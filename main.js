window.onload(function() {
  console.log('page loaded');
  var serializeButton = document.getElementById('serialize');
  serializeButton.addEventListener('click',function() {
    console.log('hi there sexy');
    var inputEl = document.getElementById('input');
    var outputEl = document.getElementById('output');
    outputEl.value = JSON.stringify(inputEl.value);
  });
})
