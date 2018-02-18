(function h(){
    var haroldWeightLbs = 10.1;
    var current = -1;
    var hasStarted = false;
    function start(){
        var haroldImage = document.querySelector('#harold');
        hasStarted = true;
        var imageLoading = false;
        haroldImage.onload = function(){
            imageLoading = false; 
        }
        function aHarold(){
            if(imageLoading){ return; }
            
            fetch('/resize.php?width=' + window.screen.availWidth + '&height=' + window.screen.availHeight)
                .then(response => response.blob())
                .then(function(blob){
                     haroldImage.src = URL.createObjectURL(blob);
                     imageLoading = false;
                });
            imageLoading = true;
        }
        aHarold();
        document.querySelector('#another').onclick = aHarold;
        addMotionListener(aHarold);
    }

    start();

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

        return;
        addSwipeListener();
    }

    function addSwipeListener(){
        var haroldImage = document.querySelector('#harold');
        var start = {x: 0, y: 0};
        var previous = {x: 0, y: 0};
        var isDown = false;
        var velocity = {x: 0, y: 0};

        haroldImage.addEventListener('mousedown', function(e){
            start = getPoint(e);
            previous = start;
            isDown = true;
        });
        haroldImage.addEventListener("dragstart", function(e){
            e.preventDefault();
        })
        haroldImage.addEventListener("drag", function(e){
            e.preventDefault();
        })

        haroldImage.addEventListener('mousemove', function(e){
            if(isDown){
                var current = getPoint(e);
                var offset = calculateOffset(previous, current);
                setOffsetPosition(haroldImage, offset);
                previous = current;
            }
        });
        haroldImage.addEventListener('mouseup', function(e){
            isDown = false;
        });

        function calculateOffset(start, end){
            return {x: start.x - end.x, y: start.y - end.y};
        }
        function getPoint(e){
            return {x: e.pageX, y: e.pageY};
        }

        function setOffsetPosition(element, offset){
            var position = getPosition(element);
            element.style.position = "absolute";
            element.style.left = (offset.x * -1 + position.x) + "px";
            element.style.top = (offset.y * -1 + position.y) + "px";
        }

        function getPosition(element){
            var rect = element.getBoundingClientRect();
            return {x: rect.left, y: rect.top};
        }

        function setNewPosition(element, movement){
            var position = getPosition(element);
        }
    }


    function fillInStuff(stuff){
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

    fetch("stuff.json")
        .then( response => response.json())
        .then(json => fillInStuff(json));

    function setHaroldWeight(){
        document.querySelector('#harold_weight').innerHTML = poundsToGrams(haroldWeightLbs) + "g";
    };
    setHaroldWeight();

    function poundsToGrams(pounds){
        var onePound = 453.59;
        return pounds * 453.59;
    }

})();