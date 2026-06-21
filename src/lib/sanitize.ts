/**
 * XSS Protection and Input Sanitization Utilities
 */

// List of dangerous HTML tags
const DANGEROUS_TAGS = [
  'script', 'iframe', 'object', 'embed', 'form', 'input', 'button',
  'select', 'textarea', 'style', 'link', 'meta', 'base', 'applet',
  'frame', 'frameset', 'layer', 'ilayer', 'bgsound', 'title', 'svg',
  'math', 'template', 'noscript', 'picture', 'source', 'video', 'audio'
];

// Dangerous patterns to detect XSS attempts
const XSS_PATTERNS = [
  // Script tags and variations
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /<script[\s\S]*?>/gi,
  /<\/script>/gi,
  
  // Inline event handlers inside an HTML tag (onclick=, onerror=, ...).
  // Tag context required so plain prose like "online=yes" is not flagged.
  /<[^>]*\son\w+\s*=/gi,

  // JavaScript protocol
  /javascript\s*:/gi,
  /vbscript\s*:/gi,
  /livescript\s*:/gi,
  
  // Data URIs that could execute code
  /data\s*:\s*text\/html/gi,
  /data\s*:\s*application\/javascript/gi,
  /data\s*:\s*application\/x-javascript/gi,
  /data\s*:\s*text\/javascript/gi,
  
  // Expression (IE CSS expression)
  /expression\s*\(/gi,
  
  // SVG/XML attacks
  /<svg[\s\S]*?>/gi,
  /<math[\s\S]*?>/gi,
  
  // HTML entities that could be used for obfuscation
  /&#x?[0-9a-f]+;?/gi,
  
  // Base64 encoded scripts
  /base64\s*,/gi,
  
  // URL encoded scripts
  /%3Cscript/gi,
  /%3C\/script/gi,
  
  // Unicode escapes
  /\\u003c/gi,
  /\\u003e/gi,
];

// Patterns that indicate malicious intent. Messages are rendered as plain text
// (React auto-escapes), so we only flag genuinely dangerous DOM-write syntax and
// avoid bare keywords like eval(/fetch( that appear in ordinary or dev chat.
const MALICIOUS_PATTERNS = [
  /document\s*\.\s*cookie/gi,
  /document\s*\.\s*write/gi,
  /\.innerHTML\s*=/gi,
  /\.outerHTML\s*=/gi,
];

/**
 * Check if message contains XSS attack patterns
 */
export function containsXSS(input: string): boolean {
  if (!input) return false;
  
  // Check for dangerous tags
  for (const tag of DANGEROUS_TAGS) {
    const tagPattern = new RegExp(String.raw`<\s*${tag}[\s>]`, 'i');
    if (tagPattern.test(input)) {
      return true;
    }
  }
  
  // Check XSS patterns
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(input)) {
      return true;
    }
  }
  
  // Check malicious patterns
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(input)) {
      return true;
    }
  }
  
  // Check for HTML tags in general (less strict)
  if (/<[a-z][\s\S]*>/i.test(input)) {
    return true;
  }
  
  return false;
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(input: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  
  return input.replaceAll(/[&<>"'`=/]/g, (char) => htmlEscapes[char] || char);
}

/**
 * Sanitize message by removing/escaping dangerous content
 */
export function sanitizeMessage(input: string): string {
  if (!input) return '';
  
  let sanitized = input;
  
  // Remove null bytes and control characters (using character codes)
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replaceAll(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  
  // Do NOT HTML-escape here: the message is rendered as plain text by React, which
  // already escapes on output. Escaping at storage time double-encodes punctuation
  // (e.g. "a/b = c" would otherwise display as visible entities).

  // Trim and limit length
  sanitized = sanitized.trim().slice(0, 2000);
  
  return sanitized;
}

/**
 * Validate message for chat
 */
export function validateChatMessage(message: string): { 
  valid: boolean; 
  error?: string;
  sanitized?: string;
} {
  // Check if empty
  if (!message || message.trim().length === 0) {
    return { valid: false, error: "Message cannot be empty" };
  }
  
  // Check length
  if (message.length > 2000) {
    return { valid: false, error: "Message is too long (max 2000 characters)" };
  }
  
  // Check for XSS attempts
  if (containsXSS(message)) {
    return { 
      valid: false, 
      error: "Message contains disallowed content. HTML and scripts are not permitted." 
    };
  }
  
  // Check for excessive special characters (potential obfuscation)
  const specialCharRatio = (message.match(/[^a-zA-Z0-9\s.,!?'"()-]/g) || []).length / message.length;
  if (specialCharRatio > 0.5 && message.length > 20) {
    return { 
      valid: false, 
      error: "Message contains too many special characters" 
    };
  }
  
  // Return sanitized message
  return { 
    valid: true, 
    sanitized: sanitizeMessage(message)
  };
}

/**
 * Quick check for obviously malicious content
 * Use this for fast rejection before deeper analysis
 */
export function isMalicious(input: string): boolean {
  if (!input) return false;
  
  // Tag/script-injection signals only. Bare substrings like "document." or "window."
  // match ordinary prose ("look out the window.") and were rejecting valid messages.
  const quickPatterns = [
    /<script/i,
    /javascript:/i,
    /<iframe/i,
    /<svg/i,
    /<img[^>]+onerror/i,
    /<[^>]*\son\w+\s*=/i,
  ];
  
  return quickPatterns.some(pattern => pattern.test(input));
}
