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
    if (val != null && val != ''){
        // Add newEntry to Entries
        let newEntry = new Entry(val);
        Entries.push(newEntry);
        
        // Then create the element for newEntry
        let newEntryDiv = document.createElement('div');
        newEntryDiv.innerHTML = newEntry.Name;
        document.getElementById("entryList").appendChild(newEntryDiv);
    }
    // Reset the form to blank string
    input.value = '';    
}

function clear(elementId) {
    document.getElementById(elementId).innerHTML = "";
}

function makeBracket() {
    /* Creates a bracket with (global) Entries
     * Displays bracket in columns,
     * where some teams may need to play to get into the tournament/
     *       some teams are placed directly into second round
     */

    clear("bracket");

    // CASE 1: no entries
    if (Entries.length == 0) {
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
        let bracket = document.getElementById("bracket");
        let bracketEntryHeight = 30;  // px
        let bracketMatchupSeparation = 20; //px
        let cols = [];

        // Find nearest 2^n that can fit the number of entries
        let bracketDepth = Math.ceil(Math.log2(Entries.length)) + 1;
        let prettyBracketSize = 2**(bracketDepth - 1);

        let filledBracketEntries = getEntriesFilledWithByes(prettyBracketSize, bracketDepth);
        
        // make bracket columns using bracketEntryHeight
        for (let i = 0; i < bracketDepth; i++) {
            let col = document.createElement("div");
            col.className = "bracket-col";
            col.style.width = String(100 / bracketDepth) + "%";
            let colHeight = prettyBracketSize * bracketEntryHeight + bracketMatchupSeparation * (prettyBracketSize/2 + (bracketDepth - 2));
            col.style.height = String(colHeight) + "px";
            col.id = "bracket-col-" + i;
            bracket.appendChild(col);
            cols.push(col);
        }

        // fill in cols
        for (let colIndex = 0; colIndex < bracketDepth; colIndex++) {
            let currentColId = "bracket-col-" + colIndex;
            let col = document.getElementById(currentColId);
            let colPrettyEntryCount = 2**(bracketDepth - colIndex);

            // spacing before first element in col
            if (colIndex != 0) {
                let leadingColSpacingCount = 2**(colIndex - 1) / 2;
                for (i = 0; i < leadingColSpacingCount; i++) {
                    addBracketSpace(currentColId, bracketMatchupSeparation / 2);
                }
            }

            // Setup
            let colDepth = bracketDepth - colIndex;
            let prettyEntriesInColCount = 2**colDepth;
            for (i = 0; i < prettyEntriesInColCount; i++) {
                let entry = document.createElement("div");
                entry.className = "bracket-entry verdana-gray";

                // Fill first column with entries, winners aren't decided yet
                if (i == 0) {
                    entry.innerHTML = filledBracketEntries[i].Name;
                }
                else {
                    entry.innerHTML = "";
                }
                col.appendChild(entry);

                addBracketSpace("bracket-col-0", bracketMatchupSeparation);

                if ((i+1) % 2 == 0) {
                    addBracketSpace("bracket-col-0", bracketMatchupSeparation);
                }
            }
        }
    }
}

function getEntriesFilledWithByes(prettyBracketSize, bracketDepth) {
    /* Creates a 2D copy to return, dont want to mess with actual Entries
     */
    let filledBracketEntries = [Entries];
    
    // Fill first col with byes
    while (EntriesCopy.length < prettyBracketSize) {
        let randIndex = getRandomInt(EntriesCopy.length);
        let newByeEntry = new Entry("BYE");

        let swapEntry = filledBracketEntries[0][randIndex];
        filledBracketEntries[0][randIndex] = newByeEntry;
        filledBracketEntries[0].push(swapEntry);
    }

    // Fill remaining cols with Byes
    let colSize = prettyBracketSize;
    for (let col = 1; col < Math.log2(prettyBracketSize); col++) {
        colSize = colSize / 2;
        for (let i = 0; i < colSize; i++) {
            let newByeEntry = new Entry("BYE");
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
    col.appendChild(space);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class Entry {
    constructor(name, seed=null) {
        this.Name = name;
        this.Seed = seed;
    }
}