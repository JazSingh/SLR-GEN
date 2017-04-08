$(function() {
    console.log( "ready!" );

    $( "#generate-button" ).click(function() {
        var $termGroups = $(".term-group");

        var groups = [];
        var j = 0;
        for(var i = 0; i < $termGroups.size(); i++) {
            var terms = $(":input", $termGroups[i]).map(function() {
                return $(this).val() === "" ? null : "\"" + $(this).val() + "\"";
            });

            var termArr = $.makeArray(terms);
            if(checkNotEmpty(termArr)) {
                groups[j]= "(" + termArr.join(" OR ") + ")";
                j++;
            }
        }

        var query = "TABLE EMPTY";
        if(checkNotEmpty(groups)) {
            query = "(" + groups.join(" AND ") + ")";
        }
        $("#result").text(query);
    });

    function checkNotEmpty(arrayObj) {
        return arrayObj.length > 0
    }

});