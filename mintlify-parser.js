#!/usr/bin/env node
const fs = require('fs');

/**
 * Parses Mintlify llms-full.txt and extracts only English content
 * (removes sections with non-English source URLs like /es/, /fr/, etc.)
 */
async function parseEnglishOnly(url) {
  if (!url) {
    console.error('❌ Error: Please provide a URL to a Mintlify llms-full.txt file.');
    console.log('Usage: mintlify-parser <URL>');
    return;
  }

  console.log(`⬇️  Fetching data from: ${url}`);

  try {
    // Fetch the content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error(`❌ Error fetching URL: Received status code ${response.status}`);
      return;
    }

    const content = await response.text();
    console.log('⚙️  Parsing content...');

    // Split content into sections based on the "# Title\nSource: URL" pattern
    const sections = content.split(/(?=^# .+$\nSource: https?:\/\/.+$)/m);

    const englishSections = [];
    let removedCount = 0;

    for (const section of sections) {
      if (!section.trim()) continue;

      // Extract the source URL from the section
      const sourceMatch = section.match(/^Source: (https?:\/\/.+)$/m);

      if (sourceMatch) {
        const sourceUrl = sourceMatch[1];

        // Check if URL contains language codes like /es/, /fr/, /de/, etc.
        // We want to exclude any URL with a language code path
        const hasLangCode = /\/[a-z]{2}\//.test(sourceUrl);

        if (!hasLangCode) {
          englishSections.push(section.trim());
        } else {
          removedCount++;
          console.log(`🗑️  Removed: ${sourceUrl}`);
        }
      } else {
        // If no source URL found, keep the section (might be intro content)
        if (section.trim().length > 0) {
          englishSections.push(section.trim());
        }
      }
    }

    // Join all English sections
    const englishContent = englishSections.join('\n\n---\n\n');

    // Extract domain from URL for filename
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace(/^www\./, ''); // Remove www. if present
    const outputFilename = `${domain}.md`;

    fs.writeFileSync(outputFilename, englishContent, 'utf8');

    console.log(`\n✅ Success!`);
    console.log(`📊 Total sections found: ${sections.length}`);
    console.log(`🗑️  Non-English sections removed: ${removedCount}`);
    console.log(`📝 English sections kept: ${englishSections.length}`);
    console.log(`💾 Output saved to: ${outputFilename}`);

  } catch (error) {
    console.error('❌ An unexpected error occurred:', error.message);
  }
}

// Run the script
const urlToParse = process.argv[2];
parseEnglishOnly(urlToParse);
