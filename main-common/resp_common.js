;(function($){
	$(document).ready(function(){ // document ready starts
		var $showVideo = $('a[rel*="showVideo"], a[data-rel*="showVideo"]');
		
		if($showVideo.length){
			$showVideo.click(function() {
				$.fancybox({
					'autoScale'		: false,
					'scrolling'		: 'yes',
					'transitionIn'	: 'elastic',
					'transitionOut'	: 'elastic',
					'title'			: this.title,
					'width'			: 450,
					'height'		: 350,
					'href'			: this.href.replace(new RegExp("watch\\?v=", "i"), 'v/'),
					'type'			: 'swf',
					'swf'			: {
						 'wmode'		: 'transparent',
						'allowfullscreen'	: 'true'
					}
				});
			
				return false;
			});
		};
		
		
		var $showZoomImage = $('a[rel*="showZoomImage"], a[data-rel*="showZoomImage"]');
				
		if($showZoomImage.length){
			$showZoomImage.fancybox({
				'transitionIn'	: 'elastic',
				'transitionOut' : 'elastic',
				'autoScale'		: false,
				'scrolling'		: true,
				'titlePosition' : 'inside'
			});
		};
		
		
		
		$('.youtube_video_popup').fancybox({
			openEffect  : 'none',
			closeEffect : 'none',
			maxWidth	: 450,
			maxHeight	: 350,
			helpers : {
				media : {}
			}
		});
		
		
		
		
	}); // document ready ends
	
	
	
	
	$.fn.addZoomIcon = function(){ // add zoom icon plugin starts
		if(!this.length) return;
		
		img=document.createElement('img')
		img.src=SRC;
		img.className='pa'
		
		W=Math.floor((Width/100)*(Percentage));
		H=Math.floor((Height/100)*(Percentage));
		W2=Math.floor((Width/100)*(Percentage+10));
		H2=Math.floor((Height/100)*(Percentage+10));
		
		if(XPos=='left')img.style.left='1px';
		else if(XPos=='center')img.style.left=Math.floor(TargetWidth/2 - W/2)+'px';
		else if(XPos=='right')img.style.right='1px';
		else img.style.left=XPos+'px';
		
		if(YPos=='top')img.style.top='1px';
		else if(YPos=='center')img.style.top=Math.floor(TargetHeight/2 - H/2)+'px';
		else if(YPos=='bottom')img.style.bottom='1px';
		else img.style.top=YPos+'px';
		
		$(this).addClass('pr dib')
		$(this).append(img)
		
		
		
		$('img:last', this).css({opacity:MinAlpha, width:W, height:W})
		$(this).hover(
			function(){$('img:last', this).stop(true,true).animate({opacity:MaxAlpha,width:W2,height:H2},500)},
			function(){$('img:last', this).animate({opacity:MinAlpha,width:W,height:H},500)}
		);
	}; // add zoom icon plugin ends

})(jQuery);

jQuery(window).load(function(){
function setFtr(){
var DH = jQuery(document).innerHeight();
var HH = jQuery('header').height();
var MH = jQuery('#middle').height();
var FH = jQuery('footer').outerHeight();
var WH = jQuery(window).height();
var MF = DH - (HH+ MH)-FH;
var TH = HH+MH+FH;
var TMF = WH - TH;
//console.log(DH +'DH, '+ HH  +'HH, '+ MH  +'MH, '+ FH +'FH, '+MF+'MF, '+WH+'WH, '+TH+'TH')
if(TH <= WH){jQuery('footer').css('margin-top', TMF)}};
setTimeout(setFtr,1000)
}); 