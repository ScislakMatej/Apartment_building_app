const express = require('express');
const sql = require('mssql');  // Import mssql client
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Načítanie environment premenných
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Allow CORS requests from all origins

app.use(express.static(path.join(__dirname, 'src')));

// Database configuration for SQL Server (Azure)
const dbConfig = {
    user: process.env.DB_USER || 'Admin1',
    password: process.env.DB_PASSWORD || 'PMprojekt1',
    server: process.env.DB_HOST || 'pm-server-database.database.windows.net',  // Azure SQL Server host
    database: process.env.DB_NAME || 'PM_database',
    options: {
        encrypt: true, // Use encryption for Azure SQL
        trustServerCertificate: true // Necessary if you're connecting with SSL
    }
};

// Define pool variable
let pool;

// Connect to SQL Server
sql.connect(dbConfig).then(p => {
    pool = p;  // Assign the connected pool to the variable
    if (pool.connected) {
        console.log('Pripojený k SQL databáze (Azure)');
    }
}).catch(err => {
    console.error('Nepodarilo sa pripojiť k databáze:', err);
    process.exit(1); // Exit if connection fails
});

//* -------------------------------------PRIHLASENIE POUZIVATELA ----------------------------------- */
// Route pre login
app.post('/login', async (req, res) => {
    const { name, password } = req.body;  // Získame údaje z tela požiadavky

    // Skontrolujeme, či name a password boli poskytnuté
    if (!name || !password) {
        return res.status(400).json({ message: 'Prosím zadajte používateľské meno a heslo.' });
    }

    try {
        // SQL dotaz na SQL Server (Azure) - hľadáme podľa 'meno'
        const sqlQuery = `SELECT * FROM clenovia_bytovky WHERE meno = @meno`;  // Hľadáme podľa 'meno'

        // Create a request to execute the query
        const request = pool.request();
        request.input('meno', sql.NVarChar, name);  // Bind parameter

        // Execute query
        const result = await request.query(sqlQuery);
        
        if (result.recordset.length === 0) {
            // Používateľ neexistuje
            return res.status(401).json({ message: 'Nesprávne používateľské meno alebo heslo.' });
        }

        const user = result.recordset[0];

        // Porovnáme heslá
        if (user.heslo === password) {  // Check against 'heslo'
            // Heslo je správne
            res.json({
                message: 'Prihlásenie úspešné',
                user: { id: user.id, meno: user.meno }
            });
        } else {
            // Nesprávne heslo
            res.status(401).json({ message: 'Nesprávne používateľské meno alebo heslo.' });
        }
    } catch (error) {
        console.error('Chyba servera pri spracovaní požiadavky:', error);
        res.status(500).json({ message: 'Chyba servera', error: error });
    }
});

// Spustenie servera
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server beží na http://localhost:${PORT}`);
});
