const express = require('express');
const config = require('config');
const path = require('path');
const mongoose = require('mongoose'); // база данных
const morgan = require('morgan'); // логирование
const helmet = require('helmet'); // защита HTTP запросов
const Logger = require('./modules/log')(module); // логирование в файл

const app = express();

app.use(express.json({extended: true}))

// роутинг
app.get('/', function(req, res) {
    res.send('Node.JS resume Server');
});
app.use('/api/data', require('./routes/data.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

app.use(helmet());
app.use(morgan('dev'));

const PORT = config.get('port') || 5000;

async function start() {
    try {
        await mongoose.connect(config.get('mongoUrl'), {
           useNewUrlParser: true,
           useUnifiedTopology: true,
           useCreateIndex: true
        });
        app.listen(PORT, () => console.log(`Node has been started on port ${PORT}...`));
        console.log(`MongoDB Server: ${config.get('mongoServer')}...`);
    } catch (e) {
        Logger.error(`Server Error: ${e.message}`);
        process.exit(1);
    }
}

start();