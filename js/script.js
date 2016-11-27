'use strict';

// handle CORS Request, see doc here : https://www.html5rocks.com/en/tutorials/cors/
function CORSRequest(method, url) {
    const xhr = new XMLHttpRequest()

    if ('withCredentials' in xhr) {
        xhr.open(method, url, true)
    }
    else if (typeof XDomainRequest != 'undefined') {
        xhr = new XDomainRequest()
        xhr.open(method, url)
    }
    else {
        xhr = null
    }

    return xhr
}

// Watch for changes on search-bar and assign the results
document.getElementById('search-field').addEventListener('input', function (event) {
    const userInput = document.getElementById('search-field').value
    const searchPredictUrl = 'https://crossorigin.me/http://en.wikipedia.org/w/api.php?action=opensearch&search=' + userInput

    // Make the API call unless CORS isn't supported
    const request = CORSRequest('GET', searchPredictUrl)
    if (!request) {
        throw new Error('CORS is not supported')
    }

    // When request is successful, parse the result as JSON...
    request.onload = function () {
        const response = JSON.parse(request.responseText)
        console.log(response)

        //... unhide the <ul> containing all the suggestions
        let el = document.querySelector(".ghost")
        if (document.querySelector(".ghost") != null) {
            if (el.classList)
                el.classList.remove('ghost')
            else
                el.ghost = el.ghost.replace(new RegExp('(^|\\b)' + ghost.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
        }

        //... if suggestions are already present, delete them first
        let ul = document.getElementById('search-result')
        if (ul.hasChildNodes()) {
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild)
            }
        }

        //... and insert suggestions from the API
        for (let i = 0; i < response[1].length; i++) {
            let article = response[1][i]
            ul.insertAdjacentHTML('beforeend', '<li class="form-autocomplete-item"><div class="chip hand"><div class="chip-content"><h6>' + article + '</h6></div></div></li>')
        }
    }

    // If an error occurrs with CORS, throw a warning in console
    request.onerror = function () {
        console.log('error with request')
    }

    request.send()
})


/*document.getElementById("search-btn").addEventListener("click", function (event) {
    event.preventDefault()
})*/