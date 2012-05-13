function getURLParameter(name) {
    var rv = (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1];
    return rv ? decodeURI(rv) : rv;
}

function search_data() {
    var data_to_search = new RegExp(".*"+$("#input")[0].value+".*","i");
    var region_to_search = $("#region").val();
    var result = [];
    $(provincias).each(function(){
        if (data_to_search.exec(_unsanitize(this.name)) && (region_to_search == "Todas" || region_to_search == _unsanitize(this.region))) {
            result.push(this);
        }
    });
    return result;
}

function load_regions() {
    $("<option value='Todas'>&lt;Todas&gt;</option>").appendTo( "#region" );
    $("<option value='Ninguna'>&lt;Ninguna&gt;</option>").appendTo( "#region" );
    var visited = [];
    $(provincias).each(function(){
        var region = this.region;
        if (visited.indexOf(region) == -1 && region != 'Ninguna') {
            visited.push(region);
        }
    });
    visited = visited.sort();
    $(visited).each(function() {
        $.tmpl( "<option value='${region}'>${region}</option>'", {"region":this}).appendTo( "#region" );
    });
}

var PROVINCE_ROW_TEMPLATE = "<tr>"
                         +   "<td class='sortable' name='region'>${region}</td>"
                         +   "<td class='sortable' name='name'>${name}</td>"
                         +   "<td class='sortable' name='capital'>${capital}</td>"
                         +   "<td class='sortable' name='inhabitants'>${inhabitants}</td>"
                         +   "<td class='sortable' name='area'>${area}</td>"
                         + "</tr>";

function load_data(data) {
    $("tbody tr", "#data").each(function() { $(this).remove()});
    $(data).each(function(){
        $.tmpl(PROVINCE_ROW_TEMPLATE, this).appendTo( "#data" );
    });
    if ($(data).size() > 0) {
        sort_table();
    } else {
      $("<tr><td colspan='5'>No hay provincias que coincidan con lo buscado</td></tr>").appendTo( "#data" );
    }
}

function _stringify(str) {
    var rv = "";
    $(str).each(function(){
        rv += this;
    });
    return rv;
}

function column_names(filter_columns) {
    var names = $("th", "#data thead").map(function(){
        return $(this).attr('name');
    }).filter(function() {
        return $.inArray(_stringify(this), filter_columns) != -1;
    });
    return names;
}

function column_titles(column_names) {
    return $(column_names).map(function() {
        return $(".column-title",$("th[name="+this+"]", "#data thead")).text();
    });
}

function rows() {
    return $("tr", "#data tbody");
}

function row_content_to_export(row, columns) {
    var rv = $("td",row).filter(function(){
        return $.inArray($(this).attr('name'), columns) != -1;
    }).map(function() {
        return this.innerHTML;
    });
    return rv;
}

function _unsanitize(string) {
    return string.replace(/&aacute;/g, "á")
            .replace(/&eacute;/g, "é")
            .replace(/&iacute;/g, "í")
            .replace(/&oacute;/g, "ó")
            .replace(/&uacute;/g, "ú");
}

function _sanitize(string) {
    return string.replace(/á/g, "&aacute;")
            .replace(/é/g, "&eacute;")
            .replace(/í/g, "&iacute;")
            .replace(/ó/g, "&oacute;")
            .replace(/ú/g, "&uacute;");
}

function _filter_rows_for_html(rows) {
    return rows;
}
function get_content_as_html(filter_columns) {
    var result = "<html><head><meta charset='utf-8'/><title>Provincias</title></head><body><table><thead><tr>";
    var columns_to_export = column_names(filter_columns); 
    column_titles(columns_to_export).each(function() {
        result += "<th>" + _sanitize(this) + "</th>";
    });
    result += "</tr><tbody>";
    $(_filter_rows_for_html(rows())).each(function() {
        result += "<tr>";
        var cols = row_content_to_export(this, columns_to_export); 
        cols.each(function() {
            result += "<td>"+_sanitize(this)+"</td>";
        });
        result += "</tr>";
    });
    result += "</tbody></table><body></html>";
    return result;
}

var CSV_SEPARATOR = ",";
function _generate_csv_header(columns) {
    var result = "";
    column_titles(columns).each(function(index) {
        result += this + (index < columns.length-1 ? CSV_SEPARATOR : "\n");
    });
    return result;
}
function get_content_as_csv(filter_columns) {
    var result = "";
    var columns_to_export = column_names(filter_columns);
    result += _generate_csv_header(columns_to_export);
    var provinces = rows();
    $(provinces).each(function() {
        var cols = row_content_to_export(this, columns_to_export);
        cols.each(function(column) {
            result += this + (column < cols.length-1 ? CSV_SEPARATOR : "\n");
        });
    });
    return result;
}

var EXTRACTORS = {"html":get_content_as_html, "csv":get_content_as_csv};
function get_content(type, columns) {
    var uriContent = "data:application/binary," + encodeURIComponent(EXTRACTORS[type](columns));
    return uriContent;
}

