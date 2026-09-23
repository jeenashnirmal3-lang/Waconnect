const { processAutoReply } = require('../autoReply/engine');

/**
 * Handles incoming messages from Baileys socket
 */
async function handleIncomingMessage(upsertEvent, sessionId, sock, io) {
  try {
    const { messages, type } = upsertEvent;
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message) continue;

      // Extract message text
      const messageContent =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        msg.message.videoMessage?.caption ||
        '';

      const fromMe = msg.key.fromMe;
      const remoteJid = msg.key.remoteJid;

      // Filter out status broadcast or group messages if only 1-on-1 business chat
      if (remoteJid === 'status@broadcast') continue;

      const contactNumber = remoteJid.replace(/@.+/, '');
      const pushName = msg.pushName || contactNumber;

      const chatPayload = {
        id: msg.key.id,
        sessionId,
        remoteJid,
        contactNumber,
        contactName: pushName,
        fromMe,
        text: messageContent,
        timestamp: new Date((msg.messageTimestamp || Date.now() / 1000) * 1000).toISOString()
      };

      // Broadcast incoming message in real-time to dashboard via Socket.io
      if (io) {
        io.emit('chat:message', chatPayload);
      }

      // If incoming from client and not from me, trigger auto-reply engine
      if (!fromMe && messageContent.trim()) {
        await processAutoReply({
          sessionId,
          remoteJid,
          contactNumber,
          contactName: pushName,
          text: messageContent,
          sock,
          io
        });
      }
    }
  } catch (error) {
    console.error(`[Session ${sessionId}] Error handling incoming message:`, error);
  }
}

module.exports = {
  handleIncomingMessage
};
