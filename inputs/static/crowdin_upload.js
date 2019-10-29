$('document').ready(function(){
    if(typeof(Storage) !== "undefined") {
        var buttons = sessionStorage.getItem("buttons");
        var list = sessionStorage.getItem("list");
        if (buttons !== "none") {
            if (buttons === "block"){
                $('.buttons').show()
                $('.buttons').css({'position':'fixed'})
                $('#table').addClass('moved')
                $('#user_list').addClass('moved')
            } else {
                $('.buttons').hide()
                $('.buttons').css({'position':'fixed'})
                $('#table').removeClass('moved')
                $('#user_list').removeClass('moved')
            }
        }
        console.log($('#table').css('display'))
        if (list !== "none") {
            if (list === "block"){
                $('#table').hide()
                $('#user_list').show()
            } else {
                $('#table').show()
                $('#user_list').hide()
            }
        }
    }

    $('#pull-me').click(function(){
        $('.buttons').toggle()
        $('.buttons').css({'position':'fixed'})
        $('#table').toggleClass('moved')
        $('#user_list').toggleClass('moved')
        var buttons_state = $('.buttons').css('display')
        sessionStorage.setItem("buttons", buttons_state);
    })

    $('.level-1 li').click(function(){
        $(this).parent().find('ol > li').toggle();
    })

    $('#toggle-list').click(function(){
        //console.log($('#user_list').css('display'))
        $('#table').toggle()
        $('#user_list').toggle()
        var list_state = $('#user_list').css('display')
        sessionStorage.setItem("list", list_state);
    })
})