const { isKeywordMatch, interpolateVariables, isWithinWorkingHours } = require('./matcher');

// In-memory cooldown cache: key: `${contactNumber}_${ruleId}` -> timestamp
const cooldownCache = new Map();

/**
 * Main Auto-Reply dispatcher
 */
async function processAutoReply({ sessionId, remoteJid, contactNumber, contactName, text, sock, io }) {
  try {
    // In production, rules are fetched from Prisma DB or cache
    // Mock / fallback rules if DB is not initialized
    const rules = global.autoReplyRules || [
      {
        id: 'rule-1',
        name: 'Welcome & Greeting',
        keywords: ['hi', 'hello', 'hey', 'start'],
        matchType: 'contains',
        replyType: 'text',
        replyContent: 'Hello {{name}}! 👋 Welcome to Jeenash Enterprise. How can our team assist you today?\n\n1️⃣ Product Pricing & Plans\n2️⃣ Schedule Live Demo\n3️⃣ Talk to Support Rep',
        delaySeconds: 3,
        workingHoursOnly: false,
        cooldownSeconds: 120,
        priority: 90,
        enabled: true,
        applyToSessionIds: ['all']
      },
      {
        id: 'rule-2',
        name: 'Pricing & Brochure',
        keywords: ['price', 'pricing', 'cost', 'plan'],
        matchType: 'contains',
        replyType: 'text',
        replyContent: 'Here is our standard pricing structure, {{name}}:\n🚀 Starter: $29/mo\n⚡ Pro: $79/mo\n🏢 Enterprise: $199/mo\n\nWould you like a full consultation at {{time}}?',
        delaySeconds: 4,
        workingHoursOnly: false,
        cooldownSeconds: 300,
        priority: 80,
        enabled: true,
        applyToSessionIds: ['all']
      }
    ];

    // Sort by priority descending (highest priority runs first)
    const sortedRules = [...rules].sort((a, b) => (b.priority || 0) - (a.priority || 0));

    for (const rule of sortedRules) {
      if (!rule.enabled) continue;

      // Check session compatibility
      if (
        rule.applyToSessionIds &&
        !rule.applyToSessionIds.includes('all') &&
        !rule.applyToSessionIds.includes(sessionId)
      ) {
        continue;
      }

      // Check working hours
      if (rule.workingHoursOnly && !isWithinWorkingHours(rule.workingHoursStart, rule.workingHoursEnd)) {
        continue;
      }

      // Check cooldown per contact
      const cooldownKey = `${contactNumber}_${rule.id}`;
      const lastSent = cooldownCache.get(cooldownKey);
      const now = Date.now();
      const cooldownMs = (rule.cooldownSeconds || 60) * 1000;

      if (lastSent && now - lastSent < cooldownMs) {
        console.log(`[AutoReply] Skipped rule "${rule.name}" for ${contactNumber}: Cooldown active`);
        continue;
      }

      // Test match
      if (isKeywordMatch(rule, text)) {
        console.log(`[AutoReply] Matched rule "${rule.name}" for contact ${contactNumber}`);

        // Update cooldown
        cooldownCache.set(cooldownKey, now);

        // Calculate natural delay (e.g. 2-5 sec)
        const delaySeconds = rule.delaySeconds || 2;
        const delayMs = Math.max(1000, delaySeconds * 1000);

        // Send 'composing' presence in WhatsApp so the contact sees "Typing..."
        if (sock && sock.sendPresenceUpdate) {
          try {
            await sock.sendPresenceUpdate('composing', remoteJid);
          } catch (e) {
            // non-fatal
          }
        }

        // Wait natural delay
        await new Promise(resolve => setTimeout(resolve, delayMs));

        // Format message with dynamic variables
        const formattedReply = interpolateVariables(rule.replyContent, contactName);

        // Send message via Baileys
        if (sock && sock.sendMessage) {
          await sock.sendMessage(remoteJid, { text: formattedReply });
        }

        // Notify front-end dashboard via Socket.io
        if (io) {
          io.emit('chat:autoreply_dispatched', {
            sessionId,
            contactNumber,
            contactName,
            ruleName: rule.name,
            text: formattedReply,
            delayMs
          });
        }

        // Only first matching rule fires
        break;
      }
    }
  } catch (error) {
    console.error(`[AutoReply] Error processing auto-reply:`, error);
  }
}

module.exports = {
  processAutoReply
};
