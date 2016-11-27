function scrollList() {
    var list = document.getElementById('list'); // targets the <ul>
    var first = list.firstChild; // targets the first <li>
    var maininput = document.getElementById('list');  // targets the input, which triggers the functions populating the list
    document.onkeydown = function (e) { // listen to keyboard events
        switch (e.keyCode) {
            case 38: // if the UP key is pressed
                if (document.activeElement == (maininput || first)) { break; } // stop the script if the focus is on the input or first element
                else { document.activeElement.parentNode.previousSibling.firstChild.focus(); } // select the element before the current, and focus it
                break;
            case 40: // if the DOWN key is pressed
                if (document.activeElement == maininput) { first.focus(); } // if the currently focused element is the main input --> focus the first <li>
                else { document.activeElement.parentNode.nextSibling.firstChild.focus(); } // target the currently focused element -> <a>, go up a node -> <li>, select the next node, go down a node and focus it
                break;
        }
    }
}