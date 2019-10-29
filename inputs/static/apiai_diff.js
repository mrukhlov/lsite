/**
 * Created by s4d_panda on 04-May-16.
 */

$(document).ready(function() {

    $('#server_change_dropdown_0').val('stage');
    $('#server_change_dropdown_1').val('console');
    $("#agent_select_dropdown_0").val('domains');
    $("#agent_select_dropdown_1").val('domains');
    $('#agent_select_dropdown_0').children('option').hide().trigger('chosen:updated');
    $('#agent_select_dropdown_1').children('option').hide().trigger('chosen:updated');

    $('#upload_diffs').hide();
    $('#merge_to_right').hide();
    $('#merge_to_left').hide();
    $('#merge_to_right').hide();

    $('#server_change_dropdown_0').on('change', function(){
        $('#agent_select_dropdown_0').children('option').show().trigger('chosen:updated');
        //$("#agent_select_dropdown_0").find('option[value="aneeda"]').hide().trigger('chosen:updated');
        //if ($('#server_change_dropdown_0').val() == $('#server_change_dropdown_1').val()){$('#server_change_dropdown_1').val('')}
        var serv = $('#server_change_dropdown_0').val();
        if (serv == 'console'){
            $('#server_change_dropdown_1').children('option').show().trigger('chosen:updated');
            $("#server_change_dropdown_1").find('option[value="console"]').hide().trigger('chosen:updated');
            $('#agent_select_dropdown_0').val('').trigger('chosen:updated');
            $("#agent_select_dropdown_0").find('option[value="aneeda"]').hide().trigger('chosen:updated');
            $("#agent_select_dropdown_0").find('option[value="aneeda-staging"]').hide().trigger('chosen:updated');
        }
        if (serv == 'stage'){
            $('#server_change_dropdown_1').children('option').show().trigger('chosen:updated');
            $("#server_change_dropdown_1").find('option[value="stage"]').hide().trigger('chosen:updated');
            $('#agent_select_dropdown_0').val('').trigger('chosen:updated');
            $("#agent_select_dropdown_0").find('option[value="aneeda"]').hide().trigger('chosen:updated');
            $("#agent_select_dropdown_0").find('option[value="aneeda-staging"]').hide().trigger('chosen:updated');
        }
        if (serv == 'aneeda'){
            console.log($('#server_change_dropdown_0').val(), $('#server_change_dropdown_1').val())
            //$('#server_change_dropdown_1').children('option').show().trigger('chosen:updated');
            //$("#server_change_dropdown_1").find('option[value="aneeda"]').hide().trigger('chosen:updated');
            $('#agent_select_dropdown_0').children('option').hide().trigger('chosen:updated');
            $("#agent_select_dropdown_0").find('option[value="aneeda"]').show().trigger('chosen:updated');
            $("#agent_select_dropdown_0").find('option[value="aneeda-staging"]').show().trigger('chosen:updated');
            $('#agent_select_dropdown_0').val('').trigger('chosen:updated')
        }
    });

    $('#server_change_dropdown_1').on('change', function(){
        $('#agent_select_dropdown_1').children('option').show().trigger('chosen:updated');
        //$("#agent_select_dropdown_1").find('option[value="aneeda"]').hide().trigger('chosen:updated');
        //if ($('#server_change_dropdown_0').val() == $('#server_change_dropdown_1').val()){$('#server_change_dropdown_0').val('')}
        var serv = $('#server_change_dropdown_1').val();
        if (serv == 'console'){
            $('#server_change_dropdown_0').children('option').show().trigger('chosen:updated');
            $("#server_change_dropdown_0").find('option[value="console"]').hide().trigger('chosen:updated');
            $('#agent_select_dropdown_1').val('').trigger('chosen:updated');
            $("#agent_select_dropdown_1").find('option[value="aneeda"]').hide().trigger('chosen:updated');
            $("#agent_select_dropdown_1").find('option[value="aneeda-staging"]').hide().trigger('chosen:updated');
        }
        if (serv == 'stage'){
            $('#server_change_dropdown_0').children('option').show().trigger('chosen:updated');
            $("#server_change_dropdown_0").find('option[value="stage"]').hide().trigger('chosen:updated');
            $('#agent_select_dropdown_1').val('').trigger('chosen:updated');
            $("#agent_select_dropdown_1").find('option[value="aneeda"]').hide().trigger('chosen:updated');
            $("#agent_select_dropdown_1").find('option[value="aneeda-staging"]').hide().trigger('chosen:updated');
        }
        if (serv == 'aneeda'){
            console.log($('#server_change_dropdown_0').val(), $('#server_change_dropdown_1').val())
            //$('#server_change_dropdown_0').children('option').show().trigger('chosen:updated');
            //$("#server_change_dropdown_0").find('option[value="aneeda"]').hide().trigger('chosen:updated');
            $('#agent_select_dropdown_1').children('option').hide().trigger('chosen:updated');
            $("#agent_select_dropdown_1").find('option[value="aneeda"]').show().trigger('chosen:updated');
            $("#agent_select_dropdown_1").find('option[value="aneeda-staging"]').show().trigger('chosen:updated');
            $('#agent_select_dropdown_1').val('').trigger('chosen:updated')
        }
    });

    $('#compare').mergely({
        editor_width: '840px',
        editor_height: '300px',
        cmsettings: { readOnly: false },
        lhs: function(setValue) {
            setValue('');
        },
        rhs: function(setValue) {
            setValue('');
        }
    });


    $("#diffs_info_list").on("click", "li", function(event){
        diff_file_name = $(this).text();
        diff_show('file_diff', $(this).text(), $(this).text());
    });


    $("#onlys_info_list_left").on("click", "li", function(event){
        diff_file_name = $(this).text();
        diff_show('file_only', $(this).text(), $(this).text(), 'lhs');
    });

    $("#onlys_info_list_right").on("click", "li", function(event){
        diff_file_name = $(this).text();
        diff_show('file_only', $(this).text(), $(this).text(), 'rhs');
    });


    $('#ajax_diff_hide_cols').click(function(){
        $('#diffs_onlys_info').toggle()
    });

    $('#ajax_download_agents_button').click(function(){
        $('#compare').mergely('clear', 'lhs');
        $('#compare').mergely('clear', 'rhs');
        $('#diffs_info_list').children().remove();
        $('#onlys_info_list_left').children().remove();
        $('#onlys_info_list_right').children().remove();
        $('#ajax_download_agents_button').toggleClass("disabled in-progress", true);
        agent_left = $('#agent_select_dropdown_0').val() + '_' + $('#server_change_dropdown_0').val();
        agent_right = $('#agent_select_dropdown_1').val() + '_' + $('#server_change_dropdown_1').val();
        bearer_setting($('#server_change_dropdown_0').val(), $('#agent_select_dropdown_0').val(), $('#server_change_dropdown_1').val(), $('#agent_select_dropdown_1').val());
        $.ajax({
            url: '/apiai_diff_get_agents/',
            type: 'POST',
            data: {bearer_left:bearer_left, agent_left:agent_left, server_left:$('#server_change_dropdown_0').val(), bearer_right:bearer_right, agent_right:agent_right, server_right:$('#server_change_dropdown_1').val()},
            contentType :'application/x-www-form-urlencoded',
            error : function(data){
                alert('Oops, something went wrong. Check console.');
                $('#ajax_download_agents_button').toggleClass("disabled in-progress", false);
                console.log(data)
            },
            success: function(data){
                var data_json = JSON.parse(data);
                var diffs = data_json['diffs'];
                var onlys = data_json['onlys'];
                var diffs_files = data_json['diffs_files'];
                var onlys_files = data_json['onlys_files'];
                for (x in diffs_files){
                    $('#diffs_info_list').append($('<li>').text(diffs_files[x]).attr("value", diffs_files[x]))
                }
                var onlys_files_keys = Object.keys(onlys_files);
                onlys_files_keys.forEach(function(i){
                    if ($('#server_change_dropdown_0').val() != $('#server_change_dropdown_1').val()){
                        var agent = i.split('_')[0];
                        var server = i.split('_')[1];
                        //console.log(111)
                        if (server == 'stage'){
                            switch($('#server_change_dropdown_0').val()){
                                case 'stage':/*console.log(1, onlys_files[i]);*/ onlys_files[i].forEach(function(ii){
                                    $('#onlys_info_list_left').append($('<li>').text([ii][0]).attr("value", diffs_files[x]))
                                });
                                break;
                            }
                            switch($('#server_change_dropdown_1').val()){
                                case 'stage':/*console.log(3);*/ onlys_files[i].forEach(function(ii){
                                    $('#onlys_info_list_right').append($('<li>').text([ii][0]).attr("value", diffs_files[x]))
                                });
                                break;
                            }
                        } else if (server == 'console'){
                            //console.log('bbb');
                            switch($('#server_change_dropdown_0').val()){
                                case 'console':/*console.log(2);*/ onlys_files[i].forEach(function(ii){
                                    $('#onlys_info_list_left').append($('<li>').text([ii][0]).attr("value", diffs_files[x]))
                                });
                                break;
                            }
                            switch($('#server_change_dropdown_1').val()){
                                case 'console':/*console.log(4, onlys_files[i]);*/ onlys_files[i].forEach(function(ii){
                                    $('#onlys_info_list_right').append($('<li>').text([ii][0]).attr("value", diffs_files[x]))
                                });
                                break;
                            }
                        }
                    } else {
                        var agent = i.split('_')[0];
                        var server = i.split('_')[1];
                        if (agent == $('#agent_select_dropdown_0').val()) {
                            onlys_files[i].forEach(function(ii){
                                $('#onlys_info_list_left').append($('<li>').text([ii][0]).attr("value", diffs_files[x]))
                            });
                        } else if (agent == $('#agent_select_dropdown_1').val()){
                            onlys_files[i].forEach(function(ii){
                                $('#onlys_info_list_right').append($('<li>').text([ii][0]).attr("value", diffs_files[x]))
                            });
                        }
                    }
                });
                $('#ajax_download_agents_button').toggleClass("disabled in-progress", false);
            }
        });
        $.ajax({
            url: 'https://'+$('#server_change_dropdown_0').val()+'.api.ai/api/intents/?v=20150910',
            type: 'GET',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", 'Bearer ' + bearer_left)
        }, success: function(data){
            intents_left = data;
        }});
        $.ajax({
            url: 'https://'+$('#server_change_dropdown_1').val()+'.api.ai/api/intents/?v=20150910',
            type: 'GET',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", 'Bearer ' + bearer_right)
        }, success: function(data){
            intents_right = data;
        }});
        $.ajax({
            url: 'https://'+$('#server_change_dropdown_0').val()+'.api.ai/api/entities/?v=20150910',
            type: 'GET',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", 'Bearer ' + bearer_left)
        }, success: function(data){
            entities_left = data;
        }});
        $.ajax({
            url: 'https://'+$('#server_change_dropdown_1').val()+'.api.ai/api/entities/?v=20150910',
            type: 'GET',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", 'Bearer ' + bearer_right)
        }, success: function(data){
            entities_right = data;
        }});
    });

    $('#upload_diffs').click(function(){
        var intent_flag = false;
        var entity_flag = false;
        var diffs_side = $('#upload_diffs').text().substring(7, $('#upload_diffs').text().length);
        if (diffs_side == 'left') {
            bearer = bearer_left;
            agent = agent_left;
            for (var i in intents_left) {
                if (intents_left[i]['name'] == diff_file_name) {
                    intent_flag = true;
                    intent_left_id = intents_left[i]['id']
                }
            }
            for (var i in entities_left) {
                if (entities_left[i]['name'] == diff_file_name) {
                    entity_flag = true;
                    entity_left_id = entities_left[i]['id']
                }
            }
            if (intent_flag == true) {
                if($('#server_change_dropdown_0').val() == 'prod'){url = 'https://console.api.ai/v1/intents/' + intent_left_id}
                else if ($('#server_change_dropdown_0').val() == 'stage'){url = 'http://openapi-stage/api/intents/' + intent_left_id}
                else if ($('#server_change_dropdown_0').val() == 'aneeda'){url = 'https://aneeda.api.ai/api/intents/' + intent_left_id}
            } else if (entity_flag == true) {
                if($('#server_change_dropdown_0').val() == 'prod'){url = 'https://console.api.ai/v1/entities/' + entity_left_id}
                else if ($('#server_change_dropdown_0').val() == 'stage'){url = 'http://openapi-stage/api/entities/' + entity_left_id}
                else if ($('#server_change_dropdown_0').val() == 'aneeda'){url = 'https://aneeda.api.ai/api/entities/' + entity_left_id}
            }
        } else if (diffs_side == 'right'){
            bearer = bearer_right;
            agent = agent_right;
            for (var i in intents_right) {
                if (intents_right[i]['name'] == diff_file_name){
                    intent_flag = true;
                    intent_right_id = intents_right[i]['id']
                }
            }
            for (var i in entities_right) {
                if (entities_right[i]['name'] == diff_file_name){
                    entity_flag = true;
                    entity_right_id = entities_right[i]['id']
                }
            }
            if (intent_flag == true) {
                //console.log('here')
                if($('#server_change_dropdown_1').val() == 'console'){url = 'https://console.api.ai/v1/intents/' + intent_right_id}
                else if ($('#server_change_dropdown_1').val() == 'stage'){url = 'http://openapi-stage/api/intents/' + intent_right_id}
                else if ($('#server_change_dropdown_1').val() == 'aneeda'){url = 'https://aneeda.api.ai/api/intents/' + intent_right_id}
            } else if (entity_flag == true) {
                if($('#server_change_dropdown_1').val() == 'console'){url = 'https://console.api.ai/v1/entities/' + entity_right_id}
                else if ($('#server_change_dropdown_1').val() == 'stage'){url = 'http://openapi-stage/api/entities/' + entity_right_id}
                else if ($('#server_change_dropdown_1').val() == 'aneeda'){url = 'https://aneeda.api.ai/api/entities/' + entity_right_id}
            }
        }
        empty_list_separate = [];
        var entity_index_list = [];
        var rep_check_list = [];
        if (diffs_side == 'right') {
            //var list = $('#compare').mergely('get', 'rhs').split("\n");
            var list = $('#compare').mergely('get', 'rhs');
        } else if (diffs_side == 'left') {
            //var list = $('#compare').mergely('get', 'lhs').split("\n");
            var list = $('#compare').mergely('get', 'lhs');
        }
        $.ajax({
            url: url,
            type: 'GET',
            contentType :'application/x-www-form-urlencoded',
            beforeSend: function(xhr) {
                xhr.setRequestHeader("Authorization", 'Bearer ' + bearer)
            }, success: function(intent_data){
                //console.log(intent_data);
                if (intent_flag == true) {
                    //var userSays = intent_data['userSays'];
                    //var templates = intent_data['templates'];
                    var userSays = [];
                    var templates = [];
                } else if (entity_flag == true) {
                    //var entries = intent_data['entries'];
                    var entries = [];
                }
                intent_data_global = intent_data;
                for (var itemm in list) {
                    text = list[itemm];
                    text = text.replace(/\s$/g, '');
                    if (intent_flag == true) {
                        if (text.length > 0){
                            var template = {'isTemplate': false, 'data': [{'text': text}]};
                            var index = $.inArray(text, templates);
                        }
                    } else if (entity_flag == true) {
                        if (text.length > 0) {
                            var entry = {'value': text, 'synonyms': [text]};
                            for (var i in entries) {
                                if ($.inArray(text, entries[i]['synonyms']) < 0) {
                                    entity_index_list.push(-1)
                                } else {
                                    entity_index_list.push(1)
                                }
                            }
                        }
                    }
                    //console.log(entity_index_list)
                    //var url = 'http://openapi-stage/api/intents/'+chosen_intent_id+'?v=20150910';
                    if (diffs_side == 'left') {
                        if (intent_flag == true) {
                            if ($('#server_change_dropdown_0').val() == 'prod') {url = 'https://console.api.ai/v1/intents/' + intent_left_id + '?v=20150910'}
                            else if ($('#server_change_dropdown_0').val() == 'stage') {url = 'http://openapi-stage/api/intents/' + intent_left_id + '?v=20150910'}
                            else if ($('#server_change_dropdown_0').val() == 'aneeda') {url = 'https://aneeda.api.ai/api/intents/' + intent_left_id + '?v=20150910'}
                        } else if (entity_flag == true) {
                            if ($('#server_change_dropdown_0').val() == 'prod') {url = 'https://console.api.ai/v1/entities/' + entity_left_id + '?v=20150910'}
                            else if ($('#server_change_dropdown_0').val() == 'stage') {url = 'http://openapi-stage/api/entities/' + entity_left_id + '?v=20150910'}
                            else if ($('#server_change_dropdown_0').val() == 'aneeda') {url = 'https://aneeda.api.ai/api/entities/' + entity_left_id + '?v=20150910'
                            }
                        }
                    } else if (diffs_side == 'right') {
                        if (intent_flag == true) {
                            if ($('#server_change_dropdown_1').val() == 'prod') {url = 'https://console.api.ai/v1/intents/' + intent_right_id + '?v=20150910'}
                            else if ($('#server_change_dropdown_1').val() == 'stage') {url = 'http://openapi-stage/api/intents/' + intent_right_id + '?v=20150910'}
                            else if ($('#server_change_dropdown_1').val() == 'aneeda') {url = 'https://aneeda.api.ai/api/intents/' + intent_right_id + '?v=20150910'}
                        } else if (entity_flag == true) {
                            if ($('#server_change_dropdown_1').val() == 'prod') {url = 'https://console.api.ai/v1/entities/' + entity_right_id + '?v=20150910'}
                            else if ($('#server_change_dropdown_1').val() == 'stage') {url = 'http://openapi-stage/api/entities/' + entity_right_id + '?v=20150910'}
                            else if ($('#server_change_dropdown_1').val() == 'aneeda') {url = 'https://aneeda.api.ai/api/entities/' + entity_right_id + '?v=20150910'}
                        }
                    }
                    if (intent_flag == true) {
                        userSays.push(template);
                    } else if (entity_flag == true) {
                        entries.push(entry);
                    }
                }
                if (intent_flag == true) {
                    //intent_data_global['userSays'] = userSays;
                    intent_data_global = list;
                } else if (entity_flag == true) {
                    //intent_data_global['entries'] = entries;
                    intent_data_global = list;
                }
                console.log(url, bearer, agent);
                console.log(intent_data_global);
                apiai_update_intent(intent_data_global, url, 'Bearer ' + bearer, agent)
            }
        });
    });

    $('#merge_to_right').click(function(){
        $('#compare').mergely('merge', 'rhs');
        $('#upload_diffs').show().text('upload right')
    });

    $('#merge_to_left').click(function(){
        $('#compare').mergely('merge', 'lhs');
        $('#upload_diffs').show().text('upload left')
    });

});