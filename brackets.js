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
    // Reads in new entry and resets the input box
    let input = document.getElementById("entry");
    let val = input.value;
    if (val != null && val != ''){
        let newEntry = new Entry(val);
        addEntryToList(newEntry);
    }
    input.value = '';    
}

function addEntryToList(newEntry) {
    // Makes a new div on the page with the entry name
    Entries.push(newEntry);
    let newEntryDiv = document.createElement('div');
    newEntryDiv.innerHTML = newEntry.Name;
    document.getElementById("entryList").appendChild(newEntryDiv);
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

    // CASE 3: 2+ entries
    else {
        clear("bracket");
        let bracket = document.getElementById("bracket");
        let bracketEntryHeight = 30;  // px
        let bracketMatchupSeparation = 20; //px
        let cols = [];

        // bracketDepth including playToEnter round
        let bracketDepth = Math.ceil(Math.log2(Entries.length)) + 1;

        // make bracket columns using bracketEntryHeight
        for (let i = 0; i < bracketDepth; i++) {
            let col = document.createElement("div");
            col.className = "bracket-col";
            col.style.width = String(100 / bracketDepth) + "%";
            let colHeight = Entries.length * (bracketEntryHeight + .5 * bracketMatchupSeparation);
            col.style.height = String(colHeight) + "px";
            col.id = "bracket-col-" + i;
            bracket.appendChild(col);
            cols.push(col);
        }

        // Nearest 2^n that can fit the number of entries
        let prettyBracketSize = 2**Math.ceil(Math.log2(Entries.length));

        // find the number of entries that go straight to the first round
        let firstRoundCount = prettyBracketSize - Entries.length;
        
        // find the number of entries that need to play for their spot in first round
        let playToEnterCount = Entries.length - firstRoundCount;
        
        alert("Depth: " + bracketDepth + ", Entries: " + Entries.length + ", FirstRoundCt: " + firstRoundCount + ", playForEntry: " + playToEnterCount);
        
        // Pretty bracket (2, 4, 8...)
        if (firstRoundCount == 0) {
            // fill in cols
            for (let colIndex = 0; colIndex < bracketDepth; colIndex++) {
                let col = document.getElementById("bracket-col-" + colIndex);

            }
            // let col0 = document.getElementById("bracket-col-0");
            // for (let i = 0; i < Entries.length; i++) {
            //     let entry = document.createElement("div");
            //     entry.className = "bracket-entry verdana-gray";
            //     entry.innerHTML = Entries[i].Name;
            //     col0.appendChild(entry);

            //     addBracketSpace("bracket-col-0", bracketMatchupSeparation);

            //     if ((i+1) % 2 == 0) {
            //         addBracketSpace("bracket-col-0", bracketMatchupSeparation);
            //     }
            // }
        }
        // ugly bracket, need to slide entries in to next round
        else {
            // place play-to-enter teams

            // place next teams like regular

        }
    }
}

function addBracketSpace(colId, spacePx)
{
    let col = document.getElementById(colId);
    let space = document.createElement("div");
    space.className = "bracket-matchup-separator";
    space.style.height = spacePx + "px";
    col.appendChild(space);
}

class Entry {
    constructor(name, seed=null) {
        this.Name = name;
        this.Seed = seed;
    }
}