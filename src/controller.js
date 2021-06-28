/*===========================*/
/*===== Bracket Logic =======*/
/*===========================*/
let E = new EntriesList(); // Entries
let B; // Bracket
let EntryListElement;
let BracketElement;


// Entries
function addEntry() {
    let entryName = getEntryName();
    if (E.isValidEntry(entryName)){
        // Add entry to Entries object
        E.addEntry(new Entry(entryName));
        
        // Add newEntryElement to EntryListElement
        addEntryElement(entryName); 
        
        // Reset the input field
        document.getElementById(ID_ENTRY_NAME).value = "";
    }
    else{
        alert("invalid entry name - '" + entryName + "'");
    }
}
function addEntryElement(entryName) {
    function addDeleteButtonToNewEntry(newEntryElement) {
        let button = document.createElement("img");
        button.src = IMG_DELETE;
        button.className = CLASS_ENTRYLIST_DELETEBTN;
        button.setAttribute('onclick', "deleteEntry(this.parentNode)");
        button.setAttribute("alt", "delete entry button");
        newEntryElement.appendChild(button);
    }

    // Create newEntryElement
    let newEntryElement = document.createElement("div");
    newEntryElement.className = CLASS_ENTRY;

    // Add name to newEntryElement
    let newEntryElementName = document.createElement("div");
    newEntryElementName.innerText = entryName;
    newEntryElementName.className = CLASS_ENTRYLIST_ENTRYNAME + " " + CLASS_VERDANA_GRAY;
    newEntryElement.appendChild(newEntryElementName);
    
    // Add delete button to newEntryElement
    addDeleteButtonToNewEntry(newEntryElement);
    
    // Add newEntryElement to EntryListElement
    EntryListElement.appendChild(newEntryElement);
}

function deleteEntry(entryElement) {
    // remove this entry from Entries
    E.removeEntry(entryElement.innerText);

    // remove the entryElement from the document
    entryElement.remove();
}

// Bracket
function makeBracket() {
    let el = E.Entries.length;
    if (el == 0) {
        alert("no entries added");
    }
    else if (el == 1) {
        alert("only one entry added: '" + E.Entries[0].Name + "'");
    }
    else{
        // Making the Bracket takes care of filling the initial grid with BYEs and TBDs
        B = new Bracket(E.Entries);
    }
}

function advanceBracketEntry(entryName) {
    return;
}

function revertBracketEntry(entryName) {
    return;
}