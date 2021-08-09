
/*################ ddsmoothmenu.js starts ###################*/
var ddsmoothmenu = {

///////////////////////// Global Configuration Options: /////////////////////////

mobilemediaquery: "screen and (max-width:992px)", // CSS media query string that when matched activates mobile menu (while hiding default)
//Specify full URL to down and right arrow images (23 is padding-right for top level LIs with drop downs, 6 is for vertical top level items with fly outs):
arrowimages: {down:['downarrowclass', 'spacer.png', 23], right:['rightarrowclass', 'spacer.png', 6], left:['leftarrowclass', 'spacer.png']},
transition: {overtime:300, outtime:300}, //duration of slide in/ out animation, in milliseconds
mobiletransition: 200, // duration of slide animation in mobile menu, in milliseconds
shadow: false, //enable shadow? (offsets now set in ddsmoothmenu.css stylesheet)
showhidedelay: {showdelay: 100, hidedelay: 200}, //set delay in milliseconds before sub menus appear and disappear, respectively
zindexvalue: 1000, //set z-index value for menus
closeonnonmenuclick: true, //when clicking outside of any "toggle" method menu, should all "toggle" menus close? 
closeonmouseout: false, //when leaving a "toggle" menu, should all "toggle" menus close? Will not work on touchscreen

/////////////////////// End Global Configuration Options ////////////////////////

overarrowre: /(?=\.(gif|jpg|jpeg|png|bmp))/i,
overarrowaddtofilename: '_over',
detecttouch: !!('ontouchstart' in window) || !!('ontouchstart' in document.documentElement) || !!window.ontouchstart || (!!window.Touch && !!window.Touch.length) || !!window.onmsgesturechange || (window.DocumentTouch && window.document instanceof window.DocumentTouch),
detectwebkit: navigator.userAgent.toLowerCase().indexOf("applewebkit") > -1, //detect WebKit browsers (Safari, Chrome etc)
detectchrome: navigator.userAgent.toLowerCase().indexOf("chrome") > -1, //detect chrome
ismobile: navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) != null, //boolean check for popular mobile browsers
idevice: /ipad|iphone/i.test(navigator.userAgent),
detectie6: (function(){var ie; return (ie = /MSIE (\d+)/.exec(navigator.userAgent)) && ie[1] < 7;})(),
detectie9: (function(){var ie; return (ie = /MSIE (\d+)/.exec(navigator.userAgent)) && ie[1] > 8;})(),
ie9shadow: function(){},
css3support: typeof document.documentElement.style.boxShadow === 'string' || (!document.all && document.querySelector), //detect browsers that support CSS3 box shadows (ie9+ or FF3.5+, Safari3+, Chrome etc)
prevobjs: [], menus: null,
mobilecontainer: {$main: null, $topulsdiv: null, $toggler: null, hidetimer: null},
mobilezindexvalue: 2000, // mobile menus starting zIndex

executelink: function($, prevobjs, e){
	var prevscount = prevobjs.length, link = e.target;
	while(--prevscount > -1){
		if(prevobjs[prevscount] === this){
			prevobjs.splice(prevscount, 1);
			if(link.href !== ddsmoothmenu.emptyhash && link.href && $(link).is('a') && !$(link).children('span.' + ddsmoothmenu.arrowimages.down[0] +', span.' + ddsmoothmenu.arrowimages.right[0]).length){
				if(link.target && link.target !== '_self'){
					window.open(link.href, link.target);
				} else {
					window.location.href = link.href;
				}
				e.stopPropagation();
			}
		}
	}
},

repositionv: function($subul, $link, newtop, winheight, doctop, method, menutop){
	menutop = menutop || 0;
	var topinc = 0, doclimit = winheight + doctop;
	$subul.css({top: newtop, display: 'block'});
	while($subul.offset().top < doctop) {
		$subul.css({top: ++newtop});
		++topinc;
	}
	if(!topinc && $link.offset().top + $link.outerHeight() < doclimit && $subul.data('height') + $subul.offset().top > doclimit){
		$subul.css({top: doctop - $link.parents('ul').last().offset().top - $link.position().top});
	}
	method === 'toggle' && $subul.css({display: 'none !important'});
	if(newtop !== menutop){$subul.addClass('repositionedv');}
	return [topinc, newtop];
},

updateprev: function($, prevobjs, $curobj){
	var prevscount = prevobjs.length, prevobj, $indexobj = $curobj.parents().add(this);
	while(--prevscount > -1){
		if($indexobj.index((prevobj = prevobjs[prevscount])) < 0){
			$(prevobj).trigger('click', [1]);
			prevobjs.splice(prevscount, 1);
		}
	}
	prevobjs.push(this);
},

subulpreventemptyclose: function(e){
	var link = e.target;
	if(link.href === ddsmoothmenu.emptyhash && $(link).parent('li').find('ul').length < 1){
		e.preventDefault();
		e.stopPropagation();
	}
},

getajaxmenu: function($, setting, nobuild){ //function to fetch external page containing the panel DIVs
	var $menucontainer=$('#'+setting.contentsource[0]); //reference empty div on page that will hold menu
	$menucontainer.html("Loading Menu...");
	$.ajax({
		url: setting.contentsource[1], //path to external menu file
		async: true,
		dataType: 'html',
		error: function(ajaxrequest){
			setting.menustate = "error"
			$menucontainer.html('Error fetching content. Server Response: '+ajaxrequest.responseText);
		},
		success: function(content){
			setting.menustate = "fetched"
			$menucontainer.html(content).find('#' + setting.mainmenuid).css('display', 'block');
			!!!nobuild && ddsmoothmenu.buildmenu($, setting);
		}
	});
},

getajaxmenuMobile: function($, setting){ //function to fetch external page containing the primary menu UL
	setting.mobilemenustate = 'fetching'
	$.ajax({
		url: setting.contentsource[1], //path to external menu file
		async: true,
		dataType: 'html',
		error: function(ajaxrequest){
			setting.mobilemenustate = 'error'
			alert("Error fetching Ajax content " + ajaxrequest.responseText)
		},
		success: function(content){
			var $ul = $(content).find('>ul')
			setting.mobilemenustate = 'fetched'
			ddsmoothmenu.buildmobilemenu($, setting, $ul);
		}
	});
},

closeall: function(e){
	var smoothmenu = ddsmoothmenu, prevscount;
	if(!smoothmenu.globaltrackopen){return;}
	if(e.type === 'mouseleave' || ((e.type === 'click' || e.type === 'touchstart') && smoothmenu.menus.index(e.target) < 0)){
		prevscount = smoothmenu.prevobjs.length;
		while(--prevscount > -1){
			$(smoothmenu.prevobjs[prevscount]).trigger('click');
			smoothmenu.prevobjs.splice(prevscount, 1);
		}
	}
},

emptyhash: $('<a href="#"></a>').get(0).href,

togglemobile: function(action, duration){
	if (!this.mobilecontainer.$main)
		return
	clearTimeout(this.mobilecontainer.hidetimer)
	var $mobilemenu = this.mobilecontainer.$main
	var duration = duration || this.mobiletransition
	if ($mobilemenu.css('visibility') == 'hidden' && (!action || action == 'open')){
		$mobilemenu.css({left: '-100%', visibility: 'visible'}).animate({left: 0}, duration)
		this.mobilecontainer.$toggler.addClass('open')
	}
	else if ($mobilemenu.css('visibility') == 'visible' && (!action || action != 'open')){
		$mobilemenu.animate({left: '-100%'}, duration, function(){this.style.visibility = 'hidden'})
		this.mobilecontainer.$toggler.removeClass('open')
	}
	return false
	
},

buildmobilemenu: function($, setting, $ul){

	function flattenuls($mainul, cloneulBol, callback, finalcall){
		var callback = callback || function(){}
		var finalcall = finalcall || function(){}
		var $headers = $mainul.find('ul').parent()
		var $mainulcopy = cloneulBol? $mainul.clone() : $mainul
		var $flattened = jQuery(document.createDocumentFragment())
		var $headers = $mainulcopy.find('ul').parent()
		for (var i=$headers.length-1; i>=0; i--){ // loop through headers backwards, so we end up with topmost UL last
			var $header = $headers.eq(i)
			var $subul = $header.find('>ul').prependTo($flattened)
			callback(i, $header, $subul)
		}
		$mainulcopy.prependTo($flattened) // Add top most UL to collection
		finalcall($mainulcopy)
		return $flattened
	}

	var $mainmenu = $('#' + setting.mainmenuid)
	var $mainul = $ul
	var $topulref = null

	var flattened = flattenuls($mainul, false,
		function(i, $header, $subul){ // loop through header LIs and sub ULs
			$subul.addClass("submenu")
			var $breadcrumb = $('<li class="breadcrumb" />')
				.html('<img src="' + ddsmoothmenu.arrowimages.left[1] +'" class="' + ddsmoothmenu.arrowimages.left[0] +'" />' + $header.text())
				.prependTo($subul)
			$header.find('a:eq(0)').append('<img src="' + ddsmoothmenu.arrowimages.right[1] +'" class="' + ddsmoothmenu.arrowimages.right[0] +'" />')
			$header.on('click', function(e){
				var $headermenu = $(this).parent('ul')
				$headermenu = $headermenu.hasClass('submenu')? $headermenu : $headermenu.parent()
				$headermenu.css({zIndex: ddsmoothmenu.mobilezindexvalue++, left: 0}).animate({left: '-100%'}, ddsmoothmenu.mobiletransition)
				$subul.css({zIndex: ddsmoothmenu.mobilezindexvalue++, left: '100%'}).animate({left: 0}, ddsmoothmenu.mobiletransition)
				e.stopPropagation()
				e.preventDefault()
			})
			$breadcrumb.on('click', function(e){
				var $headermenu = $header.parent('ul')
				$headermenu = $headermenu.hasClass('submenu')? $headermenu : $headermenu.parent()
				$headermenu.css({zIndex: ddsmoothmenu.mobilezindexvalue++, left: '-100%'}).animate({left: 0}, ddsmoothmenu.mobiletransition)
				$subul.css({zIndex: ddsmoothmenu.mobilezindexvalue++, left: 0}).animate({left: '100%'}, ddsmoothmenu.mobiletransition)
				e.stopPropagation()
				e.preventDefault()
			})
		},
		function($topul){
			$topulref = $topul
		}
	)


	if (!this.mobilecontainer.$main){ // if primary mobile menu container not defined yet
		var $maincontainer = $('<div class="ddsmoothmobile"><div class="topulsdiv"></div></div>').appendTo(document.body)
		$maincontainer
			.css({zIndex: this.mobilezindexvalue++, left: '-100%', visibility: 'hidden'})
			.on('click', function(e){ // assign click behavior to mobile container
				ddsmoothmenu.mobilecontainer.hidetimer = setTimeout(function(){
					ddsmoothmenu.togglemobile('close', 0)
				}, 50)
				e.stopPropagation()
			})
			.on('touchstart', function(e){
				e.stopPropagation()
			})
		var $topulsdiv = $maincontainer.find('div.topulsdiv')
		var $mobiletoggler = $('#ddsmoothmenu-mobiletoggle').css({display: 'block'})
		$mobiletoggler
			.on('click', function(e){ // assign click behavior to main mobile menu toggler
				ddsmoothmenu.togglemobile()
				e.stopPropagation()
			})
			.on('touchstart', function(e){
				e.stopPropagation()
			})		
		var hidemobilemenuevent = /(iPad|iPhone|iPod)/g.test( navigator.userAgent )? 'touchstart' : 'click' // ios doesnt seem to respond to clicks on BODY
		$(document.body).on(hidemobilemenuevent, function(e){
			if (!$maincontainer.is(':animated'))
				ddsmoothmenu.togglemobile('close', 0)
		})

		this.mobilecontainer.$main = $maincontainer
		this.mobilecontainer.$topulsdiv = $topulsdiv
		this.mobilecontainer.$toggler = $mobiletoggler
	}
	else{ // else, just reference mobile container on page
		var $maincontainer = this.mobilecontainer.$main
		var $topulsdiv = this.mobilecontainer.$topulsdiv
	}
	$topulsdiv.append($topulref).css({zIndex: this.mobilezindexvalue++})
	$maincontainer.append(flattened)

	setting.mobilemenustate = 'done'
	

},

buildmenu: function($, setting){
	// additional step to detect true touch support. Chrome desktop mistakenly returns true for this.detecttouch
	var detecttruetouch = (this.detecttouch && !this.detectchrome) || (this.detectchrome && this.ismobile)
	var smoothmenu = ddsmoothmenu;
	smoothmenu.globaltrackopen = smoothmenu.closeonnonmenuclick || smoothmenu.closeonmouseout;
	var zsub = 0; //subtractor to be incremented so that each top level menu can be covered by previous one's drop downs
	var prevobjs = smoothmenu.globaltrackopen? smoothmenu.prevobjs : [];
	var $mainparent = $("#"+setting.mainmenuid).removeClass("ddsmoothmenu ddsmoothmenu-v").addClass(setting.classname || "ddsmoothmenu");
	setting.repositionv = setting.repositionv !== false;
	var $mainmenu = $mainparent.find('>ul'); //reference main menu UL
	var method = (detecttruetouch)? 'toggle' : setting.method === 'toggle'? 'toggle' : 'hover';
	var $topheaders = $mainmenu.find('>li>ul').parent();//has('ul');
	var orient = setting.orientation!='v'? 'down' : 'right', $parentshadow = $(document.body);
	$mainmenu.click(function(e){e.target.href === smoothmenu.emptyhash && e.preventDefault();});
	if(method === 'toggle') {
		if(smoothmenu.globaltrackopen){
			smoothmenu.menus = smoothmenu.menus? smoothmenu.menus.add($mainmenu.add($mainmenu.find('*'))) : $mainmenu.add($mainmenu.find('*'));
		}
		if(smoothmenu.closeonnonmenuclick){
			if(orient === 'down'){$mainparent.click(function(e){e.stopPropagation();});}
			$(document).unbind('click.smoothmenu').bind('click.smoothmenu', smoothmenu.closeall);
			if(smoothmenu.idevice){
				document.removeEventListener('touchstart', smoothmenu.closeall, false);
				document.addEventListener('touchstart', smoothmenu.closeall, false);
			}
		} else if (setting.closeonnonmenuclick){
			if(orient === 'down'){$mainparent.click(function(e){e.stopPropagation();});}
			$(document).bind('click.' + setting.mainmenuid, function(e){$mainmenu.find('li>a.selected').parent().trigger('click');});
			if(smoothmenu.idevice){
				document.addEventListener('touchstart', function(e){$mainmenu.find('li>a.selected').parent().trigger('click');}, false);
			}
		}
		if(smoothmenu.closeonmouseout){
			var $leaveobj = orient === 'down'? $mainparent : $mainmenu;
			$leaveobj.bind('mouseleave.smoothmenu', smoothmenu.closeall);
		} else if (setting.closeonmouseout){
			var $leaveobj = orient === 'down'? $mainparent : $mainmenu;
			$leaveobj.bind('mouseleave.smoothmenu', function(){$mainmenu.find('li>a.selected').parent().trigger('click');});
		}
		if(!$('style[title="ddsmoothmenushadowsnone"]').length){
			$('head').append('<style title="ddsmoothmenushadowsnone" type="text/css">.ddsmoothmenushadowsnone{display:none!important;}</style>');
		}
		var shadowstimer;
		$(window).bind('resize scroll', function(){
			clearTimeout(shadowstimer);
			var $selected = $mainmenu.find('li>a.selected').parent(),
			$shadows = $('.ddshadow').addClass('ddsmoothmenushadowsnone');
			$selected.eq(0).trigger('click');
			$selected.trigger('click');
			if ( !window.matchMedia || (window.matchMedia && !setting.mobilemql.matches))
				shadowstimer = setTimeout(function(){$shadows.removeClass('ddsmoothmenushadowsnone');}, 100);
		});
	}

	$topheaders.each(function(){
		var $curobj=$(this).css({zIndex: (setting.zindexvalue || smoothmenu.zindexvalue) + zsub--}); //reference current LI header
		var $subul=$curobj.children('ul:eq(0)').css({display:'block'}).data('timers', {});
		var $link = $curobj.children("a:eq(0)").css({paddingRight: smoothmenu.arrowimages[orient][2]}).append( //add arrow images
			'<span style="display: block;" class="' + smoothmenu.arrowimages[orient][0] + '"></span>'
		);
		var dimensions = {
			w	: $link.outerWidth(),
			h	: $curobj.innerHeight(),
			subulw	: $subul.outerWidth(),
			subulh	: $subul.outerHeight()
		};
		var menutop = orient === 'down'? dimensions.h : 0;
		$subul.css({top: menutop});
		function restore(){$link.removeClass('selected');}
		method === 'toggle' && $subul.click(smoothmenu.subulpreventemptyclose);
		$curobj[method](
			function(e){
				if(!$curobj.data('headers')){
					smoothmenu.buildsubheaders($, $subul, $subul.find('>li>ul').parent(), setting, method, prevobjs);
					$curobj.data('headers', true).find('>ul').each(function(i, ul){
						var $ul = $(ul);
						$ul.data('height', $ul.outerHeight());
					}).css({display:'none !important', visibility:'visible'});
				}
				method === 'toggle' && smoothmenu.updateprev.call(this, $, prevobjs, $curobj);
				clearTimeout($subul.data('timers').hidetimer);
				$link.addClass('selected');
				$subul.data('timers').showtimer=setTimeout(function(){
					var menuleft = orient === 'down'? 0 : dimensions.w;
					var menumoved = menuleft, newtop, doctop, winheight, topinc = 0;
					var offsetLeft = $curobj.offset().left
					menuleft=(offsetLeft+menuleft+dimensions.subulw>$(window).width())? (orient === 'down'? -dimensions.subulw+dimensions.w : -dimensions.w) : menuleft; 
//calculate this sub menu's offsets from its parent
					if (orient === 'right' && menuleft < 0){ // for vertical menu, if top level sub menu drops left, test to see if it'll be obscured by left window edge
						var scrollX = window.pageXOffset || (document.documentElement || document.body.parentNode || document.body).scrollLeft
						if (offsetLeft - dimensions.subulw < 0) // if menu will be obscured by left window edge
							menuleft = 0
					}
					menumoved = menumoved !== menuleft;
					$subul.css({top: menutop}).removeClass('repositionedv');
					if(setting.repositionv && $link.offset().top + menutop + $subul.data('height') > (winheight = $(window).height()) + (doctop = $(document).scrollTop())){
						newtop = (orient === 'down'? 0 : $link.outerHeight()) - $subul.data('height');
						topinc = smoothmenu.repositionv($subul, $link, newtop, winheight, doctop, method, menutop)[0];
					}
					$subul.css({left:menuleft, width:dimensions.subulw}).stop(true, true).animate({height:'show',opacity:'show'}, smoothmenu.transition.overtime, function(){this.style.removeAttribute && this.style.removeAttribute('filter');});
					if(menumoved){$subul.addClass('repositioned');} else {$subul.removeClass('repositioned');}
					if (setting.shadow){
						if(!$curobj.data('$shadow')){
							$curobj.data('$shadow', $('<div></div>').addClass('ddshadow toplevelshadow').prependTo($parentshadow).css({zIndex: $curobj.css('zIndex')}));  //insert shadow DIV and set it to parent node for the next shadow div
						}
						smoothmenu.ie9shadow($curobj.data('$shadow'));
						var offsets = $subul.offset();
						var shadowleft = offsets.left;
						var shadowtop = offsets.top;
						$curobj.data('$shadow').css({overflow: 'visible', width:dimensions.subulw, left:shadowleft, top:shadowtop}).stop(true, true).animate({height:dimensions.subulh}, smoothmenu.transition.overtime);
					}
				}, smoothmenu.showhidedelay.showdelay);
			},
			function(e, speed){
				var $shadow = $curobj.data('$shadow');
				if(method === 'hover'){restore();}
				else{smoothmenu.executelink.call(this, $, prevobjs, e);}
				clearTimeout($subul.data('timers').showtimer);
				$subul.data('timers').hidetimer=setTimeout(function(){
					$subul.stop(true, true).animate({height:'hide', opacity:'hide'}, speed || smoothmenu.transition.outtime, function(){method === 'toggle' && restore();});
					if ($shadow){
						if (!smoothmenu.css3support && smoothmenu.detectwebkit){ //in WebKit browsers, set first child shadow's opacity to 0, as "overflow:hidden" doesn't work in them
							$shadow.children('div:eq(0)').css({opacity:0});
						}
						$shadow.stop(true, true).animate({height:0}, speed || smoothmenu.transition.outtime, function(){if(method === 'toggle'){this.style.overflow = 'hidden';}});
					}
				}, smoothmenu.showhidedelay.hidedelay);
			}
		); //end hover/toggle
		$subul.css({display: 'none !important'}); // collapse sub UL 
	}); //end $topheaders.each()
},

buildsubheaders: function($, $subul, $headers, setting, method, prevobjs){
	//setting.$mainparent.data('$headers').add($headers);
	$subul.css('display', 'block');
	$headers.each(function(){ //loop through each LI header
		var smoothmenu = ddsmoothmenu;
		var $curobj=$(this).css({zIndex: $(this).parent('ul').css('z-index')}); //reference current LI header
		var $subul=$curobj.children('ul:eq(0)').css({display:'block'}).data('timers', {}), $parentshadow;
		method === 'toggle' && $subul.click(smoothmenu.subulpreventemptyclose);
		var $link = $curobj.children("a:eq(0)").append( //add arrow images
			'<span style="display: block;" class="' + smoothmenu.arrowimages['right'][0] + '"></span>'
		);
		var dimensions = {
			w	: $link.outerWidth(),
			subulw	: $subul.outerWidth(),
			subulh	: $subul.outerHeight()
		};
		$subul.css({top: 0});
		function restore(){$link.removeClass('selected');}
		$curobj[method](
			function(e){
				if(!$curobj.data('headers')){
					smoothmenu.buildsubheaders($, $subul, $subul.find('>li>ul').parent(), setting, method, prevobjs);
					$curobj.data('headers', true).find('>ul').each(function(i, ul){
						var $ul = $(ul);
						$ul.data('height', $ul.height());
					}).css({display:'none !important', visibility:'visible'});
				}
				method === 'toggle' && smoothmenu.updateprev.call(this, $, prevobjs, $curobj);
				clearTimeout($subul.data('timers').hidetimer);
				$link.addClass('selected');
				$subul.data('timers').showtimer=setTimeout(function(){
					var menuleft= dimensions.w;
					var menumoved = menuleft, newtop, doctop, winheight, topinc = 0;
					var offsetLeft = $curobj.offset().left
					menuleft=(offsetLeft+menuleft+dimensions.subulw>$(window).width())? -dimensions.w : menuleft; //calculate this sub menu's offsets from its parent
					if (menuleft < 0){ // if drop left, test to see if it'll be obscured by left window edge
						var scrollX = window.pageXOffset || (document.documentElement || document.body.parentNode || document.body).scrollLeft
						if (offsetLeft - dimensions.subulw < scrollX) // if menu will be obscured by left window edge
							menuleft = 0
					}
					menumoved = menumoved !== menuleft;

					$subul.css({top: 0}).removeClass('repositionedv');
					if(setting.repositionv && $link.offset().top + $subul.data('height') > (winheight = $(window).height()) + (doctop = $(document).scrollTop())){
						newtop = $link.outerHeight() - $subul.data('height');
						topinc = smoothmenu.repositionv($subul, $link, newtop, winheight, doctop, method);
						newtop = topinc[1];
						topinc = topinc[0];
					}
					$subul.css({left:menuleft, width:dimensions.subulw}).stop(true, true).animate({height:'show',opacity:'show'}, smoothmenu.transition.overtime, function(){this.style.removeAttribute && this.style.removeAttribute('filter');});
					if(menumoved){$subul.addClass('repositioned');} else {$subul.removeClass('repositioned');}
					if (setting.shadow){
						if(!$curobj.data('$shadow')){
							$parentshadow = $curobj.parents("li:eq(0)").data('$shadow');
							$curobj.data('$shadow', $('<div></div>').addClass('ddshadow').prependTo($parentshadow).css({zIndex: $parentshadow.css('z-index')}));  //insert shadow DIV and set it to parent node for the next shadow div
						}
						var offsets = $subul.offset();
						var shadowleft = menuleft;
						var shadowtop = $curobj.position().top - (newtop? $subul.data('height') - $link.outerHeight() - topinc : 0);
						if (smoothmenu.detectwebkit && !smoothmenu.css3support){ //in WebKit browsers, restore shadow's opacity to full
							$curobj.data('$shadow').css({opacity:1});
						}
						$curobj.data('$shadow').css({overflow: 'visible', width:dimensions.subulw, left:shadowleft, top:shadowtop}).stop(true, true).animate({height:dimensions.subulh}, smoothmenu.transition.overtime);
					}
				}, smoothmenu.showhidedelay.showdelay);
			},
			function(e, speed){
				var $shadow = $curobj.data('$shadow');
				if(method === 'hover'){restore();}
				else{smoothmenu.executelink.call(this, $, prevobjs, e);}
				clearTimeout($subul.data('timers').showtimer);
				$subul.data('timers').hidetimer=setTimeout(function(){
					$subul.stop(true, true).animate({height:'hide', opacity:'hide'}, speed || smoothmenu.transition.outtime, function(){
						method === 'toggle' && restore();
					});
					if ($shadow){
						if (!smoothmenu.css3support && smoothmenu.detectwebkit){ //in WebKit browsers, set first child shadow's opacity to 0, as "overflow:hidden" doesn't work in them
							$shadow.children('div:eq(0)').css({opacity:0});
						}
						$shadow.stop(true, true).animate({height:0}, speed || smoothmenu.transition.outtime, function(){if(method === 'toggle'){this.style.overflow = 'hidden';}});
					}
				}, smoothmenu.showhidedelay.hidedelay);
			}
		); //end hover/toggle for subheaders
	}); //end $headers.each() for subheaders
},


initmenu: function(setting){
	if (setting.mobilemql.matches){ // if mobile mode
		jQuery(function($){
			var $mainmenu = $('#' + setting.mainmenuid)
			$mainmenu.css({display: 'none !important; '}) // hide regular menu
			//setTimeout(function(){$('.ddshadow').addClass('ddsmoothmenushadowsnone')}, 150)
			if (!setting.$mainulclone){ // store a copy of the main menu's UL menu before it gets manipulated
				setting.$mainulclone = $mainmenu.find('>ul').clone()
			}
			var mobilemenustate = setting.mobilemenustate
			if (setting.contentsource == "markup" && !mobilemenustate){ // if mobile menu not built yet
				ddsmoothmenu.buildmobilemenu($, setting, setting.$mainulclone)
			}
			else if (setting.contentsource != "markup" && (!mobilemenustate || mobilemenustate == "error")){ // if Ajax content and mobile menu not built yet
				ddsmoothmenu.getajaxmenuMobile($, setting)
			}
			else{ // if mobile menu built already, just show mobile togger
				$('#ddsmoothmenu-mobiletoggle').css({display: 'block'})				
			}
		})
		return
	}
	else{ // if desktop mode
		var menustate = setting.menustate
		if (menustate && menustate != "error"){ // if menustate is anything other than "error" (meaning error fetching ajax content), it means menu's built already, so exit init()
			var $mainmenu = $('#' + setting.mainmenuid)
			$mainmenu.css({display: 'block'}) // show regular menu
			if (this.mobilecontainer.$main){ // if mobile menu defined, hide it
				this.togglemobile('close', 0)
			}
			$('#ddsmoothmenu-mobiletoggle').css({display: 'none !important'}) // hide mobile menu toggler
			return
		}
	}

	if(this.detectie6 && parseFloat(jQuery.fn.jquery) > 1.3){
		this.initmenu = function(setting){
			if (typeof setting.contentsource=="object"){ //if external ajax menu
				jQuery(function($){ddsmoothmenu.getajaxmenu($, setting, 'nobuild');});
			}
			return false;
		};
		jQuery('link[href*="ddsmoothmenu"]').attr('disabled', true);
		jQuery(function($){
			alert('You Seriously Need to Update Your Browser!\n\nDynamic Drive Smooth Navigational Menu Showing Text Only Menu(s)\n\nDEVELOPER\'s NOTE: This script will run in IE 6 when using jQuery 1.3.2 or less,\nbut not real well.');
				$('link[href*="ddsmoothmenu"]').attr('disabled', true);
		});
		return this.initmenu(setting);
	}
	var mainmenuid = '#' + setting.mainmenuid, right, down, stylestring = ['</style>\n'], stylesleft = setting.arrowswap? 4 : 2;
	function addstyles(){
		if(stylesleft){return;}
		if (typeof setting.customtheme=="object" && setting.customtheme.length==2){ //override default menu colors (default/hover) with custom set?
			var mainselector=(setting.orientation=="v")? mainmenuid : mainmenuid+', '+mainmenuid;
			stylestring.push([mainselector,' ul li a {background:',setting.customtheme[0],';}\n',
				mainmenuid,' ul li a:hover {background:',setting.customtheme[1],';}'].join(''));
		}
		stylestring.push('\n<style type="text/css">');
		stylestring.reverse();
		jQuery('head').append(stylestring.join('\n'));
	}
	if(setting.arrowswap){
		right = ddsmoothmenu.arrowimages.right[1].replace(ddsmoothmenu.overarrowre, ddsmoothmenu.overarrowaddtofilename);
		down = ddsmoothmenu.arrowimages.down[1].replace(ddsmoothmenu.overarrowre, ddsmoothmenu.overarrowaddtofilename);
		jQuery(new Image()).bind('load error', function(e){
			setting.rightswap = e.type === 'load';
			if(setting.rightswap){
				stylestring.push([mainmenuid, ' ul li a:hover .', ddsmoothmenu.arrowimages.right[0], ', ',
				mainmenuid, ' ul li a.selected .', ddsmoothmenu.arrowimages.right[0],
				' { background-image: url(', this.src, ');}'].join(''));
			}
			--stylesleft;
			addstyles();
		}).attr('src', right);
		jQuery(new Image()).bind('load error', function(e){
			setting.downswap = e.type === 'load';
			if(setting.downswap){
				stylestring.push([mainmenuid, ' ul li a:hover .', ddsmoothmenu.arrowimages.down[0], ', ',
				mainmenuid, ' ul li a.selected .', ddsmoothmenu.arrowimages.down[0],
				' { background-image: url(', this.src, ');}'].join(''));
			}
			--stylesleft;
			addstyles();
		}).attr('src', down);
	}
	jQuery(new Image()).bind('load error', function(e){
		if(e.type === 'load'){
			stylestring.push([mainmenuid+' ul li a .', ddsmoothmenu.arrowimages.right[0],' { background: url(', this.src, ') no-repeat;width:', this.width,'px;height:', this.height, 'px;}'].join(''));
		}

		--stylesleft;
		addstyles();
	}).attr('src', ddsmoothmenu.arrowimages.right[1]);
	jQuery(new Image()).bind('load error', function(e){
		if(e.type === 'load'){
			stylestring.push([mainmenuid+' ul li a .', ddsmoothmenu.arrowimages.down[0],' { background: url(', this.src, ') no-repeat;width:', this.width,'px;height:', this.height, 'px;}'].join(''));
		}
		--stylesleft;
		addstyles();
	}).attr('src', ddsmoothmenu.arrowimages.down[1]);
	setting.shadow = this.detectie6 && (setting.method === 'hover' || setting.orientation === 'v')? false : setting.shadow || this.shadow; //in IE6, always disable shadow except for horizontal toggle menus
	jQuery(document).ready(function($){
		var $mainmenu = $('#' + setting.mainmenuid)
		$mainmenu.css({display: 'block'}) // show regular menu (in case previously hidden by mobile menu activation)
		if (ddsmoothmenu.mobilecontainer.$main){ // if mobile menu defined, hide it
				ddsmoothmenu.togglemobile('close', 0)
		}
		$('#ddsmoothmenu-mobiletoggle').css({display: 'none !important'}) // hide mobile menu toggler
		if (!setting.$mainulclone){ // store a copy of the main menu's UL menu before it gets manipulated
			setting.$mainulclone = $mainmenu.find('>ul').clone()
		}
		if (setting.shadow && ddsmoothmenu.css3support){$('body').addClass('ddcss3support');}
		if (typeof setting.contentsource=="object"){ //if external ajax menu
			ddsmoothmenu.getajaxmenu($, setting);
		}
		else{ //else if markup menu
			ddsmoothmenu.buildmenu($, setting);
		}

		setting.menustate = "initialized" // set menu state to initialized
	});
},

init: function(setting){
	setting.mobilemql = (window.matchMedia)? window.matchMedia(this.mobilemediaquery) : {matches: false, addListener: function(){}}
	this.initmenu(setting)
	setting.mobilemql.addListener(function(){
		ddsmoothmenu.initmenu(setting)
	})
}
}; //end ddsmoothmenu variable


// Patch for jQuery 1.9+ which lack click toggle (deprecated in 1.8, removed in 1.9)
// Will not run if using another patch like jQuery Migrate, which also takes care of this
if(
	(function($){
		var clicktogglable = false;
		try {
			$('<a href="#"></a>').toggle(function(){}, function(){clicktogglable = true;}).trigger('click').trigger('click');
		} catch(e){}
		return !clicktogglable;
	})(jQuery)
){
	(function(){
		var toggleDisp = jQuery.fn.toggle; // There's an animation/css method named .toggle() that toggles display. Save a reference to it.
		jQuery.extend(jQuery.fn, {
			toggle: function( fn, fn2 ) {
				// The method fired depends on the arguments passed.
				if ( !jQuery.isFunction( fn ) || !jQuery.isFunction( fn2 ) ) {
					return toggleDisp.apply(this, arguments);
				}
				// Save reference to arguments for access in closure
				var args = arguments, guid = fn.guid || jQuery.guid++,
					i = 0,
					toggler = function( event ) {
						// Figure out which function to execute
						var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
						jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );
	
						// Make sure that clicks stop
						event.preventDefault();
	
						// and execute the function
						return args[ lastToggle ].apply( this, arguments ) || false;
					};

				// link all the functions, so any of them can unbind this click handler
				toggler.guid = guid;
				while ( i < args.length ) {
					args[ i++ ].guid = guid;
				}

				return this.click( toggler );
			}
		});
	})();
}

/* TECHNICAL NOTE: To overcome an intermittent layout bug in IE 9+, the script will change margin top and left for the shadows to 
   1px less than their computed values, and the first two values for the box-shadow property will be changed to 1px larger than 
   computed, ex: -1px top and left margins and 6px 6px 5px #aaa box-shadow results in what appears to be a 5px box-shadow. 
   Other browsers skip this step and it shouldn't affect you in most cases. In some rare cases it will result in 
   slightly narrower (by 1px) box shadows for IE 9+ on one or more of the drop downs. Without this, sometimes 
   the shadows could be 1px beyond their drop down resulting in a gap. This is the first of the two patches below. 
   and also relates to the MS CSSOM which uses decimal fractions of pixels for layout while only reporting rounded values. 
   There appears to be no computedStyle workaround for this one. */

//Scripted CSS Patch for IE 9+ intermittent mis-rendering of box-shadow elements (see above TECHNICAL NOTE for more info)
//And jQuery Patch for IE 9+ CSSOM re: offset Width and Height and re: getBoundingClientRect(). Both run only in IE 9 and later.
//IE 9 + uses decimal fractions of pixels internally for layout but only reports rounded values using the offset and getBounding methods.
//These are sometimes rounded inconsistently. This second patch gets the decimal values directly from computedStyle.
if(ddsmoothmenu.detectie9){
	(function($){ //begin Scripted CSS Patch
		function incdec(v, how){return parseInt(v) + how + 'px';}
		ddsmoothmenu.ie9shadow = function($elem){ //runs once
			var getter = document.defaultView.getComputedStyle($elem.get(0), null),
			curshadow = getter.getPropertyValue('box-shadow').split(' '),
			curmargin = {top: getter.getPropertyValue('margin-top'), left: getter.getPropertyValue('margin-left')};
			$('head').append(['\n<style title="ie9shadow" type="text/css">',
			'.ddcss3support .ddshadow {',
			'\tbox-shadow: ' + incdec(curshadow[0], 1) + ' ' + incdec(curshadow[1], 1) + ' ' + curshadow[2] + ' ' + curshadow[3] + ';',
			'}', '.ddcss3support .ddshadow.toplevelshadow {',
			'\topacity: ' + ($('.ddcss3support .ddshadow').css('opacity') - 0.1) + ';',
			'\tmargin-top: ' + incdec(curmargin.top, -1) + ';',
			'\tmargin-left: ' + incdec(curmargin.left, -1) + ';', '}',
			'</style>\n'].join('\n'));
			ddsmoothmenu.ie9shadow = function(){}; //becomes empty function after running once
		}; //end Scripted CSS Patch
		var jqheight = $.fn.height, jqwidth = $.fn.width; //begin jQuery Patch for IE 9+ .height() and .width()
		$.extend($.fn, {
			height: function(){
				var obj = this.get(0);
				if(this.length < 1 || arguments.length || obj === window || obj === document){
					return jqheight.apply(this, arguments);
				}
				return parseFloat(document.defaultView.getComputedStyle(obj, null).getPropertyValue('height'));
			},
			innerHeight: function(){
				if(this.length < 1){return null;}
				var val = this.height(), obj = this.get(0), getter = document.defaultView.getComputedStyle(obj, null);
				val += parseInt(getter.getPropertyValue('padding-top'));
				val += parseInt(getter.getPropertyValue('padding-bottom'));
				return val;
			},
			outerHeight: function(bool){
				if(this.length < 1){return null;}
				var val = this.innerHeight(), obj = this.get(0), getter = document.defaultView.getComputedStyle(obj, null);
				val += parseInt(getter.getPropertyValue('border-top-width'));
				val += parseInt(getter.getPropertyValue('border-bottom-width'));
				if(bool){
					val += parseInt(getter.getPropertyValue('margin-top'));
					val += parseInt(getter.getPropertyValue('margin-bottom'));
				}
				return val;
			},
			width: function(){
				var obj = this.get(0);
				if(this.length < 1 || arguments.length || obj === window || obj === document){
					return jqwidth.apply(this, arguments);
				}
				return parseFloat(document.defaultView.getComputedStyle(obj, null).getPropertyValue('width'));
			},
			innerWidth: function(){
				if(this.length < 1){return null;}
				var val = this.width(), obj = this.get(0), getter = document.defaultView.getComputedStyle(obj, null);
				val += parseInt(getter.getPropertyValue('padding-right'));
				val += parseInt(getter.getPropertyValue('padding-left'));
				return val;
			},
			outerWidth: function(bool){
				if(this.length < 1){return null;}
				var val = this.innerWidth(), obj = this.get(0), getter = document.defaultView.getComputedStyle(obj, null);
				val += parseInt(getter.getPropertyValue('border-right-width'));
				val += parseInt(getter.getPropertyValue('border-left-width'));
				if(bool){
					val += parseInt(getter.getPropertyValue('margin-right'));
					val += parseInt(getter.getPropertyValue('margin-left'));
				}
				return val;
			}
		}); //end jQuery Patch for IE 9+ .height() and .width()
	})(jQuery);
}
/*################ ddsmoothmenu.js ends ###################*/

/*################ fluid_dg.min.js starts ###################*/
// Fluid_DG_Slider v2.1 - a jQuery slideshow with mobile support, based on jQuery 1.4+
// Copyright (c) 2013 by Dhiraj Kumar - www.css-jquery-design.com
// Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
!function(t){t.fn.fluid_dg=function(i,a){function e(){return!!(navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i))||void 0}function o(){var i=t(T).width();t("li",T).removeClass("fluid_dg_visThumb"),t("li",T).each(function(){var a=t(this).position(),e=t("ul",T).outerWidth(),o=t("ul",T).offset().left,d=t("> div",T).offset().left-o;d>0?t(".fluid_dg_prevThumbs",X).removeClass("hideNav"):t(".fluid_dg_prevThumbs",X).addClass("hideNav"),e-d>i?t(".fluid_dg_nextThumbs",X).removeClass("hideNav"):t(".fluid_dg_nextThumbs",X).addClass("hideNav");var r=a.left,s=a.left+t(this).width();i>=s-d&&r-d>=0&&t(this).addClass("fluid_dg_visThumb")})}function d(){function a(){if(K=h.width(),-1!=i.height.indexOf("%")){var a=Math.round(K/(100/parseFloat(i.height)));J=""!=i.minHeight&&a<parseFloat(i.minHeight)?parseFloat(i.minHeight):a,h.css({height:J})}else"auto"==i.height?J=h.height():(J=parseFloat(i.height),h.css({height:J}));t(".fluid_dgrelative",_).css({width:K,height:J}),t(".imgLoaded",_).each(function(){var a,e,o=t(this),d=o.attr("width"),r=o.attr("height"),s=(o.index(),o.attr("data-alignment")),n=o.attr("data-portrait");if((void 0===s||!1===s||""===s)&&(s=i.alignment),(void 0===n||!1===n||""===n)&&(n=i.portrait),0==n||"false"==n)if(K/J>d/r){var l=K/d,c=.5*Math.abs(J-r*l);switch(s){case"topLeft":case"topCenter":case"topRight":a=0;break;case"centerLeft":case"center":case"centerRight":a="-"+c+"px";break;case"bottomLeft":case"bottomCenter":a="-"+2*c+"px";break;case"bottomRight":a="-"+2*c+"px"}o.css({height:r*l,"margin-left":0,"margin-right":0,"margin-top":a,position:"absolute",visibility:"visible",width:K})}else{l=J/r,c=.5*Math.abs(K-d*l);switch(s){case"topLeft":e=0;break;case"topCenter":e="-"+c+"px";break;case"topRight":e="-"+2*c+"px";break;case"centerLeft":e=0;break;case"center":e="-"+c+"px";break;case"centerRight":e="-"+2*c+"px";break;case"bottomLeft":e=0;break;case"bottomCenter":e="-"+c+"px";break;case"bottomRight":e="-"+2*c+"px"}o.css({height:J,"margin-left":e,"margin-right":e,"margin-top":0,position:"absolute",visibility:"visible",width:d*l})}else if(K/J>d/r){l=J/r,c=.5*Math.abs(K-d*l);switch(s){case"topLeft":e=0;break;case"topCenter":e=c+"px";break;case"topRight":e=2*c+"px";break;case"centerLeft":e=0;break;case"center":e=c+"px";break;case"centerRight":e=2*c+"px";break;case"bottomLeft":e=0;break;case"bottomCenter":e=c+"px";break;case"bottomRight":e=2*c+"px"}o.css({height:J,"margin-left":e,"margin-right":e,"margin-top":0,position:"absolute",visibility:"visible",width:d*l})}else{l=K/d,c=.5*Math.abs(J-r*l);switch(s){case"topLeft":case"topCenter":case"topRight":a=0;break;case"centerLeft":case"center":case"centerRight":a=c+"px";break;case"bottomLeft":case"bottomCenter":a=2*c+"px";break;case"bottomRight":a=2*c+"px"}o.css({height:r*l,"margin-left":0,"margin-right":0,"margin-top":a,position:"absolute",visibility:"visible",width:K})}})}var e;1==A?(clearTimeout(e),e=setTimeout(a,200)):a(),A=!0}function r(){t("iframe",u).each(function(){t(".fluid_dg_caption",u).show();var a=t(this),e=a.attr("data-src");a.attr("src",e);var o=i.imagePath+"blank.gif",d=new Image;if(d.src=o,-1!=i.height.indexOf("%")){var r=Math.round(K/(100/parseFloat(i.height)));J=""!=i.minHeight&&r<parseFloat(i.minHeight)?parseFloat(i.minHeight):r}else J="auto"==i.height?h.height():parseFloat(i.height);a.after(t(d).attr({class:"imgFake",width:K,height:J}));var s=a.clone();a.remove(),t(d).bind("click",function(){"absolute"==t(this).css("position")?(t(this).remove(),-1!=e.indexOf("vimeo")||-1!=e.indexOf("youtube")?-1!=e.indexOf("?")?autoplay="&autoplay=1":autoplay="?autoplay=1":-1!=e.indexOf("dailymotion")&&(-1!=e.indexOf("?")?autoplay="&autoPlay=1":autoplay="?autoPlay=1"),s.attr("src",e+autoplay),Q=!0):(t(this).css({position:"absolute",top:0,left:0,zIndex:10}).after(s),s.css({position:"absolute",top:0,left:0,zIndex:9}))})})}function s(t){for(var i,a,e=t.length;e;i=parseInt(Math.random()*e),a=t[--e],t[e]=t[i],t[i]=a);return t}function n(){if(t(T).length&&!t(k).length){var i,a=t(T).outerWidth(),e=(t("ul > li",T).outerWidth(),t("li.fluid_dgcurrent",T).length?t("li.fluid_dgcurrent",T).position():""),d=t("ul > li",T).length*t("ul > li",T).outerWidth(),r=t("ul",T).offset().left,s=t("> div",T).offset().left;i=0>r?"-"+(s-r):s-r,1==et&&(t("ul",T).width(t("ul > li",T).length*t("ul > li",T).outerWidth()),t(T).length&&!t(k).lenght&&h.css({marginBottom:t(T).outerHeight()}),o(),t("ul",T).width(t("ul > li",T).length*t("ul > li",T).outerWidth()),t(T).length&&!t(k).lenght&&h.css({marginBottom:t(T).outerHeight()})),et=!1;var n=t("li.fluid_dgcurrent",T).length?e.left:"",l=t("li.fluid_dgcurrent",T).length?e.left+t("li.fluid_dgcurrent",T).outerWidth():"";n<t("li.fluid_dgcurrent",T).outerWidth()&&(n=0),l-i>a?d>n+a?t("ul",T).animate({"margin-left":"-"+n+"px"},500,o):t("ul",T).animate({"margin-left":"-"+(t("ul",T).outerWidth()-a)+"px"},500,o):0>n-i?t("ul",T).animate({"margin-left":"-"+n+"px"},500,o):(t("ul",T).css({"margin-left":"auto","margin-right":"auto"}),setTimeout(o,100))}}function l(){$=0;var a=t(".fluid_dg_bar_cont",X).width(),e=t(".fluid_dg_bar_cont",X).height();if("pie"!=f)switch(V){case"leftToRight":t("#"+p).css({right:a});break;case"rightToLeft":t("#"+p).css({left:a});break;case"topToBottom":t("#"+p).css({bottom:e});break;case"bottomToTop":t("#"+p).css({top:e})}else it.clearRect(0,0,i.pieDiameter,i.pieDiameter)}function c(a){m.addClass("fluid_dgsliding"),Q=!1;var o=parseFloat(t("div.fluid_dgSlide.fluid_dgcurrent",_).index());if(a>0)var g=a-1;else if(o==q-1)g=0;else g=o+1;var v=t(".fluid_dgSlide:eq("+g+")",_),b=t(".fluid_dgSlide:eq("+(g+1)+")",_).addClass("fluid_dgnext");if(o!=g+1&&b.hide(),t(".fluid_dgContent",u).fadeOut(600),t(".fluid_dg_caption",u).show(),t(".fluid_dgrelative",v).append(t("> div ",m).eq(g).find("> div.fluid_dg_effected")),t(".fluid_dg_target_content .fluid_dgContent:eq("+g+")",h).append(t("> div ",m).eq(g).find("> div")),t(".imgLoaded",v).length){if(L.length>g+1&&!t(".imgLoaded",b).length){var y=L[g+1],C=new Image;C.src=y,b.prepend(t(C).attr("class","imgLoaded").css("visibility","hidden")),C.onload=function(){_t=C.naturalWidth,vt=C.naturalHeight,t(C).attr("data-alignment",B[g+1]).attr("data-portrait",S[g+1]),t(C).attr("width",_t),t(C).attr("height",vt),d()}}i.onLoaded.call(this),t(".fluid_dg_loader",h).is(":visible")?t(".fluid_dg_loader",h).fadeOut(400):(t(".fluid_dg_loader",h).css({visibility:"hidden"}),t(".fluid_dg_loader",h).fadeOut(400,function(){t(".fluid_dg_loader",h).css({visibility:"visible"})}));var w,x,R,F,M,O=i.rows,I=i.cols,H=1,A=0,W=new Array("simpleFade","curtainTopLeft","curtainTopRight","curtainBottomLeft","curtainBottomRight","curtainSliceLeft","curtainSliceRight","blindCurtainTopLeft","blindCurtainTopRight","blindCurtainBottomLeft","blindCurtainBottomRight","blindCurtainSliceBottom","blindCurtainSliceTop","stampede","mosaic","mosaicReverse","mosaicRandom","mosaicSpiral","mosaicSpiralReverse","topLeftBottomRight","bottomRightTopLeft","bottomLeftTopRight","topRightBottomLeft","scrollLeft","scrollRight","scrollTop","scrollBottom","scrollHorz");marginLeft=0,marginTop=0,opacityOnGrid=0,1==i.opacityOnGrid?opacityOnGrid=0:opacityOnGrid=1;var D=t(" > div",m).eq(g).attr("data-fx");if("random"==(F=e()&&""!=i.mobileFx&&"default"!=i.mobileFx?i.mobileFx:void 0!==D&&!1!==D&&"default"!==D?D:i.fx)?F=(F=s(W))[0]:(F=F).indexOf(",")>0&&(F=(F=s(F=(F=F.replace(/ /g,"")).split(",")))[0]),dataEasing=t(" > div",m).eq(g).attr("data-easing"),mobileEasing=t(" > div",m).eq(g).attr("data-mobileEasing"),M=e()&&""!=i.mobileEasing&&"default"!=i.mobileEasing?"undefined"!=typeof mobileEasing&&!1!==mobileEasing&&"default"!==mobileEasing?mobileEasing:i.mobileEasing:"undefined"!=typeof dataEasing&&!1!==dataEasing&&"default"!==dataEasing?dataEasing:i.easing,void 0!==(w=t(" > div",m).eq(g).attr("data-slideOn"))&&!1!==w)N=w;else if("random"==i.slideOn){var N=new Array("next","prev");N=(N=s(N))[0]}else N=i.slideOn;var G=t(" > div",m).eq(g).attr("data-time");x=void 0!==G&&!1!==G&&""!==G?parseFloat(G):i.time;var j=t(" > div",m).eq(g).attr("data-transPeriod");switch(R=void 0!==j&&!1!==j&&""!==j?parseFloat(j):i.transPeriod,t(m).hasClass("fluid_dgstarted")||(F="simpleFade",N="next",M="",R=400,t(m).addClass("fluid_dgstarted")),F){case"simpleFade":I=1,O=1;break;case"curtainTopLeft":case"curtainTopRight":case"curtainBottomLeft":case"curtainBottomRight":case"curtainSliceLeft":case"curtainSliceRight":I=0==i.slicedCols?i.cols:i.slicedCols,O=1;break;case"blindCurtainTopLeft":case"blindCurtainTopRight":case"blindCurtainBottomLeft":case"blindCurtainBottomRight":case"blindCurtainSliceTop":case"blindCurtainSliceBottom":O=0==i.slicedRows?i.rows:i.slicedRows,I=1;break;case"stampede":A="-"+R;break;case"mosaic":case"mosaicReverse":A=i.gridDifference;break;case"mosaicRandom":break;case"mosaicSpiral":case"mosaicSpiralReverse":A=i.gridDifference,H=1.7;break;case"topLeftBottomRight":case"bottomRightTopLeft":case"bottomLeftTopRight":case"topRightBottomLeft":A=i.gridDifference,H=6;break;case"scrollLeft":case"scrollRight":case"scrollTop":case"scrollBottom":I=1,O=1;break;case"scrollHorz":I=1,O=1}for(var Y,Z,at=0,et=O*I,ot=K-Math.floor(K/I)*I,dt=J-Math.floor(J/O)*O,rt=0,st=0,nt=new Array,lt=new Array,ct=new Array;et>at;){nt.push(at),lt.push(at),P.append('<div class="fluid_dgappended" style="display:none; overflow:hidden; position:absolute; z-index:1000" />');var ht=t(".fluid_dgappended:eq("+at+")",_);"scrollLeft"==F||"scrollRight"==F||"scrollTop"==F||"scrollBottom"==F||"scrollHorz"==F?U.eq(g).clone().show().appendTo(ht):"next"==N?U.eq(g).clone().show().appendTo(ht):U.eq(o).clone().show().appendTo(ht),Y=ot>at%I?1:0,at%I==0&&(rt=0),Z=Math.floor(at/I)<dt?1:0,ht.css({height:Math.floor(J/O+Z+1),left:rt,top:st,width:Math.floor(K/I+Y+1)}),t("> .fluid_dgSlide",ht).css({height:J,"margin-left":"-"+rt+"px","margin-top":"-"+st+"px",width:K}),rt=rt+ht.width()-1,at%I==I-1&&(st=st+ht.height()-1),at++}switch(F){case"curtainTopLeft":case"curtainBottomLeft":case"curtainSliceLeft":break;case"curtainTopRight":case"curtainBottomRight":case"curtainSliceRight":nt=nt.reverse();break;case"blindCurtainTopLeft":break;case"blindCurtainBottomLeft":nt=nt.reverse();break;case"blindCurtainSliceTop":case"blindCurtainTopRight":break;case"blindCurtainBottomRight":case"blindCurtainSliceBottom":nt=nt.reverse();break;case"stampede":nt=s(nt);break;case"mosaic":break;case"mosaicReverse":nt=nt.reverse();break;case"mosaicRandom":nt=s(nt);break;case"mosaicSpiral":var ft=O/2,ut=0;for(gt=0;ft>gt;gt++){for(pt=gt,mt=gt;I-gt-1>mt;mt++)ct[ut++]=pt*I+mt;for(mt=I-gt-1,pt=gt;O-gt-1>pt;pt++)ct[ut++]=pt*I+mt;for(pt=O-gt-1,mt=I-gt-1;mt>gt;mt--)ct[ut++]=pt*I+mt;for(mt=gt,pt=O-gt-1;pt>gt;pt--)ct[ut++]=pt*I+mt}nt=ct;break;case"mosaicSpiralReverse":var gt;ft=O/2,ut=et-1;for(gt=0;ft>gt;gt++){for(pt=gt,mt=gt;I-gt-1>mt;mt++)ct[ut--]=pt*I+mt;for(mt=I-gt-1,pt=gt;O-gt-1>pt;pt++)ct[ut--]=pt*I+mt;for(pt=O-gt-1,mt=I-gt-1;mt>gt;mt--)ct[ut--]=pt*I+mt;for(mt=gt,pt=O-gt-1;pt>gt;pt--)ct[ut--]=pt*I+mt}nt=ct;break;case"topLeftBottomRight":for(var pt=0;O>pt;pt++)for(var mt=0;I>mt;mt++)ct.push(mt+pt);lt=ct;break;case"bottomRightTopLeft":for(pt=0;O>pt;pt++)for(mt=0;I>mt;mt++)ct.push(mt+pt);lt=ct.reverse();break;case"bottomLeftTopRight":for(pt=O;pt>0;pt--)for(mt=0;I>mt;mt++)ct.push(mt+pt);lt=ct;break;case"topRightBottomLeft":for(pt=0;O>pt;pt++)for(mt=I;mt>0;mt--)ct.push(mt+pt);lt=ct}t.each(nt,function(a,e){function d(){if(t(this).addClass("fluid_dgeased"),t(".fluid_dgeased",_).length>=0&&t(T).css({visibility:"visible"}),t(".fluid_dgeased",_).length==et){n(),t(".moveFromLeft, .moveFromRight, .moveFromTop, .moveFromBottom, .fadeIn, .fadeFromLeft, .fadeFromRight, .fadeFromTop, .fadeFromBottom",u).each(function(){t(this).css("visibility","hidden")}),U.eq(g).show().css("z-index","999").removeClass("fluid_dgnext").addClass("fluid_dgcurrent"),U.eq(o).css("z-index","1").removeClass("fluid_dgcurrent"),t(".fluid_dgContent",u).eq(g).addClass("fluid_dgcurrent"),o>=0&&t(".fluid_dgContent",u).eq(o).removeClass("fluid_dgcurrent"),i.onEndTransition.call(this),"hide"!=t("> div",m).eq(g).attr("data-video")&&t(".fluid_dgContent.fluid_dgcurrent .imgFake",u).length&&t(".fluid_dgContent.fluid_dgcurrent .imgFake",u).click();var a=U.eq(g).find(".fadeIn").length,e=t(".fluid_dgContent",u).eq(g).find(".moveFromLeft, .moveFromRight, .moveFromTop, .moveFromBottom, .fadeIn, .fadeFromLeft, .fadeFromRight, .fadeFromTop, .fadeFromBottom").length;0!=a&&t(".fluid_dgSlide.fluid_dgcurrent .fadeIn",u).each(function(){if(""!=t(this).attr("data-easing"))var i=t(this).attr("data-easing");else i=M;var e=t(this);if(void 0===e.attr("data-outerWidth")||!1===e.attr("data-outerWidth")||""===e.attr("data-outerWidth")){var o=e.outerWidth();e.attr("data-outerWidth",o)}else o=e.attr("data-outerWidth");if(void 0===e.attr("data-outerHeight")||!1===e.attr("data-outerHeight")||""===e.attr("data-outerHeight")){var d=e.outerHeight();e.attr("data-outerHeight",d)}else d=e.attr("data-outerHeight");var r=e.position(),s=(r.left,r.top,e.attr("class")),n=e.index();e.parents(".fluid_dgrelative").outerHeight(),e.parents(".fluid_dgrelative").outerWidth(),-1!=s.indexOf("fadeIn")?e.animate({opacity:0},0).css("visibility","visible").delay(x/a*(.1*(n-1))).animate({opacity:1},x/a*.15,i):e.css("visibility","visible")}),t(".fluid_dgContent.fluid_dgcurrent",u).show(),0!=e&&t(".fluid_dgContent.fluid_dgcurrent .moveFromLeft, .fluid_dgContent.fluid_dgcurrent .moveFromRight, .fluid_dgContent.fluid_dgcurrent .moveFromTop, .fluid_dgContent.fluid_dgcurrent .moveFromBottom, .fluid_dgContent.fluid_dgcurrent .fadeIn, .fluid_dgContent.fluid_dgcurrent .fadeFromLeft, .fluid_dgContent.fluid_dgcurrent .fadeFromRight, .fluid_dgContent.fluid_dgcurrent .fadeFromTop, .fluid_dgContent.fluid_dgcurrent .fadeFromBottom",u).each(function(){if(""!=t(this).attr("data-easing"))var i=t(this).attr("data-easing");else i=M;var a=t(this),o=a.position(),d=(o.left,o.top,a.attr("class")),r=a.index(),s=a.outerHeight();-1!=d.indexOf("moveFromLeft")?(a.css({left:"-"+K+"px",right:"auto"}),a.css("visibility","visible").delay(x/e*(.1*(r-1))).animate({left:o.left},x/e*.15,i)):-1!=d.indexOf("moveFromRight")?(a.css({left:K+"px",right:"auto"}),a.css("visibility","visible").delay(x/e*(.1*(r-1))).animate({left:o.left},x/e*.15,i)):-1!=d.indexOf("moveFromTop")?(a.css({top:"-"+J+"px",bottom:"auto"}),a.css("visibility","visible").delay(x/e*(.1*(r-1))).animate({top:o.top},x/e*.15,i,function(){a.css({})})):-1!=d.indexOf("moveFromBottom")?(a.css({top:K+"px",bottom:"auto"}),a.css("visibility","visible").delay(x/e*(.1*(r-1))).animate({top:o.top},x/e*.15,i)):-1!=d.indexOf("fadeFromLeft")?(a.animate({opacity:0},0).css({left:"-"+K+"px",right:"auto"}),a.css("visibility","visible").delay(x/e*(.1*(r-1))).animate({left:o.left,opacity:1},x/e*.15,i)):-1!=d.indexOf("fadeFromRight")?(a.animate({opacity:0},0).css({left:K+"px",right:"auto"}),a.css("visibility","visible").delay(x/e*(.1*(r-1))).animate({left:o.left,opacity:1},x/e*.15,i)):-1!=d.indexOf("fadeFromTop")?(a.animate({opacity:0},0).css({top:"-"+J+"px",bottom:"auto"}),a.css("visibility","visible").delay(x/e*(.1*(r-1))).animate({top:o.top,opacity:1},x/e*.15,i,function(){a.css({top:"auto",bottom:0})})):-1!=d.indexOf("fadeFromBottom")?(a.animate({opacity:0},0).css({bottom:"-"+s+"px"}),a.css("visibility","visible").delay(x/e*(.1*(r-1))).animate({bottom:"0",opacity:1},x/e*.15,i)):-1!=d.indexOf("fadeIn")?a.animate({opacity:0},0).css("visibility","visible").delay(x/e*(.1*(r-1))).animate({opacity:1},x/e*.15,i):a.css("visibility","visible")}),t(".fluid_dgappended",_).remove(),m.removeClass("fluid_dgsliding"),U.eq(o).hide();var d,s=t(".fluid_dg_bar_cont",X).width(),h=t(".fluid_dg_bar_cont",X).height();d="pie"!=f?.05:.005,t("#"+p).animate({opacity:i.loaderOpacity},200),E=setInterval(function(){if(m.hasClass("stopped")&&clearInterval(E),"pie"!=f)switch(1.002>=$&&!m.hasClass("stopped")&&!m.hasClass("paused")&&!m.hasClass("hovered")?$+=d:1>=$&&(m.hasClass("stopped")||m.hasClass("paused")||m.hasClass("stopped")||m.hasClass("hovered"))?$=$:m.hasClass("stopped")||m.hasClass("paused")||m.hasClass("hovered")||(clearInterval(E),r(),t("#"+p).animate({opacity:0},200,function(){clearTimeout(z),z=setTimeout(l,v),c(),i.onStartLoading.call(this)})),V){case"leftToRight":t("#"+p).animate({right:s-s*$},x*d,"linear");break;case"rightToLeft":t("#"+p).animate({left:s-s*$},x*d,"linear");break;case"topToBottom":t("#"+p).animate({bottom:h-h*$},x*d,"linear");break;case"bottomToTop":t("#"+p).animate({bottom:h-h*$},x*d,"linear")}else tt=$,it.clearRect(0,0,i.pieDiameter,i.pieDiameter),it.globalCompositeOperation="destination-over",it.beginPath(),it.arc(i.pieDiameter/2,i.pieDiameter/2,i.pieDiameter/2-i.loaderStroke,0,2*Math.PI,!1),it.lineWidth=i.loaderStroke,it.strokeStyle=i.loaderBgColor,it.stroke(),it.closePath(),it.globalCompositeOperation="source-over",it.beginPath(),it.arc(i.pieDiameter/2,i.pieDiameter/2,i.pieDiameter/2-i.loaderStroke,0,2*Math.PI*tt,!1),it.lineWidth=i.loaderStroke-2*i.loaderPadding,it.strokeStyle=i.loaderColor,it.stroke(),it.closePath(),1.002>=$&&!m.hasClass("stopped")&&!m.hasClass("paused")&&!m.hasClass("hovered")?$+=d:1>=$&&(m.hasClass("stopped")||m.hasClass("paused")||m.hasClass("hovered"))?$=$:m.hasClass("stopped")||m.hasClass("paused")||m.hasClass("hovered")||(clearInterval(E),r(),t("#"+p+", .fluid_dg_canvas_wrap",X).animate({opacity:0},200,function(){clearTimeout(z),z=setTimeout(l,v),c(),i.onStartLoading.call(this)}))},x*d)}}switch(Y=ot>e%I?1:0,e%I==0&&(rt=0),Z=Math.floor(e/I)<dt?1:0,F){case"simpleFade":height=J,width=K,opacityOnGrid=0;break;case"curtainTopLeft":case"curtainTopRight":height=0,width=Math.floor(K/I+Y+1),marginTop="-"+Math.floor(J/O+Z+1)+"px";break;case"curtainBottomLeft":case"curtainBottomRight":height=0,width=Math.floor(K/I+Y+1),marginTop=Math.floor(J/O+Z+1)+"px";break;case"curtainSliceLeft":case"curtainSliceRight":height=0,width=Math.floor(K/I+Y+1),marginTop=e%2==0?Math.floor(J/O+Z+1)+"px":"-"+Math.floor(J/O+Z+1)+"px";break;case"blindCurtainTopLeft":height=Math.floor(J/O+Z+1),width=0,marginLeft="-"+Math.floor(K/I+Y+1)+"px";break;case"blindCurtainTopRight":height=Math.floor(J/O+Z+1),width=0,marginLeft=Math.floor(K/I+Y+1)+"px";break;case"blindCurtainBottomLeft":height=Math.floor(J/O+Z+1),width=0,marginLeft="-"+Math.floor(K/I+Y+1)+"px";break;case"blindCurtainBottomRight":height=Math.floor(J/O+Z+1),width=0,marginLeft=Math.floor(K/I+Y+1)+"px";break;case"blindCurtainSliceBottom":case"blindCurtainSliceTop":height=Math.floor(J/O+Z+1),width=0,marginLeft=e%2==0?"-"+Math.floor(K/I+Y+1)+"px":Math.floor(K/I+Y+1)+"px";break;case"stampede":height=0,width=0,marginLeft=.2*K*(a%I-(I-Math.floor(I/2)))+"px",marginTop=.2*J*(Math.floor(a/I)+1-(O-Math.floor(O/2)))+"px";break;case"mosaic":height=0,width=0;break;case"mosaicReverse":height=0,width=0,marginLeft=Math.floor(K/I+Y+1)+"px",marginTop=Math.floor(J/O+Z+1)+"px";break;case"mosaicRandom":case"mosaicSpiral":case"mosaicSpiralReverse":height=0,width=0,marginLeft=.5*Math.floor(K/I+Y+1)+"px",marginTop=.5*Math.floor(J/O+Z+1)+"px";break;case"topLeftBottomRight":height=0,width=0;break;case"bottomRightTopLeft":height=0,width=0,marginLeft=Math.floor(K/I+Y+1)+"px",marginTop=Math.floor(J/O+Z+1)+"px";break;case"bottomLeftTopRight":height=0,width=0,marginLeft=0,marginTop=Math.floor(J/O+Z+1)+"px";break;case"topRightBottomLeft":height=0,width=0,marginLeft=Math.floor(K/I+Y+1)+"px",marginTop=0;break;case"scrollRight":height=J,width=K,marginLeft=-K;break;case"scrollLeft":height=J,width=K,marginLeft=K;break;case"scrollTop":height=J,width=K,marginTop=J;break;case"scrollBottom":height=J,width=K,marginTop=-J;break;case"scrollHorz":height=J,width=K,marginLeft=0==o&&g==q-1?-K:g>o||o==q-1&&0==g?K:-K}var s=t(".fluid_dgappended:eq("+e+")",_);void 0!==E&&(clearInterval(E),clearTimeout(z),z=setTimeout(l,R+A)),t(k).length&&(t(".fluid_dg_pag li",h).removeClass("fluid_dgcurrent"),t(".fluid_dg_pag li",h).eq(g).addClass("fluid_dgcurrent")),t(T).length&&(t("li",T).removeClass("fluid_dgcurrent"),t("li",T).eq(g).addClass("fluid_dgcurrent"),t("li",T).not(".fluid_dgcurrent").find("img").animate({opacity:.5},0),t("li.fluid_dgcurrent img",T).animate({opacity:1},0),t("li",T).hover(function(){t("img",this).stop(!0,!1).animate({opacity:1},150)},function(){t(this).hasClass("fluid_dgcurrent")||t("img",this).stop(!0,!1).animate({opacity:.5},150)}));var v=parseFloat(R)+parseFloat(A);"scrollLeft"==F||"scrollRight"==F||"scrollTop"==F||"scrollBottom"==F||"scrollHorz"==F?(i.onStartTransition.call(this),v=0,s.delay((R+A)/et*lt[a]*H*.5).css({display:"block",height:height,"margin-left":marginLeft,"margin-top":marginTop,width:width}).animate({height:Math.floor(J/O+Z+1),"margin-top":0,"margin-left":0,width:Math.floor(K/I+Y+1)},R-A,M,d),U.eq(o).delay((R+A)/et*lt[a]*H*.5).animate({"margin-left":-1*marginLeft,"margin-top":-1*marginTop},R-A,M,function(){t(this).css({"margin-top":0,"margin-left":0})})):(i.onStartTransition.call(this),v=parseFloat(R)+parseFloat(A),"next"==N?s.delay((R+A)/et*lt[a]*H*.5).css({display:"block",height:height,"margin-left":marginLeft,"margin-top":marginTop,width:width,opacity:opacityOnGrid}).animate({height:Math.floor(J/O+Z+1),"margin-top":0,"margin-left":0,opacity:1,width:Math.floor(K/I+Y+1)},R-A,M,d):(U.eq(g).show().css("z-index","999").addClass("fluid_dgcurrent"),U.eq(o).css("z-index","1").removeClass("fluid_dgcurrent"),t(".fluid_dgContent",u).eq(g).addClass("fluid_dgcurrent"),t(".fluid_dgContent",u).eq(o).removeClass("fluid_dgcurrent"),s.delay((R+A)/et*lt[a]*H*.5).css({display:"block",height:Math.floor(J/O+Z+1),"margin-top":0,"margin-left":0,opacity:1,width:Math.floor(K/I+Y+1)}).animate({height:height,"margin-left":marginLeft,"margin-top":marginTop,width:width,opacity:opacityOnGrid},R-A,M,d)))})}else{var _t,vt,bt=L[g],yt=new Image;yt.src=bt,v.css("visibility","hidden"),v.prepend(t(yt).attr("class","imgLoaded").css("visibility","hidden")),t(yt).get(0).complete&&"0"!=_t&&"0"!=vt&&void 0!==_t&&!1!==_t&&void 0!==vt&&!1!==vt||(t(".fluid_dg_loader",h).delay(500).fadeIn(400),yt.onload=function(){_t=yt.naturalWidth,vt=yt.naturalHeight,t(yt).attr("data-alignment",B[g]).attr("data-portrait",S[g]),t(yt).attr("width",_t),t(yt).attr("height",vt),_.find(".fluid_dgSlide_"+g).hide().css("visibility","visible"),d(),c(g+1)})}}t.support.borderRadius=!1,t.each(["borderRadius","BorderRadius","MozBorderRadius","WebkitBorderRadius","OBorderRadius","KhtmlBorderRadius"],function(){void 0!==document.body.style[this]&&(t.support.borderRadius=!0)});i=t.extend({},{alignment:"center",autoAdvance:!0,mobileAutoAdvance:!0,barDirection:"leftToRight",barPosition:"bottom",cols:6,easing:"easeInOutExpo",mobileEasing:"",fx:"random",mobileFx:"",gridDifference:250,height:"50%",imagePath:"images/",hover:!0,loader:"pie",loaderColor:"#eeeeee",loaderBgColor:"#222222",loaderOpacity:.8,loaderPadding:2,loaderStroke:7,minHeight:"200px",navigation:!0,navigationHover:!0,mobileNavHover:!0,opacityOnGrid:!1,overlayer:!0,pagination:!0,playPause:!0,pauseOnClick:!0,pieDiameter:38,piePosition:"rightTop",portrait:!1,rows:4,slicedCols:12,slicedRows:8,slideOn:"random",thumbnails:!1,time:7e3,transPeriod:1500,onEndTransition:function(){},onLoaded:function(){},onStartLoading:function(){},onStartTransition:function(){}},i);var h=t(this).addClass("fluid_dg_wrap");h.wrapInner('<div class="fluid_dg_src" />').wrapInner('<div class="fluid_dg_fakehover" />');var f,u=t(".fluid_dg_fakehover",h),g=h;u.append('<div class="fluid_dg_target"></div>'),1==i.overlayer&&u.append('<div class="fluid_dg_overlayer"></div>'),u.append('<div class="fluid_dg_target_content"></div>'),"pie"==(f="pie"!=i.loader||t.support.borderRadius?i.loader:"bar")?u.append('<div class="fluid_dg_pie"></div>'):"bar"==f?u.append('<div class="fluid_dg_bar"></div>'):u.append('<div class="fluid_dg_bar" style="display:none"></div>'),1==i.playPause&&u.append('<div class="fluid_dg_commands"></div>'),1==i.navigation&&u.append('<div class="fluid_dg_prev"><span></span></div>').append('<div class="fluid_dg_next"><span></span></div>'),1==i.thumbnails&&h.append('<div class="fluid_dg_thumbs_cont" />'),1==i.thumbnails&&1!=i.pagination&&t(".fluid_dg_thumbs_cont",h).wrap("<div />").wrap('<div class="fluid_dg_thumbs" />').wrap("<div />").wrap('<div class="fluid_dg_command_wrap" />'),1==i.pagination&&h.append('<div class="fluid_dg_pag"></div>'),t(".fluid_dg_caption",h).each(function(){t(this).wrapInner("<div />")});var p="pie_"+h.index(),m=t(".fluid_dg_src",h),_=t(".fluid_dg_target",h),v=t(".fluid_dg_target_content",h),b=t(".fluid_dg_pie",h),y=t(".fluid_dg_bar",h),C=t(".fluid_dg_prev",h),w=t(".fluid_dg_next",h),x=t(".fluid_dg_commands",h),k=t(".fluid_dg_pag",h),T=t(".fluid_dg_thumbs_cont",h),L=new Array;t("> div",m).each(function(){L.push(t(this).attr("data-src"))});var R=new Array;t("> div",m).each(function(){t(this).attr("data-link")?R.push(t(this).attr("data-link")):R.push("")});var F=new Array;t("> div",m).each(function(){t(this).attr("data-target")?F.push(t(this).attr("data-target")):F.push("")});var S=new Array;t("> div",m).each(function(){t(this).attr("data-portrait")?S.push(t(this).attr("data-portrait")):S.push("")});var B=new Array;t("> div",m).each(function(){t(this).attr("data-alignment")?B.push(t(this).attr("data-alignment")):B.push("")});var M=new Array;t("> div",m).each(function(){t(this).attr("data-thumb")?M.push(t(this).attr("data-thumb")):M.push("")});var O,q=L.length;for(1>=q&&(i.autoAdvance=!1,i.mobileAutoAdvance=!1,i.navigation=!1,i.navigationHover=!0,i.mobileNavHover=!0,i.pagination=!1,i.playPause=!1,i.thumbnails=!1),t(v).append('<div class="fluid_dgContents" />'),O=0;q>O;O++)if(t(".fluid_dgContents",v).append('<div class="fluid_dgContent" />'),""!=R[O]){var I=t("> div ",m).eq(O).attr("data-box");I=void 0!==I&&!1!==I&&""!=I?'data-box="'+t("> div ",m).eq(O).attr("data-box")+'"':"",t(".fluid_dg_target_content .fluid_dgContent:eq("+O+")",h).append('<a class="fluid_dg_link" href="'+R[O]+'" '+I+' target="'+F[O]+'"></a>')}t(".fluid_dg_caption",h).each(function(){var i=t(this).parent().index(),a=h.find(".fluid_dgContent").eq(i);t(this).appendTo(a)}),_.append('<div class="fluid_dgCont" />');var H,A,P=t(".fluid_dgCont",h);for(H=0;q>H;H++){P.append('<div class="fluid_dgSlide fluid_dgSlide_'+H+'" />');var W=t("> div:eq("+H+")",m);_.find(".fluid_dgSlide_"+H).clone(W)}t(window).bind("load resize pageshow",function(){n(),o()}),P.append('<div class="fluid_dgSlide fluid_dgSlide_'+H+'" />'),h.show();var D,E,z,N,G,j,Q,K=_.width(),J=_.height();if(t(window).bind("resize pageshow",function(){1==A&&d(),t("ul",T).animate({"margin-top":0},0,n),m.hasClass("paused")||(m.addClass("paused"),t(".fluid_dg_stop",X).length?(t(".fluid_dg_stop",X).hide(),t(".fluid_dg_play",X).show(),"none"!=f&&t("#"+p).hide()):"none"!=f&&t("#"+p).hide(),clearTimeout(D),D=setTimeout(function(){m.removeClass("paused"),t(".fluid_dg_play",X).length?(t(".fluid_dg_play",X).hide(),t(".fluid_dg_stop",X).show(),"none"!=f&&t("#"+p).fadeIn()):"none"!=f&&t("#"+p).fadeIn()},1500))}),0==(N=e()&&""!=i.mobileAutoAdvance?i.mobileAutoAdvance:i.autoAdvance)&&m.addClass("paused"),G=e()&&""!=i.mobileNavHover?i.mobileNavHover:i.navigationHover,0!=m.length){var U=t(".fluid_dgSlide",_);U.wrapInner('<div class="fluid_dgrelative" />');var V=i.barDirection,X=h;t("iframe",u).each(function(){var i=t(this),a=i.attr("src");i.attr("data-src",a);var e=i.parent().index(".fluid_dg_src > div");t(".fluid_dg_target_content .fluid_dgContent:eq("+e+")",h).append(i)}),r(),1==i.hover&&(e()||u.hover(function(){m.addClass("hovered")},function(){m.removeClass("hovered")})),1==G&&(t(C,h).animate({opacity:0},0),t(w,h).animate({opacity:0},0),t(x,h).animate({opacity:0},0),e()?(t(document).on("vmouseover",g,function(){t(C,h).animate({opacity:1},200),t(w,h).animate({opacity:1},200),t(x,h).animate({opacity:1},200)}),t(document).on("vmouseout",g,function(){t(C,h).delay(500).animate({opacity:0},200),t(w,h).delay(500).animate({opacity:0},200),t(x,h).delay(500).animate({opacity:0},200)})):u.hover(function(){t(C,h).animate({opacity:1},200),t(w,h).animate({opacity:1},200),t(x,h).animate({opacity:1},200)},function(){t(C,h).animate({opacity:0},200),t(w,h).animate({opacity:0},200),t(x,h).animate({opacity:0},200)})),X.on("click",".fluid_dg_stop",function(){N=!1,m.addClass("paused"),t(".fluid_dg_stop",X).length?(t(".fluid_dg_stop",X).hide(),t(".fluid_dg_play",X).show(),"none"!=f&&t("#"+p).hide()):"none"!=f&&t("#"+p).hide()}),X.on("click",".fluid_dg_play",function(){N=!0,m.removeClass("paused"),t(".fluid_dg_play",X).length?(t(".fluid_dg_play",X).hide(),t(".fluid_dg_stop",X).show(),"none"!=f&&t("#"+p).show()):"none"!=f&&t("#"+p).show()}),1==i.pauseOnClick&&t(".fluid_dg_target_content",u).mouseup(function(){N=!1,m.addClass("paused"),t(".fluid_dg_stop",X).hide(),t(".fluid_dg_play",X).show(),t("#"+p).hide()}),t(".fluid_dgContent, .imgFake",u).hover(function(){j=!0},function(){j=!1}),t(".fluid_dgContent, .imgFake",u).bind("click",function(){1==Q&&1==j&&(N=!1,t(".fluid_dg_caption",u).hide(),m.addClass("paused"),t(".fluid_dg_stop",X).hide(),t(".fluid_dg_play",X).show(),t("#"+p).hide())})}if("pie"!=f){switch(y.append('<span class="fluid_dg_bar_cont" />'),t(".fluid_dg_bar_cont",y).animate({opacity:i.loaderOpacity},0).css({position:"absolute",left:0,right:0,top:0,bottom:0,"background-color":i.loaderBgColor}).append('<span id="'+p+'" />'),t("#"+p).animate({opacity:0},0),(Y=t("#"+p)).css({position:"absolute","background-color":i.loaderColor}),i.barPosition){case"left":y.css({right:"auto",width:i.loaderStroke});break;case"right":y.css({left:"auto",width:i.loaderStroke});break;case"top":y.css({bottom:"auto",height:i.loaderStroke});break;case"bottom":y.css({top:"auto",height:i.loaderStroke})}switch(V){case"leftToRight":case"rightToLeft":Y.css({left:0,right:0,top:i.loaderPadding,bottom:i.loaderPadding});break;case"topToBottom":Y.css({left:i.loaderPadding,right:i.loaderPadding,top:0,bottom:0});break;case"bottomToTop":Y.css({left:i.loaderPadding,right:i.loaderPadding,top:0,bottom:0})}}else{var Y,Z,$,tt;switch(b.append('<canvas id="'+p+'"></canvas>'),(Y=document.getElementById(p)).setAttribute("width",i.pieDiameter),Y.setAttribute("height",i.pieDiameter),i.piePosition){case"leftTop":Z="left:0; top:0;";break;case"rightTop":Z="right:0; top:0;";break;case"leftBottom":Z="left:0; bottom:0;";break;case"rightBottom":Z="right:0; bottom:0;"}if(Y.setAttribute("style","position:absolute; z-index:1002; "+Z),Y&&Y.getContext){var it=Y.getContext("2d");it.rotate(1.5*Math.PI),it.translate(-i.pieDiameter,0)}}if(("none"==f||0==N)&&(t("#"+p).hide(),t(".fluid_dg_canvas_wrap",X).hide()),t(k).length){var at;for(t(k).append('<ul class="fluid_dg_pag_ul" />'),at=0;q>at;at++)t(".fluid_dg_pag_ul",h).append('<li class="pag_nav_'+at+'" style="position:relative; z-index:1002"><span><span>'+at+"</span></span></li>");t(".fluid_dg_pag_ul li",h).hover(function(){if(t(this).addClass("fluid_dg_hover"),t(".fluid_dg_thumb",this).length){var i=t(".fluid_dg_thumb",this).outerWidth(),a=t(".fluid_dg_thumb",this).outerHeight(),e=t(this).outerWidth();t(".fluid_dg_thumb",this).show().css({top:"-"+a+"px",left:"-"+(i-e)/2+"px"}).animate({opacity:1,"margin-top":"-3px"},200),t(".thumb_arrow",this).show().animate({opacity:1,"margin-top":"-3px"},200)}},function(){t(this).removeClass("fluid_dg_hover"),t(".fluid_dg_thumb",this).animate({"margin-top":"-20px",opacity:0},200,function(){t(this).css({marginTop:"5px"}).hide()}),t(".thumb_arrow",this).animate({"margin-top":"-20px",opacity:0},200,function(){t(this).css({marginTop:"5px"}).hide()})})}t(T).length?t(k).length?(t.each(M,function(i,a){if(""!=t("> div",m).eq(i).attr("data-thumb")){var e=t("> div",m).eq(i).attr("data-thumb"),o=new Image;o.src=e,t("li.pag_nav_"+i,k).append(t(o).attr("class","fluid_dg_thumb").css({position:"absolute"}).animate({opacity:0},0)),t("li.pag_nav_"+i+" > img",k).after('<div class="thumb_arrow" />'),t("li.pag_nav_"+i+" > .thumb_arrow",k).animate({opacity:0},0)}}),h.css({marginBottom:t(k).outerHeight()})):(t(T).append("<div />"),t(T).before('<div class="fluid_dg_prevThumbs hideNav"><div></div></div>').before('<div class="fluid_dg_nextThumbs hideNav"><div></div></div>'),t("> div",T).append("<ul />"),t.each(M,function(i,a){if(""!=t("> div",m).eq(i).attr("data-thumb")){var e=t("> div",m).eq(i).attr("data-thumb"),o=new Image;o.src=e,t("ul",T).append('<li class="pix_thumb pix_thumb_'+i+'" />'),t("li.pix_thumb_"+i,T).append(t(o).attr("class","fluid_dg_thumb"))}})):!t(T).length&&t(k).length&&h.css({marginBottom:t(k).outerHeight()});var et=!0;t(x).length&&(t(x).append('<div class="fluid_dg_play"></div>').append('<div class="fluid_dg_stop"></div>'),1==N?(t(".fluid_dg_play",X).hide(),t(".fluid_dg_stop",X).show()):(t(".fluid_dg_stop",X).hide(),t(".fluid_dg_play",X).show())),l(),t(".moveFromLeft, .moveFromRight, .moveFromTop, .moveFromBottom, .fadeIn, .fadeFromLeft, .fadeFromRight, .fadeFromTop, .fadeFromBottom",u).each(function(){t(this).css("visibility","hidden")}),i.onStartLoading.call(this),c(),t(C).length&&t(C).click(function(){if(!m.hasClass("fluid_dgsliding")){var a=parseFloat(t(".fluid_dgSlide.fluid_dgcurrent",_).index());clearInterval(E),r(),t("#"+p+", .fluid_dg_canvas_wrap",h).animate({opacity:0},0),l(),c(0!=a?a:q),i.onStartLoading.call(this)}}),t(w).length&&t(w).click(function(){if(!m.hasClass("fluid_dgsliding")){var a=parseFloat(t(".fluid_dgSlide.fluid_dgcurrent",_).index());clearInterval(E),r(),t("#"+p+", .fluid_dg_canvas_wrap",X).animate({opacity:0},0),l(),c(a==q-1?1:a+2),i.onStartLoading.call(this)}}),e()&&(u.bind("swipeleft",function(a){if(!m.hasClass("fluid_dgsliding")){var e=parseFloat(t(".fluid_dgSlide.fluid_dgcurrent",_).index());clearInterval(E),r(),t("#"+p+", .fluid_dg_canvas_wrap",X).animate({opacity:0},0),l(),c(e==q-1?1:e+2),i.onStartLoading.call(this)}}),u.bind("swiperight",function(a){if(!m.hasClass("fluid_dgsliding")){var e=parseFloat(t(".fluid_dgSlide.fluid_dgcurrent",_).index());clearInterval(E),r(),t("#"+p+", .fluid_dg_canvas_wrap",X).animate({opacity:0},0),l(),c(0!=e?e:q),i.onStartLoading.call(this)}})),t(k).length&&t(".fluid_dg_pag li",h).click(function(){if(!m.hasClass("fluid_dgsliding")){var a=parseFloat(t(this).index());a!=parseFloat(t(".fluid_dgSlide.fluid_dgcurrent",_).index())&&(clearInterval(E),r(),t("#"+p+", .fluid_dg_canvas_wrap",X).animate({opacity:0},0),l(),c(a+1),i.onStartLoading.call(this))}}),t(T).length&&(t(".pix_thumb img",T).click(function(){if(!m.hasClass("fluid_dgsliding")){var a=parseFloat(t(this).parents("li").index());a!=parseFloat(t(".fluid_dgcurrent",_).index())&&(clearInterval(E),r(),t("#"+p+", .fluid_dg_canvas_wrap",X).animate({opacity:0},0),t(".pix_thumb",T).removeClass("fluid_dgcurrent"),t(this).parents("li").addClass("fluid_dgcurrent"),l(),c(a+1),n(),i.onStartLoading.call(this))}}),t(".fluid_dg_thumbs_cont .fluid_dg_prevThumbs",X).hover(function(){t(this).stop(!0,!1).animate({opacity:1},250)},function(){t(this).stop(!0,!1).animate({opacity:.7},250)}),t(".fluid_dg_prevThumbs",X).click(function(){var i=0,a=(t(T).outerWidth(),t("ul",T).offset().left),e=t("> div",T).offset().left-a;t(".fluid_dg_visThumb",T).each(function(){var a=t(this).outerWidth();i+=a}),e-i>0?t("ul",T).animate({"margin-left":"-"+(e-i)+"px"},500,o):t("ul",T).animate({"margin-left":0},500,o)}),t(".fluid_dg_thumbs_cont .fluid_dg_nextThumbs",X).hover(function(){t(this).stop(!0,!1).animate({opacity:1},250)},function(){t(this).stop(!0,!1).animate({opacity:.7},250)}),t(".fluid_dg_nextThumbs",X).click(function(){var i=0,a=t(T).outerWidth(),e=t("ul",T).outerWidth(),d=t("ul",T).offset().left,r=t("> div",T).offset().left-d;t(".fluid_dg_visThumb",T).each(function(){var a=t(this).outerWidth();i+=a}),e>r+i+i?t("ul",T).animate({"margin-left":"-"+(r+i)+"px"},500,o):t("ul",T).animate({"margin-left":"-"+(e-a)+"px"},500,o)}))}}(jQuery),function(t){t.fn.fluid_dgStop=function(){var i=t(this),a=t(".fluid_dg_src",i);i.index(),a.addClass("stopped"),t(".fluid_dg_showcommands").length&&t(".fluid_dg_thumbs_wrap",i)}}(jQuery),function(t){t.fn.fluid_dgPause=function(){var i=t(this);t(".fluid_dg_src",i).addClass("paused")}}(jQuery),function(t){t.fn.fluid_dgResume=function(){var i=t(this),a=t(".fluid_dg_src",i);("undefined"==typeof autoAdv||!0!==autoAdv)&&a.removeClass("paused")}}(jQuery);
/*################ fluid_dg.min.js ends ###################*/

/*################ jquery.bxslider.min.js starts ###################*/
!function(t){var e={},s={mode:"horizontal",slideSelector:"",infiniteLoop:!0,hideControlOnEnd:!1,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:!1,captions:!1,ticker:!1,tickerHover:!1,adaptiveHeight:!1,adaptiveHeightSpeed:500,video:!1,useCSS:!0,preloadImages:"visible",responsive:!0,slideZIndex:50,wrapperClass:"bx-wrapper",touchEnabled:!0,swipeThreshold:50,oneToOneTouch:!0,preventDefaultSwipeX:!0,preventDefaultSwipeY:!1,pager:!0,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:!0,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:!1,startText:"Start",stopText:"Stop",autoControlsCombine:!1,autoControlsSelector:null,auto:!1,pause:4e3,autoStart:!0,autoDirection:"next",autoHover:!1,autoDelay:0,autoSlideForOnePage:!1,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,onSliderLoad:function(){},onSlideBefore:function(){},onSlideAfter:function(){},onSlideNext:function(){},onSlidePrev:function(){},onSliderResize:function(){}};t.fn.bxSlider=function(n){if(0==this.length)return this;if(this.length>1)return this.each(function(){t(this).bxSlider(n)}),this;var o={},r=this;e.el=this;var a=t(window).width(),l=t(window).height(),d=function(){o.settings=t.extend({},s,n),o.settings.slideWidth=parseInt(o.settings.slideWidth),o.children=r.children(o.settings.slideSelector),o.children.length<o.settings.minSlides&&(o.settings.minSlides=o.children.length),o.children.length<o.settings.maxSlides&&(o.settings.maxSlides=o.children.length),o.settings.randomStart&&(o.settings.startSlide=Math.floor(Math.random()*o.children.length)),o.active={index:o.settings.startSlide},o.carousel=o.settings.minSlides>1||o.settings.maxSlides>1,o.carousel&&(o.settings.preloadImages="all"),o.minThreshold=o.settings.minSlides*o.settings.slideWidth+(o.settings.minSlides-1)*o.settings.slideMargin,o.maxThreshold=o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin,o.working=!1,o.controls={},o.interval=null,o.animProp="vertical"==o.settings.mode?"top":"left",o.usingCSS=o.settings.useCSS&&"fade"!=o.settings.mode&&function(){var t=document.createElement("div"),e=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var i in e)if(void 0!==t.style[e[i]])return o.cssPrefix=e[i].replace("Perspective","").toLowerCase(),o.animProp="-"+o.cssPrefix+"-transform",!0;return!1}(),"vertical"==o.settings.mode&&(o.settings.maxSlides=o.settings.minSlides),r.data("origStyle",r.attr("style")),r.children(o.settings.slideSelector).each(function(){t(this).data("origStyle",t(this).attr("style"))}),c()},c=function(){r.wrap('<div class="'+o.settings.wrapperClass+'"><div class="bx-viewport"></div></div>'),o.viewport=r.parent(),o.loader=t('<div class="bx-loading" />'),o.viewport.prepend(o.loader),r.css({width:"horizontal"==o.settings.mode?100*o.children.length+215+"%":"auto",position:"relative"}),o.usingCSS&&o.settings.easing?r.css("-"+o.cssPrefix+"-transition-timing-function",o.settings.easing):o.settings.easing||(o.settings.easing="swing");f();o.viewport.css({width:"100%",overflow:"hidden",position:"relative"}),o.viewport.parent().css({maxWidth:v()}),o.settings.pager||o.viewport.parent().css({margin:"0 auto 0px"}),o.children.css({float:"horizontal"==o.settings.mode?"left":"none",listStyle:"none",position:"relative"}),o.children.css("width",u()),"horizontal"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginRight",o.settings.slideMargin),"vertical"==o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginBottom",o.settings.slideMargin),"fade"==o.settings.mode&&(o.children.css({position:"absolute",zIndex:0,display:"none"}),o.children.eq(o.settings.startSlide).css({zIndex:o.settings.slideZIndex,display:"block"})),o.controls.el=t('<div class="bx-controls" />'),o.settings.captions&&P(),o.active.last=o.settings.startSlide==x()-1,o.settings.video&&r.fitVids();var e=o.children.eq(o.settings.startSlide);"all"==o.settings.preloadImages&&(e=o.children),o.settings.ticker?o.settings.pager=!1:(o.settings.pager&&T(),o.settings.controls&&C(),o.settings.auto&&o.settings.autoControls&&E(),(o.settings.controls||o.settings.autoControls||o.settings.pager)&&o.viewport.after(o.controls.el)),g(e,h)},g=function(e,i){var s=e.find("img, iframe").length;if(0!=s){var n=0;e.find("img, iframe").each(function(){t(this).one("load",function(){++n==s&&i()}).each(function(){this.complete&&t(this).load()})})}else i()},h=function(){if(o.settings.infiniteLoop&&"fade"!=o.settings.mode&&!o.settings.ticker){var e="vertical"==o.settings.mode?o.settings.minSlides:o.settings.maxSlides,i=o.children.slice(0,e).clone().addClass("bx-clone"),s=o.children.slice(-e).clone().addClass("bx-clone");r.append(i).prepend(s)}o.loader.remove(),S(),"vertical"==o.settings.mode&&(o.settings.adaptiveHeight=!0),o.viewport.height(p()),r.redrawSlider(),o.settings.onSliderLoad(o.active.index),o.initialized=!0,o.settings.responsive&&t(window).bind("resize",V),o.settings.auto&&o.settings.autoStart&&(x()>1||o.settings.autoSlideForOnePage)&&H(),o.settings.ticker&&L(),o.settings.pager&&q(o.settings.startSlide),o.settings.controls&&W(),o.settings.touchEnabled&&!o.settings.ticker&&N()},p=function(){var e=0,s=t();if("vertical"==o.settings.mode||o.settings.adaptiveHeight)if(o.carousel){var n=1==o.settings.moveSlides?o.active.index:o.active.index*m();for(s=o.children.eq(n),i=1;i<=o.settings.maxSlides-1;i++)s=n+i>=o.children.length?s.add(o.children.eq(i-1)):s.add(o.children.eq(n+i))}else s=o.children.eq(o.active.index);else s=o.children;return"vertical"==o.settings.mode?(s.each(function(i){e+=t(this).outerHeight()}),o.settings.slideMargin>0&&(e+=o.settings.slideMargin*(o.settings.minSlides-1))):e=Math.max.apply(Math,s.map(function(){return t(this).outerHeight(!1)}).get()),"border-box"==o.viewport.css("box-sizing")?e+=parseFloat(o.viewport.css("padding-top"))+parseFloat(o.viewport.css("padding-bottom"))+parseFloat(o.viewport.css("border-top-width"))+parseFloat(o.viewport.css("border-bottom-width")):"padding-box"==o.viewport.css("box-sizing")&&(e+=parseFloat(o.viewport.css("padding-top"))+parseFloat(o.viewport.css("padding-bottom"))),e},v=function(){var t="100%";return o.settings.slideWidth>0&&(t="horizontal"==o.settings.mode?o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin:o.settings.slideWidth),t},u=function(){var t=o.settings.slideWidth,e=o.viewport.width();return 0==o.settings.slideWidth||o.settings.slideWidth>e&&!o.carousel||"vertical"==o.settings.mode?t=e:o.settings.maxSlides>1&&"horizontal"==o.settings.mode&&(e>o.maxThreshold||e<o.minThreshold&&(t=(e-o.settings.slideMargin*(o.settings.minSlides-1))/o.settings.minSlides)),t},f=function(){var t=1;if("horizontal"==o.settings.mode&&o.settings.slideWidth>0)if(o.viewport.width()<o.minThreshold)t=o.settings.minSlides;else if(o.viewport.width()>o.maxThreshold)t=o.settings.maxSlides;else{var e=o.children.first().width()+o.settings.slideMargin;t=Math.floor((o.viewport.width()+o.settings.slideMargin)/e)}else"vertical"==o.settings.mode&&(t=o.settings.minSlides);return t},x=function(){var t=0;if(o.settings.moveSlides>0)if(o.settings.infiniteLoop)t=Math.ceil(o.children.length/m());else for(var e=0,i=0;e<o.children.length;)++t,e=i+f(),i+=o.settings.moveSlides<=f()?o.settings.moveSlides:f();else t=Math.ceil(o.children.length/f());return t},m=function(){return o.settings.moveSlides>0&&o.settings.moveSlides<=f()?o.settings.moveSlides:f()},S=function(){if(o.children.length>o.settings.maxSlides&&o.active.last&&!o.settings.infiniteLoop){if("horizontal"==o.settings.mode){var t=o.children.last(),e=t.position();b(-(e.left-(o.viewport.width()-t.outerWidth())),"reset",0)}else if("vertical"==o.settings.mode){var i=o.children.length-o.settings.minSlides,e=o.children.eq(i).position();b(-e.top,"reset",0)}}else{e=o.children.eq(o.active.index*m()).position();o.active.index==x()-1&&(o.active.last=!0),void 0!=e&&("horizontal"==o.settings.mode?b(-e.left,"reset",0):"vertical"==o.settings.mode&&b(-e.top,"reset",0))}},b=function(t,e,i,s){if(o.usingCSS){var n="vertical"==o.settings.mode?"translate3d(0, "+t+"px, 0)":"translate3d("+t+"px, 0, 0)";r.css("-"+o.cssPrefix+"-transition-duration",i/1e3+"s"),"slide"==e?(r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),D()})):"reset"==e?r.css(o.animProp,n):"ticker"==e&&(r.css("-"+o.cssPrefix+"-transition-timing-function","linear"),r.css(o.animProp,n),r.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){r.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),b(s.resetValue,"reset",0),F()}))}else{var a={};a[o.animProp]=t,"slide"==e?r.animate(a,i,o.settings.easing,function(){D()}):"reset"==e?r.css(o.animProp,t):"ticker"==e&&r.animate(a,speed,"linear",function(){b(s.resetValue,"reset",0),F()})}},w=function(){for(var e="",i=x(),s=0;s<i;s++){var n="";o.settings.buildPager&&t.isFunction(o.settings.buildPager)?(n=o.settings.buildPager(s),o.pagerEl.addClass("bx-custom-pager")):(n=s+1,o.pagerEl.addClass("bx-default-pager")),e+='<div class="bx-pager-item"><a href="" data-slide-index="'+s+'" class="bx-pager-link">'+n+"</a></div>"}o.pagerEl.html(e)},T=function(){o.settings.pagerCustom?o.pagerEl=t(o.settings.pagerCustom):(o.pagerEl=t('<div class="bx-pager" />'),o.settings.pagerSelector?t(o.settings.pagerSelector).html(o.pagerEl):o.controls.el.addClass("bx-has-pager").append(o.pagerEl),w()),o.pagerEl.on("click","a",I)},C=function(){o.controls.next=t('<a class="bx-next" href="">'+o.settings.nextText+"</a>"),o.controls.prev=t('<a class="bx-prev" href="">'+o.settings.prevText+"</a>"),o.controls.next.bind("click",z),o.controls.prev.bind("click",y),o.settings.nextSelector&&t(o.settings.nextSelector).append(o.controls.next),o.settings.prevSelector&&t(o.settings.prevSelector).append(o.controls.prev),o.settings.nextSelector||o.settings.prevSelector||(o.controls.directionEl=t('<div class="bx-controls-direction" />'),o.controls.directionEl.append(o.controls.prev).append(o.controls.next),o.controls.el.addClass("bx-has-controls-direction").append(o.controls.directionEl))},E=function(){o.controls.start=t('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+o.settings.startText+"</a></div>"),o.controls.stop=t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+o.settings.stopText+"</a></div>"),o.controls.autoEl=t('<div class="bx-controls-auto" />'),o.controls.autoEl.on("click",".bx-start",M),o.controls.autoEl.on("click",".bx-stop",k),o.settings.autoControlsCombine?o.controls.autoEl.append(o.controls.start):o.controls.autoEl.append(o.controls.start).append(o.controls.stop),o.settings.autoControlsSelector?t(o.settings.autoControlsSelector).html(o.controls.autoEl):o.controls.el.addClass("bx-has-controls-auto").append(o.controls.autoEl),A(o.settings.autoStart?"stop":"start")},P=function(){o.children.each(function(e){var i=t(this).find("img:first").attr("title");void 0!=i&&(""+i).length&&t(this).append('<div class="bx-caption"><span>'+i+"</span></div>")})},z=function(t){o.settings.auto&&r.stopAuto(),r.goToNextSlide(),t.preventDefault()},y=function(t){o.settings.auto&&r.stopAuto(),r.goToPrevSlide(),t.preventDefault()},M=function(t){r.startAuto(),t.preventDefault()},k=function(t){r.stopAuto(),t.preventDefault()},I=function(e){o.settings.auto&&r.stopAuto();var i=t(e.currentTarget);if(void 0!==i.attr("data-slide-index")){var s=parseInt(i.attr("data-slide-index"));s!=o.active.index&&r.goToSlide(s),e.preventDefault()}},q=function(e){var i=o.children.length;if("short"==o.settings.pagerType)return o.settings.maxSlides>1&&(i=Math.ceil(o.children.length/o.settings.maxSlides)),void o.pagerEl.html(e+1+o.settings.pagerShortSeparator+i);o.pagerEl.find("a").removeClass("active"),o.pagerEl.each(function(i,s){t(s).find("a").eq(e).addClass("active")})},D=function(){if(o.settings.infiniteLoop){var t="";0==o.active.index?t=o.children.eq(0).position():o.active.index==x()-1&&o.carousel?t=o.children.eq((x()-1)*m()).position():o.active.index==o.children.length-1&&(t=o.children.eq(o.children.length-1).position()),t&&("horizontal"==o.settings.mode?b(-t.left,"reset",0):"vertical"==o.settings.mode&&b(-t.top,"reset",0))}o.working=!1,o.settings.onSlideAfter(o.children.eq(o.active.index),o.oldIndex,o.active.index)},A=function(t){o.settings.autoControlsCombine?o.controls.autoEl.html(o.controls[t]):(o.controls.autoEl.find("a").removeClass("active"),o.controls.autoEl.find("a:not(.bx-"+t+")").addClass("active"))},W=function(){1==x()?(o.controls.prev.addClass("disabled"),o.controls.next.addClass("disabled")):!o.settings.infiniteLoop&&o.settings.hideControlOnEnd&&(0==o.active.index?(o.controls.prev.addClass("disabled"),o.controls.next.removeClass("disabled")):o.active.index==x()-1?(o.controls.next.addClass("disabled"),o.controls.prev.removeClass("disabled")):(o.controls.prev.removeClass("disabled"),o.controls.next.removeClass("disabled")))},H=function(){if(o.settings.autoDelay>0)setTimeout(r.startAuto,o.settings.autoDelay);else r.startAuto();o.settings.autoHover&&r.hover(function(){o.interval&&(r.stopAuto(!0),o.autoPaused=!0)},function(){o.autoPaused&&(r.startAuto(!0),o.autoPaused=null)})},L=function(){var e=0;if("next"==o.settings.autoDirection)r.append(o.children.clone().addClass("bx-clone"));else{r.prepend(o.children.clone().addClass("bx-clone"));var i=o.children.first().position();e="horizontal"==o.settings.mode?-i.left:-i.top}b(e,"reset",0),o.settings.pager=!1,o.settings.controls=!1,o.settings.autoControls=!1,o.settings.tickerHover&&!o.usingCSS&&o.viewport.hover(function(){r.stop()},function(){var e=0;o.children.each(function(i){e+="horizontal"==o.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)});var i=o.settings.speed/e,s="horizontal"==o.settings.mode?"left":"top",n=i*(e-Math.abs(parseInt(r.css(s))));F(n)}),F()},F=function(t){speed=t||o.settings.speed;var e={left:0,top:0},i={left:0,top:0};"next"==o.settings.autoDirection?e=r.find(".bx-clone").first().position():i=o.children.first().position();var s="horizontal"==o.settings.mode?-e.left:-e.top,n={resetValue:"horizontal"==o.settings.mode?-i.left:-i.top};b(s,"ticker",speed,n)},N=function(){o.touch={start:{x:0,y:0},end:{x:0,y:0}},o.viewport.bind("touchstart",O)},O=function(t){if(o.working)t.preventDefault();else{o.touch.originalPos=r.position();var e=t.originalEvent;o.touch.start.x=e.changedTouches[0].pageX,o.touch.start.y=e.changedTouches[0].pageY,o.viewport.bind("touchmove",X),o.viewport.bind("touchend",Y)}},X=function(t){var e=t.originalEvent,i=Math.abs(e.changedTouches[0].pageX-o.touch.start.x),s=Math.abs(e.changedTouches[0].pageY-o.touch.start.y);if(3*i>s&&o.settings.preventDefaultSwipeX?t.preventDefault():3*s>i&&o.settings.preventDefaultSwipeY&&t.preventDefault(),"fade"!=o.settings.mode&&o.settings.oneToOneTouch){var n=0;if("horizontal"==o.settings.mode){r=e.changedTouches[0].pageX-o.touch.start.x;n=o.touch.originalPos.left+r}else{var r=e.changedTouches[0].pageY-o.touch.start.y;n=o.touch.originalPos.top+r}b(n,"reset",0)}},Y=function(t){o.viewport.unbind("touchmove",X);var e=t.originalEvent,i=0;if(o.touch.end.x=e.changedTouches[0].pageX,o.touch.end.y=e.changedTouches[0].pageY,"fade"==o.settings.mode)(s=Math.abs(o.touch.start.x-o.touch.end.x))>=o.settings.swipeThreshold&&(o.touch.start.x>o.touch.end.x?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto());else{var s=0;"horizontal"==o.settings.mode?(s=o.touch.end.x-o.touch.start.x,i=o.touch.originalPos.left):(s=o.touch.end.y-o.touch.start.y,i=o.touch.originalPos.top),!o.settings.infiniteLoop&&(0==o.active.index&&s>0||o.active.last&&s<0)?b(i,"reset",200):Math.abs(s)>=o.settings.swipeThreshold?(s<0?r.goToNextSlide():r.goToPrevSlide(),r.stopAuto()):b(i,"reset",200)}o.viewport.unbind("touchend",Y)},V=function(e){if(o.initialized){var i=t(window).width(),s=t(window).height();a==i&&l==s||(a=i,l=s,r.redrawSlider(),o.settings.onSliderResize.call(r,o.active.index))}};return r.goToSlide=function(e,i){if(!o.working&&o.active.index!=e)if(o.working=!0,o.oldIndex=o.active.index,e<0?o.active.index=x()-1:e>=x()?o.active.index=0:o.active.index=e,o.settings.onSlideBefore(o.children.eq(o.active.index),o.oldIndex,o.active.index),"next"==i?o.settings.onSlideNext(o.children.eq(o.active.index),o.oldIndex,o.active.index):"prev"==i&&o.settings.onSlidePrev(o.children.eq(o.active.index),o.oldIndex,o.active.index),o.active.last=o.active.index>=x()-1,o.settings.pager&&q(o.active.index),o.settings.controls&&W(),"fade"==o.settings.mode)o.settings.adaptiveHeight&&o.viewport.height()!=p()&&o.viewport.animate({height:p()},o.settings.adaptiveHeightSpeed),o.children.filter(":visible").fadeOut(o.settings.speed).css({zIndex:0}),o.children.eq(o.active.index).css("zIndex",o.settings.slideZIndex+1).fadeIn(o.settings.speed,function(){t(this).css("zIndex",o.settings.slideZIndex),D()});else{o.settings.adaptiveHeight&&o.viewport.height()!=p()&&o.viewport.animate({height:p()},o.settings.adaptiveHeightSpeed);var s=0,n={left:0,top:0};if(!o.settings.infiniteLoop&&o.carousel&&o.active.last)if("horizontal"==o.settings.mode)n=(d=o.children.eq(o.children.length-1)).position(),s=o.viewport.width()-d.outerWidth();else{var a=o.children.length-o.settings.minSlides;n=o.children.eq(a).position()}else if(o.carousel&&o.active.last&&"prev"==i){var l=1==o.settings.moveSlides?o.settings.maxSlides-m():(x()-1)*m()-(o.children.length-o.settings.maxSlides),d=r.children(".bx-clone").eq(l);n=d.position()}else if("next"==i&&0==o.active.index)n=r.find("> .bx-clone").eq(o.settings.maxSlides).position(),o.active.last=!1;else if(e>=0){var c=e*m();n=o.children.eq(c).position()}if(void 0!==n){var g="horizontal"==o.settings.mode?-(n.left-s):-n.top;b(g,"slide",o.settings.speed)}}},r.goToNextSlide=function(){if(o.settings.infiniteLoop||!o.active.last){var t=parseInt(o.active.index)+1;r.goToSlide(t,"next")}},r.goToPrevSlide=function(){if(o.settings.infiniteLoop||0!=o.active.index){var t=parseInt(o.active.index)-1;r.goToSlide(t,"prev")}},r.startAuto=function(t){o.interval||(o.interval=setInterval(function(){"next"==o.settings.autoDirection?r.goToNextSlide():r.goToPrevSlide()},o.settings.pause),o.settings.autoControls&&1!=t&&A("stop"))},r.stopAuto=function(t){o.interval&&(clearInterval(o.interval),o.interval=null,o.settings.autoControls&&1!=t&&A("start"))},r.getCurrentSlide=function(){return o.active.index},r.getCurrentSlideElement=function(){return o.children.eq(o.active.index)},r.getSlideCount=function(){return o.children.length},r.redrawSlider=function(){o.children.add(r.find(".bx-clone")).width(u()),o.viewport.css("height",p()),o.settings.ticker||S(),o.active.last&&(o.active.index=x()-1),o.active.index>=x()&&(o.active.last=!0),o.settings.pager&&!o.settings.pagerCustom&&(w(),q(o.active.index))},r.destroySlider=function(){o.initialized&&(o.initialized=!1,t(".bx-clone",this).remove(),o.children.each(function(){void 0!=t(this).data("origStyle")?t(this).attr("style",t(this).data("origStyle")):t(this).removeAttr("style")}),void 0!=t(this).data("origStyle")?this.attr("style",t(this).data("origStyle")):t(this).removeAttr("style"),t(this).unwrap().unwrap(),o.controls.el&&o.controls.el.remove(),o.controls.next&&o.controls.next.remove(),o.controls.prev&&o.controls.prev.remove(),o.pagerEl&&o.settings.controls&&o.pagerEl.remove(),t(".bx-caption",this).remove(),o.controls.autoEl&&o.controls.autoEl.remove(),clearInterval(o.interval),o.settings.responsive&&t(window).unbind("resize",V))},r.reloadSlider=function(t){void 0!=t&&(n=t),r.destroySlider(),d()},d(),this}}(jQuery);
/*################ jquery.bxslider.min.js ends ###################*/

/*################ jquery.DG_Slider.min.js starts ###################*/
/**
 * jQuery DG_Slider v1.0
 * http://dhirajkumarsingh.wordpress.com
 *
 * Copyright 2012, Dhiraj kumar
 * http://www.weblinkindia.net
 *
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 */
(function(a){a.fn.DG_Slider=function(b){function Z(b,c,d,e){var f=[];var g=d;var h=false;if(e=="backward"){b=a.makeArray(b);b.reverse()}while(g>0){a.each(b,function(b,d){if(g>0){if(!h){if(b==c){h=true;f.push(a(this).clone());g--}}else{f.push(a(this).clone());g--}}else{return false}})}return f}function Y(){var a=i.outerHeight()*b.displaySlideQty;return a}function X(){var a=i.outerWidth()*b.displaySlideQty;return a}function W(b,c){if(c=="left"){var d=a(".pager",h).eq(b).position().left}else if(c=="top"){var d=a(".pager",h).eq(b).position().top}return d}function V(){if(!b.infiniteLoop&&b.hideControlOnEnd){if(x==F){a(".DG-prev",h).hide()}else{a(".DG-prev",h).show()}if(x==G){a(".DG-next",h).hide()}else{a(".DG-next",h).show()}}}function U(c,e,f,g){p=a('<a href="" class="DG-start"></a>');if(c=="text"){r=e}else{r='<img src="../common/'+e+'" />'}if(f=="text"){s=g}else{s='<img src="../common/'+g+'" />'}if(b.autoControlsSelector){a(b.autoControlsSelector).append(p)}else{h.append('<div class="DG-auto"></div>');a(".DG-auto",h).html(p)}p.click(function(){if(b.ticker){if(a(this).hasClass("stop")){d.stopTicker()}else if(a(this).hasClass("start")){d.startTicker()}}else{if(a(this).hasClass("stop")){d.stopShow(true)}else if(a(this).hasClass("start")){d.startShow(true)}}return false})}function T(){var c=a("img",g.eq(x)).attr("title");if(c!=""){if(b.captionsSelector){a(b.captionsSelector).html(c)}else{a(".DG-captions",h).html(c)}}else{if(b.captionsSelector){a(b.captionsSelector).html(" ")}else{a(".DG-captions",h).html(" ")}}}function S(c){var e=g.length;if(b.moveSlideQty>1){if(g.length%b.moveSlideQty!=0){e=Math.ceil(g.length/b.moveSlideQty)}else{e=g.length/b.moveSlideQty}}var f="";if(b.buildPager){for(var i=0;i<e;i++){f+=b.buildPager(i,g.eq(i*b.moveSlideQty))}}else if(c=="full"){for(var i=1;i<=e;i++){f+='<a href="" class="pager-link pager-'+i+'">'+i+"</a>"}}else if(c=="short"){f='<span class="DG-pager-current lh15em">'+(b.startingSlide+1)+"</span> "+b.pagerShortSeparator+' <span class="DG-pager-total">'+g.length+"</span>"}if(b.pagerSelector){a(b.pagerSelector).append(f);n=a(b.pagerSelector)}else{var j=a('<div class="DG-pager pa" style="color:#fff;background:#000;opacity:0.5;filter:alpha(opacity=50);padding:6px 0; left:0; bottom:10px;z-index:4;"></div>');j.append(f);if(b.pagerLocation=="top"){h.prepend(j)}else if(b.pagerLocation=="bottom"){h.append(j)}n=a(".DG-pager",h)}n.children().click(function(){if(b.pagerType=="full"){var a=n.children().index(this);if(b.moveSlideQty>1){a*=b.moveSlideQty}d.goToSlide(a)}return false})}function R(c,e,f,g){var i=a('<a href="" class="DG-next " style="font-size:20px;float:none;color:#ccc;line-height:10px;z-index:4;"></a>');var j=a('<a href="" class="DG-prev pa" style="font-size:20px; float:none; color:#ccc; line-height:10px;  left:6px;z-index:4;"></a>');if(c=="text"){i.html(e)}else{i.html('<img src="../common/'+e+'" />')}if(f=="text"){j.html(g)}else{j.html('<img src="../common/'+g+'" />')}if(b.prevSelector){a(b.prevSelector).append(j)}else{h.append(j)}if(b.nextSelector){a(b.nextSelector).append(i)}else{h.append(i)}i.click(function(){d.goToNextSlide();return false});j.click(function(){d.goToPreviousSlide();return false})}function Q(c){if(b.pagerType=="full"&&b.pager){a("a",n).removeClass(b.pagerActiveClass);a("a",n).eq(c).addClass(b.pagerActiveClass)}else if(b.pagerType=="short"&&b.pager){a(".DG-pager-current",n).html(x+1)}}function P(){g.not(":eq("+x+")").fadeTo(b.speed,0).css("zIndex",2);g.eq(x).css("zIndex",3).fadeTo(b.speed,1,function(){E=false;if(jQuery.browser.msie){g.eq(x).get(0).style.removeAttribute("filter")}b.onAfterSlide(x,g.length,g.eq(x))})}function O(){e.hover(function(){if(t){d.stopTicker(false)}},function(){if(t){d.startTicker(false)}})}function N(){h.find(".DG-window").hover(function(){if(t){d.stopShow(false)}},function(){if(t){d.startShow(false)}})}function M(){if(b.startImage!=""){startContent=b.startImage;startType="image"}else{startContent=b.startText;startType="text"}if(b.stopImage!=""){stopContent=b.stopImage;stopType="image"}else{stopContent=b.stopText;stopType="text"}U(startType,startContent,stopType,stopContent)}function L(a,c,d){if(b.mode=="horizontal"){if(b.tickerDirection=="next"){e.animate({left:"-="+c+"px"},d,"linear",function(){e.css("left",a);L(a,A,b.tickerSpeed)})}else if(b.tickerDirection=="prev"){e.animate({left:"+="+c+"px"},d,"linear",function(){e.css("left",a);L(a,A,b.tickerSpeed)})}}else if(b.mode=="vertical"){if(b.tickerDirection=="next"){e.animate({top:"-="+c+"px"},d,"linear",function(){e.css("top",a);L(a,B,b.tickerSpeed)})}else if(b.tickerDirection=="prev"){e.animate({top:"+="+c+"px"},d,"linear",function(){e.css("top",a);L(a,B,b.tickerSpeed)})}}}function K(){if(b.auto){if(!b.infiniteLoop){if(b.autoDirection=="next"){o=setInterval(function(){x+=b.moveSlideQty;if(x>G){x=x%g.length}d.goToSlide(x,false)},b.pause)}else if(b.autoDirection=="prev"){o=setInterval(function(){x-=b.moveSlideQty;if(x<0){negativeOffset=x%g.length;if(negativeOffset==0){x=0}else{x=g.length+negativeOffset}}d.goToSlide(x,false)},b.pause)}}else{if(b.autoDirection=="next"){o=setInterval(function(){d.goToNextSlide(false)},b.pause)}else if(b.autoDirection=="prev"){o=setInterval(function(){d.goToPreviousSlide(false)},b.pause)}}}else if(b.ticker){b.tickerSpeed*=10;a(".pager",h).each(function(b){A+=a(this).width();B+=a(this).height()});if(b.tickerDirection=="prev"&&b.mode=="horizontal"){e.css("left","-"+(A+y)+"px")}else if(b.tickerDirection=="prev"&&b.mode=="vertical"){e.css("top","-"+(B+z)+"px")}if(b.mode=="horizontal"){C=parseInt(e.css("left"));L(C,A,b.tickerSpeed)}else if(b.mode=="vertical"){D=parseInt(e.css("top"));L(D,B,b.tickerSpeed)}if(b.tickerHover){O()}}}function J(){if(b.nextImage!=""){nextContent=b.nextImage;nextType="image"}else{nextContent=b.nextText;nextType="text"}if(b.prevImage!=""){prevContent=b.prevImage;prevType="image"}else{prevContent=b.prevText;prevType="text"}R(nextType,nextContent,prevType,prevContent)}function I(){if(b.mode=="horizontal"||b.mode=="vertical"){var c=Z(g,0,b.moveSlideQty,"backward");a.each(c,function(b){e.prepend(a(this))});var d=g.length+b.moveSlideQty-1;var f=g.length-b.displaySlideQty;var h=d-f;var i=Z(g,0,h,"forward");if(b.infiniteLoop){a.each(i,function(b){e.append(a(this))})}}}function H(){I(b.startingSlide);if(b.mode=="horizontal"){e.wrap('<div class="'+b.wrapperClass+'" style="width:'+l+'px; position:relative;"></div>').wrap('<div class="DG-window" style="position:relative; overflow:hidden; width:'+l+'px;"></div>').css({width:"999999px",position:"relative",left:"-"+y+"px"});e.children().css({width:j,"float":"left",listStyle:"none"});h=e.parent().parent();g.addClass("pager")}else if(b.mode=="vertical"){e.wrap('<div class="'+b.wrapperClass+'" style="width:'+v+'px; position:relative;"></div>').wrap('<div class="DG-window" style="width:'+v+"px; height:"+m+'px; position:relative; overflow:hidden;"></div>').css({height:"999999px",position:"relative",top:"-"+z+"px"});e.children().css({listStyle:"none",height:w});h=e.parent().parent();g.addClass("pager")}else if(b.mode=="fade"){e.wrap('<div class="'+b.wrapperClass+'" style="width:'+v+'px; position:relative;"></div>').wrap('<div class="DG-window" style="height:'+w+"px; width:"+v+'px; position:relative; overflow:hidden;"></div>');e.children().css({listStyle:"none",position:"absolute",top:0,left:0,zIndex:2});h=e.parent().parent();g.not(":eq("+x+")").fadeTo(0,0);g.eq(x).css("zIndex",99)}if(b.captions&&b.captionsSelector==null){h.append('<div class="DG-captions"></div>')}}var c={mode:"horizontal",infiniteLoop:true,hideControlOnEnd:false,controls:true,speed:500,easing:"swing",pager:false,pagerSelector:null,pagerType:"full",pagerLocation:"bottom",pagerShortSeparator:"/",pagerActiveClass:"pager-active",nextText:"<b>»</b>",nextImage:"",nextSelector:null,prevText:" <b>«</b>",prevImage:"",prevSelector:null,captions:false,captionsSelector:null,auto:false,autoDirection:"next",autoControls:false,autoControlsSelector:null,autoStart:true,autoHover:false,autoDelay:0,pause:3e3,startText:"start",startImage:"",stopText:"stop",stopImage:"",ticker:false,tickerSpeed:5e3,tickerDirection:"next",tickerHover:false,wrapperClass:"DG-wrapper",startingSlide:0,displaySlideQty:1,moveSlideQty:1,randomStart:false,onBeforeSlide:function(){},onAfterSlide:function(){},onLastSlide:function(){},onFirstSlide:function(){},onNextSlide:function(){},onPrevSlide:function(){},buildPager:null};var b=a.extend(c,b);var d=this;var e="";var f="";var g="";var h="";var i="";var j="";var k="";var l="";var m="";var n="";var o="";var p="";var q="";var r="";var s="";var t=true;var u=false;var v=0;var w=0;var x=0;var y=0;var z=0;var A=0;var B=0;var C=0;var D=0;var E=false;var F=0;var G=g.length-1;this.goToSlide=function(a,c){if(!E){E=true;x=a;b.onBeforeSlide(x,g.length,g.eq(x));if(typeof c=="undefined"){var c=true}if(c){if(b.auto){d.stopShow(true)}}slide=a;if(slide==F){b.onFirstSlide(x,g.length,g.eq(x))}if(slide==G){b.onLastSlide(x,g.length,g.eq(x))}if(b.mode=="horizontal"){e.animate({left:"-"+W(slide,"left")+"px"},b.speed,b.easing,function(){E=false;b.onAfterSlide(x,g.length,g.eq(x))})}else if(b.mode=="vertical"){e.animate({top:"-"+W(slide,"top")+"px"},b.speed,b.easing,function(){E=false;b.onAfterSlide(x,g.length,g.eq(x))})}else if(b.mode=="fade"){P()}V();if(b.moveSlideQty>1){a=Math.floor(a/b.moveSlideQty)}Q(a);T()}};this.goToNextSlide=function(a){if(typeof a=="undefined"){var a=true}if(a){if(b.auto){d.stopShow(true)}}if(!b.infiniteLoop){if(!E){var c=false;x=x+b.moveSlideQty;if(x<=G){V();b.onNextSlide(x,g.length,g.eq(x));d.goToSlide(x)}else{x-=b.moveSlideQty}}}else{if(!E){E=true;var c=false;x=x+b.moveSlideQty;if(x>G){x=x%g.length;c=true}b.onNextSlide(x,g.length,g.eq(x));b.onBeforeSlide(x,g.length,g.eq(x));if(b.mode=="horizontal"){var f=b.moveSlideQty*k;e.animate({left:"-="+f+"px"},b.speed,b.easing,function(){E=false;if(c){e.css("left","-"+W(x,"left")+"px")}b.onAfterSlide(x,g.length,g.eq(x))})}else if(b.mode=="vertical"){var h=b.moveSlideQty*w;e.animate({top:"-="+h+"px"},b.speed,b.easing,function(){E=false;if(c){e.css("top","-"+W(x,"top")+"px")}b.onAfterSlide(x,g.length,g.eq(x))})}else if(b.mode=="fade"){P()}if(b.moveSlideQty>1){Q(Math.ceil(x/b.moveSlideQty))}else{Q(x)}T()}}};this.goToPreviousSlide=function(c){if(typeof c=="undefined"){var c=true}if(c){if(b.auto){d.stopShow(true)}}if(!b.infiniteLoop){if(!E){var f=false;x=x-b.moveSlideQty;if(x<0){x=0;if(b.hideControlOnEnd){a(".DG-prev",h).hide()}}V();b.onPrevSlide(x,g.length,g.eq(x));d.goToSlide(x)}}else{if(!E){E=true;var f=false;x=x-b.moveSlideQty;if(x<0){negativeOffset=x%g.length;if(negativeOffset==0){x=0}else{x=g.length+negativeOffset}f=true}b.onPrevSlide(x,g.length,g.eq(x));b.onBeforeSlide(x,g.length,g.eq(x));if(b.mode=="horizontal"){var i=b.moveSlideQty*k;e.animate({left:"+="+i+"px"},b.speed,b.easing,function(){E=false;if(f){e.css("left","-"+W(x,"left")+"px")}b.onAfterSlide(x,g.length,g.eq(x))})}else if(b.mode=="vertical"){var j=b.moveSlideQty*w;e.animate({top:"+="+j+"px"},b.speed,b.easing,function(){E=false;if(f){e.css("top","-"+W(x,"top")+"px")}b.onAfterSlide(x,g.length,g.eq(x))})}else if(b.mode=="fade"){P()}if(b.moveSlideQty>1){Q(Math.ceil(x/b.moveSlideQty))}else{Q(x)}T()}}};this.goToFirstSlide=function(a){if(typeof a=="undefined"){var a=true}d.goToSlide(F,a)};this.goToLastSlide=function(){if(typeof a=="undefined"){var a=true}d.goToSlide(G,a)};this.getCurrentSlide=function(){return x};this.getSlideCount=function(){return g.length};this.stopShow=function(a){clearInterval(o);if(typeof a=="undefined"){var a=true}if(a&&b.autoControls){p.html(r).removeClass("stop").addClass("start");t=false}};this.startShow=function(a){if(typeof a=="undefined"){var a=true}K();if(a&&b.autoControls){p.html(s).removeClass("start").addClass("stop");t=true}};this.stopTicker=function(a){e.stop();if(typeof a=="undefined"){var a=true}if(a&&b.ticker){p.html(r).removeClass("stop").addClass("start");t=false}};this.startTicker=function(a){if(b.mode=="horizontal"){if(b.tickerDirection=="next"){var c=parseInt(e.css("left"));var d=A+c+g.eq(0).width()}else if(b.tickerDirection=="prev"){var c=-parseInt(e.css("left"));var d=c-g.eq(0).width()}var f=d*b.tickerSpeed/A;L(C,d,f)}else if(b.mode=="vertical"){if(b.tickerDirection=="next"){var h=parseInt(e.css("top"));var d=B+h+g.eq(0).height()}else if(b.tickerDirection=="prev"){var h=-parseInt(e.css("top"));var d=h-g.eq(0).height()}var f=d*b.tickerSpeed/B;L(D,d,f);if(typeof a=="undefined"){var a=true}if(a&&b.ticker){p.html(s).removeClass("start").addClass("stop");t=true}}};this.initShow=function(){e=a(this);f=e.clone();g=e.children();h="";i=e.children(":first");j=i.width();v=0;k=i.outerWidth();w=0;l=X();m=Y();E=false;n="";x=0;y=0;z=0;o="";p="";q="";r="";s="";t=true;u=false;A=0;B=0;C=0;D=0;F=0;G=g.length-1;g.each(function(b){if(a(this).outerHeight()>w){w=a(this).outerHeight()}if(a(this).outerWidth()>v){v=a(this).outerWidth()}});if(b.randomStart){var c=Math.floor(Math.random()*g.length);x=c;y=k*(b.moveSlideQty+c);z=w*(b.moveSlideQty+c)}else{x=b.startingSlide;y=k*(b.moveSlideQty+b.startingSlide);z=w*(b.moveSlideQty+b.startingSlide)}H();if(b.pager&&!b.ticker){if(b.pagerType=="full"){S("full")}else if(b.pagerType=="short"){S("short")}}if(b.controls&&!b.ticker){J()}if(b.auto||b.ticker){if(b.autoControls){M()}if(b.autoStart){setTimeout(function(){d.startShow(true)},b.autoDelay)}else{d.stopShow(true)}if(b.autoHover&&!b.ticker){N()}}if(b.moveSlideQty>1){Q(Math.ceil(x/b.moveSlideQty))}else{Q(x)}V();if(b.captions){T()}b.onAfterSlide(x,g.length,g.eq(x))};this.destroyShow=function(){clearInterval(o);a(".DG-next, .DG-prev, .DG-pager, .DG-auto",h).remove();e.unwrap().unwrap().removeAttr("style");e.children().removeAttr("style").not(".pager").remove();g.removeClass("pager")};this.reloadShow=function(){d.destroyShow();d.initShow()};this.each(function(){if(a(this).children().length>0){d.initShow()}});return this};jQuery.fx.prototype.cur=function(){if(this.elem[this.prop]!=null&&(!this.elem.style||this.elem.style[this.prop]==null)){return this.elem[this.prop]}var a=parseFloat(jQuery.css(this.elem,this.prop));return a}})(jQuery);
/*################ jquery.DG_Slider.min.js ends ###################*/

/*################ jquery.zoom-min.js starts ###################*/
(function(o){var t={url:!1,callback:!1,target:!1,duration:120,on:"mouseover",onZoomIn:!1,onZoomOut:!1};o.zoom=function(t,n,e){var i,u,c,m,a,r=o(t).css("position");return o(t).css({position:/(absolute|fixed)/.test(r)?r:"relative",overflow:"hidden"}),e.style.width=e.style.height="",o(e).addClass("zoomImg").css({position:"absolute",top:0,left:0,opacity:0,width:e.width,height:e.height,border:"none",maxWidth:"none"}).appendTo(t),{init:function(){i=o(t).outerWidth(),u=o(t).outerHeight(),c=(e.width-i)/o(n).outerWidth(),m=(e.height-u)/o(n).outerHeight(),a=o(n).offset()},move:function(o){var t=o.pageX-a.left,n=o.pageY-a.top;n=Math.max(Math.min(n,u),0),t=Math.max(Math.min(t,i),0),e.style.left=t*-c+"px",e.style.top=n*-m+"px"}}},o.fn.zoom=function(n){return this.each(function(){var e=o.extend({},t,n||{}),i=e.target||this,u=this,c=document.createElement("img"),m=o(c),a="mousemove.zoom",r=!1;(e.url||(e.url=o(u).find("img").attr("src"),e.url))&&(c.onload=function(){function t(t){l.init(),l.move(t),m.stop().fadeTo(o.support.opacity?e.duration:0,1,o.isFunction(e.onZoomIn)?e.onZoomIn.call(c):!1)}function n(){m.stop().fadeTo(e.duration,0,o.isFunction(e.onZoomOut)?e.onZoomOut.call(c):!1)}var l=o.zoom(i,u,c);"grab"===e.on?o(u).on("mousedown.zoom",function(e){1===e.which&&(o(document).one("mouseup.zoom",function(){n(),o(document).off(a,l.move)}),t(e),o(document).on(a,l.move),e.preventDefault())}):"click"===e.on?o(u).on("click.zoom",function(e){return r?void 0:(r=!0,t(e),o(document).on(a,l.move),o(document).one("click.zoom",function(){n(),r=!1,o(document).off(a,l.move)}),!1)}):"toggle"===e.on?o(u).on("click.zoom",function(o){r?n():t(o),r=!r}):(l.init(),o(u).on("mouseenter.zoom",t).on("mouseleave.zoom",n).on(a,l.move)),o.isFunction(e.callback)&&e.callback.call(c)},c.src=e.url,o(u).one("zoom.destroy",function(){o(u).off(".zoom"),m.remove()}))})},o.fn.zoom.defaults=t})(window.jQuery);
/*################ jquery.zoom-min.js ends ###################*/

/*################ 12569.js starts ###################*/
function fddcw(){var e=jQuery(".dynamic-data-container");if(e.css("width","auto"),e&&e.length){e.children().hide();var i=e.css("width");e.children().show(),e.css({width:i,"overflow-x":"auto"})}}function imgDisplay(e,t){for(document.getElementById("imgZoomThumb").src=e,document.getElementById("imgZoom").href=e,as=document.getElementById("imgCounter").getElementsByTagName("a"),i=0;i<as.length;i++)i==t?as[i].className="on":as[i].className=""}!function(e){e(document).ready(function(){function n(){e("#projectMoreLinksDiv").slideUp("slow")}var o=e('[data-plugin~="childrenscroller"]');for(i=0,j=o.length;i<j;i++)e(o[i]).childrenscroller();if(fddcw(),e(".formatView").length){var s=e(".formatView"),r=s.children("a");if($classifieds=e("#classifieds"),$bxslider=$classifieds.find(".bxslider"),$li=$bxslider.children("li"),liHeight=0,!r.length)return;$li.length&&$li.each(function(){liHeight=Math.max(e(this).height(),liHeight)}),s.children("a").each(function(){e(this).click(function(){e(this).hasClass("on")||(e(this).addClass("on").siblings("a").removeClass("on"),$classifieds.length&&($classifieds.toggleClass("classified3Images classified_detailview"),$classifieds.hasClass("classified_detailview")?$li.css({height:"auto"}):$li.css({height:liHeight})))})})}e("#projectMoreLinksA").mouseover(function(){e("#projectMoreLinksDiv").slideDown("slow",function(){})}),e("#projectMoreLinksA, #projectMoreLinksDiv").mouseleave(function(){t=setTimeout(n,1e3)}),e("#projectMoreLinksA, #projectMoreLinksDiv").mouseover(function(){clearTimeout(t)})}),jQuery(window).load(function(i){var t=e('[class *= "bxslider"]');t.length&&t.each(function(){e(this).children("li").css({height:"auto"}),e(this).children("li").EqualHeight()})}),jQuery(window).resize(function(){var i=e('[class *= "bxslider"]');i.length&&i.each(function(){e(this).children("li").css({height:"auto"}),e(this).children("li").EqualHeight()}),fddcw()}),jQuery(window).load(function(i){var t=e('[class *= "idv_eqheight"]');t.length&&t.each(function(){e(this).find("li>div").css({height:"auto"}),e(this).find("li>div").EqualHeight()})}),jQuery(window).resize(function(){var i=e('[class *= "idv_eqheight"]');i.length&&i.each(function(){e(this).children("li>div").css({height:"auto"}),e(this).children("li>div").EqualHeight()}),fddcw()}),e.fn.childrenscroller=function(){if(this.length){var i=e(this),t={delay:1e3,pause:1e3,speed:500},n=e.extend({},t,e(this).data("childrenscroller-settings")),o=null,s=!1;return height=e(this).height(),tags=e(this).children(),this.each(function(){var e=function(){var e=i.children().eq(0).outerHeight(!0);i.height()-i.scrollTop()>=e&&(o=setInterval(t,n.pause))},t=function(){if(!s){clearInterval(o);var t=i.children().eq(0).outerHeight(!0);i.animate({scrollTop:t},n.speed,function(){i.append(i.children().eq(0)),i.scrollTop(0),setTimeout(e,n.pause)})}};i.on("mouseover",function(){s=!0}),i.on("mouseout",function(){s=!1}),setTimeout(e,n.delay)})}},e.fn.EqualHeight=function(){var i=e(this),t=0;this.each(function(){t=Math.max(t,e(this).height())}),i.css("height",t)}}(jQuery),jQuery(window).load(function(){jQuery(document).innerHeight();var e=jQuery("header").height(),i=jQuery("#middle").height(),t=jQuery("footer").outerHeight(),n=jQuery(window).height(),o=e+i+t,s=n-o;o<=n&&jQuery("footer").css("margin-top",s)}),function(e,i,t){"use strict";e.HoverDir=function(i,t){this.$el=e(t),this._init(i)},e.HoverDir.defaults={speed:300,easing:"ease",hoverDelay:0,inverse:!1},e.HoverDir.prototype={_init:function(i){this.options=e.extend(!0,{},e.HoverDir.defaults,i),this.transitionProp="all "+this.options.speed+"ms "+this.options.easing,this._loadEvents()},_loadEvents:function(){var i=this;this.$el.on("mouseenter.hoverdir, mouseleave.hoverdir",function(t){var n=e(this),o=n.find(".gallery-overlay"),s=i._getDir(n,{x:t.pageX,y:t.pageY}),r=i._getStyle(s);"mouseenter"===t.type?(o.hide().css(r.from),clearTimeout(i.tmhover),i.tmhover=setTimeout(function(){o.show(0,function(){var t=e(this);i.support&&t.css("transition",i.transitionProp),i._applyAnimation(t,r.to,i.options.speed)})},i.options.hoverDelay)):(i.support&&o.css("transition",i.transitionProp),clearTimeout(i.tmhover),i._applyAnimation(o,r.from,i.options.speed))})},_getDir:function(e,i){var t=e.width(),n=e.height(),o=(i.x-e.offset().left-t/2)*(t>n?n/t:1),s=(i.y-e.offset().top-n/2)*(n>t?t/n:1);return Math.round((Math.atan2(s,o)*(180/Math.PI)+180)/90+3)%4},_getStyle:function(e){var i,t,n={left:"0px",top:"-100%"},o={left:"0px",top:"100%"},s={left:"-100%",top:"0px"},r={left:"100%",top:"0px"},a={top:"0px"},h={left:"0px"};switch(e){case 0:i=this.options.inverse?o:n,t=a;break;case 1:i=this.options.inverse?s:r,t=h;break;case 2:i=this.options.inverse?n:o,t=a;break;case 3:i=this.options.inverse?r:s,t=h}return{from:i,to:t}},_applyAnimation:function(i,t,n){e.fn.applyStyle=this.support?e.fn.css:e.fn.animate,i.stop().applyStyle(t,e.extend(!0,[],{duration:n+"ms"}))}};var n=function(e){i.console&&i.console.error(e)};e.fn.hoverdir=function(i){var t=e.data(this,"hoverdir");if("string"==typeof i){var o=Array.prototype.slice.call(arguments,1);this.each(function(){t?e.isFunction(t[i])&&"_"!==i.charAt(0)?t[i].apply(t,o):n("no such method '"+i+"' for hoverdir instance"):n("cannot call methods on hoverdir prior to initialization; attempted to call method '"+i+"'")})}else this.each(function(){t?t._init():t=e.data(this,"hoverdir",new e.HoverDir(i,this))});return t}}(jQuery,window);
/*################ 12569.js ends ###################*/

/*################ lazysizes.js starts ###################*/
/*! lazysizes - v5.3.0 */
!function(e){var t=function(u,D,f){"use strict";var k,H;if(function(){var e;var t={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",fastLoadedClass:"ls-is-cached",iframeLoadMode:0,srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:true,expFactor:1.5,hFac:.8,loadMode:2,loadHidden:true,ricTimeout:0,throttleDelay:125};H=u.lazySizesConfig||u.lazysizesConfig||{};for(e in t){if(!(e in H)){H[e]=t[e]}}}(),!D||!D.getElementsByClassName){return{init:function(){},cfg:H,noSupport:true}}var O=D.documentElement,i=u.HTMLPictureElement,P="addEventListener",$="getAttribute",q=u[P].bind(u),I=u.setTimeout,U=u.requestAnimationFrame||I,o=u.requestIdleCallback,j=/^picture$/i,r=["load","error","lazyincluded","_lazyloaded"],a={},G=Array.prototype.forEach,J=function(e,t){if(!a[t]){a[t]=new RegExp("(\\s|^)"+t+"(\\s|$)")}return a[t].test(e[$]("class")||"")&&a[t]},K=function(e,t){if(!J(e,t)){e.setAttribute("class",(e[$]("class")||"").trim()+" "+t)}},Q=function(e,t){var a;if(a=J(e,t)){e.setAttribute("class",(e[$]("class")||"").replace(a," "))}},V=function(t,a,e){var i=e?P:"removeEventListener";if(e){V(t,a)}r.forEach(function(e){t[i](e,a)})},X=function(e,t,a,i,r){var n=D.createEvent("Event");if(!a){a={}}a.instance=k;n.initEvent(t,!i,!r);n.detail=a;e.dispatchEvent(n);return n},Y=function(e,t){var a;if(!i&&(a=u.picturefill||H.pf)){if(t&&t.src&&!e[$]("srcset")){e.setAttribute("srcset",t.src)}a({reevaluate:true,elements:[e]})}else if(t&&t.src){e.src=t.src}},Z=function(e,t){return(getComputedStyle(e,null)||{})[t]},s=function(e,t,a){a=a||e.offsetWidth;while(a<H.minSize&&t&&!e._lazysizesWidth){a=t.offsetWidth;t=t.parentNode}return a},ee=function(){var a,i;var t=[];var r=[];var n=t;var s=function(){var e=n;n=t.length?r:t;a=true;i=false;while(e.length){e.shift()()}a=false};var e=function(e,t){if(a&&!t){e.apply(this,arguments)}else{n.push(e);if(!i){i=true;(D.hidden?I:U)(s)}}};e._lsFlush=s;return e}(),te=function(a,e){return e?function(){ee(a)}:function(){var e=this;var t=arguments;ee(function(){a.apply(e,t)})}},ae=function(e){var a;var i=0;var r=H.throttleDelay;var n=H.ricTimeout;var t=function(){a=false;i=f.now();e()};var s=o&&n>49?function(){o(t,{timeout:n});if(n!==H.ricTimeout){n=H.ricTimeout}}:te(function(){I(t)},true);return function(e){var t;if(e=e===true){n=33}if(a){return}a=true;t=r-(f.now()-i);if(t<0){t=0}if(e||t<9){s()}else{I(s,t)}}},ie=function(e){var t,a;var i=99;var r=function(){t=null;e()};var n=function(){var e=f.now()-a;if(e<i){I(n,i-e)}else{(o||r)(r)}};return function(){a=f.now();if(!t){t=I(n,i)}}},e=function(){var v,m,c,h,e;var y,z,g,p,C,b,A;var n=/^img$/i;var d=/^iframe$/i;var E="onscroll"in u&&!/(gle|ing)bot/.test(navigator.userAgent);var _=0;var w=0;var M=0;var N=-1;var L=function(e){M--;if(!e||M<0||!e.target){M=0}};var x=function(e){if(A==null){A=Z(D.body,"visibility")=="hidden"}return A||!(Z(e.parentNode,"visibility")=="hidden"&&Z(e,"visibility")=="hidden")};var W=function(e,t){var a;var i=e;var r=x(e);g-=t;b+=t;p-=t;C+=t;while(r&&(i=i.offsetParent)&&i!=D.body&&i!=O){r=(Z(i,"opacity")||1)>0;if(r&&Z(i,"overflow")!="visible"){a=i.getBoundingClientRect();r=C>a.left&&p<a.right&&b>a.top-1&&g<a.bottom+1}}return r};var t=function(){var e,t,a,i,r,n,s,o,l,u,f,c;var d=k.elements;if((h=H.loadMode)&&M<8&&(e=d.length)){t=0;N++;for(;t<e;t++){if(!d[t]||d[t]._lazyRace){continue}if(!E||k.prematureUnveil&&k.prematureUnveil(d[t])){R(d[t]);continue}if(!(o=d[t][$]("data-expand"))||!(n=o*1)){n=w}if(!u){u=!H.expand||H.expand<1?O.clientHeight>500&&O.clientWidth>500?500:370:H.expand;k._defEx=u;f=u*H.expFactor;c=H.hFac;A=null;if(w<f&&M<1&&N>2&&h>2&&!D.hidden){w=f;N=0}else if(h>1&&N>1&&M<6){w=u}else{w=_}}if(l!==n){y=innerWidth+n*c;z=innerHeight+n;s=n*-1;l=n}a=d[t].getBoundingClientRect();if((b=a.bottom)>=s&&(g=a.top)<=z&&(C=a.right)>=s*c&&(p=a.left)<=y&&(b||C||p||g)&&(H.loadHidden||x(d[t]))&&(m&&M<3&&!o&&(h<3||N<4)||W(d[t],n))){R(d[t]);r=true;if(M>9){break}}else if(!r&&m&&!i&&M<4&&N<4&&h>2&&(v[0]||H.preloadAfterLoad)&&(v[0]||!o&&(b||C||p||g||d[t][$](H.sizesAttr)!="auto"))){i=v[0]||d[t]}}if(i&&!r){R(i)}}};var a=ae(t);var S=function(e){var t=e.target;if(t._lazyCache){delete t._lazyCache;return}L(e);K(t,H.loadedClass);Q(t,H.loadingClass);V(t,B);X(t,"lazyloaded")};var i=te(S);var B=function(e){i({target:e.target})};var T=function(e,t){var a=e.getAttribute("data-load-mode")||H.iframeLoadMode;if(a==0){e.contentWindow.location.replace(t)}else if(a==1){e.src=t}};var F=function(e){var t;var a=e[$](H.srcsetAttr);if(t=H.customMedia[e[$]("data-media")||e[$]("media")]){e.setAttribute("media",t)}if(a){e.setAttribute("srcset",a)}};var s=te(function(t,e,a,i,r){var n,s,o,l,u,f;if(!(u=X(t,"lazybeforeunveil",e)).defaultPrevented){if(i){if(a){K(t,H.autosizesClass)}else{t.setAttribute("sizes",i)}}s=t[$](H.srcsetAttr);n=t[$](H.srcAttr);if(r){o=t.parentNode;l=o&&j.test(o.nodeName||"")}f=e.firesLoad||"src"in t&&(s||n||l);u={target:t};K(t,H.loadingClass);if(f){clearTimeout(c);c=I(L,2500);V(t,B,true)}if(l){G.call(o.getElementsByTagName("source"),F)}if(s){t.setAttribute("srcset",s)}else if(n&&!l){if(d.test(t.nodeName)){T(t,n)}else{t.src=n}}if(r&&(s||l)){Y(t,{src:n})}}if(t._lazyRace){delete t._lazyRace}Q(t,H.lazyClass);ee(function(){var e=t.complete&&t.naturalWidth>1;if(!f||e){if(e){K(t,H.fastLoadedClass)}S(u);t._lazyCache=true;I(function(){if("_lazyCache"in t){delete t._lazyCache}},9)}if(t.loading=="lazy"){M--}},true)});var R=function(e){if(e._lazyRace){return}var t;var a=n.test(e.nodeName);var i=a&&(e[$](H.sizesAttr)||e[$]("sizes"));var r=i=="auto";if((r||!m)&&a&&(e[$]("src")||e.srcset)&&!e.complete&&!J(e,H.errorClass)&&J(e,H.lazyClass)){return}t=X(e,"lazyunveilread").detail;if(r){re.updateElem(e,true,e.offsetWidth)}e._lazyRace=true;M++;s(e,t,r,i,a)};var r=ie(function(){H.loadMode=3;a()});var o=function(){if(H.loadMode==3){H.loadMode=2}r()};var l=function(){if(m){return}if(f.now()-e<999){I(l,999);return}m=true;H.loadMode=3;a();q("scroll",o,true)};return{_:function(){e=f.now();k.elements=D.getElementsByClassName(H.lazyClass);v=D.getElementsByClassName(H.lazyClass+" "+H.preloadClass);q("scroll",a,true);q("resize",a,true);q("pageshow",function(e){if(e.persisted){var t=D.querySelectorAll("."+H.loadingClass);if(t.length&&t.forEach){U(function(){t.forEach(function(e){if(e.complete){R(e)}})})}}});if(u.MutationObserver){new MutationObserver(a).observe(O,{childList:true,subtree:true,attributes:true})}else{O[P]("DOMNodeInserted",a,true);O[P]("DOMAttrModified",a,true);setInterval(a,999)}q("hashchange",a,true);["focus","mouseover","click","load","transitionend","animationend"].forEach(function(e){D[P](e,a,true)});if(/d$|^c/.test(D.readyState)){l()}else{q("load",l);D[P]("DOMContentLoaded",a);I(l,2e4)}if(k.elements.length){t();ee._lsFlush()}else{a()}},checkElems:a,unveil:R,_aLSL:o}}(),re=function(){var a;var n=te(function(e,t,a,i){var r,n,s;e._lazysizesWidth=i;i+="px";e.setAttribute("sizes",i);if(j.test(t.nodeName||"")){r=t.getElementsByTagName("source");for(n=0,s=r.length;n<s;n++){r[n].setAttribute("sizes",i)}}if(!a.detail.dataAttr){Y(e,a.detail)}});var i=function(e,t,a){var i;var r=e.parentNode;if(r){a=s(e,r,a);i=X(e,"lazybeforesizes",{width:a,dataAttr:!!t});if(!i.defaultPrevented){a=i.detail.width;if(a&&a!==e._lazysizesWidth){n(e,r,i,a)}}}};var e=function(){var e;var t=a.length;if(t){e=0;for(;e<t;e++){i(a[e])}}};var t=ie(e);return{_:function(){a=D.getElementsByClassName(H.autosizesClass);q("resize",t)},checkElems:t,updateElem:i}}(),t=function(){if(!t.i&&D.getElementsByClassName){t.i=true;re._();e._()}};return I(function(){H.init&&t()}),k={cfg:H,autoSizer:re,loader:e,init:t,uP:Y,aC:K,rC:Q,hC:J,fire:X,gW:s,rAF:ee}}(e,e.document,Date);e.lazySizes=t,"object"==typeof module&&module.exports&&(module.exports=t)}("undefined"!=typeof window?window:{});
/*################ lazysizes.js ends ###################*/

/*################ allinone.js starts ###################*/
(function(b){b.support.touch="ontouchend" in document;if(!b.support.touch){return;}var c=b.ui.mouse.prototype,e=c._mouseInit,a;function d(g,h){if(g.originalEvent.touches.length>1){return;}g.preventDefault();var i=g.originalEvent.changedTouches[0],f=document.createEvent("MouseEvents");f.initMouseEvent(h,true,true,window,1,i.screenX,i.screenY,i.clientX,i.clientY,false,false,false,false,0,null);g.target.dispatchEvent(f);}c._touchStart=function(g){var f=this;if(a||!f._mouseCapture(g.originalEvent.changedTouches[0])){return;}a=true;f._touchMoved=false;d(g,"mouseover");d(g,"mousemove");d(g,"mousedown");};c._touchMove=function(f){if(!a){return;}this._touchMoved=true;d(f,"mousemove");};c._touchEnd=function(f){if(!a){return;}d(f,"mouseup");d(f,"mouseout");if(!this._touchMoved){d(f,"click");}a=false;};c._mouseInit=function(){var f=this;f.element.bind("touchstart",b.proxy(f,"_touchStart")).bind("touchmove",b.proxy(f,"_touchMove")).bind("touchend",b.proxy(f,"_touchEnd"));e.call(f);};})(jQuery);




(function(c){function H(a,b){b.responsive&&(newCss="",-1!=a.css("font-size").lastIndexOf("px")?(fontSize=a.css("font-size").substr(0,a.css("font-size").lastIndexOf("px")),newCss+="font-size:"+fontSize/(b.origWidth/b.width)+"px;"):-1!=a.css("font-size").lastIndexOf("em")&&(fontSize=a.css("font-size").substr(0,a.css("font-size").lastIndexOf("em")),newCss+="font-size:"+fontSize/(b.origWidth/b.width)+"em;"),-1!=a.css("line-height").lastIndexOf("px")?(lineHeight=a.css("line-height").substr(0,a.css("line-height").lastIndexOf("px")), newCss+="line-height:"+lineHeight/(b.origWidth/b.width)+"px;"):-1!=a.css("line-height").lastIndexOf("em")&&(lineHeight=a.css("line-height").substr(0,a.css("line-height").lastIndexOf("em")),newCss+="line-height:"+lineHeight/(b.origWidth/b.width)+"em;"),a.wrapInner('<div class="wIn" style="'+newCss+'" />'))}function F(a,b){nowx=(new Date).getTime();!a.mouseOverBanner&&(!a.effectIsRunning&&b.showCircleTimer)&&(a.ctx.clearRect(0,0,a.canvas.width,a.canvas.height),a.ctx.beginPath(),a.ctx.globalAlpha= b.behindCircleAlpha/100,a.ctx.arc(b.circleRadius+2*b.circleLineWidth,b.circleRadius+2*b.circleLineWidth,b.circleRadius,0,2*Math.PI,!1),a.ctx.lineWidth=b.circleLineWidth+2,a.ctx.strokeStyle=b.behindCircleColor,a.ctx.stroke(),a.ctx.beginPath(),a.ctx.globalAlpha=b.circleAlpha/100,a.ctx.arc(b.circleRadius+2*b.circleLineWidth,b.circleRadius+2*b.circleLineWidth,b.circleRadius,0,2*((a.timeElapsed+nowx-a.arcInitialTime)/1E3)/b.autoPlay*Math.PI,!1),a.ctx.lineWidth=b.circleLineWidth,a.ctx.strokeStyle=b.circleColor, a.ctx.stroke())}function z(a,b,h,l,f,k,p,u,g){b.showCircleTimer&&c(".mycanvas",k).css({display:"none"});var d,j,n,q;"true"==c(f[h.current_img_no]).attr("data-video")&&(c("#cntHoUnit_"+h.current_img_no,k).html(c(f[h.current_img_no]).html()),b.responsive&&b.width!=b.origWidth&&E(c("#cntHoUnit_"+h.current_img_no,k),0,b,h));c(l[h.current_img_no]).removeClass("bNButtonON");h.current_img_no=B(h.current_img_no,a,p);"true"!=c(f[h.current_img_no]).attr("data-video")&&u.css("display", "none");c(l[h.current_img_no]).addClass("bNButtonON");h.currentZ_index=100;h.currentImg=c("#cntHoUnit_"+h.current_img_no,k);d=b.cntHoUnitOrigWidth/(b.origWidth/b.width);j=b.cntHoUnitOrigHeight/(b.origWidth/b.width);n=parseInt((b.width-b.cntHoUnitOrigWidth/(b.origWidth/b.width))/2,10);q=parseInt(b.height-b.cntHoUnitOrigHeight/(b.origWidth/b.width),10)-b.verticalAdjustment/(b.origWidth/b.width);C(h.currentImg,n,q,d,j,1,!1,a,h,b,g,f,p,u,l,k);v=h.current_img_no; for(m=1;m<=Math.floor(b.numberOfVisibleItems/2);m++)h.currentZ_index--,v=B(v,-1,p),h.currentImg=c("#cntHoUnit_"+v,k),h.currentImg.css("z-index",h.currentZ_index),m==Math.floor(b.numberOfVisibleItems/2)&&(1===a?(last_aux_img_no=B(v,-1,p),last_currentImg=c("#cntHoUnit_"+last_aux_img_no,k),j=b.cntHoUnitOrigHeight/(b.origWidth/b.width)-2*(m+1)*b.elementsVerticalSpacing/(b.origWidth/b.width),d=parseInt(j*h.aspectOrig,10),n=parseInt((b.width-b.cntHoUnitOrigWidth/(b.origWidth/ b.width))/2,10)-(m+1)*b.elementsHorizontalSpacing/(b.origWidth/b.width),q=parseInt(b.height-b.cntHoUnitOrigHeight/(b.origWidth/b.width),10)-b.verticalAdjustment/(b.origWidth/b.width)+(m+1)*b.elementsVerticalSpacing/(b.origWidth/b.width),C(last_currentImg,n,q,d,j,0,!1,a,h,b,g,f,p,u,l,k)):(j=b.cntHoUnitOrigHeight/(b.origWidth/b.width)-2*(m+1)*b.elementsVerticalSpacing/(b.origWidth/b.width),parseInt(j*h.aspectOrig,10),E(h.currentImg,m+1,b,h),n=parseInt((b.width-b.cntHoUnitOrigWidth/ (b.origWidth/b.width))/2,10)-(m+1)*b.elementsHorizontalSpacing/(b.origWidth/b.width),q=parseInt(b.height-b.cntHoUnitOrigHeight/(b.origWidth/b.width),10)-b.verticalAdjustment/(b.origWidth/b.width)+(m+1)*b.elementsVerticalSpacing/(b.origWidth/b.width),h.currentImg.css({left:n+"px",top:q+"px",opacity:0}))),h.currentImg.css("display","block"),j=b.cntHoUnitOrigHeight/(b.origWidth/b.width)-2*m*b.elementsVerticalSpacing/(b.origWidth/b.width),d=parseInt(j*h.aspectOrig,10),n=parseInt((b.width- b.cntHoUnitOrigWidth/(b.origWidth/b.width))/2,10)-m*b.elementsHorizontalSpacing/(b.origWidth/b.width),q=parseInt(b.height-b.cntHoUnitOrigHeight/(b.origWidth/b.width),10)-b.verticalAdjustment/(b.origWidth/b.width)+m*b.elementsVerticalSpacing/(b.origWidth/b.width),C(h.currentImg,n,q,d,j,1,!1,a,h,b,g,f,p,u,l,k);var v=h.current_img_no;for(m=1;m<=Math.floor(b.numberOfVisibleItems/2);m++)h.currentZ_index--,v=B(v,1,p),h.currentImg=c("#cntHoUnit_"+v,k),h.currentImg.css("z-index",h.currentZ_index), m==Math.floor(b.numberOfVisibleItems/2)&&(1===a?(E(h.currentImg,m+1,b,h),h.currentImg.css({left:parseInt((b.width-b.cntHoUnitOrigWidth/(b.origWidth/b.width))/2,10)+(b.cntHoUnitOrigWidth/(b.origWidth/b.width)+(m+1)*b.elementsHorizontalSpacing/(b.origWidth/b.width)-h.currentImg.width())+"px",top:parseInt(b.height-b.cntHoUnitOrigHeight/(b.origWidth/b.width),10)-b.verticalAdjustment/(b.origWidth/b.width)+(m+1)*b.elementsVerticalSpacing/(b.origWidth/b.width)+"px",opacity:0})):(last_aux_img_no= B(v,1,p),last_currentImg=c("#cntHoUnit_"+last_aux_img_no,k),j=b.cntHoUnitOrigHeight/(b.origWidth/b.width)-2*(m+1)*b.elementsVerticalSpacing/(b.origWidth/b.width),d=parseInt(j*h.aspectOrig,10),n=parseInt((b.width-b.cntHoUnitOrigWidth/(b.origWidth/b.width))/2,10)+(b.cntHoUnitOrigWidth/(b.origWidth/b.width)+(m+1)*b.elementsHorizontalSpacing/(b.origWidth/b.width)-d),q=parseInt(b.height-b.cntHoUnitOrigHeight/(b.origWidth/b.width),10)-b.verticalAdjustment/(b.origWidth/ b.width)+(m+1)*b.elementsVerticalSpacing/(b.origWidth/b.width),C(last_currentImg,n,q,d,j,0,!1,a,h,b,g,f,p,u,l,k))),h.currentImg.css("display","block"),j=b.cntHoUnitOrigHeight/(b.origWidth/b.width)-2*m*b.elementsVerticalSpacing/(b.origWidth/b.width),d=parseInt(j*h.aspectOrig,10),n=parseInt((b.width-b.cntHoUnitOrigWidth/(b.origWidth/b.width))/2,10)+(b.cntHoUnitOrigWidth/(b.origWidth/b.width)+m*b.elementsHorizontalSpacing/(b.origWidth/b.width)-d),q=parseInt(b.height-b.cntHoUnitOrigHeight/ (b.origWidth/b.width),10)-b.verticalAdjustment/(b.origWidth/b.width)+m*b.elementsVerticalSpacing/(b.origWidth/b.width),m==Math.floor(b.numberOfVisibleItems/2)?C(h.currentImg,n,q,d,j,1,!0,a,h,b,g,f,p,u,l,k):C(h.currentImg,n,q,d,j,1,!1,a,h,b,g,f,p,u,l,k)}function E(a,b,c,l){b=c.cntHoUnitOrigHeight/(c.origWidth/c.width)-2*b*(c.elementsVerticalSpacing/(c.origWidth/c.width));l=parseInt(b*l.aspectOrig,10);a.css({height:b+"px",width:l+"px"});c.resizeImages&&(imgInside=a.find("img:first"),imgInside.is("img")&& imgInside.css({height:b+"px",width:l+"px"}))}function C(a,b,h,l,f,k,p,u,g,d,j,n,q,v,x,r){g.slideIsRunning=!0;j.html(c(n[g.current_img_no]).attr("data-title"));d.responsive&&H(j,d);0===k?a.css("z-index",g.currentZ_index-1):a.css("z-index",g.currentZ_index);a.css("display","block");a.animate({left:b+"px",top:h+"px",width:l+"px",height:f+"px",opacity:k},1E3*d.animationTime,d.easing,function(){if(p){g.slideIsRunning=!1;g.arcInitialTime=(new Date).getTime();g.timeElapsed=0;d.showCircleTimer&&(clearInterval(g.intervalID), g.ctx.clearRect(0,0,g.canvas.width,g.canvas.height),g.ctx.beginPath(),g.ctx.globalAlpha=d.behindCircleAlpha/100,g.ctx.arc(d.circleRadius+2*d.circleLineWidth,d.circleRadius+2*d.circleLineWidth,d.circleRadius,0,2*Math.PI,!1),g.ctx.lineWidth=d.circleLineWidth+2,g.ctx.strokeStyle=d.behindCircleColor,g.ctx.stroke(),g.ctx.beginPath(),g.ctx.globalAlpha=d.circleAlpha/100,g.ctx.arc(d.circleRadius+2*d.circleLineWidth,d.circleRadius+2*d.circleLineWidth,d.circleRadius,0,0,!1),g.ctx.lineWidth=d.circleLineWidth, g.ctx.strokeStyle=d.circleColor,g.ctx.stroke(),g.intervalID=setInterval(function(){F(g,d)},125),cLeftPos=c("#cntHoUnit_"+g.current_img_no,r).css("left"),cTopPos=c("#cntHoUnit_"+g.current_img_no,r).css("top"),c(".mycanvas",r).css({display:"block",left:parseInt(cLeftPos.substr(0,cLeftPos.lastIndexOf("px")),10)+parseInt(d.circleLeftPositionCorrection/(d.origWidth/d.width),10)+"px",top:parseInt(cTopPos.substr(0,cTopPos.lastIndexOf("px")),10)+parseInt(d.circleTopPositionCorrection/(d.origWidth/ d.width),10)+"px"}));"true"==c(n[g.current_img_no]).attr("data-video")&&v.css("display","block");if(0<d.autoPlay&&1<q&&!g.mouseOverBanner&&!g.fastForwardRunning||g.current_img_no!=g.img_no_where_to_stop&&g.fastForwardRunning)clearTimeout(g.timeoutID),g.timeoutID=setTimeout(function(){z(u,d,g,x,n,r,q,v,j)},1E3*d.autoPlay);g.current_img_no==g.img_no_where_to_stop&&g.fastForwardRunning&&(g.fastForwardRunning=!1,d.animationTime=g.animationTimeOrig,d.autoPlay=g.autoPlayOrig)}});d.resizeImages&&(imgInside= a.find("img:first"),imgInside.is("img")&&imgInside.animate({width:l+"px",height:f+"px"},1E3*d.animationTime,d.easing,function(){}))}function B(a,b,c){return a+b>=c?0:0>a+b?c-1:a+b}function I(a,b,c,l,f,k,p,u,g){-1===c.current_img_no-a?z(1,b,c,l,f,k,p,u,g):1===c.current_img_no-a?z(-1,b,c,l,f,k,p,u,g):(c.fastForwardRunning=!0,b.animationTime=0.4,b.autoPlay=0.1,c.img_no_where_to_stop=a,c.current_img_no<a?a-c.current_img_no<p-a+c.current_img_no?z(1,b,c,l,f,k,p,u,g):z(-1,b,c,l,f,k,p,u,g):c.current_img_no> a&&(c.current_img_no-a<p-c.current_img_no+a?z(-1,b,c,l,f,k,p,u,g):z(1,b,c,l,f,k,p,u,g)))}function J(){var a=-1;"Microsoft Internet Explorer"==navigator.appName&&null!=/MSIE ([0-9]{1,}[.0-9]{0,})/.exec(navigator.userAgent)&&(a=parseFloat(RegExp.$1));return parseInt(a,10)}var D=!1;c.fn.roundAbt=function(a){a=c.extend({},c.fn.roundAbt.defaults,a);return this.each(function(){var b=c(this);responsiveWidth=b.parent().width();responsiveHeight=b.parent().height();a.responsiveRelativeToBrowser&& (responsiveWidth=c(window).width(),responsiveHeight=c(window).height());a.origWidth=a.width;a.width100Proc&&(a.width=responsiveWidth);a.origHeight=a.height;a.height100Proc&&(a.height=responsiveHeight);if(a.responsive&&(a.origWidth!=responsiveWidth||a.width100Proc))a.width=a.origWidth>responsiveWidth||a.width100Proc?responsiveWidth:a.origWidth,a.height100Proc||(a.height=a.width/(a.origWidth/a.origHeight));a.width=parseInt(a.width,10);a.height=parseInt(a.height,10);a.enableTouchScreen&&a.responsive&& (a.width-=1);var h=c("<div></div>").addClass("roundAbt").addClass(a.skin),l=c('<div class="bannerCtrl"> <div class="leftNav"></div> <div class="rightNav"></div> </div> <div class="contentHolder"></div> <div class="elementTitle"></div>\t<div class="playOver"></div> <canvas class="mycanvas"></canvas>');b.wrap(h);b.after(l);var f=b.parent(".roundAbt"),l=c(".bannerCtrl",f),k=c(".contentHolder",f),h=c('<div class="bNLeft"></div>'),p=c('<div class="bottomNav"></div>'), u=c('<div class="bNvRight"></div>');b.after(h);b.after(p);b.after(u);a.showAllControllers||l.css("display","none");var g=c(".leftNav",f),d=c(".rightNav",f);g.css("display","none");d.css("display","none");a.showNavArrows&&a.showOnInitNavArrows&&(g.css("display","block"),d.css("display","block"));var j=c(".bottomNav",f),n=c(".bNLeft",f),q=c(".bNvRight",f),v;j.css("display","block");n.css("display","block");q.css("display","block");j.css({bottom:a.bottomNavMarginBottom+"px",top:"auto"}); n.css({bottom:a.bottomNavMarginBottom+"px",top:"auto"});q.css({bottom:a.bottomNavMarginBottom+"px",top:"auto"});a.showBottomNav||(j.css("display","none"),n.css("display","none"),q.css("display","none"));a.showOnInitBottomNav||(j.css("left","-5000px"),n.css("left","-5000px"),q.css("left","-5000px"));var x=c(".elementTitle",f);a.showElementTitle||x.css("display","none");a.elementOrigTop=parseInt(x.css("top").substr(0,x.css("top").lastIndexOf("px")),10);x.css("top",parseInt(a.elementOrigTop/(a.origWidth/ a.width),10));var r=c(".playOver",f),h=J(),s=0,e={current_img_no:0,currentImg:0,currentZ_index:101,slideIsRunning:!1,mouseOverBanner:!1,fastForwardRunning:!1,isVideoPlaying:!1,img_no_where_to_stop:0,aspectOrig:0,timeoutID:"",animationTimeOrig:a.animationTime,autoPlayOrig:a.autoPlay,timeoutID:"",intervalID:"",arcInitialTime:(new Date).getTime(),timeElapsed:0,windowWidth:0,canvas:"",ctx:"",bannerRatio:a.origWidth/a.origHeight},C;e.canvas=c(".mycanvas",f)[0];e.canvas.width=2*a.circleRadius+4*a.circleLineWidth; e.canvas.height=2*a.circleRadius+4*a.circleLineWidth;-1!=h&&9>h&&(a.showCircleTimer=!1);a.showCircleTimer&&(e.ctx=e.canvas.getContext("2d"));f.width(a.width);f.height(a.height);k.width(a.width);k.height(a.height);l.css("margin-top",parseInt((a.height-g.height())/2,10)+a.nextPrevMarginTop/(a.origWidth/a.width)+"px");var t=b.find("ul:first").children();a.numberOfVisibleItems>b.find("ul:first li").length&&(a.numberOfVisibleItems=b.find("ul:first li").length);a.numberOfVisibleItems%2||a.numberOfVisibleItems--; var w,A,B=0,K=0;t.each(function(){e.currentImg=c(this);e.currentImg.is("li")||(e.currentImg=e.currentImg.find("li:first"));e.currentImg.is("li")&&(s++,w=c('<div class="cntHoUnit" rel="'+(s-1)+'" id="cntHoUnit_'+(s-1)+'">'+e.currentImg.html()+"</div>"),k.append(w),w.css("display","none"),0===a.cntHoUnitOrigWidth&&(a.cntHoUnitOrigWidth=w.width(),a.cntHoUnitOrigHeight=w.height(),e.aspectOrig=a.cntHoUnitOrigWidth/a.cntHoUnitOrigHeight),E(w,0,a,e), w.css({left:parseInt((a.width-w.width())/2,10)+"px",top:parseInt(a.height-w.height(),10)-a.verticalAdjustment/(a.origWidth/a.width)+"px"}),1==s?(w.css({left:parseInt((a.width-w.width())/2,10)+"px",top:parseInt(a.height-w.height(),10)-a.verticalAdjustment/(a.origWidth/a.width)+"px","z-index":e.currentZ_index,display:"block"}),"true"==c(t[e.current_img_no]).attr("data-video")&&r.css("display","block")):s<=Math.ceil(a.numberOfVisibleItems/2)&&(e.currentZ_index--,E(w,s-1,a,e),w.css({left:parseInt((a.width- a.cntHoUnitOrigWidth/(a.origWidth/a.width))/2,10)+(a.cntHoUnitOrigWidth/(a.origWidth/a.width)+(s-1)*a.elementsHorizontalSpacing/(a.origWidth/a.width)-w.width())+"px",top:parseInt(a.height-a.cntHoUnitOrigHeight/(a.origWidth/a.width),10)-a.verticalAdjustment/(a.origWidth/a.width)+(s-1)*a.elementsVerticalSpacing/(a.origWidth/a.width)+"px","z-index":e.currentZ_index,display:"block"})),A=c('<div class="bNButtonOFF" rel="'+(s-1)+'"></div>'),j.append(A),B+=parseInt(A.css("padding-left").substring(0, A.css("padding-left").length-2),10)+A.width(),K=parseInt((j.height()-parseInt(A.css("height").substring(0,A.css("height").length-2)))/2,10),A.css("margin-top",K+"px"))});r.css({left:parseInt((a.width-r.width())/2,10)+"px",top:parseInt(a.height-a.cntHoUnitOrigHeight/(a.origWidth/a.width),10)+parseInt((a.cntHoUnitOrigHeight/(a.origWidth/a.width)-r.height())/2,10)-parseInt(a.verticalAdjustment/(a.origWidth/a.width),10)+"px","margin-top":a.playMovieMarginTop/(a.origWidth/a.width)});a.showCircleTimer&& (cLeftPos=c("#cntHoUnit_"+e.current_img_no,f).css("left"),cTopPos=c("#cntHoUnit_"+e.current_img_no,f).css("top"),c(".mycanvas",f).css({left:parseInt(cLeftPos.substr(0,cLeftPos.lastIndexOf("px")),10)+parseInt(a.circleLeftPositionCorrection/(a.origWidth/a.width),10)+"px",top:parseInt(cTopPos.substr(0,cTopPos.lastIndexOf("px")),10)+parseInt(a.circleTopPositionCorrection/(a.origWidth/a.width),10)+"px"}));e.currentZ_index=100;for(m=1;m<=Math.floor(a.numberOfVisibleItems/2);m++)e.currentZ_index--, E(c("#cntHoUnit_"+(s-m),f),m,a,e),c("#cntHoUnit_"+(s-m),f).css({left:parseInt((a.width-a.cntHoUnitOrigWidth/(a.origWidth/a.width))/2,10)-m*a.elementsHorizontalSpacing/(a.origWidth/a.width)+"px",top:parseInt(a.height-a.cntHoUnitOrigHeight/(a.origWidth/a.width),10)-a.verticalAdjustment/(a.origWidth/a.width)+m*a.elementsVerticalSpacing/(a.origWidth/a.width)+"px","z-index":e.currentZ_index,display:"block"});x.html(c(t[0]).attr("data-title"));a.responsive&&H(x,a);j.width(B); a.showOnInitBottomNav&&(j.css("left",parseInt((f.width()-B)/2,10)+"px"),n.css("left",parseInt(j.css("left").substring(0,j.css("left").length-2),10)-n.width()+"px"),q.css("left",parseInt(j.css("left").substring(0,j.css("left").length-2),10)+j.width()+parseInt(A.css("padding-left").substring(0,A.css("padding-left").length-2),10)+"px"));c("iframe",f).each(function(){var a=c(this).attr("src"),b="?wmode=transparent";-1!=a.indexOf("?")&&(b="&wmode=transparent");c(this).attr("src",a+b)});e.current_img_no= 0;e.currentImg=c(t[e.current_img_no]);f.mouseenter(function(){e.mouseOverBanner=!0;clearTimeout(e.timeoutID);nowx=(new Date).getTime();e.timeElapsed+=nowx-e.arcInitialTime;a.autoHideNavArrows&&a.showNavArrows&&(g.css("display","block"),d.css("display","block"));a.autoHideBottomNav&&a.showBottomNav&&(j.css({display:"block",left:parseInt((f.width()-B)/2,10)+"px"}),n.css({display:"block",left:parseInt(j.css("left").substring(0,j.css("left").length-2),10)-n.width()+"px"}),q.css({display:"block",left:parseInt(j.css("left").substring(0, j.css("left").length-2),10)+j.width()+parseInt(A.css("padding-left").substring(0,A.css("padding-left").length-2),10)+"px"}))});f.mouseleave(function(){e.mouseOverBanner=!1;nowx=(new Date).getTime();a.autoHideNavArrows&&a.showNavArrows&&(g.css("display","none"),d.css("display","none"));a.autoHideBottomNav&&a.showBottomNav&&(j.css("display","none"),n.css("display","none"),q.css("display","none"));if(0<a.autoPlay&&1<s&&!e.fastForwardRunning&&!e.isVideoPlaying){clearTimeout(e.timeoutID);e.arcInitialTime= (new Date).getTime();var b=parseInt(1E3*a.autoPlay-(e.timeElapsed+nowx-e.arcInitialTime),10);e.timeoutID=setTimeout(function(){z(1,a,e,y,t,f,s,r,x)},b)}});w=c(".cntHoUnit",f);w.click(function(){if(!e.slideIsRunning&&!e.fastForwardRunning){var b=c(this).attr("rel");b!=e.current_img_no?(e.isVideoPlaying=!1,c(y[e.current_img_no]).removeClass("bNButtonON"),I(parseInt(b,10),a,e,y,t,f,s,r,x)):"true"==c(t[e.current_img_no]).attr("data-video")?(r.css("display","none"),C=c(this).find("img:first"), C.css("display","none"),e.isVideoPlaying=!0):void 0!=c(t[e.current_img_no]).attr("data-link")&&(""!=c(t[e.current_img_no]).attr("data-link")&&!e.effectIsRunning&&!D)&&(b=a.target,void 0!=c(t[e.current_img_no]).attr("data-target")&&""!=c(t[e.current_img_no]).attr("data-target")&&(b=c(t[e.current_img_no]).attr("data-target")),"_blank"==b?window.open(c(t[e.current_img_no]).attr("data-link")):window.location=c(t[e.current_img_no]).attr("data-link"))}});r.click(function(){a.showCircleTimer&&c(".mycanvas", f).css({display:"none"});r.css("display","none");C=c("#cntHoUnit_"+e.current_img_no,f).find("img:first");C.css("display","none");e.isVideoPlaying=!0});g.mousedown(function(){D=!0;!e.slideIsRunning&&!e.fastForwardRunning&&(e.isVideoPlaying=!1,clearTimeout(e.timeoutID),z(-1,a,e,y,t,f,s,r,x))});g.mouseup(function(){D=!1});d.mousedown(function(){D=!0;!e.slideIsRunning&&!e.fastForwardRunning&&(e.isVideoPlaying=!1,clearTimeout(e.timeoutID),z(1,a,e,y,t,f,s,r,x))});d.mouseup(function(){D=!1});var y= c(".bNButtonOFF",f);y.mousedown(function(){D=!0;if(!e.slideIsRunning&&!e.fastForwardRunning){var b=c(this).attr("rel");b!=e.current_img_no&&(e.isVideoPlaying=!1,c(y[e.current_img_no]).removeClass("bNButtonON"),I(parseInt(b,10),a,e,y,t,f,s,r,x))}});y.mouseup(function(){D=!1});y.mouseenter(function(){var b=c(this),e=b.attr("rel");a.showPreviewThumbs&&(v=c('<div class="bottomOverThumb"></div>'),b.append(v),e=c(t[e]).attr("data-bottom-thumb"),v.html('<img src="'+e+'">'));b.addClass("bNButtonON")}); y.mouseleave(function(){var b=c(this),f=b.attr("rel");a.showPreviewThumbs&&v.remove();e.current_img_no!=f&&b.removeClass("bNButtonON")});a.enableTouchScreen&&(h=Math.floor(1E5*Math.random()),f.wrap('<div id="carouselParent_'+h+'" style="position:relative;" />'),c("#carouselParent_"+h).width(a.width+1),c("#carouselParent_"+h).height(a.height),f.css({cursor:"url("+a.absUrl+"skins/hand.cur),url("+a.absUrl+"skins/hand.cur),move",left:"0px",position:"absolute"}),rightVal=parseInt(d.css("right").substring(0, d.css("right").length-2),10),f.mousedown(function(){rightVal=parseInt(d.css("right").substring(0,d.css("right").length-2),10);0>rightVal&&!D&&(d.css({visibility:"hidden",right:"0"}),g.css("visibility","hidden"))}),f.mouseup(function(){D=!1;0>rightVal&&(d.css({right:rightVal+"px",visibility:"visible"}),g.css("visibility","visible"))}),f.draggable({axis:"x",containment:"parent",distance:10,start:function(){origLeft=c(this).css("left")},stop:function(){e.effectIsRunning||(finalLeft=c(this).css("left"), direction=1,origLeft<finalLeft&&(direction=-1),z(direction,a,e,y,t,f,s,r,x));0>rightVal&&(d.css({right:rightVal+"px",visibility:"visible"}),g.css("visibility","visible"));c(this).css("left","0px")}}));var G=!1;c(window).resize(function(){var d=J();doResizeNow=!0;-1!=navigator.userAgent.indexOf("Android")&&(0==a.windowOrientationScreenSize0&&0==window.orientation&&(a.windowOrientationScreenSize0=c(window).width()),0==a.windowOrientationScreenSize90&&90==window.orientation&&(a.windowOrientationScreenSize90= c(window).height()),0==a.windowOrientationScreenSize_90&&-90==window.orientation&&(a.windowOrientationScreenSize_90=c(window).height()),a.windowOrientationScreenSize0&&(0==window.orientation&&c(window).width()>a.windowOrientationScreenSize0)&&(doResizeNow=!1),a.windowOrientationScreenSize90&&(90==window.orientation&&c(window).height()>a.windowOrientationScreenSize90)&&(doResizeNow=!1),a.windowOrientationScreenSize_90&&(-90==window.orientation&&c(window).height()>a.windowOrientationScreenSize_90)&& (doResizeNow=!1),0==e.windowWidth&&(doResizeNow=!1,e.windowWidth=c(window).width()));-1!=d&&(9==d&&0==e.windowWidth)&&(doResizeNow=!1);e.windowWidth==c(window).width()?(doResizeNow=!1,a.windowCurOrientation!=window.orientation&&-1!=navigator.userAgent.indexOf("Android")&&(a.windowCurOrientation=window.orientation,doResizeNow=!0)):e.windowWidth=c(window).width();a.responsive&&doResizeNow&&(!1!==G&&clearTimeout(G),G=setTimeout(function(){var d=a,h=s,p=l,u=A,v=y,w=c("body").css("overflow");c("body").css("overflow", "hidden");r.css("display","none");d.enableTouchScreen?(responsiveWidth=b.parent().parent().parent().width(),responsiveHeight=b.parent().parent().parent().height()):(responsiveWidth=b.parent().parent().width(),responsiveHeight=b.parent().parent().height());d.responsiveRelativeToBrowser&&(responsiveWidth=c(window).width(),responsiveHeight=c(window).height());d.width100Proc&&(d.width=responsiveWidth);d.height100Proc&&(d.height=responsiveHeight);if(d.origWidth!=responsiveWidth||d.width100Proc)d.origWidth> responsiveWidth||d.width100Proc?d.width=responsiveWidth:d.width100Proc||(d.width=d.origWidth),d.height100Proc||(d.height=d.width/e.bannerRatio),d.width=parseInt(d.width,10),d.height=parseInt(d.height,10),d.enableTouchScreen&&d.responsive&&(d.width-=1),f.width(d.width),f.height(d.height),k.width(d.width),k.height(d.height),d.enableTouchScreen&&(f.parent().width(d.width+1),f.parent().height(d.height)),p.css("margin-top",parseInt((d.height-g.height())/2,10)+d.nextPrevMarginTop/(d.origWidth/d.width)+ "px"),j.css("left",parseInt((f.width()-j.width())/2,10)+"px"),n.css("left",parseInt(j.css("left").substring(0,j.css("left").length-2),10)-n.width()+"px"),q.css("left",parseInt(j.css("left").substring(0,j.css("left").length-2),10)+j.width()+parseInt(u.css("padding-left").substring(0,u.css("padding-left").length-2),10)+"px"),r.css({left:parseInt((d.width-r.width())/2,10)+"px",top:parseInt(d.height-d.cntHoUnitOrigHeight/(d.origWidth/d.width),10)+parseInt((d.cntHoUnitOrigHeight/(d.origWidth/ d.width)-r.height())/2,10)-parseInt(d.verticalAdjustment/(d.origWidth/d.width),10)+"px","margin-top":d.playMovieMarginTop/(d.origWidth/d.width)}),x.css("top",parseInt(d.elementOrigTop/(d.origWidth/d.width),10)),clearTimeout(e.timeoutID),clearInterval(e.intervalID),e.timeoutID=setTimeout(function(){z(1,d,e,v,t,f,h,r,x)},0.1);c("body").css("overflow",w)},300))});c(y[e.current_img_no]).addClass("bNButtonON");h=f.find("img:first");h[0].complete?(c(".myloader",f).css("display","none"),0<a.autoPlay&& 1<s&&(a.showCircleTimer&&(e.arcInitialTime=(new Date).getTime(),e.timeElapsed=0,e.intervalID=setInterval(function(){F(e,a)},125)),e.timeoutID=setTimeout(function(){z(1,a,e,y,t,f,s,r,x)},1E3*a.autoPlay))):h.load(function(){c(".myloader",f).css("display","none");0<a.autoPlay&&1<s&&(a.showCircleTimer&&(e.arcInitialTime=(new Date).getTime(),e.timeElapsed=0,e.intervalID=setInterval(function(){F(e,a)},125)),e.timeoutID=setTimeout(function(){z(1,a,e,y,t,f,s,r,x)},1E3*a.autoPlay))})})};c.fn.roundAbt.defaults= {skin:"attractive",width:960,height:384,width100Proc:!1,height100Proc:!1,autoPlay:4,numberOfVisibleItems:7,elementsHorizontalSpacing:120,elementsVerticalSpacing:20,verticalAdjustment:0,animationTime:0.8,easing:"easeOutQuad",resizeImages:!0,target:"_blank",showElementTitle:!0,showAllControllers:!0,showNavArrows:!0,showOnInitNavArrows:!0,autoHideNavArrows:!0,showBottomNav:!0,showOnInitBottomNav:!0,autoHideBottomNav:!0,showPreviewThumbs:!0,nextPrevMarginTop:0,playMovieMarginTop:0,enableTouchScreen:!0, absUrl:"",showCircleTimer:!0,showCircleTimerIE8IE7:!1,circleRadius:10,circleLineWidth:4,circleColor:"#FF0000",circleAlpha:100,behindCircleColor:"#000000",behindCircleAlpha:50,circleLeftPositionCorrection:3,circleTopPositionCorrection:3,responsive:!1,responsiveRelativeToBrowser:!0,bottomNavMarginBottom:0,origWidth:0,origHeight:0,cntHoUnitOrigWidth:0,cntHoUnitOrigHeight:0,elementOrigTop:0,origthumbsHolder_MarginTop:0,windowOrientationScreenSize0:0,windowOrientationScreenSize90:0,windowOrientationScreenSize_90:0, windowCurOrientation:0}})(jQuery);
/*################ allinone.js ends ###################*/
