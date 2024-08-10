require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
mongoose.connect(process.env.DB)

const port = process.env.PORT || 3000


const app = express()
app.set('view engine', 'ejs');


const noteSchema = new mongoose.Schema({
    content: String,
    password: String
})

const Note = mongoose.model('note',noteSchema)



//server
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "/html", 'firstpage.html'),(err) => {
        if(err){
        console.dir(err)
        }
    })

})

app.get('/addnote', (req,res) => {
    res.sendFile(path.join(__dirname, "/html", 'addnote.html'),(err) => {
        if(err){
        console.dir(err)
        }
    })
})

app.get('/noteadded', (req,res) => {
    
    let content = req.query.content
    let password = req.query.password  
    let noteForAdding = new Note({content: content, password : password})

    noteForAdding.save();
    
    res.sendFile(path.join(__dirname, "/html", 'noteadded.html'),(err) => {
        if (err) console.dir(err)
        
    })

})


app.get('/findnote', (req,res) => {
    res.sendFile(path.join(__dirname,'html','findnote.html'),(err) => {
        if (err) console.dir(err)
    })
})



app.get('/notefinded', (req, res) => {
    Note.find({ password: req.query.password }, { _id: false, __v: false, password: false })
        .then((note) => {
              if (note.length) {
                let noteMessage = note[0].content;             
                res.send(`
<!DOCTYPE html>
<html>
    <head>
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f0f0f0;
                font-family: Arial, sans-serif;
                position: relative; 
            }

            .container {
                width: 400px; 
                height: 400px; 
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: #fff;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 15px;
                text-align: center;
            }

            h3 {
                color: #333;
            }

            p {
                color: #555;
                font-size: 16px;
                margin-bottom: 20px;
            }

            button {
                background-color: #007BFF;
                color: white;
                padding: 12px 20px;
                font-size: 18px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
            }

            button:hover {
                background-color: #0056b3;
            }

            form {
                width: 100%;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Note found:</h1>
            <h2>${noteMessage}</h2>
            <form action="/">
                <button>Return to the main page</button>
            </form>
        </div>
    </body>
</html>

                    `);

            } else {
                res.send(`
<!DOCTYPE html>
<html>
    <head>
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f0f0f0;
                font-family: Arial, sans-serif;
                position: relative; 
            }

            .container {
                width: 400px; 
                height: 400px; 
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background-color: #fff;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                border-radius: 15px;
                text-align: center;
            }

            h3 {
                color: #333;
            }

            p {
                color: #555;
                font-size: 16px;
                margin-bottom: 20px;
            }

            button {
                background-color: #007BFF;
                color: white;
                padding: 12px 20px;
                font-size: 18px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
            }

            button:hover {
                background-color: #0056b3;
            }

            form {
                width: 100%;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h3>Note isn't found:(</h3>

            <form action="/">
                <button>Return to the main page</button>
            </form>
        </div>
    </body>
</html>
                    `);
            }
        })
        .catch((err) => {
            res.status(500).send(err);
        });
});






app.get('/getnotes', (req,res) => {
    Note.find().then((note) => {
        res.json(note)
    
    })


    
})


app.listen(port,() => {
    console.log(`server is runnig on port: ${port}`)
})