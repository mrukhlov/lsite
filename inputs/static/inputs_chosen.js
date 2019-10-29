$(document).ready(function() {
    $("#input-filter-ling").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true, width: '12%'});
    $(".language_select_box").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true, width: '6%'});
    //$(".service_select_box").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true});
    $(".action_select_box").chosen({no_results_text: "Oops, nothing found!", allow_single_deselect: true, disable_search: true});
});