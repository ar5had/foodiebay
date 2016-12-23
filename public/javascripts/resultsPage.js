(function(){

    var elem = document.querySelector('.locateMe');
    var form = document.getElementById('locateMeForm');
    
    var count = 2;
    elem.addEventListener("click", function() {
        form.submit();    
    });
    var bindvmBtn = function() {
        var vmBtn = document.getElementById('viewMoreBtn');
        if (vmBtn) {
            vmBtn.addEventListener("click", function() {
                
                vmBtn.textContent = "Loading...";
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4) {
                        if(this.status == 200) {
                           count++;
                           vmBtn.parentNode.removeChild(vmBtn);
                           var wrapper = document.querySelector("main > .container");
                           wrapper.innerHTML += this.responseText; 
                           bindvmBtn();
                           bindAllCountBtns(document.querySelectorAll(".countBtn"));
                        } else {
                            console.log( "error while making request to /results", this.statusText);
                            vmBtn.textContent = "View More";
                        }
                    }
                };
                
                var url = window.location.href;
                var index = url.indexOf('?');
                var usefulStr = url.substr(index);
                xhttp.open("GET", "/results"+ usefulStr +"&type=xhr&page=" + count, true);
                xhttp.send();
            });
        }
    };
    
    var bindCountBtn = function(countBtn) {
        countBtn.addEventListener("click", function() {
            var xhttp = new XMLHttpRequest();
            var id = countBtn.getAttribute('data-id');
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if(this.status == 200) {
                        countBtn.children[1].textContent = this.responseText;
                    } else {
                        console.log( "error while making request to /markRestaurant", this.statusText);
                    }
                }
            };
            xhttp.open("POST", "/markRestaurant?id=" + id, true);
            xhttp.send();
        });
    };
    
    var bindAllCountBtns = function(btns) {
        // using backward loop so that newly added results btns can be binded first
        // and when already binded btns come then function will return as if 
        // condition will truthy
        // using for loop over forEach h.o. function so that we can return when 
        // if condition is truthy
        for (var i = btns.length-1; i >= 0; i--) {
            if (typeof btns[i].onClick === 'function') {
                return;
            } else {
                bindCountBtn(btns[i]);
            }
        }
    };
    
    bindAllCountBtns(document.querySelectorAll(".countBtn"));
    bindvmBtn();
})();

