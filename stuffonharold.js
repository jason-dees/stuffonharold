(function h(){
    var haroldWeightLbs = 10.1;
    var current = -1;
    var hasStarted = false;
    var img = [ ];
    function start(imgs){
        var haroldImage = document.querySelector('#harold');
        img = imgs;
        hasStarted = true;
        var imageLoading = false;
        haroldImage.onload=function(){
        imageLoading = false; 
        }
        function aHarold(){
            if(imageLoading){return;}
            imageLoading = true;
            var rand = Math.floor(Math.random()*img.length) ;
            if(rand==current){
                rand++;
                if(rand>=img.length){
                    rand = 0;
                }
            }
            current = rand;
            haroldImage.src = '' + img[rand];
        }
        aHarold();
        document.querySelector('#another').onclick=aHarold;
        addMotionListener(aHarold);
    }
    function addMotionListener(shakeEvent){
        var shakeCountX = 0;
        var hasShaken = false;
        window.addEventListener('devicemotion',function(e){
            var accel = e.acceleration;
            var x = Math.abs(accel.x);
            var y = Math.abs(accel.y);
            var z = Math.abs(accel.z);
            if(y>15){
                shakeCountX++;
            }
            else{
                shakeCountX = 0;
            }
            if(shakeCountX<3 && y >15 && !hasShaken){
                hasShaken = true;
                setTimeout(function(){hasShaken = false;},200);
                shakeEvent();
            }
        });

    }
    var imageXhr = new XMLHttpRequest();
    imageXhr.onload = function(){
        start(JSON.parse(this.responseText));
    }
    imageXhr.open("get", "images.php", true);
    imageXhr.send();

    function fillInStuff(){
        var stuff = JSON.parse(this.responseText);
        var total = 0;
        var stuffTable = document.querySelector("#stuff_body");
        var rowTemplate = document.querySelector("#stuff_row");

        stuff.sort(sortStuff);

        for(var i = 0; i< stuff.length; i++){
            var thing = stuff[i];
            total += parseFloat(thing.weight);
            var cells = rowTemplate.content.querySelectorAll("td");
            rowTemplate.content.querySelector('.item').textContent = thing.name;
            rowTemplate.content.querySelector('.weight').textContent = thing.weight + 'g';
            stuffTable.appendChild(document.importNode(rowTemplate.content, true));
        }

        document.querySelector('#total_stuff_weight').innerHTML = total + "g";
        document.querySelector('#interesting').onclick = function(){
            document.querySelector('#stats_view').className = 'hidden';
        }
    }
    document.querySelector('#stats').onclick = function(){
        document.querySelector('#stats_view').className = '';
    }
    function sortStuff(a, b){
        var nameA = a.name.toUpperCase(); 
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    }

    var stuffXhr = new XMLHttpRequest();
    stuffXhr.onload = fillInStuff;
    stuffXhr.open("get", "stuff.json", true);
    stuffXhr.send();

    function setHaroldWeight(){
        document.querySelector('#harold_weight').innerHTML = poundsToGrams(haroldWeightLbs) + "g";
    };
    setHaroldWeight();

    function poundsToGrams(pounds){
        var onePound = 453.59;
        return pounds * 453.59;
    }
})();