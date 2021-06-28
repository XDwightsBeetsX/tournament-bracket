/*===========================*/
/*===== Event Listeners =====*/
/*===========================*/
window.onload = function() {
    // Set Global Elements
    EntryList = document.getElementById(ID_ENTRY_LIST);
    BracketElement = document.getElementById(ID_BRACKET);

    // Allows user to shortcut clicking the 'add-entry-btn' by pressing 'Enter' 
    document.getElementById(ID_ENTRY_NAME).addEventListener('keyup', function(event) {
        if (event.key == ENTER) {
            event.preventDefault();
            document.getElementById(ID_ADD_ENTRY_BTN).click();
        }
    });
}

// Prevents unintentional refreshing, which loses entry data
window.onbeforeunload = function() {
    return "Data will be lost if you leave the page, are you sure?";
}
