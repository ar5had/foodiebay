(function(){

    var elem = document.querySelector('.locateMe');
    var form = document.getElementById('locateMeForm');
    
    var count = 2;
    elem.addEventListener("click", function() {
        form.submit();    
    });
    var bindBtn = function() {
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
                           bindBtn();
                        } else {
                            console.log( "error while making request", this.statusText);
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
    bindBtn();
})();

