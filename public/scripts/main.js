$(document).ready(() => {
    $(document.body).on('click', '.clickable-posts[data-clickable=true]', (e) => {
        let href = $(e.currentTarget).data('href');
        window.location = href;
    });
});