const mod = {

	OLSKControllerRoutes () {
		return [{
			OLSKRoutePath: '/#name=MainDevice&addr=MainDevice@local.host',
			OLSKRouteMethod: 'get',
			OLSKRouteSignature: 'AppMainRoute',
			OLSKRouteFunction (req, res, next) {
				return res.render(require('path').join(__dirname, 'index.html'));
			},
		}, {
			OLSKRoutePath: '/#name=PeerDevice&addr=PeerDevice@local.host',
			OLSKRouteMethod: 'get',
			OLSKRouteSignature: 'AppPeerRoute',
			OLSKRouteFunction (req, res, next) {
				return res.render(require('path').join(__dirname, 'index.html'));
			},
		}];
	},

	AppPayloadIsUpdated (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('ErrorInputNotValid');
		}

		return inputData.updated === true;
	},

	AppPayloadIsDeleted (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('ErrorInputNotValid');
		}

		return inputData.msg === '';
	},

	// DATA

	DataPayload (msg, options) {
		return Object.assign({
			guid: Date.now().toString(36),
			author: window.webxdc.selfName,
			address: window.webxdc.selfAddr,
	  }, options, {
	  	msg,
	  });
	},

	// INTERFACE

	InterfaceCreateButtonDidClick () {
		mod.ControlCreate(window.prompt());
	},

	InterfaceAdd (inputData) {
		const element = document.createElement('button');
		element.classList.add('AppMessage');
		element.id = inputData.guid;
		window.AppItems.appendChild(element);
		
		mod._InterfacePopulate(element, inputData);
	},

	InterfaceUpdate (inputData) {
		mod._InterfacePopulate(window[inputData.guid], inputData);
	},

	_InterfacePopulate (element, payload) {
		element.innerHTML = payload.msg;
		element.onclick = function () {
			const response = window.prompt('Edit to rename, clear to delete', payload.msg);

			if (!response.trim().length) {
				return mod.ControlDelete(payload);
			}

			mod.ControlUpdate(response, payload);
		};

		window.AppItems.insertBefore(element, window.AppItems.firstChild);
	},

	InterfaceDelete (inputData) {
		window[inputData.guid].remove();
	},

	// CONTROL

	ControlCreate (inputData) {
		if (!inputData.trim().length) {
			return;
		}

		mod._ControlJournal(mod.DataPayload(inputData));
	},

	ControlUpdate (msg, options) {
		mod._ControlJournal(mod.DataPayload(msg, Object.assign(options, {
			updated: true,
		})));
	},

	ControlDelete (inputData) {
		mod._ControlJournal(mod.DataPayload('', inputData));
	},

	_ControlJournal (payload) {
		info = window.webxdc.selfName + ' updated the board';
		window.webxdc.sendUpdate({
	    payload,
	    info,
		}, info);
	},

	// MESSAGE

	MessageDidArrive (inputData) {
		(function(payload) {
			if (mod.AppPayloadIsDeleted(payload)) {
				return mod.InterfaceDelete(payload);
			}

			if (mod.AppPayloadIsUpdated(payload)) {
				return mod.InterfaceUpdate(payload);
			}

			return mod.InterfaceAdd(payload);
		})(inputData.payload);
	},

	// SETUP

	_SetupMethods () {
		return Object.keys(mod).filter(function (e) {
			return e.match(/^Setup/);
		});
	},

	SetupListener () {
		window.webxdc.setUpdateListener(mod.MessageDidArrive);
	},

	SetupIdentity() {
		window.AppIdentity.innerHTML = 'this is ' + window.webxdc.selfName;
	},

	// LIFECYCLE

	LifecyclePageDidLoad () {
		return mod._SetupMethods().forEach(function (e) {
			return mod[e]();
		});
	},
};

if (typeof module !== 'undefined') {
	module.exports = mod;
}

AppBehaviour = mod;
