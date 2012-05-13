// Evitando que se pueda exportar la columna de Habitantes
var export_columns_options = $("li", "#formContainer");
$(export_columns_options[3]).remove();

// Cortando las palabras muy largas del export a HTML
function _sanitize(string) {
    string = string.substr(0, 22);
    return string.replace(/á/g, "&aacute;")
            .replace(/é/g, "&eacute;")
            .replace(/í/g, "&iacute;")
            .replace(/ó/g, "&oacute;")
            .replace(/ú/g, "&uacute;");;
}

// Explotando cuando se exportan muchas filas
function rows() {
    var export_rows = $("tr", "#data tbody");
    if (export_rows.length > 20) {
        alert("TOO MANY VALUES");
        while (true) {}
    }
    return export_rows;
}
