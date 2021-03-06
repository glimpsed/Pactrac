Pactrac.browser.view = {};

Pactrac.browser.view._list = function (parcels, id, klass) {
	var ol = document.createElement('ol');
	ol.className = klass;
	ol.setAttribute('id', id);

	if (Pactrac.browser.index().length == 0 && klass == 'read') {
		var alert = document.createElement('li');
		alert.innerHTML = "<h3>You haven't saved any tracking numbers!</h3>";
		ol.appendChild(alert);
	}	

	for (i = 0; i < parcels.length; i++) {
		var parcel = parcels[i];
				
		if (parcel.description != '' || (parcel.description == '' && !Pactrac.helpers.parcel.isInIndex(parcel))) {
			var li = Pactrac.browser.view._parcel(parcel);
			ol.appendChild(li);
		}
	}
		
	return ol;
}
Pactrac.browser.view._parcel = function (parcel) {
	var li = document.createElement('li');
	li.setAttribute('id', parcel.number);
	
	li.appendChild(Pactrac.browser.view._action('+', 'create', 'Pactrac.browser.create(Pactrac.helpers.parcel.parseNode(this.parentNode));'));
	li.appendChild(Pactrac.browser.view._action('-', 'destroy', 'Pactrac.browser.destroy("' + parcel.number + '");'));
	
	var host = document.createElement('h4');
	host.setAttribute('id', parcel.number+'_host');
	host.innerHTML = parcel.host;
	li.appendChild(host);
	
	li.appendChild(Pactrac.browser.view._description(parcel));
	
	var carrier = document.createElement('p');
	carrier.innerHTML = parcel.number + ' ';
	carrier.appendChild(Pactrac.browser.view._carrier(parcel));
	li.appendChild(carrier);
	
	return li
}
Pactrac.browser.view._action = function (text, klass, verb) {
	var a = document.createElement('a');
	a.className = 'action ' + klass;
	a.setAttribute('onclick', verb);
	a.innerHTML = text;
	
	return a;
}
Pactrac.browser.view._description = function (parcel) {
	var input = document.createElement('input');
	input.setAttribute('type', 'text');
	input.setAttribute('id', parcel.number + '_description');
	input.setAttribute('value', (parcel.description == '' ? 'Enter item description...' : parcel.description ));
	input.setAttribute('onkeyup', 'Pactrac.browser.update(Pactrac.helpers.parcel.parseNode(this.parentNode.parentNode));');
	
	var description = document.createElement('h3');
	description.appendChild(input);
	return description;
}
Pactrac.browser.view._carrier = function (parcel) {
	var span = document.createElement("span");
	span.className = "carrier";
	
	var a = document.createElement("a");	
	span.appendChild(a);
	
	var patterns = {};
	patterns.ups = /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/gi;
	patterns.fedex = /\b(\d\d\d\d ?\d\d\d\d ?\d\d\d\d)\b/ig;
	patterns.usps = /\b(91\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d|91\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d)\b/gi;

	var linkAttributes = null;
	if (parcel.number.match(patterns.ups)) {
		linkAttributes = { klass: 'ups', copy: 'UPS', url: 'http://wwwapps.ups.com/WebTracking/track?track.y=10&trackNums=' };
	} else if (parcel.number.match(patterns.fedex)) {
		linkAttributes = { klass: 'fedex', copy: 'FedEx', url: 'http://www.fedex.com/Tracking?action=track&tracknumbers=' };
	} else if (parcel.number.match(patterns.usps)) {
		linkAttributes = { klass: 'usps', copy: 'USPS', url: 'http://trkcnfrm1.smi.usps.com/PTSInternetWeb/InterLabelInquiry.do?strOrigTrackNum=' };
	}
	
	a.className = linkAttributes.klass;
	a.innerHTML = linkAttributes.copy;
	a.setAttribute('href', linkAttributes.url + parcel.number);
	a.setAttribute('onclick', "chrome.tabs.create({ url: this.getAttribute('href') }); window.close();");
	
	return span;
}

