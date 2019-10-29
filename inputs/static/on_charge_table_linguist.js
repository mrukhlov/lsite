$(document).ready(function() {
	var linguist_select = localStorage.getItem("linguist_select");
	var linguist = $('#input-filter-ling')
	$('#input-filter-ling').find('option[value=' + linguist_select + ']').attr('selected','selected');
	console.log(linguist_select)
	var table = $('#id_list_table');
	linguist.on('change', function(e) {
		var linguist_select = linguist.val();
		console.log(linguist_select)
		localStorage.setItem("linguist_select", linguist_select);
		var data = this.value.split(" ");
		//create a jquery object of the rows
		var jo = $("#fbody").find("tr");
		//hide all the rows
		jo.hide();
		if (linguist_select == 'init'){
			jo.show();
			}
			if (linguist_select == 'Anna'){
				jo.filter(":contains('Calculator')").show();
				jo.filter(":contains('Media')").show();
				jo.filter(":contains('News')").show();
				jo.filter(":contains('Translate')").show();
				jo.filter(":contains('RU')").hide();
			} else if (linguist_select == 'Ksenia') {
				jo.filter(":contains('Easter Eggs')").show();
				jo.filter(":contains('Holidays')").show();
				jo.filter(":contains('Push')").show();
				jo.filter(":contains('SysMsgs')").show();
				jo.filter(":contains('RU')").hide();
			} else if (linguist_select == 'Rita') {
				jo.filter(":contains('Book')").show();
				jo.filter(":contains('Contacts')").show();
				jo.filter(":contains('Images')").show();
				jo.filter(":contains('Language')").show();
				jo.filter(":contains('Maps')").show();
				jo.filter(":contains('maps')").show();
				jo.filter(":contains('Pin')").show();
				jo.filter(":contains('Premium')").show();
				jo.filter(":contains('Search')").show();
				jo.filter(":contains('Timetable')").show();
				jo.filter(":contains('RU')").show();
			} else if (linguist_select == 'Maxim') {
				jo.filter(":contains('Ask')").show();
				jo.filter(":contains('Apps')").show();
				jo.filter(":contains('Assistant App')").show();
				jo.filter(":contains('Auth')").show();
				jo.filter(":contains('Calculator')").show();
				jo.filter(":contains('Check in')").show();
				jo.filter(":contains('Formats')").show();
				jo.filter(":contains('Jokes')").show();
				jo.filter(":contains('Notes')").show();
				jo.filter(":contains('Shopping')").show();
				jo.filter(":contains('Statuses')").show();
				jo.filter(":contains('System')").show();
				jo.filter(":contains('Tasks')").show();
				jo.filter(":contains('Tv')").show();
				jo.filter(":contains('Smart Home')").show();
				jo.filter(":contains('RU')").hide();
			} else if (linguist_select == 'Sveta') {
				jo.filter(":contains('Manage App')").show();
				jo.filter(":contains('Events')").show();
				jo.filter(":contains('Small Talk')").show();
				jo.filter(":contains('Support')").show();
				jo.filter(":contains('Tutorial')").show();
				jo.filter(":contains('Wisdom')").show();
				jo.filter(":contains('RU')").hide();
			} else if (linguist_select == 'Tanya') {
				jo.filter(":contains('Browse')").show();
				jo.filter(":contains('Calendar')").show();
				jo.filter(":contains('Contacts')").show();
				jo.filter(":contains('Device')").show();
				jo.filter(":contains('Finance')").show();
				jo.filter(":contains('Sports')").show();
				jo.filter(":contains('Weather')").show();
				jo.filter(":contains('RU')").hide();
			}
		});
	if(linguist_select) {
	var jo = $("#fbody").find("tr");
	if (linguist_select != 'init'){
		jo.hide();
			if (linguist_select == 'Anna'){
				jo.filter(":contains('Calculator')").show();
				jo.filter(":contains('Media')").show();
				jo.filter(":contains('News')").show();
				jo.filter(":contains('Translate')").show();
				jo.filter(":contains('RU')").hide();
			} else if (linguist_select == 'Ksenia') {
				jo.filter(":contains('Easter Eggs')").show();
				jo.filter(":contains('Holidays')").show();
				jo.filter(":contains('Push')").show();
				jo.filter(":contains('SysMsgs')").show();
				jo.filter(":contains('RU')").hide();
			} else if (linguist_select == 'Rita') {
				jo.filter(":contains('Book')").show();
				jo.filter(":contains('Contacts')").show();
				jo.filter(":contains('Images')").show();
				jo.filter(":contains('Language')").show();
				jo.filter(":contains('Maps')").show();
				jo.filter(":contains('maps')").show();
				jo.filter(":contains('Pin')").show();
				jo.filter(":contains('Premium')").show();
				jo.filter(":contains('Search')").show();
				jo.filter(":contains('Timetable')").show();
				jo.filter(":contains('RU')").show();
			} else if (linguist_select == 'Maxim') {
				jo.filter(":contains('Ask')").show();
				jo.filter(":contains('Apps')").show();
				jo.filter(":contains('Assistant App')").show();
				jo.filter(":contains('Auth')").show();
				jo.filter(":contains('Calculator')").show();
				jo.filter(":contains('Check in')").show();
				jo.filter(":contains('Formats')").show();
				jo.filter(":contains('Jokes')").show();
				jo.filter(":contains('Notes')").show();
				jo.filter(":contains('Shopping')").show();
				jo.filter(":contains('Statuses')").show();
				jo.filter(":contains('System')").show();
				jo.filter(":contains('Tasks')").show();
				jo.filter(":contains('Tv')").show();
				jo.filter(":contains('Smart Home')").show();
				jo.filter(":contains('RU')").hide();
			} else if (linguist_select == 'Sveta') {
				jo.filter(":contains('Manage App')").show();
				jo.filter(":contains('Events')").show();
				jo.filter(":contains('Small Talk')").show();
				jo.filter(":contains('Support')").show();
				jo.filter(":contains('Tutorial')").show();
				jo.filter(":contains('Wisdom')").show();
				jo.filter(":contains('RU')").hide();
			} else if (linguist_select == 'Tanya') {
				jo.filter(":contains('Browse')").show();
				jo.filter(":contains('Calendar')").show();
				jo.filter(":contains('Contacts')").show();
				jo.filter(":contains('Device')").show();
				jo.filter(":contains('Finance')").show();
				jo.filter(":contains('Sports')").show();
				jo.filter(":contains('Weather')").show();
				jo.filter(":contains('RU')").hide();
			}
		} else {
				jo.show();
			}
		}
});