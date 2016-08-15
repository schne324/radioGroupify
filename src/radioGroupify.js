(function (jQuery) {
	'use strict';

	jQuery.fn.radioGroupify = function (userOptions) {
    userOptions = userOptions || {};

		return this.each(function () {
			radioGroupify(this, jQuery.extend({
        radioSelector: '.radio-item',
        circular: true,
        checkedClass: null,
        label: null,
        defaultChecked: false
      }, userOptions));
		});
	};

	function radioGroupify(el, options) {
		var $container = jQuery(el);
    var $items = $container.find(options.radioSelector);

    // add initial roles/attributes
    attrHandler($container, $items, options);

    // event handlers
    attachEvents($container, $items, options);
	}

  function attrHandler($container, $items, options) {
    $container.attr('role', 'radiogroup');

    $items.attr({
      'role': 'radio',
      'aria-checked': 'false',
      'tabIndex': -1
    });

    // initially selected
    var initSel = options.defaultChecked;
    if (initSel) {
      var $selectedElement = 'function' === typeof initSel ? initSel($items) : $items.eq(0);

      if ($selectedElement) {
        selectHandler($items, $selectedElement, options);
      }
    } else {
      $items.eq(0).attr('tabIndex', 0); // if no initiallySelected option provided (or falsey)
    }

    // label
    if (options.label) {
      if ('string' === typeof options.label) {
        $container.attr('aria-label', options.label);
      } else if ('function' === typeof options.label) {
        var $label = jQuery(options.label($container, $items));
        // associate the group with the labelling element via aria-labelledby
        tokenHandler($container, $label);
      }
    }
  }

  function attachEvents($container, $items, options) {
    $container
      .off('click.radioGroupify')
      .off('keydown.radioGroupify')
      .on('click.radioGroupify', '[role="radio"]', function () {
        var $radio = jQuery(this);
        selectHandler($items, $radio, options);
      })
      .on('keydown.radioGroupify', '[role="radio"]', function (e) {
        var which = e.which;
        var $target = jQuery(e.target);
        var currentIndex = $target.index($items);

        switch (which) {
          case 32:
            e.preventDefault();
            $target.click();
            break;
          case 37:
          case 38:
            e.preventDefault();
            arrowHandler($target, $items, 'prev');
            break;
          case 39:
          case 40:
            e.preventDefault();
            arrowHandler($target, $items, 'next');
            break;
        }
      });

    function arrowHandler($target, $radios, direction) {
      var isNext = direction === 'next';
      var currentIndex = jQuery.inArray($target[0], $radios);
      var adjacentIndex = isNext ? currentIndex+ 1 : currentIndex - 1;
      var adjacentRadio = $radios[adjacentIndex];

      // first or last (circularity)
      if (!adjacentRadio && options.circular) {
        adjacentRadio = isNext ? $radios[0] : $radios[$radios.length - 1];
      }

      selectHandler($radios, jQuery(adjacentRadio).focus(), options);
    }
  }


  function selectHandler($radios, $newlySelected, options) {
    $radios
      .each(function (_, radio) {
        var $radio = jQuery(radio);
        var isNewlySelected = radio === $newlySelected[0];
        $radio
          .prop('tabIndex', isNewlySelected ? 0 : -1)
          .attr('aria-checked', isNewlySelected)
          .removeClass(options.checkedClass || '');

        if (isNewlySelected) {
          $newlySelected.addClass(options.checkedClass || '');
        }
      });
  }

  function tokenHandler($element, $attrElement, attr) {
    attr = attr || 'aria-labelledby';

    var existingVal = $element.attr(attr) || '';
		$attrElement.prop('id', $attrElement.prop('id') || rndid());
    $element.attr(attr, [existingVal, $attrElement.prop('id')].join(' ').trim());
  }

  /**
	 * https://github.com/stephenmathieson/rndid
	 * Return a guaranteed unique id of the provided
	 * `length`, optionally prefixed with `prefix`.
	 *
	 * If no length is provided, will use
	 * `rndid.defaultLength`.
	 *
	 * @api private
	 * @param {String} [prefix]
	 * @param {Number} [length]
	 * @return {String}
	 */

	function rndid() {
		var id = str(7);
		if (document.getElementById(id)) { return rndid(); }
		return id;
	}

	/**
	 * Generate a random alpha-char.
	 *
	 * @api private
	 * @return {String}
	 */

	function character() {
		return String.fromCharCode(Math.floor(Math.random() * 25) + 97);
	}

	/**
	 * Generate a random alpha-string of `len` characters.
	 *
	 * @api private
	 * @param {Number} len
	 * @return {String}
	 */

	function str(len) {
		for (var i = 0, s = ''; i < len; i++) { s += character(); }
		return s;
	}
}(jQuery));
