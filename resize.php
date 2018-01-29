<?
$image = $_GET['img'];
if(empty($image)){
    $files = glob('img/*.*');
    $index = rand(0, count($files)-1);
    $image = $files[$index];
}
else{
    $image = 'img/'.$image;
}

$width = $_GET['width'];
$height = empty($_GET['height']) ? 0 : $_GET['height'];

header('Content-Type: image/jpeg');
imagejpeg(resize_image($image, $width, $height, false));

function resize_image($file, $w, $h, $crop=FALSE) {
    //https://stackoverflow.com/questions/14649645/resize-image-in-php
    list($width, $height) = getimagesize($file);
    $r = $width / $height;
    $w = empty($w) ? $width : $w;
    $h = empty($h) ? $height : $h;
    if ($crop) {
        if ($width > $height) {
            $width = ceil($width-($width*abs($r-$w/$h)));
        } else {
            $height = ceil($height-($height*abs($r-$w/$h)));
        }
        $newwidth = $w;
        $newheight = $h;
    } else {
        if ($w/$h > $r) {
            $newwidth = $h*$r;
            $newheight = $h;
        } else {
            $newheight = $w/$r;
            $newwidth = $w;
        }
    }
    $src = imagecreatefromjpeg($file);
    $dst = imagecreatetruecolor($newwidth, $newheight);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);

    return $dst;
}

?>