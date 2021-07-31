(function($){
	$.fn.PagingPhotoGallery=function(options){
		var defaults={
			AParentClasses		:	'paging ac pt5px',
			AOnClasses			:	'dib bdr w15px on b cd',
			AOffClasses			:	'dib bdr w15px'
		}
		
		return this.each(function(){
			var options = $.extend({}, defaults, options);
			var _this = $(this);
			var html;
			var total=$('> p',_this).length;
			
			if(total>1){
				html='<p class="'+options.AParentClasses+'">';
				for(i=0;i<total;i++){
					html+='<a href="javascript:void(0);" class="'+options.AOffClasses+'">'+(i+1)+'</a> ';
				}
				html+='</p>'
				
				_this.append(html);
				
				$('.paging a:eq(0)',_this).removeClass(options.AOffClasses).addClass(options.AOnClasses)
				
				$('.paging a',_this).each(function(index){
					$(this).click(function(){
						for(i=0;i<total;i++){
							$('p:eq('+i+')',_this).hide();
							$('.paging a:eq('+i+')',_this).removeClass(options.AOnClasses).addClass(options.AOffClasses);
						}
						
						$('p:eq('+index+')',_this).fadeIn('slow');
						$('.paging a:eq('+index+')',_this).addClass(options.AOnClasses);
					})
				})	
			}
		})
	}
})(jQuery);