/*===========================*/
/*======== Globals ==========*/
/*===========================*/
var Entries = [];


/*===========================*/
/*===== Window Loading ======*/
/*===========================*/
window.onload = function() {
    // Sets up Globals and Event Listeners
    listenForEntry();
    Entries = [];
}

window.onbeforeunload = function() {
    // Prevents unintentional refreshing, which loses data
    Entries = [];
    return "Data will be lost if you leave the page, are you sure?";
};


/*===========================*/
/*===== Event Listeners =====*/
/*===========================*/
function listenForEntry() {
    // Allows user to shortcut clicking the button by pressing 'Enter' 
    let input = document.getElementById('entry');
    input.addEventListener('keyup', function(event) {
        if (event.code === 'Enter') {
            event.preventDefault();
            let submitButton = document.getElementById('btn-entry-submit');
            submitButton.click();
        }
    });
}


/*===========================*/
/*========= Dynamic =========*/
/*===========================*/
function newEntry() {
    /* Reads in new entry and resets the input box
     */
    let input = document.getElementById("entry");
    let val = input.value;
    let newEntry = new Entry(val);
    
    if (!isValidEntry(newEntry)){
        alert("Entry: '" + newEntry.Name + "' is invalid.");
        delete newEntry;
    }
    else if (!isEntryUnique(newEntry)) {
        alert("Entry '" + newEntry.Name + "' has already been added.");
        delete newEntry;
    }
    else {
        // Add newEntry to Entries
        Entries.push(newEntry);
        
        // Then create the element for newEntry
        let newEntryDiv = document.createElement('div');
        newEntryDiv.innerHTML = newEntry.Name;
        document.getElementById("entryList").appendChild(newEntryDiv);
    }
    // Reset the form to blank string
    input.value = '';    
}

function isValidEntry(newEntry) {
    let flag = true;
    if (newEntry.Name == '' || newEntry.Name == undefined) {
        flag = false;
    }
    return flag;
}

function isEntryUnique(newEntry) {
    for (let i = 0; i < Entries.length; i++) {
        if (Entries[i].Name == newEntry.Name) {
            return false;
        }
    }
    return true;
}

function clear(elementId) {
    document.getElementById(elementId).innerHTML = "";
}

function makeBracket() {
    /* Creates a bracket with list of Entries
     * Displays bracket in columns,
     * where some teams may recieve a 'bye' into the next round
     */

    // CASE 1: no entries
    if (Entries.length == 0) {
        clear("bracket");
        let bracket =  document.getElementById('bracket');

        // Bracket wrapper for single entry
        let singleEntryDiv = document.createElement('div');
        singleEntryDiv.className = "single-entry";
        singleEntryDiv.style.textAlign = "center";
        bracket.appendChild(singleEntryDiv);

        // Add descriptive entry
        let entryDiv = document.createElement('div');
        entryDiv.innerHTML = "No Entries Found";
        entryDiv.className = "bracket-entry";
        entryDiv.style.display = "inline";
        singleEntryDiv.appendChild(entryDiv);
    }
    // CASE 2: one entry
    else if (Entries.length == 1) {
        clear("bracket");
        let bracket =  document.getElementById("bracket");

        // Bracket wrapper for single entry
        let singleEntryDiv = document.createElement("div");
        singleEntryDiv.className = "single-entry";
        singleEntryDiv.style.textAlign = "center";
        bracket.appendChild(singleEntryDiv);

        // Add descriptive entry
        let entryDiv = document.createElement("div");
        entryDiv.innerHTML = "One Entry: " + Entries[0].Name;
        entryDiv.className = "bracket-entry";
        entryDiv.style.display = "inline";
        singleEntryDiv.appendChild(entryDiv);
    }
    // CASE 3: 2+ entries, typical
    else {
        clear("bracket");
        let bracket = document.getElementById("bracket");
        let bracketEntryHeight = 30;  // px

        // Find nearest 2^n that can fit the number of entries
        let bracketDepth = Math.ceil(Math.log2(Entries.length)) + 1;
        let prettyBracketSize = 2**(bracketDepth - 1);

        // 2D Array of Entries filled in with BYEs and TBDs
        let filledBracketEntries = getEntriesFilledWithByes(prettyBracketSize);
        
        // Make columns and add entries to each column
        for (let colIndex = 0; colIndex < bracketDepth; colIndex++) {
            // Make col
            let col = document.createElement("div");
            let colHeight = bracketEntryHeight * (2**bracketDepth - 1);
            let colId = "bracket-col-" + colIndex;
            col.className = "bracket-col";
            col.style.width = 100 / bracketDepth + "%";
            col.style.height = colHeight + "px";
            col.id = colId;
            bracket.appendChild(col);

            // Add leading spacing before first element in col
            if (colIndex != 0) {
                let leadingSpaceCount = 2**colIndex - 1;
                for (let i = 0; i < leadingSpaceCount; i++) {
                    addBracketSpace(colId, bracketEntryHeight);
                }
            }

            // Add entries
            let colEntries = filledBracketEntries[colIndex];
            for (i = 0; i < colEntries.length; i++) {
                let entry = document.createElement("div");
                entry.className = "bracket-entry verdana-gray";
                entry.innerHTML = colEntries[i].Name;
                col.appendChild(entry);

                // Add inter-Entry spacing
                if (i != colEntries.length - 1) {
                    let interEntrySpaceCount = 2**(colIndex + 1) - 1;
                    for (let i = 0; i < interEntrySpaceCount; i++) {
                        addBracketSpace(colId, bracketEntryHeight);
                    }
                } 
            }

            // Add leading spacing before first element in col
            if (colIndex != 0) {
                let trailingSpaceCount = 2**colIndex - 1;
                for (let i = 0; i < trailingSpaceCount; i++) {
                    addBracketSpace(colId, bracketEntryHeight);
                }
            }
        }
    }
}

function getEntriesFilledWithByes(prettyBracketSize) {
    /* Creates a 2D copy to return, dont want to mess with actual Entries
     */
    let filledBracketEntries = [deepCopy(Entries)];
    let newByeEntryCount = prettyBracketSize - filledBracketEntries[0].length;
    
    // Fill first col with byes
    for (let i = 0; i < newByeEntryCount; i++) {        
        let newByeEntry = new Entry("BYE");
        filledBracketEntries[0].push(newByeEntry);
    }

    // Swap out byes to make bracket fair
    let lowI = 1;
    let highI = prettyBracketSize - 1;
    while (lowI < highI) {
        let swapEntry = filledBracketEntries[0][lowI];
        filledBracketEntries[0][lowI] = filledBracketEntries[0][highI];
        filledBracketEntries[0][highI] = swapEntry;

        lowI += 2;
        highI -= 2;
    }

    // Fill remaining cols with TBDs
    let colSize = prettyBracketSize;
    for (let col = 1; col <= Math.log2(prettyBracketSize); col++) {
        colSize = colSize / 2;
        filledBracketEntries[col] = [];
        for (let i = 0; i < colSize; i++) {
            let newByeEntry = new Entry("TBD");
            filledBracketEntries[col].push(newByeEntry);
        }
    }

    return filledBracketEntries;
}

function addBracketSpace(colId, spacePx) {
    let col = document.getElementById(colId);
    let space = document.createElement("div");
    space.className = "bracket-matchup-separator";
    space.style.height = spacePx + "px";
    space.style.width = 100 + "%";
    col.appendChild(space);
}

function deepCopy(array) {
    let copyArr = [];
    for (let i = 0; i < array.length; i++) {
        copyArr.push(array[i]);
    }

    return copyArr;
}

class Entry {
    constructor(name, seed=null) {
        this.Name = name;
        this.Seed = seed;
    }
}