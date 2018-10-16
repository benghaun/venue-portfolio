$('[data-fancybox="assistant"]').fancybox.open({
	src  : '/assistant',
	type : 'iframe',
	opts : {
		afterShow : function( instance, current ) {
			console.info( 'done!' );
		}
	}
});