function displayLoader(show) {
  $('.loader').css('display', show === true ? 'flex' : '');
}

function displayToast(title, type) {
  const TOAST_CONTAINER_HTML = '<div id="toast-container" aria-live="polite" aria-atomic="true"></div>';
  const TOAST_WRAPPER_HTML = '<div id="toast-wrapper"></div>';

    if (!$('#toast-container').length) {
      $('body').prepend(TOAST_CONTAINER_HTML);

      $('#toast-container').append(TOAST_WRAPPER_HTML);
    }

    let bgHeaderClass = '';
    let fgHeaderClass = '';
    let fgSubtitle = 'text-muted';
    const delay = 5000;

    switch (type) {
      case 'info':
        bgHeaderClass = 'bg-info';
        fgHeaderClass = 'text-white';
        fgSubtitle = 'text-white';
        fgDismiss = 'text-white';
        break;

      case 'success':
        bgHeaderClass = 'bg-success';
        fgHeaderClass = 'text-white';
        fgSubtitle = 'text-white';
        fgDismiss = 'text-white';
        break;

      case 'warning':
      case 'warn':
        bgHeaderClass = 'bg-warning';
        fgHeaderClass = 'text-white';
        fgSubtitle = 'text-white';
        fgDismiss = 'text-white';
        break;

      case 'error':
      case 'danger':
        bgHeaderClass = 'bg-danger';
        fgHeaderClass = 'text-white';
        fgSubtitle = 'text-white';
        fgDismiss = 'text-white';
        break;
    }

    let html = '';
    html += '<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="' + delay + '">';
    html += '<div class="toast-header ' + bgHeaderClass + ' ' + fgHeaderClass + '">';
    html += '<strong class="mr-auto">' + title + '</strong>';
    html += '<small class="' + fgSubtitle + '"></small>';
    html += '</div></div>';

    $('#toast-wrapper').append(html);
    $('#toast-wrapper .toast:last').toast('show');
}