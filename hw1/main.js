// Image switcher code

let myImage = document.querySelector('img');

myImage.onclick = function() {
  let mySrc = myImage.getAttribute('src');
  if(mySrc === 'images/hors.jpg') {
    myImage.setAttribute ('src','images/cow.jpg');
  } else {
    myImage.setAttribute ('src','images/hors.jpg');
  }
}

let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');

function setUserName() {
  let myName = prompt('Please enter your name.');
  if(!myName) {
    setUserName();
  } else {
    if(myName == "Thad"){
      localStorage.setItem('name', myName);
    myHeading.innerHTML = 'Welcome back, Master';
    }
    else{
    localStorage.setItem('name', myName);
    myHeading.innerHTML = 'Welcome to my website, ' + myName.charAt(0).toUpperCase() + myName.slice(1);
    };
  };
  }


if(!localStorage.getItem('name')) {
  setUserName();
} else {
  let storedName = localStorage.getItem('name');
  myHeading.innerHTML = 'Welcome to my website, ' + storedName.charAt(0).toUpperCase() + storedName.slice(1);
};


myButton.onclick = function() {
  setUserName();
}