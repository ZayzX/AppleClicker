let currentApple = 0;
let totalApple = 0;
let applePerClick = 1;

let currentAppleP = document.getElementById("CurrentApple");
let totalAppleP = document.getElementById("totalApple");
let soundClick = document.getElementById("sound");

function ClickApple() {
    currentApple += applePerClick;
    totalApple += applePerClick;

    currentAppleP.textContent = "Current Apple: " + currentApple + " 🍎";
    totalAppleP.textContent = "Total Apple: " + totalApple + " 🍎";
    
    soundClick.currentTime = 0;
    soundClick.play();
}