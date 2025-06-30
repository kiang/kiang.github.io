<?php
/**
 * Script to update JSON files with internationalization structure
 * Usage: php scripts/02_i18n.php
 */

// Define translation mapping for talks
$talkTranslations = [
    // Recent talks
    '開放資料促成公私協力' => 'Open Data Facilitating Public-Private Cooperation',
    '真相地圖分享' => 'Truth Map Sharing',
    '新興科技風險和公民科技' => 'Emerging Technology Risks and Civic Technology',
    '交通事故與人口關聯探索' => 'Exploring Traffic Accidents and Population Correlations',
    '台灣 COVID-19 本土病例地圖經驗談' => 'Taiwan COVID-19 Local Case Map Experience',
    '海洋與公民科技' => 'Ocean and Civic Technology',
    '特色、共融與公園' => 'Features, Inclusion and Parks',
    'Covid-19 下的公與私' => 'Public and Private under Covid-19',
    'The Story behind the Mask Map' => 'The Story behind the Mask Map',
    '台灣政治內與外的鴻溝' => 'The Gap Between Inside and Outside of Taiwan Politics',
    '寫程式關心環境' => 'Programming to Care for the Environment',
    '從口罩地圖到公民參與 & 開源創新' => 'From Mask Map to Civic Participation & Open Source Innovation',
    '藥局口罩採購地圖背後的那些故事' => 'Stories Behind the Pharmacy Mask Purchase Map',
    '從防疫看科技發展' => 'Viewing Technology Development from Epidemic Prevention',
    '一個科技人的體制外與體制內' => 'A Tech Person\'s Outside and Inside the System',
    'Kiang 的公民科技應用簡介' => 'Introduction to Kiang\'s Civic Technology Applications',
    '開放資料概述' => 'Open Data Overview',
    '台南開放資料與智慧城市' => 'Tainan Open Data and Smart City',
    '台南智慧城市辦公室' => 'Tainan Smart City Office',
    '特色公園與鄰里公園' => 'Featured Parks and Neighborhood Parks',
    '公民科技' => 'Civic Technology',
    '台南待孳清空地空屋資料處理' => 'Tainan Vacant Land and House Data Processing',
    '開放資料介紹與應用案例' => 'Open Data Introduction and Application Cases',
    '水利防災地圖與政策回饋' => 'Water Resources Disaster Prevention Map and Policy Feedback',
    '用科技關心政治' => 'Using Technology to Care for Politics',
    '開放資料' => 'Open Data',
    '用鍵盤關心政治' => 'Using Keyboard to Care for Politics',
    'Open Data 黑客技巧分享' => 'Open Data Hacking Tips Sharing',
    '資訊系統參與救災' => 'Information System Participation in Disaster Relief',
    '跌入 g0v的那些日子' => 'Days Falling into g0v',
    '登革熱地圖' => 'Dengue Fever Map',
    '登革熱地圖的那些日子' => 'Days of Dengue Fever Map',
    'drugs.olc.tw - 藥要看' => 'drugs.olc.tw - Medicine Information',
    'crowdsourcing & dengue Fever in Tainan' => 'Crowdsourcing & Dengue Fever in Tainan',
    '選舉黃頁' => 'Election Yellow Pages',
    '選舉黃頁的過去、現在與未來' => 'Past, Present and Future of Election Yellow Pages',
    '選舉黃頁開發經驗分享' => 'Election Yellow Pages Development Experience Sharing',
    'g0v & open data' => 'g0v & Open Data'
];

// Define translation mapping for events
$eventTranslations = [
    '大專校院資料開放應用宣導說明會' => 'Open Data Application Promotion Meeting for Universities and Colleges',
    '屏東縣社會工作師公會' => 'Pingtung County Social Workers Association',
    '國立屏東科技大學' => 'National Pingtung University of Science and Technology',
    'TDX資料應用實戰班' => 'TDX Data Application Workshop',
    '台灣地理資訊中心' => 'Taiwan Geographic Information Center',
    '珍愛桃園藻礁' => 'Protect Taoyuan Algal Reefs',
    '疫情新生活 民眾糾察隊' => 'New Life in Pandemic Citizen Patrol',
    '龍應台文化基金會' => 'Dragon Cultural Foundation',
    'NDI Taiwan INFO/tegrity Workshop' => 'NDI Taiwan INFO/tegrity Workshop',
    '真相地圖紀錄片 林皓申拍攝' => 'Truth Map Documentary by Lin Hao-shen',
    '世代傳承-台南古都 創新講座' => 'Generational Heritage - Tainan Ancient Capital Innovation Lecture',
    'g0v summit' => 'g0v Summit',
    '嘉南藥理大學' => 'Chia Nan University of Pharmacy and Science',
    '第九屆數位傳播國際學術研討會' => '9th International Conference on Digital Communication',
    '看南埕說書' => 'Kan Nan Cheng Storytelling',
    '南臺科技大學多媒體與電腦娛樂科學系' => 'Southern Taiwan University of Science and Technology Department of Multimedia and Computer Entertainment Science',
    '東華大學國際企業學系' => 'National Dong Hwa University Department of International Business',
    '大學堂未來方程式' => 'University Future Formula',
    '人文創新與社會實踐計畫' => 'Humanities Innovation and Social Practice Program',
    '國土空間數據應用專家講座' => 'National Land Spatial Data Application Expert Lecture',
    '臺南大學行政管理系' => 'National University of Tainan Department of Administrative Management',
    ' PTS Open Space' => 'PTS Open Space',
    '台糖公司資料開放品質提昇與應用實作班' => 'Taiwan Sugar Corporation Data Open Quality Improvement and Application Workshop',
    '高雄大學開放資料課程' => 'National University of Kaohsiung Open Data Course',
    '台南市政府' => 'Tainan City Government',
    ' 全國女性里長人才培訓班' => 'National Female Village Chief Talent Training Course',
    '交大土木系' => 'NCTU Department of Civil Engineering',
    '台南市政府研考會' => 'Tainan City Government Research and Development Evaluation Commission',
    '胖地OPEN DAY＿PUN TALK' => 'Pun Place OPEN DAY - PUN TALK',
    '財團法人中衛發展中心' => 'China Development Industrial Bank Foundation',
    ' 時代力量台南系列講談' => 'New Power Party Tainan Series Talk',
    '台灣電力公司經營變革研習營' => 'Taiwan Power Company Management Reform Workshop',
    ' 台南新芽協會 長新芽青年培力營' => 'Tainan Sprouts Association Youth Empowerment Camp',
    'Maker X Hacker桃園開放資料黑客松 說明會' => 'Maker X Hacker Taoyuan Open Data Hackathon Briefing',
    '台北市政府 災害救助研習班' => 'Taipei City Government Disaster Relief Workshop',
    '聯發科技 開放資料研究社' => 'MediaTek Open Data Research Society',
    '報導者 新聞松短講' => 'The Reporter News Lightning Talk',
    '高雄open data培訓' => 'Kaohsiung Open Data Training',
    'PHPConf Taiwan 2015' => 'PHPConf Taiwan 2015',
    'Taiwan & Thailand Open Data Hackathon' => 'Taiwan & Thailand Open Data Hackathon',
    '2015 Open Data創新應用競賽' => '2015 Open Data Innovation Application Competition',
    '中央選舉委員會' => 'Central Election Commission',
    'PHPConf Taiwan 2014' => 'PHPConf Taiwan 2014',
    'NCKU-CSIE-自由軟體開發與社群發展' => 'NCKU-CSIE-Free Software Development and Community Development'
];

// Define translation mapping for link text
$linkTranslations = [
    '錄影' => 'Recording',
    '第一段' => 'Part 1',
    '第二段' => 'Part 2',
    '直播記錄' => 'Live Stream Record',
    '怪咖系列紀錄片' => 'Weirdo Series Documentary',
    '公視獨立特派員' => 'PTS Independent Reporter',
    '逐字稿' => 'Transcript'
];

function updateTalksJson() {
    global $talkTranslations, $eventTranslations, $linkTranslations;
    
    $file = __DIR__ . '/../data/talks.json';
    $data = json_decode(file_get_contents($file), true);
    
    if (!$data || !isset($data['talks'])) {
        echo "Error: Could not read talks.json or invalid format\n";
        return false;
    }
    
    $updated = false;
    
    foreach ($data['talks'] as &$talk) {
        // Update title
        if (isset($talk['title']) && is_string($talk['title']) && !empty($talk['title'])) {
            $zhTitle = $talk['title'];
            $enTitle = $talkTranslations[$zhTitle] ?? $zhTitle;
            if ($enTitle !== $zhTitle || $zhTitle !== '') {
                $talk['title'] = [
                    'zh' => $zhTitle,
                    'en' => $enTitle
                ];
                $updated = true;
            }
        }
        
        // Update event
        if (isset($talk['event']) && is_string($talk['event']) && !empty($talk['event'])) {
            $zhEvent = $talk['event'];
            $enEvent = $eventTranslations[$zhEvent] ?? $zhEvent;
            if ($enEvent !== $zhEvent || $zhEvent !== '') {
                $talk['event'] = [
                    'zh' => $zhEvent,
                    'en' => $enEvent
                ];
                $updated = true;
            }
        }
        
        // Update links
        if (isset($talk['links']) && is_array($talk['links'])) {
            foreach ($talk['links'] as &$link) {
                if (isset($link['title']) && is_string($link['title']) && !empty($link['title'])) {
                    $zhLinkTitle = $link['title'];
                    $enLinkTitle = $linkTranslations[$zhLinkTitle] ?? $zhLinkTitle;
                    if ($enLinkTitle !== $zhLinkTitle || $zhLinkTitle !== '') {
                        $link['title'] = [
                            'zh' => $zhLinkTitle,
                            'en' => $enLinkTitle
                        ];
                        $updated = true;
                    }
                }
            }
        }
    }
    
    if ($updated) {
        file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo "Updated talks.json with i18n structure\n";
        return true;
    }
    
    echo "No updates needed for talks.json\n";
    return false;
}

function updateProjectsJson() {
    $file = __DIR__ . '/../data/projects.json';
    $data = json_decode(file_get_contents($file), true);
    
    if (!$data || !isset($data['projects'])) {
        echo "Error: Could not read projects.json or invalid format\n";
        return false;
    }
    
    $updated = false;
    
    foreach ($data['projects'] as &$project) {
        // Update title - only if it's currently a string
        if (isset($project['title']) && is_string($project['title'])) {
            $zhTitle = $project['title'];
            // For now, keep English same as Chinese unless we have specific translations
            $enTitle = $zhTitle; // Could add specific translations here later
            
            $project['title'] = [
                'zh' => $zhTitle,
                'en' => $enTitle
            ];
            $updated = true;
        }
        
        // Update description - only if it's currently a string
        if (isset($project['description']) && is_string($project['description'])) {
            $description = $project['description'];
            // If description is in English, swap the languages
            if (preg_match('/^[a-zA-Z]/', $description)) {
                // Starts with English letter, assume it's English
                $project['description'] = [
                    'zh' => $description, // For now, use same text
                    'en' => $description
                ];
            } else {
                // Assume it's Chinese
                $project['description'] = [
                    'zh' => $description,
                    'en' => $description // For now, use same text
                ];
            }
            $updated = true;
        }
        
        // Note: We're NOT updating media titles as per user request
    }
    
    if ($updated) {
        file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo "Updated projects.json with i18n structure\n";
        return true;
    }
    
    echo "No updates needed for projects.json\n";
    return false;
}

function updateLinksJson() {
    $file = __DIR__ . '/../data/links.json';
    $data = json_decode(file_get_contents($file), true);
    
    if (!$data || !is_array($data)) {
        echo "Error: Could not read links.json or invalid format\n";
        return false;
    }
    
    $updated = false;
    
    foreach ($data as &$link) {
        // Update title - only if it's currently a string
        if (isset($link['title']) && is_string($link['title'])) {
            $title = $link['title'];
            // For links, keep original title (mostly Chinese news titles)
            $link['title'] = [
                'zh' => $title,
                'en' => $title // Keep same for news titles
            ];
            $updated = true;
        }
    }
    
    if ($updated) {
        file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo "Updated links.json with i18n structure\n";
        return true;
    }
    
    echo "No updates needed for links.json\n";
    return false;
}

function updateBadgesJson() {
    $file = __DIR__ . '/../data/badges.json';
    $data = json_decode(file_get_contents($file), true);
    
    if (!$data || !isset($data['badges'])) {
        echo "Error: Could not read badges.json or invalid format\n";
        return false;
    }
    
    $updated = false;
    
    foreach ($data['badges'] as &$badge) {
        // Update title - only if it's currently a string
        if (isset($badge['title']) && is_string($badge['title'])) {
            $title = $badge['title'];
            // For badges, keep original title
            $badge['title'] = [
                'zh' => $title,
                'en' => $title // Keep same for now
            ];
            $updated = true;
        }
        
        // Update description - only if it's currently a string
        if (isset($badge['description']) && is_string($badge['description'])) {
            $description = $badge['description'];
            $badge['description'] = [
                'zh' => $description,
                'en' => $description // Keep same for now
            ];
            $updated = true;
        }
    }
    
    if ($updated) {
        file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        echo "Updated badges.json with i18n structure\n";
        return true;
    }
    
    echo "No updates needed for badges.json\n";
    return false;
}

// Main execution
echo "Starting JSON i18n structure update...\n\n";

$results = [
    'talks' => updateTalksJson(),
    'projects' => updateProjectsJson(),
    'links' => updateLinksJson(),
    'badges' => updateBadgesJson()
];

echo "\nSummary:\n";
foreach ($results as $file => $updated) {
    echo "- {$file}.json: " . ($updated ? "UPDATED" : "No changes") . "\n";
}

echo "\nDone!\n";
?>