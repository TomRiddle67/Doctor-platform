const axios = require('axios');
console.log('Paystack Key:', process.env.PAYSTACK_SECRET_KEY);

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const paystackRequest = async (method, endpoint, data = {}) => {
    const response = await axios({
        method,
        url: `${PAYSTACK_BASE_URL}${endpoint}`,
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        data,
    });
    return response.data;
};

const initializePayment = async (email, amount, reference, metadata = {}) => {
    return await paystackRequest('post', '/transaction/initialize', {
        email,
        amount: amount * 100, // Paystack uses kobo (multiply by 100)
        reference,
        metadata,
    });
};

const verifyPayment = async (reference) => {
    return await paystackRequest('get', `/transaction/verify/${reference}`);
};

module.exports = { initializePayment, verifyPayment };