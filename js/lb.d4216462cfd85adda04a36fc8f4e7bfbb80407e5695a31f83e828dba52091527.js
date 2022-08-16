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
!(function () {
    const e = {
        _scheme: "auto",
        change: {
            light: "<i>Turn on dark mode</i>",
            dark: "<i>Turn off dark mode</i>",
        },
        buttonsTarget: ".theme-switcher",
        localStorageKey: "preferedColorScheme",
        init() {
            (this.scheme = this.schemeFromLocalStorage), this.initSwitchers();
        },
        get schemeFromLocalStorage() {
            return void 0 !== window.localStorage &&
                null !== window.localStorage.getItem(this.localStorageKey)
                ? window.localStorage.getItem(this.localStorageKey)
                : this._scheme;
        },
        get preferedColorScheme() {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        },
        initSwitchers() {
            const e = document.querySelectorAll(this.buttonsTarget);
            e.forEach((e) => {
                e.addEventListener(
                    "click",
                    () => {
                        "dark" == this.scheme
                            ? (this.scheme = "light")
                            : (this.scheme = "dark");
                    },
                    !1
                );
            });
        },
        addButton(e) {
            let t = document.createElement(e.tag);
            (t.className = e.class),
                document.querySelector(e.target).appendChild(t);
        },
        set scheme(e) {
            "auto" == e
                ? "dark" == this.preferedColorScheme
                    ? (this._scheme = "dark")
                    : (this._scheme = "light")
                : ("dark" != e && "light" != e) || (this._scheme = e),
                this.applyScheme(),
                this.schemeToLocalStorage();
        },
        get scheme() {
            return this._scheme;
        },
        applyScheme() {
            document.querySelector("html").setAttribute("data-theme", this.scheme);
            const e = document.querySelectorAll(this.buttonsTarget);
            e.forEach((e) => {
                const t =
                    "dark" == this.scheme ? this.change.dark : this.change.light;
                (e.innerHTML = t),
                    e.setAttribute("aria-label", t.replace(/<[^>]*>?/gm, ""));
            });
        },
        schemeToLocalStorage() {
            void 0 !== window.localStorage &&
                window.localStorage.setItem(this.localStorageKey, this.scheme);
        },
    },
        t = {
        };
    e.init();
})();

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
var selectedItem = 0;
document.addEventListener('DOMContentLoaded', function () {
  var autocomplete_list = $('#search ul.menu');
  var data = JSON.parse(localStorage.getItem('lb.data')) || [];
  if (
    !data.length ||
    (new Date() - parseInt(localStorage.getItem('lb.time'))) / 1000 > 3
  ) {
    get('/data/index.html', function (d) {
      data = JSON.parse(d);
      localStorage.setItem('lb.data', d);
      localStorage.setItem('lb.time', +new Date());
    });
  }
  var goto_menu_item = function (item) {
    document.location.href =
      '/logo/' + item.getAttribute('content').toLowerCase();
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
        '<li>Please enter at least two letters</li>';
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
    const input = e.target.value;
    for (i in data) {
      const searchStr = new RegExp(
        input
          .toLowerCase()
          .split(' ')
          .join('.*')
      );
      if (
        data[i]
          .toLowerCase()
          .split(/[\ \-]/)
          .join('')
          .search(searchStr) >= 0
      ) {
        list.push(data[i]);
      }
    }
    list.sort(function (a, b) {
      const first = a.search(input);
      const second = b.search(input);
      if (first > second) {
        return 1;
      }
      if (first < second) {
        return -1;
      }
      if (a.length > b.length) {
        return 1;
      }
      if (a.length < b.length) {
        return -1;
      }
      return 0;
    });
    for (i in list) {
      html.push(
        '<li class="menu-item" content="' +
        list[i].split('.')[0] +
        '" image="' +
        list[i] +
        '">' +
        '<a href="/logo/' +
        list[i].toLowerCase() +
        '/" >' +
        '<img src="/file/' +
        list[i].toLowerCase() +
        '.svg" />' +
        // '<div class="chip">' +
        // '<div class="chip-content">' +
        list[i].replace(/-/g, ' ') +
        // '</div>' +
        // '<div class="chip-icon">' +
        // '<img src="/files/' +
        // list[i].toLowerCase() +
        // '.svg" class="avatar" />' +
        // '</div>' +
        // '</div>' +
        '</a>' +
        '</li>'
      );
    }
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
    if (parent) {
    // if (parent && parent.className == 'menu-item') {
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
});
