var require = function (src, dependencies, success_callback) {

    console.log("There is/are " + dependencies.length + " dependencies")

    var load = function (dependenciesUrl, index, success_callback) {
        var script = document.createElement('script');
        script.src = dependenciesUrl;
        script.onload = function () {
            console.log(dependenciesUrl + ' loaded');
            if(index<dependencies.length-1){
                load(dependencies[index+1], index+1);
            }else if(index === dependencies.length-1){
                load(src, index+1);
            }else{
                if(success_callback && typeof success_callback === "function") {
                    success_callback();
                }
            }
        };
        script.onerror = function () {
            throw new Error(dependenciesUrl + ' load failed.');
        };
        document.head.appendChild(script);
    }
    load(dependencies[0], 0, success_callback);
}
