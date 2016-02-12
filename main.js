var inputEl,
	outputEl,
	rowDelimiter,
	colDelimiter,
	outputType,
	format,
	copyButton,
	messageEl;

var raw;

window.onload = function() {
	cacheDOM();
}

function cacheDOM() {
	inputEl = document.getElementById('input');
	inputEl.addEventListener('click',function(){this.select();})
	inputEl.addEventListener('input',serialize);
	inputEl.addEventListener('keydown',delegateTab);

	outputEl = document.getElementById('output');

	var rowDelimiterEl = document.getElementById('row-delimiter');
	rowDelimiterEl.addEventListener('change',function(){rowDelimiter = this.selectedOptions[0].value;serialize();})
	rowDelimiter = rowDelimiterEl.selectedOptions[0].value;
	var colDelimiterEl = document.getElementById('col-delimiter');
	colDelimiterEl.addEventListener('change',function(){colDelimiter = this.selectedOptions[0].value;serialize();})
	colDelimiter = colDelimiterEl.selectedOptions[0].value;

	var outputTypeEls = [].slice.call(document.getElementById('output-form').getElementsByTagName('input'));
	outputTypeEls.forEach(function(el) {
		el.addEventListener('click', function() {
			if (outputType != el.value) {
				outputType = el.value;
				serialize();
			}
		})
	})
	outputType = outputTypeEls.filter( (el)=>el.checked )[0].value;

	var formatEls = [].slice.call(document.getElementById('format-form').getElementsByTagName('input'));
	formatEls.forEach(function(el) {
		el.addEventListener('click', function() {
			if (format != el.value) {
				format = el.value;
				serialize();
			}
		})
	})
	format = formatEls.filter( (el)=>el.checked )[0].value;

	copyButton = document.getElementById('copy');
	copyButton.addEventListener('click', copyToClipboard);
	messageEl = document.getElementById('message');
}

function serialize() {
	var input = inputEl.value,
		output,
		rows,
		data,
		formatFunc = 
			format === 'none' ? formatNone : 
			format === 'strings' ? formatString :
			format === 'numbers' ? formatNumber : formatBoth;

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
						d: formatFunc(cell)
					});
				});
			});
			output = JSON.stringify(raw);
			break;
		case "js-array-2d":
			data.forEach( (row)=>row.forEach( (e,i,a)=>(a[i]=formatFunc(e)) ) );
			output = JSON.stringify(data);
			break;
		case "js-array-1d":
			data.forEach( (row)=>row.forEach( (e,i,a)=>(a[i]=formatFunc(e)) ) );
			data = JSON.stringify(data);
			output = '[' + data.replace(/\[/g,'').replace(/\]/g,'') + ']';
			break;
		case "csv":
			data.forEach( (row)=>row.forEach( (e,i,a)=>(a[i]=formatFunc(e)) ) );
			data = JSON.stringify(data);
			output = data.replace(/\[/g,'').replace(/\]/g,'');
			break;
		default:
			console.warn('main.js serialize() unknown outputType!');
	}
	if (format === 'none') output = output.replace(/'/g,'');
	outputEl.value = output;
}

function formatNone(s) {
	return s;
}
function formatString(s) {
	return s;
}
function formatNumber(s) {
	return Number(s);
}
function formatBoth(s) {
	var n = Number(s);
	return isNaN(n) ? s : n;
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
	messageEl.classList.add('show');
	setTimeout(function(){
		messageEl.classList.remove('show');
	}, 800);
}

function delegateTab(e) {
	var keyCode = e.keyCode || e.which;
	if (e.keyCode === 9) {
		e.preventDefault();
	    var val = this.value,
	        start = this.selectionStart,
	        end = this.selectionEnd;

	    this.value = val.substring(0, start) + '\t' + val.substring(end);
	    this.selectionStart = this.selectionEnd = start + 1;
	    return false;
	}
}