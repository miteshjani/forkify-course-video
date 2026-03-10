import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import receipeView from './views/receipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookMarksView from './views/bookMarksView.js';
import addReceipeView from './views/addReceipeView.js';

import 'core-js/stable';
import 'regenerator-runtime';

const recipeContainer = document.querySelector('.recipe');

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////
// console.log('TEST');

if (module.hot) {
  module.hot.accept();
}

const controlReceipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    const newid = id.replace(/{|}/g, '');
    console.log(newid);

    if (!newid) return;
    //1) Loading receipe
    receipeView.renderSpinner();

    // 2) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //3) Updating bookmarks view
    bookMarksView.update(model.state.bookmarks);

    await model.loadReceipe(newid);

    // console.log(res, data);

    // 4) Rendeding Receipe
    receipeView.render(model.state.receipe);
  } catch (err) {
    // alert(err);
    receipeView.renderError();
  }
};

// controlReceipes();

// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlReceipes),
// );

const controlSearchResults = async function () {
  try {
    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();
    // 2. Load search results
    await model.loadSearchResults(query);
    // 3. Render results
    console.log(model.state.search.results);
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //4) Render Initial Pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 3) Render NEW Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //4) Render NEW  Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the receips servings (in state)
  model.updateServings(newServings);

  //Update the receipe view
  // receipeView.render(model.state.receipe);
  receipeView.update(model.state.receipe);
};

const controlAddBookmark = function () {
  // 1) Add/Remove bookmark
  if (!model.state.receipe.bookmarked) model.addBookMarks(model.state.receipe);
  else model.deleteBookmark(model.state.receipe.id);
  console.log(model.state.receipe);
  // 2) Update recipe view
  receipeView.update(model.state.receipe);

  // Render bookmark
  bookMarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookMarksView.render(model.state.bookmarks);
};

const controlAddReceipe = async function (newReceipe) {
  // console.log(newReceipe);

  try {
    //Show loading spinner
    addReceipeView.renderSpinner();

    // Upload the new receips data
    await model.uploadReceipe(newReceipe);
    console.log(model.state.receipe);

    // Render Receipe
    receipeView.render(model.state.receipe);

    // Success message
    addReceipeView.renderMessage();

    // Rendor bookmark view
    bookMarksView.render(model.state.bookmarks);

    //Change ID in URL
    window.history
      .pushState(null, '', `#${model.state.receipe.id}`)

      // Close form window
      .setTimeout(function () {
        addReceipeView.toggleWindow();
      }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addReceipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application');
};

// controlSearchResults();
// window.addEventListener('hashchange', controlReceipes);
// window.addEventListener('load', controlReceipes);
const init = function () {
  bookMarksView.addHandlerBookmarkRender(controlBookmarks);
  receipeView.addHandlerRender(controlReceipes);
  receipeView.addHandlerUpdateServings(controlServings);
  receipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlersSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addReceipeView.addHandlerUpload(controlAddReceipe);
  newFeature();
};

init();
