// Evitando el header del CSV
function _generate_csv_header(columns) {
    return "";
}

// Perdiendo algunas filas para el html
function _filter_rows_for_html(rows) {
    return $(rows).slice(0,-1);
}

// Desordenando las columnas en el formulario de exportar 
var export_columns_options = $("li", "#formContainer");
$(export_columns_options[0]).insertAfter($(export_columns_options[2]));
$(export_columns_options[3]).insertAfter($(export_columns_options[4]));
