document.onreadystatechange = function(){
    if (document.readyState == "complete" || document.readyState == "loaded") {
        // Basic no conflict. Using $ for consistency.
        (function($){

            var app_window = $('.app-window');

            // Center it at first.
            app_window.css('left', ( (window.innerWidth - app_window.get(0).offsetWidth) / 2 ) + "px" );

            // Minimize/Maximimize click handler
            $('.app-window .btn-toggle-vis').bind('click', function(e){

                // Is window open or closed?
                if( app_window.hasClass('window-open') ){

                    // Store current position in case it's moved
                    app_window
                        .addAttr('data-top', app_window.get(0).offsetTop)
                        .addAttr('data-left', app_window.get(0).offsetLeft);

                    // Hide it
                    app_window.removeClass('window-open').addClass('window-closed').removeAttr('style');

                } else {

                    // Open it
                    app_window.removeClass('window-closed').addClass('window-open');

                    // Restore former coordinates
                    app_window.css('top', app_window.attr('data-top')+"px" ).css('left', app_window.attr('data-left')+"px" );

                }

                stopPropagation( e );
                return false;

            });

            // Close button click handler
            $('.app-window .btn-close').bind('click', function(e){

                app_window.hide();

                stopPropagation( e );
                return false;

            });

            // Pre-build vars/funcs for events
            var $window = $(window), offsetX = 0, offsetY = 0;
            var doOnMouseMove = function(e){
                app_window.css('left', (e.clientX-offsetX) + "px").css('top', (e.clientY-offsetY) + "px");
            }
            var doOnMouseUp = function(e){
                app_window.removeClass('window-drag');
                $window.unbind('mouseup', doOnMouseUp).unbind('mousemove', doOnMouseMove);
            }

            // Watch for mouse-down on header for dragging, and
            // auto-bind the move/up events for the "drop"
            $('.app-window>header').bind('mousedown', function(e){

                app_window.addClass( 'window-drag');

                // Find the offset from click point to the actual coordinate of the window
                var containerX = app_window.get(0).offsetLeft;
                var containerY = app_window.get(0).offsetTop;

                offsetX = e.clientX - containerX;
                offsetY = e.clientY - containerY;

                // Register move/up events
                $window.bind('mousemove', doOnMouseMove).bind('mouseup', doOnMouseUp);

                return false;
            });

        })(simpleDOM);
    }
}

/**
 * A super-simple DOM helper lib.
 *
 * @author Mike Botsko
 *
 * Contains methods useful for this project, built to mimic
 * jQuery - developers who are familiar with jQuery will
 * have no trouble adapting to this.
 *
 * Works with all browser versions of the past few years.
 */
simpleDOM = function( selector ){

    var _raw_selector = selector

    var _matches = [];
    if( typeof selector === "object" ){
        _matches = [selector];
    }
    if( typeof selector === "string" ){
        _matches = document.querySelectorAll(_raw_selector);
    }

    return {


        /**
         * Adds a new CSS class to each element
         *
         * @param className
         * @returns simpleDOM
         */
        addClass: function( className ){
            for( var n = 0, l = _matches.length; n < l; n++ ){
                _matches[n].className += " " + className;
            }
            return this;
        },


        /**
         * Removes a CSS class name from an element
         * @param className
         * @returns simpleDOM
         */
        removeClass: function( className ){
            var regex = new RegExp('(?:^|\\s)'+className+'(?!\\S)');
            for( var n = 0, l = _matches.length; n < l; n++ ){
                _matches[n].className = _matches[n].className.replace( regex , '' );
            }
            return this;
        },

        /**
         * Determine if an element has a CSS class name.
         *
         * @todo Only works for the first element matched by
         * the selector. Will not currently work on subsequent
         * elements
         *
         * @param className
         * @returns boolean
         */
        hasClass: function( className ){
            var regex = new RegExp('(?:^|\\s)'+className+'(?!\\S)');
            if( _matches.length >= 1 ){
                return this.get(0).className.match( regex );
            }
            return false;
        },


        /**
         * Binds eventHandler of eventType to all elements
         * matching selector.
         *
         * @param eventType
         * @param eventHandler
         * @returns simpleDOM
         */
        bind: function( eventType, eventHandler ){

            for( var n = 0, l = _matches.length; n < l; n++ ){
                var eventElem = _matches[n];
                if(eventElem.addEventListener){
                    eventElem.addEventListener(eventType, eventHandler, false);
                } else {
                    eventElem.attachEvent('on'+eventType, eventHandler);
                }
            }
            return this;
        },


        /**
         * Unbinds an event from all elements matching selector.
         *
         * @param eventType
         * @param eventHandler
         * @returns {*}
         */
        unbind: function( eventType, eventHandler ){

            for( var n = 0, l = _matches.length; n < l; n++ ){
                var eventElem = _matches[n];
                if(eventElem.removeEventListener){
                    eventElem.removeEventListener(eventType, eventHandler, false);
                } else {
                    eventElem.detachEvent('on'+eventType, eventHandler);
                }
            }
            return this;
        },


        /**
         * Set css attribute values
         *
         * @param att
         * @param val
         * @returns simpleDOM
         */
        css: function( att, val ){
            for( var n = 0, l = _matches.length; n < l; n++ ){
                _matches[n].style[att] = val;
            }
            return this;
        },


        /**
         * Short-cut for hiding an element
         *
         * @returns simpleDOM
         */
        hide: function(){
            this.css('display', 'none');
            return this;
        },


        /**
         * Short-cut for showing a hidden element
         *
         * @returns simpleDOM
         */
        show: function(){
            this.css('display', 'block');
            return this;
        },


        /**
         * Add a new HTML attribute attr with value val
         *
         * @param attr
         * @param val
         * @returns simpleDOM
         */
        addAttr: function( attr, val ){
            for( var n = 0, l = _matches.length; n < l; n++ ){
                var newAttr = document.createAttribute(attr);
                newAttr.value = val;
                _matches[n].setAttributeNode(newAttr)
            }
            return this;
        },


        /**
         * Returns the current value of an HTML attribute
         *
         * @param attr
         * @returns {string}
         */
        attr: function( attr ){
            return this.get(0).getAttribute(attr);
        },


        /**
         * Removes an HTML attribute
         * @param attr
         * @returns simpleDOM
         */
        removeAttr: function( attr ){
            for( var n = 0, l = _matches.length; n < l; n++ ){
                _matches[n].removeAttribute(attr)
            }
            return this;
        },


        /**
         * Returns the direct element
         * @param k
         * @returns {*}
         */
        get: function(k){
            return _matches[k];
        }
    }
}


function stopPropagation( e ){
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
}