// main.js

// CONSTANTS
const RECIPE_URLS = [
  'https://introweb.tech/assets/json/1_50-thanksgiving-side-dishes.json',
  'https://introweb.tech/assets/json/2_roasting-turkey-breast-with-stuffing.json',
  'https://introweb.tech/assets/json/3_moms-cornbread-stuffing.json',
  'https://introweb.tech/assets/json/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://introweb.tech/assets/json/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://introweb.tech/assets/json/6_one-pot-thanksgiving-dinner.json',
];

// Run the init() function when the page has loaded
window.addEventListener('DOMContentLoaded', init);

// Starts the program, all function calls trace back here
async function init() {
  // initialize ServiceWorker
  initializeServiceWorker();
  // Get the recipes from localStorage
  let recipes;
  try {
    recipes = await getRecipes();
  } catch (err) {
    console.error(err);
  }
  // Add each recipe to the <main> element
  addRecipesToDocument(recipes);
}

function initializeServiceWorker() {
  // EXPLORE - START (All explore numbers start with B)
  /*******************/
  // ServiceWorkers have many uses, the most common of which is to manage
  // local caches, intercept network requests, and conditionally serve from
  // those local caches. This increases performance since users aren't
  // re-downloading the same resources every single page visit. This also allows
  // websites to have some (if not all) functionality offline! I highly
  // recommend reading up on ServiceWorkers on MDN before continuing.
  /*******************/
  // We first must register our ServiceWorker here before any of the code in
  // sw.js is executed.

  // B1. Check if 'serviceWorker' is supported in the current browser
  if ('serviceWorker' in navigator) {
    // B2. Listen for the 'load' event on the window object.
    window.addEventListener('load', function() {
      // Steps B3-B6 will be *inside* the event listener's function created in B2

      // B3. Register './sw.js' as a service worker (The MDN article
      //     "Using Service Workers" will help you here)
      navigator.serviceWorker.register('./sw.js')
        .then(function(registration) {
          // B4. Once the service worker has been successfully registered, console
          //     log that it was successful.
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(function(error) {
          // B5. In the event that the service worker registration fails, console
          //     log that it has failed.
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
  // STEPS B6 ONWARDS WILL BE IN /sw.js
}

async function getRecipes() {
  // A1. Check local storage to see if there are any recipes.
  // If there are recipes, return them.
  if (localStorage.getItem('recipes') !== null) {
    return JSON.parse(localStorage.getItem('recipes'));
  }

  // The rest of this method will be concerned with requesting the recipes
  // from the network

  // A2. Create an empty array to hold the recipes that you will fetch
  const recipes = [];

  // A3. Return a new Promise. A promise takes one parameter - A
  // function (we call these callback functions). That function will
  // take two parameters - resolve, and reject. These are functions
  // you can call to either resolve the Promise or reject it.
  return new Promise((resolve, reject) => {
    // A4-A11 will all be *inside* the callback function we passed to the Promise

    const fetchRecipe = async (url) => {
      try {
        // A6. For each URL in that array, fetch the URL
        const response = await fetch(url);

        // A7. Retrieve the JSON from the fetch response
        const recipe = await response.json();

        // A8. Add the new recipe to the recipes array
        recipes.push(recipe);

        // A9. Check if you have finished retrieving all of the recipes
        if (recipes.length === RECIPE_URLS.length) {
          // Save the recipes to storage using the provided function
          saveRecipesToStorage(recipes);

          // Pass the recipes array to the Promise's resolve() method
          resolve(recipes);
        }
      } catch (error) {
        // A10. Log any errors from catch using console.error
        console.error(error);

        // A11. Pass any errors to the Promise's reject() function
        reject(error);
      }
    };

    // Call fetchRecipe for each URL in the RECIPE_URLS array
    RECIPE_URLS.forEach((url) => fetchRecipe(url));
  });
}

/**
 * Takes in an array of recipes, converts it to a string, and then
 * saves that string to 'recipes' in localStorage
 * @param {Array<Object>} recipes An array of recipes
 */
function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

/**
 * Takes in an array of recipes and for each recipe creates a
 * new <recipe-card> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} recipes An array of recipes
 */
function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
    let recipeCard = document.createElement('recipe-card');
    recipeCard.data = recipe;
    main.append(recipeCard);
  });
}