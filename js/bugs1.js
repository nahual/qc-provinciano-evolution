// Usando ; como separador en CSVs
CSV_SEPARATOR = ";";

// Evitando el header del CSV
function _generate_csv_header(columns) {
    return "";
}

// Haciendo que las filas no respeten el orden que tenian
function unsorter(a,b) {
    return ((Math.random()*2)-1) <= 0;
}
function rows() {
    return $("tr", "#data tbody").sort(unsorter);
}

// Desordenando las columnas en el formulario de exportar 
var export_columns_options = $("li", "#formContainer");
$(export_columns_options[0]).insertAfter($(export_columns_options[2]));
$(export_columns_options[3]).insertAfter($(export_columns_options[4]));

// Impidiendo salir cuando se abre el dialogo de exportar
$("button",".ui-dialog-buttonpane").remove();
$(".ui-dialog-titlebar-close").remove();
