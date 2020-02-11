$(document).ready(function () {
    //globals
    var index = 0;
    var wordsInSpan;
    var filteredOffsets;
    var offsetHeights = [];
    var paras;
    var bottomOfScreen = $(window).scrollTop() + window.innerHeight;
    var topOfScreen = $(window).scrollTop();

    //redefines these variables when the user scrolls
    $(document).scroll(function() {
        bottomOfScreen = $(window).scrollTop() + window.innerHeight;
        topOfScreen = $(window).scrollTop();
    });

    //wraps each word in a span tag and puts them in an array
    function wrapInSpans() {
        paras = $('p');
        for (var i = 0; i < paras.length; i++) {
            if ($(paras[i]).text().length > 70) {
                Splitting({ target: paras[i], by: "words" });
            }
        }
        //puts all span elements with the class "word" into an array
        wordsInSpan = $("p span.word, p span.whitespace");
    };

    //get the offsetTops of each span tag and filters them into an array
    function getOffsets() {
        //pushing offsetTop of each span.word into an array of offsetHeights
        for (var i = 0; i < wordsInSpan.length; i++) {
            offsetHeights.push($(wordsInSpan[i]).offset().top);
        }

        //removes duplicates offsets from offsetHeights and makes a filtered array(filteredOffsets)
        filteredOffsets = offsetHeights.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        });
    }

    //keep the highlighted line in the center block of the screen
    function keepLineInWindow() {
        var line = $(".highlighted");
        for (var i = 0; i < line.length; i++) {
            line[i].scrollIntoView({ block: "center" });
        }
    };

    //attempting to select offsets that have the same offset (if that makes sense)
    function highlight() {
        for (var i = 0; i < wordsInSpan.length; i++) {
            if ($(wordsInSpan[i]).offset().top === filteredOffsets[index]) {
                $(wordsInSpan[i]).addClass("highlighted");
                if ($(wordsInSpan[i]).offset().top > bottomOfScreen) {
                    keepLineInWindow();
                } else if ($(wordsInSpan[i]).offset().top < topOfScreen) {
                    keepLineInWindow();
                }
            } else {
                $(wordsInSpan[i]).removeClass("highlighted");
            }
        }
    }
    
    //whole program in one function 
    function setup() {
        wrapInSpans();
        getOffsets();
        highlight();
    }
    
    //actually run the program
    setup();

    //changes line selected with arrow keys
    $(document).keyup(function (e) {
        if (e.which == 38 && index > 0) {
            index--;
            highlight();
        } else if (e.which == 40 && index <= filteredOffsets.length) {
            index++;
            highlight();
        }
    });

    //prevents arrowkeys from scrolling
    $(window).keydown(function (e) {
        if (e.keyCode == 38 || e.keyCode == 40) {
            e.preventDefault();
        }
    });

    //gets new offset to calculate line on window resize
    $(window).resize(function () {
        offsetHeights = [];
        filteredOffsets = [];
        getOffsets();
        highlight();
    });
});
