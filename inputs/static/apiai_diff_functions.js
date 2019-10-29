/**
 * Created by s4d_panda on 04-May-16.
 */

function bearer_setting(server_left, agent_left, server_right, agent_right){
    if (agent_left == 'domains') {
        if(server_left == 'stage'){
            bearer_left = 'e39ae547567c4eadb32f1dc2bc4d05be';
            lang = 'en';
            agent = '250f39da-ab9e-4e5c-8961-8511735885d2';
            bearer_left_server = $("#server_change_dropdown").val();
        } else {
            bearer_left = '249caad067e54650a5fb48e73e395d75';
            lang = 'en';
            agent = '250f39da-ab9e-4e5c-8961-8511735885d2';
            bearer_left_server = $("#server_change_dropdown").val();
        }
    }
    else if (agent_left == 'domains_cn') {
        if(server_left == 'stage'){
            bearer_left = '1b944208540f41d8a4ae90e15b756d8e';
            lang = 'zh-cn';
            agent = '0fb456e6-0315-4fcc-8520-9855d48ed623';
            bearer_left_server = $("#server_change_dropdown").val();
        } else {
            bearer_left = '1b944208540f41d8a4ae90e15b756d8e';
            lang = 'zh-cn';
            agent = '0fb456e6-0315-4fcc-8520-9855d48ed623';
            bearer_left_server = $("#server_change_dropdown").val();
        }
    }
    else if (agent_left == 'domains_de') {
        if(server_left == 'stage'){
            bearer_left = 'cc802e343d1448afb8d4a41233d28e68';
            lang = 'de';
            agent = '3c76359c-8396-4f07-8452-eb462aff3f2a';
            bearer_left_server = $("#server_change_dropdown").val();
        } else {
            bearer_left = '142b04d97f924264beeaa1c93afd16ba';
            lang = 'de';
            agent = '3c76359c-8396-4f07-8452-eb462aff3f2a';
            bearer_left_server = $("#server_change_dropdown").val();
        }
    }
    else if (agent_left == 'domains_es') {
        if(server_left == 'stage'){
            bearer_left = 'fa2183527bbd44369723f7084bbdaea4';
            lang = 'es';
            agent = 'f1e4116b-d486-4465-862a-ab660dd381d8';
            bearer_left_server = $("#server_change_dropdown").val();
        } else {
            bearer_left = '16c9cad0e7534144b28a0340c9aad146';
            lang = 'es';
            agent = 'f1e4116b-d486-4465-862a-ab660dd381d8';
            bearer_left_server = $("#server_change_dropdown").val();
        }
    }
    else if (agent_left == 'domains_fr') {
        if(server_left == 'stage'){
            bearer_left = '2dd82039cf2e4a14aba41cceb4416688';
            lang = 'fr';
            agent = '6abd12fb-ee61-47cd-bb09-b7b904c76e89';
            bearer_left_server = $("#server_change_dropdown").val();
        } else {
            bearer_left = '2dd82039cf2e4a14aba41cceb4416688';
            lang = 'fr';
            agent = '6abd12fb-ee61-47cd-bb09-b7b904c76e89';
            bearer_left_server = $("#server_change_dropdown").val();
        }
    }
    else if (agent_left == 'SmartCar') {
        bearer_left = '9cba0205d7b047fcb1b562e6521d836d';
        lang = 'en';
        bearer_left_server = $("#server_change_dropdown").val();
    }
    else if (agent_left == 'SmartthingsV2') {
        bearer_left = '0279f33a7cc442718de39dbfc20db673';
        lang = 'en';
        bearer_left_server = $("#server_change_dropdown").val();
    }
    else if (agent_left == 'aneeda') {
        bearer_left = '3ad8c5e8782942648ccf3e672b0c0068';
        lang = 'en';
        bearer_left_server = $("#server_change_dropdown").val();
    }
    else if (agent_left == 'aneeda-staging') {
        bearer_left = '61a1d8a89f3d40c8b6b4767c66e4941c';
        lang = 'en';
        bearer_left_server = $("#server_change_dropdown").val();
    }
    else if (agent_left == '30SecToFlyExample') {
        bearer_left = 'f36953afdc1a421093e9481e758bd126';
        lang = 'en';
        bearer_left_server = $("#server_change_dropdown").val();
    }
    else if (agent_left == 'TestNLU') {
        bearer_left = '6551f864cd3542829c16df4c83bfad81';
        lang = 'en';
        bearer_left_server = $("#server_change_dropdown").val();
    }
    else if (agent_left == 'domains_it') {
        if(server_left == 'stage'){
            bearer_left = '30ffebf989284637be2ec39d01f3d9d7';
            lang = 'it';
            agent = '6dcb9841-3957-4725-a08a-b1fce39485eb';
            bearer_left_server = $("#server_change_dropdown").val();
        } else {
            bearer_left = '30ffebf989284637be2ec39d01f3d9d7';
            lang = 'it';
            agent = '6dcb9841-3957-4725-a08a-b1fce39485eb';
            bearer_left_server = $("#server_change_dropdown").val();
        }
    } else {
        bearer_left = ''
    }
    if (agent_right == 'domains') {
        if(server_right == 'stage'){
            bearer_right = 'e39ae547567c4eadb32f1dc2bc4d05be';
            lang = 'en';
            agent = '250f39da-ab9e-4e5c-8961-8511735885d2';
            bearer_right_server = $("#server_change_dropdown").val();
        } else {
            bearer_right = '249caad067e54650a5fb48e73e395d75';
            lang = 'en';
            agent = '250f39da-ab9e-4e5c-8961-8511735885d2';
            bearer_right_server = $("#server_change_dropdown").val();
        }
    }
    else if (agent_right == 'domains_cn') {
        if(server_right == 'stage'){
            bearer_right = '1b944208540f41d8a4ae90e15b756d8e';
            lang = 'zh-cn';
            agent = '0fb456e6-0315-4fcc-8520-9855d48ed623';
            bearer_right_server = $("#server_change_dropdown").val();
        } else {
            bearer_right = '1b944208540f41d8a4ae90e15b756d8e';
            lang = 'zh-cn';
            agent = '0fb456e6-0315-4fcc-8520-9855d48ed623';
            bearer_right_server = $("#server_change_dropdown").val();
        }
    }
    else if (agent_right == 'domains_de') {
        if(server_right == 'stage'){
            bearer_right = 'cc802e343d1448afb8d4a41233d28e68';
            lang = 'de';
            agent = '3c76359c-8396-4f07-8452-eb462aff3f2a';
            bearer_right_server = $("#server_change_dropdown").val();
        } else {
            bearer_right = '142b04d97f924264beeaa1c93afd16ba';
            lang = 'de';
            agent = '3c76359c-8396-4f07-8452-eb462aff3f2a';
            bearer_right_server = $("#server_change_dropdown").val();
        }
    }
    else if (agent_right == 'domains_es') {
        if(server_right == 'stage'){
            bearer_right = 'fa2183527bbd44369723f7084bbdaea4';
            lang = 'es';
            agent = 'f1e4116b-d486-4465-862a-ab660dd381d8';
            bearer_right_server = $("#server_change_dropdown").val();
        } else {
            bearer_right = '16c9cad0e7534144b28a0340c9aad146';
            lang = 'es';
            agent = 'f1e4116b-d486-4465-862a-ab660dd381d8';
            bearer_right_server = $("#server_change_dropdown").val();
        }
    }
    else if (agent_right == 'domains_fr') {
        if(server_right == 'stage'){
            bearer_right = '2dd82039cf2e4a14aba41cceb4416688';
            lang = 'fr';
            agent = '6abd12fb-ee61-47cd-bb09-b7b904c76e89';
            bearer_right_server = $("#server_change_dropdown").val();
        } else {
            bearer_right = '2dd82039cf2e4a14aba41cceb4416688';
            lang = 'fr';
            agent = '6abd12fb-ee61-47cd-bb09-b7b904c76e89';
            bearer_right_server = $("#server_change_dropdown").val();
        }
    }
    else if (agent_right == 'SmartCar') {
        bearer_right = '9cba0205d7b047fcb1b562e6521d836d';
        lang = 'en';
        bearer_right_server = $("#server_change_dropdown").val();
    }
    else if (agent_right == 'SmartthingsV2') {
        bearer_right = '0279f33a7cc442718de39dbfc20db673';
        lang = 'en';
        bearer_right_server = $("#server_change_dropdown").val();
    }
    else if (agent_right == 'aneeda') {
        bearer_right = '3ad8c5e8782942648ccf3e672b0c0068';
        lang = 'en';
        bearer_right_server = $("#server_change_dropdown").val();
    }
    else if (agent_right == 'aneeda-staging') {
        bearer_right = '61a1d8a89f3d40c8b6b4767c66e4941c';
        lang = 'en';
        bearer_right_server = $("#server_change_dropdown").val();
    }
    else if (agent_right == '30SecToFlyExample') {
        bearer_right = 'f36953afdc1a421093e9481e758bd126';
        lang = 'en';
        bearer_right_server = $("#server_change_dropdown").val();
    }
    else if (agent_right == 'TestNLU') {
        bearer_right = '6551f864cd3542829c16df4c83bfad81';
        lang = 'en';
        bearer_right_server = $("#server_change_dropdown").val();
    }
    else if (agent_right == 'domains_it') {
        if(server_right == 'stage'){
            bearer_right = '30ffebf989284637be2ec39d01f3d9d7';
            lang = 'it';
            agent = '6dcb9841-3957-4725-a08a-b1fce39485eb';
            bearer_right_server = $("#server_change_dropdown").val();
        } else {
            bearer_right = '30ffebf989284637be2ec39d01f3d9d7';
            lang = 'it';
            agent = '6dcb9841-3957-4725-a08a-b1fce39485eb';
            bearer_right_server = $("#server_change_dropdown").val();
        }
    } else {
        bearer_right = ''
    }
}

function diff_show(type, text, file, side){
	$('#current_diff').text('Current diff is: ' + file);
	$.ajax({
		url: '/apiai_diff_getter/',
		type: 'POST',
		contentType :'application/x-www-form-urlencoded',
		data: { type: type, text: text},
		error : function(data){
			console.log(data)
		},
		success: function(data){
			var data_json = JSON.parse(data);
            if (side && side.length > 0){
                $('#compare').mergely(side, data_json[0]);
                if (side == 'lhs') {$('#compare').mergely('rhs', '');} else {$('#compare').mergely('lhs', '');}
            } else {
                $('#compare').mergely('lhs', data_json[0]);
                if (data_json[1] && data_json[1].length > 0){
                    $('#compare').mergely('rhs', data_json[1]);
                } else {
                    $('#compare').mergely('rhs', '');
                }
            }
		}
	});
	$('#merge_to_right').show();
	$('#merge_to_left').show();
}

function apiai_update_intent(data_input, url, bearer, agent){
    $.ajax({
        url: "/apiai_ajax_update_diff_request",
        type: "POST",
        async: true,
        data: {'parameters': JSON.stringify(data_input), 'url': url, 'bearer': bearer},
        error: function (data) {
            console.log(data);
            alert('Oops, something went wrong. Check console.')
        },
        success: function (data) {
            console.log(data + ' ' + text);
        }
    })
}