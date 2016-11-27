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
        const response = JSON.parse(request.responseText)
        console.log(response)

        let el = document.querySelector(".ghost")
        if (document.querySelector(".ghost") != null) {
            if (el.classList)
                el.classList.remove('ghost')
            else
                el.ghost = el.ghost.replace(new RegExp('(^|\\b)' + ghost.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
        }

        for (let i = 0; i < 5; i++) {
            let article = response[1][i]
            let ul = document.getElementById('search-result')
            ul.insertAdjacentHTML('afterbegin', '<li class="form-autocomplete-item"><div class="chip hand"><div class="chip-content">' + article + '</div></div></li>')

        }
    }

    request.onerror = function () {
        console.log('error with request')
    }

    request.send()
})


/*document.getElementById("search-btn").addEventListener("click", function (event) {
    event.preventDefault()
})*/