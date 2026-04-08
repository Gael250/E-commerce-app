
require('dotenv').config();

const generateWhatsAppURL = ({ orderId, customerName, amount }) => {
  const phone = process.env.SHOPKEEPER_WHATSAPP;
  if (!phone) {
    throw new Error('SHOPKEEPER_WHATSAPP is not defined in environment variables');
  }

  const message = `Hello, I would like to confirm my order.\nOrder ID: ${orderId}\nName: ${customerName}\nAmount: ${amount}`;

  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${phone}?text=${encodedMessage}`;
};
exports.createWhatsAppRedirect = (req, res) => {
  try {
    const url = generateWhatsAppURL(req.body);
    return res.status(200).json({
      success: true,
      whatsappUrl: url
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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

