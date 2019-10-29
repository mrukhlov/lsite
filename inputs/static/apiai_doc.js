$(document).ready(function() {

    var token_storage = localStorage.getItem("token_input");
    var spreadsheet_storage = localStorage.getItem("spreadsheet_input");
    var server_storage = localStorage.getItem("server_change_dropdown");

    if (token_storage && token_storage.length > 0) {$('#token_input').val(token_storage)}
    if (server_storage && server_storage.length > 0) {$('#server_change_dropdown').val(server_storage); $('#server_change_dropdown').trigger('chosen:updated')}
    if (spreadsheet_storage && spreadsheet_storage.length > 0) {$('#spreadsheet_input').val(spreadsheet_storage)}

    $('#send_token_button').on('click', function(){
        localStorage.setItem("token_input", $("#token_input").val());
        localStorage.setItem("spreadsheet_input", $("#spreadsheet_input").val());
        localStorage.setItem("server_change_dropdown", $("#server_change_dropdown").val());
        $('#send_token_button').toggleClass("disabled in-progress", true);
        var token = $('#token_input').val();
        var server = $("#server_change_dropdown").val();
        var spreadsheet = $("#spreadsheet_input").val();
        var sheetname = $("#sheet_name").val();
        if (token.length < 1) {
            alert('Check if token and spreadsheet fields are not empty');
            $('#send_token_button').toggleClass("disabled in-progress", false);
        } else if (spreadsheet.length < 1) {
            alert('Check if token and spreadsheet fields are not empty');
            $('#send_token_button').toggleClass("disabled in-progress", false);
        } else if (token.length > 0 && spreadsheet.length > 0) {
            $.ajax({
                url:'/apiai_doc_create/',
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                type: 'POST',
                data: {'token': token, 'server':server, 'spreadsheet':spreadsheet, 'sheetname': sheetname},
                success: function(data){
                    //alert(data);
                    //console.log(data);
                    if (data != 'wrong token' && data != 'wrong spreadsheet'){
                        console.log('success');
                        $('#send_token_button').toggleClass("disabled in-progress", false);
                        $('#link_place').html('<a href=https://docs.google.com/spreadsheets/d/'+spreadsheet+'/edit#gid=0 target="_blank">SpreadSheet Link</a>');
                    } else if (data == 'wrong token' && data == 'wrong spreadsheet') {
                        console.log(data);
                        alert('Please check agent token or agent server');
                        $('#send_token_button').toggleClass("disabled in-progress", false);
                    } else {
                        console.log(data);
                        alert('error, check console');
                        $('#send_token_button').toggleClass("disabled in-progress", false);
                    }
                },
                error: function(data){
                    console.log(data);
                    alert('error, check console');
                    $('#send_token_button').toggleClass("disabled in-progress", false);
                }
            })
        }
    });

    //====================

    var token_storage_agent = localStorage.getItem("token_input_agent");
    var spreadsheet_storage_agent = localStorage.getItem("spreadsheet_input_agent");
    var server_storage_agent = localStorage.getItem("server_change_dropdown_agent");

    if (token_storage_agent && token_storage_agent.length > 0) {$('#token_input_agent').val(token_storage_agent)}
    if (server_storage_agent && server_storage_agent.length > 0) {$('#server_change_dropdown_agent').val(server_storage_agent); $('#server_change_dropdown_agent').trigger('chosen:updated')}
    if (spreadsheet_storage_agent && spreadsheet_storage_agent.length > 0) {$('#spreadsheet_input_agent').val(spreadsheet_storage_agent)}

    $('#send_token_button_agent').on('click', function(){
        localStorage.setItem("token_input_agent", $("#token_input_agent").val());
        localStorage.setItem("spreadsheet_input_agent", $("#spreadsheet_input_agent").val());
        localStorage.setItem("server_change_dropdown_agent", $("#server_change_dropdown_agent").val());
        $('#send_token_button_agent').toggleClass("disabled in-progress", true);
        var token = $('#token_input_agent').val();
        var server = $("#server_change_dropdown_agent").val();
        var spreadsheet = $("#spreadsheet_input_agent").val();
        if (token.length < 1) {
            alert('Check if token and spreadsheet fields are not empty');
            $('#send_token_button_agent').toggleClass("disabled in-progress", false);
        } else if (spreadsheet.length < 1) {
            alert('Check if token and spreadsheet fields are not empty');
            $('#send_token_button_agent').toggleClass("disabled in-progress", false);
        } else if (token.length > 0 && spreadsheet.length > 0) {
            $.ajax({
                url:'/apiai_doc_create_agent/',
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                type: 'POST',
                data: {'token': token, 'server':server, 'spreadsheet':spreadsheet},
                success: function(data){
                    //alert(data);
                    //console.log(data);
                    if (data != 'wrong token' && data != 'wrong spreadsheet' && data != 'failed'){
                        $('#send_token_button_agent').toggleClass("disabled in-progress", false);
                        //$('#link_place_agent').html('<a href=https://docs.google.com/spreadsheets/d/'+spreadsheet+'/edit#gid=0 target="_blank">Agent Link</a>');
                    } else {
                        alert('Please check agent token or agent server');
                        $('#send_token_button_agent').toggleClass("disabled in-progress", false);
                    }
                },
                error: function(data){
                    console.log(data.responseText);
                    alert('error, check console');
                    $('#send_token_button_agent').toggleClass("disabled in-progress", false);
                }
            })
        }
    });

    //====================

    var token_storage_agent_sap = localStorage.getItem("token_input_agent_sap");
    var spreadsheet_storage_agent_sap = localStorage.getItem("spreadsheet_input_agent_sap");
    var server_storage_agent_sap = localStorage.getItem("server_change_dropdown_agent_sap");

    if (token_storage_agent_sap && token_storage_agent_sap.length > 0) {$('#token_input_agent_sap').val(token_storage_agent_sap)}
    if (server_storage_agent_sap && server_storage_agent_sap.length > 0) {$('#server_change_dropdown_agent_sap').val(server_storage_agent_sap); $('#server_change_dropdown_agent_sap').trigger('chosen:updated')}
    if (spreadsheet_storage_agent_sap && spreadsheet_storage_agent_sap.length > 0) {$('#spreadsheet_input_agent_sap').val(spreadsheet_storage_agent_sap)}

    $('#send_token_button_agent_sap').on('click', function(){
        localStorage.setItem("token_input_agent_sap", $("#token_input_agent_sap").val());
        localStorage.setItem("spreadsheet_input_agent_sap", $("#spreadsheet_input_agent_sap").val());
        localStorage.setItem("server_change_dropdown_agent_sap", $("#server_change_dropdown_agent_sap").val());
        $('#send_token_button_agent_sap').toggleClass("disabled in-progress", true);
        var token = $('#token_input_agent_sap').val();
        var server = $("#server_change_dropdown_agent_sap").val();
        var spreadsheet = $("#spreadsheet_input_agent_sap").val();
        if (token.length < 1) {
            alert('Check if token and spreadsheet fields are not empty');
            $('#send_token_button_agent_sap').toggleClass("disabled in-progress", false);
        } else if (spreadsheet.length < 1) {
            alert('Check if token and spreadsheet fields are not empty');
            $('#send_token_button_agent_sap').toggleClass("disabled in-progress", false);
        } else if (token.length > 0 && spreadsheet.length > 0) {
            $.ajax({
                url:'/sap_create_agent/',
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                type: 'POST',
                data: {'token': token, 'server':server, 'spreadsheet':spreadsheet},
                success: function(data){
                    //alert(data);
                    //console.log(data);
                    if (data != 'wrong token' && data != 'wrong spreadsheet' && data != 'failed'){
                        $('#send_token_button_agent_sap').toggleClass("disabled in-progress", false);
                        //$('#link_place_agent_sap').html('<a href=https://docs.google.com/spreadsheets/d/'+spreadsheet+'/edit#gid=0 target="_blank">Agent Link</a>');
                        alert('Success!');
                    } else {
                        console.log(data);
                        alert('Please check agent token or agent server');
                        $('#send_token_button_agent_sap').toggleClass("disabled in-progress", false);
                    }
                },
                error: function(data){
                    console.log(data.responseText);
                    alert('error, check console');
                    $('#send_token_button_agent_sap').toggleClass("disabled in-progress", false);
                }
            })
        }
    });

});