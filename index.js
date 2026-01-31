const http = require("http")
const url = require("url")
const fs = require("fs")
const kfpmovie = require("./data/movies.js")

http.createServer((req, res) => {
  const address = url.parse(req.url, true)
  const currentPath = address.pathname
  const { movie, lang } = address.query

  const header = title => `<header><h1>${title}</h1></header>`

  const nav = () => `
    <nav>
      <a href="/">Home</a>
      <a href="/kfp">Kung Fu Panda</a>
      <a href="/kfp/movies">Movies</a>
      <a href="/kfp/characters">Characters</a>
      <a href="/kfp/about">About</a>
    </nav>
  `

  const footer = () => `<footer>&copy; 2026 Kung Fu Panda</footer>`

  res.writeHead(200, { "Content-Type": "text/html" })
  res.write(nav())

  //     HOME (external file- html)     
  if (currentPath === "/") {
    res.write(header("Home"))

    fs.readFile("./content/home.html", (err, data) => {
      if (err) {
        res.write("Could not load home page")
      } else {
        res.write(data)
      }
      res.write(footer())
      res.end()
    })
  }

  //   KFP (HTML in JS)      
  if (currentPath === "/kfp") {
    res.write(header("Kung Fu Panda"))

    res.write(`
      <p>The Kung Fu Panda series follows Po on his journey to become
      the Dragon Warrior.</p>
    `)

    res.write(footer())
    res.end()
  }
  //   MOVIES (data + queries)        
  if (currentPath === "/kfp/movies") {
    res.write(header("Kung Fu Panda Movies"))

    // List all movies with links including two queries: movie and lang
    kfpmovie.forEach(kfpm => {
      res.write(
        `<p><a href="/kfp/movies?movie=${kfpm.id}&lang=eng">${kfpm.name}</a></p>`
      )
    })

    const selectedMovie = movie
    // Default language is English if not provided
    let displayLang = lang || "eng"

    if (selectedMovie) {
      const featuredMovie = kfpmovie.find(kfpm => kfpm.id === selectedMovie)

      if (featuredMovie) {
        // Extra info appears only if language is NOT English
        let extraInfo = ""
        if (displayLang !== "eng") {
          extraInfo = `<p><strong>Extra info:</strong> English subtitles available</p>`
        }

        res.write(`
        <div>
          <h3>${featuredMovie.name}</h3>
          <p>Year: ${featuredMovie.year}</p>
          <p>Director: ${featuredMovie.director}</p>
          <p>Language: ${featuredMovie.language}</p>
          ${extraInfo}
        </div>
      `)
      }
    }

    res.write(footer())
    res.end()
  }

  //  CHARACTERS (external file)   //
  if (currentPath === "/kfp/characters") {
    res.write(header("Characters"))

    fs.readFile("./content/characters.txt", (err, data) => {
      if (err) {
        res.write("Could not load characters")
      } else {
        res.write(`<pre>${data}</pre>`)
      }
      res.write(footer())
      res.end()
    })
  }

  //   ABOUT (HTML in JS) 
  if (currentPath === "/kfp/about") {
    res.write(header("About"))

    res.write(`
      <p>This site was created as a Node.js assignment.</p>
      <p>All content is delivered using the request/response model.</p>
    `)

    res.write(footer())
    res.end()
  }

}).listen(5055, () => {
  console.log("Server running on port 5055")
})

