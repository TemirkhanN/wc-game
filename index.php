<?php
session_start();

$randomWordsMinLength = 8;

$dictionary = file(__DIR__ . '/dictionary.txt');

$longWords = [];

array_walk($dictionary, function (&$word) use(&$longWords, $randomWordsMinLength){
    $word = trim($word);
    if ( mb_strlen($word) > $randomWordsMinLength ) {
        $longWords[] = $word;
    }
});

if(isset($_GET['new_word'])){
    $_SESSION['baseWord'] = '';
    header("Location:" . strtok($_SERVER["REQUEST_URI"],'?'));
    exit();
}


if(empty($_SESSION['baseWord'])) {
    $_SESSION['baseWord'] = $longWords[array_rand($longWords)];
}

$word = $_SESSION['baseWord'];
?>
<html>
<head>
    <meta charset="UTF-8">
    <title>Анаграммер</title>
    <script type="text/javascript" src="js/main.js"></script>
</head>
<style>
    span{
        -webkit-user-select: none; /* Chrome/Safari */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* IE10+ */
        -o-user-select: none; /*Opera*/
        user-select: none;
    }
</style>
<body>
</body>

<script>
    (function() {
        var baseWord      = '<?=$word?>'; //Слово, из букв которого будем собирать другие слова
        //Словарь слов, по которому проверяем введенные слова. Проблемное место - занимает много памяти
        var dictionary    = JSON.parse('<?=json_encode(array_flip($dictionary), JSON_UNESCAPED_UNICODE)?>');
        var roundDuration = 5; //Время раунда в минутах
        roundDuration    *= 60;

        var collector = new WordCollector(baseWord, dictionary);

        var timer = setInterval(function(){
            if(roundDuration === 0){
                clearInterval(timer);
                collector.disableEvents();
                alert('Время игры истекло');
            } else{
                --roundDuration;
            }
        }, 1000);
    })();
</script>
</html>