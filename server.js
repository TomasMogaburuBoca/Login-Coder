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

const users = [];

app.use(express.json());;
app.use(express.static('public'))

getNameSession = req =>{
    if (req.session.name && req.session.password){
        return `${req.session.name}`;
    }else return '';
}


/*--------REGISTER--------------*/
app.get ('/register', (req, res) =>{
    res.sendFile(__dirname + '/public/register.html')
})

app.post('/register', (req, res) =>{
    const { name, password, direction } = req.body
    const user = users.find(user => user.name == name)
    if (user) {
        res.redirect('register-error');
    }
    users.push({name, password, direction})
    res.redirect('/login')
})


/*--------LOGIN--------------*/

app.get('/login', (req, res) =>{
    res.sendFile (__dirname + '/public/login.html')
})

app.post('/login', (req, res) =>{
    const { name, password } = req.body
    const user = users.find (user => user.name == name && user.password == password)
    if (!user){
        return res.render('Login-error');
    }

    req.session.name = name;
    req.session.counter = 0;
    res.redirect('/data')

})


/*--------DATA--------------*/

app.get ('/data', (req, res) =>{
    if (req.session.name){
        req.session.counter++;
        res.render('data', {
            data: users.find (user => user.name == req.session.name),
            counter: req.session.counter
        })
    }else {res.redirect('/login')}
})

/*--------LOGOUT--------------*/

app.get ('/logout', (req, res) =>{
    let name = getNameSession(req)
    req.session.destroy(err => {
        if(!err){
            res.send(`See you ${name}` );
        }else res.send ({error: 'Forget', body: err});
    });
});

/*--------START--------------*/
app.get('/', (req, res) =>{
    if (req.session.name){
        res.redirect('/data');
    }else {res.redirect('/login')}
})



const PORT = process.env.PORT || 8081 ;

const server = app.listen(PORT, () =>{
    console.info(`Server listening in ${PORT}`)
});

server.on ('error', error => console.log(`Error in server: ${error}`));
