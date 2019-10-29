$(document).ready(function() {
    var data = $("#data").text();
    var list = data.split("\n")
    for (x in list){
        var item = list[x]
        $.ajax({
            url: 'https://api.api.ai/api/query?v=20150910&query=' + list[x] + '&lang=en&sessionId=15f8244c-8264-4c54-b897-888ef8605b97&timezone=Europe/Moscow',
            type: 'GET',
            dataType: 'json',
            contentType: "application/json",
            beforeSend: function(xhr) {
                 xhr.setRequestHeader("Authorization", "Bearer d12ecb93c4ba4a66b6b505e1a9cfa9d8")
                 xhr.setRequestHeader("ocp-apim-subscription-key", "c67a61bb-7432-416d-a171-59ee46e3ed2a")
            }, success: function(data){
                var obj = JSON.parse(JSON.stringify(data));
                result_action = obj['result'].action
                result_query = obj['result'].resolvedQuery
                $("#result").find('tbody').append($('<tr>').append($('<td>').text(result_query)).append($('<td>').text(result_action)))
            }
        })
    };
});