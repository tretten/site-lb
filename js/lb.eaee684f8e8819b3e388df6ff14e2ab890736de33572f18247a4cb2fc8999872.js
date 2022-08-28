function closeOverlay(text) {
    var inputc = document.body.appendChild(document.createElement("input"));
    inputc.value = window.location.href;
    inputc.focus();
    inputc.select();
    document.execCommand('copy');
    inputc.parentNode.removeChild(inputc);
}

// window.onload = function () {
//     document.body.classList.add(
//         'loaded'
//       );
//   };
;
const storageKey = 'theme-preference'

const onClick = () => {
  // flip current value
  theme.value = theme.value === 'light'
    ? 'dark'
    : 'light'

  setPreference()
}

const getColorPreference = () => {
  if (localStorage.getItem(storageKey))
    return localStorage.getItem(storageKey)
  else
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
}

const setPreference = () => {
  localStorage.setItem(storageKey, theme.value)
  reflectPreference()
}

const reflectPreference = () => {
  document.firstElementChild
    .setAttribute('data-theme', theme.value)

  document
    .querySelector('#theme-toggle')
    ?.setAttribute('aria-label', theme.value)
}

const theme = {
  value: getColorPreference(),
}

// set early so no page flashes / CSS is made aware
reflectPreference()

window.onload = () => {
  // set on load so screen readers can see latest value on the button
  reflectPreference()

  // now this script can find and listen for clicks on the control
  document
    .querySelector('#theme-toggle')
    .addEventListener('click', onClick)
}

// sync with system changes
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', ({matches:isDark}) => {
    theme.value = isDark ? 'dark' : 'light'
    setPreference()
  })
;
function $(selector) {
  return document.querySelector(selector);
}
function get(url, callback) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.responseText);
    }
  };
  request.open('GET', url, true);
  request.send();
}

// function singluar(val) {
//   if (val.slice(-1) === 's') {
//     if (val.slice(-3) === 'ies') {
//       return val.slice(0, -3) + 'y';
//     } else {
//       return val.slice(0, -1);
//     }
//   }
//   return val;
// }


// категории поиска
function fetchData(callback) {
  var obj = {};
  if (!window.searchData) {
    ['logo', 'designer', 'agency', 'country', 'shape', 'object'].map(v => {
      get(`/${v}/index.json`, function (d) {
          if (!obj[v]) {
            obj[v] = JSON.parse(d);
          }
        });
    })
  } else {
    obj = window.searchData;
  }
  callback(obj);
}

var selectedItem = 0;
function init() {
  //gtag('event', 'search_focus');
  var autocomplete_list = $('#search ul.menu');
  fetchData((data) => {
    var goto_menu_item = function (item) {
      document.location.href =
        '/' + item.getAttribute('content').toLowerCase();
    };
    var handler = function (e) {
      if ('keyCode' in e && e.keyCode == 13) {
        goto_menu_item($('#autocomplete li.active'));
        return;
      }
      if (e.target.value.length == 0) {
        $('#autocomplete').style.display = 'none';
        return;
      }
      $('#autocomplete').style.display = 'flex';
      if (e.target.value.length <= 1) {
        autocomplete_list.innerHTML =
          '<lh>Please enter at least two letters</lh>';
        return;
      }
      if ('keyCode' in e && e.keyCode == 27) {
        e.target.value = '';
        autocomplete_list.innerHTML = '';
        $('#autocomplete').style.display = 'none';
        return;
      }
      var html = [];
      var list = [];
      var input = e.target.value;

      var results = {};

      Object.entries(data).map(([k, v]) => {
        const searchStr = new RegExp(
          input
            .toLowerCase()
            .split(' ')
            .join('.*')
        );

        for (i in v) {
          const searchStr = new RegExp(
            input
              .toLowerCase()
              .split(' ')
              .join('.*')
          );
          if (
            v[i]
              .toLowerCase()
              .split(/[\ \-]/)
              .join('')
              .search(searchStr) >= 0
          ) {
            if (!results[k]) {
              results[k] = [];
            }
            results[k].push(v[i]);
          }
        }
      })

      // list.sort(function (a, b) {
      //   const first = a.search(input);
      //   const second = b.search(input);
      //   if (first > second) {
      //     return 1;
      //   }
      //   if (first < second) {
      //     return -1;
      //   }
      //   if (a.length > b.length) {
      //     return 1;
      //   }
      //   if (a.length < b.length) {
      //     return -1;
      //   }
      //   return 0;
      // });



      // for (i in list) {
      //   var split = list[i].split('/');
      //   if (split.length === 3) {
      //     if (!results[split[1]]) {
      //       results[split[1]] = [];
      //     }
      //     results[split[1]].push(split[2]);
      //   }
      // }


      // вывод элементов поиска 
      Object.entries(results).map(([k, v]) => {
        if (k == "logo") {
          v.map(v2 => {
            html.push(
              `<li class="one-item" content="${k}/${v2}#l0">
                <a href="/${k}/${v2}#l0"><img src="/file/${v2}.svg" alt=" " />
                ${decodeURI(v2.replaceAll("-", " "))}
                </a>
              </li>
              `
            );
          })
        } else {
          html.push(
            `<lh>${k}:</lh>`
          );
          v.map(v2 => {
            html.push(
              `<li class="one-item" content="${k}/${v2}">
                <a href="/${k}/${v2}">
                ↳ &nbsp; ${decodeURI(v2.replaceAll("-", " "))}
                </a>
              </li>
              `
            );
          })
        };
      })


      // for (i in list) {
      //   var split = list[i].split('/');
      //   if (split.length === 3) {
      //     html.push(
      //       `<li class="one-item" content="${split[1]}/${split[2]}">
      //         <a href="/${split[1].toLowerCase()}/${split[2].toLowerCase()}">
      //         <span>${split[1]}:</span>
      //         <span>${decodeURI(split[2].replace('-', ' '))}</span>
      //         </a>
      //       </li>
      //       `
      //     );
      //   }
      // }

      // html.push(
      //   '<li class="one-item" content="' +
      //   list[i].split('.')[0] +
      //   '" image="' +
      //   list[i] +
      //   '">' +
      //   '<a href="/' + split[1].toLowerCase() + '/' + split[2] + '" >' +
      //   '<img src="/file/' +
      //   list[i].toLowerCase() +
      //   '.svg" />' +
      //   // '<div class="chip">' +
      //   // '<div class="chip-content">' +
      //   '<span>' + split[1] + ': </span>' +
      //   split[2] +

      //   // '</div>' +
      //   // '<div class="chip-icon">' +
      //   // '<img src="/files/' +
      //   // list[i].toLowerCase() +
      //   // '.svg" class="avatar" />' +
      //   // '</div>' +
      //   // '</div>' +
      //   '</a>' +
      //   '</li>'
      // );

      var deselectAll = function (items) {
        items.forEach(item => item.classList.remove('active'));
        if (selectedItem >= 0 && selectedItem < items.length) {
          items[selectedItem].classList.add('active');
        }
      };
      if (!html.length) {
        $('#autocomplete').style.display = 'none';
      } else {
        autocomplete_list.innerHTML = html.join('\n');
        var items = document.querySelectorAll('ul#autocomplete li');
        if ('keyCode' in e && e.keyCode == 38) {
          if (selectedItem <= 0) {
            selectedItem = items.length - 1;
          } else {
            selectedItem -= 1;
          }
        }
        if ('keyCode' in e && e.keyCode == 40) {
          if (selectedItem >= items.length - 1) {
            selectedItem = 0;
          } else {
            selectedItem += 1;
          }
        }
        deselectAll(items);
      }
      return false;
    };
    $('.search-input').addEventListener('keyup', handler);
    $('.search-input').addEventListener('focus', handler);
    $('body').addEventListener('click', function (e) {
      var parent = e.target.closest('li');
        if (parent && parent.className == 'one-item') {
        goto_menu_item(parent);
      } else if (
        e.target.className.indexOf('search-input') >= 0 &&
        e.target.value.length > 0
      ) {
        $('#autocomplete').style.display = 'flex';
      } else {
        $('#autocomplete').style.display = 'none';
      }
      return false;
    });

  })

};
