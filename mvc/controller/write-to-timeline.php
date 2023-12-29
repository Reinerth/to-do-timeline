<?php

    $fileContent = $_POST["param1"]; // Get the parameter from URL = the complete file content

    function writeToFile($fileContent){
        $myFile = "../model/to-do-timeline-content.txt";
        file_put_contents($myFile, $fileContent); // write the new content to the file
        echo "SUCCESS";
    }

    writeToFile($fileContent);
?>