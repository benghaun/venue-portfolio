function launchAssistant(args){
	$('#assistant').fancybox({
		iframe: {
    	// Iframe template
		    tpl:
		      '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" allowfullscreen allow="autoplay; fullscreen" src="" sandbox="allow-top-navigation allow-scripts allow-forms"></iframe>',

		    // Preload iframe before displaying it
		    // This allows to calculate iframe content width and height
		    // (note: Due to "Same Origin Policy", you can't get cross domain data).
		    preload: true,

		    // Custom CSS styling for iframe wrapping element
		    // You can use this to set custom iframe dimensions
		    css: {
		    },

		    // Iframe tag attributes
		    attr: {
		      scrolling: "auto"
		    }
		},

	});

	$.fancybox.open({
		src  : '/assistant/?' + encodeQueryData(args) ,
		type : 'iframe',
		opts : {
			afterLoad : function( instance, current ) {
				console.info( 'done!' );				
				var fancybox_content = document.getElementsByClassName('fancybox-content');
				fancybox_content[0].style.background = "transparent";
			},
			afterShow : function( instance, current ) {
				console.info( 'done!' );				
				var fancybox_slide = document.getElementsByClassName('fancybox-slide--iframe');
				console.log(fancybox_slide[0]);
				fancybox_slide[0].style.overflow = 'hidden !important';
				console.log(fancybox_slide[0].style.overflow);
			}
		}
	});
}

function encodeQueryData(data) {
   let ret = [];
   for (let d in data)
     ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
   return ret.join('&');
}