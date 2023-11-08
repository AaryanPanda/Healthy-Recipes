
//variables declaration

let randomAPI = fetch("https://www.themealdb.com/api/json/v1/1/random.php")
var randomImage = document.getElementById("random-image")
var randomName = document.getElementById("random-name")
var ingredientsDiv = document.getElementById("ingredients-list")
var ingredientsDisplay = document.getElementById("ingredients-align")
var closeButton = document.getElementById("close")
var searchResults = document.getElementById("results")
const searchButton = document.getElementById("search-icon");
const searchInput = document.getElementById("search-input");
const mealGrid = document.getElementById("mealGrid");



//get random image api

randomAPI.then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Failed to fetch data from the API');
    }
}).then(data => {
    data.meals.forEach(meal => {
        const mealImage = document.createElement('img');
        mealImage.src = meal.strMealThumb;

        const mealName = document.createElement('p');
        mealName.textContent = meal.strMeal;


        randomName.appendChild(mealName);
        randomImage.appendChild(mealImage);

        mealImage.addEventListener('click', () => {
            displayIngredients(meal.strMeal);
        });

    });
})
    .catch(error => {
        console.error(error);
    });





//get ingredients of recepies

function displayIngredients(mealName) {

    ingredientsDiv.innerHTML = ""
    ingredientsDisplay.style.display = "flex"
    // Fetch the ingredients for the selected meal by name
    const ingredientsUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`;

    fetch(ingredientsUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch ingredients data');
            }
        })
        .then(data => {
            const meal = data.meals[0];
            if (meal) {
                // Extract and display all ingredients
                console.log(meal)

                for (let i = 1; i <= 20; i++) {
                    const ingredient = meal[`strIngredient${i}`];
                    const measure = meal[`strMeasure${i}`];
                    if (ingredient) {
                        ingredientsDiv.append(`${measure} ${ingredient}`);
                        ingredientsDiv.appendChild(document.createElement('br'));
                        ingredientsDiv.appendChild(document.createElement('br'));

                    } else {
                        break;
                    }
                }

            } else {
                ingredientsDiv.textContent = 'Ingredients not found.';
            }
        })
        .catch(error => {
            console.error(error);
        });
}


closeButton.addEventListener('click', () => {
    ingredientsDisplay.style.display = "none"
})





//search recipies with categories api

document.addEventListener("DOMContentLoaded", function () {

    searchButton.addEventListener("click", () => {
        searchResults.style.display = "block"
        const category = searchInput.value;
        if (category.trim() === "") {
            return;
        }

        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
            .then(response => response.json())
            .then(data => {
                displayMeals(data.meals);
            })
            .catch(error => {
                console.error("Error fetching data: " + error);
            });
    });


    //get the category meals on dom inside grid 

    function displayMeals(meals) {
        mealGrid.innerHTML = "";
        if (meals) {
            meals.forEach(meal => {
                const mealItem = document.createElement("div");
                mealItem.classList.add("meal-item");

                const mealImage = document.createElement("img");
                mealImage.src = meal.strMealThumb;
                mealImage.alt = meal.strMeal;

                const mealName = document.createElement("p");
                mealName.textContent = meal.strMeal;

                mealItem.appendChild(mealImage);
                mealItem.appendChild(mealName);

                mealGrid.appendChild(mealItem);
            });
        } else {
            mealGrid.innerHTML = '<p style="font-size: 20px; width:80vw; font-weight: 800; text-align: center; padding-right: 20px;"> No recepies found in this category! </p>';
        }
    }
});




//enabled enter key function to get results and display in grid (copy of above function)

searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.keyCode === 13) {

        const offSetTop = searchResults.getBoundingClientRect().top;
        window.scrollTo({
            top: offSetTop,
            left: 0,
            behavior: 'smooth'
        })

        searchResults.style.display = "block"
        const category = searchInput.value;
        if (category.trim() === "") {
            return;
        }

        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
            .then(response => response.json())
            .then(data => {
                displayMeals(data.meals);
            })
            .catch(error => {
                console.error("Error fetching data: " + error);
            });

        function displayMeals(meals) {
            mealGrid.innerHTML = "";
            if (meals) {
                meals.forEach(meal => {
                    const mealItem = document.createElement("div");
                    mealItem.classList.add("meal-item");

                    const mealImage = document.createElement("img");
                    mealImage.src = meal.strMealThumb;
                    mealImage.alt = meal.strMeal;

                    const mealName = document.createElement("p");
                    mealName.textContent = meal.strMeal;

                    mealItem.addEventListener("click", () => {
                        displayIngredients(meal.strMeal);
                    });

                    mealItem.appendChild(mealImage);
                    mealItem.appendChild(mealName);

                    mealGrid.appendChild(mealItem);
                });
            } else {
                mealGrid.innerHTML = '<p style="font-size: 20px; width:80vw; font-weight: 800; text-align: center; padding-right: 20px;"> No recepies found in this category! </p>';
            }
        }

    }
})
