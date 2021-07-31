(function($){
	$.fn.PhotoGallery = function(options){
		var defaults = {
			'EnableTitle'				:	true,
			'TitleContainer'			:	'#GalleryTitleContainer',
			'BigImageName'				:	'GalleryBigImage',
			'BigImageClass'				:	'dtc vam ac',
			'BigImageBorderWidth'		:	5,
			'ThumbImageName'			:	'GalleryThumbnail',
			'ThumbImageClass'			:	'bdr cp',
			'ThumbImageBorderWidth'		:	2,
			'EnableButtonControl'		:	true,
			'PrevButton'				:	'.prev',
			'NextButton'				:	'.next',
			'ThumbBorderChange'			:	true,
			'ThumbAlphaChange'			:	true,
			'ThumbAlphaClass'			:	'alpha50'
		}
		
		return this.each(function(){
			var options = $.extend({}, defaults, options);
			var _this = $(this);
			if(options.EnableTitle) var titles = $(options.TitleContainer+' p',_this)
			if(!options.EnableButtonControl) $(options.PrevButton+','+options.NextButton, _this).hide();
		
            if($('span[rel='+options.BigImageName+']',_this).length > 0){
				var bigImages = $('span[rel='+options.BigImageName+']',_this);
				var thumbnails = $('img[rel='+options.ThumbImageName+']',_this);
			}else{
				var bigImages = $('img[rel='+options.BigImageName+']',_this).length ? $('img[rel='+options.BigImageName+']',_this) : $('img[data-rel='+options.BigImageName+']',_this);
				var thumbnails = $('img[rel='+options.ThumbImageName+']',_this).length ? $('img[rel='+options.ThumbImageName+']',_this) : $('img[data-rel='+options.ThumbImageName+']',_this);
			}
			var total = thumbnails.length;
			var current = 0;
			
			
			for(i=0; i<total; i++){
				if(options.EnableTitle) $(titles[i]).css({'display':'none'})
				$(bigImages[i]).addClass(options.BigImageClass).css({'borderWidth':parseInt(options.BigImageBorderWidth)+'px', 'display':'none'})
				$(thumbnails[i]).addClass(options.ThumbImageClass).css({'borderWidth':parseInt(options.ThumbImageBorderWidth)+'px'})
				
				if(options.ThumbBorderChange) ChangeThumbBorder($(thumbnails[i]))
				if(options.ThumbAlphaChange) ChangeThumbAlpha($(thumbnails[i]))
			}
			
			$(bigImages[0]).css('display','')
			if(options.EnableTitle) $(titles[0]).css('display','')
			if(options.ThumbBorderChange) ResetThumbBorder($(thumbnails[0]))
			if(options.ThumbAlphaChange) ResetThumbAlpha($(thumbnails[0]))
			
			
			$('img[rel='+options.ThumbImageName+']',_this).each(function(index){
				$(this).click(function(e){
					current=index;
					SwitchThumb()
				})
			})
			
			if(options.EnableButtonControl){
				$(options.PrevButton,_this).click(function(){
					if(current > 0) current--;
					else current = total-1;
					SwitchThumb()
				})
				
				$(options.NextButton,_this).click(function(){
					if(current == total-1) current = 0;
					else current++;
					SwitchThumb()
				})
			}
			
			function HideElement(elements){
				$(elements, _this).css('display','none')
			}
			
			function ShowElement(elements){
				$(elements, _this).css('display','')
			}
			
			function ChangeThumbAlpha(e){
				e.addClass(options.ThumbAlphaClass)
			}
			
			function ResetThumbAlpha(e){
				e.removeClass(options.ThumbAlphaClass)
			}
			
			function ChangeThumbBorder(e){
				e.css('border-style','dashed');
			}
			
			function ResetThumbBorder(e){
				e.css('border-style','solid');
			}
			
			function SwitchThumb(){
				for(i=0; i<total; i++){
					if(options.EnableTitle) HideElement($(titles[i]))
					HideElement(bigImages[i])
					if(options.ThumbBorderChange) ChangeThumbBorder($(thumbnails[i]))
					if(options.ThumbAlphaChange) ChangeThumbAlpha($(thumbnails[i]))
				}
									
				if(options.EnableTitle) ShowElement($(titles[current]))
				ShowElement(bigImages[current])
				if(options.ThumbBorderChange) ResetThumbBorder($(thumbnails[current]))
				if(options.ThumbAlphaChange) ResetThumbAlpha($(thumbnails[current]))	
			}
		})
	}
})(jQuery)