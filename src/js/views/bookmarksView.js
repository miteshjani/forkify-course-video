import icons from 'url:../../img/icons.svg'; //
import previewView from './previewView.js';
import View from './View.js';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet.Find a nice recips and bookmark it :)`;
  _message = ';';

  _generateMarkUp() {
    console.log(this._data);
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  // _generateMarkupPreview(result) {
  //   const id = window.location.hash.slice(1);
  //   const newid = id.replace(/{|}/g, '');

  //   return ` <li class="preview">
  //           <a class="preview__link ${result.id === newid ? `preview__link--active` : ''}" href="#${result.id}}">
  //             <figure class="preview__fig">
  //               <img src="${result.image}" alt="Test" />
  //             </figure>
  //             <div class="preview__data">
  //               <h4 class="preview__title">${result.title}</h4>
  //               <p class="preview__publisher">${result.publisher}</p>
  //               <div class="preview__user-generated">
  //                 <svg>
  //                   <use href="${icons}#icon-user"></use>
  //                 </svg>
  //               </div>
  //             </div>
  //           </a>
  //         </li>`;
  // }
}

export default new BookmarksView();
