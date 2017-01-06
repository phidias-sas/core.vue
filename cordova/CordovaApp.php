<?php
include 'vendor/autoload.php';

use GuzzleHttp\Client as HttpClient;
use Intervention\Image\ImageManagerStatic as Image;

class CordovaApp
{
    public $id;
    public $organization;
    public $url;
    public $title;
    public $logo;
    public $icon;

    private $outputFolder;

    public static function build($id = null, $outputFolder = null)
    {
        $app = new CordovaApp($id);
        return $app->generate($outputFolder);
    }

    public function __construct($id = null)
    {
        $this->id = $id;
    }

    public function generate($outputFolder)
    {
        if (!trim($outputFolder)) {
            $outputFolder = "project";
        }
        $this->outputFolder = rtrim($outputFolder, '/');

        self::log("Generando aplicacion en $this->outputFolder/");

        $this->fetch();
        $this->initialize();
        $this->generateIndex();
        $this->generateConfig();
        $this->generateIcons();

        self::log("Proyecto generado con exito\n");
    }

    private function fetch()
    {
        if (!$this->id) {
            self::log("Generando aplicacion generica");
            return;
        }

        $codeUrl = "https://phidias.io/code/$this->id";
        self::log("Obteniendo datos de $codeUrl");

        $response = json_decode( (new HttpClient)->get($codeUrl)->getBody() );
        if (!$response) {
            self::log("ERROR! $codeUrl no encontrado");
            throw new \Exception("got empty response from ".$codeUrl);
        }

        $this->organization = $response->organization;
        $this->url          = $response->url;
        $this->title        = $response->title;
        $this->logo         = $response->logo;
        $this->icon         = $response->icon;

        self::log("Datos obtenidos para {$this->title}");
    }

    private function initialize()
    {
        self::log("Creando nuevo proyecto de Cordova");

        if (!is_dir($this->outputFolder)) {
            mkdir($this->outputFolder, 0777, true);
            `cordova create {$this->outputFolder}`;
        }

        `rm -rf {$this->outputFolder}/www`;
        `cp -r ../dist {$this->outputFolder}/www`;
        `cp -r src/resources {$this->outputFolder}/resources`;
    }

    private function generateIndex()
    {
        self::log("Generando index.html");

        $policy = '<meta http-equiv="Content-Security-Policy" content="default-src \'self\' data: gap: http: https: ws: \'unsafe-inline\' https://ssl.gstatic.com; style-src * blob: \'unsafe-inline\'; media-src *; img-src * data:; script-src * \'unsafe-inline\'">';

        $contents = str_replace(
            [
                "<head>",
                "/static",
                "<div id=app></div>"
            ],
            [
                "<head>".$policy."\n",   // Without the \n phonegap will not render styles (only god knows why, but it took me about an hour to find out!)
                "static",
                '<div id=app></div><script type="text/javascript" src="cordova.js"></script>'
            ],
            file_get_contents("$this->outputFolder/www/index.html")
        );


        $metaTags = "";

        if ($this->title) $metaTags .= "\n<meta name=\"phi-title\" content=\"$this->title\">";
        if ($this->url) $metaTags .= "\n<meta name=\"phi-endpoint\" content=\"$this->url\">";
        if ($this->logo) $metaTags .= "\n<meta name=\"phi-logo\" content=\"$this->logo\">";

        if (isset($this->organization->name)) $metaTags .= "\n<meta name=\"phi-organization-name\" content=\"{$this->organization->name}\">";
        if (isset($this->organization->website)) $metaTags .= "\n<meta name=\"phi-organization-website\" content=\"{$this->organization->website}\">";
        if (isset($this->organization->phone)) $metaTags .= "\n<meta name=\"phi-organization-phone\" content=\"{$this->organization->phone}\">";
        if (isset($this->organization->latitude)) $metaTags .= "\n<meta name=\"phi-organization-location\" content=\"{$this->organization->latitude},{$this->organization->longitude}\">";

        if ($metaTags) {
            $contents = str_replace(
                "</title>",
                "</title>\n$metaTags\n",
                $contents
            );
        }

        file_put_contents("$this->outputFolder/www/index.html", $contents);
    }

    private function generateConfig()
    {
        self::log("Generando config.xml");

        if (!$this->id) {
            copy("src/config.xml", "$this->outputFolder/config.xml");
            return;
        }

        $contents = str_replace(
            [
                "com.phidias.app.core",
                "<name>Phidias</name>"
            ],
            [
                "com.phidias.app.$this->id",
                "<name>$this->title</name>"
            ],
            file_get_contents("src/config.xml")
        );

        file_put_contents("$this->outputFolder/config.xml", $contents);
    }

    private function generateIcons()
    {
        if (!$this->icon) {
            return;
        }

        self::log("Generando iconos de {$this->icon}");

        $icon = Image::make($this->icon);
        $icon->backup();

        foreach (self::getIconSpecs() as $specs) {
            $icon
                ->resize($specs["width"], $specs["height"])
                ->save($this->outputFolder . '/' . $specs["dest"])
                ->reset();
        }
    }

    private static function getIconSpecs()
    {
        $retval = [];

        $image = Image::make("src/resources/icon.png");
        $retval[] = [
            "dest"   => "resources/icon.png",
            "width"  => $image->width(),
            "height" => $image->height()
        ];

        foreach (["android", "ios"] as $platform) {
            $files = scandir("src/resources/$platform/icon");
            foreach ($files as $file) {
                if ($file == "." || $file == "..") continue;
                $image = Image::make("src/resources/$platform/icon/$file");
                $retval[] = [
                    "dest"   => "resources/$platform/icon/$file",
                    "width"  => $image->width(),
                    "height" => $image->height()
                ];
            }
        }

        return $retval;
    }

    private static function log($message)
    {
        echo $message . "\n";
    }

}



function dump()
{
    echo "<pre>\n";
    foreach (func_get_args() as $var) {
        echo print_r($var, true)."\n";
    }
    echo "</pre>\n";
}

function dumpx()
{
    foreach (func_get_args() as $var) {
        dump($var);
    }
    exit;
}

