const layout = document.querySelector(".layout");
const display = document.querySelector(".card");
const formWrapper = document.querySelector(".form-wrapper");
const form = formWrapper.querySelector(".form");
const add = document.querySelector(".btn-add");
const closeBtn = document.querySelector(".close");
const submit = document.querySelector(".submit");
const cardStack = document.querySelector(".card-stack");

// Hidding the form to add books 
layout.removeChild(formWrapper);    

// Creating/getting the Library array in which we will store our data
let myLibrary = [];
let n = 0;
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
closeBtn.addEventListener("click", () => {layout.removeChild(formWrapper);});
add.addEventListener("click", () => {layout.appendChild(formWrapper);});
submit.addEventListener("click",addBookToLibrary,false);

// Book constructor
function book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

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
    for(let i of myLibrary){
        if(i.title.toLowerCase() == title.toLowerCase()){
            alert("This book is already present in the library");
            return;
        }
    }
    if(title == "" || author === "" || pages === ""){
        alert("Please fill all the required data");
        return; 
    }
    let info = new book(title,author,pages,read);
    myLibrary.push(info);
    AddToLocalStorage(info);
    location.reload();
}

// Adding the book info to the local Storage
function AddToLocalStorage(info){
    let value = info.title + "/" + info.author + "/" + info.pages + "/" + info.read;
    let push = "book" + n;
    n++;
    localStorage.setItem(push, value);
}

function clearForm(){
    console.log("working");
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
    pg.setAttribute("style", "text-align:left");
    completed.style.textAlign = "right";
    
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

for(let i = 0; i < myLibrary.length;i++){
    myLibrary[i].display();
}
