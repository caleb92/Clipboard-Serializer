var inputEl,
	outputEl,
	inputType,
	outputType,
	serializeButton,
	messageEl;

var raw;

window.onload = function() {
	cacheDOM();
}

function cacheDOM() {
	inputEl = document.getElementById('input');
	outputEl = document.getElementById('output');

	var inputTypeEls = [].slice.call(document.getElementById('delimiters-form').getElementsByTagName('input'));
	var outputTypeEls = [].slice.call(document.getElementById('output-form').getElementsByTagName('input'));
	var inputTypeEl = inputTypeEls.filter(function(el) {
		return el.checked;
	})[0];
	var outputTypeEl = outputTypeEls.filter(function(el) {
		return el.checked;
	})[0];
	inputType = inputTypeEl.value;
	outputType = outputTypeEl.value;

	serializeButton = document.getElementById('serialize');
	messageEl = document.getElementById('message');

	inputEl.addEventListener('click',function(e){e.target.select();})
	inputEl.addEventListener('input',serialize);
	inputTypeEls.forEach(function(el) {
		el.addEventListener('click', function() {
			if (inputType != el.value) {
				inputType = el.value;
			}
		})
	})
	outputTypeEls.forEach(function(el) {
		el.addEventListener('click', function() {
			if (outputType != el.value) {
				outputType = el.value;
			}
		})
	})
	serializeButton.addEventListener('click', serialize);
}

function serialize() {
	var input = inputEl.value,
		output,
		rowDelimiter,
		colDelimiter,
		rows,
		data;

	rowDelimiter = "\n";
	colDelimiter = "\t";

	rows = input.split(rowDelimiter);
	data = rows.map(function(row) {
		return row.split(colDelimiter);
	});

	switch (outputType) {
		case "js-array-objects":
			var colHeads = data.slice(0,1)[0];
			var raw = [];
			data.slice(1).forEach(function(row) {
				var rowHead = row.slice(0,1)[0];
				row.slice(1).forEach(function(cell,i) {
					raw.push({
						rh: rowHead,
						ch: colHeads[i+1],
						d: cell
					});
				});
			});
			output = JSON.stringify(raw);
			break;
		case "js-array-2d":
			output = JSON.stringify(data);
			break;
		case "js-array-1d":
			var raw = JSON.stringify(data);
			output = '[' + raw.replace(/\[/g,'').replace(/\]/g,'') + ']';
			break;
		case "csv":
			raw = JSON.stringify(data);
			output = raw.replace(/\[/g,'').replace(/\]/g,'');
			break;
		default:
			console.warn('main.js serialize() unknown outputType!');
	}
	outputEl.value = output;
	// copyToClipboard();
}

function copyToClipboard() {
  output.select();

  try {
    var successful = document.execCommand('copy');
    if (successful) {
      console.log('Copying text command was successful');
    } else {
      console.log('Copying text command was unsuccessful');
      alert('Copying text command was unsuccessful. This may not be supported by your browser )-:');
    }
  } catch (err) {
    console.log('Oops, unable to copy');
    alert('Copying text command was unsuccessful. This may not be supported by your browser )-:');
  }
  flashMessage();
}

function flashMessage() {
	// messageEl.style.display = 'initial';
	// messageEl.classList.remove('hidden');
	messageEl.classList.add('show');
	setTimeout(function(){
		messageEl.classList.remove('show');
	}, 800);
}