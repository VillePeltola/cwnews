var languages = {};
var newsStories;
var types = {
  'newest': 'Uusimmat',
  'wordsearch': 'Sanahaku'
}
var newsSearch = {
  type: '',
  input: '',
  page: 1
};
var pageMax;

function main() {
  $.get('/getdata', (result) => {
    languages = result;
    var first = true;
    for (var l in result) {
      if (first === true) {
        setNewest(l);
        first = false;
      }
      $('.page_content .newest select').append('<option value="' + l + '">' + result[l] + '</option>');
    }
  });
  switchSearch('newest');

  for (var t in types) {
    $('.page_content .pc_0 [data-id="pc_0_selector"]').append('<option value="' + t + '">' + types[t] + '</option>');
  }
}

function changePage(page, spage = false) {
  if (spage === true) {
    newsSearch.page += page;
  } else {
    newsSearch.page = parseInt(page.innerHTML);
  }
  searchNews(true);
  updatePagination();
  $('#newsContainer').scrollTop(0);
}

function createCards(data) {
  $('#newsContainer .row').empty();
  for (var d in data.articles) {
    var news = data.articles[d];
    var text = news.description;

    var card = '';
    card += '<div class="col-sm-8 col-lg-4">';
    card += '<div class="card h-100" data-nid="' + d + '" onclick="showMoreNews(' + d + ')">';
    card += '<div class="card-body">';
    card += '<h5 href="' + news.url + '" class="card-title">' + news.title + '</h5>';
    card += '<h6 class="card-subtitle mb-2 text-muted">' + news.author + '</h6>';
    card += '<p class="card-text">' + text + '</p>';
    card += '</div>';
    card += '<div class="card-footer text-muted">' + news.source.name + '</div>';
    card += '</div></div>';
    $('#newsContainer .row').append(card);
  }
}

function searchNews(pag = false) {
  var input = $('#newsSearchInput').val();

  if (pag === false) {
    if (newsSearch.type === 'newest') {
      newsSearch.page = 1;
    } else if (newsSearch.type === 'wordsearch') {
      if (input.length === 0) {
        displayToast('Hakukenttä on tyhjä', 'error');
        return;
      } else {
        newsSearch.input = input;
        newsSearch.page = 1;
      }
    } else {
      displayToast('Virhe tapahtui', 'error');
      return;
    }
  }
  displayLoader(true);
  $.ajax({
    type: "post",
    url: '/getnews',
    data: newsSearch,
    success: (data) => {
      if ((data.status !== undefined) && (data.status === 'ok')) {
        if (data.totalResults > 0) {
          if (pag === false) {
            var cpages = Math.ceil(data.totalResults / 20);
            maxPage = cpages > 5 ? 5 : cpages; // 5 pages is max on free
          }
          newsStories = data;
          createCards(data);
          updatePagination();
          displayLoader(false);
        } else {
          displayToast('Tuloksia ei löytynyt', 'info');
          displayLoader(false);
        }
      } else {
        displayToast('Haku epäonnistui', 'error');
        displayLoader(false);
      }
    },
    error: (e) => {
      console.log(e);
      displayToast('Haku epäonnistui', 'error');
      displayLoader(false);
    },
    dataType: 'json'
  });
}

function setNewest(lng) {
  console.log(lng);
  newsSearch.input = lng;
}

function showMoreNews(id) {
  var nstory = newsStories.articles[id];
  window.open(nstory.url, '_blank');
}

function switchSearch(mode) {
  var m = typeof(mode) === 'string' ? mode : mode.getAttribute('value');
  newsSearch.type = m;
  var elems = $('.page_content .pc_0 [data-type]');
  for (var e of elems) {
    $(e).css('display', e.getAttribute('data-type') === m ? 'initial' : 'none');
  }
}

function updatePagination() {
  $('.paginationContainer').css('display', 'flex');
  var buttons = $('.paginationContainer .page-item');
  for (var b of buttons) {
    var bid = b.getAttribute('data-id');
    var elem = $(b);
    switch (bid) {
      case 'prev': {
        elem.toggleClass('disabled', newsSearch.page === 1);
        break;
      }
      case 'next': {
        elem.toggleClass('disabled', newsSearch.page === maxPage);
        break;
      }
      default: {
        var inc = parseInt(bid) + 1;
        var sb = $('> .page-link', b);
        var value;
        
        switch (bid) {
          case '0': {
            if (newsSearch.page < 3) {
              value = inc;
            } else if (newsSearch.page > maxPage - 3) {
              value = maxPage - 4;
            } else { value = newsSearch.page - 2; }
            break;
          }
          case '1': {
            if (newsSearch.page < 3) {
              value = inc;
            } else if (newsSearch.page >= maxPage - 2) {
              value = maxPage - 3;
            } else { value = newsSearch.page - 1; }
            break;
          }
          case '2': {
            if (newsSearch.page < 3) {
              value = inc;
            } else if (newsSearch.page >= maxPage - 1) {
              value = maxPage - 2;
            } else { value = newsSearch.page; }
            break;
          }
          case '3': {
            if (newsSearch.page < 3) {
              value = inc;
            } else if (newsSearch.page >= maxPage - 1) {
              value = maxPage - 1;
            } else { value = newsSearch.page + 1; }
            break;
          }
          case '4': {
            if (newsSearch.page < 3) {
              value = inc;
            } else if (newsSearch.page >= maxPage - 1) {
              value = maxPage;
            } else { value = newsSearch.page + 2; }
            break;
          }
        }
        elem.toggleClass('disabled', newsSearch.page === value);
        elem.css('display', value > maxPage || value <= 0 ? 'none' : '');
        sb.text(value);
      }
    }
  }
}