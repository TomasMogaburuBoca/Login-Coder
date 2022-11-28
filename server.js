const express = require ('express');
const cookieParser = require ('cookie-parser');
const session = require ('express-session');

const MongoStore = require ('connect-mongo');
const advancedOptions = {
    useNewUrlParser: true, useUnifiedTopology: true}
const app = express();

//app.use(cookieParser('larissa'));
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/sessions',
        mongoOptions: advancedOptions
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
        cookie: {maxAge: 6000}
}));


app.use(express.json());;
app.use(express.static('public'))

getNameSession = req =>{
    if (req.session.name && req.session.password){
        return `${req.session.name}`;
    }else return '';
}

/*--------ROUTES--------------*/

app.get('/login', (req, res) =>{
    res.sendFile (__dirname + '/public/login.html')
})

/*--------LOGIN--------------*/

app.post('/login', (req, res) =>{
    req.session.name = req.body;
    req.session.password = req.body;
    if(req.session.name && req.session.password){
        res.send(`Welcome ${getNameSession(req)}!! You are inside`)
    }else {
        let {name} = req.body
        req.session.name = name;
        req.session.counter = 1;
        res.send(`Welcome ${name}`)
    }
})

/*--------REGISTER--------------*/
app.get ('/register', (req, res) =>{
    let name = req.session.name
    if(req.session.name && req.session.password){
        res.send (`Welcome ${name}`)
    } else ('You can not see the data')
    res.redirect('/register')
})




/*--------START--------------*/

/*--------DATA--------------*/


/*--------LOGOUT--------------*/

app.get ('/logout', (req, res) =>{
    let name = getNameSession(req)
    req.session.destroy(err => {
        if(!err){
            res.send(`See you ${name}` );
        }else res.send ({error: 'Forget', body: err});
    });
});

const PORT = process.env.PORT || 8081 ;

const server = app.listen(PORT, () =>{
    console.info(`Server listening in ${PORT}`)
});

server.on ('error', error => console.log(`Error in server: ${error}`));
