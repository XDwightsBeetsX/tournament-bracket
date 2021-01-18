/*===========================*/
/*======== Globals ==========*/
/*===========================*/
var Entries = [];
var FilledBracketEntries = [];
var BYE = "BYE";
var TBD = "TBD";
var InvalidEntryNames = ["", BYE, TBD];

// IDS FOLLOW NAMING SCHEME:
// left pane        bracket
// entry-Name       bracket-col-#-row-#-entry-Name
var LeftPaneNamePrefix = "entry-";
var BracketColPrefix = "bracket-col-";
var BracketRowPrefix = "bracket-col-#-row-";
var BracketNamePrefix = "bracket-col-#-row-#-entry-";


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
        Entries.push(newEntry);
        
        let newEntryDiv = document.createElement('div');
        newEntryDiv.innerHTML = newEntry.Name;
        newEntryDiv.id = LeftPaneNamePrefix + newEntry.Name;

        addDeleteButtonToNewEntry(newEntryDiv);

        document.getElementById("entryList").appendChild(newEntryDiv);
    }
    // Reset the form to blank string
    input.value = '';    
}

function isValidEntry(newEntry) {
    if (newEntry.Name == undefined) {
        return false;
    }

    let newEntryName = newEntry.Name;
    for (let i = 0; i < InvalidEntryNames.length; i++) {
        if (newEntryName == InvalidEntryNames[i]) {
            return false;
        }
    }
    return true;
}

function isEntryUnique(newEntry) {
    for (let i = 0; i < Entries.length; i++) {
        if (Entries[i].Name == newEntry.Name) {
            return false;
        }
    }
    return true;
}

function getEntryIndex(EntryName) {
    /* Returns the index of the Entry in Entries
     * If not found, returns null
     */
    for (let i = 0; i < Entries.length; i++) {
        if (Entries[i].Name == EntryName) {
            return i;
        }
    }
    return null;
}

function addDeleteButtonToNewEntry(newEntryDiv) {
    /* Creates a child "img" element to hold the delete .png
     * adds the onclick method removeEntry(this)
     */
    let entryDeleteButton = document.createElement("img");
    entryDeleteButton.src = "img/button-x.png";
    entryDeleteButton.style.height = 100 + "%";
    entryDeleteButton.style.width = "auto";
    entryDeleteButton.style.float = "right";
    entryDeleteButton.className = "pointer";
    entryDeleteButton.setAttribute('onclick', "deleteEntry(this.parentNode.id)");
    entryDeleteButton.setAttribute("alt", "delete entry");
    newEntryDiv.appendChild(entryDeleteButton);
}

function deleteEntry(EntryDivId) {
    // remove from html document
    let parent = document.getElementById(EntryDivId);
    parent.remove();

    // remove from entries
    // first "entryName-" prefix to find Entry.Name
    let entryToRemoveName = EntryDivId.slice(LeftPaneNamePrefix.length);
    let entryToRemoveIndex = getEntryIndex(entryToRemoveName);
    if (entryToRemoveIndex != null) {
        Entries.splice(entryToRemoveIndex, 1);
    }
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

        // Set a (global) 2D Array of Entries filled in with BYEs and TBDs
        FilledBracketEntries = getEntriesFilledWithByes(prettyBracketSize);
        
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
            let colEntries = FilledBracketEntries[colIndex];
            for (i = 0; i < colEntries.length; i++) {
                let entry = document.createElement("div");
                let entryName = colEntries[i].Name;
                entry.className = "bracket-entry verdana-gray";
                entry.id = BracketColPrefix + colIndex + "-row-" + i + "-entry-" + entryName;
                entry.innerHTML = entryName;
                
                if (entryName != BYE && entryName != TBD) {
                    addAdvanceArrowToDiv(entry);
                }
                
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
        let newByeEntry = new Entry(BYE);
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

function addAdvanceArrowToDiv(EntryDiv) {
    /* Creates a child "img" element to hold the delete .png
     * adds the onclick method removeEntry(this)
     */
    let advanceButton = document.createElement("img");
    advanceButton.src = "img/button-arrow-right.png";
    advanceButton.style.height = 100 + "%";
    advanceButton.style.width = "auto";
    advanceButton.style.float = "right";
    advanceButton.className = "pointer";
    advanceButton.setAttribute('onclick', "advanceThisEntry(this.parentNode.id)");
    advanceButton.setAttribute("alt", "advance entry");
    EntryDiv.appendChild(advanceButton);
}

function removeAdvanceArrowFromDiv(EntryDiv) {
    /* Assumes the firstElementChild of EntryDiv is the advance arrow
     */
    let advanceArrowImg = EntryDiv.firstElementChild;
    EntryDiv.removeChild(advanceArrowImg);
}

function advanceThisEntry(entryDivId) {
    // find the place where the advanced entry goes
    let currColIndex = parseInt(entryDivId.slice(BracketColPrefix.length));
    let currColRow = parseInt(entryDivId.slice(BracketRowPrefix.length));
    let advanceIndexInNextCol = Math.ceil((currColRow + 1) / 2) - 1;

    // get the elements at the new index
    let entryToAdvanceDiv = document.getElementById(entryDivId);
    let nextColIndex = currColIndex + 1;
    let entryToReplaceName = FilledBracketEntries[nextColIndex][advanceIndexInNextCol].Name;
    let entryIdToReplace = BracketColPrefix + nextColIndex + "-row-" + advanceIndexInNextCol + "-entry-" + entryToReplaceName;
    let replaceWithEntryToAdvance = document.getElementById(entryIdToReplace);

    // Change the content of the next round winner to the advanced div
    // this takes care of adding the advance arrow
    replaceWithEntryToAdvance.innerHTML = entryToAdvanceDiv.innerHTML;

    // Remove the "advance" arrow from winners place in lower bracket
    removeAdvanceArrowFromDiv(entryToAdvanceDiv);

    // Remove "advance" arrow from loser of matchup
    let matchupLoserRow = currColRow;
    if (matchupLoserRow % 2 == 0) {
        matchupLoserRow += 1;
    }
    else {
        matchupLoserRow -= 1;
    }
    let matchupLoserName = FilledBracketEntries[currColIndex][matchupLoserRow].Name;
    if (matchupLoserName != BYE && matchupLoserName != TBD) {
        let matchupLoserId = BracketColPrefix + currColIndex + "-row-" + matchupLoserRow + "-entry-" + matchupLoserName;
        let matchupLoser = document.getElementById(matchupLoserId);
        removeAdvanceArrowFromDiv(matchupLoser);
    }
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