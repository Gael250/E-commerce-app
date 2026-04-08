// controllers/whatsappController.js - WhatsApp integration functions

const sendWhatsAppMessage = async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Phone and message are required'
      });
    }

    res.status(200).json({
      success: true,
      message: 'WhatsApp message queued',
      data: { phone, message }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error sending WhatsApp message',
      error: error.message
    });
  }
};

module.exports = {
  sendWhatsAppMessage
};
