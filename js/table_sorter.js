var current_sort;

$(document).ready(function(){
    $("th.sortable").each(function(){
        $("<a href='' class='sorter' field='"+$(this).attr('name')+"' direction='asc' type='"+$(this).attr('type')+"' onclick='return sort_table($(this))'>&uArr;</a>").appendTo(this);
        $("<a href='' class='sorter' field='"+$(this).attr('name')+"' direction='desc' type='"+$(this).attr('type')+"' onclick='return sort_table($(this))'>&dArr;</a>").appendTo(this);
    });
});

var COLUMN_TYPE_PROPERTIES = {
    "string" : {
                "converter" : function(element) {
                    return element.text().toLowerCase();
                },
                "comparator" : function(a,b) {
                    return a.localeCompare(b);
                }
    },
    "int" : {
                "converter" : function(element) {
                    return parseInt(element.text().replace(/\./g,'')); // FIXME locale dependant
                },
                "comparator" : function(a,b) {
                    return a - b;
                }
    }
}

function update_sort_links() {
    $('a.sorter').each(function(){
        $(this).removeClass('active_sort');
    });
    var current = $('a.sorter[field='+current_sort.attr('field')+'][direction='+current_sort.attr('direction')+']');
    $(current).addClass('active_sort');
}

function update_current_sort(sort_data) {
    if (!current_sort || current_sort.attr('field') != sort_data.attr('field') || current_sort.attr('direction') != sort_data.attr('direction')) {
        current_sort = sort_data;
        update_sort_links();
        return true;
    }
    return false;
}

function sort_keys(sortables, comparator, order) {
    var sorted = sortables.sort(function(a,b) {
        return comparator(a.value,b.value);
    });
    if (order == 'desc') {
        sorted = sorted.reverse();
    }
    return $(sorted).map(function() {
        return this.key;
    });
}

function _generate_key_extractor(table) {
    var key_columns = $('thead', table).attr('key_columns').split(',');
    return function(tr) {
        var key = '';
        $(key_columns).each(function(index) {
            key += $('td[name='+this+']',tr).text() + (index < key_columns.length-1 ? '-' : '');
        });
        return key;
    };
}

function sort_table(sort_data) {
    var has_sort_data = sort_data ? true : false;
    sort_data = sort_data || current_sort;
    if (sort_data && (update_current_sort($(sort_data)) || !has_sort_data)) {
        var table = $(sort_data).parents("table");

        var converter = COLUMN_TYPE_PROPERTIES[sort_data.attr('type')].converter;
        var comparator = COLUMN_TYPE_PROPERTIES[sort_data.attr('type')].comparator; 
        var key_extractor = _generate_key_extractor(table);
        var selector = 'td[name='+sort_data.attr('field')+']';

        var table_content = {};
        var sortables = [];
        $("tbody tr", table).each(function() {
            var key = key_extractor(this);
            table_content[key] = this;
            var sortable_value = converter($(selector, this));
            sortables.push({'key':key, 'value':sortable_value});
        });
        var sorted_keys = sort_keys(sortables, comparator, sort_data.attr('direction'));

        $('tbody', table).empty();
        $(sorted_keys).each(function() {
            $(table_content[this]).appendTo(table);
        });
    }
    return false;
}

/** FIXME: Codigo deprecado de insert_sorted :(
function insert_sorted(table, row) {
    var rows = $('tbody tr', table); 
    if (rows.length == 0) {
        $(row).appendTo('tbody', table);
        return;
    }
    var selector = 'td[name='+current_sort.field+']';
    var value_to_insert = $(selector, row).text();
    var comparator = COMPARATORS[current_sort.direction];
    
    var position;
    $(rows).each(function() {
        if (comparator($(selector, this).text(), value_to_insert)) {
            position = position ? position + 1 : 1;
        } else {
            return false;
        }
    });
    if (position) {
        var before_row = $(rows)[position-1];
        $(row).insertAfter(before_row);
    } else {
        var first_row = $(rows)[0];
        $(row).insertBefore(first_row);
    }
}
**/
