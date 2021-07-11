/*===========================*/
/*====== HTML -> JS =========*/
/*===========================*/

// Entries
function addEntry() {
    function isValidEntry(entryName) {
        if (INVALID_ENTRY_NAMES.includes(entryName)){
            return false;
        }
        for (let i = 0; i < _E_List.Entries.length; i++){
            if (_E_List.Entries[i].Name == entryName){
                return false;
            }
        }
        return true;
    }

    let entryName = document.getElementById(ID_E_INPUT).value;
    if (isValidEntry(entryName)){
        // Add entry to Entries object
        _E_List.addEntry(new Entry(entryName));
        
        // Reset the input field
        document.getElementById(ID_E_INPUT).value = "";
    }
    else{
        alert("invalid entry name - '" + entryName + "'");
    }
}

function deleteEntry(entryElement) {
    // remove this entry from Entries
    _E_List.removeEntry(entryElement);
}

// Bracket
function makeBracket() {
    let el = _E_List.Entries.length;
    if (el == 0) {
        alert("no entries added");
    }
    else if (el == 1) {
        alert("only one entry added: '" + _E_List.Entries[0].Name + "'");
    }
    else{
        // Clear the old bracket
        _B_Element.innerText = "";
        _B_Row_Elements = [];

        // Making the Bracket takes care of filling the initial BYEs and TBDs
        // also takes care of offsetting the DOM TBDs
        _B = null;
        _B = new Bracket(_E_List.Entries);
    }
}

function advanceRowEntry(thisBracketRow) {
    _B.advanceRowEntry(thisBracketRow);
}

function revertRowEntry(thisBracketRow) {
    _B.revertRowEntry(thisBracketRow);
}
