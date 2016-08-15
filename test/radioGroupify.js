'use strict';

var MARKUP = [
  '<h2>Boognish</h2>',
  '<div class="test">',
  '<div class="radio-item">1</div>',
  '<div class="radio-item">2</div>',
  '<div class="radio-item">3</div>',
  '</div>',
  '<div class="radio-item">Im an outsider not to be included in the group</div>'
].join('');

describe('radioGroupify', function () {
	var $test;
	var jQuery = window.jQuery;
	beforeEach(function () {
		var $fixture = jQuery('#fixture');
		$fixture
			.empty()
			.append(jQuery(MARKUP));

		$test = $fixture.find('.test');
	});

	after(function () {
		jQuery('#fixture').empty();
	});

	it('should chain', function () {
		assert($test.radioGroupify().addClass('foo'));
	});

  describe('keyboard', function () {
    it('should focus the NEXT radio in the group with a down arrow press', function () {
      standardCall();
      var $first = $test.find('.radio-item').first();
      $first.focus();
      var e = createEvent('keydown', 40);
      $first.trigger(e);
      assert.equal(document.activeElement, $first.next()[0]);
    });
    it('should focus the NEXT radio in the group with a right arrow press', function () {
      standardCall();
      var $first = $test.find('.radio-item').first();
      $first.focus();
      var e = createEvent('keydown', 39);
      $first.trigger(e);
      assert.equal(document.activeElement, $first.next()[0]);
    });

    it('should focus the PREVIOUS radio in the group with an up arrow press', function () {
      standardCall();
      var $first = $test.find('.radio-item').first();
      $first.next().click(); // "check" the 2nd radio
      var e = createEvent('keydown', 38);
      $first.next().trigger(e);
      assert.equal(document.activeElement, $first[0]);
    });
    it('should focus the PREVIOUS radio in the group with a left arrow press', function () {
      standardCall();
      var $first = $test.find('.radio-item').first();
      $first.next().click(); // "check" the 2nd radio
      var e = createEvent('keydown', 37);
      $first.next().trigger(e);
      assert.equal(document.activeElement, $first[0]);
    });
  });

  describe('mouse', function () {
    it('should select the radio that was clicked', function () {
      standardCall(); // first radio is "checked"
      var $third = $test.find('[role="radio"]').eq(2);
      $third.click();
      $test.find('[role="radio"]').each(function (i, radio) {
        var $radio = jQuery(radio);
        assert.equal($radio.attr('aria-checked'), (i === 2) ? 'true' : 'false');
        assert.equal($radio.attr('tabIndex'), (i === 2) ? '0' : '-1');
      });
    });
  });

  describe('attributes', function () {
    it('should properly set attributes initially', function () {
      standardCall(); // first radio is "checked"

      assert.equal($test.attr('role'), 'radiogroup');

      $test.find('[role="radio"]').each(function (i, radio) {
        var $radio = jQuery(radio);
        assert.equal($radio.attr('aria-checked'), (i === 0) ? 'true' : 'false');
        assert.equal($radio.attr('tabIndex'), (i === 0) ? '0' : '-1');
        assert.equal($radio.attr('role'), 'radio');
      });
    });
    it('should properly update attributes as new selections are made', function () {
      standardCall(); // first radio is "checked"
      var $third = $test.find('[role="radio"]').eq(2);
      $third.click();
      $test.find('[role="radio"]').each(function (i, radio) {
        var $radio = jQuery(radio);
        assert.equal($radio.attr('aria-checked'), (i === 2) ? 'true' : 'false');
        assert.equal($radio.attr('tabIndex'), (i === 2) ? '0' : '-1');
      });
    });
  });

  describe('options', function () {
    describe('options.radioSelector', function () {
      it('should default to ".radio-item"', function () {
        $test.radioGroupify();
        var $radios = $test.find('[role="radio"]');
        $radios.each(function (_, radio) {
          assert.equal(jQuery(radio).attr('role'), 'radio');
        });

        assert.equal($radios.length, 3);
      });
      it('should only find elements within the container', function () {
        $test.radioGroupify();
        var $radios = $test.find('[role="radio"]');
        $radios.each(function (_, radio) {
          assert.equal(jQuery(radio).attr('role'), 'radio');
        });

        var $outsider = jQuery('.radio-item').last();
        assert.notEqual($outsider.attr('role'), 'radio');
      });
    });

    describe('options.circular', function () {
      describe('true', function () {
        it('should traverse from last to first when right arrow or down arrow are pressed', function () {
          standardCall();
          var $last = $test.find('.radio-item').last();
          $last.click().focus();

          var e = createEvent('keydown', 39);
          $last.trigger(e);
          assert.equal(document.activeElement, $test.find('[role="radio"]')[0]);
        });
        it('should traverse from first to last when left arrow or down arrow are pressed', function () {
          standardCall();
          var $first = $test.find('.radio-item').first();
          $first.click().focus();
          var e = createEvent('keydown', 37);
          $first.trigger(e);
          assert.equal(document.activeElement, $test.find('[role="radio"]').last()[0]);
        });
      });

      describe('false', function () {
        it('should NOT move to the last (from first) when left arrow or up arrow are pressed', function () {
          $test.radioGroupify({
            defaultChecked: true,
            circular: false
          });

          var $first = $test.find('[role="radio"]').first();
          $first.focus();
          var e = createEvent('keydown', 37);
          $first.trigger(e);
          assert.equal(document.activeElement, $first[0]);
        });

        it('should NOT move to the first (from last) when right arrow or down arrow are pressed', function () {
          $test.radioGroupify({
            defaultChecked: true,
            circular: false
          });

          var $last = $test.find('[role="radio"]').last();
          $last.click().focus();
          var e = createEvent('keydown', 40);
          $last.trigger(e);
          assert.equal(document.activeElement, $last[0]);
        });
      });
    });

    describe('options.checkedClass', function () {
      it('should properly add the class to the checked element', function () {
        $test.radioGroupify({
          checkedClass: 'monkeys',
          defaultChecked: function () {
            return $test.find('.radio-item').first();
          }
        });

        assert.isTrue($test.find('[role="radio"]').first().is('.monkeys'));
      });
    });

    describe('options.label', function () {
      it('should accept a function that returns a label element and apply it with aria-labelledby', function () {
        $test.radioGroupify({
          label: function () {
            return jQuery('h2').first();
          }
        });

        assert.equal($test.attr('aria-labelledby'), jQuery('h2').prop('id'));
      });

      it('should not clobber existing aria-labelledby values', function () {
        $test
          .attr('aria-labelledby', 'foo')
          .radioGroupify({
            label: function () { return jQuery('h2').first(); }
          });

        assert.equal($test.attr('aria-labelledby'), 'foo ' + jQuery('h2').prop('id'));
      });

      it('should accept a string and apply it with aria-label', function () {
        $test.radioGroupify({
          label: 'monkeys'
        });

        assert.equal($test.attr('aria-label'), 'monkeys');
      });
    });

    describe('options.defaultChecked', function () {
      describe('true', function () {
        it('should initially "check" the first element in the collection', function () {
          standardCall();
          assert.equal($test.find('[role="radio"]').first().attr('aria-checked'), 'true');
        });
      });

      describe('false', function () {
        it('should not initially "check" ANY radio element in the group', function () {
          $test
            .radioGroupify()
            .find('[role="radio"]')
              .each(function (_, radio) {
                assert.equal(jQuery(radio).attr('aria-checked'), 'false');
              });
        });
      });

      describe('function', function () {
        it('should initially "check" the element returned by function', function () {
          $test.radioGroupify({
            defaultChecked: function ($items) {
              return $items.eq(1);
            }
          });

          var $second = $test.find('[role="radio"]').eq(1);
          assert.equal($second.attr('aria-checked'), 'true');
        });
      });
    });
  });
});

function standardCall() {
  jQuery('.test').radioGroupify({
    radioSelector: '.radio-item',
    checkedClass: '.radio-item-checked',
    defaultChecked: true
  });
}

function createEvent(type, which) {
	var e = jQuery.Event(type);
	if (which) { e.which = which; }
	return e;
}
