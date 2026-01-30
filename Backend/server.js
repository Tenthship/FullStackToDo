const express = require("express")
const db = require("./database.js")
const app = express()
const PORT = 5050

// Create Table
sql = `CREATE TABLE IF NOT EXISTS tasks(id INTEGER PRIMARY KEY,task TEXT,date TEXT,completed INTEGER)`
db.run(sql)

app.use(express.static("./Frontend"))
app.use(express.json())

app.get("/todo", (req, res) => {
    sql = `SELECT * FROM tasks`
    db.all(sql,[],(err,rows) => {
        if (err) return console.error(err.message)
            console.log(rows)
            res.json(rows)
    })
})

app.post("/todo", (req, res) => {
    sql = `INSERT INTO tasks(task,date,completed) VALUES (?,?,?)`
    db.run(sql,[req.body.task, new Date(), 0],(err) => {
        if (err) return console.error(err.message)
        res.json({ success: true })
    })
})

app.put("/todo/:id", (req, res) => {
  // UPDATE todos SET completed = ? WHERE id = ?
})

app.delete("/todo/:id", (req, res) => {
    const id = req.params.id[1]
    sql = `DELETE from tasks WHERE id = ?`
    db.run(sql,[id],(err) => {
        if (err) return console.error(err.message)
        res.json({ success: true })
    })
    
  // DELETE FROM todos WHERE id = ?
})

app.listen(PORT, () => {
    console.log("Server running")
})
