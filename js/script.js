$(function() {
    console.log( "ready!" );

    $( "#generate-button" ).click(function() {
        var $termGroups = $(".term-group");

        var type = $('input[name=nf]:checked').val();

        if(type==="CNF") {
            $("#result").text(CNF($termGroups));
        } else {
            $("#result").text(DNF($termGroups));
        }
    });

    /**
     * @return {string}
     */
    function CNF($termGroups) {
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

        return query;
    }


    function buildTree(groups, currentNode, depth) {
        if(depth < groups.length) {
            for (var j = 0; j < groups[depth].length; j++) {
                var newNode = {"value": groups[depth][j], "children": []};
                currentNode.children.push(newNode);
                buildTree(groups, newNode, depth+1);
            }
        }
    }

    function buildQuery(currentNode, queryArr, query) {
        if(currentNode.children.length > 0) {
            for(var i = 0; i < currentNode.children.length; i++) {
                var newQuery = [];
                for(var q = 0; q < query.length; q++) {
                    newQuery.push(query[q]);
                }
                if(currentNode.value !== null) {
                    newQuery.push(currentNode.value);
                }
                buildQuery(currentNode.children[i], queryArr, newQuery);
            }
        } else {
            var newQueryFinal = [];
            for(var j = 0; j < query.length; j++) {
                newQueryFinal.push(query[j]);
            }
            newQueryFinal.push(currentNode.value);
            queryArr.push(newQueryFinal);
        }
    }

    /**
     * @return {string}
     */
    function DNF($termGroups) {
        var groups = [];
        var j = 0;

        for(var i = 0; i < $termGroups.size(); i++) {
            var terms = $(":input", $termGroups[i]).map(function() {
                return $(this).val() === "" ? null : "\"" + $(this).val() + "\"";
            });

            var termArr = $.makeArray(terms);
            if(checkNotEmpty(termArr)) {
                groups[j]= termArr;
                j++;
            }
        }

        var root = {"value": null, "children": []};
        var depth = 0;
        buildTree(groups, root, depth);

        var queries = [];
        buildQuery(root, queries, []);
        for(var q = 0; q < queries.length; q++) {
            queries[q] = "(" + queries[q].join(" AND ") + ")";
        }
        return "(" + queries.join(" OR ") + ")";
    }

    function checkNotEmpty(arrayObj) {
        return arrayObj.length > 0
    }

});