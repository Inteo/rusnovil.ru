$(document).ready(function() {
  $(".header__search-toggle").click(function(){
    $(".header__search").addClass("active");
    return false;
  });
  $(".header__search-form .close").click(function(){
    $(".header__search").removeClass("active");
    return false;
  });
  $(".switcher__btn").click(function(){
    $(this).closest(".switcher__control").find(".switcher__btn").removeClass("active");
    $(this).addClass("active");
    var holder = $(this).closest(".switcher").find(".switcher__holder");
    holder.removeClass("active");
    holder.filter('[data-switch-hold='+$(this).data("switch-btn")+']').addClass("active");
    return false;
  });
  $(".goods-marking__control li span").mouseover(function(){
      var holder = $(this).closest(".goods-marking").find(".goods-marking__description li");
      holder.filter('[data-mark-target='+$(this).data("mark-btn")+']').addClass("active");
    }).mouseout(function(){
      $(this).closest(".goods-marking").find(".goods-marking__description li").removeClass("active");
  });
  var maxHeight = Math.max.apply(null, $(".more-goods ul li").map(function ()
  {
    return $(this).height();
  }).get());
  $(".more-goods ul").height(maxHeight);
});

; /* Start:"a:4:{s:4:"full";s:66:"/bitrix/templates/inteo_corporation/f/js/common.js?149794961628557";s:6:"source";s:50:"/bitrix/templates/inteo_corporation/f/js/common.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
( function( $, undefined ) {

  var defaultTemplates = {
    menu: '<li class="%1$s">' +
    '<a href="%2$s">%3$s</a>' +
    '%4$s' +
    '</li>',
    child_wrap: '<ul>%s</ul>',
    child: '<li class="%1$s" id="%5$s">' +
    '<a href="%2$s">%3$s</a>' +
    '<ul class="sub-menu">%4$s</ul>' +
    '</li>'
  };

  /**
   * Menu constructor
   *
   * @access private
   * @param {object} options Menu options.
   */
  function Menu( options ) {
    var defaults,
      settings,
      self = this;

    defaults = {
      id: '',
      href: '',
      title: '&middot;&middot;&middot;',
      children: {},
      templates: {},
      container: null
    };

    settings = $.extend( defaults, options );

    self.id = settings.id;
    self.href = settings.href;
    self.title = settings.title;
    self.children = settings.children;
    self.templates = settings.templates;
    self.$container = settings.container;
    self.node = null;
    self.attachedNode = null;
    self.options = {}; // Shared options
    self.visible = true;
  }

  /**
   * Set child
   * @param	{Menu}	 child	 Child menu element
   * @param	{number} [index] Optional index. If not specified, child will be added into the end.
   * @return {Menu}
   */
  Menu.prototype.set = function( child ) {
    if ( false === child instanceof Menu ) {
      throw new Error( 'Invalid argument type' );
    }

    this.children[ child.id ] = child;

    return this;
  };

  /**
   * Alias of `Menu.prototype.set`
   */
  Menu.prototype.push = function( child ) {
    return this.set( child );
  };

  /**
   * Get menu item
   * @param	{number} index
   * @return {Menu}
   */
  Menu.prototype.get = function( id ) {
    var menuItem = null;

    this.map( id, function( _, child ) {
      menuItem = child;
      return child;
    } );

    return menuItem;
  };

  /**
   * Map through the items
   * @return {Menu}
   */
  Menu.prototype.map = function( id, callback, children ) {
    var menuItem = {
        id: id
      },
      self = this;

    if ( typeof id !== 'string' ) {
      menuItem = id;
    }

    children = children || this.children;

    if ( 0 >= children.length ) {
      return menuItem;
    }

    Object.keys( children ).forEach( function( index ) {
      child = children[ index ];
      if ( menuItem.id === child.id ) {
        children[ menuItem.id ] = callback( child );
      } else {
        if ( child.children && 0 < Object.keys( child.children ).length ) {
          menuItem = self.map( menuItem, callback, child.children );
        }
      }
    } );

    return menuItem;
  };

  /**
   * Check if menu has children with the specified `index`
   * @param	{number} index
   * @return {boolean}
   */
  Menu.prototype.has = function( index ) {
    return undefined !== this.children[ index ];
  };


  /**
   * Return visibility state flag
   *
   * @access private
   * @return {boolean} Visibility state flag
   */
  Menu.prototype.isVisible = function() {
    return this.visible;
  }

  /**
   * forEach wrapper
   */
  Menu.prototype.forEach = function( callback ) {
    return this.children.forEach( callback );
  };

  /**
   * Count the visible attached nodes
   * @return {number}
   */
  Menu.prototype.countVisibleAttachedNodes = function() {
    var self = this,
      count = -1;

    Object.keys( self.children ).forEach( function( index ) {
      if ( ! $( self.children[ index ].getAttachedNode() ).attr( 'hidden' ) ) {
        count++;
      }
    } );

    return count;
  };

  /**
   * Count the visible nodes
   * @return {number}
   */
  Menu.prototype.countVisibleNodes = function() {
    var self = this,
      count = 0,
      child;

    Object.keys( self.children ).forEach( function( index ) {
      child = self.children[ index ];
      if ( ! $( child.getNode() ).attr( 'hidden' ) ) {
        count++;
      }
    } );

    return count;
  };

  /**
   * Count the `{Menu}` nodes
   * @return {number}
   */
  Menu.prototype.countVisible = function() {
    var self = this,
      count = 0;

    Object.keys( self.children ).forEach( function( index ) {
      if ( self.children[ index ].isVisible() ) {
        count++;
      }
    } );

    return count;
  };


  /**
   * Get menu `this.node`
   * @return {jQuery}
   */
  Menu.prototype.getNode = function() {
    return this.node;
  };

  /**
   * Return attached node to the menu element
   * @return {jQuery}
   */
  Menu.prototype.getAttachedNode = function() {
    return this.attachedNode;
  };

  /**
   * Set menu node
   * @param	{jQuery} $node Menu node
   */
  Menu.prototype.setNode = function( $node ) {
    this.node = $node;
  };

  /**
   * Attach a node to the menu element
   * @param	{jQuery} $node Node element
   */
  Menu.prototype.attachNode = function( $node ) {
    this.attachedNode = $node;
  };

  /**
   * Set options
   * @param {Object} options Options object
   * @return {Menu}
   */
  Menu.prototype.setOptions = function( options ) {
    this.options = options;
    return this;
  };

  /**
   * Get options
   * @return {Object}
   */
  Menu.prototype.getOptions = function() {
    return this.options;
  };

  /**
   * Render the menu
   *
   * @access private
   * @return {Menu}
   */
  Menu.prototype.render = function() {
    var self = this,
      menuTpl = self.templates.menu,
      childTpl = self.templates.child,
      $container = self.$container,
      $menu = self.options.$menu,
      $el;

    function replace( str, num, value ) {
      var originalStr = str.replace( new RegExp( '\\%' + num + '\\$s', 'g' ), value );

      pipes = {
        replace: function( num, value ) {
          replace( originalStr, num, value );
          return pipes;
        },
        get: function() {
          return originalStr;
        }
      };

      return pipes;
    };

    function renderMenu( className, menu, isChild ) {
      var children = '',
        keys = Object.keys( menu.children );

      isChild = isChild || false;

      keys.forEach( function( key ) {
        children += renderMenu( 'super-guacamole__menu__child', menu.children[ key ] );
      } );

      return replace( isChild ? childTpl : menuTpl, 1, className + ' menu-item' + ( 0 < keys.length ? ' menu-item-has-children' : '' ) )
        .replace( 2, menu.href )
        .replace( 3, menu.title )
        .replace( 4, ( 0 < keys.length ? children : '' ) )
        .replace( 5, menu.id )
        .get()
        .replace( '<ul class="sub-menu"></ul>', '' );
    }

    function render( children ) {
      var render = '',
        id,
        $current_el;

      Object.keys( children ).forEach( function( key ) {
        render += renderMenu( 'super-guacamole__menu', children[ key ] );
      } );

      return render;
    }

    if ( 0 < $container.length ) {
      $container.append( render( [ self ] ) );

      $container.find( '.super-guacamole__menu__child' ).each( function() {
        $current_el = $( this );
        id = $( this ).attr( 'id' );
        $el = $container.find( '#' + id.replace( 'sg-', '' ) );

        if ( 0 === $el.length ) {
          $el = $container.find( '.' + id.replace( 'sg-', '' ) );
        }

        if ( 0 < $el.length ) {
          self.map( id, function( menuItem ) {
            menuItem.attachNode( $el );
            menuItem.setNode( $current_el );

            return menuItem;
          } );
        }
      } );
    }

    return this;
  };

  /**
   * Extract elements
   *
   * @static
   * @access private
   * @param	{jQuery} $elements Collection of elements.
   * @return {array}			Array of Menu elements
   */
  Menu.extract = function( $elements ) {
    var obj = {},
      $element,
      $anchor,
      child,
      subChild,
      uniqueID;

    function getMenuID( $menuItem ) {
      var id = '',
        match = null,
        regexp = /menu\-item\-[0-9]+/i;
      $menuItem.attr( 'class' ).split( ' ' ).forEach( function( className ) {
        match = regexp.exec( className );
        if ( null !== match ) {
          id = match[0];
        }
      } );
      return id;
    }

    $elements.each( function( index, element ) {
      $element = $( element );
      $anchor = $element.find( 'a:first' );
      menuId = $element.attr( 'id' );

      if ( 'undefined' === typeof menuId ) {
        menuId = getMenuID( $element );
      }

      child = new Menu( {
        id: 'sg-' + menuId,
        href: $anchor.attr( 'href' ),
        title: $anchor.get( 0 ).childNodes[0].data
      } );
      child.attachNode( $element );

      if ( -1 < $element.children( '.sub-menu' ).length ) {
        subMenu = Menu.extract( $element.children( '.sub-menu' ).children( '.menu-item' ) );

        Object.keys( subMenu ).forEach( function( key ) {
          subChild = subMenu[ key ];
          child.set( subChild );
        } );
      }

      obj[ child.id ] = child;
    } );

    return obj;
  };

  /**
   * Check if attached nodes fit parent container
   * @return {boolean}
   */
  Menu.prototype.attachedNodesFit = function() {
    var self = this,
      width = 0,
      _width = 0,
      $node,
      $attachNode,
      child,
      $headerContainer = $( '.header-container > .container' ).length > 0 ?
        $( '.header-container > .container' ) :
        $( '.header-container > div' ),
      maxWidth = self.$container.outerWidth( true ) -
        self.$container.find( '.super-guacamole__menu' ).outerWidth( true ) -
        (
          parseInt( $headerContainer.css( 'padding-left' ), 10 ) +
          parseInt( $headerContainer.css( 'padding-right' ), 10 )
        ) / 2;
    Object.keys( self.children ).forEach( function( key ) {
      child = self.children[ key ];
      $attachedNode = $( child.getAttachedNode() );
      $node = $( child.getNode() );
      $attachedNode.removeAttr( 'hidden' );
      $node.attr( 'hidden', true );
    } );

    Object.keys( self.children ).forEach( function( index ) {
      child = child = self.children[ index ];
      $attachedNode = $( child.getAttachedNode() );
      $node = $( child.getNode() );

      _width = $attachedNode.outerWidth( true );
      if ( 0 < _width ) {
        $attachedNode.data( 'width', _width );
      }

      width += $attachedNode.data( 'width' );


      if ( width > maxWidth ) {
        $attachedNode.attr( 'hidden', true );
        $node.removeAttr( 'hidden' );
      }
    } );

    return true;
  };

  /**
   * Check if menu fit & has children
   * @param {bool}	[flag] Apply the class or return boolean.
   * @return {bool}
   */
  Menu.prototype.menuFit = function( flag ) {
    var self = this,
      fns = {
        removeAttr: function( el, attr ) {
          return el.removeAttr( attr );
        },
        attr: function( el, attr ) {
          return el.attr( attr, true );
        }
      },
      fn = 'removeAttr',
      child,
      threshold = self.options.threshold || 768;

    flag = flag || false;

    if ( 0 === self.countVisibleNodes() ) {
      fn = 'attr';
    }

    if ( $( window ).width() <= ( threshold - 1 ) ) {
      fn = 'attr';

      Object.keys( self.children ).forEach( function( index ) {
        child = self.children[ index ];
        $attachedNode = $( child.getAttachedNode() );
        $node = $( child.getNode() );
        $attachedNode.removeAttr( 'hidden' );
        $node.attr( 'hidden', true );
      } );
    }

    if ( ! flag ) {
      fns[ fn ]( self.$container.find( '.super-guacamole__menu' ), 'hidden' );
    }

    return fn === 'removeAttr';
  };

  /**
   * Watch handler.
   *
   * @access private
   * @return {Menu}
   */
  Menu.prototype.watch = function( once ) {
    var self = this,
      node,
      _index = -1,
      _visibility = false,
      _attachedNodesCount = 0,
      $attachedNode;

    once = once || false;

    function watcher() {
      self.attachedNodesFit();
      self.menuFit();
    }

    if ( once ) {
      watcher();
      return self;
    }

    function _debounce( threshold ) {
      var _timeout;

      return function _debounced( $jqEvent ) {
        function _delayed() {
          watcher();
          timeout = null;
        }

        if ( _timeout ) {
          clearTimeout( _timeout );
        }

        _timeout = setTimeout( _delayed, threshold );
      };
    }

    $( window ).on( 'resize', _debounce( 10 ) );
    $( window ).on( 'orientationchange', _debounce( 10 ) );

    return self;
  };

  /**
   * Super Guacamole!
   *
   * @access public
   * @param	{object} options Super Guacamole menu options.
   */
  $.fn.superGuacamole = function( options ) {
    var defaults,
      settings,
      $menu = $( this ),
      $main_menu = $menu.find( '#main-menu' ),
      $children,
      the_menu;

    defaults = {
      threshold:			544, // Minimal menu width, when this plugin activates
      minChildren: 		3, // Minimal visible children count
      childrenFilter: 	'li', // Child elements selector
      menuTitle:			'&middot;&middot;&middot;', // Menu title
      menuUrl:			'#', // Menu url
      templates:			defaultTemplates // Templates
    };

    settings = $.extend( defaults, options );

    $children = $main_menu.children( settings.childrenFilter + ':not(.super-guacamole__menu):not(.super-guacamole__menu__child)' );
    the_menu = new Menu( {
      title:		settings.menuTitle,
      href:		settings.menuUrl,
      templates:	settings.templates,
      children:	Menu.extract( $children ),
      container:	$main_menu
    } );

    settings.$menu = $main_menu;

    the_menu.setOptions( settings )
      .render()
      .watch( true )
      .watch();
    $menu.addClass('menu-inited');
  };

} ( jQuery ) );
/*
 * JavaScript Templates
 * https://github.com/blueimp/JavaScript-Templates
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Inspired by John Resig's JavaScript Micro-Templating:
 * http://ejohn.org/blog/javascript-micro-templating/
 */

/* global define */

;(function ($) {
  'use strict'
  var tmpl = function (str, data) {
    var f = !/[^\w\-\.:]/.test(str)
      ? tmpl.cache[str] = tmpl.cache[str] || tmpl(tmpl.load(str))
      : new Function(// eslint-disable-line no-new-func
      tmpl.arg + ',tmpl',
      'var _e=tmpl.encode' + tmpl.helper + ",_s='" +
      str.replace(tmpl.regexp, tmpl.func) + "';return _s;"
    )
    return data ? f(data, tmpl) : function (data) {
      return f(data, tmpl)
    }
  }
  tmpl.cache = {}
  tmpl.load = function (id) {
    return document.getElementById(id).innerHTML
  }
  tmpl.regexp = /([\s'\\])(?!(?:[^{]|\{(?!%))*%\})|(?:\{%(=|#)([\s\S]+?)%\})|(\{%)|(%\})/g
  tmpl.func = function (s, p1, p2, p3, p4, p5) {
    if (p1) { // whitespace, quote and backspace in HTML context
      return {
          '\n': '\\n',
          '\r': '\\r',
          '\t': '\\t',
          ' ': ' '
        }[p1] || '\\' + p1
    }
    if (p2) { // interpolation: {%=prop%}, or unescaped: {%#prop%}
      if (p2 === '=') {
        return "'+_e(" + p3 + ")+'"
      }
      return "'+(" + p3 + "==null?'':" + p3 + ")+'"
    }
    if (p4) { // evaluation start tag: {%
      return "';"
    }
    if (p5) { // evaluation end tag: %}
      return "_s+='"
    }
  }
  tmpl.encReg = /[<>&"'\x00]/g // eslint-disable-line no-control-regex
  tmpl.encMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;'
  }
  tmpl.encode = function (s) {
    return (s == null ? '' : '' + s).replace(
      tmpl.encReg,
      function (c) {
        return tmpl.encMap[c] || ''
      }
    )
  }
  tmpl.arg = 'o'
  tmpl.helper = ",print=function(s,e){_s+=e?(s==null?'':s):_e(s);}" +
    ',include=function(s,d){_s+=tmpl(s,d);}'
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return tmpl
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = tmpl
  } else {
    $.tmpl = tmpl
  }
}(this));

!function(a){a.fn.hoverIntent=function(b,c,d){var e={interval:100,sensitivity:6,timeout:0};e="object"==typeof b?a.extend(e,b):a.isFunction(c)?a.extend(e,{over:b,out:c,selector:d}):a.extend(e,{over:b,out:b,selector:c});var f,g,h,i,j=function(a){f=a.pageX,g=a.pageY},k=function(b,c){return c.hoverIntent_t=clearTimeout(c.hoverIntent_t),Math.sqrt((h-f)*(h-f)+(i-g)*(i-g))<e.sensitivity?(a(c).off("mousemove.hoverIntent",j),c.hoverIntent_s=!0,e.over.apply(c,[b])):(h=f,i=g,c.hoverIntent_t=setTimeout(function(){k(b,c)},e.interval),void 0)},l=function(a,b){return b.hoverIntent_t=clearTimeout(b.hoverIntent_t),b.hoverIntent_s=!1,e.out.apply(b,[a])},m=function(b){var c=a.extend({},b),d=this;d.hoverIntent_t&&(d.hoverIntent_t=clearTimeout(d.hoverIntent_t)),"mouseenter"===b.type?(h=c.pageX,i=c.pageY,a(d).on("mousemove.hoverIntent",j),d.hoverIntent_s||(d.hoverIntent_t=setTimeout(function(){k(c,d)},e.interval))):(a(d).off("mousemove.hoverIntent",j),d.hoverIntent_s&&(d.hoverIntent_t=setTimeout(function(){l(c,d)},e.timeout)))};return this.on({"mouseenter.hoverIntent":m,"mouseleave.hoverIntent":m},e.selector)}}(jQuery);

var inteoJSCore = (function () {
  return {
    init: function() {
      this.mainMenu(this, $('.header__menu')); //Menu
      this.megaMenu(this); //Disabled now
      this.mobileMenu(this); //Mobile menu
      this.mobileTabs(this); //Mobile dropdown tabs and menus
    },
    mainMenu: function(self, $mainNavigation) {
      var transitionend = 'transitionend oTransitionEnd webkitTransitionEnd',
        moreMenuContent = '&middot;&middot;&middot;',
        srcset = '',
        hasprop = Object.prototype.hasOwnProperty,
        $menuToggle = $('.main-menu-toggle[aria-controls="main-menu"]', $mainNavigation),
        liWithChildren = 'li.menu-item-has-children, li.page_item_has_children',
        $body = $('body'),
        $parentNode,
        menuItem,
        subMenu,
        index = -1,
        $layout = 'default';

      if ($layout == 'default') {
        $mainNavigation.superGuacamole({
          threshold: 768,
          minChildren: 3,
          childrenFilter: '.menu-item',
          //menuTitle: '',
          menuUrl: '#',
          templates: {
            menu: '<li id="%5$s" class="%1$s"><a href="%2$s">%3$s</a><ul class="sub-menu">%4$s</ul></li>',
            child_wrap: '<ul class="%1$s">%2$s</ul>',
            child: '<li id="%5$s" class="%1$s"><a href="%2$s">%3$s</a><ul class="sub-menu">%4$s</ul></li>'
          }
        });
      }
      function hideSubMenu(menuItem, $event) {
        var subMenus = menuItem.find('.sub-menu'),
          subMenu = menuItem.children('.sub-menu').first();

        menuItem
          .removeData('index')
          .removeClass('menu-hover');

        subMenu.addClass('in-transition');

        subMenus
          .one(transitionend, function() {
            subMenus.removeClass('in-transition');
          });
      }

      function handleMenuItemHover($event) {
        if ($('html').hasClass('mobile-menu-active')) {
          return;
        }
        menuItem = $($event.target).parents('.menu-item');
        subMenu = menuItem.children('.sub-menu').first();

        var subMenus = menuItem.find('.sub-menu');

        if (!menuItem.hasClass('menu-item-has-children') ) {
          menuItem = $event.target.tagName === 'LI' ?
            $($event.target) :
            $($event.target).parents().filter('.menu-item');
        }

        switch ($event.type) {
          case 'mouseenter':
          case 'mouseover':
            if (0 < subMenu.length) {
              var maxWidth = $body.outerWidth(true),
                subMenuOffset = subMenu.offset().left + subMenu.outerWidth(true);
              menuItem.addClass('menu-hover');
              subMenu.addClass('in-transition');
              if (maxWidth <= subMenuOffset) {
                subMenu.addClass('left-side');
                subMenu.find('.sub-menu').addClass('left-side');
              } else if (0 > subMenu.offset().left) {
                subMenu.removeClass('left-side');
                subMenu.find('.sub-menu').removeClass('left-side');
              }
              subMenus
                .one(transitionend, function() {
                  subMenus.removeClass('in-transition');
                });
            }
            break;
          case 'mouseleave':
          case 'mouseout':
            hideSubMenu(menuItem, $event);
            break;
        }
      }

      $(window).on('orientationchange resize', function() {
        if ($('html').hasClass('mobile-menu-active')) {
          //$('html').removeClass('mobile-menu-active');
          return;
        }
        $mainNavigation.find('.menu-item').removeClass('menu-hover');
        $mainNavigation.find('.sub-menu.left-side').removeClass('left-side');
      });

      $(liWithChildren).hoverIntent({
        over: function() {
        },
        out: function() {
        },
        timeout: 300,
        selector: '.menu-item'
      });

      $mainNavigation.on('mouseenter mouseover mouseleave mouseout', '.menu-item', handleMenuItemHover);

      function clickMenu($jqEvent) {
        if ($(this).find('.sub-menu').length == 0) {
          $jqEvent.stopPropagation();
        }
      }

      function doubleClickMenu($jqEvent) {
        $parentNode = $(this);

        if ($('html').hasClass('mobile-menu-active')) {
          return true;
        }
        if ($parentNode.find('.sub-menu').length == 0) {
          return true;
        }
        var menuIndex = $parentNode.index();

        if (menuIndex !== parseInt($parentNode.data('index'), 10)) {
          $jqEvent.preventDefault();
        }

        $parentNode.data('index', menuIndex);
      }

      if ('ontouchend' in window) {

        $(liWithChildren, $mainNavigation)
          .on('click', doubleClickMenu);

        $('.menu-item')
          .on('click', clickMenu);

        $(document).on('touchend', function($jqEvent) {
          if (!$('html').hasClass('mobile-menu-active')) {
            $parentNode = $($jqEvent.target).parents().filter('.menu-item:first');

            if ($parentNode.hasClass('menu-hover') === false) {
              hideSubMenu($parentNode, $jqEvent);

              index = $parentNode.data('index');

              if (index) {
                $parentNode.data('index', parseInt(index, 10) - 1);
              }
            }
          }
        });
      }

      $menuToggle.on('click', function($event) {
        $event.preventDefault();
        $mainNavigation.toggleClass('toggled');
      });
    },

    megaMenu: function(self) {
      function megaMenuSubMenuToggled() {
        $(this).toggleClass('active');
      }
      $('.mega-menu-mobile-arrow').on('click', megaMenuSubMenuToggled);
    },

    mobileMenu: function(self) {

      var $mainNavigation = $('.header__menu'),
        $menuToggle = $('.main-menu-toggle[aria-controls="main-menu"]');
      $('.header__menu > ul > li.menu-item-has-children > a')
        .append('<span class="sub-menu-toggle"><svg xmlns="http://www.w3.org/2000/svg" width="27" height="14" viewBox="0 0 27 14"><path d="M3,3l11,8L24,3"/></svg></span>');
      $('.header__menu > ul > li.menu-item-has-children > ul').attr('data-collapsed', 'true');

      function debounce(threshold, callback) {
        var timeout;

        return function debounced($event) {
          function delayed() {
            callback.call(this, $event);
            timeout = null;
          }

          if (timeout) {
            clearTimeout(timeout);
          }

          timeout = setTimeout(delayed, threshold);
        };
      }

      function resizeHandler($event) {
        var $window = $(window),
          width = $window.outerWidth(true);

        if (768 <= width) {
          $mainNavigation.removeClass('mobile-menu');
        } else {
          $mainNavigation.addClass('mobile-menu');
        }
      }

      function toggleSubMenuHandler($event) {
        var $section = $(this).parents().filter('li:first'), $collapsing = $section.children('ul'), isCollapsed = ($collapsing.attr('data-collapsed') === 'true');

        $event.preventDefault();

        $(this).toggleClass('active');
        $section.toggleClass('sub-menu-open');
        if (isCollapsed) {
          expandSection($collapsing[0]);
          $collapsing.attr('data-collapsed', 'false');
        }
        else {
          collapseSection($collapsing[0]);
        }
      }

      function collapseSection(element) {
        element.style.height = 0 + 'px';
        element.setAttribute('data-collapsed', 'true');
      }

      function expandSection(element) {
        var sectionHeight = element.scrollHeight;
        element.style.height = sectionHeight + 'px';
        element.setAttribute('data-collapsed', 'false');
      }

      function toggleMenuHandler($event) {
        var $toggle = $('.sub-menu-toggle');

        if (!$event.isDefaultPrevented()) {
          $event.preventDefault();
        }

        setTimeout(function() {
          if (!$mainNavigation.hasClass('animate')) {
            $mainNavigation.addClass('animate');
          }
          $mainNavigation.toggleClass('show');
          $('html').toggleClass('mobile-menu-active');
        }, 10);

        $menuToggle.toggleClass('toggled');
        $menuToggle.attr('aria-expanded', !$menuToggle.hasClass('toggled'));

        if ($toggle.hasClass('active')) {
          //$toggle.removeClass('active');
          //$mainNavigation.find('.sub-menu-open').removeClass('sub-menu-open');
        }
      }

      resizeHandler();
      $(window).on('resize orientationchange', debounce(500, resizeHandler));
      $('.sub-menu-toggle', $mainNavigation).on('click', toggleSubMenuHandler);
      $menuToggle.on('click', toggleMenuHandler);
      $('.mobile-holder').on('click', toggleMenuHandler);
    },

    mobileTabs: function(self) {
      $(".nav-tabs").wrap('<div class="js-nav-tabs"></div>');
      $('.nav-tabs > li > a').append('<span class="nav-tabs-toggle"><svg xmlns="http://www.w3.org/2000/svg" width="27" height="14" viewBox="0 0 27 14"><path d="M3,3l11,8L24,3"/></svg></span>');
      $(".js-nav-tabs").click(function(e) {
        e.preventDefault();
        $(this).toggleClass("open");
      });
      $(window).on("orientationchange resize", function() {
        $(".js-nav-tabs").removeClass("open");
      });
    }
  };
})();

function onloadRecaptcha() {
  if (window.grecaptcha) {
    $(".g-recaptcha").each(function(index, value) {
      var captchaParams = {};
      captchaParams['sitekey']  = $(this).data("sitekey");
      if ($(this).data("callback") !== undefined) {
        captchaParams['callback']  = $(this).data("callback");
      }
      if ($(this).data("theme") !== undefined) {
        captchaParams['theme']  = $(this).data("theme");
      }
      if ($(this).data("size") !== undefined) {
        captchaParams['size']  = $(this).data("size");
      }
      if ($(this).html() === '')
      {
        window[$(this).data('id')] = grecaptcha.render($(this).attr("id"), captchaParams);
      }
    });
  }
}

$(document).ready(function() {
  inteoJSCore.init();
  /*
   $(".fancybox").fancybox({
   helpers: {
   overlay: {
   fixed: false
   }
   }
   });
   $('.modal-form').fancybox({
   type: 'ajax',
   fixed: false,
   title: '',
   padding: 30,
   autoResize: false,
   autoCenter: false,
   fitToView: false,
   maxWidth: '100%',
   helpers: {
   overlay: {
   fixed: false
   }
   },
   beforeShow: function(){
   var params = $(this.element).data(), form = $('.fancybox-wrap').find('form');
   $.each(params, function(key, value) {
   form.find('[name='+key.toUpperCase()+']').val(value).attr('readonly',true);
   });
   }
   });*/

  $('.js-location').on('change', function(e) {
    e.stopPropagation();
    window.location = $(this).val();
  });
  $('a[rel^="external"]').click(function(){
    $(this).attr('target','_blank');
  });
  $("[data-fancybox]").fancybox({
    slideShow  : false
  });
  $('.modal-form').fancybox({
    ajax: {
      settings : {
        method: 'POST',
        data : {
          fancybox : true
        }
      }
    },
    type: 'ajax',
    fullScreen: false,
    beforeLoad: function(){
      var clicked = $.fancybox.getInstance().current.opts.$orig;
      if (window[clicked.data('params')]) {
        $.fancybox.getInstance().current.opts.ajax.settings.data = { 'params': window[clicked.data('params')] };
      }
    },
    onComplete: function(instance, slide){
      var clicked = $.fancybox.getInstance().current.opts.$orig;
      var params = $(clicked).data();
      $.each(params, function(key, value) {
        slide.$slide.find('[name='+key.toUpperCase()+']').val(value).attr('readonly',true);
      });
    }
  });

  $(document).on('click', '[data-href]', function(){
    window.location.href = $(this).data('href');
    return false;
  });

  $(document).on('click', '.fancy-close', function(){
    $.fancybox.close();
    return false;
  });

  //$('[data-toggle="tooltip"]').tooltip();

  /* Basket actions */
  $(document).on('click', '[data-basket-add]', function(e){
    if ($(this).hasClass('active')) return false;
    var $this = $(this),
      $item = $this.closest('[data-item]'),
      $itemId = $this.data('basket-add'),
      quantity = 1,
      $response;

    if ($item.find('input[data-quantity]').length) {
      quantity = parseFloat($item.find('input[data-quantity]').val());
    }
    $this.addClass('active');

    if(!isNaN($itemId) && parseInt($itemId) > 0) {
      $.ajax({
        url: inteoOptions['SITE_DIR'] + 'ajax/basket.php',
        dataType: 'json',
        type: 'POST',
        data: {action: 'add', id: $itemId, quantity: quantity},
      }).success(function(data){
        if (data.error) {
          $.fancybox.open('<div class="message"><h2>Error</h2><p>'+data.error+'</p></div>');
        }
        else {
          $item.addClass('complete');
          $response = JSON.parse(data);
          $.fancybox.open(tmpl("tmpl-success", $response), {focus : false});
          if (BX) {
            BX.onCustomEvent('OnBasketChange');
          }
        }
        $this.removeClass('active');
      });
    }
    return false;
  });
  $(document).on('click', '[data-basket-delete]', function(e){
    if ($(this).hasClass('active')) return false;
    var $this = $(this),
      $item = $this.closest('[data-basket-item]'),
      $itemId = $this.data('basket-delete');

    $this.addClass('active');

    if(!isNaN($itemId) && parseInt($itemId) > 0) {
      $.ajax({
        url: inteoOptions['SITE_DIR'] + 'ajax/basket.php',
        dataType: 'json',
        type: 'POST',
        data: {action: 'delete', id: $itemId},
      }).success(function(data){
        if (data.error) {
          $.fancybox.open('<div class="message"><h2>Error</h2><p>'+data.error+'</p></div>');
        }
        else {
          $item.fadeOut(400, function() {
            $("[data-basket-item="+$itemId+"]").remove();
            $("[data-item="+$itemId+"]").removeClass('complete');
          });
          if (BX) {
            BX.onCustomEvent('OnBasketChange');
          }
        }
        $this.removeClass('active');
      });
    }
    return false;
  });
});
/* End */
;
; /* Start:"a:4:{s:4:"full";s:81:"/bitrix/components/inteo/basket.small/templates/.default/script.js?14979495921122";s:6:"source";s:66:"/bitrix/components/inteo/basket.small/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
'use strict';

function InteoSmallestCart(){}

InteoSmallestCart.prototype = {

  activate: function ()
  {
    this.cartElement = BX(this.cartId);
    this.setCartBodyClosure = this.closure('setCartBody');
    BX.addCustomEvent(window, 'OnBasketChange', this.closure('refreshCart', {}));
  },

  closure: function (fname, data)
  {
    var obj = this;
    return data
      ? function(){obj[fname](data)}
      : function(arg1){obj[fname](arg1)};
  },

  refreshCart: function (data)
  {
    if (this.itemRemoved)
    {
      this.itemRemoved = false;
      return;
    }
    data.sessid = BX.bitrix_sessid();
    data.siteId = this.siteId;
    data.templateName = this.templateName;
    data.arParams = this.arParams;
    BX.ajax({
      url: this.ajaxPath,
      method: 'POST',
      dataType: 'html',
      data: data,
      onsuccess: this.setCartBodyClosure
    });
  },

  setCartBody: function (result)
  {
    if (this.cartElement)
      this.cartElement.innerHTML = result.replace(/#CURRENT_URL#/g, this.currentUrl);
  },

  removeItemFromCart: function (id)
  {
    this.refreshCart ({sbblRemoveItemFromCart: id});
    this.itemRemoved = true;
    BX.onCustomEvent('OnBasketChange');
  }
};

/* End */
;
; /* Start:"a:4:{s:4:"full";s:82:"/bitrix/components/inteo/theme.settings/templates/.default/script.js?1497949592830";s:6:"source";s:68:"/bitrix/components/inteo/theme.settings/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
$(document).ready(function(){
  $('.theme-settings__button').click(function(){
    $('.theme-settings').toggleClass('active');
  });
  /*$("#custom_color_picker").spectrum({
    containerClassName: 'custom_color_container',
    replacerClassName: 'custom_color_replacer',
    showInput: true,
    preferredFormat: "hex",
    move: function(color) {
      $('#custom_color_holder').css('background-color',color.toHexString());
    },
    change: function(color) {
      $('#custom_color_holder').css('background-color',color.toHexString());
      $('#color_custom').prop('checked', true);
      $('.theme-settings form').submit();
    }
  });*/

  $('.theme-settings form input[type=radio]').click(function(){
    if ($(this).attr('id') == 'color_custom') {
      $('#custom_color_picker').spectrum('toggle');
      return false;
    }
    $(this).closest('form').submit();
  });
});
/* End */
;; /* /bitrix/templates/inteo_corporation/f/js/common.js?149794961628557*/
; /* /bitrix/components/inteo/basket.small/templates/.default/script.js?14979495921122*/
; /* /bitrix/components/inteo/theme.settings/templates/.default/script.js?1497949592830*/
