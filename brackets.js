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
     * Displays bracket with divs
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
        let bracketDepth = Math.round(Math.log2(Entries.length)) + 2;
        let cols = [];

        // sub-bracket cols (using .bracket-entry 30px height)
        for (let i = 0; i < bracketDepth; i++) {
            let col = document.createElement("div");
            col.className = "bracket-col bg-light-gray";
            col.style.width = String(100 / bracketDepth) + "%";
            col.style.height = String(Entries.length * 30) + "px";
            col.id = "bracket-col-" + i;
            bracket.appendChild(col);
            cols.push(col);
        }
        
        let col0 = document.getElementById("bracket-col-0");
        for (let i = 0; i < Entries.length; i++) {
            let entry = document.createElement("div");
            entry.className = "bracket-entry verdana-gray";
            entry.innerHTML = Entries[i].Name;
            col0.appendChild(entry);
        }
    }
}


class Entry {
    constructor(name, seed=null) {
        this.Name = name;
        this.Seed = seed;
    }
}