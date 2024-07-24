function login() {

    const formUsers = document.querySelector(".form")
    const loginUrl = "http://localhost:5678/api/users/login"

    formUsers.addEventListener("submit", async (event) => {
        // bloquer par défaut le comportement du navigateur 
        event.preventDefault();

        // creation de l'objet user
        const user = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        }

        // creation de la charge utile au format json 
        const chargeUtile = JSON.stringify(user)

        // Appel de la fonction fetch avec toutes les informations necessaires

        const response = await fetch(loginUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: chargeUtile
        })
        const responseJson = await response.json()

        // gérer les differentes reponses 

        if (response.status === 200) {

            // stocker les informations dans le localStorage pour maintenir la session

            window.localStorage.setItem('userToken', responseJson.token)

            // Redirection vers la page d'accueil
            window.location.href = 'index.html'

        } else {
            const errorMessage = document.getElementById("error-message")
            errorMessage.textContent = "Nom d'utilisateur ou mot de passe incorrect."
        }
    })
}
login()






