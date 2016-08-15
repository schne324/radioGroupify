'use strict';

var MARKUP = [
  '<h2 id="test-heading">Boognish</h2>',
  '<div class="test">',
  '<div class="radio-item">1</div>',
  '<div class="radio-item">2</div>',
  '<div class="radio-item">3</div>',
  '</div>'
].join('');

describe('radioGroupify', function () {
	var $test;
	var jQuery = window.jQuery;
	beforeEach(function () {
		var $fixture = jQuery('#fixture');
		$fixture
			.empty()
			.append(jQuery('<div class="test"><div class="radio-item"></div></div>'));

		$test = $fixture.find('.test');
	});

	after(function () {
		jQuery('#fixture').empty();
	});

	it('should chain', function () {
		assert($test.radioGroupify().addClass('foo'));
	});
});
