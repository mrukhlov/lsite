$(document).ready(function() {

    //$("#result_sql").tablesorter();
    //keyAction_setting();
    $('.clearable').hide();
    $('.clearable_to').hide();
    $('#download_intent_phrases_button').hide();
    $('#download_intent_gtest_button').hide();
    $('#zh_log_phrase_quantity_max_div').hide();

    chosen_intent_id = '';
    clearable_text = '';
    clearable_token_to = '';

    var serv_selected = localStorage.getItem("server_select");
    var agent_selected = localStorage.getItem("agent_select");
    var language_selected = localStorage.getItem("language_select");
    var agent_select_dropdown_from = localStorage.getItem("agent_select_dropdown_from");
    var language_select_dropdown_from = localStorage.getItem("language_select_dropdown_from");

    if (language_select_dropdown_from && language_select_dropdown_from.length > 0) {$('#language_select_dropdown_from').val(language_select_dropdown_from)}
    if (agent_select_dropdown_from && agent_select_dropdown_from.length > 0) {$('#agent_select_dropdown_from').val(agent_select_dropdown_from)}

    if(serv_selected && serv_selected.length > 0) {
        if(serv_selected == 'prod'){
            append_prod_agents_to()
        } else if (serv_selected == 'stage') {
            append_stage_agents_to()
        } else if (serv_selected == 'aneeda') {
            append_aneeda_agents_to()
        } else if (serv_selected == 'cloudcar') {
            append_cloudcar_agents_to()
        } else if (serv_selected == 'dev') {
            append_dev_agents_to()
        }
    } else {
        if ($("#server_change_dropdown").val() == 'prod') {
            append_prod_agents_to()
        } else if ($("#server_change_dropdown").val() == 'stage'){
            append_stage_agents_to()
        } else if ($("#server_change_dropdown").val() == 'aneeda') {
            append_aneeda_agents_to()
        } else if ($("#server_change_dropdown").val() == 'cloudcar') {
            append_cloudcar_agents_to()
        } else if ($("#server_change_dropdown").val() == 'dev') {
            append_dev_agents_to()
        }
    }

    $("#server_change_dropdown").on('change', function() {
        localStorage.setItem("server_select", $("#server_change_dropdown").val());
        if ($("#server_change_dropdown").val() == 'prod') {
            append_prod_agents_to()
        } else if ($("#server_change_dropdown").val() == 'stage'){
            append_stage_agents_to()
        } else if ($("#server_change_dropdown").val() == 'aneeda') {
            append_aneeda_agents_to()
        } else if ($("#server_change_dropdown").val() == 'cloudcar') {
            append_cloudcar_agents_to()
        } else if ($("#server_change_dropdown").val() == 'dev') {
            append_dev_agents_to()
        }
    });

    assistant_logs_lang = $('#language_select_dropdown_from').val();
    if ($('#language_select_dropdown_from').val() == 'en'){
        append_prod_agents_from_en()
    } else {
        append_prod_agents_from_other_lang();
        if ($("#language_select_dropdown_from").val() == 'zh-CN'||$("#language_select_dropdown_from").val() == 'zh-TW'||$("#language_select_dropdown_from").val() == 'zh-HK'){
            $('#zh_log_phrase_quantity_max_div').show();
        }
    }

    $("#language_select_dropdown_from").on('change', function() {
        $('#zh_log_phrase_quantity_max_div').hide();
        assistant_logs_lang = $('#language_select_dropdown_from').val();
        localStorage.setItem("language_select_dropdown_from", $("#language_select_dropdown_from").val());
        if ($('#language_select_dropdown_from').val() == 'en'){
            append_prod_agents_from_en()
        } else {
            append_prod_agents_from_other_lang()
        }
        if ($("#agent_select_dropdown_from").val() != 'assistant_logs'){
            $("#ajax_button_get_dialogs").prop('disabled', true);
            $("#ajax_button_get_dialogs").hide();
            $("#intent_select_dropdown_from").prop('disabled', false).trigger("chosen:updated");
            $('#ajax_prod_agents_button_examples').show();
            $('#ajax_prod_agents_button_examples').prop('disabled', true);
            $('#keyActionDiv').hide();
            $('#dialogs_phrase_quantity_min_div').hide();
            $('#dialogs_phrase_quantity_max_div').hide();
        } else {
            $("#ajax_button_get_dialogs").prop('disabled', false);
            $("#ajax_button_get_dialogs").show();
            $("#intent_select_dropdown_from").prop('disabled', true).trigger("chosen:updated");
            $('#ajax_prod_agents_button_examples').hide();
            $('#keyActionDiv').show();
            $('#dialogs_phrase_quantity_min_div').show();
            $('#dialogs_phrase_quantity_max_div').show();
            if ($("#language_select_dropdown_from").val() == 'zh-CN'||$("#language_select_dropdown_from").val() == 'zh-TW'||$("#language_select_dropdown_from").val() == 'zh-HK'){
                $('#zh_log_phrase_quantity_max_div').show();
            }
        }
    });

    if(agent_selected && agent_selected.length > 0) {
        bearer_setting(agent_selected)
    } else {
        bearer_setting($("#agent_select_dropdown").val())
    }
    //and change $("#agent_select_dropdown").on('change', function(){}) block

    if (serv_selected && serv_selected.length > 0) {$('#server_change_dropdown').val(serv_selected)}
    if (agent_selected && agent_selected.length > 0) {$('#agent_select_dropdown').val(agent_selected)}
    if (language_selected && language_selected.length > 0) {$('#language_select').val(language_selected)}

    if (agent_selected && agent_selected.length > 0) {
        if (agent_selected != 'custom') {
            $('.clearable_to').hide();
            $("#intent_select_dropdown").prop('disabled', false).trigger("chosen:updated");
            $('#agent_select_dropdown').val(agent_selected);
            get_intents_list_to()
        } else {
            $("#agent_select_dropdown_to_wrapper").hide();
            $('.clearable_to').show();
            $('.clearable_to').addClass('x');
            $("#intent_select_dropdown").prop('disabled', true).trigger("chosen:updated");
        }
    }

    $("#agent_select_dropdown").on('change', function() {
        localStorage.setItem("agent_select", $("#agent_select_dropdown").val());
        if ($("#agent_select_dropdown").val() != 'custom') {
            $('.clearable_to').hide();
            $("#intent_select_dropdown").prop('disabled', false).trigger("chosen:updated");
            get_intents_list_to()
        } else {
            $("#agent_select_dropdown_to_wrapper").hide();
            $('.clearable_to').show();
            $('.clearable_to').addClass('x');
            $("#intent_select_dropdown").prop('disabled', true).trigger("chosen:updated");
        }
    });

    $('#get_intent_list').click(function() {get_intents_list_to()});

    agent_from_buttons_set($("#agent_select_dropdown_from").val());
    if($("#agent_select_dropdown_from").val() != 'assistant_logs' && $("#agent_select_dropdown_from").val() != 'custom') {
        //bearer_setting_from($("#agent_select_dropdown_from").val());
        var item = $("#agent_select_dropdown_from").val();
        if ($("#agent_select_dropdown_from").val() != 'custom') {var bearer_from = ''} else {var bearer_from = $('.clearable').val()};
        var lang = $("#language_select_dropdown_from").val();
        $.ajax({
            url : "/bearer_setting_from",
            type : "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: { 'item': item, 'lang':lang, 'bearer_from':bearer_from},
            error : function(data){
                alert('Oops, something went wrong. Check console.');
                console.log(data);
            },
            success : function(data){
                var json = JSON.parse(data);
                lang = json['lang'];
                bearer_from = json['bearer_from'];

                $("#intent_select_dropdown_from").text("<option></option>").trigger('chosen:updated');
                $('#get_intent_list_from').toggleClass("disabled in-progress", true);
                $("#intent_select_dropdown_from").prop('disabled', true).trigger("chosen:updated");
                if ($("#agent_select_dropdown_from").val() != '82bb994e-a7db-4d51-b815-a6360387b4af') {var url = 'https://api.api.ai/api/intents/?v=20150910'} else {var url = 'https://aneeda.api.ai/api/intents/?v=20150910'}
                $.ajax({
                    url: url,
                    type: 'GET',
                    contentType: 'application/x-www-form-urlencoded',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", bearer_from)
                    }, success: function (data) {
                        $('#intent_select_dropdown_from').append($("<option></option>").text(''));
                        for (x in data) {
                            intent_id = data[x]['id'];
                            intent_name = data[x]['name'];
                            $('#intent_select_dropdown_from').append($("<option></option>").attr("value", intent_id).text(intent_name));
                        }
                        $("#intent_select_dropdown_from").trigger('chosen:updated');
                        $('#get_intent_list_from').toggleClass("disabled in-progress", false);
                        $("#intent_select_dropdown_from").prop('disabled', false).trigger("chosen:updated");
                    }
                });
            }
        })
    }

    $('#agent_select_dropdown_from').on('change', function() {
        localStorage.setItem("agent_select_dropdown_from", $("#agent_select_dropdown_from").val());
        agent_from_buttons_set($("#agent_select_dropdown_from").val());
        if($("#agent_select_dropdown_from").val() != 'assistant_logs'){
            /*if ($("#agent_select_dropdown_from").val() != 'custom'){
                bearer_setting_from($("#agent_select_dropdown_from").val());
            } else {
                bearer_from = $('.clearable').val();
            }*/
            if ($("#agent_select_dropdown_from").val() == 'custom'){
                bearer_from = $('.clearable').val();
            }
            //bearer_setting_from($("#agent_select_dropdown_from").val());
            $('#get_intent_list_from').toggleClass("disabled in-progress", true);
            $("#intent_select_dropdown_from").prop('disabled', true).trigger("chosen:updated");
            $("#intent_select_dropdown_from").text("<option></option>").trigger('chosen:updated');
            if ($("#agent_select_dropdown_from").val() != '82bb994e-a7db-4d51-b815-a6360387b4af') {var url = 'https://api.api.ai/api/intents/?v=20150910'} else {var url = 'https://aneeda.api.ai/api/intents/?v=20150910'}
            $.ajax({
                url: url,
                type: 'GET',
                contentType :'application/x-www-form-urlencoded',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", bearer_from)
                }, success: function(data){
                    $('#intent_select_dropdown_from').append($("<option></option>").text(''));
                    for (x in data){
                        intent_id = data[x]['id'];
                        intent_name = data[x]['name'];
                        $('#intent_select_dropdown_from').append($("<option></option>").attr("value", intent_id).text(intent_name));
                        //console.log(intent_name)
                    }
                    $("#intent_select_dropdown_from").trigger('chosen:updated');
                    $('#get_intent_list_from').toggleClass("disabled in-progress", false);
                    $("#intent_select_dropdown_from").prop('disabled', false).trigger("chosen:updated");
                }
            });
        }
    });

    $('.clearable').bind('paste', function(e) {
        var elem = $(this);
        //url_setting($("#server_change_dropdown").val());
        var server = $("#server_change_dropdown").val();
        $.ajax({
            url : "/url_setting_url",
            type : "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: { 'server': server},
            error : function(data){
                alert('Oops, something went wrong. Check console.');
                console.log(data);
            },
            success : function(data){
                var json = JSON.parse(data);
                url = json['url'];
                urle = url;

                setTimeout(function() {
                    var text = 'Bearer ' + elem.val();
                    clearable_text = text;
                    bearer_from = text;
                    //bearer_setting_from(text);
                    $("#intent_select_dropdown_from").text("<option></option>").trigger('chosen:updated');
                    $('#get_intent_list_from').toggleClass("disabled in-progress", true);
                    $("#intent_select_dropdown_from").prop('disabled', true).trigger("chosen:updated");
                    $.ajax({
                        //url: 'https://api.api.ai/api/intents/?v=20150910',
                        url: url,
                        type: 'GET',
                        contentType: 'application/x-www-form-urlencoded',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", text)
                        },
                        error : function(data){
                            alert('Oops, something went wrong. Check console.');
                            $('#get_intent_list_from').toggleClass("disabled in-progress", false);
                            console.log(data);
                        },
                        success: function (data) {
                            $('#intent_select_dropdown_from').append($("<option></option>").text(''));
                            for (x in data) {
                                intent_id = data[x]['id'];
                                intent_name = data[x]['name'];
                                $('#intent_select_dropdown_from').append($("<option></option>").attr("value", intent_id).text(intent_name));
                            }
                            $("#intent_select_dropdown_from").trigger('chosen:updated');
                            $('#get_intent_list_from').toggleClass("disabled in-progress", false);
                            $("#intent_select_dropdown_from").prop('disabled', false).trigger("chosen:updated");
                        }
                    });
                }, 100);
            }
        })
    });

    $('.clearable_to').bind('paste', function(e) {
        var elem = $(this);
        //url_setting($("#server_change_dropdown").val());
        var server = $("#server_change_dropdown").val();
        $.ajax({
            url : "/url_setting_url",
            type : "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: { 'server': server},
            error : function(data){
                alert('Oops, something went wrong. Check console.');
                console.log(data);
            },
            success : function(data){
                var json = JSON.parse(data);
                url = json['url'];
                urle = url;

                setTimeout(function() {
                    var text = 'Bearer ' + elem.val();
                    clearable_token_to = text;
                    bearer = text;
                    //bearer_setting_from(text);
                    $("#intent_select_dropdown").text("<option></option>").trigger('chosen:updated');
                    $('#get_intent_list').toggleClass("disabled in-progress", true);
                    $("#intent_select_dropdown").prop('disabled', true).trigger("chosen:updated");
                    $.ajax({
                        //url: 'https://api.api.ai/api/intents/?v=20150910',
                        url: urle,
                        type: 'GET',
                        contentType: 'application/x-www-form-urlencoded',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", text)
                        },
                        error : function(data){
                            $('#get_intent_list').toggleClass("disabled in-progress", false);
                            alert('Oops, something went wrong. Check console.');
                            console.log(data);
                        },
                        success: function (data) {
                            $('#intent_select_dropdown').append($("<option></option>").text(''));
                            for (x in data) {
                                intent_id = data[x]['id'];
                                intent_name = data[x]['name'];
                                $('#intent_select_dropdown').append($("<option></option>").attr("value", intent_id).text(intent_name));
                            }
                            $("#intent_select_dropdown").trigger('chosen:updated');
                            $('#get_intent_list').toggleClass("disabled in-progress", false);
                            $("#intent_select_dropdown").prop('disabled', false).trigger("chosen:updated");
                        }, error: function(data){
                            alert('Please check token or server');
                        }
                    });
                }, 100);
            }
        })
    });

    $('#language').click(function(){
        localStorage.setItem("language_select", $('#language').val());
    })

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

    var sql_keyphrase = localStorage.getItem("sql_params_keyphrase");
    if (sql_form_data && sql_form_data.length != 0){
        $('#keyPhrase').val(sql_keyphrase)
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

    var fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function(e) {
        agent_to = $('#agent_select_dropdown').val();
        server_to = $('#server_change_dropdown').val();
        document.getElementById('test_results_download_button_csv').style.visibility = "visible";
        document.getElementById('test_results_download_button_xlsx').style.visibility = "visible";
        $('#ajax_link_button').show();
        var index_len = 0;
        $("#result").find("tr:gt(0)").remove();
        var file = fileInput.files[0];
        var reader = new FileReader();

        reader.onload = function(e) {
            var result = reader.result;
            var list = result.split("\n");
            var list_len = list.length;
            /*for (x in list){
                var item = list[x]
                handleApiAjax(item)
            };*/
            for (i in list){
                (function(item) {
                    var item = list[i];
                    setTimeout(function() { index_len = index_len+1; handleApiAjax(item, list_len, index_len); }, i * 200);
                })(i);
            }
        };
        reader.readAsText(file);
    });

    var dropZone = document.getElementById('fileInputDiv');

    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);

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

    $('#ajax_link_button').hide();
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

    $('#ajax_button_get_dialogs').click(function(){
        $('#ajax_button_get_dialogs').toggleClass("disabled in-progress", true);
        $("#ajax_inner_1").text('');
    	$("#result_sql").find("tr:gt(0)").remove();
    	var form = $('#sql_params_form').serialize();
        console.log($('#sql_params_form').serialize());
        console.log($('#keyPhrase').val());
        localStorage.setItem("sql_params_form_data", form);
        localStorage.setItem("sql_params_keyphrase", $('#keyPhrase').val());
    	$.ajax({
    		url : "/api_ajax_sql",
    		type : "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
    		data: { 'parameters': $("#sql_params_form").serialize(), 'keyphrase':$('#keyPhrase').val(), language:$('#language_select_dropdown_from').val()},
    		error : function(data){
    			console.log(data);
    			alert('Oops, something went wrong. Check console.')
    		},
    		success : function(data){
                $('#ajax_button_get_dialogs').toggleClass("button disabled in-progress", false);
    			json = JSON.parse(data);
                result_quantity = json['quantity_string'];
                index = parseInt(json['index']);
                index_solid = parseInt(index);
                quantity = parseInt(parseInt(json['quantity']));
    			$('#ajax_inner_1').append('<strong>'+result_quantity+'</strong><div id="page"></div>');
    			$('#ajax_inner_1').append($('<input id="last_button" type="button" disabled="disabled" value="show last '+index+'" text="show last'+index+'" class="btn btn-default btn-xs"/>'));
    			if(quantity > index){
                    $('#ajax_inner_1').append('<input id="next_button" type="button" value="show next '+index+'" text="show next'+index+'" class="btn btn-default btn-xs"/>');
                } else {
                    $('#ajax_inner_1').append('<input id="next_button" type="button" disabled="disabled" value="show next '+index+'" text="show next'+index+'" class="btn btn-default btn-xs"/>')
                }
                //$('#last_button').attr('disabled', true);
                if(json['result_dic']){
                    $('#sql_table_headings').html('');
                    $('#sql_table_headings').append($('<th>').text('Result'));
                    result_dic = json['result_dic'];
                    result_dic_match = json.result_dic['match'];
                    result_dic_unmatch = json.result_dic['unmatch'];
                    list = result_dic_match;
                    for (x in result_dic_match){
                        if (result_dic_match[x].length > 0){
                            var item = result_dic_match[x].toString();
                            var item = "'" + item + "'";
                            var item = item.replace(/,/g, "', '");
                            var button = $('<input id="single_generated_test_button" type="button" value="test" text="'+item+'" class="btn btn-default btn-xs"/>');
                            $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item)).append($('<td>').append(button)))
                        }
                    }
                    index = 0
                } else {
                    list = json.message;
                    for (x in list){
                        if (list[x].length > 0){
                            var item = list[x].toString();
                            var item = "'" + item + "'";
                            var item = item.replace(/,/g, "', '");
                            var button = $('<input id="single_generated_test_button" type="button" value="test" text="'+item+'" class="btn btn-default btn-xs"/>');
                            $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item)).append($('<td>').append(button)));
                            //$("#result_sql").find('tbody').append($('<tr>').append($('<td id="dialog_cell">').text(item)))
                        }
                    }
                }
    		}
    	});
    });

    $('#test_all_button').click(function(){
        //window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        $('#result')[0].scrollIntoView(false);
        var list_len = 0;
        var index_len = 0;
        $("#result").find("tr:gt(0)").remove();
        if (list && list.length > 0){
            var listOfObjectsFull = [];
            for (var x = 0; x < list.length; x++){
                if(list[x].length > 0){var list_item = list[x];}
                listOfObjectsFull.push(list_item);
            }

            for (var x = 0; x < listOfObjectsFull.length; x++){
                list_len += listOfObjectsFull[x].length;
            }
            for (var x = 0; x < listOfObjectsFull.length; x++){
                var encrypted = CryptoJS.MD5(listOfObjectsFull[x] + Math.floor((Math.random() * 1000000000) + 1));
                var session = encrypted.toString(CryptoJS.enc.Hex);
                for (var y = 0; y < listOfObjectsFull[x].length; y++){
                    index_len = index_len+1;
                    sleep_and_send(listOfObjectsFull, list_len, index_len, x, y, session);
                }
            }
        } else if (api_logs_list && api_logs_list.length > 0){
            //console.log(api_logs_list)
            var listOfObjectsFull = api_logs_list;
            for (i in api_logs_list){
            //for (var i = 0; i <= list.length; i++) {
                var index_len = 0;
                var encrypted = CryptoJS.MD5(api_logs_list[0] + Math.floor((Math.random() * 1000000000) + 1));
                var session = encrypted.toString(CryptoJS.enc.Hex);
                list_len = api_logs_list.length;
                (function(item) {
                    var item = api_logs_list[i];
                    setTimeout(function() {index_len = index_len+1; handleApiAjax(item, list_len, index_len, session); }, i * 100);
                })(i);
            }
        }
        $('#ajax_link_button').show();
        document.getElementById('test_results_download_button_csv').style.visibility = "visible";
        document.getElementById('test_results_download_button_xlsx').style.visibility = "visible";
    });


    $("#ajax_inner_1").on("click", "#next_button", function(event){
        list = [];
        api_logs_list= [];
        $("#result_sql").find("tr:gt(0)").remove();
        $('#last_button').removeAttr('disabled');
        for (var xx = index; xx < index+index_solid; xx++ ){
            if(!prod_agents){
                if (result_dic_unmatch[xx].length > 0){
                    var item = result_dic_unmatch[xx].toString();
                    var item = "'" + item + "'";
                    var item = item.replace(/,/g, "', '");
                    list.push(result_dic_unmatch[xx]);
                    var button = $('<input id="single_generated_test_button" type="button" value="test" text="'+item+'" class="btn btn-default btn-xs"/>');
                    $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item)).append($('<td>').append(button)))
                } else {console.log('here')};
            } else {
                var item = result_dic_unmatch[xx];
                api_logs_list.push(item[0]);
                var button = $('<input id="single_generated_test_button" type="button" value="test" text="'+item[0]+'" class="btn btn-default btn-xs"/>');
                $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item[0])).append($('<td>').text(item[1])).append($('<td>').text(item[2])).append($('<td>').text(item[3])).append($('<td>').text(item[4])).append($('<td>').append(item[5])).append($('<td>').append(item[6])))
            }
        };
        index+=index_solid;
        $('#page').text(index + ' results ahead');
    });

    $("#ajax_inner_1").on("click", "#last_button", function(event){
        list = [];
        api_logs_list= [];
        $("#result_sql").find("tr:gt(0)").remove();
        if (index > index_solid) {
            for (var xx = index-(index_solid*2); xx < index-index_solid; xx++ ){
                if(!prod_agents){
                    if (result_dic_unmatch[xx] && result_dic_unmatch[xx].length > 0) {
                        var item = result_dic_unmatch[xx].toString();
                        var item = "'" + item + "'";
                        var item = item.replace(/,/g, "', '");
                        list.push(result_dic_unmatch[xx]);
                        var button = $('<input id="single_generated_test_button" type="button" value="test" text="' + item + '" class="btn btn-default btn-xs"/>');
                        $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item)).append($('<td>').append(button)))
                    }
                } else {
                    var item = result_dic_unmatch[xx];
                    api_logs_list.push(item[0]);
                    var button = $('<input id="single_generated_test_button" type="button" value="test" text="' + item[0] + '" class="btn btn-default btn-xs"/>');
                    $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item[0])).append($('<td>').text(item[1])).append($('<td>').text(item[2])).append($('<td>').text(item[3])).append($('<td>').text(item[4])).append($('<td>').append(item[5])).append($('<td>').append(item[6])))
                }
            }
        } else {
            $('#last_button').attr('disabled', true);
            for (var xx = 0; xx < result_dic_match.length; xx++) {
                if(!prod_agents){
                    if (result_dic_match[xx].length > 0) {
                        var item = result_dic_match[xx].toString();
                        var item = "'" + item + "'";
                        var item = item.replace(/,/g, "', '");
                        list.push(result_dic_match[xx]);
                        var button = $('<input id="single_generated_test_button" type="button" value="test" text="' + item + '" class="btn btn-default btn-xs"/>');
                        $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item)).append($('<td>').append(button)))
                    }
                } else {
                    var item = result_dic_match[xx];
                    api_logs_list.push(item[0]);
                    var button = $('<input id="single_generated_test_button" type="button" value="test" text="' + item[0] + '" class="btn btn-default btn-xs"/>');
                    $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item[0])).append($('<td>').text(item[1])).append($('<td>').text(item[2])).append($('<td>').text(item[3])).append($('<td>').text(item[4])).append($('<td>').append(item[5])).append($('<td>').append(item[6])))
                }
            }
        }
        index-=index_solid;
        $('#page').text(index + ' results ahead');
    });

	//$("#result_sql tbody").on("click", "tr", function(event){
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
                setTimeout(function() { index_len = index_len+1; handleApiAjax(item, list_len, index_len, session); }, x * 1000);
            })(x);
        };
    });

    $('#ajax_agents_button').click(function(){
        console.log('sending request');
        var entities_phrase_quantity = 0;
        //var listOfIdFull = [];
        $.ajax({
            url: 'http://openapi-stage/api/intents/?v=20150910',
            type: 'GET',
            contentType :'application/x-www-form-urlencoded',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", bearer)
            }, success: function(data){
                for (var i = 0; i < data.length; i++){
                    $.ajax({
                        url: 'http://openapi-stage/api/intents/'+data[i]['id']+'?v=20150910',
                        type: 'GET',
                        contentType :'application/x-www-form-urlencoded',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("Authorization", bearer)
                        }, success: function(dataa){
                            //console.log(dataa['templates'].length);
                            entities_phrase_quantity+=dataa['templates'].length;
                            $('#ajax_agents_button').text(entities_phrase_quantity)
                        }
                    });
                    //}
                }
            },
    		error : function(data){
    			console.log(data);
    			alert('Oops, something went wrong. Check console.')
    		}
        });
    });

    $('#fileInputDivIntentUpd').on('click', function() {
        $('#fileInputIntentUpd').trigger('click');
    });

    $("#result_sql tbody").on("click", "#single_generated_update_initent_button", function(event){
        //url_setting($('#server_change_dropdown').val());
        var server = $("#server_change_dropdown").val();
        $.ajax({
            url : "/url_setting_url",
            type : "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: { 'server': server},
            error : function(data){
                alert('Oops, something went wrong. Check console.');
                console.log(data);
            },
            success : function(data){
                var json = JSON.parse(data);
                url = json['url'];
                urle = url;

                if (chosen_intent_id && chosen_intent_id.length > 0){
                    var text = $(this).attr('text').replace('\n', '');
                    $.ajax({
                        url: urle.replace('intents/', 'intents/'+chosen_intent_id),
                        type: 'GET',
                        contentType :'application/x-www-form-urlencoded',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("Authorization", bearer)
                        },
                        error : function(data){
                            alert('Oops, something went wrong. Check console.');
                            console.log(data);
                        },
                        success: function(intent_data){
                            var template = {'isTemplate': false, 'data': [{'text': text}]};
                            var userSays = intent_data['userSays'];
                            var templates = intent_data['templates'];
                            var index = $.inArray(text, templates);
                            userSays.push(template);
                            var url = urle.replace('intents/', 'intents/'+chosen_intent_id);
                            if (index < 0) {
                                $.ajax({
                                    url: "/apiai_ajax_update_request",
                                    type: "POST",
                                    data: {'parameters': JSON.stringify(intent_data), 'url': url},
                                    error: function (data) {
                                        console.log(data);
                                        alert('Oops, something went wrong. Check console.')
                                    },
                                    success: function (data) {
                                        alert(data)
                                    }
                                })
                            } else {
                                alert('duplicate item')
                            }
                        }
                    });
                } else {
                    alert('Choose intent.')
                }
            }
        })
    });

    $("#result tbody").on("click", "#single_generated_update_initent_button", function(event){
        //url_setting($('#server_change_dropdown').val());
        var server = $("#server_change_dropdown").val();
        $.ajax({
            url : "/url_setting_url",
            type : "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: { 'server': server},
            error : function(data){
                alert('Oops, something went wrong. Check console.');
                console.log(data);
            },
            success : function(data){
                var json = JSON.parse(data);
                url = json['url'];
                urle = url;

                if (chosen_intent_id && chosen_intent_id.length > 0){
                    var text = $(this).attr('text').replace('\n', '');
                    var text = text.toLowerCase();
                    var text = text.replace(/[.,\!$'"%\^&\*;:{}\?=\-_`~()]/g," ");
                    var text = text.replace(/\s{2,}/g," ");
                    var text = text.replace(/\s$/g,"");
                    $.ajax({
                        //url: 'http://openapi-stage/api/intents/' + chosen_intent_id,
                        url: urle.replace('intents/', 'intents/'+chosen_intent_id),
                        type: 'GET',
                        contentType :'application/x-www-form-urlencoded',
                        beforeSend: function(xhr) {
                            xhr.setRequestHeader("Authorization", bearer)
                        },
                        error : function(data){
                            alert('Oops, something went wrong. Check console.');
                            console.log(data);
                        },
                        success: function(intent_data){
                            var template = {'isTemplate': false, 'data': [{'text': text}]};
                            var userSays = intent_data['userSays'];
                            var templates = intent_data['templates'];
                            var index = $.inArray(text, templates);
                            userSays.push(template);
                            //var url = 'http://openapi-stage/api/intents/'+chosen_intent_id+'?v=20150910';
                            var url = urle.replace('intents/', 'intents/'+chosen_intent_id);

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
                                        $('#single_generated_update_initent_button[text="'+text+'"]').attr('class', 'btn btn-success btn-xs').attr('value', 'added');
                                    }
                                })
                            } else {
                                $('#single_generated_update_initent_button[text="'+text+'"]').attr('class', 'btn btn-danger btn-xs').attr('value', 'dublicate');
                            }
                        }
                    });
                } else {
                    alert('Choose intent.')
                }
            }
        })
    });

    prod_agents = false;
    $('#ajax_prod_agents_button').click(function() {
        prod_agents = true;
        $('#ajax_prod_agents_button').toggleClass("disabled in-progress", true);
        $("#ajax_inner_1").text('');
        $("#result_sql").find("tr:gt(0)").remove();
        var form = $('#sql_params_form').serialize();
        if (clearable_text.length == 0) {var agent = $('#agent_select_dropdown_from').val();} else {var agent = $('.clearable').val()}
        console.log(agent)
        //var agent = $('#agent_select_dropdown_from').val();
        if($('#language_select_dropdown_from').val() != 'en'){var query = $('#keyPhrase').val(); console.log(query)} else {var query = ''}
        agent_from = agent;
        localStorage.setItem("sql_params_form_data", form);
        localStorage.setItem("sql_params_keyphrase", $('#keyPhrase').val());
        //if ($("#agent_select_dropdown_from").val() != 'assistant_logs'){}
        $.ajax({
            url : "/api_prod_ajax_sql",
            type : "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: { 'parameters': $("#sql_params_form").serialize(), agent:agent, language:$('#language_select_dropdown_from').val(), 'query':encodeURIComponent(query)},
            error : function(data){
                $('#ajax_prod_agents_button').toggleClass("disabled in-progress", false);
                alert('Oops, something went wrong. Check console.');
                console.log(data)
            },
            success : function(data){
                $('#ajax_prod_agents_button').toggleClass("button disabled in-progress", false);
                document.getElementById('ajax_download_button_xlsx').style.visibility = "visible";
                document.getElementById('ajax_download_button_csv').style.visibility = "visible";
                json = JSON.parse(data);
                result_quantity = json['quantity_string'];
                index = parseInt(json['index']);
                index_solid = parseInt(index);
                quantity = parseInt(parseInt(json['quantity']));
                raw = json['raw'];
                $('#ajax_inner_1').append('<strong>'+result_quantity+'</strong><div id="page"></div>');
                $('#ajax_inner_1').append($('<input id="last_button" type="button" disabled="disabled" value="show last '+index+'" text="show last'+index+'" class="btn btn-default btn-xs"/>'));
                if(quantity > index){
                    $('#ajax_inner_1').append('<input id="next_button" type="button" value="show next '+index+'" text="show next'+index+'" class="btn btn-default btn-xs"/>');
                } else {
                    $('#ajax_inner_1').append('<input id="next_button" type="button" disabled="disabled" value="show next '+index+'" text="show next'+index+'" class="btn btn-default btn-xs"/>')
                }
                $('#last_button').attr('disabled', true);
                if(json['result_dic']){
                    if (json['agent'] != 'assistant_logs')
                    {
                        $('#sql_table_headings').html('');
                        $('#sql_table_headings').append($('<th>').text('User input'));
                        $('#sql_table_headings').append($('<th>').text('Intent name'));
                        $('#sql_table_headings').append($('<th>').text('Source'));
                        $('#sql_table_headings').append($('<th>').text('User action'));
                        $('#sql_table_headings').append($('<th>').text('User input details'));
                        $('#sql_table_headings').append($('<th>').text('Featured contexts'));
                        $('#sql_table_headings').append($('<th>').text('Response'));
                    } else {
                        $('#sql_table_headings').html('');
                        $('#sql_table_headings').append($('<th>').text('User input'));
                        $('#sql_table_headings').append($('<th>').text('User action'));
                        $('#sql_table_headings').append($('<th>').text('User input details'));
                        $('#sql_table_headings').append($('<th>').text('Featured contexts'));
                        $('#sql_table_headings').append($('<th>').text('Instruction name'));
                        $('#sql_table_headings').append($('<th>').text('Instruction data'));
                        $('#sql_table_headings').append($('<th>').text('Response'));
                    }
                    result_dic = json['result_dic'];
                    result_dic_match = json.result_dic['match'];
                    result_dic_unmatch = json.result_dic['unmatch'];
                    list = [];
                    api_logs_list = [];
                    for (x in result_dic_match){
                        api_logs_list.push(result_dic_match[x][0]);
                        if (result_dic_match[x]){
                            var item = result_dic_match[x];
                            var button = $('<input id="single_generated_test_button" type="button" value="test" text="'+item[0]+'" class="btn btn-default btn-xs"/>');
                            $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item[0])).append($('<td>').text(item[1])).append($('<td>').text(item[2])).append($('<td>').text(item[3])).append($('<td>').text(item[4])).append($('<td>').append(item[5])).append($('<td>').append(item[6])))
                            $("#result_sql").trigger("update");
                        }
                    }
                    index = 0;
                    /*var newTableObject = $("#result_sql");
                    var newTableObjectt = document.getElementById(result_sql);
                    sorttable.makeSortable(newTableObjectt);*/
                    $("#result_sql").trigger("update");
                } 
            }
        });
    });

    $('#ajax_download_button_xlsx').click(function(){
    	download_button('xlsx')
    });

    $('#ajax_download_button_csv').click(function(){
    	download_button('csv')
    });

    $('#test_results_download_button_xlsx').click(function(){
        raw_table = $('#result').html();
    	test_result_download_button('xlsx')
    });

    $('#test_results_download_button_csv').click(function(){
        //raw_table = document.getElementById('result');
        raw_table = $('#result').html();
    	test_result_download_button('csv')
    });

    $('#ajax_prod_agents_button_examples').click(function (){get_examples('from')});

    $("#intent_select_dropdown").on('change', function() {
        chosen_intent_id = $("#intent_select_dropdown").val();
        $('#ajax_prod_agents_button_examples').prop('disabled', false);
        get_examples('to');
    });

    $("#intent_select_dropdown_from").on('change', function() {
        chosen_intent_id_from = $("#intent_select_dropdown_from").val();
        $('#ajax_prod_agents_button_examples').prop('disabled', false);
        get_examples("from");
    });

    $('#ajax_prod_download_agents_button').click(function(){
        $("#ajax_prod_download_agents_button").toggleClass("disabled in-progress", true);
        if (clearable_text.length == 0){
            //bearer_setting_from($("#agent_select_dropdown_from").val());
            var item = $("#agent_select_dropdown_from").val();
            if ($("#agent_select_dropdown_from").val() != 'custom') {var bearer_from = ''} else {var bearer_from = $('.clearable').val()};
            var lang = $("#language_select_dropdown_from").val();
            $.ajax({
                url : "/bearer_setting_from",
                type : "POST",
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                data: { 'item': item, 'lang':lang, 'bearer_from':bearer_from},
                error : function(data){
                    $("#ajax_prod_download_agents_button").toggleClass("disabled in-progress", false);
                    alert('Oops, something went wrong. Check console.');
                    console.log(data);
                },
                success : function(data){
                    var json = JSON.parse(data);
                    lang = json['lang'];
                    bearer_from = json['bearer_from'];

                    $.ajax({
                        url: "/apiai_ajax_download_corpora/",
                        type: "POST",
                        data: {'data':bearer_from, 'server':'console'},
                        error: function (data) {
                            $("#ajax_prod_download_agents_button").toggleClass("disabled in-progress", false);
                            console.log(data);
                            alert('Oops, something went wrong. Check console.')
                        },
                        success: function (data) {
                            location.replace('/apiai_ajax_download_corpora/');
                            $("#ajax_prod_download_agents_button").toggleClass("disabled in-progress", false);
                        }
                    })
                }
            })
        }
    });

    $('#ajax_download_agents_button').click(function(){
        //bearer_setting($("#agent_select_dropdown").val());
        var item = $("#agent_select_dropdown").val();
        var server = $("#server_change_dropdown").val();
        $.ajax({
            url : "/bearer_setting",
            type : "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: { 'item': item, 'server':server, 'clearable_token_to':clearable_token_to},
            error : function(data){
                alert('Oops, something went wrong. Check console.');
                console.log(data);
            },
            success : function(data){
                var json = JSON.parse(data);
                bearer = json['bearer'];
                lang = json['lang'];
                agent = json['agent'];
                bearer_server = json['bearer_server'];
                if (json['bearer_server'] == 'custom'){bearer = json['clearable_token_to']};

                $("#ajax_download_agents_button").toggleClass("disabled in-progress", true);
                $.ajax({
                    url: "/apiai_ajax_download_corpora/",
                    type: "POST",
                    data: {'data':bearer, 'server':bearer_server},
                    error: function (data) {
                        $("#ajax_download_agents_button").toggleClass("disabled in-progress", false);
                        console.log(data);
                        alert('Oops, something went wrong. Check console.')
                    },
                    success: function (data) {
                        location.replace('/apiai_ajax_download_corpora/');
                        $("#ajax_download_agents_button").toggleClass("disabled in-progress", false);
                    }
                })
            }
        })
    });

    // CLEARABLE INPUT
    function tog(v){return v?'addClass':'removeClass';}
    $(document).on('input', '.clearable', function(){
        $(this)[tog(this.value)]('x');
    }).on('mousemove', '.x', function( e ){
        $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
    }).on('touchstart click', '.onX', function( ev ){
        ev.preventDefault();
        $(this).removeClass('x onX').val('').change();
        $('#agent_select_dropdown_from_wrapper').show();
        $('.clearable').hide();
    });

    function tog(v){return v?'addClass':'removeClass';}
    $(document).on('input', '.clearable_to', function(){
        $(this)[tog(this.value)]('x');
    }).on('mousemove', '.x', function( e ){
        $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
    }).on('touchstart click', '.onX', function( ev ){
        ev.preventDefault();
        $(this).removeClass('x onX').val('').change();
        $('.clearable_to').hide();
        $('#agent_select_dropdown_to_wrapper').show();
    });
    // CLEARABLE INPUT END

    $('#download_intent_phrases_button').click(function(){
        $("#download_intent_phrases_button").toggleClass("disabled in-progress", true);
        $.ajax({
            url: "/apiai_ajax_download_intent_phrases/",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            type: "POST",
            data: {data: JSON.stringify(intent_phrases_to_download), intent:intent_name_dwnld},
            error: function (data) {
                console.log(data);
                $("#download_intent_phrases_button").toggleClass("disabled in-progress", false);
                alert('Oops, something went wrong. Check console.');
            },
            success: function (data) {
                location.replace('/apiai_ajax_download_intent_phrases/');
                $("#download_intent_phrases_button").toggleClass("disabled in-progress", false);
            }
        })
    });

    $('#download_intent_gtest_button').click(function(){
        $("#download_intent_gtest_button").toggleClass("disabled in-progress", true);
        $.ajax({
            url: "/apiai_ajax_download_intent_gtest/",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            type: "POST",
            data: {'intent':JSON.stringify(chosen_intent_to)},
            //data: {data: JSON.stringify(intent_phrases_to_download), intent:intent_name_dwnld},
            error: function (data) {
                console.log(data);
                $("#download_intent_gtest_button").toggleClass("disabled in-progress", false);
                alert('Oops, something went wrong. Check console.');
            },
            success: function (data) {
                location.replace('/apiai_ajax_download_intent_gtest/');
                $("#download_intent_gtest_button").toggleClass("disabled in-progress", false);
            }
        })
    });

    $('#download_intent_gtest_button_from').click(function(){
        $("#download_intent_gtest_button_from").toggleClass("disabled in-progress", true);
        //bearer_setting_from($("#agent_select_dropdown_from").val());
        var item = $("#agent_select_dropdown_from").val();
        if ($("#agent_select_dropdown_from").val() != 'custom') {var bearer_from = ''} else {var bearer_from = $('.clearable').val()};
        var lang = $("#language_select_dropdown_from").val();
        $.ajax({
            url : "/bearer_setting_from",
            type : "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: { 'item': item, 'lang':lang, 'bearer_from':bearer_from},
            error : function(data){
                $("#download_intent_gtest_button_from").toggleClass("disabled in-progress", false);
                alert('Oops, something went wrong. Check console.');
                console.log(data);
            },
            success : function(data){
                var json = JSON.parse(data);
                lang = json['lang'];
                bearer_from = json['bearer_from'];

                $.ajax({
                    url: "/apiai_ajax_download_intent_gtest_archive/",
                    contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                    type: "POST",
                    data: {'bearer':bearer_from, 'agent':$("#agent_select_dropdown_from option:selected").text(), server:'console'},
                    //data: {data: JSON.stringify(intent_phrases_to_download), intent:intent_name_dwnld},
                    error: function (data) {
                        console.log(data);
                        $("#download_intent_gtest_button_from").toggleClass("disabled in-progress", false);
                        alert('Oops, something went wrong. Check console.');
                    },
                    success: function (data) {
                        location.replace('/apiai_ajax_download_intent_gtest_archive/');
                        $("#download_intent_gtest_button_from").toggleClass("disabled in-progress", false);
                    }
                })
            }
        })
    });

    $('#download_intent_gtest_button_to').click(function(){
        $("#download_intent_gtest_button_to").toggleClass("disabled in-progress", true);
        //bearer_setting($("#agent_select_dropdown").val());
        var item = $("#agent_select_dropdown").val();
        var server = $("#server_change_dropdown").val();
        $.ajax({
            url : "/bearer_setting",
            type : "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: { 'item': item, 'server':server, 'clearable_token_to':clearable_token_to},
            error : function(data){
                $("#download_intent_gtest_button_to").toggleClass("disabled in-progress", false);
                alert('Oops, something went wrong. Check console.');
                console.log(data);
            },
            success : function(data){
                var json = JSON.parse(data);
                bearer = json['bearer'];
                lang = json['lang'];
                agent = json['agent'];
                bearer_server = json['bearer_server'];
                if (json['bearer_server'] == 'custom'){bearer = json['clearable_token_to']};

                $.ajax({
                    url: "/apiai_ajax_download_intent_gtest_archive/",
                    contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                    type: "POST",
                    data: {'bearer':bearer, 'agent':$("#agent_select_dropdown").val(), server:$('#server_change_dropdown').val()},
                    //data: {data: JSON.stringify(intent_phrases_to_download), intent:intent_name_dwnld},
                    error: function (data) {
                        console.log(data);
                        $("#download_intent_gtest_button_to").toggleClass("disabled in-progress", false);
                        alert('Oops, something went wrong. Check console.');
                    },
                    success: function (data) {
                        location.replace('/apiai_ajax_download_intent_gtest_archive/');
                        $("#download_intent_gtest_button_to").toggleClass("disabled in-progress", false);
                    }
                })
            }
        })
    });

    $("#bearer_setting").click(function(){
        url_settingg($("#server_change_dropdown").val());
    });

});