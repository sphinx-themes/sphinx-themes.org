
/**
 * We add extra br tags to the autodoc output, so each parameter is shown on
 * its own line.
 */
function setupAutodoc() {
    const paramElements = document.getElementsByClassName('sig-param')

    Array(...paramElements).forEach((element) => {
        console.log('adding element ...')
        let brElement = document.createElement('br')
        element.parentNode.insertBefore(brElement, element)
    })

    const lastParamElements = document.querySelectorAll('em.sig-param:last-of-type')

    Array(...lastParamElements).forEach((element) => {
        console.log('adding end element ...')
        let brElement = document.createElement('br')
        element.after(brElement)
    })
}

function setupSearchSidebar() {
    document.querySelector('form.search input[type=text]').placeholder = 'Search...'

    document.querySelector('form.search input[type=submit]').value = 'Search'
}

function setupSidebarToggle() {
    const sidebar = document.querySelector('.sphinxsidebar')
    document.querySelector('#toggle_sidebar a').onclick = (event) => {
        console.log("Toggling sidebar")
        event.preventDefault()
        sidebar.style.display = window.getComputedStyle(sidebar, null).display == 'none' ? 'block' : 'none'
    }
}

function setupRightSidebarToggle() {
    const sidebar = document.querySelector('#right_sidebar')

    const links = document.querySelectorAll('a.toggle_right_sidebar')

    Array(...links).forEach((element) => {
        element.onclick = (event) => {
            console.log("Toggling right sidebar")
            event.preventDefault()
            sidebar.style.display = window.getComputedStyle(sidebar, null).display == 'none' ? 'block' : 'none'
        }
    })
}

window.onload = function() {
    console.log("custom theme loaded")

    setupAutodoc()
    setupSearchSidebar()
    setupSidebarToggle()
    setupRightSidebarToggle()
}
