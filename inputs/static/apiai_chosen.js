$(document).ready(function() {
    $("#server_change_dropdown").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true, width: '6%'});
    $("#language_select_dropdown_from").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true, width: '5%'});
    $("#agent_select_dropdown").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true, width: '10%', search_contains: true});
    $("#agent_select_dropdown_from").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true, width: '15%', search_contains: true});
    $("#intent_select_dropdown").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true, width: '15%', search_contains: true});
    $("#intent_select_dropdown_from").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true, width: '15%', search_contains: true});
    $("#keyAction").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true, search_contains: true});
    $("#server_change_dropdown_0").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true, width: '10%'});
    $("#agent_select_dropdown_0").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true});
    $("#server_change_dropdown_1").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true, width: '10%'});
    $("#agent_select_dropdown_1").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true});
});