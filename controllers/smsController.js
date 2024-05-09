const smsAPiKey = process.env.SEMAPHORE_API_KEY
const fetch = require('node-fetch');
const usersModel = require('../Models/usersModel.js')
const mongoose = require('mongoose')

/*const sendAcceptSMS = async(req,res) =>{
    const {uid} = req.params;
    try {
        const user = await usersModel.findById(uid)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const smsMessage = 'You are accepted to apply for Senior Citizen ID please proceed to Osca'
        const phoneNumberWithoutCountryCode = user.MobilePhone; // Assuming the phone number is stored in the 'MobilePhone' field
        const phoneNumberWithCountryCode = `+63${phoneNumberWithoutCountryCode}`;

        //payload for SemaphoreAPI
        const payload = {
            apikey: smsAPiKey,
            number: phoneNumberWithCountryCode,
            message: smsMessage
        };

        const response = await fetch('https://api.semaphore.co/api/v4/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(payload)
        });
          // Check if the request was successful
          if (!response.ok) {
            throw new Error('Failed to send SMS');
        }
        res.send('SMS sent successfully');
        console.log('SMS DATA', response)
    } catch (err) {
        console.error('Error sending SMS:', err);
        res.status(500).send('Failed to send SMS');
    }
}*/

/*const sendDenySMS = async(req,res) =>{
    const {uid} = req.params;
    try {
        const user = await usersModel.findById(uid)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const smsMessage = 'You are Denied for applying Senior Citizen ID please inquire at OSCA for more informations'
        const phoneNumberWithoutCountryCode = user.MobilePhone; // Assuming the phone number is stored in the 'MobilePhone' field
        const phoneNumberWithCountryCode = `+63${phoneNumberWithoutCountryCode}`;

        const payload = {
            apikey: smsAPiKey,
            number: phoneNumberWithCountryCode,
            message: smsMessage
        };

        const response = await fetch('https://api.semaphore.co/api/v4/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(payload)
        });
          // Check if the request was successful
          if (!response.ok) {
            throw new Error('Failed to send SMS');
        }
        res.send('SMS sent successfully');
        console.log('SMS DATA', response)
    } catch (err) {
        console.error('Error sending SMS:', err);
        res.status(500).send('Failed to send SMS');
    }
}*/


const sendSmSText =async (req,res) =>{
    const {uid } = req.params;
    const { messageText } = req.body;
    try {
        const user = await usersModel.findById(uid)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const sentMessage = `${messageText}`;
        const phoneNumberWithoutCountryCode = user.MobilePhone; // Assuming the phone number is stored in the 'MobilePhone' field
        const phoneNumberWithCountryCode = `+63${phoneNumberWithoutCountryCode}`;

        //payload for SemaphoreAPI
        const parameters = {
            apikey: smsAPiKey,
            number: phoneNumberWithCountryCode,
            message: sentMessage,
        };

        const response = await fetch('https://api.semaphore.co/api/v4/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(parameters)
        });
          // Check if the request was successful
          if (!response.ok) {
            throw new Error('Failed to send SMS');
        }
        res.send('SMS sent successfully');
        console.log('Message',sentMessage)
        console.log('MobilePhone', phoneNumberWithCountryCode)
        console.log('SMS DATA', response)
    } catch (err) {
        console.error('Error sending SMS:', err);
        res.status(500).send('Failed to send SMS');
    }
}


const sendBulkSMS = async (req, res) => {
    const  uids  = req.params.uids.split(','); // Assume uids is an array of user IDs
    const { messageText } = req.body;
    console.log("Received IDs:", uids);

    try {
        // Fetch all users by IDs
        const users = await usersModel.find({
            '_id': { $in: uids }
        });

        if (users.length === 0) {
            return res.status(404).json({ error: 'No users found' });
        }

        // Collect all phone numbers
        const phoneNumbers = users.map(user => {
            const phoneNumberWithoutCountryCode = user.MobilePhone;
            return `+63${phoneNumberWithoutCountryCode}`;
        });

        // Convert array of numbers into a single string separated by commas
        const numbers = phoneNumbers.join(',');

        // Payload for SemaphoreAPI
        const parameters = {
            apikey: smsAPiKey, // Ensure your API key is correctly referenced
            number: numbers,
            message: messageText,
        };

        const response = await fetch('https://api.semaphore.co/api/v4/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(parameters)
        });

        if (!response.ok) {
            throw new Error('Failed to send SMS');
        }
        console.log('Message',messageText)
        console.log('MobilePhone', phoneNumbers)
        console.log('SMS DATA', response)
        res.send({ message: 'Bulk SMS sent successfully' });
    } catch (err) {
        //console.error('Error sending bulk SMS:', err);
        res.status(500).json({ error: 'Failed to send bulk SMS' });
    }
};




module.exports = {
    //sendAcceptSMS, 
    //sendDenySMS,
    sendSmSText,
    sendBulkSMS,
};
