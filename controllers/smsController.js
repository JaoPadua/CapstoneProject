const smsAPiKey = process.env.SEMAPHORE_API_KEY
const fetch = require('node-fetch');
const usersModel = require('../Models/usersModel.js')
const mongoose = require('mongoose')

const sendAcceptSMS = async(req,res) =>{
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
}

const sendDenySMS = async(req,res) =>{
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
}


const sendSmSText =async (req,res) =>{
    const {uid, messageText } = req.params;
    try {
        const user = await usersModel.findById(uid)
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const phoneNumberWithoutCountryCode = user.MobilePhone; // Assuming the phone number is stored in the 'MobilePhone' field
        const phoneNumberWithCountryCode = `+63${phoneNumberWithoutCountryCode}`;

        //payload for SemaphoreAPI
        const payload = {
            apikey: smsAPiKey,
            number: phoneNumberWithCountryCode,
            message: messageText
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
}



module.exports = {sendAcceptSMS, sendDenySMS,sendSmSText};
