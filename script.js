const SearchBox = document.querySelector(".searchBox");
const SearchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipe...</h2>"
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        recipeContainer.innerHTML = ""
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement("div");
            recipeDiv.classList.add("recipe");
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h3>${meal.strMeal}</h3>
                <p><span>${meal.strArea}</span> Dish</p>
                <p>Belongs to <span>${meal.strCategory}</span> Category</p>
            `
            const button = document.createElement("button");
            button.classList.add("recipe-btn");
            button.textContent = "View recipe";
            recipeDiv.appendChild(button);

            //Adding Eventlistener to recipe button
            button.addEventListener("click", ()=>{
                openRecipePopup(meal);
        })


            recipeContainer.appendChild(recipeDiv);
        });

    } catch (error) {
        recipeContainer.innerHTML = `<h2>Error in fetching recipe</h2>`
    }
    
    
}

const fetchIngridients = (meal) => {
    let ingridientsList = "";
    for(let i = 1; i < 20; i++){
        const ingridient = meal[`strIngredient${i}`];
        if(ingridient){
            const measure = meal[`strMeasure${i}`];
            ingridientsList += `<li>${measure} ${ingridient}</li>`
        }else{
            break;
        }
    }
    return ingridientsList;
}

const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingridients: </h3>
    <ul class="ingridientsList">${fetchIngridients(meal)}</ul>
    <div class="recipeInstructions">
        <h3>Instructions: </h3>
        <p>${meal.strInstructions}</p>
    </div>
    `
    recipeDetailsContent.parentElement.style.display = "block";
}

recipeCloseBtn.addEventListener("click", () => {
    recipeDetailsContent.parentElement.style.display = "none";
})

SearchBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    const searchInput = SearchBox.value.trim();
    if(!searchInput){
        recipeContainer.innerHTML = `<h2>Type the meal in the search box</h2>`;
        return;
    }
    fetchRecipes(searchInput);
});