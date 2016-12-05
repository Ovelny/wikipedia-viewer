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

function unHideList() {
    let el = document.querySelector(".ghost")
    if (document.querySelector(".ghost") != null) {
        if (el.classList)
            el.classList.remove('ghost')
    }
}

function removeChilds() {
    let el = document.getElementById('search-result')
    while (el.firstChild) {
        el.removeChild(el.firstChild)
    }

    if (el.classList)
        el.classList.add('ghost')

}

document.getElementById('search-field').addEventListener('input', function (event) {
    const userInput = document.getElementById('search-field').value
    const searchPredictUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + userInput + '&origin=*'

    const request = CORSRequest('GET', searchPredictUrl)
    if (!request) {
        throw new Error('CORS is not supported')
    }

    request.onload = function () {

        unHideList()

        if (searchPredictUrl === 'https://en.wikipedia.org/w/api.php?action=opensearch&search=&origin=*') {
            removeChilds()
        }
        else {
            var response = JSON.parse(request.responseText)
        }

        let ul = document.getElementById('search-result')
        if (ul.hasChildNodes()) {
            while (ul.firstChild) {
                ul.removeChild(ul.firstChild)
            }
        }

        if (searchPredictUrl !== 'https://en.wikipedia.org/w/api.php?action=opensearch&search=&origin=*' && response[1].length >= 1) {
            for (let i = 0; i < response[1].length; i++) {
                let articleTitle = response[1][i]
                let articleSubtitle = response[2][i]
                let articleLink = response[3][i]
                ul.insertAdjacentHTML('beforeend', '<a href=' + articleLink + '><li id="search-item" class="form-autocomplete-item"><div class="chip hand"><div class="chip-content"><h6>' + articleTitle + '</h6><p id="articleSubtitle">' + articleSubtitle + '</p></div></div></li></a>')
            }
        }
        else {
            ul.insertAdjacentHTML('beforeend', '<li id="search-item" class="form-autocomplete-item"><div class="chip hand"><div class="chip-content"><h6>Nothing found! Try another search</h6></div></div></li>')
        }

        navigateList()
    }

    request.onerror = function () {
        removeChilds()
        unHideList()
        if (document.getElementById('search-field').value !== '' && document.getElementById('search-result').hasChildNodes() == false) {
            document.getElementById('search-result').insertAdjacentHTML('beforeend', '<li id="search-item" class="form-autocomplete-item"><div class="chip hand"><div class="chip-content"><h6>Oops! An error occured, please try again later.</h6></div></div></li>')
        }
        else if (document.getElementById('search-field').value === '') {
            removeChilds()
        }
    }

    request.send()
})