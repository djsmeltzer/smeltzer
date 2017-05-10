<?php

// there will be a request, want to put it to file.

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo "You got me.";
} else {
    // post stuff here.
    $dateString = date('Y-m-d_H-i-s');
    $data = file_get_contents('php://input');
    // file_put_contents('hubspot/' . $dateString . '_hubspot.txt',$data);
    $dataArray = json_decode($data);
    $firstname = $dataArray->properties->firstname->value;
    $email = $dataArray->properties->email->value;
    $cid = $dataArray->properties->most_recent_request_campaign__c->value;
    $outline = implode(",", [$dateString, $firstname, $email, $cid]);
    $outline .= "\n";
    if ($_SERVER['HTTP_USER_AGENT'] === 'HubSpot Workflows Webhook') {
        $outline .= "\tHere from webhook\n";
    }
    file_put_contents('hubspot/log.txt', $outline, FILE_APPEND | LOCK_EX);
    header('HTTP/1.1 200 OK');
}

?>