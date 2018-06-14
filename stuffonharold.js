(function h(){
    class HaroldImageQueue{
        constructor(haroldsElement){
            var self = this;
            this.images = [];
            this.length = 2;
            this.parent = haroldsElement;
            
            this.addImageElement().then(() => self.addImageElement());
        }

        addImageElement() {
            var self = this;

            var badIdea = new Date();
            return fetch('/resize.php?width=' + window.innerWidth + '&height=' + window.innerHeight +'&noo' + badIdea.getMilliseconds())
                .then(response => response.blob())
                .then(function(blob){
                    var haroldImage = new Image();
                    haroldImage.src = URL.createObjectURL(blob);
                    self.images.push(haroldImage);
                    self.parent.appendChild(haroldImage);
                });
        }

        shift(){
            var element = this.images.shift();
            element.parentNode.removeChild(element);
            this.addImageElement();
        }
    }

    var haroldWeightLbs = 10.1;
    var current = -1;
    var hasStarted = false;
    var nextAreaPercent = .1;
    function start(){
        var harolds = document.querySelector('#harolds');
        var haroldQueue = new HaroldImageQueue(harolds);
        var nextHarold = haroldQueue.shift.bind(haroldQueue);
        
        addMotionListener(nextHarold);
        addSwipeListener(harolds, nextHarold);
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

    function addSwipeListener(harolds, nextEvent){
        
        let haroldImage = () => harolds.firstChild;
        let start = {x: 0, y: 0};
        let previous = {x: 0, y: 0};
        let isDown = false;
        let velocity = {x: 0, y: 0};
        let nextAreaPadding = window.innerWidth * nextAreaPercent;
        let nextArea = {
            left: nextAreaPadding,
            right: window.innerWidth - nextAreaPadding
        };
        var startFn = function(e){
            start = getPoint(e);
            previous = start;
            isDown = true;
        }
        harolds.addEventListener('mousedown', startFn);
        harolds.addEventListener('touchdown', startFn);

        harolds.addEventListener("dragstart", function(e){
            e.preventDefault();
        })
        harolds.addEventListener("drag", function(e){
            e.preventDefault();
        })
        var downFn = function(e){
            if(isDown){
                var current = getPoint(e);
                if(isInNextPadding(current)){
                    nextEvent();
                    dragDone();
                    return;
                }
                var offset = calculateOffset(previous, current);
                setOffsetPosition(haroldImage(), offset);
                previous = current;
            }
        };
        harolds.addEventListener('mousemove', downFn);
        harolds.addEventListener('touchmove', downFn);

        var upFn = function(e){
            dragDone();
        }
        harolds.addEventListener('mouseup', upFn);
        harolds.addEventListener('touchend', upFn);
        
        harolds.addEventListener('click', function(e){
            if(isInNextPadding(getPoint(e))){
                dragDone();
                nextEvent();
            }
        });

        function calculateOffset(start, end){
            return {x: start.x - end.x, y: start.y - end.y};
        }
        function getPoint(e){
            return {x: e.pageX, y: e.pageY};
        }

        function dragDone(){
            isDown = false;
            haroldImage().style.position = "relative";
            haroldImage().style.left = "0px";
            haroldImage().style.top = "0px";
        }

        function setOffsetPosition(element, offset){
            var position = getPosition(element);
            element.style.position = "absolute";
            element.style.left = (offset.x * -1 + position.x) + "px";
            element.style.top = (offset.y * -1 + position.y + window.scrollY) + "px";
        }

        function getPosition(element){
            var rect = element.getBoundingClientRect();
            return {x: rect.left, y: rect.top};
        }

        function setNewPosition(element, movement){
            var position = getPosition(element);
        }

        function isInNextPadding(point){
            return point.x > nextArea.right || point.x < nextArea.left;
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