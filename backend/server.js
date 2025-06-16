require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const Keycloak = require("keycloak-connect")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

// Session & Keycloak
const memoryStore = new session.MemoryStore();
app.use(session({
    secret: "supper-secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));

const keycloak = new Keycloak({ store: memoryStore })
app.use(keycloak.middleware());

// Test route
app.get("/public", (req, res) => res.send("Public route"))
app.get("/secure", keycloak.protect(), (req, res) => res.send("Secure route"))

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB")
        app.listen(5000, () => console.log("Server on http://localhost:5000"));
    });
    