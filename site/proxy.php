<?php
echo 'hello';
$aContext = array(
    'http' => array(
        'proxy' => 'http://proxy.atlanta.hp.com:8088', // This needs to be the server and the port of the NTLM Authentication Proxy Server.
        'request_fulluri' => True,
        ),
    );
$cxContext = stream_context_create($aContext);
?>