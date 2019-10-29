$(document).ready(function() {

    chosen_intent_id = '';
    clearable_token_to = '';

    $('.clearable_to').hide();

    var serv_selected = localStorage.getItem("server_select");
    var agent_selected = localStorage.getItem("agent_select");

    if(agent_selected && agent_selected.length > 0) {
        bearer_setting(agent_selected)
    } else {
        bearer_setting($("#agent_select_dropdown").val())
    }
    //and change $("#agent_select_dropdown").on('change', function(){}) block

    if($('#server_change_dropdown').val() == 'prod'){url = 'https://console.api.ai/api/intents/?v=20150910'}
    else if ($('#server_change_dropdown').val() == 'stage'){url = 'http://openapi-stage/api/intents/?v=20150910'}
    else if ($('#server_change_dropdown').val() == 'aneeda'){url = 'https://aneeda.api.ai/api/intents/?v=20150910'}

    if (serv_selected && serv_selected.length > 0) {$('#server_change_dropdown').val(serv_selected)}
    if (agent_selected && agent_selected.length > 0) {$('#agent_select_dropdown').val(agent_selected)}

    $("#server_change_dropdown").on('change', function() {
        localStorage.setItem("server_select", $("#server_change_dropdown").val());
    });

    $("#agent_select_dropdown").on('change', function() {
        localStorage.setItem("agent_select", $("#agent_select_dropdown").val());
    });

    if ($('#server_change_dropdown').val() == 'prod') {
        //$("#agent_select_dropdown").val("").trigger('chosen:updated');
        $('#agent_select_dropdown').children('option').hide().trigger('chosen:updated');
        $("#agent_select_dropdown").find('option[value="SmartthingsV2"]').show().trigger('chosen:updated');
        $("#agent_select_dropdown").find('option[value="domains_de"]').show().trigger('chosen:updated');
        $("#agent_select_dropdown").find('option[value="domains_es"]').show().trigger('chosen:updated');
        $("#agent_select_dropdown").find('option[value="domains_fr"]').show().trigger('chosen:updated');
        $("#agent_select_dropdown").find('option[value="domains_it"]').show().trigger('chosen:updated');
        $("#agent_select_dropdown").find('option[value="30SecToFlyExample"]').show().trigger('chosen:updated');
        //$('#agent_select_dropdown').val('SmartthingsV2')
    } else if ($('#server_change_dropdown').val() == 'stage') {
        //$("#agent_select_dropdown").val("").trigger('chosen:updated');
        $("#agent_select_dropdown").children('option').show();
        $("#agent_select_dropdown").find('option[value="SmartthingsV2"]').hide().trigger('chosen:updated');
        $("#agent_select_dropdown").find('option[value="30SecToFlyExample"]').hide().trigger('chosen:updated');
    } else if ($('#server_change_dropdown').val() == 'aneeda') {
        $("#agent_select_dropdown").val("aneeda").trigger('chosen:updated');
        $('#agent_select_dropdown').children('option').hide().trigger('chosen:updated');
        $("#agent_select_dropdown").find('option[value="aneeda"]').show().trigger('chosen:updated');
        $("#agent_select_dropdown").find('option[value="aneeda-staging"]').show().trigger('chosen:updated');
        $("#agent_select_dropdown").find('option[value="aneeda-future"]').show().trigger('chosen:updated');
        $("#agent_select_dropdown").find('option[value="aneeda-de-staging"]').show().trigger('chosen:updated');
        $("#agent_select_dropdown").find('option[value="aneeda-de-future"]').show().trigger('chosen:updated');
    }

    $('#server_change_dropdown').change(function(){
        if ($('#server_change_dropdown').val() == 'prod') {
            $("#agent_select_dropdown").val("").trigger('chosen:updated');
            $('#agent_select_dropdown').children('option').hide().trigger('chosen:updated');
            $("#agent_select_dropdown").find('option[value="SmartthingsV2"]').show().trigger('chosen:updated');
            $("#agent_select_dropdown").find('option[value="domains_de"]').show().trigger('chosen:updated');
            $("#agent_select_dropdown").find('option[value="domains_es"]').show().trigger('chosen:updated');
            $("#agent_select_dropdown").find('option[value="domains_fr"]').show().trigger('chosen:updated');
            $("#agent_select_dropdown").find('option[value="domains_it"]').show().trigger('chosen:updated');
            $("#agent_select_dropdown").find('option[value="30SecToFlyExample"]').show().trigger('chosen:updated');
        } else if ($('#server_change_dropdown').val() == 'stage') {
            $("#agent_select_dropdown").val("").trigger('chosen:updated');
            $("#agent_select_dropdown").children('option').show();
            $("#agent_select_dropdown").find('option[value="SmartthingsV2"]').hide().trigger('chosen:updated');
            $("#agent_select_dropdown").find('option[value="30SecToFlyExample"]').hide().trigger('chosen:updated');
        } else if ($('#server_change_dropdown').val() == 'aneeda') {
            $("#agent_select_dropdown").val("aneeda").trigger('chosen:updated');
            $('#agent_select_dropdown').children('option').hide().trigger('chosen:updated');
            $("#agent_select_dropdown").find('option[value="aneeda"]').show().trigger('chosen:updated');
            $("#agent_select_dropdown").find('option[value="aneeda-staging"]').show().trigger('chosen:updated');
            $("#agent_select_dropdown").find('option[value="aneeda-future"]').show().trigger('chosen:updated');
            $("#agent_select_dropdown").find('option[value="aneeda-de-staging"]').show().trigger('chosen:updated');
            $("#agent_select_dropdown").find('option[value="aneeda-de-future"]').show().trigger('chosen:updated');
        }
    });

    var d = new Date();
    var date = d.getUTCDate();
    var year = d.getUTCFullYear();
    var month = zeroPadded(d.getUTCMonth() + 1);
    var hours = zeroPadded(d.getUTCHours());
    var hours_from = zeroPadded(d.getUTCHours() - 1);
    var minutes = d.getUTCMinutes();
    var current_date = year + '-' + month + '-' + date + 'T' + hours + ':' + minutes;
    var current_date_from = year + '-' + month + '-' + date + 'T' + hours_from + ':' + minutes;

    if(prod_button_state == 'disabled' || stage_button_state == 'disabled') {$('#api_stage').prop('disabled', false)}

    var prod_button_state = localStorage.getItem("prod_selector");
    var stage_button_state = localStorage.getItem("stage_selector");

    var sql_form_data = localStorage.getItem("sql_params_form_data");
    if (sql_form_data && sql_form_data.length != 0){
        for (i in sql_form_data.split('&')){
            var name = sql_form_data.split('&')[i].split('=')[0];
            var value = sql_form_data.split('&')[i].split('=')[1].replace('%3A', ':');
            $('#'+name).val(value);
        }
    } else {
        $("#time_to").val(current_date);
        $("#time_from").val(current_date_from);
    }

    if (localStorage.getItem("prod_selector") == 'disabled'){
        $('#api_prod').prop('disabled', true);
        $('#api_stage').prop('disabled', false);
    } else if (localStorage.getItem("stage_selector") == 'disabled') {
         $('#api_stage').prop('disabled', true);
         $('#api_prod').prop('disabled', false);
    }

    $('#api_prod').click(function(){
         $('#api_prod').prop('disabled', true);
         $('#api_stage').prop('disabled', false);
         var server_button_state = $('#api_prod').attr('disabled');
         localStorage.setItem("prod_selector", server_button_state);
         localStorage.setItem("stage_selector", '');
    });
    $('#api_stage').click(function(){
         $('#api_stage').prop('disabled', true);
         $('#api_prod').prop('disabled', false);
         var server_button_state = $('#api_stage').attr('disabled');
         localStorage.setItem("stage_selector", server_button_state);
         localStorage.setItem("prod_selector", '');
    });

    $('#drop_zone').click(function(){
        $("#result").find("tr:gt(0)").remove();
    });

    $('#fileInputDiv').on('click', function() {
        $('#fileInput').trigger('click');
    });

    var storage = localStorage.getItem("request");
    $('#input').val(storage);
    $("#button").click(function(){
        $("#result").find("tr:gt(0)").remove();
        $("#answer").empty();
        var request = $('#input').val();
        localStorage.setItem("request", request);
        handleApiAjax(request);
    });

	$("#input").keyup(function(){
		if(event.keyCode == 13){
		    $("#result").find("tr:gt(0)").remove();
			$("#answer").empty();
			var request = $('#input').val();
			localStorage.setItem("request", request);
			handleApiAjax(request);
		}
	});

    $('#ajax_link_button').click(function(){
        $('#ajax_inner').empty();
        var table_js = document.getElementById("result").outerHTML;
        var htmlContent = $("#result").html();
        $.ajax({
            url : "/apiai_ajax_request",
            type : "POST",
            data : { 'htmlContent' : table_js },
            success : function(json) {
                $('#ajax_inner').append(json);
            },
            error : function(xhr,errmsg,err) {
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    });

    $('#test_all_button').click(function(){
        //list = list[0].replace(/'/g, "").replace(/, /g, ",").split(',');
        var list_len = 0;
        var index_len = 0;
        $("#result").find("tr:gt(0)").remove();
        if (list && list.length > 0){
            var listOfObjectsFull = [];
            for (var x = 0; x < list.length; x++){
                if(list[x].length > 0){var list_item = list[x];}
                listOfObjectsFull.push(list_item);
            }
        }
        list_len = listOfObjectsFull.length;
        var encrypted = CryptoJS.MD5(listOfObjectsFull[0] + Math.floor((Math.random() * 1000000000) + 1));
        var session = encrypted.toString(CryptoJS.enc.Hex);
        console.log(session);
        for (var x = 0; x < listOfObjectsFull.length; x++){
            (function(index) {
                var item = listOfObjectsFull[x].replace(/'/g, "");
                item = item.replace(/"/g, "");
                item = item.replace(/,/g, "");
                setTimeout(function() { index_len = index_len+1; handleApiAjax(item, list_len, index_len, session); }, x * 100);
            })(x);
        }
    });


    $("#ajax_inner_1").on("click", "#next_button", function(event){
        list = [];
        $("#result_sql").find("tr:gt(0)").remove();
        $('#last_button').removeAttr('disabled');
        for (var xx = index; xx < index+index_solid; xx++ ){
            if (result_dic_unmatch[xx].length > 0){
                var item = result_dic_unmatch[xx];
                list.push(result_dic_unmatch[xx]);
                var button = $('<input id="single_generated_test_button" type="button" value="test" text="'+item+'" class="btn btn-default btn-xs"/>');
                $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item)).append($('<td>').append(button)))
            } else {console.log('here')};
        };
        index+=index_solid
        $('#page').text(index + ' results ahead');
    });

    $("#ajax_inner_1").on("click", "#last_button", function(event){
        list = [];
        $("#result_sql").find("tr:gt(0)").remove();
        if (index > index_solid) {
            for (var xx = index-(index_solid*2); xx < index-index_solid; xx++ ){
                if (result_dic_unmatch[xx] && result_dic_unmatch[xx].length > 0) {
                    var item = result_dic_unmatch[xx];
                    list.push(result_dic_unmatch[xx]);
                    var button = $('<input id="single_generated_test_button" type="button" value="test" text="' + item + '" class="btn btn-default btn-xs"/>');
                    $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item)).append($('<td>').append(button)))
                }
            }
        } else {
            $('#last_button').attr('disabled', true);
            for (var xx = 0; xx < result_dic_match.length; xx++) {
                if (result_dic_match[xx].length > 0) {
                    var item = result_dic_match[xx];
                    list.push(result_dic_match[xx]);
                    var button = $('<input id="single_generated_test_button" type="button" value="test" text="' + item + '" class="btn btn-default btn-xs"/>');
                    $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item)).append($('<td>').append(button)))
                }
            }
        }
        index-=index_solid
        $('#page').text(index + ' results ahead');
    });

    $("#result_sql tbody").on("click", "#single_generated_test_button", function(event){
        var list_len = 0;
        var index_len = 0;
        $("#result").find("tr:gt(0)").remove();
        //var list = $(this).text().replace(/'/g, "");
        var list = $(this).attr('text').replace(/'/g, "");
		list = list.replace(/"/g, "");
		list = list.split(", ");
		var encrypted = CryptoJS.MD5(list[1] + Math.floor((Math.random() * 1000000000) + 1));
		var session = encrypted.toString(CryptoJS.enc.Hex);
        list_len = list.length;
        for (var x = 0; x < list.length; x++){
            (function(index) {
                var item = list[x].replace(/'/g, "");
                item = item.replace(/"/g, "");
                item = item.replace(/,/g, "");
                setTimeout(function() { index_len = index_len+1; handleApiAjax(item, list_len, index_len, session); }, x * 100);
            })(x);
        }
    });

    var fileInputDivIntentUpd = document.getElementById('fileInputIntentUpd');

    fileInputDivIntentUpd.addEventListener('change', function(e) {
        var empty_list = [];
        empty_list_separate = [];
        var index_len = 0;
        $("#result_sql").find("tr:gt(0)").remove();
        var file = fileInputDivIntentUpd.files[0];
        var reader = new FileReader();

        reader.onload = function(e) {
            var result = reader.result;
            var list = result.split("\n");
            var list_for_test_all = "'" + result.replace(/(?:\r\n|\r|\n)/g, "', '") + "'";
            empty_list.push(list_for_test_all);
            var list_len = list.length;
            for (x in list){
                string_format(list[x]);
                var index = $.inArray(formated_string, empty_list_separate);
                if(index < 0){
                if (formated_string.length > 0){empty_list_separate.push(formated_string);}
                var button = $('<input id="single_generated_update_initent_button" type="button" value="add" text="'+formated_string+'" class="btn btn-default btn-xs"/>');
                var test_button = $('<input id="single_generated_test_button" type="button" value="test" text="' + formated_string + '" class="btn btn-default btn-xs"/>');
                //$("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(formated_string)).append($('<td>').append(button)))
                $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(formated_string)).append($('<td>').append(button)).append($('<td>').append(test_button)))}
            }
        };
        reader.readAsText(file);
        list = empty_list;
    });

    //blank space

    var dropZoneIntent = document.getElementById('fileInputDivIntentUpd');

    dropZoneIntent.addEventListener('dragover', handleDragOverEntity, false);
    dropZoneIntent.addEventListener('drop', handleFileSelectEntity, false);

    $('#fileInputDivIntentUpd').on('click', function() {
        $('#fileInputIntentUpd').trigger('click');
    });

    $('#get_intent_list').click(function() {
        agent_select_dropdown_settle()
    });

    $("#intent_select_dropdown").on('change', function() {
        chosen_intent_id = $("#intent_select_dropdown").val()
    });

    function update_intent_button_click(){}

    $("#result_sql tbody").on("click", "#single_generated_update_initent_button", function(event){
        if (chosen_intent_id && chosen_intent_id.length > 0){
            single_generated_update_initent_button = $(this);
            var text = $(this).attr('text').replace('\n', '');
            if($('#server_change_dropdown').val() == 'prod'){url = 'https://console.api.ai/api/intents/' + chosen_intent_id}
            else if ($('#server_change_dropdown').val() == 'stage'){url = 'http://openapi-stage/api/intents/' + chosen_intent_id}
            else if ($('#server_change_dropdown').val() == 'aneeda'){url = 'https://aneeda.api.ai/api/intents/' + chosen_intent_id}
            $.ajax({
                url: url,
                type: 'GET',
                contentType :'application/x-www-form-urlencoded',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", bearer)
                }, success: function(intent_data){
                    var template = {'isTemplate': false, 'data': [{'text': text}]};
                    var userSays = intent_data['userSays'];
                    var templates = intent_data['templates'];
                    var index = $.inArray(text, templates);
                    userSays.push(template);
                    //var url = 'http://openapi-stage/api/intents/'+chosen_intent_id+'?v=20150910';
                    if($('#server_change_dropdown').val() == 'prod'){var url = 'https://console.api.ai/api/intents/' + chosen_intent_id+'?v=20150910'}
                    else if ($('#server_change_dropdown').val() == 'stage'){var url = 'http://openapi-stage/api/intents/' + chosen_intent_id+'?v=20150910'}
                    else if ($('#server_change_dropdown').val() == 'aneeda'){var url = 'https://aneeda.api.ai/api/intents/' + chosen_intent_id+'?v=20150910'}
                    if (index < 0) {
                        $.ajax({
                            url: "/apiai_ajax_update_request",
                            type: "POST",
                            data: {'parameters': JSON.stringify(intent_data), 'url': url, 'bearer': bearer},
                            error: function (data) {
                                console.log(data);
                                alert('Oops, something went wrong. Check console.')
                            },
                            success: function (data) {
                                //alert(data)
                                $(single_generated_update_initent_button).attr('class', 'btn btn-success btn-xs').attr('value', 'added')
                            }
                        })
                    } else {
                        //alert('duplicate item')
                        $(single_generated_update_initent_button).attr('class', 'btn btn-danger btn-xs').attr('value', 'dublicate')
                    }
                }
            });
        } else {
            alert('Choose intent.')
        }
    });

    $("#result tbody").on("click", "#single_generated_update_initent_button", function(event){
        if (chosen_intent_id && chosen_intent_id.length > 0){
            single_generated_update_initent_button = $(this);
            var text = $(this).attr('text').replace('\n', '');
            if($('#server_change_dropdown').val() == 'prod'){url = 'https://console.api.ai/api/intents/' + chosen_intent_id}
            else if ($('#server_change_dropdown').val() == 'stage'){url = 'http://openapi-stage/api/intents/' + chosen_intent_id}
            else if ($('#server_change_dropdown').val() == 'aneeda'){url = 'https://aneeda.api.ai/api/intents/' + chosen_intent_id}
            $.ajax({
                url: url,
                type: 'GET',
                contentType :'application/x-www-form-urlencoded',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", bearer)
                }, success: function(intent_data){
                    var template = {'isTemplate': false, 'data': [{'text': text}]};
                    var userSays = intent_data['userSays'];
                    var templates = intent_data['templates'];
                    var index = $.inArray(text, templates);
                    userSays.push(template);
                    //var url = 'http://openapi-stage/api/intents/'+chosen_intent_id+'?v=20150910';
                    if($('#server_change_dropdown').val() == 'prod'){var url = 'https://console.api.ai/api/intents/' + chosen_intent_id+'?v=20150910'}
                    else if ($('#server_change_dropdown').val() == 'stage'){var url = 'http://openapi-stage/api/intents/' + chosen_intent_id+'?v=20150910'}
                    else if ($('#server_change_dropdown').val() == 'aneeda'){var url = 'https://aneeda.api.ai/api/intents/' + chosen_intent_id+'?v=20150910'}
                    if (index < 0) {
                        $.ajax({
                            url: "/apiai_ajax_update_request",
                            type: "POST",
                            data: {'parameters': JSON.stringify(intent_data), 'url': url, 'bearer': bearer},
                            error: function (data) {
                                console.log(data);
                                alert('Oops, something went wrong. Check console.')
                            },
                            success: function (data) {
                                //alert(data)
                                $(single_generated_update_initent_button).attr('class', 'btn btn-success btn-xs').attr('value', 'added')
                            }
                        })
                    } else {
                        //alert('duplicate item')
                        $(single_generated_update_initent_button).attr('class', 'btn btn-danger btn-xs').attr('value', 'dublicate')
                    }
                }
            });
        } else {
            alert('Choose intent.')
        }
    });

    $('#add_all_button').click(function(){
        if (chosen_intent_id && chosen_intent_id.length > 0){
            if($('#server_change_dropdown').val() == 'prod'){url = 'https://console.api.ai/api/intents/' + chosen_intent_id}
            else if ($('#server_change_dropdown').val() == 'stage'){url = 'http://openapi-stage/api/intents/' + chosen_intent_id}
            else if ($('#server_change_dropdown').val() == 'aneeda'){url = 'https://aneeda.api.ai/api/intents/' + chosen_intent_id}
            //url_setting($('#server_change_dropdown').val());
            if ($("#agent_select_dropdown").val() == 'custom'){
                bearer = 'Bearer 5ff5b9b162104d688051ca225d7a5df4';
                console.log(bearer)
            }
            $.ajax({
                url: url,
                type: 'GET',
                contentType :'application/x-www-form-urlencoded',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", bearer)
                }, success: function(intent_data){
                    var userSays = intent_data['userSays'];
                    var templates = intent_data['templates'];
                    intent_data_global = intent_data;
                    for (var itemm in empty_list_separate) {
                        text = empty_list_separate[itemm];
                        text = text.replace(/\s$/g, '');
                        var template = {'isTemplate': false, 'data': [{'text': text}]};
                        var index = $.inArray(text, templates);
                        //var url = 'http://openapi-stage/api/intents/'+chosen_intent_id+'?v=20150910';
                        if($('#server_change_dropdown').val() == 'prod'){var url = 'https://console.api.ai/api/intents/' + chosen_intent_id+'?v=20150910'}
                        else if ($('#server_change_dropdown').val() == 'stage'){var url = 'http://openapi-stage/api/intents/' + chosen_intent_id+'?v=20150910'}
                        else if ($('#server_change_dropdown').val() == 'aneeda'){var url = 'https://aneeda.api.ai/api/intents/' + chosen_intent_id+'?v=20150910'}
                        if (index < 0) {
                            //apiai_update(intent_data, url, text)
                            userSays.push(template);
                            $('#single_generated_update_initent_button[text="'+text+'"]').attr('class', 'btn btn-success btn-xs').attr('value', 'added');
                        } else {
                            $('#single_generated_update_initent_button[text="'+text+'"]').attr('class', 'btn btn-danger btn-xs').attr('value', 'dublicate');
                        }
                    }
                    intent_data_global['userSays'] = userSays;
                    apiai_update_test(intent_data_global, url, bearer, agent)
                }
            });
        } else {
            alert('Choose intent.')
        }
    });

    if ($("#agent_select_dropdown").val() != '' && $("#agent_select_dropdown").val().length > 0) {
        agent_select_dropdown_settle()
    }

    $("#agent_select_dropdown").on('change', function(){
        agent_select_dropdown_settle()
    });

    $("#inputTextField").bind('paste', function(e) {
        var empty_list = [];
        empty_list_separate = [];
        var elem = $(this);
        $("#result_sql").find("tr:gt(0)").remove();
        list = [];

        setTimeout(function() {
            // gets the copied text after a specified time (100 milliseconds)
            var text = elem.val();
            var result = text;
            var listt = result.split("\n");
            var list_for_test_all = "'" + result.replace(/(?:\r\n|\r|\n)/g, "', '") + "'";
            empty_list.push(list_for_test_all);
            var list_len = listt.length;
            for (x in listt){
                string_format(listt[x]);
                var index = $.inArray(formated_string, empty_list_separate);
                list.push(formated_string);
                if(index < 0){
                    if (formated_string.length > 0){empty_list_separate.push(formated_string);}
                    var button = $('<input id="single_generated_update_initent_button" type="button" value="add" text="'+formated_string+'" class="btn btn-default btn-xs"/>');
                    var test_button = $('<input id="single_generated_test_button" type="button" value="test" text="' + formated_string + '" class="btn btn-default btn-xs"/>');
                    //$("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(formated_string)).append($('<td>').append(button)))
                    $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(formated_string)).append($('<td>').append(button)).append($('<td>').append(test_button)))
                }
            }
        }, 100);
    });

    $('#send_token_button').click(function () {
        $('#send_token_button').toggleClass("disabled in-progress", true);
        var token = $('#token_input').val();
        var server = $("#template_server_change_dropdown").val();
        if (token.length > 0) {
            $.ajax({
                url:'/templates_fix/',
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                type: 'POST',
                data: {'token': token, 'server':server},
                success: function(data){
                    if (data != 'wrong token' && data != 'wrong spreadsheet' && data != 'failed'){
                        $('#send_token_button').toggleClass("disabled in-progress", false);
                        alert(JSON.parse(data)[1]);
                    } else {
                        console.log(data);
                        alert('Please check agent token or agent server');
                        $('#send_token_button').toggleClass("disabled in-progress", false);
                    }
                },
                error: function(data){
                    console.log(data.responseText);
                    alert('error, check console');
                    $('#send_token_button').toggleClass("disabled in-progress", false);
                }
            })
        } else {
            alert('Empty token.')
        }
    })

});