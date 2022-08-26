(function($){
    "use strict";	
	
	$(document).ready(function(){
		// Add to cart
		//----------------------------------------//
		$('form.variants').on('submit', function(e) {
			e.preventDefault();
			
			var self = $(this),
				id = self.data('id'),
				name = self.data('name'),
				v_name = '',
				variant = $('#variant_' + id).val(),
				amount = 1,
				src = $('#product_image_' + id).attr('src');
				
			if( typeof $('#variant_' + id).find('option:selected').data('name') == 'string' )
				v_name = ', ' + $('#variant_' + id).find('option:selected').data('name')
			
			if( $(this).find('[name=amount]') ) 
				amount = $(this).find('[name=amount]').val();	
			
			$.ajax({
				url: "ajax/multipurpose_cart.php",
				data: {variant: variant, amount: amount},
				dataType: 'json',
				success: function(data){
					$('#cart_informer').html(data.cart_informer);

					var notification = new NotificationFx({
						message : '<div class="icon"><img src="' + src + '"></div><p><span>"' + name + v_name + '" добавлен в корзину.</span> <a href="cart" class="btn btn-light">Оформить&nbsp;заказ</a></p>',
						layout : 'bar',
						effect : 'slidetop',
						type : 'notice', // notice, warning or error
						ttl : 7000
					});
					
					notification.show();
				}
			});
		});
		
		// Cart page - coupon submit
		//----------------------------------------//
		$("input[name='coupon_code']").keypress(function(ev){
			if(ev.keyCode == 13){
				ev.preventDefault();
				cartUpdate({});
			}
		});

		$('#coupon_apply').click(function(ev){
			ev.preventDefault();
			cartUpdate({});
		})

		// Cart page - update cart
		//----------------------------------------//
		$('#cart_informer')	.delegate('.remove', 'click', function( ev ){
							ev.preventDefault();
							cartUpdate({ remove_id: $(this).data('id') });
						})
						
		// Cart page - update cart
		//----------------------------------------//
		$('#purchases')	.delegate('.qty-input', 'change', function( ev ){
							ev.preventDefault();
							cartUpdate({ update_id: $(this).data('id'), amount: $(this).val() })
						})
						.delegate('.remove', 'click', function( ev ){
							ev.preventDefault();
							cartUpdate({ remove_id: $(this).data('id') });
						})

		// Cart page - change delivery
		//----------------------------------------//
		$('#deliveries').delegate('input[type=radio]', 'change', function(){ 
							cartUpdate({delivery_id: $('#deliveries').find('input:checked').val(), delivery_change: true});
						})
						.delegate('.delivery-head', 'click', function(){
							$(this).on('click', function(event){
								var selectedItem = $(this);
								if( !selectedItem.hasClass('selected') ) {
									
									$('#deliveries').find('.delivery').addClass('has-animate').find('.selected').removeClass('selected');
									selectedItem.addClass('selected');
									
									// scroll to top feature
									//var offset = $(this).offset(); 
									//if($(window).scrollTop() > offset.top)
									//	$('body,html').scrollTop(offset.top);
								}
							});
						});
	
		// Order page - payment accordion
		//----------------------------------------//
		$('#payment')	.delegate('label', 'click',function(e){
							if($(this).parents('.panel').children('.collapse').hasClass('in'))
								e.stopPropagation();
						});
		
	
	
		// Cart update
		//----------------------------------------//
		function cartUpdate(options){
			options.delivery_id = $('#deliveries').find('input:checked').val();
			options.coupon_code = $("#coupon_code").val();

			$.ajax({
				url: "ajax/multipurpose_cart_update.php",
				data: options,
				success: function(data){
					if(data){
						$('#cart_title').html(data.cart_title);
						$('#cart_informer').html(data.cart_informer);
						if ( data.total_products == 0 ) {
							$('#purchases').html(data.cart_empty);
						} else {
							$('#cart_item_' + options.remove_id).remove();
							$('#cart_item_total_' + options.update_id).html(data.cart_item_total);
							$('.cart_items_total').html(data.cart_items_total);
							$('#cart_total').html(data.cart_total);
							if (!options.delivery_change)
								$('#deliveries').html(data.delivery);
							$('#delivery_cost').html(data.delivery_cost);
							$('#cart_coupon').html(data.cart_coupon);
							$('#coupon_result').html(data.coupon_result);
							if ( data.coupon_status == 'success' ) {
								$('#cart_coupon').parent().removeClass('hidden')
							} else {
								$('#cart_coupon').parent().addClass('hidden')
							}
						}
					}
				}
			});
		}
	})
})(window.jQuery);