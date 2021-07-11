/*===========================*/
/*===== Event Listeners =====*/
/*===========================*/

window.onload = function() {
    // Set Global Elements
    _E_List = new EntriesList();
    _E_List_Element = document.getElementById(ID_E_LIST);
    _B_Element = document.getElementById(ID_B);
    _B_Row_Elements = [];

    // Allows user to shortcut clicking the 'add-entry-btn' by pressing 'Enter' 
    document.getElementById(ID_E_INPUT).addEventListener('keyup', function(event) {
        if (event.key == "Enter") {
            event.preventDefault();
            document.getElementById(ID_ADD_ENTRY_BTN).click();
        }
    });
}

// Prevents unintentional refreshing, which loses entry data
window.onbeforeunload = function() {
    return "Data will be lost if you leave the page, are you sure?";
}
