class SearchEngine {
    constructor() {

        this.imageArray = 0;
        this.paginationUrl;

        this.loadURL = async function (url) {
            let result = [];
            await fetch(url)
                .then(response => response.json())
                .then(commits => {
                    commits.map((e) => { result.push(e) })
                });
            return result;
        };

        this.pageCount = function (url, limit) {
            console.log('url : ', url);
            this.loadURL(url).then(e => {
                this.setPage(e.length, limit)
            });
        };

        this.setPage = function (imageCount, limit) {
            let pages = parseInt(imageCount / limit);
            const list = document.getElementById("pagination");

            while (list.hasChildNodes()) {
                list.removeChild(list.firstChild);
            }

            for (let i = 1; i <= pages; i++) {
                const page = document.createElement('a');
                page.className = 'page';
                page.innerHTML = i;
                page.tabIndex = '1';
                page.onclick = () => { this.loadPage(i, limit) }
                const pageCover = document.getElementById('pagination');
                pageCover.append(page);

            }
        };

        this.loadPage = function (pageNumber, limit) {
            let baseUrl = this.paginationUrl;
            let newUrl = baseUrl + `&limit=${limit}&page=${pageNumber}`;
            console.log(`baseurl :  ${newUrl}`)
            const list = document.getElementById("imageCollection");
            while (list.hasChildNodes()) {
                list.removeChild(list.firstChild);
            }

            let result = this.loadURL(newUrl);
            result.then((e) => {
                e.map((element) => {
                    const image = document.createElement("img");
                    image.src = element.url;
                    let cover = document.createElement("div");
                    cover.className = 'image_container'
                    cover.append(image);
                    document.getElementById('imageCollection').append(cover)
                });
            })
        }
    }
}

class BreedSelector {
    constructor() {
        fetch('https://api.thecatapi.com/v1/breeds')
            .then(response => response.json())
            .then(commits => {
                commits.map(
                    (e) => {
                        let option = document.createElement('option');
                        option.innerHTML = `${e.name}`;
                        option.value = `${e.id}`
                        document.getElementById('breedSelector').append(option);
                    })
            });
    }
};

class CategorySelector {
    constructor() {
        fetch('https://api.thecatapi.com/v1/categories')
            .then(response => response.json())
            .then(commits => {
                commits.map(
                    (e) => {
                        let option = document.createElement('option');
                        option.innerHTML = `${e.name}`;
                        option.value = `${e.id}`
                        document.getElementById('categorySelector').append(option);
                    })
            });
    }
}

let defaultLoader = function () {
    new BreedSelector();
    new CategorySelector();
    let search = new SearchEngine();

    let loader = function (event) {
        let categorySelector = document.getElementById('categorySelector');
        let breedSelector = document.getElementById('breedSelector');
        let typeSelector = document.getElementById('typeSelector');
        let orderSelector = document.getElementById('orderSelector');
        let limitSelector = document.getElementById('limitSelector');

        let category = categorySelector.options[categorySelector.selectedIndex].value;
        let breed = breedSelector.options[breedSelector.selectedIndex].value;
        let type = typeSelector.options[typeSelector.selectedIndex].value;
        let order = orderSelector.options[orderSelector.selectedIndex].value;
        let limit = limitSelector.options[limitSelector.selectedIndex].value;

        if (order === 'null') {
            order = 'random';
        } if (type === 'null') {
            type = 'All';
        } if (limit === 'null') {
            limit = 9;
        } if (category == "none") {
            category = '';
        } if (breed == "none") {
            breed = '';
        }

        const list = document.getElementById("imageCollection");
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }

        let url = `https://api.thecatapi.com/v1/images/search?limit=${limit}&order=${order}&mime_types=${type}&category_ids=${category}&breed_ids=${breed}`
        let result = search.loadURL(url);
        result.then((e) => {
            e.map((element) => {
                const image = document.createElement("img");
                image.src = element.url;
                let cover = document.createElement("div");
                cover.className = 'image_container'
                cover.append(image);
                document.getElementById('imageCollection').append(cover)
            });
        })
        search.paginationUrl = `https://api.thecatapi.com/v1/images/search?order=${order}&mime_types=${type}&category_ids=${category}&breed_ids=${breed}`;

        search.pageCount(`https://api.thecatapi.com/v1/images/search?limit=100&order=${order}&mime_types=${type}&category_ids=${category}&breed_ids=${breed}`, limit);
    };

    (function () {
        let temp = document.getElementById('navBar').getElementsByTagName('button')[0];
        temp.addEventListener('click', loader);

        let searchResult = search.loadURL(`https://api.thecatapi.com/v1/images/search?limit=8`);

        searchResult.then((e) => {
            e.map((element) => {
                const image = document.createElement("img");
                image.src = element.url;
                let cover = document.createElement("div");
                cover.className = 'image_container';
                cover.append(image);
                document.getElementById('imageCollection').append(cover)
            })
        })
    })();
}

window.onload = defaultLoader;