const layout = document.querySelector(".layout");
const display = document.querySelector(".card");
const formWrapper = document.querySelector(".form-wrapper");
const form = formWrapper.querySelector(".form");
const add = document.querySelector(".btn-add");
const closeBtn = document.querySelector(".close");
const submit = document.querySelector(".submit");
const cardStack = document.querySelector(".card-stack");
let n = 0;
let edit;
let enable = 1;
// Book constructor
function book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// Hidding the form 
layout.removeChild(formWrapper);    

// Creating/getting the Library array in which we will store our data
let myLibrary = [];
if(localStorage.length == 0){
    let mybook = new book("Hobbit","J.J.R Tolkin",299,"Completed");
    myLibrary.push(mybook);
    AddToLocalStorage(mybook);
}
else{
    n = localStorage.length;
    for(let i = 0; i < n; i++){
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        let data = value.split("/");
        myLibrary.push(new book(data[0],data[1],data[2],data[3]));
    }
}

// EventListeners
closeBtn.addEventListener("click", () => {
    layout.removeChild(formWrapper);
    clearForm();
    enable = 1;
});
add.addEventListener("click", () => {layout.appendChild(formWrapper);});
submit.addEventListener("click",addBookToLibrary,false);

function addBookToLibrary(e){
    e.preventDefault();
    let formdata = new FormData(form);
    let title = formdata.get("title");
    let author = formdata.get("author");
    let pages = formdata.get("pages");
    let read = formdata.get("read");
    if(read === null){
        read = "";
    }
    if(title == "" || author == "" || pages == ""){
        alert("Please fill all the required data");
        return; 
    }
    if(enable){
        for(let i of myLibrary){
            if(i.title.toLowerCase() == title.toLowerCase() && i.author.toLowerCase() == author.toLocaleLowerCase()){
                console.log(enable);
                alert("This book is already present in the library");
                return;
            }
        }
        let info = new book(title,author,pages,read);
        myLibrary.push(info);
        AddToLocalStorage(info);
    }
    else{
        let change;
        let info = edit.split("|");
        let title = info[0];
        let author = info[1];
        console.log(title + " " + author);
        myLibrary = myLibrary.filter(i => i.title != title && i.author != author);
        myLibrary.push(new book(title,author,pages,read));
        for(let i = 0; i < n; i++){
            let key = localStorage.key(i);
            let value = localStorage.getItem(key);
            let data = value.split("/");
            if(title.toLowerCase() == data[0].toLowerCase() && author.toLowerCase() == data[1].toLowerCase()){
                console.log(key);
                change = key.slice(4);
                break;
            }
        }
        console.log(change);
        let push = "book" + change;
        let value = title + "/" +  author + "/" + pages + "/" + read;
        localStorage.setItem(push, value);
    }
    location.reload();
;}

// Adding the book info to the local Storage
function AddToLocalStorage(info){
    let value = info.title + "/" + info.author + "/" + info.pages + "/" + info.read;
    let push = "book" + n;
    n++;
    localStorage.setItem(push, value);
}

function clearForm(){
    let inputs = form.querySelectorAll('input[type = "text"]');
    inputs.forEach(i => i.value = "");
    form.querySelector('input[type = "number"]').value = "";
}
// Adding the new book to the DOM
book.prototype.display = function() {
    let card = document.createElement("div");
    let title = document.createElement("div");
    let author = document.createElement("div");
    let pages = document.createElement("div");
    let pgWrap = document.createElement("div");
    let pg = document.createElement("span");
    let completed = document.createElement("span");

    card.classList.add("card");
    title.classList.add("title");
    author.classList.add("author");
    pages.classList.add("pages");
    pgWrap.classList.add("pg-wrap");
    pg.classList.add("pg");
    
    title.textContent = this.title;
    author.textContent = "By, " + this.author;
    pg.textContent = "Pages : " + this.pages;
    completed.textContent = this.read;

    pgWrap.appendChild(pg);
    pgWrap.appendChild(completed);
    pages.appendChild(pgWrap);

    card.appendChild(title);
    card.appendChild(author);
    card.appendChild(pages);
    cardStack.appendChild(card);
}

// Creating all the cards
for(let i = 0; i < myLibrary.length;i++){
    myLibrary[i].display();
}

// Adding the hover class to the card with the edit and remove functions
const cards = cardStack.querySelectorAll(".card");
cards.forEach(card => card.addEventListener("mouseenter", () => {
    let cardHover = document.createElement("div");
    const btnHover1 = document.createElement("button");
    const btnHover2 = document.createElement("button");
    btnHover1.textContent = "EDIT";
    btnHover2.textContent = "REMOVE";
    btnHover1.classList.add("btn-hover");
    btnHover2.classList.add("btn-hover")
    cardHover.appendChild(btnHover1);
    cardHover.appendChild(btnHover2);
    cardHover.classList.add("card-hover");
    card.appendChild(cardHover);
    btnHover2.addEventListener("click", () => {
        let title = card.querySelector(".title").innerHTML;
        let author = card.querySelector(".author").innerHTML;
        myLibrary = myLibrary.filter(i => i.title != title && i.author != author);
        author = author.slice(4);           
        //Removing the data from local storage
        for(let i = 0; i < n; i++){
            let key = localStorage.key(i);
            let value = localStorage.getItem(key);
            let data = value.split("/");
            if(title.toLowerCase() == data[0].toLowerCase() && author.toLowerCase() == data[1].toLowerCase()){
                localStorage.removeItem(key);
                location.reload();
            }
        }
    })
    btnHover1.addEventListener("click", () => {
        enable = 0;
        layout.appendChild(formWrapper);
        let title = card.querySelector(".title").innerHTML;
        let author = card.querySelector(".author").innerHTML;
        author = author.slice(4);
        let pages = card.querySelector(".pg").innerHTML;
        pages = pages.slice(8);
        let titleChange = form.querySelector("#title");
        titleChange.value = title;
        let authorChange = form.querySelector("#author");
        authorChange.value = author;
        let pagesChange = form.querySelector("#pages");
        pagesChange.value = pages;   
        edit = title + "|" + author;   
    })
})
)


cards.forEach(card => card.addEventListener("mouseleave", () => {
    let cardHover = card.querySelector(".card-hover");
    card.removeChild(cardHover);
}))
