'use strict'; /* Used traditional syntax and ES5, except "let". */



/** Here is the BEGINNING (the entry-point to the application):
 * We reserve a namespace ("timeline") for the application, 
 * wherein we attach our classes and the configurations of the application
 * and we would load here-in also the model-content, means e.g. JSON-files or database-content.
 * In this case only the content of the text-file (completeContentDeepArray).
 * Here is the place to deposit content which has to be reachable from the complete application.
*/



window.timeline = {
    "decription"                :"A simple to-do-list based on JavaScript, php and a txt-file. (no database)",
    "limits"                    :"A SINGLE-USER-application and not working with IIS due to file-request with POST-method",
    "language"                  :"en",
    "name"                      :"to-do-timeline",
    "version"                   :"1.0",
    listOfOptions               :["\<1h","\>1h","\<4h","\>4h","\<1d","\>1d","\<1w","\>1w","\<1m","\>1m","xxl"],
    completeContentDeepArray    :[],

    /** This function "makeAJAXRequest" 
     * can be used for AJAX-requests without or with parammeters
     * e.g. for json- or php-files.
     * @param {string} callMeWhenReady - The name of the callbackfunction from the class
     * @param {string} url - The request-url
     * @param {string} param1 - Optional parameter
     * @param {string} param2 - Optional parameter
     * @param {string} param2 - Optional parameter
     **/
    "makeAJAXRequest"  :function(callMeWhenReady, url, param1, param2, param3){

        let AJAXRequest = new XMLHttpRequest();
        let parameters = "";

        // In case that the request has parameters, we add them

        if (typeof param1 != 'undefined' && param1 != null){
            // if (typeof param1 != 'undefined' && param1 != null && param1 != ""){
            // in this special case for the app "to-do-timeline" 
            // there is a situation when we want to submit a parameter with an empty value.
            // Tat is the case when user wants to reset the app to be completly empty .
            parameters = parameters + "&param1=" + param1;
        }
        if (typeof param2 != 'undefined' && param2 != null && param2 != ""){
            parameters = parameters + "&param2=" + param2;
        }
        if (typeof param3 != 'undefined' && param3 != null && param3 != ""){
            parameters = parameters + "&param3=" + param3;
        }

        // Here at the next line is the issue with IIS
        // IIS (Internet Information service) is very strict 
        // and does not accept requesting a file with the POST-method.
        // If we couldn't request the txt-file with POST,
        // this timeline-tool would not be possible,
        // because we submit the complete txt-content with a parameter,
        // and the GET-mthod is limited to its size.
        AJAXRequest.open("POST", url, true);
        AJAXRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        AJAXRequest.send(parameters);

        AJAXRequest.onreadystatechange = function() {

            if (this.readyState == 4 && this.status == 200) { // on success
                callMeWhenReady(AJAXRequest.responseText);
            }

            if (this.status != 200) {
                let fileError = { "fileError": "An ERROR occured on requesting the file:" + url };
                callMeWhenReady(fileError);
            }
        };
    }
};