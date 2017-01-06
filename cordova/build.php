<?php
include 'CordovaApp.php';

$code   = isset($argv[1]) ? $argv[1] : null;
$folder = isset($argv[2]) ? $argv[2] : null;

CordovaApp::build($code, $folder);
