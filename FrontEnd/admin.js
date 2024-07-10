function isConnected() {
    const userToken = localStorage.getItem("userToken")
    if (userToken) {
        return true
    }
    return false
}

function handleDisplayAdminElement() {
    const adminElements = document.querySelectorAll(".admin-element")
    const btnCategory = document.querySelector(".categories");

    adminElements.forEach((element) => {

        if (isConnected()) {
            element.classList.remove("hidden")

        } else {
            element.classList.add("hidden")
        }
    })
    if (isConnected()) {

        btnCategory.classList.add("hidden")
    }
}

handleDisplayAdminElement()

function handleLogout() {
    const authLogin = document.querySelector(".link-login")

    if (isConnected()) {

        authLogin.textContent = "logout"
        authLogin.href = "index.html"

        authLogin.addEventListener("click", () => {
            localStorage.removeItem("userToken")
            location.reload();
        })
    }
}
handleLogout()


