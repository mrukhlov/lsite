$(document).ready(function() {
	var select_box = $('.service_select_box');
	var secondSelectOptions = $('.action_select_box');
	secondSelectOptions.children('option').hide();
	//select_box.on('change', function(e) {
	select_box.chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true, width: '15%'}).change(function(e) {
			var value = $(this).val();
			console.log('event ', select_box.val().toLowerCase());
			console.log('event ', select_box);
			var select_val = select_box.val().toLowerCase()
			//secondSelectOptions.children('option').hide()
			if (select_val == 'apps'){
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="apps.close"]').show()
				secondSelectOptions.find('option[value="apps.open"]').show()
				secondSelectOptions.find('option[value="apps.remove"]').show()
				secondSelectOptions.find('option[value="apps.download"]').show()
				secondSelectOptions.find('option[value="apps.update"]').show()
			} else if (select_val == 'assistant app') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="manage_app.clearhistory"]').show()
				secondSelectOptions.find('option[value="manage_app.close"]').show()
				secondSelectOptions.find('option[value="manage_app.open_menu"]').show()
				secondSelectOptions.find('option[value="manage_app.rate"]').show()
				secondSelectOptions.find('option[value="manage_app.switch_function"]').show()
				secondSelectOptions.find('option[value="manage_app.uninstall"]').show()
				secondSelectOptions.find('option[value="manage_app.update"]').show()
			} else if (select_val == 'ask') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="ask.friends"]').show()
			} else if (select_val == 'assistant') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="agent.areyou"]').show()
				secondSelectOptions.find('option[value="agent.be"]').show()
				secondSelectOptions.find('option[value="agent.youare"]').show()
			} else if (select_val == 'auth') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="auth.signin"]').show()
				secondSelectOptions.find('option[value="auth.signout"]').show()
				secondSelectOptions.find('option[value="auth.signup"]').show()
			} else if (select_val == 'book') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="book.contexts"]').show()
				secondSelectOptions.find('option[value="book.flight"]').show()
				secondSelectOptions.find('option[value="book.hotel"]').show()
				secondSelectOptions.find('option[value="book.restaurant"]').show()
				secondSelectOptions.find('option[value="book.unknown"]').show()
			} else if (select_val == 'briefing') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="briefing.edit"]').show()
				secondSelectOptions.find('option[value="briefing.schedule"]').show()
				secondSelectOptions.find('option[value="briefing.set"]').show()
			} else if (select_val == 'browse') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="browse.open"]').show()
			} else if (select_val == 'calculator') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="calculator.currency"]').show()
				secondSelectOptions.find('option[value="calculator.currency_service"]').show()
				secondSelectOptions.find('option[value="calculator.math"]').show()
				secondSelectOptions.find('option[value="calculator.tips"]').show()
				secondSelectOptions.find('option[value="calculator.units"]').show()
			} else if (select_val == 'calendar') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="calendar.add"]').show()
				secondSelectOptions.find('option[value="calendar.birthdays"]').show()
				secondSelectOptions.find('option[value="calendar.calendars.add"]').show()
				secondSelectOptions.find('option[value="calendar.calendars.change"]').show()
				secondSelectOptions.find('option[value="calendar.calendars.remove"]').show()
				secondSelectOptions.find('option[value="calendar.get"]').show()
				secondSelectOptions.find('option[value="calendar.remove"]').show()
				secondSelectOptions.find('option[value="calendar.reschedule"]').show()
				secondSelectOptions.find('option[value="calendar.service"]').show()
			} else if (select_val == 'check in') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="checkin.venue"]').show()
				secondSelectOptions.find('option[value="checkin.venue_service"]').show()
			} else if (select_val == 'clock') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="apps.close"]').show()
				secondSelectOptions.find('option[value="clock.alarm_set"]').show()
				secondSelectOptions.find('option[value="clock.alarm_check"]').show()
				secondSelectOptions.find('option[value="clock.alarm_change"]').show()
				secondSelectOptions.find('option[value="clock.alarm_remove"]').show()
				secondSelectOptions.find('option[value="clock.date"]').show()
				secondSelectOptions.find('option[value="clock.stopwatch"]').show()
				secondSelectOptions.find('option[value="clock.astronomy"]').show()
				secondSelectOptions.find('option[value="clock.time"]').show()
				secondSelectOptions.find('option[value="clock.time_difference"]').show()
				secondSelectOptions.find('option[value="clock.time_zones"]').show()
				secondSelectOptions.find('option[value="clock.convert"]').show()
				secondSelectOptions.find('option[value="clock.math"]').show()
				secondSelectOptions.find('option[value="clock.timer_start"]').show()
				secondSelectOptions.find('option[value="clock.timer_stop"]').show()
				secondSelectOptions.find('option[value="clock.timedate"]').show()
			} else if (select_val == 'contacts') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="call.call"]').show()
				secondSelectOptions.find('option[value="call.dial"]').show()
				secondSelectOptions.find('option[value="call.call_back"]').show()
				secondSelectOptions.find('option[value="call.redial"]').show()
				secondSelectOptions.find('option[value="call.answer"]').show()
				secondSelectOptions.find('option[value="call.voicemail"]').show()
				secondSelectOptions.find('option[value="call.confirm_on"]').show()
				secondSelectOptions.find('option[value="call.confirm_off"]').show()
				secondSelectOptions.find('option[value="email.write"]').show()
				secondSelectOptions.find('option[value="email.edit"]').show()
				secondSelectOptions.find('option[value="email.read"]').show()
				secondSelectOptions.find('option[value="email.forward"]').show()
				secondSelectOptions.find('option[value="email.notify"]').show()
				secondSelectOptions.find('option[value="messages.write"]').show()
				secondSelectOptions.find('option[value="messages.edit"]').show()
				secondSelectOptions.find('option[value="messages.forward"]').show()
				secondSelectOptions.find('option[value="messages.reply"]').show()
				secondSelectOptions.find('option[value="messages.read"]').show()
				secondSelectOptions.find('option[value="messages.check"]').show()
				secondSelectOptions.find('option[value="messages.notify_on"]').show()
				secondSelectOptions.find('option[value="messages.notify_off"]').show()
				secondSelectOptions.find('option[value="contacts.nicknames.save"]').show()
				secondSelectOptions.find('option[value="contacts.nicknames.get"]').show()
				secondSelectOptions.find('option[value="contacts.nicknames.remove"]').show()
				secondSelectOptions.find('option[value="contacts.nicknames.clear"]').show()
				secondSelectOptions.find('option[value="contacts.nicknames.change"]').show()
				secondSelectOptions.find('option[value="contacts.index_on"]').show()
				secondSelectOptions.find('option[value="contacts.index_off"]').show()
			} else if (select_val == 'contexts') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="list.navigation"]').show()
			} else if (select_val == 'device') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="device.switch"]').show()
				secondSelectOptions.find('option[value="device.check"]').show()
				secondSelectOptions.find('option[value="device.sound"]').show()
			} else if (select_val == 'entertainment') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="user.bored"]').show()
				secondSelectOptions.find('option[value="compliments.good"]').show()
				secondSelectOptions.find('option[value="compliments.bad"]').show()
				secondSelectOptions.find('option[value="count.number"]').show()
				secondSelectOptions.find('option[value="facts.say"]').show()
				secondSelectOptions.find('option[value="entertainment.fun"]').show()
				secondSelectOptions.find('option[value="entertainment.images"]').show()
				secondSelectOptions.find('option[value="parrot.repeat"]').show()
				secondSelectOptions.find('option[value="songs.sing"]').show()
				secondSelectOptions.find('option[value="entertainment.sleep"]').show()
				secondSelectOptions.find('option[value="spell.words"]').show()
				secondSelectOptions.find('option[value="stories.tell"]').show()
				secondSelectOptions.find('option[value="wisdom.fun"]').show()
			} else if (select_val == 'events') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="events.search"]').show()
				secondSelectOptions.find('option[value="events.service"]').show()
			} else if (select_val == 'finance') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="finance.stocks"]').show()
				secondSelectOptions.find('option[value="finance.service"]').show()
			} else if (select_val == 'games') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="game.rock_paper_scissors"]').show()
			} else if (select_val == 'formats') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="formats.units"]').show()
				secondSelectOptions.find('option[value="formats.time"]').show()
				secondSelectOptions.find('option[value="formats.date"]').show()
				secondSelectOptions.find('option[value="formats.numbers"]').show()
				secondSelectOptions.find('option[value="formats.phone_numbers"]').show()
			} else if (select_val == 'holidays') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="holidays.from_user"]').show()
			} else if (select_val == 'horoscope') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="horoscope.read"]').show()
			} else if (select_val == 'images') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="images.search"]').show()
				secondSelectOptions.find('option[value="images.service"]').show()
			} else if (select_val == 'language') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="language.filter"]').show()
				secondSelectOptions.find('option[value="language.switch"]').show()
			} else if (select_val == 'learn') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="learn.commands"]').show()
				secondSelectOptions.find('option[value="learn.information"]').show()
				secondSelectOptions.find('option[value="learn.knowledge"]').show()
			} else if (select_val == 'maps') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="maps.navigation_start"]').show()
				secondSelectOptions.find('option[value="maps.navigation_stop"]').show()
				secondSelectOptions.find('option[value="maps.navigation_reroute"]').show()
				secondSelectOptions.find('option[value="maps.navigation_information"]').show()
				secondSelectOptions.find('option[value="maps.directions"]').show()
				secondSelectOptions.find('option[value="maps.navigation.service"]').show()
				secondSelectOptions.find('option[value="maps.places"]').show()
				secondSelectOptions.find('option[value="maps.places.service"]').show()
				secondSelectOptions.find('option[value="maps.shortcuts"]').show()
				secondSelectOptions.find('option[value="maps.search"]').show()
				secondSelectOptions.find('option[value="maps.open"]').show()
				secondSelectOptions.find('option[value="maps.user"]').show()
				secondSelectOptions.find('option[value="maps.service"]').show()
				secondSelectOptions.find('option[value="maps.traffic"]').show()
			} else if (select_val == 'media') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="media.select"]').show()
				secondSelectOptions.find('option[value="music.play"]').show()
				secondSelectOptions.find('option[value="music.search"]').show()
				secondSelectOptions.find('option[value="video.play"]').show()
				secondSelectOptions.find('option[value="video.search"]').show()
				secondSelectOptions.find('option[value="radio.play"]').show()
				secondSelectOptions.find('option[value="radio.search "]').show()
			} else if (select_val == 'name') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="name.mention"]').show()
				secondSelectOptions.find('option[value="name.whois"]').show()
				secondSelectOptions.find('option[value="name.save"]').show()
				secondSelectOptions.find('option[value="name.get"]').show()
				secondSelectOptions.find('option[value="name.change"]').show()
				secondSelectOptions.find('option[value="name.forget"]').show()
				secondSelectOptions.find('option[value="name.feedback"]').show()
			} else if (select_val == 'news') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="news.find"]').show()
				secondSelectOptions.find('option[value="news.service"]').show()
			} else if (select_val == 'notes') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="notes.save"]').show()
				secondSelectOptions.find('option[value="notes.change"]').show()
				secondSelectOptions.find('option[value="notes.change_add"]').show()
				secondSelectOptions.find('option[value="notes.get"]').show()
				secondSelectOptions.find('option[value="notes.remove"]').show()
				secondSelectOptions.find('option[value="notes.clear"]').show()
				secondSelectOptions.find('option[value="notes.service"]').show()
				secondSelectOptions.find('option[value="notes.login"]').show()
				secondSelectOptions.find('option[value="notes.logout"]').show()
			} else if (select_val == 'badges') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="notifications.badges"]').show()
			} else if (select_val == 'pin') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="pin.code"]').show()
			} else if (select_val == 'premium') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="premium.check"]').show()
				secondSelectOptions.find('option[value="premium.info"]').show()
			} else if (select_val == 'notifications') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="notifications.add"]').show()
				secondSelectOptions.find('option[value="notifications.search"]').show()
				secondSelectOptions.find('option[value="notifications.remove"]').show()
			} else if (select_val == 'search') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="search.web"]').show()
				secondSelectOptions.find('option[value="search.web.service"]').show()
			} else if (select_val == 'shopping') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="shopping.search"]').show()
				secondSelectOptions.find('option[value="shopping.service"]').show()
			} else if (select_val == 'small talk') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="smalltalk.agent"]').show()
				secondSelectOptions.find('option[value="smalltalk.appraisal"]').show()
				secondSelectOptions.find('option[value="smalltalk.confirmation"]').show()
				secondSelectOptions.find('option[value="smalltalk.dialog"]').show()
				secondSelectOptions.find('option[value="smalltalk.emotions"]').show()
				secondSelectOptions.find('option[value="smalltalk.greetings"]').show()
				secondSelectOptions.find('option[value="smalltalk.person"]').show()
				secondSelectOptions.find('option[value="smalltalk.topics"]').show()
				secondSelectOptions.find('option[value="smalltalk.unknown"]').show()
				secondSelectOptions.find('option[value="smalltalk.user"]').show()
			} else if (select_val == 'smarthome') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="smarthome.lights"]').show()
				secondSelectOptions.find('option[value="smarthome.thermostat"]').show()
				secondSelectOptions.find('option[value="smarthome.locks"]').show()
				secondSelectOptions.find('option[value="smarthome.appliances"]').show()
			} else if (select_val == 'sports') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="sports.standings"]').show()
				secondSelectOptions.find('option[value="sports.scores"]').show()
				secondSelectOptions.find('option[value="sports.statistics"]').show()
				secondSelectOptions.find('option[value="sports.schedule"]').show()
				secondSelectOptions.find('option[value="sports.service"]').show()
			} else if (select_val == 'statuses') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="facebook.statuses_update"]').show()
				secondSelectOptions.find('option[value="facebook.statuses_cancel"]').show()
				secondSelectOptions.find('option[value="facebook.statuses_change"]').show()
				secondSelectOptions.find('option[value="facebook.statuses_change_add"]').show()
				secondSelectOptions.find('option[value="facebook.user_timeline"]').show()
				secondSelectOptions.find('option[value="facebook.notifications"]').show()
				secondSelectOptions.find('option[value="twitter.statuses_update"]').show()
				secondSelectOptions.find('option[value="twitter.statuses_cancel"]').show()
				secondSelectOptions.find('option[value="twitter.notifications"]').show()
				secondSelectOptions.find('option[value="twitter.user_timeline"]').show()
			} else if (select_val == 'suggestions') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="suggestions.switch"]').show()
			} else if (select_val == 'support') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="support.about"]').show()
				secondSelectOptions.find('option[value="support.contacts"]').show()
				secondSelectOptions.find('option[value="support.feedback"]').show()
				secondSelectOptions.find('option[value="support.creators"]').show()
				secondSelectOptions.find('option[value="support.beta"]').show()
			} else if (select_val == 'tasks') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="tasks.get"]').show()
				secondSelectOptions.find('option[value="tasks.remove"]').show()
				secondSelectOptions.find('option[value="tasks.save"]').show()
			} else if (select_val == 'timetable') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="timetable.flights"]').show()
			} else if (select_val == 'translate') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="translate.text"]').show()
			} else if (select_val == 'tv') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="tv.listings"]').show()
			} else if (select_val == 'tutorial') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="tutorial.start"]').show()
				secondSelectOptions.find('option[value="tutorial.end"]').show()
				secondSelectOptions.find('option[value="tutorial.continue"]').show()
				secondSelectOptions.find('option[value="tutorial.repeat"]').show()
			} else if (select_val == 'weather') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="weather.search"]').show()
				secondSelectOptions.find('option[value="weather.units"]').show()
				secondSelectOptions.find('option[value="weather.service"]').show()
			} else if (select_val == 'wisdom') {
				secondSelectOptions.children('option').hide();
				secondSelectOptions.find('option[value="wisdom.wisdom"]').show()
				}
			secondSelectOptions.trigger("chosen:updated")
			$(".action_select_box").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true});
			//secondSelectOptions.filter('option[value="apps.close"]').show();
			//alert(this.value)
			//$.post("/ajaxrequest", data, function(data) {console.log(data);});
			/*data = { "csrfmiddlewaretoken": '{{ csrf_token }}', 'action': select_box.val()};
			$.ajax({
				url: "/ajaxrequest",
				type: "POST",
				data: data,
				//dataType: 'json', 
				success: function (data) {
					console.log('success', data)
					//$('.action_select_box').html(data)
				;},
				//success: function (data) {window.location.href = "/ajaxrequest";},
				error: function (data) {console.log('error', data);},
			});*/
		});
	return false;
});