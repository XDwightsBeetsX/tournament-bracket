/*===========================*/
/*====== HTML -> JS =========*/
/*===========================*/
_EntriesList = new EntriesList();

// Entries
function addEntry() {
    function isValidEntry(entryName) {
        if (INVALID_ENTRY_NAMES.includes(entryName)){
            return false;
        }
        for (let i = 0; i < _EntriesList.Entries.length; i++){
            if (_EntriesList.Entries[i].Name == entryName){
                return false;
            }
        }
        return true;
    }

    let entryName = getEntryName();
    if (isValidEntry(entryName)){
        // Add entry to Entries object
        _EntriesList.addEntry(new Entry(entryName));
        
        // Reset the input field
        document.getElementById(ID_ENTRY_NAME).value = "";
    }
    else{
        alert("invalid entry name - '" + entryName + "'");
    }
}

function deleteEntry(entryElement) {
    // remove this entry from Entries
    _EntriesList.removeEntry(entryElement);
}

// Bracket
function makeBracket() {
    let el = _EntriesList.Entries.length;
    if (el == 0) {
        alert("no entries added");
    }
    else if (el == 1) {
        alert("only one entry added: '" + _EntriesList.Entries[0].Name + "'");
    }
    else{
        // Making the Bracket takes care of filling the initial BYEs and TBDs
        _Bracket = new Bracket(_EntriesList.Entries);
    }
}

function advanceBracketEntry(entryElement) {
    return;
}

function revertBracketEntry(entryElement) {
    return;
}
