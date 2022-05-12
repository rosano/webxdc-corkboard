const kDefaultRoute = require('./ui-behaviour.js').OLSKControllerRoutes().shift();

describe('APRVitrine_Misc', function () {
	
	before(function() {
		return browser.OLSKVisit(kDefaultRoute);
	});

	it('sets lang', function() {
		browser.assert.attribute('html', 'lang', 'en');
	});

	it('sets title', function() {
		browser.assert.text('title', 'webxdc-corkboard');
	});

	it('sets encoding', function () {
		browser.assert.attribute('meta[http-equiv="Content-Type"]', 'content', 'text/html; charset=utf-8');
	});

	it('sets viewport', function () {
		browser.assert.attribute('meta[name="viewport"]', 'content', 'width=device-width');
	});

	describe('AppHeading', function test_AppHeading () {
		
		it('sets text', function () {
			browser.assert.text(AppHeading, 'webxdc-corkboard');
		});
		
	});

	describe('AppCreate', function test_AppCreate () {
		
		it('classes AppMessageForm', function () {
			browser.assert.hasClass(AppCreate, 'AppMessageForm');
		});
		
	});

	describe('AppCreateField', function test_AppCreateField () {
		
		it('sets type', function () {
			browser.assert.attribute(AppCreateField, 'type', 'text');
		});
		
		it('sets placeholder', function () {
			browser.assert.attribute(AppCreateField, 'placeholder', 'Message');
		});
		
		it('sets autofocus', function () {
			browser.assert.attribute(AppCreateField, 'autofocus', '');
		});

		it('classes AppMessageField', function () {
			browser.assert.hasClass(AppCreateField, 'AppMessageField');
		});
		
	});

	describe('AppCreateButton', function test_AppCreateButton () {
		
		it('sets type', function () {
			browser.assert.attribute(AppCreateButton, 'type', 'submit');
		});
		
		it('sets value', function () {
			browser.assert.attribute(AppCreateButton, 'value', 'Create');
		});

		it('classes AppMessageButton', function () {
			browser.assert.hasClass(AppCreateButton, 'AppMessageButton');
		});
		
	});

	describe('AppMessage', function test_AppMessage () {

		const item = Math.random().toString();
		
		before(function () {
			return browser.fill(AppCreateField, item);
		});
		
		before(function () {
			return browser.click(AppCreateButton);
		});
		
		it('sets text', function () {
			browser.assert.text(AppMessage, item);
		});

		context('click', function () {

			const item = Math.random().toString();

			before(function () {
				return browser.click(AppMessage);
			});
			
			before(function () {
				return browser.fill(AppMessageUpdateField, item);
			});
			
			before(function () {
				return browser.click(AppMessageUpdateButton);
			});

			it('sets text', function () {
				browser.assert.text(AppMessage, item);
			});
		
		});
		
	});

	context('edit', function () {
		
		let item;

		before(function () {
			item = browser.query(AppMessage).textContent;
		});
		
		before(function () {
			return browser.click(AppMessage);
		});
		
		describe('AppBoard', function test_AppBoard () {

			it('classes AppBoardEditing', function () {
				browser.assert.hasClass(AppBoard, 'AppBoardEditing');
			});
			
		});

		describe('AppMessageUpdateField', function test_AppMessageUpdateField () {
			
			it('sets type', function () {
				browser.assert.attribute(AppMessageUpdateField, 'type', 'text');
			});
			
			it('sets value', function () {
				browser.assert.attribute(AppMessageUpdateField, 'value', item);
			});
			
			it('sets autofocus', function () {
				browser.assert.attribute(AppMessageUpdateField, 'autofocus', '');
			});

			it('classes AppMessageField', function () {
				browser.assert.hasClass(AppMessageUpdateField, 'AppMessageField');
			});
			
		});

		describe('AppMessageUpdateButton', function test_AppMessageUpdateButton () {
			
			it('sets type', function () {
				browser.assert.attribute(AppMessageUpdateButton, 'type', 'submit');
			});
			
			it('sets value', function () {
				browser.assert.attribute(AppMessageUpdateButton, 'value', 'Update');
			});

			it('classes AppMessageButton', function () {
				browser.assert.hasClass(AppMessageUpdateButton, 'AppMessageButton');
			});
			
		});
	
	});

	describe('AppIdentity', function test_AppIdentity () {
		
		it('sets value', function () {
			browser.assert.text(AppIdentity, 'this is MainDevice');
		});

		context('peer', function () {
			
			before(function() {
				return browser.OLSKVisit(require('./ui-behaviour.js').OLSKControllerRoutes().pop());
			});

			it('sets value', function () {
				browser.assert.text(AppIdentity, 'this is PeerDevice');
			});
		
		});
		
	});

	after(function () {
		return browser.evaluate('window.clearXdcStorage()');
	});
	
});
