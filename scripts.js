const catVals = [];
const catEntryVals = [];
let diceRoll;

function displayCategoryEntry(stepNum)
{
    let index=0;
    for (let cat=1; cat<=4; cat++){
        for (let entry=1; entry<=4; entry++){
            if (catEntryVals[index] !== "")
                document.getElementById("Step"+stepNum+"Cat"+cat+"Entry"+entry).value = catEntryVals[index];
            else
                document.getElementById("Step"+stepNum+"Cat"+cat+"Entry"+entry).style.display="none";
            index++;
        }
    }
}

//"sleep() function in JS"
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ms = 1000;

//eliminate category entry until one entry remains per category
async function step4(){
    document.getElementById("step3").style.display="none";
    document.getElementById("step4").style.display="block";

    //add any custom categories
    for(let i=0; i<4; i++){
        document.getElementById("step4Cat"+ (i+1)).innerText = catVals[i];
    }
 
    let cat1 = 4, cat2 = 4, cat3 = 4, cat4 = 4;
    let currIndex = 0;
    
    while (cat1 > 1 || cat2 > 1 || cat3 > 1 || cat4 > 1) {

        //roll dice
        currIndex = (currIndex + diceRoll) % 16;

        let safety = 0;
        let found = false;

        while (safety < 16) {
            // Check if this index is valid for elimination
            const isEmpty = catEntryVals[currIndex] === "";
            const isCat1 = currIndex >= 0 && currIndex <= 3;
            const isCat2 = currIndex >= 4 && currIndex <= 7;
            const isCat3 = currIndex >= 8 && currIndex <= 11;
            const isCat4 = currIndex >= 12 && currIndex <= 15;

            const catFullEnough = 
                (isCat1 && cat1 > 1) ||
                (isCat2 && cat2 > 1) ||
                (isCat3 && cat3 > 1) ||
                (isCat4 && cat4 > 1);

            if (!isEmpty && catFullEnough) {
                found = true;
                break; // valid target found
            }

            // Otherwise, move to next index
            currIndex = (currIndex + 1) % 16;
            safety++;
        }

        if (!found) {
            console.warn("No valid entry found. Ending early to prevent infinite loop.");
            break;
        }

        // Eliminate
        //console.log(`Eliminating index ${currIndex} → "${catEntryVals[currIndex]}"`);

        if (currIndex <= 3) {
            catEntryVals[currIndex] = "";
            cat1--;
            displayCategoryEntry(4);
            await wait(ms);

        } else if (currIndex <= 7) {
            catEntryVals[currIndex] = "";
            cat2--;
            displayCategoryEntry(4);
            await wait(ms);
        } else if (currIndex <= 11) {
            catEntryVals[currIndex] = "";
            cat3--;
            displayCategoryEntry(4);
            await wait(ms);
        } else {
            catEntryVals[currIndex] = "";
            cat4--;
            displayCategoryEntry(4);
            await wait(ms);
        }
    }
    alert("DONE! Thank you and go have fun!");
    document.getElementById("step4Btn").style.display="block";

}

function gcd(a, b) {
    while (b !== 0) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

//reduce cycle
function getRandomCoprime(min, max, coprimeTo) {
    let num;
    do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (gcd(num, coprimeTo) !== 1);
    return num;
}

//get random number
function step3(){
    document.getElementById("step2").style.display="none";
    document.getElementById("step3").style.display="block";

    document.getElementById('step3NextBtn').addEventListener('click',step4);

    document.getElementById("getRandNumBtn").addEventListener('click', ()=>{
        alert("May luck be on your side! 🍀");
        const randNumFieldEl = document.getElementById("randNumField");
        diceRoll = getRandomCoprime(5, 100, 16);
        randNumFieldEl.innerText="Your roll: [" + diceRoll + ']';
        randNumFieldEl.style.display="block";
        document.getElementById('step3NextBtn').style.display="block";
    });
}


//fill in category
function step2(){
    //add any custom categories
    for(let i=0; i<4; i++){
        document.getElementById("step2Cat"+ (i+1)).innerText = catVals[i];
    }

    //collect all categories entries
    document.getElementById("step2Btn").addEventListener("click", ()=>{
        for (let cat=1; cat<=4; cat++){
            for (let entry=1; entry<=4; entry++){
                console.log(document.getElementById("Cat"+cat+"Entry"+entry).value);
                catEntryVals.push(document.getElementById("Cat"+cat+"Entry"+entry).value);
            }
        }
        step3();
    });
}

//establish category
function step1(){
        //grab all categories values
        let catVal = document.getElementById("cat1").value === ""? "Dinner" : document.getElementById("cat1").value;
        catVals.push(catVal);

        catVal = document.getElementById("cat2").value === ""? "Activity" : document.getElementById("cat2").value;
        catVals.push(catVal);

        catVal = document.getElementById("cat3").value === ""? "Treat" : document.getElementById("cat3").value;
        catVals.push(catVal);

        catVal = document.getElementById("cat4").value === ""? "Entertainment" : document.getElementById("cat4").value;
        catVals.push(catVal);

        document.getElementById("step1").style.display="none";
        document.getElementById("step2").style.display="block";

        step2();
}


window.onload = function () {
    document.getElementById("step2").style.display="none";
    document.getElementById("step1Btn").addEventListener('click', step1);
}

