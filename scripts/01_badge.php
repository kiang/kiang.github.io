<?php
$basePath = dirname(__DIR__);
$pool = [];
foreach (glob($basePath . '/badge/*.*') as $badgeFile) {
    $p = pathinfo($badgeFile);
    $pool[] = 'badge/' . $p['basename'];
}

rsort($pool);

$html = file_get_contents($basePath . '/index.html');
$pos = strpos($html, '<h3>榮耀</h3>');
$pos = strpos($html, '<div class="card-deck">', $pos);
$posEnd = strpos($html, '</body>', $pos);
$content = '<div class="card-deck">';
$count = 0;
$countTotal = count($pool);
foreach ($pool as $badge) {
    $content .= '<div class="card card-cascade"><div class="view overlay">';
    $content .= '<img src="' . $badge . '" class="img-fluid">';
    $content .= '</div></div>';
    if (++$count % 4 === 0 && $count < $countTotal) {
        $content .= '</div><div class="card-deck">';
    }
}
$blankCount = 4 - ($count % 4);
if ($blankCount < 4) {
    $content .= str_repeat('<div class="card card-cascade"><div class="view overlay">&nbsp;</div></div>', $blankCount);
}
$content .= '</div>';
$html = substr($html, 0, $pos) . $content . substr($html, $posEnd);
file_put_contents($basePath . '/index.html', $html);