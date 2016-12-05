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

// handle up/down/enter keys for navigation
function navigateList() {
    const search = document.getElementById('search-field')
    const list = document.getElementById('search-result')
    const item = document.getElementById('search-item')

    const up = 38
    const down = 40
    const enter = 13


    document.onkeydown = function (event) {
        event = event || window.event
        switch (event.which || event.keyCode) {
            case up:
                if (document.activeElement === search) {
                    list.firstChild.focus()
                    event.preventDefault()
                }
                else {
                    if (document.activeElement.previousElementSibling == null) {
                        break
                    }
                    document.activeElement.previousElementSibling.focus()
                    event.preventDefault()
                }
                break

            case down:
                if (document.activeElement === search) {
                    list.firstChild.focus()
                    event.preventDefault()
                }
                else {
                    if (document.activeElement.nextElementSibling == null) {
                        break
                    }
                    document.activeElement.nextElementSibling.focus()
                    event.preventDefault()
                }
                break

            case enter:
                document.activeElement.click()
                break

            default: search.focus()

        }
    }
}

// watch for changes on search-bar and assign the results
document.getElementById('search-field').addEventListener('input', function (event) {
    const userInput = document.getElementById('search-field').value
    const searchPredictUrl = 'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=' + userInput + '&format=json&gsrprop=snippet&prop=info&inprop=url'

    // Make the API call unless CORS isn't supported
    const request = CORSRequest('GET', searchPredictUrl)
    if (!request) {
        throw new Error('CORS is not supported')
    }

    // display a spinner in case of a slow request
    request.onprogress = function () {
        let ul = document.getElementById('search-result')
        ul.insertAdjacentHTML('beforeend', '<div class="loading"></div>')
    }

    // when request is successful, parse the result as JSON...
    request.onload = function () {
        //... unhide the <ul> containing all the suggestions
        let el = document.querySelector(".ghost")
        if (document.querySelector(".ghost") != null) {
            if (el.classList)
                el.classList.remove('ghost')
        }

        if (searchPredictUrl === 'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=&format=json&gsrprop=snippet&prop=info&inprop=url') {
            let el = document.getElementById('search-result')
            while (el.firstChild) {
                el.removeChild(el.firstChild)
            }

            if (el.classList)
                el.classList.add('ghost')

        }
        else {
            var response = JSON.parse(request.responseText)
            console.log(response)
        }

        //... if suggestions are already present, delete them first
        let ul = document.getElementById('search-result')
        if (ul.hasChildNodes()) {
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild)
            }
        }

        //... and insert suggestions from the API
        if (searchPredictUrl !== 'https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=&format=json&gsrprop=snippet&prop=info&inprop=url' && response.query.search.length >= 1) {
            for (let i = 0; i < response.query.search.length; i++) {
                let articleTitle = response.query.search[i].title
                let articleSubtitle = response.query.search[i].snippet
                let articleLink = 'jk'
                ul.insertAdjacentHTML('beforeend', '<a href=' + articleLink + '><li id="search-item" class="form-autocomplete-item"><div class="chip hand"><div class="chip-content"><h6>' + articleTitle + '</h6><p id="articleSubtitle">' + articleSubtitle + '</p></div></div></li></a>')
            }
        }
        else {
            ul.insertAdjacentHTML('beforeend', '<li id="search-item" class="form-autocomplete-item"><div class="chip hand"><div class="chip-content"><h6>Nothing found! Try another search</h6></div></div></li>')
        }

        // enable arrows navigation
        navigateList()
    }

    // if an error occurrs with CORS, throw a warning in console
    request.onerror = function () {
        console.log('error with request')
    }


    request.send()
})