const express = require('express');
const config = require('config');
const mongoose = require('mongoose');

const app = express();

const PORT = config.get('port') || 3000;



async function start() {
    try {
        await mongoose.connect(config.get('mongoUri')), {
            useNewUriParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    } catch (error) {
        console.log('Server error', error.message);
        process.exit(1);
    }
}



app.listen(PORT, () => console.log(`Server started on port ${PORT}`));