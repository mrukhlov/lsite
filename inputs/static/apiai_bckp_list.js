$(document).ready(function() {

    var num = 0;
    $.ajax({
        url: "/apiai_bckp_list",
        type: "GET",
        error: function (data) {
            console.log(data);
            alert('Oops, something went wrong. Check console.')
        },
        success: function (data) {
            var data = JSON.parse(data);
            console.log(data);
            for (i in data){
                var num_selector = 'dir_'+num;
                $('#dir_list').append($('<li>').append($('<span>').text(i).attr('id', 'dir_span')).attr('id', 'list_item').append($('<ul>').attr('class', num_selector).attr('style', 'list-style-type:none; display:table-cell')));
                num++;
                dir = i;
                for (ii in data[i]){
                    var button = $('<input id="download_backup_archive" type="button" value="download" text="'+i+'|'+data[i][ii]+'" class="btn btn-default btn-xs"/>');
                    $('.'+num_selector).append($('<li>').append($('<span>').text(data[i][ii]).attr('class', 'name_span').attr('style', 'width:100px;')).append(button));
                }
            }
            $("span").parent().find('ul > li').toggle();
        }
    });

    $("#dir_list").on("click", "#download_backup_archive", function(event){
        $.ajax({
            url: "/apiai_bckp_download/",
            type: "POST",
            data: {'data':$(this).attr('text')},
            error: function (data) {
                console.log(data);
                alert('Oops, something went wrong. Check console.')
            },
            success: function (data) {
                location.replace('/apiai_bckp_download/');
            }
        })
    });

    $("#dir_list").on("click", "#dir_span", function(event){
        $(this).parent().find('ul > li').toggle();
    });

});