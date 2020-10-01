import express from 'express'
import fs from 'fs/promises'

const app = express()

//config connect adress
const IP_LOCAL = '172.21.197.26'
const PORT = 7777

app.get('/', (req, res) => {
    res.send(`
    <h1>Exercices express partie 2</h1>
    <p><a href="http://172.21.197.26:7777/get_current_time">2. get_current_time</a></p>
    <p><a href="http://172.21.197.26:7777/how_pass_data">3. how_pass_data</a></p>
    <p><a href="http://172.21.197.26:7777/sendMessage">4. sendMessage</a></p>
    `)
})

/*2. Ajouter une route /get_current_time qui retournera à l'utilisateur la date du serveur sur lequel s'exécute app.js */
const timer = (req, res, next) => {
    const date = new Date()
    req.requestDate = date.toUTCString()
    res.send(req.requestDate)
    next()
}

app.use('/get_current_time', timer)

/*3. Ajouter une route /how_pass_data qui retourne à l'utilisateur un message qui lui explique comment on passe des données d'un handler/middleware à un autre sur express */
const useMiddleware = (req, res, next) => {
    res.send(
        `<a href="https://expressjs.com/fr/guide/using-middleware.html">Utilisation de middleware</a>
        <p>Pour passer des données d'un middleware à l'autre nous utilisons la variable nommé next. Exemple : <div><code>var app = express();

        app.use(function (req, res, next) {
          console.log('Time:', Date.now());
          next();
        });</code></div></p>
        `
    )
    next()
}

app.use('/how_pass_data', useMiddleware)

/*4. L'ordre dans lequel nous appliquons nos middleware est très important. Ils seront exécutés dans l'ordre de nos app.use.
Des middlewares peuvent aussi être executés après un app.get. Ajouter un middleware, /sendMessage qui s'appliquera à toute les routes et qui se chargera d'envoyer le message de réponse à l'utilisateur. Il y aura des modifications à appliquer aux routes que vous avez écrites précédement, afin qu'elles puissent gérer ce middleware. */
const sendMessage = (req, res, next) => {
    req.message = `${timer} ${useMiddleware}`
    res.send(req.message)
}
app.use(sendMessage)

/*5. Ajouter un middleware wrappWithHtml qui s'appliquera à toutes les routes, et qui transformera nos messages texte en messages au format HTML.
Vous pouvez utiliser pour cela ce template*/
const wrappWithHtml = (req, res, next) => {
    res.send(`<!DOCTYPE html>

    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Exercices express 2</title>
      </head>
    
      <body>
        <p>${sendMessage}</p>
      </body>
    </html>`)
    next()
}
app.use(wrappWithHtml)

// launch server
app.listen(PORT, IP_LOCAL, () => {
    console.log(`start server http://${IP_LOCAL}:${PORT}`)
})
