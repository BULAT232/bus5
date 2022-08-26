(function($){
    "use strict";	
	
	// Site Preloader
	//----------------------------------------//
	$(window).load(function() {	
		 $('#loader').fadeOut('slow', function(){
			  $(this).remove();
		 }); 
	});	
	
	$(document).ready(function(){
		
		// Top menu
		//----------------------------------------//
		$('.top-expand').on('click', function(){
			$('.header').toggleClass('expanded')
		})
		
		// Megamenu
		//----------------------------------------//
		
		if (!("ontouchstart" in document.documentElement)) {
			//document.documentElement.className += " no-touch";
		}

		$('.open-menu').on('click', function(){
			if ( $('.megamenu > ul').is(':hidden') ) {
				$('.megamenu ul').removeAttr('style')
				$('.megamenu .menu-toggle').removeClass('active')
			}
			
			$('.megamenu > ul').toggle()	
		})
		
		// First lvl toggle
		$('.megamenu > ul > li > .menu-toggle').on('click', function(){
			
			
			if ( $(this).next('ul').is(':hidden') ) {
				$('.megamenu > ul > li ul').removeAttr('style')
				$('.megamenu .menu-toggle').removeClass('active')
			}
			
			$(this).toggleClass('active')
			$(this).next('ul').toggle()	
		})
		
		$('.megamenu > ul > li > ul .menu-toggle').on('click', function(){
			//$('.megamenu > ul > li > ul').removeAttr('style')
			//$('.megamenu .menu-toggle').removeClass('active')
			$(this).toggleClass('active')
			$(this).next('ul').toggle()	
			
			
		})
		
		$(document).on('click', '.megamenu, .open-menu', function(e) {
			e.stopPropagation()
		})
		

		$(document).on('click', function(e){
			if ($(window).width() > 991) {
				$('.megamenu ul').removeAttr('style')
			}
			
		})
		
		// Mainpage slider
		//----------------------------------------//
		$( '#slider' ).sliderPro({
			fade: true,
			width: 848,
			height: 436,
			arrows: true,
			buttons: true,
			waitForLayers: true,
			autoplay: true,
			autoplayDelay: 7000,
			autoScaleLayers: false,
		});
		
		// Mainpage products carousel
		//----------------------------------------//
		$('.owl-carousel')
			.on('initialized.owl.carousel changed.owl.carousel refreshed.owl.carousel', function (event) {
				if (!event.namespace) return;
				var carousel = event.relatedTarget,
					element = event.target,
					current = carousel.current();
				$('.owl-next', element).toggleClass('disabled', current === carousel.maximum());
				$('.owl-prev', element).toggleClass('disabled', current === carousel.minimum());
			})
			.owlCarousel({
				loop:false,
				margin:20,
				nav:true,
				responsive:{
					0:{
						items:1,
						slideBy: 1,
					},
					768:{
						items:3,
						slideBy: 2,
					}
				},
				navText: ['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>']
			})

		// Parallax banner
		//----------------------------------------//
		$(".parallax-banner").pureparallax();
		
		// Change products price
		//----------------------------------------//
		$('select[name=variant]').on('change',  function() {
			var price = $(this).find('option:selected').data('price'),
				sku = '',
				compare = '';
			
			if ( $(this).data('blockid') ) {
				var id = $(this).data('blockid');
			} else {
				var id = $(this).data('productid');
			}
			
			
			if( typeof $(this).find('option:selected').data('sku') == 'string' ) {
				sku = $(this).find('option:selected').data('sku');
				$('.product-sku').html(sku).parent('tr').show()
			} else {
				$('.product-sku').parent('tr').hide()
				
			}
			if( typeof $(this).find('option:selected').data('compare') == 'string' ) 
				compare = '<del>' +  $(this).find('option:selected').data('compare') + '</del>';
		
			$('#product_price_' + id).html(price + compare)
			
			
		});

		
		// Magnific Popup Lightbox
		//----------------------------------------//
		

			
		$('.magnific-gallery').magnificPopup({ 
		  
		  type: 'image',
		  delegate: 'a',
		  removalDelay: 300,
		  mainClass: 'mfp-fade',
		  
		  gallery:{enabled:true}
		  
		});

		// Callback
		//----------------------------------------//
		$('.mfp-callback').magnificPopup({
			type: 'inline',

			fixedContentPos: false,
			fixedBgPos: true,

			overflowY: 'auto',

			closeBtnInside: true,
			preloader: false,

			midClick: true,
			removalDelay: 300,
			mainClass: 'mfp-fade'
		});
		
		$(".phone-mask").mask("+7 (999) 999-9999");
		
		$('#form-callback').on('submit', function(e){
			e.preventDefault();

			$.ajax({
				url: "ajax/multipurpose_callback.php",
				data: $("#form-callback").serialize(),
				type: "POST",
				success: function(data) {
					$('#form-callback .result').html('')
					
					switch (data) {
						case 'empty_phone':
							$("#form-callback .result").html('<p class="error">Введите номер телефона</p>');
							break;
						case 'success':
							$('#form-callback .popup-inner').addClass('mfp-hidden')
							$('#form-callback .success-box').removeClass('mfp-hidden')	
							break;
					}
				},
				error: function(xhr, status, error) {
					alert('Произошла ошибка, повторите попытку позже')
				}
			});
		})
		
		// Catalog page - sort
		//----------------------------------------//
		$('#sort, #currencies').change(function() {
			window.location = $(':selected',this).val()
		});
		
		// Catalog page - view
		//----------------------------------------//
		$('#view a').on('click', function(e){
			e.preventDefault();
			
			var $this = $(this),
				view = $this.data('view');
			
			if ( !$this.hasClass('current') ) {
				$.ajax({
					url: "ajax/multipurpose_view.php",
					data: {view: view},
					dataType: 'json',
					success: function(data) {
						$('#view a').removeClass('current')
						$('#products').removeClass('products-list products-grid products-table').addClass( 'products-' + view)
						$this.addClass('current')
					}
				});
				
				
			}
			
		})
		
		// Catalog page - Price Range
		//----------------------------------------//
		var f_minPrice = parseInt( $('#f_minPrice').val() ),
			f_maxPrice = parseInt( $('#f_maxPrice').val() ),
			f_currentMinPrice = parseInt( $('#f_currentMinPrice').val() ),
			f_currentMaxPrice = parseInt( $('#f_currentMaxPrice').val() ),
			f_priceStep = parseInt( $('#f_priceStep').val() ),
			f_postfix = $('#f_postfix').val();
			
		$("#price-slider").ionRangeSlider({
			type: "double",
			postfix: f_postfix,
			decorate_both: false,
			force_edges: true,
			hide_min_max: true,
			grid: true,
			grid_num: 2,
			min: f_minPrice,
			max: f_maxPrice,
			from: f_currentMinPrice,
			to: f_currentMaxPrice,
			step: f_priceStep,
			onChange: function (data) {
				$("#min_price").val(data.from);
				$("#max_price").val(data.to);
			},
		});
		
		// Product|Cart page items counter
		//----------------------------------------//
		$(".qty-btn").on("click", function() {
			var $button = $(this);
			var oldValue = $button.siblings('.qty-input').val();
			var newVal;
			
			if ($button.hasClass('plus')) {
				newVal = parseFloat(oldValue) + 1;
				$button.siblings('.qty-input').val(newVal).change();
			} else {
				if (oldValue > 1) {
			  		newVal = parseFloat(oldValue) - 1;
					$button.siblings('.qty-input').val(newVal).change();
				} else {
			  		return false
				}
			}
		});
		
		// Search autocomplete
		//----------------------------------------//
		$(".search-input").autocomplete({
			serviceUrl:'ajax/search_products.php',
			minChars:1,
			noCache: false, 
			onSelect:
				function(suggestion){
					 $(".search-input").closest('form').submit();
				},
			formatResult:
				function(suggestion, currentValue){
					var reEscape = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'].join('|\\') + ')', 'g');
					var pattern = '(' + currentValue.replace(reEscape, '\\$1') + ')';
	  				return (suggestion.data.image?"<div class='image'><img src='"+suggestion.data.image+"'></div>":'') + "<div class='title'>" + suggestion.value.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>') + "</div>";
				}	
		});
		
		// Wishlist
		//----------------------------------------//
		$('.to-wishlist').on('click', function(e){
			var $this = $(this);
				
				
			if ( !$this.hasClass('added') ) {
				e.preventDefault();
				var	id = $this.data('id'),
					name = $this.data('name'),
					src = $('#product_image_' + id).attr('src');
					
				$.ajax({
					url: "ajax/multipurpose_wishlist.php",
					data: {id: id},
					dataType: 'json',
					success: function(data) {
						$('#wishlist_informer').html(data.informer);
						$('#wishlist_menu a').html(data.menu);
						$this.addClass('added').find('span').html('В закладках')
						
						var notification = new NotificationFx({
							message : '<div class="icon"><img src="' + src + '"></div><p><span>"' + name + '" добавлен в закладки.</span> <a href="wishlist" class="btn btn-light">Перейти к закладкам</a></p>',
							layout : 'bar',
							effect : 'slidetop',
							type : 'notice', // notice, warning or error
							ttl : 7000
						});
						
						notification.show();
						
					}
				});
				//return false;
			}
		});
		
		$('.remove-from-wishlist').on('click', function(e){
			e.preventDefault();
			
			var $this = $(this),
				remove_id = $(this).data('id'),
				categories = $(this).data('categories');

			$.ajax({
				url: "ajax/multipurpose_wishlist.php",
				data: {remove_id: remove_id},
				dataType: 'json',
				success: function(data) {
					$.each(categories, function( index, value ) {
						var $count = $('#wishlist-cat-' + value).find('.count');
						if( parseInt($count.html(), 10 ) -1 == 0 ) 
							$('#wishlist-cat-' + value).remove()
						else
							$count.html( parseInt($count.html(), 10 ) -1 )
					})
				
					$this.parents('.col-sm-4').remove();
					
					$('.products-grid .clearfix').remove();
					
					$(".products-grid .col-sm-4:nth-child(3)").after("<div class='clearfix'></div>");

					if ( $('.products-grid .col-sm-4').length < 1)
						window.location.href = 'wishlist';

					$('#wishlist_informer').html(data.informer);
					$('#wishlist_menu a').html(data.menu);
				}
			});
		});
		
		$('.remove-wishlist').on('click', function(e){
			e.preventDefault();
			
			var $this = $(this),
				remove_all = $(this).data('id');

			$.ajax({
				url: "ajax/multipurpose_wishlist.php",
				data: {remove_all: true},
				dataType: 'json',
				success: function(data) {
					window.location.href = 'wishlist';
				}
			});
			
		});
		
		// Compare
		//----------------------------------------//
		$('.to-compare').on('click', function(e){
			var $this = $(this);
			
			if ( !$this.hasClass('added') ) {
				e.preventDefault();

				var	id = $this.data('id'),
					name = $this.data('name'),
					src = $('#product_image_' + id).attr('src');
					
				$.ajax({
					url: "ajax/multipurpose_compare.php",
					data: {id: id},
					dataType: 'json',
					success: function(data) {
						$('#compare_informer').html(data.informer);
						$('#compare_menu a').html(data.menu);
						$this.addClass('added').find('span').html('В сравнении')
						
						var notification = new NotificationFx({
							message : '<div class="icon"><img src="' + src + '"></div><p><span>"' + name + '" добавлен в сравнение.</span> <a href="compare" class="btn btn-light">Сравнить товары</a></p>',
							layout : 'bar',
							effect : 'slidetop',
							type : 'notice', // notice, warning or error
							ttl : 7000
						});
						
						notification.show();
					}
				});
				//return false;
			}
		});
		
		$('.remove-from-compare').on('click', function(e){
			e.preventDefault();
			
			var $this = $(this),
				remove_id = $(this).data('id'),
				categories = $(this).data('categories');

			$.ajax({
				url: "ajax/multipurpose_compare.php",
				data: {remove_id: remove_id},
				dataType: 'json',
				success: function(data) {
					$.each(categories, function( index, value ) {
						var $count = $('#compare-cat-' + value).find('.count');
						if( parseInt($count.html(), 10 ) -1 == 0 ) 
							$('#compare-cat-' + value).remove()
						else
							$count.html( parseInt($count.html(), 10 ) -1 )
					})
				
					$('.compare-' + remove_id).remove();
					
					$('.compare-table').css('width', $('.compare-product').length * 228 + 228)
					
					compareMatch()
					
					if ( $('.compare-product').length < 1)
						window.location.href = 'compare';

					$('#compare_informer').html(data.informer);
					$('#compare_menu a').html(data.menu);
					
					$('.compare-row > div').matchHeight();
				}
			});
		});
		
		$('.remove-compare').on('click', function(e){
			e.preventDefault();
			
			var $this = $(this),
				remove_all = $(this).data('id');

			$.ajax({
				url: "ajax/multipurpose_compare.php",
				data: {remove_all: true},
				dataType: 'json',
				success: function(data) {
					window.location.href = 'compare';
				}
			});
			
		});
		
		function compareMatch(){
			if ( $('.compare-product').length < 2) {
				$('.compare-row').removeClass('match')
			} else {
				$('.compare-row').each(function(){
					var $this  = $(this),
						values = $this.find('.feature-value'),
						match = false;

					for (var i = 0; i < values.length; i++)
						if ( $(values[0]).text() == $(values[i]).text() ) {
							match = true;
						} else {
							match = false;
							 break;
						}
						
					if(match)
						$this.addClass('match')
				})
			}
		}
		
		compareMatch()
		
		$('.compare-row > div').matchHeight();
		
		$('.compare-params a').on('click', function(e){
			e.preventDefault();
			
			var $this = $(this);

			if ($this.data('param') == 'all')
				$('.compare-table').removeClass('diffirent')
			else
				$('.compare-table').addClass('diffirent')
			
			$('.compare-params a').removeClass('selected')
			$this.addClass('selected')
		})
		
	
		$(window).scroll(function() {
			if ( $('.compare-table').length > 0 ) {
				if ($(window).scrollTop() > $('.compare-table').offset().top) {
					
					$('.compare-table').addClass('fixed-top').css('padding-top', $('.compare-table .products-row').outerHeight(true));
					$('.compare-table .products-row').css('top', $(window).scrollTop() - $('.compare-table').offset().top - 1);
						
				} else {
					 //num = $('.compare-table').offset().top;
					 $('.compare-table').removeClass('fixed-top');
					 $('.compare-table').css('padding-top', 0);
					 $('.compare-table .products-row').css('top', 0);
				}
			}
			
		}).scroll();
			
		// Footer - subscribe dummy form
		//----------------------------------------//
		$("#newsletter_form").on('submit', function(){
			$('.subscribe-button').find(".fa-check").css({"opacity" : "1"}).siblings("i").css({"opacity" : "0"});
			return false
		});
		
		
		// Sidebar mobile toggle
		//----------------------------------------//
		$(".title .toggle").on('click touch', function(){
			$(this).parent('.title').toggleClass('opened')
		});
		
		// User change password
		//----------------------------------------//
		$("#user-change-password").on('click touch', function(e){
			e.preventDefault();
			$("#user-password-row").removeClass('hidden').find('input').focus()
			$(this).remove()
			
		})
		
		// Reset payment
		//----------------------------------------//
		$(".reset-payment").on('click touch', function(e){
			e.preventDefault();
			$(this).closest('form').submit();
			
		})
		
	});
})(window.jQuery);