// Map common company names to their logo paths
const companyLogoMap: Record<string, string> = {
  // Tech companies
  'meta': '/covers/facebook.png', 
  'facebook': '/covers/facebook.png',
  'fb': '/covers/facebook.png',
  
  'google': '/covers/google.png',
  'alphabet': '/covers/google.png',
  
  'microsoft': '/covers/microsoft.png',
  'msft': '/covers/microsoft.png',
  
  'apple': '/covers/apple.png',
  
  'amazon': '/covers/amazon.png',
  'aws': '/covers/amazon.png',
  
  'netflix': '/covers/netflix.png',
  
  'adobe': '/covers/adobe.png',
  
  'spotify': '/covers/spotify.png',
  
  'twitter': '/covers/twitter.png',
  'x': '/covers/twitter.png',
  
  'reddit': '/covers/reddit.png',
  
  'tiktok': '/covers/tiktok.png',
  'bytedance': '/covers/tiktok.png',
  
  'quora': '/covers/quora.png',
  
  'yahoo': '/covers/yahoo.png',
  
  'skype': '/covers/skype.png',
  
  'telegram': '/covers/telegram.png',
  
  'linkedin': '/covers/linkedin.png',
  
  'github': '/covers/github.png',
  
  'pinterest': '/covers/pinterest.png',
  
  'uber': '/covers/uber.png',
  
  'airbnb': '/covers/airbnb.png',
  
  'stripe': '/covers/stripe.png',
  
  'dropbox': '/covers/dropbox.png',
  
  // Default for unknown companies
  'default': '/default-avatar.png'
};

/**
 * Get the logo path for a given company name
 * @param companyName The company name to find a logo for
 * @returns The path to the company logo
 */
export function getCompanyLogo(companyName: string): string {
  if (!companyName) return companyLogoMap.default;
  
  // Normalize company name for matching
  const normalizedCompany = companyName.trim().toLowerCase();
  
  // STEP 1: Exact match check - highest priority
  if (companyLogoMap[normalizedCompany]) {
    console.log(`[Logo] Exact match for "${companyName}": ${companyLogoMap[normalizedCompany]}`);
    return companyLogoMap[normalizedCompany];
  }
  
  // STEP 2: Special case for Meta/Facebook
  if (normalizedCompany === 'meta' || normalizedCompany === 'meta platforms') {
    console.log(`[Logo] Meta special case for "${companyName}": ${companyLogoMap['facebook']}`);
    return companyLogoMap['facebook'];
  }
  
  // STEP 3: Word boundary match - check if company name starts with a known company
  // This prevents "adobe metadata" from matching with "meta"
  const companyWords = normalizedCompany.split(/\s+/);
  for (const word of companyWords) {
    if (companyLogoMap[word]) {
      console.log(`[Logo] Word match for "${companyName}" -> "${word}": ${companyLogoMap[word]}`);
      return companyLogoMap[word];
    }
  }
  
  // STEP 4: First-word match (often the most important part of company name)
  if (companyWords.length > 0 && companyLogoMap[companyWords[0]]) {
    console.log(`[Logo] First word match for "${companyName}" -> "${companyWords[0]}": ${companyLogoMap[companyWords[0]]}`);
    return companyLogoMap[companyWords[0]];
  }
  
  // STEP 5: Check for word prefix matches
  // Sort by length in descending order to match the most specific company name first
  const companies = Object.keys(companyLogoMap)
    .filter(company => company !== 'default')
    .sort((a, b) => b.length - a.length);
  
  for (const word of companyWords) {
    for (const company of companies) {
      // Check if a word starts with a company name (like "google" in "googleplex")
      if (word.startsWith(company) && company.length > 2) { // only for substantial matches
        console.log(`[Logo] Word prefix match for "${companyName}" -> "${company}": ${companyLogoMap[company]}`);
        return companyLogoMap[company];
      }
    }
  }
  
  // STEP 6: Substring match (lowest priority, most prone to false matches)
  // Only check for substantial company names (length > 3) to avoid matching common short strings
  for (const company of companies) {
    if (company.length > 3 && normalizedCompany.includes(company)) {
      console.log(`[Logo] Substring match for "${companyName}" -> "${company}": ${companyLogoMap[company]}`);
      return companyLogoMap[company];
    }
  }
  
  // If no match found, return default
  console.log(`[Logo] No match for "${companyName}", using default`);
  return companyLogoMap.default;
}
