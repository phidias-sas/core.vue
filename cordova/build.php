<?php
include 'CordovaApp.php';

$code = isset($argv[1]) ? $argv[1] : null;
CordovaApp::build($code);
