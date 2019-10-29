$(document).ready(function() {

    var agent_selected = localStorage.getItem("agent_select");
    var agent_token = localStorage.getItem("agent_token");

    function bearer_setting(item){
        $.ajax({
            url : "/stat_bearer_setting",
            type : "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: {'item': item},
            error : function(data){
                alert('Oops, something went wrong. Check console.');
                console.log(data);
            },
            success : function(data){
                var json = JSON.parse(data);
                bearer = json['bearer'];
                lang = json['lang'];
            }
        })
    };

    if(agent_selected && agent_selected.length > 0) {
        bearer_setting(agent_selected)
    } else {
        bearer_setting($("#agent_select_dropdown").val())
    }

    if (agent_selected && agent_selected.length > 0) {$('#agent_select_dropdown').val(agent_selected)}
    if (agent_token && agent_token.length > 0) {$('#overview_token').val(agent_token)}

    $("#agent_select_dropdown").on('change', function() {
        localStorage.setItem("agent_select", $("#agent_select_dropdown").val());
        bearer_setting($("#agent_select_dropdown").val())
    });

    $('#spreadsheet_link').hide();
    $('#myProgress').hide();


    $('#get_stat').click(
        function(){
            var intents_dic = {};
            var intents_count = {};
            lang_spreadsheet = $("#agent_select_dropdown").val();
            $('#process').text('');
            $('#spreadsheet_link').text('');
            //stat_bearer_setting($("#agent_select_dropdown").val());
            //var item = $("#agent_select_dropdown").val();
            var server = $("#agent_select_dropdown").val();
            $.ajax({
                url : "/stat_bearer_setting",
                type : "POST",
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                data: { 'item': lang_spreadsheet},
                error : function(data){
                    alert('Oops, something went wrong. Check console.');
                    console.log(data);
                },
                success : function(data){
                    var json = JSON.parse(data);
                    bearer = json['bearer'];
                    lang = json['lang'];

                    $.ajax({
                    url: 'http://openapi-stage/api/intents/?v=20150910',
                    type: 'GET',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", bearer)
                    }, success: function(data){
                        for (i in data){
                            intents_dic[data[i]['name']] = data[i]['id']
                        }
                        var overall_intents_count = Object.keys(intents_dic).length;
                        $('#process').append('Intents quantity is ' + overall_intents_count);
                        var num = 1;
                        $('#myProgress').show();
                        var deferreds = [];
                        for (var id in intents_dic){
                            deferreds.push($.ajax({
                                url: 'http://openapi-stage/api/intents/'+intents_dic[id]+'?v=20150910',
                                type: 'GET',
                                beforeSend: function(xhr) {
                                    xhr.setRequestHeader("Authorization", bearer)
                                }, success: function(data){
                                    intents_count[data['name']] = data['templates'].length;
                                    $('#process').text('Processing ' + num + ' intent of ' + overall_intents_count + '...');
                                    num++;
                                    var width = (num * 100) / overall_intents_count;
                                    document.getElementById("myBar").style.width = width + '%';
                                }
                            }))
                        }
                        $.when.apply(null, deferreds).done(function() {
                            $('#myProgress').hide();
                            $('#process').text('Done, sending to spreadsheet...');
                            $.ajax({
                                url: '/apiai_stat_post/',
                                type: 'POST',
                                //data: intents_count,
                                data: JSON.stringify({'count': intents_count, 'id': intents_dic, 'lang':lang}),
                                success: function(data){
                                    $('#spreadsheet_link').show();
                                    $('#process').text('Statistics counted.');
                                    var intents_stat_href = intents_stat_spreadsheets(lang_spreadsheet);
                                    if (lang_spreadsheet == 'domains') {
                                        $("<a/>", {
                                            id: 'link_en',
                                            href: intents_stat_href,
                                            text: 'en spreadsheet link',
                                            target: '_blank'
                                        }).appendTo("#spreadsheet_link");
                                    }
                                    else if (lang_spreadsheet == 'domains_cn') {
                                        $("<a/>", {
                                            id: 'link_zh-CN',
                                            href: intents_stat_href,
                                            text: 'zh-CN spreadsheet link',
                                            target: '_blank'
                                        }).appendTo("#spreadsheet_link");
                                    }
                                    else if (lang_spreadsheet == 'domains_es') {
                                        $("<a/>", {
                                            id: 'link_es',
                                            href: intents_stat_href,
                                            text: 'es spreadsheet link',
                                            target: '_blank'
                                        }).appendTo("#spreadsheet_link");
                                    }
                                    else if (lang_spreadsheet == 'domains_fr') {
                                        $("<a/>", {
                                            id: 'link_fr',
                                            href: intents_stat_href,
                                            text: 'fr spreadsheet link',
                                            target: '_blank'
                                        }).appendTo("#spreadsheet_link");
                                    }
                                    else if (lang_spreadsheet == 'domains_de') {
                                        $("<a/>", {
                                            id: 'link_de',
                                            href: intents_stat_href,
                                            text: 'de spreadsheet link',
                                            target: '_blank'
                                        }).appendTo("#spreadsheet_link");
                                    }
                                    else if (lang_spreadsheet == 'domains_it') {
                                        $("<a/>", {
                                            id: 'link_it',
                                            href: intents_stat_href,
                                            text: 'it spreadsheet link',
                                            target: '_blank'
                                        }).appendTo("#spreadsheet_link");
                                    }
                                    //$('#spreadsheet_link').show();
                                },
                                error : function(data){
                                    alert('Oops, something went wrong. Check console.');
                                    console.log(data)
                                }
                            });
                        })
                    }
                })
                }
            })
    });

    $('#get_stat_entity').click(function(){
        $('#process').text('Sending to spreadsheet...');
        $.ajax({
            url: '/apiai_stat_entities_post/',
            type: 'POST',
            //data: intents_count,
            data: JSON.stringify({'lang':lang}),
            success: function(data){
                lang_spreadsheet = JSON.parse(data)['lang'];
                $('#spreadsheet_link').show();
                $('#process').text('Statistics counted.');
                var entities_stat_href = entities_stat_spreadsheets(lang_spreadsheet);
                if (lang_spreadsheet == 'en') {
                    $("<a/>", {
                        id: 'link_en',
                        href: entities_stat_href,
                        text: 'en spreadsheet link',
                        target: '_blank'
                    }).appendTo("#spreadsheet_link");
                }
                else if (lang_spreadsheet == 'zhcn') {
                    $("<a/>", {
                        id: 'link_zh-CN',
                        href: entities_stat_href,
                        text: 'zh-CN spreadsheet link',
                        target: '_blank'
                    }).appendTo("#spreadsheet_link");
                }
                else if (lang_spreadsheet == 'es') {
                    $("<a/>", {
                        id: 'link_es',
                        href: entities_stat_href,
                        text: 'es spreadsheet link',
                        target: '_blank'
                    }).appendTo("#spreadsheet_link");
                }
                else if (lang_spreadsheet == 'fr') {
                    $("<a/>", {
                        id: 'link_fr',
                        href: entities_stat_href,
                        text: 'fr spreadsheet link',
                        target: '_blank'
                    }).appendTo("#spreadsheet_link");
                }
                else if (lang_spreadsheet == 'de') {
                    $("<a/>", {
                        id: 'link_de',
                        href: entities_stat_href,
                        text: 'de spreadsheet link',
                        target: '_blank'
                    }).appendTo("#spreadsheet_link");
                }
                else if (lang_spreadsheet == 'it') {
                    $("<a/>", {
                        id: 'link_it',
                        href: entities_stat_href,
                        text: 'it spreadsheet link',
                        target: '_blank'
                    }).appendTo("#spreadsheet_link");
                }
                //$('#spreadsheet_link').show();
            },
            error : function(data){
                alert('Oops, something went wrong. Check console.');
                console.log(data)
            }
        });
    });

    function chart_stat(){

        var chart = c3.generate({
            bindto: '#chart',
            size: {width: 600},
            data: {
                x : 'x',
                columns: [
                    ['x', 'domains'],
                    ['quantity', '0']
                ],
                groups: [
                    ['quantity']
                ],
                type: 'bar'
            },
            axis: {
                x: {
                    type: 'category' // this needed to load string x value
                }
        }
        });

        var languages = ['domains', 'domains_de', 'domains_es', 'domains_fr', 'domains_it', 'domains_cn'].sort();
        chart_languages = ['x'];
        chart_quantity = ['quantity'];
        intents_dict = {};
        for (var x = 0; x < languages.length; x++){(function(xx){
            var intents_dic = [];
            var intents_count = 0;
            var lang_item = languages[xx];
            bearer_setting(lang_item);
            $.ajax({
                url : "/stat_bearer_setting",
                type : "POST",
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                data: {'item': lang_item},
                error : function(data){
                    alert('Oops, something went wrong. Check console.');
                    console.log(data);
                },
                success : function(data){
                    var json = JSON.parse(data);
                    bearer = json['bearer'];
                    lang = json['lang'];
                    $.ajax({
                    url: 'http://openapi-stage/api/intents/?v=20150910',
                    type: 'GET',
                    async: false,
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("Authorization", bearer)
                    }, success: function(data){
                        for (i in data){
                            intents_dic.push(data[i]['id'])
                        }
                        var intents_count = 0;
                        var deferreds = [];
                        chart_languages.push(lang_item);
                        for (var id in intents_dic){
                            deferreds.push($.ajax({
                                url: 'http://openapi-stage/api/intents/'+intents_dic[id]+'?v=20150910',
                                type: 'GET',
                                beforeSend: function(xhr) {
                                    xhr.setRequestHeader("Authorization", bearer)
                                }, success: function(data){
                                    intents_count += data['templates'].length;
                                    langg = lang_item;
                                }
                            }))
                        }
                        $.when.apply(null, deferreds).done(function() {
                            chart_quantity.push(intents_count);
                            intents_dict[lang_item] = intents_count;
                            keysSorted = Object.keys(intents_dict).sort(function(a,b){return intents_dict[b]-intents_dict[a]})
                            var chart = c3.generate({
                                bindto: '#chart',
                                size: {width: 600},
                                data: {
                                    x : 'x',
                                    columns: [
                                        ['x'].concat(keysSorted),
                                        ['quantity'].concat(keysSorted.map(function(a){return intents_dict[a]}))
                                    ],
                                    groups: [
                                        ['quantity']
                                    ],
                                    type: 'bar'
                                },
                                axis: {
                                    x: {
                                        type: 'category' // this needed to load string x value
                                    }
                                }
                            });
                        })
                    }})
                }
            })
            })(x);
        }
    }

    $('#get_chart').click(function(){chart_stat()});

    $('#get_overview').click(function(){
        $('.overview_link').hrml('');
        localStorage.setItem("agent_token", $("#overview_token").val());
        $('#get_overview').toggleClass("disabled in-progress", true);
    });

});