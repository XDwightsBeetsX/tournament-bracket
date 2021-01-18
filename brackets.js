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
        
        let newEntryElement = document.createElement('div');
        newEntryElement.innerHTML = newEntry.Name;
        newEntryElement.id = LeftPaneNamePrefix + newEntry.Name;

        addDeleteButtonToNewEntry(newEntryElement);

        document.getElementById("entryList").appendChild(newEntryElement);
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

function addDeleteButtonToNewEntry(newEntryElement) {
    /* Creates a child "img" element to hold the delete .png
     * adds the onclick method removeEntry(this)
     */
    let entryDeleteButton = document.createElement("img");
    entryDeleteButton.src = "img/button-x.png";
    entryDeleteButton.style.height = 100 + "%";
    entryDeleteButton.style.width = "auto";
    entryDeleteButton.style.float = "right";
    entryDeleteButton.className = "pointer";
    entryDeleteButton.setAttribute('onclick', "deleteEntry(this.parentNode)");
    entryDeleteButton.setAttribute("alt", "delete entry");
    newEntryElement.appendChild(entryDeleteButton);
}

function deleteEntry(EntryElement) {
    // remove from html document
    EntryElement.remove();

    // remove from entries
    // first "entryName-" prefix to find Entry.Name
    let entryToRemoveName = EntryElement.id.slice(LeftPaneNamePrefix.length);
    let entryToRemoveIndex = getEntryIndex(entryToRemoveName);
    if (entryToRemoveIndex != null) {
        Entries.splice(entryToRemoveIndex, 1);
    }
}

function clear(element) {
    element.innerHTML = "";
}

function makeBracket() {
    /* Creates a bracket with list of Entries
     * Displays bracket in columns,
     * where some teams may recieve a 'bye' into the next round
     */

    let bracketElement = document.getElementById("bracket");

    // CASE 1: no entries
    if (Entries.length == 0) {
        clear(bracketElement);

        // Bracket wrapper for single entry
        let singleEntryDiv = document.createElement('div');
        singleEntryDiv.className = "single-entry";
        singleEntryDiv.style.textAlign = "center";
        bracketElement.appendChild(singleEntryDiv);

        // Add descriptive entry
        let entryDiv = document.createElement('div');
        entryDiv.innerHTML = "No Entries Found";
        entryDiv.className = "bracket-entry";
        entryDiv.style.display = "inline";
        singleEntryDiv.appendChild(entryDiv);
    }
    // CASE 2: one entry
    else if (Entries.length == 1) {
        clear(bracketElement);

        // Bracket wrapper for single entry
        let singleEntryDiv = document.createElement("div");
        singleEntryDiv.className = "single-entry";
        singleEntryDiv.style.textAlign = "center";
        bracketElement.appendChild(singleEntryDiv);

        // Add descriptive entry
        let entryDiv = document.createElement("div");
        entryDiv.innerHTML = "One Entry: " + Entries[0].Name;
        entryDiv.className = "bracket-entry";
        entryDiv.style.display = "inline";
        singleEntryDiv.appendChild(entryDiv);
    }
    // CASE 3: 2+ entries, typical
    else {
        clear(bracketElement);
        let bracketEntryHeight = 30;  // px

        // Find nearest 2^n that can fit the number of entries
        let bracketDepth = Math.ceil(Math.log2(Entries.length)) + 1;
        let prettyBracketSize = 2**(bracketDepth - 1);

        // Set a (global) 2D Array of Entries filled in with BYEs and TBDs
        FilledBracketEntries = getFilledBracketEntries(prettyBracketSize);
        
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
            bracketElement.appendChild(col);

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
                    addAdvanceArrowToEntryElement(entry);
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

        // Check if any teams have first round BYEs and advance them
        advanceAnyByes();
    }
}

function advanceAnyByes() {
    /* Called immediately after bracket creation to
     * move forward any teams that may have first round BYEs
     */
    let firstRoundEntries = FilledBracketEntries[0];
    for (let i = 0; i < firstRoundEntries.length; i+=2) {
        let matchupTopName = FilledBracketEntries[0][i].Name;
        let matchupBottomName = FilledBracketEntries[0][i+1].Name;
        if (matchupTopName == BYE) {
            let entryToAdvanceId = BracketColPrefix + 0 + "-row-" + (i+1) + "-entry-" + matchupBottomName;
            let entryToAdvanceElement = document.getElementById(entryToAdvanceId);
            advanceThisEntry(entryToAdvanceElement);
        }
        else if (matchupBottomName == BYE) {
            let entryToAdvanceId = BracketColPrefix + 0 + "-row-" + i + "-entry-" + matchupTopName;
            let entryToAdvanceElement = document.getElementById(entryToAdvanceId);
            advanceThisEntry(entryToAdvanceElement);
        }
    }
}

function getFilledBracketEntries(prettyBracketSize) {
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

function addAdvanceArrowToEntryElement(EntryElement) {
    /* Creates a child "img" element to hold the delete .png
     * adds the onclick method removeEntry(this)
     */
    let advanceButton = document.createElement("img");
    advanceButton.src = "img/button-arrow-right.png";
    advanceButton.style.height = 100 + "%";
    advanceButton.style.width = "auto";
    advanceButton.style.float = "right";
    advanceButton.className = "pointer";
    advanceButton.setAttribute('onclick', "advanceThisEntry(this.parentNode)");
    advanceButton.setAttribute("alt", "advance entry");
    EntryElement.appendChild(advanceButton);
}

function removeAdvanceArrowFromEntryElement(EntryElement) {
    /* Assumes the firstElementChild of EntryDiv is the advance arrow
     */
    let advanceArrowImg = EntryElement.firstElementChild;
    EntryElement.removeChild(advanceArrowImg);
}

function advanceThisEntry(entryElement) {
    // find the entry and the advance location
    let currColIndex = parseInt(entryElement.id.slice(BracketColPrefix.length));
    let currColRow = parseInt(entryElement.id.slice(BracketRowPrefix.length));
    let entryToAdvance = FilledBracketEntries[currColIndex][currColRow];
    let advanceIndexInNextCol = Math.ceil((currColRow + 1) / 2) - 1;

    // get the elements at the new index
    let entryToAdvanceElement = document.getElementById(entryElement.id);
    let nextColIndex = currColIndex + 1;
    let entryToReplaceName = FilledBracketEntries[nextColIndex][advanceIndexInNextCol].Name;
    let entryToReplaceId = BracketColPrefix + nextColIndex + "-row-" + advanceIndexInNextCol + "-entry-" + entryToReplaceName;

    // Update FilledBracketEntries
    FilledBracketEntries[nextColIndex][advanceIndexInNextCol] = entryToAdvance;

    // Change the content of the next round winner to the advanced div
    // this takes care of adding the advance arrow
    let replaceWithEntryToAdvance = document.getElementById(entryToReplaceId);
    replaceWithEntryToAdvance.innerHTML = entryToAdvanceElement.innerHTML;
    let entryName = FilledBracketEntries[currColIndex][currColRow].Name;
    let updatedEntryId = BracketColPrefix + nextColIndex + "-row-" + advanceIndexInNextCol + "-entry-" + entryName;
    replaceWithEntryToAdvance.id = updatedEntryId;

    // Remove "advance" arrow from winner of matchup
    removeAdvanceArrowFromEntryElement(entryToAdvanceElement);

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
        removeAdvanceArrowFromEntryElement(matchupLoser);
    }

    // Remove "advance" arrow from winner of entire bracket
    if (nextColIndex == FilledBracketEntries.length - 1) {
        let winnerName = FilledBracketEntries[nextColIndex][0].Name;
        let winnerId = BracketColPrefix + nextColIndex + "-row-" + 0 + "-entry-" + winnerName;
        let winnerEntryElement = document.getElementById(winnerId);
        removeAdvanceArrowFromEntryElement(winnerEntryElement);
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