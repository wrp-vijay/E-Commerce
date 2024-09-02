const express = require('express');
const bodyParser  = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./src/helper/logger');
const db = require('./src/models')
const productRouts = require('./src/routes/product')
const customerRouts = require('./src/routes/customer')
const orderRouts = require('./src/routes/order')
const orderitemRouts = require('./src/routes/orderitem')

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

const PORT = 5000;

app.use("/", productRouts);
app.use("/", customerRouts);
app.use("/", orderRouts);
app.use("/", orderitemRouts);

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get("/", (req,res) =>{
    res.send("hello")
}) 

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`server started at port ${PORT}`);
    })
})


