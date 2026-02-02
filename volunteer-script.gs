var SITE_URL = 'https://votechrisnull.com';
var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXqQTXe0FzrQTe5kusbh2INEEM0nOmR99QY8LaBU5cPdh5ooGG1xtwJQwbatCuw9i8KQ/exec';
var SPREADSHEET_ID = '16U_S3SX-VXmobx4uWD47t-8nw8WVPlhmuxOfZcetdhQ';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function doGet(e) {
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = spreadsheet.getSheetByName('openletter_signup');
    var rows = [];
    if (sheet) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        var name = data[i][1] ? String(data[i][1]).trim() : '';
        var city = data[i][6] ? String(data[i][6]).trim() : '';
        var state = data[i][7] ? String(data[i][7]).trim() : '';
        if (name) {
          var cityState = (city && state) ? city + ', ' + state : (city || state || '—');
          rows.push({ name: escapeHtml(name), cityState: escapeHtml(cityState) });
        }
      }
    }

    var sigRowsHtml = '';
    var sigTableDisplay = 'none';
    var loadingDisplay = 'block';
    var emptyDisplay = 'none';
    if (rows.length > 0) {
      sigTableDisplay = 'table';
      loadingDisplay = 'none';
      sigRowsHtml = rows.map(function(r) {
        return '<tr><td>' + r.name + '</td><td>' + r.cityState + '</td></tr>';
      }).join('');
    } else {
      loadingDisplay = 'none';
      emptyDisplay = 'block';
    }

    var html = getLetterPageHtml(sigRowsHtml, sigTableDisplay, loadingDisplay, emptyDisplay);
    return HtmlService.createHtmlOutput(html).setTitle('Support Riverton\'s Partnership with ICE');
  } catch(err) {
    return HtmlService.createHtmlOutput(
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Error</title></head><body><p>Unable to load signatures. Please try again later.</p><p><a href="' + SITE_URL + '/riverton-open-letter.html">Return to letter</a></p></body></html>'
    ).setTitle('Error');
  }
}

function getLetterPageHtml(sigRowsHtml, sigTableDisplay, loadingDisplay, emptyDisplay) {
  return '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Support Riverton\'s Partnership with ICE</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"><style>:root{--red:#EE2737;--red-dark:#c5303c;--blue:#002868;--blue-dark:#001a4d;--blue-light:#457b9d;--white:#fff;--light-gray:#f8f9fa;--text:#2b2d42;--text-light:#6c757d}*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\'Open Sans\',sans-serif;color:var(--text);line-height:1.7;background:var(--light-gray);font-size:clamp(0.9rem,1.5vw,1rem)}.nav{position:fixed;top:0;left:0;right:0;background:var(--white);box-shadow:0 2px 20px rgba(0,0,0,0.1);z-index:1000;padding:0 2rem}@media(max-width:992px){.nav{padding:0 1.5rem}}@media(max-width:768px){.nav{padding:0 1rem};.nav-container{height:70px};.nav-logo img{height:50px};.nav-tagline{display:none};.nav-links{position:fixed;top:70px;left:-100%;width:100%;background:var(--white);flex-direction:column;padding:2rem;box-shadow:0 5px 20px rgba(0,0,0,0.1);transition:left 0.3s}.nav-links.active{left:0};.nav-item-issues{flex-direction:column;align-items:flex-start;width:100%}.nav-dropdown{position:static;transform:none;margin-top:0.5rem;margin-left:1rem;min-width:auto;box-shadow:none;opacity:1;visibility:visible;border-left:2px solid var(--red);padding-left:1rem}.mobile-menu-btn{display:block};.letter-wrapper{padding-top:90px};.letter-container{padding:1.5rem}}@media(max-width:480px){.nav{padding:0 0.75rem};.nav-container{height:65px};.nav-logo img{height:45px};.nav-links{top:65px};.letter-wrapper{padding-top:85px};.letter-container{padding:1.25rem};.signature-list th,.signature-list td{font-size:0.9rem;padding:0.4rem 0.5rem 0.4rem 0}}.nav-container{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;height:80px}.nav-logo img{height:60px;width:auto}.nav-brand{display:flex;align-items:center;gap:1rem;text-decoration:none;color:inherit}.nav-tagline{display:flex;flex-direction:column;line-height:1.2}.tagline-top{font-family:\'Oswald\',sans-serif;font-size:1rem;font-weight:600;color:var(--blue);text-transform:uppercase;letter-spacing:0.5px}.tagline-bottom{font-family:\'Open Sans\',sans-serif;font-size:0.85rem;font-style:italic;color:var(--red);font-weight:500}.nav-links{display:flex;list-style:none;gap:2rem;align-items:center}.nav-links a{text-decoration:none;color:var(--blue);font-weight:600;font-size:0.9rem;text-transform:uppercase;letter-spacing:0.5px;transition:color 0.3s;font-family:\'Oswald\',sans-serif}.nav-links a:hover,.nav-dropdown-trigger:hover{color:var(--red)}.nav-dropdown-trigger{cursor:pointer;color:var(--blue);font-weight:600;font-size:0.9rem;text-transform:uppercase;letter-spacing:0.5px;font-family:\'Oswald\',sans-serif}.nav-donate{background:var(--red);color:var(--white)!important;padding:0.75rem 1.5rem;border-radius:4px;transition:all 0.3s!important}.nav-donate:hover{background:var(--red-dark);transform:translateY(-2px)}.nav-item-issues{position:relative}.nav-dropdown{position:absolute;top:100%;left:50%;transform:translateX(-50%);margin-top:0.5rem;min-width:220px;background:var(--white);box-shadow:0 4px 20px rgba(0,0,0,0.15);border-radius:4px;list-style:none;padding:0.5rem 0;opacity:0;visibility:hidden;transition:opacity 0.3s,visibility 0.3s;z-index:1001}.nav-item-issues:hover .nav-dropdown{opacity:1;visibility:visible}.nav-dropdown li{margin:0}.nav-dropdown a{display:block;padding:0.6rem 1.25rem;color:var(--blue);font-size:0.85rem;text-transform:uppercase;white-space:nowrap}.nav-dropdown a:hover{background:var(--light-gray);color:var(--red)}.mobile-menu-btn{display:none;background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--blue)}.letter-wrapper{padding-top:100px;padding-bottom:3rem}.letter-container{max-width:800px;margin:0 auto;padding:2rem;background:var(--white);box-shadow:0 2px 20px rgba(0,0,0,0.06);border-radius:8px;line-height:1.8;color:var(--text)}.letter-container h1{font-family:\'Oswald\',sans-serif;color:var(--blue);text-align:center;border-bottom:3px solid var(--red);padding-bottom:0.75rem;margin-bottom:1.5rem;font-size:clamp(1.25rem,3vw,1.75rem);text-transform:uppercase}.letter-container .subtitle{text-align:center;font-style:italic;color:var(--text-light);margin-bottom:2rem}.letter-container h2{font-family:\'Oswald\',sans-serif;color:var(--blue);margin-top:2rem;margin-bottom:1rem;font-size:1.25rem;text-transform:uppercase}.letter-container p{margin-bottom:1.25rem;text-align:justify}.letter-container .salutation{margin-top:2rem}.letter-container .closing{margin-top:2rem;padding-top:1rem}.letter-container .call-to-action{background:rgba(69,123,157,0.08);border-left:4px solid var(--blue);border-radius:8px;padding:1.5rem;margin:2rem 0;text-align:center}.letter-container .call-to-action h3{font-family:\'Oswald\',sans-serif;color:var(--blue);margin-top:0;margin-bottom:1rem;text-transform:uppercase}.cta-btn{display:inline-flex;align-items:center;justify-content:center;padding:0.75rem 1.5rem;min-height:44px;background:var(--red);color:var(--white);text-decoration:none;font-weight:600;font-family:\'Oswald\',sans-serif;border-radius:4px;transition:all 0.3s;text-transform:uppercase}.cta-btn:hover{background:var(--red-dark);transform:translateY(-2px)}.signature-section{margin-top:2rem;padding-top:1.5rem;border-top:1px solid #e2e8f0}.signature-section h3{font-family:\'Oswald\',sans-serif;color:var(--blue);margin-bottom:1rem;text-transform:uppercase}.signature-list{margin-top:1rem;overflow-x:auto;-webkit-overflow-scrolling:touch}.signature-list table{width:100%;min-width:280px;border-collapse:collapse}.signature-list th{font-family:\'Oswald\',sans-serif;text-align:left;padding:0.5rem 0;border-bottom:2px solid var(--blue);color:var(--blue);text-transform:uppercase}.signature-list td{padding:0.35rem 0;border-bottom:none}.signature-list #signatureLoading,.signature-list #signatureEmpty{color:var(--text-light)}</style></head><body><nav class="nav"><div class="nav-container"><a href="' + SITE_URL + '/" class="nav-brand"><div class="nav-logo"><img src="' + SITE_URL + '/SLCo5_Logo.png" alt="Chris Null for SLCo Council 5"></div><div class="nav-tagline"><span class="tagline-top">America First Leadership</span><span class="tagline-bottom">Keeping the Dream Alive</span></div></a><button class="mobile-menu-btn" onclick="toggleMenu()">&#9776;</button><ul class="nav-links" id="navLinks"><li><a href="' + SITE_URL + '/#about">About</a></li><li><a href="' + SITE_URL + '/#endorsements">Endorsements</a></li><li><a href="' + SITE_URL + '/#media">Media</a></li><li class="nav-item-issues"><span class="nav-dropdown-trigger">Issues</span><ul class="nav-dropdown"><li><a href="' + SITE_URL + '/referendum-statement.html">Property Tax Referendum</a></li><li><a href="' + SCRIPT_URL + '">Riverton Supports ICE</a></li></ul></li><li><a href="' + SITE_URL + '/#volunteer">Get Involved</a></li><li><a href="https://secure.anedot.com/friends-of-chris-null/ccd5" class="nav-donate">Donate</a></li></ul></div></nav><div class="letter-wrapper"><article class="letter-container"><h1>An Open Letter to the Citizens of Riverton, Utah</h1><p class="subtitle">In Support of Our City\'s Partnership with ICE</p><p class="salutation">Dear Fellow Citizens of Riverton,</p><p>We write today to express our gratitude to the leaders—past and present—who have made Riverton a model for public safety in Utah.</p><p>In August 2025, former Mayor Trent Staggs and Police Chief Shane Taylor demonstrated true foresight when they made Riverton the first city in Utah to sign a 287(g) Memorandum of Agreement with U.S. Immigration and Customs Enforcement. We are equally grateful to Mayor Tish Buroker and our newly elected City Council for their continued support of this partnership. This continuity demonstrates that Riverton\'s commitment to the rule of law transcends any single administration.</p><p>Our nation was founded on the principle that laws, fairly and consistently applied, protect the rights and safety of all people. When laws are enforced inconsistently or when the rules are unclear, the result is not freedom but fear. Riverton chose clarity and consistency—and our community is safer for it.</p><p>When local leaders work alongside local police and federal agencies, operations run more smoothly and safely. This partnership allows our police department to work directly with federal partners, creating a "force multiplier" for public safety. Interference with law enforcement operations, by contrast, creates serious dangers for officers, subjects, and bystanders alike.</p><p>We hope other cities throughout Salt Lake County will follow Riverton\'s example. Together, we can make our region a safer and better place to live for all law-abiding residents.</p><div class="call-to-action"><h3>Add Your Name</h3><p>If you agree with this letter, we invite you to add your signature.</p><p style="margin-top:1rem"><a href="' + SITE_URL + '/open-letter-signup.html" class="cta-btn">Sign the Open Letter</a></p></div><p><strong>Respectfully submitted,</strong></p><p><strong>Concerned Citizens of Riverton and Salt Lake County</strong></p><div class="signature-section"><h3>Signatures</h3><div class="signature-list" id="signatureListContainer"><table id="signatureTable" style="display:' + sigTableDisplay + '"><thead><tr><th>Name</th><th>City, State</th></tr></thead><tbody id="signatureList">' + sigRowsHtml + '</tbody></table><p id="signatureLoading" style="display:' + loadingDisplay + '">Loading signatures...</p><p id="signatureEmpty" style="display:' + emptyDisplay + '"><em>No signatures yet. <a href="' + SITE_URL + '/open-letter-signup.html">Be the first to sign!</a></em></p></div></div></article></div><script>function toggleMenu(){document.getElementById("navLinks").classList.toggle("active")}document.querySelectorAll(".nav-links a").forEach(function(link){link.addEventListener("click",function(){document.getElementById("navLinks").classList.remove("active")})});</script></body></html>';
}

function doPost(e) {
  try {
    var spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    var formType = (e.parameter && e.parameter.formType) ? e.parameter.formType : 'volunteer';

    if (formType === 'openletter') {
      var sheet = spreadsheet.getSheetByName('openletter_signup');
      if (!sheet) {
        sheet = spreadsheet.insertSheet('openletter_signup');
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Phone', 'Attending', 'Need Info', 'City', 'State']);
      }
      var timestamp = new Date();
      var name = e.parameter.name || '';
      var email = e.parameter.email || '';
      var phone = e.parameter.phone || '';
      var attending = e.parameter.attending || '';
      var needInfo = e.parameter.needInfo || '';
      var city = e.parameter.city || '';
      var state = e.parameter.state || '';
      sheet.appendRow([timestamp, name, email, phone, attending, needInfo, city, state]);
    } else {
      var sheet = spreadsheet.getActiveSheet();
      var timestamp = new Date();
      var name = e.parameter.name;
      var email = e.parameter.email;
      var phone = e.parameter.phone || '';
      var zip = e.parameter.zip;
      var interest = e.parameter.interest || '';
      var message = e.parameter.message || '';
      sheet.appendRow([timestamp, name, email, phone, zip, interest, message]);
    }

    return ContentService.createTextOutput(JSON.stringify({
      'result': 'success',
      'message': 'Thank you for signing up!'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      'result': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
