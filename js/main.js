function WordCollector(actualWord, vocabulary){
    var _this = this;
    var dictionary,
        alreadyFoundWords,
        alreadyFoundWordsContainer,
        word,
        currentWord,
        wordContainer,
        currentWordContainer,
        score,
        scoreBar;

    var initialize = function(){
        //Actual vocabulary initialize
        dictionary = vocabulary;
        //Active base word splited into array of letters
        word = actualWord.split('');
        //Current input word(tis container for temp letters)
        currentWord  = {};
        //List of words that have been matched
        alreadyFoundWords = {};

        createWordContainer();
        createCurrentWordContainer();
        createScoreBar();
        createAlreadyFoundWordsContainer();

        document.body.appendChild(wordContainer);
        document.body.appendChild(currentWordContainer);
        document.body.appendChild(alreadyFoundWordsContainer);
        document.body.appendChild(scoreBar);
    };


    var createWordContainer = function(){
        wordContainer  = document.createElement("div");
        wordContainer.style.textAlign = "center";
        var letters = [];
        for(var i in word){
            if(!word.hasOwnProperty(i)){
                continue;
            }
            var letter       = createLetterTemplate(word[i]);
            letter.id        = "pos-" + ++i; --i;

            letter.onclick   = function(){
                var isActive = this.getAttribute("isactive");
                isActive = Math.pow(isActive, isActive) - isActive;
                this.setAttribute("isactive", isActive);

                if(this.getAttribute("isactive") == 1){
                    currentWord[this.id] = this.innerHTML;
                    this.style.backgroundColor = "rgba(191, 255, 201, 0.6)";
                } else{
                    delete currentWord[this.id];
                    this.style.backgroundColor = "transparent";
                }

                renderCurrentWordContainer();
            };

            letter.toDefault = function(){
                this.style.backgroundColor = "transparent";
                this.setAttribute("isactive", 0);
            };

            letters.push(letter);
            wordContainer.appendChild(letter);
        }

        wordContainer.toDefault = function(){
            for(var i in letters){
                if(!letters.hasOwnProperty(i)){
                    continue;
                }
                letters[i].toDefault();
            }
        }
    };

    var createCurrentWordContainer = function(){
        currentWordContainer = document.createElement("div");
        currentWordContainer.style.textAlign = "center";
        currentWordContainer.style.marginTop = "20px";
    };


    var createLetterTemplate = function(htmlContent){
        var letterTemplate = document.createElement("span");
        letterTemplate.setAttribute("isactive", "0");
        letterTemplate.style.padding      = "0px 20px 4px";
        letterTemplate.style.borderRadius = "5px";
        letterTemplate.style.border       = "1px solid gray";
        letterTemplate.style.margin       = "0 3px";
        letterTemplate.style.cursor       = "pointer";
        letterTemplate.style.fontSize     = "40px";
        letterTemplate.innerHTML          = htmlContent;

        return letterTemplate;
    };

    var createScoreBar = function(){
        score = 0;
        scoreBar = document.createElement("span");
        scoreBar.style.boxShadow = "0 0 3px green";
        scoreBar.style.border = "1px solid rgba(0,255,0, 0.8)";
        scoreBar.style.color     = "green";
        scoreBar.style.padding   = "0 15px 0";
        scoreBar.style.fontSize  = "37px";
        scoreBar.style.position  = "fixed";
        scoreBar.style.top       = "1%";
        scoreBar.style.left      = "1%";
        renderScoreBar();
    };


    var increaseScore = function(word){
        var bonus = 0;
        var wordLength = word.length;
        if(wordLength > 9){
            bonus = wordLength/2;
        } else if(wordLength > 6){
            bonus = Math.floor(wordLength/4);
        } else if(wordLength > 2){
            bonus = 1;
        } else{
            bonus = 0;
        }
        score += (bonus + wordLength) * 10;

        return (bonus + wordLength) * 10;
    };

    var createAlreadyFoundWordsContainer = function(){
        alreadyFoundWordsContainer = document.createElement("div");
        alreadyFoundWordsContainer.style.margin     = "40px auto";
        alreadyFoundWordsContainer.style.fontSize   = "32px";
        alreadyFoundWordsContainer.style.width      = "400px";
        alreadyFoundWordsContainer.style.height     = "400px";
        alreadyFoundWordsContainer.style.overflowY  = "scroll";
        alreadyFoundWordsContainer.style.textAlign  = "center";
        alreadyFoundWordsContainer.style.boxShadow  = "2px 2px 10px black";
    };

    var renderAlreadyFoundWordsContainer = function(){
        alreadyFoundWordsContainer.innerHTML = '';
        for(var i in alreadyFoundWords){
            if(!alreadyFoundWords.hasOwnProperty(i)){
                continue;
            }
            alreadyFoundWordsContainer.innerHTML += i + " | " + alreadyFoundWords[i] + " очков<hr>";
        }
    };

    var renderScoreBar = function(){
        scoreBar.innerHTML = score;
    };


    var renderCurrentWordContainer = function(){
        currentWordContainer.innerHTML = '';
        var checker = '';
        for(var j in currentWord){
            if(!currentWord.hasOwnProperty(j)){
                continue;
            }
            var newLetter = createLetterTemplate(currentWord[j]);
            checker += currentWord[j];
            currentWordContainer.appendChild(newLetter);
        }

        checkCorrectWord(checker);
    };

    var checkCorrectWord = function(word){
        if(dictionary.hasOwnProperty(word)){
            //Increases current score and also set value of word in list of already found
            alreadyFoundWords[word] = increaseScore(word);
            delete dictionary[word];
            currentWord = {};
            wordContainer.toDefault();
            renderCurrentWordContainer();
            renderScoreBar();
            renderAlreadyFoundWordsContainer();
        }
    };


    initialize();
}