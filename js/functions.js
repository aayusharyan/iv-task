$("#home").bind("click", function() {
    $("#search_results").html('');
    $("#home_div").css('display', '');

});
function open_modal (epid) {
    var modal_content = $("[data-ep_id='"+ epid +"']").data('full_summary');
    $("#episode_info").html(modal_content);
    $('#exampleModal').modal('show');
}
$("#search_btn").bind("click", function() {
    change_loading_state(true);
    $.ajax({
        type: "GET",
        url: "http://api.tvmaze.com/search/shows",
        data: {
            q: $("#search_content").val()
        },
        success:function(result) {
            $("#search_results").html("");
            $.each(result, function(index, single_data) {
                var img_src = "img/no-image.jpeg";
                if(single_data.show.image != null) {
                    img_src = single_data.show.image.medium;
                }

                var new_card = "<div class=\"col-3 mb-4\">\n" +
                    "        <div class=\"card\">\n" +
                    "            <img class=\"img-fluid\" src=\""+ img_src +"\" alt=\"Card image cap\">\n" +
                    "            <div class=\"card-body\">\n" +
                    "                <!--Title-->\n" +
                    "                <h4 class=\"card-title\" style='white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>"+ single_data.show.name +"</h4>\n" +
                    "                <!--Text-->\n" +
                    "                <div class='card-content'>"+ single_data.show.summary +"</div>\n" +
                    "                <a href=\"#\" class=\"btn btn-primary\" onclick='single_search_id("+ single_data.show.id +")'>View More</a>\n" +
                    "            </div>\n" +
                    "        </div>\n" +
                    "    </div>";


                $('#search_results').append(new_card);
                change_loading_state(false);
            });
        }
    });
});
$("#search_btn_single").bind("click", function() {
    show_single_record();
});
function single_search_id(tvmazeid) {
    change_loading_state(true);
    $.ajax({
        type: "GET",
        url: "http://api.tvmaze.com/shows/"+tvmazeid,
        success:function(single_data) {
            update_single_show_data(single_data);
            change_loading_state(false);
        }
    });
}
function show_single_record() {
    change_loading_state(true);
    $.ajax({
        type: "GET",
        url: "http://api.tvmaze.com/singlesearch/shows?",
        data: {
            q: $("#search_content").val()
        },
        success:function(single_data) {
            update_single_show_data(single_data);
            change_loading_state(false);
        }
    });
}
function update_single_show_data(single_data) {
    $("#search_results").html("");

    var img_src = "";
    if(single_data.image != null) {
        img_src = single_data.image.medium;
    }

    $("#search_results").html("");
    var new_card = "<div class=\"card m-4 p-0\">\n" +
        "                    <div class=\"card-body row p-0\">\n" +
        "                        <div class=\"col-2\">\n" +
        "                            <img class=\"img-fluid\" src=\""+ img_src +"\" alt=\"Card image cap\">\n" +
        "                        </div>\n" +
        "                        <div class=\"col-10 p-3\">\n" +
        "                            <h4 class=\"card-title\" style=\"white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\">"+ single_data.name +"</h4>\n" +
        "                            <div class=''>"+ single_data.summary +"</div>\n" +
        "                        </div>\n" +
        "                        <div class=\"col-12 m-3\">\n" +
        "                            <h4>Rating: "+ single_data.rating.average +" out of 10</h4>\n" +
        "                            <h2 class=\"title\">Cast:</h2>\n" +
        "                            <div class='m-4'>" +
        "                                <div class='row' id='single_show_cast'></div>" +
        "                            </div>" +
        "                            <h2 class=\"title\">Episodes:</h2>" +
        "                            <div class='m-4'>" +
        "                                <div class='row' id='single_show_episodes'></div>" +
        "                            </div>\n" +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>";
    $('#search_results').append(new_card);
    update_show_cast(single_data.id);
    update_show_episodes(single_data.id);
}

function update_show_episodes(tvid) {
    change_loading_state(true);
    $.ajax({
        type: "GET",
        url: "http://api.tvmaze.com/shows/"+ tvid +"/episodes",
        success:function(result) {
            $("#single_show_episodes").html("");
            $.each(result, function(index, single_data) {
                var img_src = "";
                if(single_data.image != null) {
                    img_src = single_data.image.medium;
                }

                var new_card = "<div class=\"col-3 mb-4\">\n" +
                    "        <div class=\"card\">\n" +
                    "            <img class=\"img-fluid\" src=\""+ img_src +"\" alt=\"Card image cap\">\n" +
                    "            <div class=\"card-body\">\n" +
                    "                <h4 class=\"card-title\" style='white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>"+ single_data.name +"</h4>\n" +
                    "                <div class='card-content' data-ep_id='"+ single_data.id +"' data-full_summary=\""+ $('<div/>').text(single_data.summary).html() +"\" >"+ single_data.summary +"</div>\n" +
                    "                <p><em>(Air Date: "+ single_data.airdate +")</em></p>" +
                    "            </div>\n" +
                    "           <button type=\"button\" class=\"btn btn-primary\" onclick='open_modal("+ single_data.id +")'>\n" +
                    "               View Full Data\n" +
                    "           </button>" +
                    "        </div>\n" +
                    "    </div>";


                $('#single_show_episodes').append(new_card);
            });
            change_loading_state(false);
        }
    });
}

function update_show_cast(tvid) {
    change_loading_state(true);
    $.ajax({
        type: "GET",
        url: "http://api.tvmaze.com/shows/"+ tvid +"/cast",
        success:function(result) {
            $("#single_show_cast").html("");
            $.each(result, function(index, single_data) {
                var img_src = "";
                if(single_data.character.image != null) {
                    img_src = single_data.character.image.medium;
                }

                var new_card = "<div class=\"col-2 mb-4\">\n" +
                    "        <div class=\"card\">\n" +
                    "            <img class=\"img-fluid\" src=\""+ img_src +"\" alt=\"Card image cap\">\n" +
                    "            <div class=\"card-body\">\n" +
                    "                <h4 class=\"card-title\" style='white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>"+ single_data.person.name +"</h4>\n" +
                    "                <div><p><em>("+ single_data.character.name +")</em></p></div>" +
                    "            </div>\n" +
                    "        </div>\n" +
                    "    </div>";


                $('#single_show_cast').append(new_card);
            });
            change_loading_state(false);
        }
    });
}

function change_loading_state(loading_visibility_status) {
    if(loading_visibility_status) {
        $("#loading_state").css('visibility', 'visible');
        $("#home_div").css('display', 'none');
    } else {
        $("#loading_state").css('visibility', 'hidden');
    }
}