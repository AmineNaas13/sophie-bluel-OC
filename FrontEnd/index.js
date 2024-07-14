const categories = document.querySelector(".categories")

// 1 - Récupérer les projets depuis le back-end

//a- retourner les projets 

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works")
    const responseJson = response.json()

    return responseJson
}

// b- afficher les projets

async function displayWorks() {
    const arrayWorks = await getWorks()
    const gallery = document.querySelector(".gallery")
    gallery.innerHTML = ""
    arrayWorks.forEach((project) => {
        createWorks(project)
    });

}

displayWorks()


async function createWorks(project) {
    const gallery = document.querySelector(".gallery")
    const figure = document.createElement("figure")
    const image = document.createElement("img")
    const figcaption = document.createElement("figcaption")

    image.src = project.imageUrl
    figcaption.innerText = project.title

    figure.appendChild(image)
    figure.appendChild(figcaption)
    gallery.appendChild(figure)
}

// 2- Récupérer les categories depuis le back-end

//a- retourner les catégories

async function getCategories() {

    const response = await fetch("http://localhost:5678/api/categories")
    const responseJson = await response.json()
    return responseJson
}

getCategories()

// b- afficher les catégories:

async function displayCategories() {

    const arrayCategories = await getCategories()

    const categories = document.querySelector(".categories")

    arrayCategories.forEach((category) => {

        const btn = document.createElement("button")

        btn.classList.add("categorie-item")

        btn.id = category.id
        btn.textContent = category.name

        categories.appendChild(btn)
    });
}
displayCategories()


// c-filtrer les projets par catégorie:

async function filterCategory() {

    const works = await getWorks()

    const gallery = document.querySelector(".gallery")
    const filterButtons = document.querySelectorAll(".categories .categorie-item  ")  // recuperer mes boutons 

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            console.log(e.target.id); // regarde sur quoi tu clique et tu m affiche son id
            let btnId = parseInt(e.target.id) // convertir le string en int 


            if (btnId !== 0) {

                gallery.innerHTML = ""
                const worksByCategory = works.filter((project) => {
                    return project.categoryId == btnId
                })
                worksByCategory.forEach(project => {

                    createWorks(project)
                });
            } else {
                displayWorks()
            }
        })
    });
}
filterCategory()

// 3-1- gerer l'affichage de la modale

const modifier = document.querySelector(".modify")
const modal = document.querySelector(".modal")

modifier.addEventListener("click", () => {
    modal.style.display = "flex"
})

const modalClose = document.querySelector(".modalClose")

modalClose.addEventListener("click", () => {
    modal.style.display = "none"
})


modal.addEventListener("click", (e) => {

    if (e.target.className == "modal") {
        modal.style.display = "none"
    }
})

// 3-2- remplir la modal 

async function displayMiniWorks() {

    const arrayminiWorks = await getWorks()
    const modalContent = document.querySelector(".modalContent")
    modalContent.innerHTML = ""

    arrayminiWorks.forEach((miniproject) => {

        const miniFigure = document.createElement("figure")
        const miniImage = document.createElement("img")
        const trashIcon = document.createElement("span")

        miniImage.src = miniproject.imageUrl

        trashIcon.classList.add("fa-solid", "fa-trash-can")

        trashIcon.addEventListener("click", () => {
            deleteProject(miniproject.id)
        })

        miniFigure.appendChild(trashIcon)
        miniFigure.appendChild(miniImage)
        modalContent.appendChild(miniFigure)

    });
}
displayMiniWorks()

// 4.suppression de projet

async function deleteProject(id) {
    const removeProject = await fetch("http://localhost:5678/api/works/" + id, {
        method: "delete", headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("userToken")
        },
    })

    if (removeProject.status == 204) {
        displayMiniWorks()
        displayWorks()
    }
}

// 5- Ajout de projet  
//5-1- gérer l'afficahge de la modal "ajout photo"

async function displayAddModal() {

    const addPicture = document.querySelector(".addPictureBtn")
    const modalGalerie = document.querySelector(".modalGalerie")
    const modalAddGalerie = document.querySelector(".modalAddGalerie")



    addPicture.addEventListener("click", () => {
        modalAddGalerie.style.display = "flex"
        modalGalerie.style.display = "none"
    })

    const arrowLeft = document.querySelector(".fa-arrow-left")

    arrowLeft.addEventListener("click", () => {
        modalAddGalerie.style.display = "none"
        modalGalerie.style.display = "flex"
    })

    const modalAddClose = document.querySelector(".modalAddGalerie .fa-xmark")

    modalAddClose.addEventListener("click", () => {
        modal.style.display = "none"

    })
}
displayAddModal()

//5-2- faire la prévisualisation de l image 

async function previewModal() {

    const PreviewImage = document.querySelector(".containerFile img")
    const inputFile = document.querySelector(".containerFile input")
    const labelFile = document.querySelector(".containerFile label")
    const iconFile = document.querySelector(".containerFile .fa-image")
    const textFile = document.querySelector(".containerFile p")

    // écouter les changements sur l'input 

    inputFile.addEventListener("change", () => {
        const file = inputFile.files[0] // Récupère le premier fichier sélectionné avec la propriété file


        if (file) {
            const reader = new FileReader()  // Crée un nouvel objet FileReader intégré de js qui permet de lire les contenues des fichiers
            reader.onload = function (e) {
                PreviewImage.src = e.target.result // Définit l'URL de l'image prévisualisée
                PreviewImage.style.display = "flex" // afficher l'image de prévisualisation
                labelFile.style.display = "none"
                iconFile.style.display = "none"
                textFile.style.display = "none"
            }
            reader.readAsDataURL(file)  // Lit le fichier comme une URL de données
        }
    })
}
previewModal()


//ajouter les catégories dans mon input 

async function displayCategoriesModal() {

    const select = document.querySelector(".modalAddGalerie select")
    const selectCategories = await getCategories()

    selectCategories.forEach(element => {
        const option = document.createElement("option")
        option.value = element.id
        option.textContent = element.name
        select.appendChild(option)
    });

}
displayCategoriesModal()

//5-3- Faire un post pour ajouter un projet

async function addNewProject(e) {
    e.preventDefault();

    const inputFile = document.querySelector(".containerFile input");
    const titleElement = document.querySelector("#title");
    const categoryElement = document.querySelector("#category");
    const errorAddProject = document.querySelector(".error-addproject");

    // Vérifier si tous les champs sont remplis

    if (titleElement.value === "" || categoryElement.value === "" || inputFile.files[0] === undefined) {
        errorAddProject.innerText = "Veuillez remplir tous les champs!";
        return; // Ajout de la ligne de retour pour arrêter l'exécution si les champs ne sont pas remplis
    }

    const payload = new FormData();
    payload.append("image", inputFile.files[0]);
    payload.append("title", titleElement.value);
    payload.append("category", categoryElement.value);

    try {
        const responseProject = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: "Bearer " + localStorage.getItem("userToken")
            },
            body: payload,
        });

        if (responseProject.status === 200) {

            displayWorks();
            displayMiniWorks();
        }

    } catch (error) {
        console.error("Erreur lors de l'ajout du projet ");
    }
}

// Ajouter l'événement au bouton de validation

const validateProjectBtn = document.querySelector(".validatePicBtn");
validateProjectBtn.addEventListener("click", addNewProject);


async function checkModalField() {

    const inputFile = document.querySelector(".containerFile input");
    const titleElement = document.querySelector("#title");
    const categoryElement = document.querySelector("#category");

    titleElement.addEventListener("input", disabledSubmitButton)
    categoryElement.addEventListener("change", disabledSubmitButton)
    inputFile.addEventListener("change", disabledSubmitButton)
}

function disabledSubmitButton() {

    const inputFile = document.querySelector(".containerFile input");
    const titleElement = document.querySelector("#title");
    const categoryElement = document.querySelector("#category");

    // Vérifier si tous les champs sont remplis
    const submitButton = document.querySelector(".validatePicBtn")
    if (titleElement.value === "" || categoryElement.value === "" || inputFile.files[0] === undefined) {

        submitButton.disabled = true

    } else {
        submitButton.disabled = false
    }
}

checkModalField()



