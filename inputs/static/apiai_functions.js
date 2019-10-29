/**
 * Created by s4d_panda on 19-Apr-16.
 */

function append_prod_agents_to(){
    $("#agent_select_dropdown").empty();
    $('#agent_select_dropdown').append($('<option>', {value: '30SecToFlyExample',text: '30SecToFlyExample'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'domains',text: 'Domains'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'domains_de',text: 'Domains_de'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'domains_es',text: 'Domains_es'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'domains_fr',text: 'Domains_fr'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'domains_it',text: 'Domains_it'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'domains_ru',text: 'Domains_ru'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'SmartCar',text: 'SmartCar'}));
    $("#agent_select_dropdown").trigger('chosen:updated');
}

function append_stage_agents_to(){
    $("#agent_select_dropdown").empty();
    $('#agent_select_dropdown').append($('<option>', {value: 'domains',text: 'Domains'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'domains_de',text: 'Domains_de'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'domains_es',text: 'Domains_es'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'domains_it',text: 'Domains_it'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'domains_fr',text: 'Domains_fr'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'domains_cn',text: 'Domains_zh-CN'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'domains_ja',text: 'Domains_ja'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'domains_ru',text: 'Domains_ru'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'custom',text: 'Custom'}));
    $("#agent_select_dropdown").trigger('chosen:updated');
}

function append_aneeda_agents_to(){
    $("#agent_select_dropdown").empty();
    $('#agent_select_dropdown').append($('<option>', {value: 'aneeda',text: 'aneeda'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'aneeda-staging',text: 'aneeda-staging'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'aneeda-future',text: 'aneeda-future'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'aneeda-de-staging',text: 'aneeda-de-staging'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'aneeda-de-future',text: 'aneeda-de-future'}));
    $("#agent_select_dropdown").trigger('chosen:updated');
}

function append_cloudcar_agents_to(){
    $("#agent_select_dropdown").empty();
    $('#agent_select_dropdown').append($('<option>', {value: 'CloudCar-En',text: 'CloudCar-En'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'CloudCar-De',text: 'CloudCar-De'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'CloudCar-Fr',text: 'CloudCar-Fr'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'CloudCar-Es',text: 'CloudCar-Es'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'CloudCar-It',text: 'CloudCar-It'}));
    $("#agent_select_dropdown").trigger('chosen:updated');
}

function append_dev_agents_to(){
    $("#agent_select_dropdown").empty();
    $('#agent_select_dropdown').append($('<option>', {value: 'domains',text: 'Domains'}));
    $('#agent_select_dropdown').append($('<option>', {value: 'custom',text: 'Custom'}));
    $("#agent_select_dropdown").trigger('chosen:updated');
}

function append_prod_agents_from_en(){
    $("#agent_select_dropdown_from").empty();
    $('#agent_select_dropdown_from').append($('<option>', {value: 'assistant_logs',text: 'Assistant Logs'}));
    $('#agent_select_dropdown_from').append($('<option>', {value: 'custom',text: 'Custom'}));
    $("#agent_select_dropdown_from").val(localStorage.getItem("agent_select_dropdown_from"));
    $("#agent_select_dropdown_from").trigger('chosen:updated');
}

function append_prod_agents_from_other_lang(){
    $("#agent_select_dropdown_from").empty();
    $('#agent_select_dropdown_from').append($('<option>', {value: 'assistant_logs',text: 'Assistant Logs'}));
    $('#agent_select_dropdown_from').append($('<option>', {value: 'custom',text: 'Custom'}));
    $("#agent_select_dropdown_from").trigger('chosen:updated');
}

function bearer_setting(item){
    //var item = $("#agent_select_dropdown").val();
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

        }
    })
};

function bearer_setting_from(item){
    //var item = $("#agent_select_dropdown_from").val();
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

        }
    })
};

function url_setting(server){
    //var server = $("#server_change_dropdown").val();
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

        }
    })
};

function zeroPadded(val) {
    if (val >= 10)
        return val;
    else
        return '0' + val;
}

function handleApiAjax(itemm, list_len, index_len, session, last){
    var counter_string = ' testing ' + index_len + ' of ' + list_len;
    var item = encodeURIComponent(itemm);
    var d = new Date();
    var date = d.toDateString();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var current_date = date + ' ' + hours + ':' + minutes + ':' + seconds;
    $("#date_p").text(current_date);
    if(list_len){$("#date_p").append(counter_string);}
    if($("#server_change_dropdown").val() == 'stage'){
        var serv = '://openapi-stage';
        if (!session){
            var session = '13e1f040-8a88-4b48-b545-733a46b07903'
        }
    } else if ($("#server_change_dropdown").val() == 'prod' || $("#server_change_dropdown").val() == 'cloudcar') {
        var serv = 's://api.api.ai';
        if (!session){
            var session = '15f8244c-8264-4c54-b897-888ef8605b97'
        }
    } else if ($("#server_change_dropdown").val() == 'aneeda' || $("#server_change_dropdown").val() == 'aneeda-staging' || $("#server_change_dropdown").val() == 'aneeda-future' || $('#agent_select_dropdown_from') == '82bb994e-a7db-4d51-b815-a6360387b4af' || $('#agent_select_dropdown_from') == 'c4fa8679-0d5e-47a3-b8b3-4259f2c34270' || $('#agent_select_dropdown_from') == '6e0d8ed7-dcae-4113-be47-6659fcd691e4' || $('#agent_select_dropdown_from') == '6a0b9be0-04c1-4c80-b2a0-130d16c8bb98' || $('#agent_select_dropdown_from') == 'd60322b9-f4f3-43c0-b9c2-e66e21bcfd22') {
        var serv = 's://aneeda.api.ai';
        if (!session){
            var session = '15f8244c-8264-4c54-b897-888ef8605b97'
        }
    } else if($("#server_change_dropdown").val() == 'dev'){
        var serv = '://openapi-dev';
        if (!session){
            var session = '13e1f040-8a88-4b48-b545-733a46b07903'
        }
    }
    $.ajax({
        url: 'http' + serv + '/api/query?v=20150910&query=' + item + '&lang='+ lang +'&sessionId=' + session + '&timezone=Europe/Moscow',
        //url: 'http' + serv + '/api/query?v=20150910',
        type: 'GET',
        dataType: 'json',
        contentType: "application/json",
        headers: {'Authorization': bearer},
        async: false,
        /*beforeSend: function(xhr) {
            handleApiAjaxXhr(xhr)
        }, */success: function(data){
            var obj = JSON.parse(JSON.stringify(data));
            //console.log(JSON.stringify(obj['result'].contexts));
            var result_action = obj['result'].action;
            var result_query = obj['result'].resolvedQuery;
            var result_params = JSON.stringify(obj['result'].parameters);
            var update_button = $('<input id="single_generated_update_initent_button" type="button" value="add" text="'+itemm+'" class="btn btn-default btn-xs"/>');
            if (obj['result'].parameters){
                var result_params_string = '';
                var result_params_dict = obj['result'].parameters;
                for (var i in result_params_dict) {
                  if (typeof(result_params_dict[i]) == 'object'){
                    result_params_string += i + ': ' + JSON.stringify(result_params_dict[i]) + '; ';
                  } else if (result_params_dict[i].length > 0 && typeof(result_params_dict[i]) == 'string'){
                    result_params_string += i + ': ' + result_params_dict[i] + '; ';
                  }
                }
            }

            var result_html = obj['result']['metadata'].html;
            var result_speech = obj['result']['metadata'].speech;
            //var result_metadata_action = JSON.stringify(obj['result'].metadata)

            if(obj['result']['metadata'].intentName){
                var result_metadata_action = JSON.stringify(obj['result']['metadata'].intentName).replace(/"/g, '')
            } else {
                var result_metadata_action = JSON.stringify(obj['result'].metadata)
            }
            if(obj['result']['metadata'].intentId){
                var result_metadata_intentId = JSON.stringify(obj['result']['metadata'].intentId).replace(/"/g, '')
            }
            if($('#api_stage').is(":disabled")){var result_contexts = JSON.stringify(obj['result'].contexts);}
            if(last === 'true') {
                if ((result_action && result_action.length > 0) && (result_contexts && result_contexts.length > 0)){
                    $("#result").find('tbody').append($('<tr>').attr("id", "tr_bordered").append($('<td>').attr("id", "td_content").text(result_query)).append($('<td>').attr("id", "td_content").text(result_contexts)).append($('<td>').attr("id", "td_content").text(result_action)).append($('<td>').attr("id", "td_content").text(result_params_string)).append($('<td>').attr("id", "td_content").text(result_html)).append($('<td>').attr("id", "td_content").append(update_button)))
                } else if (result_action && result_action.length > 0) {
                    $("#result").find('tbody').append($('<tr>').attr("id", "tr_bordered").append($('<td>').attr("id", "td_content").text(result_query)).append($('<td>').attr("id", "td_content").text('')).append($('<td>').attr("id", "td_content").text(result_action)).append($('<td>').attr("id", "td_content").text(result_params_string)).append($('<td>').attr("id", "td_content").text(result_html)).append($('<td>').attr("id", "td_content").append(update_button)))
                } else if (obj['result'].metadata && (result_contexts && result_contexts.length > 0)) {
                    $("#result").find('tbody').append($('<tr>').attr("id", "tr_bordered").append($('<td>').attr("id", "td_content").text(result_query)).append($('<td>').attr("id", "td_content").text(result_contexts)).append($('<td>').attr("id", "td_content").text(result_metadata_action)).append($('<td>').attr("id", "td_content").text(result_params_string)).append($('<td>').attr("id", "td_content").text(result_html)).append($('<td>').attr("id", "td_content").append(update_button)))
                } else if (obj['result'].metadata) {
                    $("#result").find('tbody').append($('<tr>').attr("id", "tr_bordered").append($('<td>').attr("id", "td_content").text(result_query)).append($('<td>').attr("id", "td_content").text(obj['result'].contexts)).append($('<td>').attr("id", "td_content").text(result_metadata_action)).append($('<td>').attr("id", "td_content").text(result_params_string)).append($('<td>').attr("id", "td_content").text(result_html)).append($('<td>').attr("id", "td_button").append(update_button)))
                }
            } else if (last === 'false' || !last) {
                if ((result_action && result_action.length > 0) && (result_contexts && result_contexts.length > 0)){
                    $("#result").find('tbody').append($('<tr>').attr("id", "tr_content").append($('<td>').attr("id", "td_content").text(result_query)).append($('<td>').attr("id", "td_content").text(result_contexts)).append($('<td>').attr("id", "td_content").text(result_action)).append($('<td>').attr("id", "td_content").text(result_params_string)).append($('<td>').attr("id", "td_content").text(result_html)).append($('<td>').attr("id", "td_button").append(update_button)))
                } else if (result_action && result_action.length > 0) {
                    $("#result").find('tbody').append($('<tr>').attr("id", "tr_content").append($('<td>').attr("id", "td_content").text(result_query)).append($('<td>').attr("id", "td_content").text('')).append($('<td>').attr("id", "td_content").text(result_action)).append($('<td>').attr("id", "td_content").text(result_params_string)).append($('<td>').attr("id", "td_content").text(result_html)).append($('<td>').attr("id", "td_button").append(update_button)))
                } else if (obj['result'].metadata && (result_contexts && result_contexts.length > 0)) {
                    $("#result").find('tbody').append($('<tr>').attr("id", "tr_content").append($('<td>').attr("id", "td_content").text(result_query)).append($('<td>').attr("id", "td_content").text(result_contexts)).append($('<td>').attr("id", "td_content").text(result_metadata_action)).append($('<td>').attr("id", "td_content").text(result_params_string)).append($('<td>').attr("id", "td_content").text(result_html)).append($('<td>').attr("id", "td_button").append(update_button)))
                } else if (obj['result'].metadata) {
                    $("#result").find('tbody').append($('<tr>').attr("id", "tr_content").append($('<td>').attr("id", "td_content").text(result_query)).append($('<td>').attr("id", "td_content").text(obj['result'].contexts)).append($('<td>').attr("id", "td_content").text(result_metadata_action)).append($('<td>').attr("id", "td_content").text(result_params_string)).append($('<td>').attr("id", "td_content").text(result_html)).append($('<td>').attr("id", "td_button").append(update_button)))
                }
            }
        }, error: function(data){console.log(data)}
    });
}

function sleep_and_send(list, list_len, index_len, x, y, session) {
    var item = list[x][y];
    if(y == list[x].length-1){
        var last = 'true';
    } else {
        var last = 'false';
    }
    var item = item.toLowerCase();
    var item = item.replace(/[.,\!$'"%\^&\*;:{}\?=\-_`~()]/g," ");
    var item = item.replace(/\s{2,}/g," ");
    var item = item.replace(/\s$/g,"");
    setTimeout(function() {handleApiAjax(item, list_len, index_len, session, last);}, t = (y + x*5)*1000);
    //setTimeout(function() { handleApiAjax(item, session); }, t = (y + x*3)*1000);
    //setTimeout(function() { console.log(item); }, t = (y + x*3)*100);
}

function handleFileSelect(evt) {
    agent_to = $('#agent_select_dropdown').val();
    server_to = $('#server_change_dropdown').val();
    //$('#date_p').prepend('<button type="button" id="test_results_download_button_csv" class="btn btn-default" style="visibility: hidden;">Download csv</button>');
    /*$('#result').prepend('<button type="button" id="test_results_download_button_xlsx" class="btn btn-default"">Download xlsx</button>');
    $('#result').prepend('<button type="button" id="test_results_download_button_csv" class="btn btn-default"">Download csv</button>');*/
    document.getElementById('test_results_download_button_csv').style.visibility = "visible";
    document.getElementById('test_results_download_button_xlsx').style.visibility = "visible";
    $("#result").find("tr:gt(0)").remove();
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files[0];
    var reader = new FileReader();
    var index_len = 0;

    reader.onload = function(e) {
        var result = reader.result;
        var list = result.split("\n");
        var list_len = list.length;
        /*for (x in list){
            var item = list[x]
            //handleApiAjax(item)
            sleep_and_send_from_list(item);
        };*/
        for (i in list){
        //for (var i = 0; i <= list.length; i++) {
            (function(item) {
                var item = list[i].replace('\n', '');
                setTimeout(function() {index_len = index_len+1; handleApiAjax(item, list_len, index_len); }, i * 200);
            })(i);
        }
    };
    reader.readAsText(files);
    $('#ajax_link_button').show();
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

function get_intents_list_to(){
    //bearer_setting($("#agent_select_dropdown").val());
    var server = $("#server_change_dropdown").val();
    var item = $("#agent_select_dropdown").val();
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
            if (json['bearer_server'] == 'custom'){bearer = json['clearable_token_to']}

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
                    //console.log(data);
                    var json = JSON.parse(data);
                    url = json['url'];
                    urle = url;

                    $("#intent_select_dropdown").text("<option></option>").trigger('chosen:updated');
                    $('#get_intent_list').toggleClass("disabled in-progress", true);
                    $.ajax({
                        url: url,
                        type: 'GET',
                        contentType :'application/x-www-form-urlencoded',
                        headers: {'Authorization': bearer},
                        error : function(data){
                            alert('Oops, something went wrong. Check console.');
                            console.log(data);
                        },
                        /*beforeSend: function(xhr) {
                            xhr.setRequestHeader("Authorization", bearer)
                        }*/ success: function(data){
                            $('#intent_select_dropdown').append($("<option></option>").text(''));
                            for (x in data){
                                intent_id = data[x]['id'];
                                intent_name = data[x]['name'];
                                $('#intent_select_dropdown').append($("<option></option>").attr("value", intent_id).text(intent_name));
                            }
                            $("#intent_select_dropdown").trigger('chosen:updated');
                            $('#get_intent_list').toggleClass("button disabled in-progress", false);
                        }
                    });
                }
            })
        }
    })
}

function download_button(format){
    $.ajax({
        url : "/apiai_prod_ajax_download",
        type : "POST",
        //contentType: 'application/x-www-form-urlencoded',
        //data: { 'raw[]': raw, 'agent':agent_from, 'language':$('#language_select_dropdown_from').val()},
        data: { 'raw': JSON.stringify(raw), 'agent':agent_from, 'language':$('#language_select_dropdown_from').val(), 'format':format},
        error : function(data){
            alert('Oops, something went wrong. Check console.')
        },
        success : function(data){
            location.replace('/apiai_prod_ajax_download');
        }
    })
}

function test_result_download_button(format){
    $.ajax({
        url : "/apiai_test_result_download",
        type : "POST",
        //contentType: 'application/x-www-form-urlencoded',
        //data: { 'raw[]': raw, 'agent':agent_from, 'language':$('#language_select_dropdown_from').val()},
        data: { 'raw': JSON.stringify(raw_table), 'agent':agent_to, 'language':$('#language_select_dropdown_from').val(), 'format':format, 'server':server_to},
        error : function(data){
            alert('Oops, something went wrong. Check console.');
            console.log(data)
        },
        success : function(data){
            location.replace('/apiai_test_result_download');
        }
    })
}

function get_examples(source){
    if (source == 'from') {
        intent_name_dwnld = $('#intent_select_dropdown_from option:selected').text();
        var intent_id = $('#intent_select_dropdown_from').val();
        if ($('#agent_select_dropdown_from').val() == '82bb994e-a7db-4d51-b815-a6360387b4af' || $('#agent_select_dropdown_from').val() == 'c4fa8679-0d5e-47a3-b8b3-4259f2c34270' || $('#agent_select_dropdown_from') == '6e0d8ed7-dcae-4113-be47-6659fcd691e4') {
            var url = 'https://aneeda.api.ai/api/intents/' + intent_id + '?v=20150910';
        } else {
            var url = 'https://api.api.ai/v1/intents/' + intent_id + '?v=20150910';
        }
        if (clearable_text && clearable_text.length > 0){bearer_from = clearable_text};
    } else if (source == 'to') {
        intent_name_dwnld = $('#intent_select_dropdown option:selected').text();
        var intent_id = chosen_intent_id;
        if ($("#server_change_dropdown").val() == 'stage') {
            var url = 'http://openapi-stage/api/intents/' + intent_id + '?v=20150910';
        } else if ($("#server_change_dropdown").val() == 'prod') {
            var url = 'https://api.api.ai/v1/intents/' + intent_id + '?v=20150910';
        } else if ($("#server_change_dropdown").val() == 'aneeda') {
            var url = 'https://aneeda.api.ai/api/intents/' + intent_id + '?v=20150910';
        } else if ($("#server_change_dropdown").val() == 'dev') {
            var url = 'http://openapi-dev/api/intents/' + intent_id + '?v=20150910';
        }
        bearer_from = bearer;
    }
    $("#result_sql").find("tr:gt(0)").remove();
    $.ajax({
        //url : "https://api.api.ai/v1/intents?v=20150910",
        url : url,
        type : "GET",
        contentType: 'application/x-www-form-urlencoded',
        headers: {'Authorization': bearer_from},
        /*beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", bearer_from)
        }*/error : function(data){
            alert('Oops, something went wrong. Check console.');
            console.log(data);
        },
        success : function(data){
            chosen_intent_to = data;
            var usersays = data;
            /*for (var x = 0; x < usersays.length; x++){
                if(usersays[x]['id'] == intent_id){
                    matched_intent_from = usersays[x]
                }
            }*/
            $.ajax({
                url : "/apiai_prod_ajax_json_parse",
                type : "POST",
                //contentType: 'application/json; charset=utf-8',
                //data: {'intent':JSON.stringify(usersays)},
                data: {'intent':JSON.stringify(usersays)},
                error : function(data){
                    alert('Oops, something went wrong. Check console.')
                    console.log(data);
                },
                success : function(data){
                    list = [];
                    api_logs_list = [];
                    $('#sql_table_headings').html('');
                    $('#sql_table_headings').append($('<th>').text('Result'));
                    intent_phrases_to_download = JSON.parse(data)
                    for (x in JSON.parse(data)){
                        api_logs_list.push(JSON.parse(data)[x]);
                        var test_button = $('<input id="single_generated_test_button" type="button" value="test" text="'+JSON.parse(data)[x]+'" class="btn btn-default btn-xs"/>');
                        //$("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(JSON.parse(data)[x])))
                        $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(JSON.parse(data)[x])).append($('<td id="test_button_cell">').append(test_button)))
                    }
                    if (intent_phrases_to_download.length > 0){$('#download_intent_phrases_button').show();$('#download_intent_gtest_button').show();}
                }
            })
        }
    })
}

function handleFileSelectEntity(evt) {
    var empty_list = [];
    empty_list_separate = [];
    $("#result_sql").find("tr:gt(0)").remove();
    evt.stopPropagation();
    evt.preventDefault();
    var files = evt.dataTransfer.files[0];
    var reader = new FileReader();
    var index_len = 0;

    reader.onload = function(e) {
        var result = reader.result;
        var list = result.split("\n");
        var list_for_test_all = "'" + result.replace(/(?:\r\n|\r|\n)/g, "', '") + "'";
        empty_list.push(list_for_test_all);
        var list_len = list.length;
        for (x in list){
            var item = list[x].toLowerCase();
            var item = item.replace(/[.,\!$'"%\^&\*;:{}\?=\-_`~()]/g," ");
            var item = item.replace(/\s{2,}/g," ");
            var item = item.replace(/\s$/g,"");
            var index = $.inArray(item, empty_list_separate);
            if(index < 0){
            if (item.length > 0){empty_list_separate.push(item);};
            var button = $('<input id="single_generated_update_initent_button" type="button" value="add" text="'+item+'" class="btn btn-default btn-xs"/>');
            var test_button = $('<input id="single_generated_test_button" type="button" value="test" text="' + item + '" class="btn btn-default btn-xs"/>');
            //$("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item)).append($('<td>').append(button)))
            $("#result_sql").find('tbody').append($('<tr>').append($('<td>').text(item)).append($('<td>').append(button)).append($('<td>').append(test_button)))}
        }
    };
    reader.readAsText(files);
    list = empty_list;
}

function handleDragOverEntity(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

function apiai_update(data_input, url, text, bearer){
    $.ajax({
        url: "/apiai_ajax_update_request",
        type: "POST",
        async: true,
        data: {'parameters': JSON.stringify(data_input), 'url': url, 'bearer': bearer},
        error: function (data) {
            console.log(data);
            alert('Oops, something went wrong. Check console.')
        },
        success: function (data) {
            console.log(data + ' ' + text);
            $('#single_generated_update_initent_button[text="'+text+'"]').attr('class', 'btn btn-success btn-xs').attr('value', 'added');
            //$('#single_generated_update_initent_button[value="add"]').attr('class', 'btn btn-success btn-xs').attr('value', 'added')
        }
    })
}

function apiai_update_test(data_input, url, bearer, agent){
    $.ajax({
        url: "/apiai_ajax_update_request",
        type: "POST",
        async: true,
        data: {'parameters': JSON.stringify(data_input), 'url': url, 'bearer': bearer},
        error: function (data) {
            console.log(data);
            alert('Oops, something went wrong. Check console.')
        },
        success: function (data) {
            console.log(data + ' ' + text);
            var intent_link = 'http://openapi-stage/api-client/#/agent/'+agent+'/editIntent/'+chosen_intent_id;
            var intent_url = '<a href='+intent_link+' target="_blank">'+$("#intent_select_dropdown option:selected").text()+' intent link</a>';
            $('#ajax_inner').html(intent_url);
            //$('#single_generated_update_initent_button[text="'+text+'"]').attr('class', 'btn btn-success btn-xs').attr('value', 'added');
        }
    })
}

function agent_select_dropdown_settle() {
    $('#get_intent_list').toggleClass("disabled in-progress", true);
    $("#intent_select_dropdown").text("<option></option>").trigger('chosen:updated');
    //bearer_setting($("#agent_select_dropdown").val());

    var server = $("#server_change_dropdown").val();
    var item = $("#agent_select_dropdown").val();

    if (item != 'custom') {
        $('.clearable_to').hide();

        $.ajax({
            url: "/bearer_setting",
            type: "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: {'item': item, 'server': server, 'clearable_token_to': clearable_token_to},
            error: function (data) {
                alert('Oops, something went wrong. Check console.');
                console.log(data);
            },
            success: function (data) {
                var json = JSON.parse(data);
                bearer = json['bearer'];
                lang = json['lang'];
                agent = json['agent'];
                bearer_server = json['bearer_server'];
                if (json['bearer_server'] == 'custom') {
                    bearer = json['clearable_token_to']
                }

                //url_setting($('#server_change_dropdown').val());
                var server = $("#server_change_dropdown").val();
                $.ajax({
                    url: "/url_setting_url",
                    type: "POST",
                    contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                    data: {'server': server},
                    error: function (data) {
                        alert('Oops, something went wrong. Check console.');
                        console.log(data);
                    },
                    success: function (data) {
                        var json = JSON.parse(data);
                        url = json['url'];
                        urle = url;

                        $.ajax({
                            url: url,
                            type: 'GET',
                            contentType: 'application/x-www-form-urlencoded',
                            headers: {'Authorization': bearer},
                            /*beforeSend: function(xhr) {
                             xhr.setRequestHeader("Authorization", bearer)
                             },*/ success: function (data) {
                                $('#intent_select_dropdown').append($("<option></option>").text(''));
                                for (x in data) {
                                    intent_id = data[x]['id'];
                                    intent_name = data[x]['name'];
                                    $('#intent_select_dropdown').append($("<option></option>").attr("value", intent_id).text(intent_name));
                                }
                                $("#intent_select_dropdown").trigger('chosen:updated');
                                $('#get_intent_list').toggleClass("button disabled in-progress", false);
                            }
                        });
                    }
                })
            }
        })
    } else {
        $("#agent_select_dropdown_to_wrapper").hide();
        // $('.clearable_to').show();
        // $('.clearable_to').addClass('x');
        // $("#intent_select_dropdown").prop('disabled', true).trigger("chosen:updated");

        bearer = 'Bearer 5ff5b9b162104d688051ca225d7a5df4';
        url = 'http://openapi-stage/api/intents/?v=20150910';

        $.ajax({
            url: url,
            type: 'GET',
            contentType: 'application/x-www-form-urlencoded',
            headers: {'Authorization': bearer},
            error: function (data) {
                alert('Oops, something went wrong. Check console.');
                console.log(data);
            },
            /*beforeSend: function(xhr) {
             xhr.setRequestHeader("Authorization", bearer)
             },*/ success: function (data) {
                $('#intent_select_dropdown').append($("<option></option>").text(''));
                for (x in data) {
                    intent_id = data[x]['id'];
                    intent_name = data[x]['name'];
                    $('#intent_select_dropdown').append($("<option></option>").attr("value", intent_id).text(intent_name));
                }
                $("#intent_select_dropdown").trigger('chosen:updated');
                $('#get_intent_list').toggleClass("button disabled in-progress", false);
            }
        });
    }
}

function string_format(format_item){
    var format = format_item.toLowerCase();
    var format = format.replace(/[.,\!$'"%\^&\*;:《》”“\+，。？：{}\?=\-_`~()]/g," ");
    var format = format.replace(/\s{2,}/g," ");
    var format = format.replace(/\s$/g,"");
    formated_string = format;
}

function agent_from_buttons_set(dropdown){
    if (dropdown != 'assistant_logs' && dropdown != 'custom'){
        $("#ajax_button_get_dialogs").prop('disabled', true);
        $("#ajax_button_get_dialogs").hide();
        $("#intent_select_dropdown_from").prop('disabled', false).trigger("chosen:updated");
        $('#ajax_prod_agents_button_examples').show();
        $('#ajax_prod_agents_button_examples').prop('disabled', true);
        $('#keyActionDiv').hide();
        $('#dialogs_phrase_quantity_min_div').hide();
        $('#dialogs_phrase_quantity_max_div').hide();
        $('#ajax_prod_download_agents_button').show();
        $('.clearable').hide();
    } else if (dropdown == 'custom'){
        $('#agent_select_dropdown_from_wrapper').hide();
        $('.clearable').show();
        $('.clearable').addClass('x');
        $("#ajax_button_get_dialogs").prop('disabled', true);
        $("#ajax_button_get_dialogs").hide();
    } else {
        $("#ajax_button_get_dialogs").prop('disabled', false);
        $("#ajax_button_get_dialogs").show();
        $("#intent_select_dropdown_from").prop('disabled', true).trigger("chosen:updated");
        $('#ajax_prod_agents_button_examples').hide();
        $('#keyActionDiv').show();
        $('#dialogs_phrase_quantity_min_div').show();
        $('#dialogs_phrase_quantity_max_div').show();
        $('#ajax_prod_download_agents_button').hide();
        $('.clearable').hide();
    }
};