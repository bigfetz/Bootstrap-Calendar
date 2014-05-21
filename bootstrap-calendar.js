// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

		// undefined is used here as the undefined global variable in ECMAScript 3 is
		// mutable (ie. it can be changed by someone else). undefined isn't really being
		// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
		// can no longer be modified.

		// window and document are passed through as local variable rather than global
		// as this (slightly) quickens the resolution process and can be more efficiently
		// minified (especially when both are regularly referenced in your plugin).

		// Create the defaults once
		var pluginName = "calendar",
				defaults = {
				propertyName: "value"
				},
				weeks = 6,
				weekDays = 7;

		var months = new Array(
			{name : "January"},
	 		{name : "February"},
			{name : "March"},
			{name : "April"},
			{name : "May"},
			{name : "June"},
			{name : "July"},
			{name : "August"},
			{name : "September"},
			{name : "October"},
			{name : "November"},
			{name : "December"}
			);

		var current = {
				year : 2014,
				month : 4,
				day : 1
		};
		

		

		// The actual plugin constructor
		
		function Plugin ( element, options ) {
				this.element = element;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {}, defaults, options );
				this._defaults = defaults;
				this._name = pluginName;
				this.init();
				


		}



		Plugin.prototype = {
				init: function () {
					var self = this;
						// Place initialization logic here
						// You already have access to the DOM element and
						// the options via the instance, e.g. this.element
						// and this.settings
						// you can add more functions like the one below and
						// call them like so: this.yourOtherFunction(this.element, this.settings).
						$(this.element).addClass('calendar-container');
						$(this.element).append('<div class="month-title row">'+
													'<div class="col-md-1 text-center">'+
														'<a class="btn month-direction-arrow left" >' +
															'<i class="glyphicon glyphicon-chevron-left"></i>' +
														'</a>' +
													'</div>' +
													'<div class="col-md-10 text-center">' +
														'<span class="month-name">May</span>' +
													'</div>' + 
													'<div class="col-md-1 text-center">' +
														'<a class="btn month-direction-arrow right" >' +
															'<i class="glyphicon glyphicon-chevron-right"></i>' +
														'</a>' + 
													'</div>' +
												'</div>'+
												'<div class="row day-header">'+
													'<div class="col-md-12 no-padding">'+
														'<div>Sunday</div>'+
														'<div>Monday</div>'+
														'<div>Tuesday</div>'+
														'<div>Wenesday</div>'+
														'<div>Thursday</div>'+
														'<div>Friday</div>'+
														'<div>Saterday</div>'+
													'</div>' +
												'</div>'+
												'<div class="days-container">'+
												'</div>'	
												);
						
						populate(getMonth(2014,4));

						$('.month-direction-arrow').click(function(){	
            				if($(this).hasClass('right'))
            				{
            					mooveMonth(1);
            					populate(getMonth(current.year,current.month));
            				}else{
            					mooveMonth(-1);
            					populate(getMonth(current.year,current.month));
            				}
        				});

				}
		};

		//Private methods
		var populate = function (days) {
					$('.days-container').empty();
					$('.month-name').text(months[current.month].name + ' ' + current.year);	
					for(var i = 0; i < weeks; i++)
						{
							$('.days-container').append('<div class="week"></div>')
						}
					var index = 0;
						for(var week = 0; week < weeks ; week++)
						{
							for(var weekday = 0; weekday < weekDays; weekday++)
							{
								if(days[index].isInMonth)
								{
									$($('.week')[week]).append('<a class="day"><div class="row"><span>'+ days[index].day +'</span></div><div class="row day-info"></div></div>');
								}else{
									$($('.week')[week]).append('<a class="day other-month"><div class="row"><span>'+ days[index].day +'</span></div><div class="row day-info"></div></div>')
								}
								
								index++;
							}
						}

				}

		var getMonth = function (year,month){
			debugger;
			var m = new Date();
			m.setFullYear(year,month,1);
			var monthArray = new Array(42);

			var prevMonthDays = new Date(year, month, 0).getDate();
			var currentMonthDays = new Date(year, month+1, 0).getDate();
			for(var i = m.getDay(); i > 0 ;i--)
			{
				monthArray[m.getDay() - i] = {
					day : prevMonthDays-i+ 1,
					isInMonth : false
					};
			}
			
			for(var i = 0; i < currentMonthDays;i++)
			{
				monthArray[m.getDay() + i] = {
					day : i+1,
					isInMonth : true
					};
			}
			var index = 1;
			for(var i = m.getDay() + currentMonthDays; i < 42 ;i++)
			{
				monthArray[i] = {
					day :   index,
					isInMonth : false
					};
					index++;
			}

			return monthArray;

		}

		var mooveMonth = function(move){

			if(current.month + move < 0 )
			{
				current.year--;
				current.month = 11;

			}else if(current.month + move > 11){
				current.year++
				current.month = 0;


			}else{
				current.month += move;
			}

		}

		

		var startingWeekDay =  function (year){
				  var d = new Date(); 
				  d.setFullYear(year,0,1);
				  return d.getDay()+1;
				}



		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function ( options ) {
				this.each(function() {
						if ( !$.data( this, "plugin_" + pluginName ) ) {
								$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
						}
				});

				// chain jQuery functions
				return this;
		};

})( jQuery, window, document );