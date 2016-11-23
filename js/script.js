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

// display suggestions for user input
document.getElementById('search-field').addEventListener('input', function (event) {
    const userInput = document.getElementById('search-field').value
    const searchPredictUrl = 'https://crossorigin.me/http://en.wikipedia.org/w/api.php?action=opensearch&search=' + userInput

    const request = CORSRequest('GET', searchPredictUrl)
    if (!request) {
        throw new Error('CORS is not supported')
    }

    request.onload = function () {
        const response = request.responseText
    }

    request.onerror = function () {
        console.log('error with request')
    }

    request.send()

})


/*document.getElementById("search-btn").addEventListener("click", function (event) {
    event.preventDefault()
})*/