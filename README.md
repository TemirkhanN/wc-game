# Word Compositor Game
Игра "наборщик" на js

https://temirkhann.github.io/wc-game/ 

При первой инициализации выдается случайное слово не короче определенного количества символов, из которого нужно составлять слова.
Чем длиннее составленное слово, тем больше очков за него дается.
Сетевого режима и прочих соревновательных составляющих у игры нет, но можно играть поочереди, укладываясь в отведенное время.

WordCollector принимает массив со словами на входе.

Словарь содержит в себе все допустимые слова и может быть на любом языке.
Текущий словарь содержит русские слова. Слова взяты парсером с одного из сайтов и содержат некоторые слова "вне правил".
Периодически их хорошо бы вычищать. На текущий момент от я до щ слова "чисты"
