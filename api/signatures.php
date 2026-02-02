<?php
/**
 * Signatures API
 * GET  - Returns list of signatures as JSON
 * POST - Adds a new signature
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Data file path (stored in a non-web-accessible location ideally, but this works)
$dataFile = __DIR__ . '/signatures.json';

// Ensure data file exists
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

/**
 * GET - Return all signatures
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $signatures = json_decode(file_get_contents($dataFile), true) ?: [];
    
    // Return only public data (name, city, state)
    $publicSignatures = array_map(function($sig) {
        return [
            'name' => $sig['name'] ?? '',
            'city' => $sig['city'] ?? '',
            'state' => $sig['state'] ?? ''
        ];
    }, $signatures);
    
    echo json_encode([
        'success' => true,
        'count' => count($publicSignatures),
        'signatures' => $publicSignatures
    ]);
    exit;
}

/**
 * POST - Add a new signature
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $city = trim($_POST['city'] ?? '');
    $state = trim($_POST['state'] ?? '');
    $attending = trim($_POST['attending'] ?? '');
    $needInfo = trim($_POST['needInfo'] ?? '');
    $rivertonResident = trim($_POST['rivertonResident'] ?? '');
    
    // Set city/state for Riverton residents
    if ($rivertonResident === 'yes') {
        $city = 'Riverton';
        $state = 'Utah';
    }
    
    // Validate required fields
    if (empty($name)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Name is required']);
        exit;
    }
    
    // Load existing signatures
    $signatures = json_decode(file_get_contents($dataFile), true) ?: [];
    
    // Add new signature
    $newSignature = [
        'timestamp' => date('Y-m-d H:i:s'),
        'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
        'email' => htmlspecialchars($email, ENT_QUOTES, 'UTF-8'),
        'phone' => htmlspecialchars($phone, ENT_QUOTES, 'UTF-8'),
        'city' => htmlspecialchars($city, ENT_QUOTES, 'UTF-8'),
        'state' => htmlspecialchars($state, ENT_QUOTES, 'UTF-8'),
        'attending' => htmlspecialchars($attending, ENT_QUOTES, 'UTF-8'),
        'needInfo' => htmlspecialchars($needInfo, ENT_QUOTES, 'UTF-8')
    ];
    
    $signatures[] = $newSignature;
    
    // Save to file
    if (file_put_contents($dataFile, json_encode($signatures, JSON_PRETTY_PRINT))) {
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for signing!'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to save signature. Please try again.'
        ]);
    }
    exit;
}

// Method not allowed
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);
