/**
 * Matcher module for Auto-Reply Engine
 */

/**
 * Checks if incoming text satisfies a rule's match condition
 */
function isKeywordMatch(rule, text) {
  if (!text) return false;
  const input = text.trim().toLowerCase();

  let keywords = [];
  if (Array.isArray(rule.keywords)) {
    keywords = rule.keywords;
  } else if (typeof rule.keywords === 'string') {
    try {
      keywords = JSON.parse(rule.keywords);
    } catch (e) {
      keywords = rule.keywords.split(',').map(k => k.trim());
    }
  }

  return keywords.some(keyword => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return false;

    switch (rule.matchType) {
      case 'exact':
        return input === kw;
      case 'contains':
        return input.includes(kw);
      case 'startsWith':
        return input.startsWith(kw);
      case 'endsWith':
        return input.endsWith(kw);
      case 'regex':
        try {
          const rx = new RegExp(keyword.trim(), 'i');
          return rx.test(text.trim());
        } catch (e) {
          return false;
        }
      default:
        return false;
    }
  });
}

/**
 * Replaces placeholders: {{name}}, {{time}}, {{date}}
 */
function interpolateVariables(template, contactName, timezone = 'UTC') {
  if (!template) return '';
  const now = new Date();
  
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone === 'UTC' ? undefined : timezone
  });

  const dateStr = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: timezone === 'UTC' ? undefined : timezone
  });

  return template
    .replace(/{{name}}/gi, contactName || 'Customer')
    .replace(/{{time}}/gi, timeStr)
    .replace(/{{date}}/gi, dateStr);
}

/**
 * Validates whether current time falls within working hours
 */
function isWithinWorkingHours(startTime = '09:00', endTime = '21:00') {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  const startTotal = startH * 60 + startM;
  const endTotal = endH * 60 + endM;

  if (startTotal <= endTotal) {
    return currentMinutes >= startTotal && currentMinutes <= endTotal;
  } else {
    // Overnight window (e.g. 22:00 to 06:00)
    return currentMinutes >= startTotal || currentMinutes <= endTotal;
  }
}

module.exports = {
  isKeywordMatch,
  interpolateVariables,
  isWithinWorkingHours
};
