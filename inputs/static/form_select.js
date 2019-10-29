$(document).ready(function() {
     $(".my_select_box").chosen({
		disable_search_threshold: 10,
		no_results_text: "Oops, nothing found!",
		width: "10%",
		allow_single_deselect: true
	  });
});