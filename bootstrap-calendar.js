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

		//todo organize constants


		var pluginName = "calendar",
				defaults = {
				propertyName: "value"
				},
				weeks = 6,
				weekDays = 7;

		var months = new Array(
			"January",
	 		"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
			);

		var current = {
				year : 2014,
				month : 4,
				day : 1
		};

		var events;

		

		

		// The actual plugin constructor
		
		function Plugin ( element, options ) {
				this.element = element;
				// jQuery has an extend method which merges the contents of two or
				// more objects, storing the result in the first object. The first object
				// is generally empty as we don't want to alter the default options for
				// future instances of the plugin
				this.settings = $.extend( {'events' : null }, options );
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
						events = this.settings.events;
						populate(getMonth(2014,4),events);
						initializeEvents();
						
						$('.month-direction-arrow').click(function(){	
            				if($(this).hasClass('right'))
            				{
            					moveMonth(1);
            					populate(getMonth(current.year,current.month),events);
            				}else{
            					moveMonth(-1);
            					populate(getMonth(current.year,current.month),events);
            				}
            				initializeEvents();
        				});

						

	        			
						


				},


		};



		

		//Private methods


		var initializeEvents = function (){
			$('.day').click(function(e){
							$('.display-container').remove();
							displayDay(this,1);
							e.stopPropagation();
	        			})

        				$(document.body).click(function(e){
	        				$('.display-container').remove();
	        			});	
		}

		/**
		 * Displays the current days events in a popup modal 
		 * @param {Element} e 
		 * @param {date} events 
		 * @return None
		 */
		var displayDay = function(e,date){
			$(e).append('<div class="display-container"><div class="top-pointer"></div><div class="display-day"></div></div>')
		}

		/**
		 * Populates the days-container with current months days 
		 * with empty spaces filled with prev and next months.
		 * @param {Number} days 
		 * @param {JSON} events 
		 * @return None
		 */
		var populate = function (days,events) {
					$('.days-container').empty();
					$('.month-name').text(months[current.month] + ' ' + current.year);	
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
									$($('.week')[week]).append('<a class="day " day-value="'+ days[index].day +'"><div class=""><span class="">'+ days[index].day +'</span></div><div class=" day-info"></div></div>');
								}else{
									$($('.week')[week]).append('<a class="day other-month day-value="'+ days[index].day +'"><div class=""><span>'+ days[index].day +'</span></div><div class=" day-info"></div></div>')
								}
								
								index++;
							}
						}
						loadEvents();
						

				}

		/**
		 * Loads events into current month
		 * @return None
		 */
		var loadEvents = function (){
			$.each(events,function(index,value){	
							var date = new Date(value.date)
							debugger;
							if(date.getMonth() == current.month && date.getFullYear() == current.year)	
							{
								$('a[day-value]').each(function(day){
									if(date.getDate() == day)
									{
										$(this).find('.day-info').append('<input type="hidden" name="eventIndex" value="'+ index +'">')
										$(this).find('.day-info').append(value.description);
									}
								});	
							}					
						});
		}

		/**
		 * Gets an array of day objects that hold the day number 
		 * and wether it is in the current month
		 * @param {Number} year 
		 * @param {Number} month 
		 * @return monthArray
		 */
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


		/**
		 * Moves the current month left or right depending on input
		 * @param {Number} move 
		 * @return None
		 */
		var moveMonth = function(move){

			if(move >0)
			{
				debugger;
				current.year += Math.floor((current.month + 1) / 12);
				current.month = (current.month + 1) % 12;
			}else if(move < 0){
				current.year += current.month - 1  < 0 ? -1 : 0;
				current.month = current.month - 1  < 0 ? 11 : current.month - 1;
			}

		}

		/**
		 * Gets the day of the week for januray 1st of inputed year
		 * @param {Number} year 
		 * @return {Number} weekday
		 */
		var startingWeekDay =  function (year){
				  var d = new Date(); 
				  d.setFullYear(year,0,1);
				  return d.getDay()+1;
				}


		//End Private methods


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