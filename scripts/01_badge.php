<?php
$basePath = dirname(__DIR__);
$pool = [];
foreach (glob($basePath . '/badge/*.*') as $badgeFile) {
    $p = pathinfo($badgeFile);
    $pool[] = 'badge/' . $p['basename'];
}

rsort($pool);

$result = [
    'badges' => []
];
foreach($pool AS $badge) {
    $result['badges'][] = [
        'image' => $badge,
        'date' => substr($badge, 6, 8),
    ];
}
file_put_contents($basePath . '/data/badges.json', json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));