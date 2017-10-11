// tv-true html5 video player
//
// Credits, with thanks to
//      http://dev.opera.com/articles/view/custom-html5-video-player-with-css3-and-jquery/
//
// Any key or mouse click displays media control panel, if no key after that then the panel is removed after 5 seconds
// Key mappings:
//   space: play/pause
//   - : less volume
//   = : more volume
//   m: mute
//   _ : less volume
//   + : more volume
//   < and >: scrub back or forwards
//   s: re-position at start
//   e: re-position at end
//   arrow keys: navigate the media control buttons 
//   return: action the highlighted control button
//
// Not done
//   escape or backspace: leave the page
//
// Not checked on wii yet
//
// Design philosophy: keyboard for all actions, extendable, no reliance on large jquery libraries
//


(function($) {
    $.fn.tvTrueVideoPlayer = function(params) {
        var defaults = {
            theme: '',
            childtheme: '',
		extKeyDown: '',
		extKeyPress: ''
        };
        // merge default and user parameters
        params = $.extend( defaults, params);


        // traverse all nodes
        this.each(function() {
            // convert the single DOM node into a jQuery object
		// http://www.learningjquery.com/2007/08/what-is-this
            var $t = $(this);

            var showControls=function() {
			if (! $controls.is(':visible')) {
				$controls.fadeIn();
			}
			// always reset the timer
			window.clearTimeout($t.timer);
			$t.timer = window.setTimeout(hideControls, 4000);
            }
            var hideControls=function() {
                if ($controls.is(':visible')) {
                    $controls.fadeOut(1000);
                }
                window.clearTimeout($t.timer);
            }


		$t.focusOrder = new Array('.ttp-start','.ttp-rew','.ttp-play','.ttp-fwd','.ttp-end','.ttp-volume-less','.ttp-volume-value','.ttp-volume-more');
		$t.focusClass = '.ttp-play' ;
		$t.scrubSpeed = 0 ;

		//  video wrapper
            var $vwrap = $('<div></div>').addClass('ttp').addClass(params.theme).addClass(params.childtheme);
            

            //controls wraper
            var $controls = $('<div class="ttp-locate"><div class="ttp-controls-slug"></div><div class="ttp-controls"><div class="ttp-buttons"><div class="ttp-start"></div><div class="ttp-rew"></div><div class="ttp-play"></div><div class="ttp-fwd"></div><div class="ttp-end"></div><div class="ttp-volume-less"></div><div class="ttp-volume-value"></div><div class="ttp-volume-more"></div></div><div class="ttp-progress-box"><div class="ttp-timer"></div><div class="ttp-time-bar"><div class="ttp-time-mark"></div></div></div></div>');                        
            $t.wrap($vwrap); // this stops the autoplay
            $t.before($controls);

		var timeBarWidth = $t.prev().find('.ttp-time-bar').width();
		$t.prev().find('.ttp-volume-value').html( Math.round($t.attr('volume') * 10) );

		showControls();

            // Remove default browser controls because this is keyboard only and most browser video
		// controls require a mouse.
		// Remove it here in case js is not enabled, the visitor will still want to control the video
            $t.removeAttr('controls');

		if ( $t.attr('autoplay') ) {
			// adding the ttp wrap stops the autoplay in Chrome and Opera (unknown why)
			//$t.get(0).play();
			$t.prev().find('.ttp-play').html('||');
		} else {
			$t.prev().find('.ttp-play').html('&gt;');
		}

            var keyPress=function(e) {
			// if controls are visible then this function handles the key
			// only handle the key if the external handler returns true
			var handleKey = true;
			if (! $controls.is(':visible')) {
				if ( params.extKeyPress != '' ) {
					handleKey = params.extKeyPress(e);
				}
			}
			if ( handleKey ) {
				showControls();

				var keyCode = e.keyCode || e.charCode;
				switch ( keyCode ) {
					case 13 :  // return
						$.ttp.action($t,$t.focusClass);
						break;
					case 32 :  // space
						$.ttp.playPause($t);
						break;
					case 45 : // - hyphen
					case 95 : // _ underscore
						$.ttp.volumeDown($t);
						break;
					case 43 : // +
					case 61 : // =
						$.ttp.volumeUp($t);
						break;
					case 60 : // <
						$.ttp.rewind($t);
						break;
					case 62 : // >
						$.ttp.forward($t);
						break;
					case 101 : // e
						$.ttp.jumpToEnd($t);
						break;
					case 109 : // m
						$.ttp.toggleMute($t);
						break;
					case 115 : // s
						$.ttp.jumpToStart($t);
						break;
					case 120 : // x
						$.ttp.changeSource( $t, 'star_high.ogg');
						break;
				}
return false;
			}
		}

            var keyDown=function(e) {
			// if controls are visible then this function handles the key
			// only handle the key if the external handler returns true
			var handleKey = true;
			if (! $controls.is(':visible')) {
				if ( params.extKeyDown != '' ) {
					handleKey = params.extKeyDown(e);
				}
			}
			if ( handleKey ) {
				showControls();
				
				var keyCode = e.keyCode || e.charCode;
				switch ( keyCode ) {
					case 37 :  // left arrow
						$.ttp.focusPrev($t);
						break;
					case 39 :  // right arrow
						$.ttp.focusNext($t);
						break;
				}
			}
		}

		var timeFormat = function(seconds) {
			var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
			var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
			return m+":"+s;
		}

            // Seems like you can only bind keydown events to the body
            // This is the bit that means there cant be more than one player in a window; how would
		// you know which player should be controlled by the key press? 
		//
            // opera and chrome dont need a mouse click before pressing space to play (firefox and kylo do need a click first, TODO try setting the focus)
		// keypress does not detect arrow keys
            $('body').bind({
                keydown: function(e) { keyDown(e); },
                keypress: function(e) { keyPress(e); }
            });

		// now bind useful events to the video element
		$t
		.bind({ click: showControls })
            .bind("timeupdate",function(){
			$t.prev().find('.ttp-timer').html( timeFormat($t.attr('currentTime'))+ '/' + timeFormat($t.attr('duration')) );

			$t.prev().find('.ttp-time-mark').width($t.attr('currentTime') * timeBarWidth / $t.attr('duration'));
		})
		;

		$('.ttp-buttons > *').hover( function() { $.ttp.focusSet( $t, '.'+ $(this).attr('class') ); } ) ;
		$('.ttp-buttons > *').click( function() { $.ttp.action( $t, $t.focusClass ); } ) ;
/*
*/
        });
        // allow jQuery chaining
        return this;
    };

$.ttp = {
    
	action: function ($t,c) {
		switch (c) {
			case '.ttp-start' :
				$.ttp.jumpToStart($t);
				break;
			case '.ttp-rew' :
				$.ttp.rewind($t);
				break;
			case '.ttp-play' :
				$.ttp.playPause($t);
				break;
			case '.ttp-fwd' :
				$.ttp.forward($t);
				break;
			case '.ttp-end' :
				$.ttp.jumpToEnd($t);
				break;
			case '.ttp-volume-value':
				$.ttp.toggleMute($t);
				break;
			case '.ttp-volume-less':
				$.ttp.volumeDown($t);
				break;
			case '.ttp-volume-more':
				$.ttp.volumeUp($t);
				break;
		}
	},
	changeSource: function ($t, src) {
		// http://www.whatwg.org/specs/web-apps/current-work/multipage/video.html#video
		$t.attr('src','star_high.ogg'); //doesnt work in chrome
		$t.find('source').remove();
		$t.append('<source src="star_high.ogg" type="video/ogg"/>');
	},
	focusFind: function($t,c) {
		// TODO simpler way to hash map ?
		for (var i=0 ; i < $t.focusOrder.length ; i++) {
			if ( c ==  $t.focusOrder[i] ) { return i; }
		}
		return -1;
	},
	focusNext: function($t) {
		var focusIndex = $.ttp.focusFind( $t, $t.focusClass );
		focusIndex++;
            if ( focusIndex == $t.focusOrder.length ) { focusIndex = 0; }
		$.ttp.focusSet($t, $t.focusOrder[focusIndex]);
	},
	focusPrev: function($t) {
		var focusIndex = $.ttp.focusFind( $t, $t.focusClass );
		focusIndex--;
            if ( focusIndex < 0  ) { focusIndex = $t.focusOrder.length-1; }
		$.ttp.focusSet($t, $t.focusOrder[focusIndex]);
	},
	focusSet: function($t, c) {
		$t.prev().find($t.focusClass).removeClass('ttp-button-focus');
		$t.focusClass = c ;
		$t.prev().find(c).addClass('ttp-button-focus');
	},
	forward: function($t) {
		if ( $t.scrubSpeed < 0 ) { $t.scrubSpeed = 0; }
		$t.scrubSpeed += 10;
		$t.scrubSpeed = 10; // dont accelerate
		$t.attr('currentTime', $t.attr('currentTime')+$t.scrubSpeed);
	},
	jumpToEnd: function($t) {
		$t.attr('currentTime', $t.attr('duration') );
 	},
	jumpToStart: function($t) {
		$t.attr('currentTime', 0);
	},
	playPause: function ($t) {
		if ( $t.get(0).paused ) {
			$t.get(0).play();
			$t.prev().find('.ttp-play').html('||');
		} else {
			$t.get(0).pause();
			$t.prev().find('.ttp-play').html('&gt;');

		}
		$.ttp.focusSet($t,'.ttp-play');
	},
	rewind: function($t) {
		if ( $t.scrubSpeed > 0 ) { $t.scrubSpeed = 0; }
		$t.scrubSpeed -= 10;
		$t.scrubSpeed = -10; // dont accelerate
		$t.attr('currentTime', $t.attr('currentTime')+$t.scrubSpeed);
	},
	toggleMute: function($t) {
		if ( $t.attr('muted') ) {
			$t.attr('muted',false);
			$t.prev().find('.ttp-volume-value').html( Math.round($t.attr('volume') * 10) );
		} else {
			$t.attr('muted',true);
			$t.prev().find('.ttp-volume-value').html( '0' );
		}
	},
	volumeDown: function($t) {
		$t.attr('volume',$t.attr('volume')-0.1);
		$t.prev().find('.ttp-volume-value').html( Math.round($t.attr('volume') * 10) );
	},
	volumeUp: function($t) {
		$t.attr('volume',$t.attr('volume')+0.1);
		$t.prev().find('.ttp-volume-value').html( Math.round($t.attr('volume') * 10) );
	},
}

})(jQuery);

