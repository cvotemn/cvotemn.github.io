document.addEventListener('DOMContentLoaded', () => {

   // DECLARE VARIABLES
    //Game Board
    const wordleContainer = document.querySelector('.gridWordle');
    let wordleWords = [];
    
    //Get Possible Words
    fnReadWords();
    openKeyBoard();

    //Reset Button
    const btnReset = document.querySelector('button.btnReset');
    //Last Letter entered - used to allow for backspace delete
    let wordleLastCell = document.querySelector('.wrdCell-Unlocked');
    //Random Word
    let wordleWord; // = wordleWords[Math.floor(Math.random() * wordleWords.length)];
    //Score
    let score = 1000;

   //CREATE BOARD
   //6 rows of 5 cells each
    for (let index = 0; index < 30; index++) {
        let element = document.createElement('div');
        //add wrdCell class to each cell
        element.classList.add('wrdCell');
        //add wrdCell-Unlocked class to first row of cells
        (index < 5) ? element.classList.add('wrdCell-Unlocked') : element.classList.add('wrdCell-Locked');
        wordleContainer.appendChild(element);
    }

    //Start listening for keypresses
    // document.querySelectorAll('.wrdCell').forEach(cell => {
    //     cell.trigger('focus');
    // });

    document.addEventListener('keyup', (e) => {
        let cell = document.querySelector('.wrdCell-Unlocked');
        switch (true) {
            //was backspace key pressed in the current unlocked row?
            case e.key === "Backspace" && !wordleLastCell.classList.contains('wrdCell-Checked'):
                //unlock the previous cell and clear the value
                wordleLastCell.classList.remove('wrdCell-Locked');
                wordleLastCell.classList.add('wrdCell-Unlocked');
                wordleLastCell.innerHTML = '';
                //reset the wordleLastCell variable
                wordleLastCell = cell.previousSibling;
                break;

            //was a letter key pressed in the current unlocked row? 
            case e.code.substring(0,3) === "Key":
                //if the cell is not locked, add the letter to the cell
                fnWrite(e.key, cell);
                break;
            
            //was the enter key pressed in the current unlocked row?
            case e.key === "Enter" && document.querySelectorAll('.wrdCell-Unlocked').length === 0:
                //check if the word is correct
                fnCheckWord();
                //disable the Start Game button
                btnReset.disabled = true;
                break;
        }
    });

    //When reset button is pressed, clear the board and Start Game again
    btnReset.addEventListener('click', fnReset);

   //FUNCTIONS
    //Write the letter pressed to the next unlocked cell
    function fnWrite(letter, cell) {
        if(cell.classList.contains('wrdCell-Unlocked')) {
            cell.innerHTML = letter;
            //lock the cell and set it as part of the new word
            cell.classList.add('wrdCell-Locked', 'wrdCell-New');
            cell.classList.remove('wrdCell-Unlocked');
            //set the wordleLastCell variable to the current cell
            wordleLastCell = cell;
        }
    }

    //Check if the word is correct
    function fnCheckWord() {
        //put the letters from the correct word into an array
        let wrdLetters = wordleWord.split('');
        //put the letters from the guessed word into an array
        let wordCell = document.querySelectorAll('.wrdCell-New');
        let indx = 0; //index for the guessed word letters
        let intValid = 0; //number of valid letters in the guessed word

        wordCell.forEach(element => {
            //if the letter in the guessed word matches the letter in the correct word
            if(wrdLetters.includes(element.innerHTML)) {
                //add the correct letter to the cell
                if(indx === wrdLetters.indexOf(element.innerHTML)) {
                    //add the ValidCell class to the cell
                    element.classList.add('wrdValidLetter-ValidCell');
                    intValid ++;
                }else{
                    //add the InvalidCell class to the cell
                    element.classList.add('wrdValidLetter-InvalidCell');
                }
            }else{
                element.classList.add('wrdInvalidLetter');
            }
            //increment the index and add the wrdCell-Checked class to the cell
            element.classList.add('wrdCell-Checked');
            element.classList.remove('wrdCell-New');
            indx++;

        });
        //if the number of valid letters in the guessed word is equal to the number of letters in the correct word
        if(intValid === 5) {
            //alert the user that the word is correct and display the score
            alert ('You Win! \n \n Your score is ' + score);
        }else{
            //unlock the next row of cells
            fnUnlockRow();
        }
        btnReset.disabled = intValid === 5 ? true : false;
    }

    //Unlock the next row of cells
    function fnUnlockRow(){
        let wrdRow = document.querySelectorAll('.wrdCell-Locked:not(.wrdCell-New):not(.wrdCell-Checked)');

        //check if there are available cells to unlock
        if (wrdRow.length === 0) { alert("Game Over!"); btnReset.disabled = false; }

        //unlock the next row of cells
        for (let index = 0; index < 5; index++) {
            wrdRow[index].classList.remove('wrdCell-Locked');
            wrdRow[index].classList.add('wrdCell-Unlocked');
        }

        //decrement the score
        score -= 200;
    }


    //Reset the game
    function fnReset() {
        let wrdCells = document.querySelectorAll('.wrdCell');
        //reset the cells
        wrdCells.forEach(element => {
            element.classList.remove('wrdCell-Unlocked', 'wrdCell-Checked', 'wrdValidLetter-ValidCell', 'wrdValidLetter-InvalidCell', 'wrdInvalidLetter');
            element.innerHTML = '';
            element.classList.add('wrdCell-Locked');
        });

        //reset the wordleWord variable and the score
        wordleWord = wordleWords[Math.floor(Math.random() * wordleWords.length)];
        score = 1000;

        //unlock the first row of cells
        for (let index = 0; index < 5; index++) {
            wrdCells[index].classList.remove('wrdCell-Locked');
            wrdCells[index].classList.add('wrdCell-Unlocked');
        }
        btnReset.disabled = true;
    }

    //Read the words from the words.txt file
    function fnReadWords() {
        //read the words from the words.txt file
        fetch('words.txt')
            .then(response => response.text())
            .then(data => {
                wordleWords = data.split('\n');
                wordleWord = wordleWords[Math.floor(Math.random() * wordleWords.length)];
        });
    }


    function openKeyBoard(){
        document.getElementById("dummyInput").click();
        setTimeout(function(){
            document.getElementById("dummyInput").focus()},1)
        return "keyboard open";
    
    }
});