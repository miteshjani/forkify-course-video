import { API_url, RES_PER_PAGE, KEY } from './config.js';
// import { GetJSON, sendJSON } from './views/helper.js';
import { AJAX } from './views/helper.js';

export const state = {
  receipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createReceipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadReceipe = async function (id) {
  try {
    const data = await AJAX(`${API_url}${id}?key=${KEY}`);
    state.receipe = createReceipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.receipe.bookmarked = true;
    } else {
      state.receipe.bookmarked = false;
    }
    // console.log(state.receipe);
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_url}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    // console.log(state.search.results);
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.receipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.receipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8/4 = 4
  });
  state.receipe.servings = newServings;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookMarks = function (receipe) {
  // Add bookmarks
  state.bookmarks.push(receipe);

  //Mark current Receips as bookmarked
  if (receipe.id === state.receipe.id) state.receipe.bookmarked = true;
  persistBookmark();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  //Mark current Receips as NOT bookmarked
  if (id === state.receipe.id) state.receipe.bookmarked = false;
  persistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
// console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

export const uploadReceipe = async function (newReceipe) {
  try {
    const ingredients = Object.entries(newReceipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            `Wrong ingredient format ! Please use the correct format :)`,
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newReceipe.title,
      source_url: newReceipe.sourceUrl,
      image_url: newReceipe.image,
      publisher: newReceipe.publisher,
      cooking_time: +newReceipe.cookingTime,
      servings: +newReceipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_url}?key=${KEY}`, recipe);
    // console.log(data);
    state.receipe = createReceipeObject(data);
    addBookMarks(state.receipe);
  } catch (err) {
    throw err;
  }
};
