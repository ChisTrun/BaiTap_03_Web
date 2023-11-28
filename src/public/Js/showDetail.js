$(document).on('click', 'img', function () {
    let movieId = $(this).attr('mvid');
    window.location.href = `/detail/movies/id=${movieId}`;
});