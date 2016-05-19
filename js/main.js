/**
 *
 * @param {string} actualWord
 * @param {object} vocabulary
 * @constructor
 */
function WordCollector(actualWord, vocabulary){
    var dictionary,
        alreadyFoundWords,
        alreadyFoundWordsContainer,
        word,
        wordContainer,
        currentWord,
        currentWordContainer,
        score,
        scoreBar,
        letterSizeDelta,
        lastUniqueId;

    /**
     * Основная инициализация(конструктор "класса")
     */
    var initialize = function(){

        //Устанавливаем параметры отображения для мобильных устройств
        configureViewport();
        //Записываем словарь со входа в переменную
        dictionary = vocabulary;
        delete dictionary[actualWord]; //Убираем из словаря текущее слово
        lastUniqueId = 0; //Уникальный идентфикатор для элементов, на которых висят обработчики
        //Разбиваем текущее слово на массив букв
        word = actualWord.split('');
        //Объект с текущими выбраными игроком буквами
        currentWord  = {};
        //Список слов, которые уже упоминались за игру
        alreadyFoundWords = {};

        letterSizeDelta = (window.innerWidth/(word.length)/90).toFixed(2);

        createWordContainer();
        createCurrentWordContainer();
        createScoreBar();
        createAlreadyFoundWordsContainer();

        document.body.appendChild(wordContainer);
        document.body.appendChild(currentWordContainer);
        document.body.appendChild(alreadyFoundWordsContainer);
        document.body.appendChild(scoreBar);
    };


    var configureViewport = function(){
        var viewportMeta = document.querySelector("meta[name=viewport]");
        if(viewportMeta){
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0');
        } else {
            viewportMeta =document.createElement('meta');
            viewportMeta.name = "viewport";
            viewportMeta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
            document.getElementsByTagName('head')[0].appendChild(viewportMeta);
        }
    };

    /**
     * Возвращает "пропорциональное" значение для элементов с буквами
     *
     * Таким образом пытаемся уместить слово на любом экране
     *
     * @param {number} value
     * @returns {number}
     */
    var deltaAffected = function(value){
        return letterSizeDelta * value;
    };


    /**
     * Создаем контейнер для текущего актуального слова
     */
    var createWordContainer = function(){
        wordContainer  = document.createElement("div");
        wordContainer.style.textAlign = "center";
        var letters = [];
        for(var i in word){
            if(!word.hasOwnProperty(i)){
                continue;
            }
            var letter = createLetterTemplate(word[i]);
            //Подвязываем необходимые обработчики
            bindLetterHandlers(letter);

            //Добавляем в список доступных к использованию букв
            letters.push(letter);
            //Добавляем букву в контейнер с текущим словом
            wordContainer.appendChild(letter);
        }

        wordContainer.toDefault = function(){
            for(var i in letters){
                if(!letters.hasOwnProperty(i)){
                    continue;
                }
                letters[i].setInactive();
            }
        }
    };

    /**
     * Создаем контейнер для текущего введенного слова
     */
    var createCurrentWordContainer = function(){
        currentWordContainer = document.createElement("div");
        currentWordContainer.style.textAlign = "center";
        currentWordContainer.style.marginTop = "20px";
    };


    /**
     * Создаем экземпляр нового элемента, в котором содержится буква
     *
     * @param  {string} letter непосредственно сама буква
     * @returns {Element}
     */
    var createLetterTemplate = function(letter){
        var letterTemplate = document.createElement("span");
        letterTemplate.style.cursor       = "pointer";
        letterTemplate.style.padding      = "0px " + deltaAffected(22) + "px " + deltaAffected(6) + "px";
        letterTemplate.style.borderRadius = deltaAffected(5) + "px";
        letterTemplate.style.border       = "1px solid gray";
        letterTemplate.style.margin       = "0 " + deltaAffected(3) + "px";
        letterTemplate.style.fontSize     = deltaAffected(60) + "px";
        letterTemplate.innerHTML          = letter;

        return letterTemplate;
    };

    /**
     * Подвязывает все необходимые обработчики на элемент, внутри которого содержится буква
     *
     * @param {object} letter DOM-элемент с буквой
     */
    var bindLetterHandlers = function(letter){

        letter.active = false;
        //Идентификатор должен быть буквенным, чтобы его обозначение не превращалось в индекс массива и корректно обрабатывались
        //удаление и добвление букв посреди написанного слова
        letter.identifier     = 'letter' + ++lastUniqueId;

        //Добавляем возможность переключать кнопку на активное состояние
        letter.setActive = function(){
            this.active = true;
            currentWord[this.identifier] = this.innerHTML;
            this.style.backgroundColor = "rgba(191, 255, 201, 0.6)";
        };

        //Добавляем возможность "сбросить" отображение к исходному(неактивному) значению
        letter.setInactive = function(){
            this.active = false;
            //Иначе удаляем ее из текущего вводимого слова
            delete currentWord[this.identifier];
            //И откатываем отображение к исходному
            this.style.backgroundColor = "transparent";
        };


        //Вешаем обработчик при клике на элемент
        letter.onclick   = function(){
            this.active ? this.setInactive() : this.setActive();

            //Проверяем, сложилось ли слово после очередной добавленной или убранной буквы
            checkValidWord();
            //После каждого изменения статуса буквы, "отрисовываем" контейнер с вводимым словом
            renderCurrentWordContainer();
        };
    };

    /**
     * Создает "табло" с текущим счетом игрока
     */
    var createScoreBar = function(){
        score = 0;
        scoreBar = document.createElement("span");
        scoreBar.style.boxShadow = "0 0 3px green";
        scoreBar.style.border    = "1px solid rgba(0,255,0, 0.8)";
        scoreBar.style.color     = "green";
        scoreBar.style.padding   = "0 15px 0";
        scoreBar.style.fontSize  = "37px";
        scoreBar.style.position  = "fixed";
        scoreBar.style.bottom    = "1%";
        scoreBar.style.left      = "1%";
        renderScoreBar();
    };


    /**
     * Возвращает количество очков, которое дается за переданное слово
     *
     * @param {string} word слово, для которого пытаемся подсчитать очки
     * @returns {number} подсчитанное количество очков
     */
    var calculatePoints = function(word){
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


    /**
     * Обновляет текуще количество очков игрока
     */
    var renderScoreBar = function(){
        scoreBar.innerHTML = 'Счет: ' + score;
    };

    /**
     * Создает контейнер для уже найденных слов
     */
    var createAlreadyFoundWordsContainer = function(){
        alreadyFoundWordsContainer = document.createElement("div");
        alreadyFoundWordsContainer.style.margin     = "40px auto";
        alreadyFoundWordsContainer.style.fontSize   = "32px";
        alreadyFoundWordsContainer.style.maxWidth   = "95%";
        alreadyFoundWordsContainer.style.width      = "400px";
        alreadyFoundWordsContainer.style.height     = "400px";
        alreadyFoundWordsContainer.style.overflowY  = "scroll";
        alreadyFoundWordsContainer.style.textAlign  = "center";
        alreadyFoundWordsContainer.style.boxShadow  = "2px 2px 10px black";
    };

    /**
     * Обновляет контейнер с даными о уже найденных словах
     */
    var renderAlreadyFoundWordsContainer = function(){
        alreadyFoundWordsContainer.innerHTML = '';
        for(var i in alreadyFoundWords){
            if(!alreadyFoundWords.hasOwnProperty(i)){
                continue;
            }
            alreadyFoundWordsContainer.innerHTML = i + " | " + alreadyFoundWords[i] + " очков<hr>" + alreadyFoundWordsContainer.innerHTML;
        }
    };


    /**
     * Обновляет контейнер с вводимым словом
     */
    var renderCurrentWordContainer = function(){
        currentWordContainer.innerHTML = '';
        for(var j in currentWord){
            if(!currentWord.hasOwnProperty(j)){
                continue;
            }
            var newLetter = createLetterTemplate(currentWord[j]);
            currentWordContainer.appendChild(newLetter);
        }
    };

    /**
     * Проверяет уже введенное слово на валидность.
     * Проводит вcе необходимое пост-операции(рендер, подсчет очков) при нахождении совпадения в словаре
     */
    var checkValidWord = function(){
        var word = '';
        for(var j in currentWord) {
            if(!currentWord.hasOwnProperty(j)){
                continue;
            }
            word += currentWord[j];
        }

        if(dictionary.hasOwnProperty(word)){
            //Increases current score and also set value of word in list of already found
            alreadyFoundWords[word] = calculatePoints(word);
            delete dictionary[word];
            currentWord = {};
            wordContainer.toDefault();
            renderScoreBar();
            renderAlreadyFoundWordsContainer();
        }
    };


    initialize();
}