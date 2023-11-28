$('.carouselTopRating').children().first().addClass('active')

  const getTopBoxOffice = async () => {
    let data = await fetch(`/api/movies/topboxoffice/nitem=9`);
    data = await data.json();
    let perSlide = 3;
    let nSlide = Math.ceil(data.perPage / perSlide);
    for (let i = 0; i < nSlide; i++) {
      let htmlString = `<div class="carousel-item">
        <div  class="d-flex justify-content-center" >              
        </div>
        </div>`;
      let domObject = $(htmlString);
      if (i == 0) domObject.addClass('active')
      for (let j = 0; j < perSlide; j++) {
        if (data.movies[i * 3 + j] != undefined) {
          domObject.children().append(`
            <div class=" d-flex zoom  justify-content-center align-items-center  w-25 m-1 ">
              <div style="width: 100%">
                <img mvid="${data.movies[i * 3 + j].id}"  src="${data.movies[i * 3 + j].image}" class="d-block w-100  m-1 z-index" alt="">
              </div>
            </div>
        `)
        }
      }
      $('.boInner').append(domObject);
    }
  }
  const getTopFav = async () => {
    let data = await fetch(`/api/movies/topfav/nitem=9`);
    data = await data.json();
    console.log(data)
    let perSlide = 3;
    // if(perSlide)
    let nSlide = Math.ceil(data.movies.length / perSlide);
    for (let i = 0; i < nSlide; i++) {
      let htmlString = `<div class="carousel-item">
        <div  class="d-flex justify-content-center" >              
        </div>
        </div>`;
      let domObject = $(htmlString);
      if (i == 0) domObject.addClass('active')
      for (let j = 0; j < perSlide; j++) {
        if (data.movies[i * 3 + j] != undefined) {
          domObject.children().append(`
            <div class=" d-flex zoom  justify-content-center align-items-center  w-25 m-1 ">
              <div style="width: 100%">
                <img mvid="${data.movies[i * 3 + j].id}"  src="${data.movies[i * 3 + j].image}" class="d-block w-100  m-1 z-index" alt="">
              </div>
            </div>
        `)
        }
      }
      $('.boInner2').append(domObject);
    }
  }
  getTopBoxOffice();
  getTopFav();

  