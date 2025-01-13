const express = require('express');
const sql = require('mssql');  // Import mssql client
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Načítanie environment premenných
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // CORS policy

app.use(express.static(path.join(__dirname, 'src')));

app.use((req, res, next) => {
    if (!pool) {
        return res.status(500).json({ message: 'Databázové pripojenie nie je dostupné' });
    }
    next();
});

// Konifg databazy
const dbConfig = {
    user: process.env.DB_USER || 'Admin1',
    password: process.env.DB_PASSWORD || 'PMprojekt1',
    server: process.env.DB_HOST || 'pm-server-database.database.windows.net',  // Azure SQL Server host
    database: process.env.DB_NAME || 'PM_database',
    options: {
        encrypt: true, // encryption
        trustServerCertificate: true // potrebne pre ssl 
    }
};

// defin pool variablu
let pool;

// pripojenie na sql server
sql.connect(dbConfig).then(p => {
    pool = p;  // pridanie k pripojenému poolu
    if (pool.connected) {
        console.log('Pripojený k SQL databáze (Azure)');
    }
}).catch(err => {
    console.error('Nepodarilo sa pripojiť k databáze:', err);
    process.exit(1); // Koniec ak nepripojilo
});

//* -------------------------------------PRIHLASENIE POUZIVATELA ----------------------------------- */
// Route pre login
app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        console.log('Chýba používateľské meno alebo heslo');
        return res.status(400).json({ message: 'Prosím zadajte používateľské meno a heslo.' });
    }

    try {
        console.log(`Pokúšam sa prihlásiť používateľa: ${name}`);
        const sqlQuery = `SELECT * FROM clenovia_bytovky WHERE meno = @meno AND heslo = @heslo`;
        const request = pool.request();
        request.input('meno', sql.NVarChar, name);
        request.input('heslo', sql.NVarChar, password);

        const result = await request.query(sqlQuery);
        
        if (result.recordset.length === 0) {
            console.log('Nesprávne používateľské meno alebo heslo');
            return res.status(401).json({ message: 'Nesprávne používateľské meno alebo heslo.' });
        }

        const user = result.recordset[0];
        
        // Generovanie JWT tokenu
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log('Prihlásenie úspešné');
        res.json({
            message: 'Prihlásenie úspešné',
            user: { 
                id: user.id,
                meno: user.meno,
                priezvisko: user.priezvisko,
                cislo_bytu: user.cislo_bytu,
                email: user.email                   //SETTINGS
            },
            token
        });
    } catch (error) {
        console.error('Chyba servera pri spracovaní požiadavky:', error);
        res.status(500).json({ message: 'Chyba servera', error: error });
    }
});

// Middleware na overenie tokenu
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        console.log('Neplatný token');
        return res.status(403).json({ message: 'Prístup zakázaný' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Neplatný token');
            return res.status(403).json({ message: 'Neplatný token' });
        }
        req.user = user;
        next();
    });
}

//* -------------------------------------UPRATOVANIE V BYTOVKE----------------------------------- */
// Funkcia pre získanie údajov z databázy
async function getClenoviaData() {
    try {
        if (!pool) {
            throw new Error("Databázové pripojenie nie je dostupné");
        }
        const request = pool.request();
        const result = await request.query(`
            SELECT id_clena, meno, priezvisko
            FROM dbo.clenovia_bytovky
            WHERE id_clena BETWEEN 2 AND 31
            ORDER BY id_clena;
        `);
        return result.recordset;
    } catch (err) {
        console.error('Chyba pri načítaní údajov z databázy:', err);
        return []; // Vráti prázdne pole v prípade chyby
    }
}

// Route na získanie údajov o členoch
app.get('/api/clenovia', authenticateToken, async (req, res) => {
    try {
        console.log('Získavam údaje o členoch');
        const clenovia = await getClenoviaData();
        res.json(clenovia);
    } catch (error) {
        console.error('Chyba pri načítaní údajov:', error);
        res.status(500).json({ message: 'Chyba pri načítaní údajov', error });
    }
});

//* ------------------------------------- PROBLEMS ----------------------------------- */
// Route na tasky
app.get('/api/problems', async (req, res) => {
    try {
        console.log('Načítavam problémy');
        const result = await pool.request().query('SELECT * FROM udrzba WHERE je_spravene = 0');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({ message: 'Error fetching problems', error });
    }
});

// Route na pridanie tasku
app.post('/api/problems', async (req, res) => {
    const { problem } = req.body;
    if (!problem) {
        console.log('Chýba opis problému');
        return res.status(400).json({ message: 'Je potrebne zadať opis problému' });
    }

    try {
        console.log('Pridávam nový problém');
        const result = await pool.request()
            .input('problem', sql.Text, problem)
            .input('je_spravene', sql.Bit, false)  // Nastavíme hodnotu pre 'je_spravene'
            .query('INSERT INTO udrzba (problem, je_spravene) OUTPUT INSERTED.* VALUES (@problem, @je_spravene)');
        res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Error adding task', error });
    }
});

// Cesta na zmenu je_spravene z 0 na 1
app.put('/api/problems/:id', async (req, res) => {
    const { id } = req.params;

    try {
        console.log(`Aktualizujem problém s ID: ${id}`);
        const request = pool.request();
        request.input('id', sql.Int, id);

        const result = await request.query('UPDATE udrzba SET je_spravene = 1 WHERE id = @id');

        if (result.rowsAffected[0] > 0) {
            console.log('Problém vyriešený');
            res.json({ message: 'Problem je vyriešený.' });
        } else {
            console.log('Problém nebol nájdený');
            res.status(404).json({ message: 'Problem nebol nájdený.' });
        }
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ message: 'Error updating task status', error });
    }
});



//* ------------------------------------- Uprava settings ----------------------------------- */
// Route na pridanie nového používateľa
app.post('/api/user/add', async (req, res) => {
    const { name, lastName, email, apartmentNumber, password } = req.body;

    if (!name || !lastName || !email || !apartmentNumber || !password) {
        console.log('Všetky polia sú povinné');
        return res.status(400).json({ message: 'Všetky polia sú povinné!' });
    }

    try {
        console.log(`Kontrola existencie e-mailu: ${email}`);
        // Kontrola, či už používateľ s týmto e-mailom existuje
        const checkEmailQuery = `
            SELECT * FROM clenovia_bytovky WHERE email = @email
        `;
        const request = pool.request();
        request.input('email', sql.NVarChar, email);
        const result = await request.query(checkEmailQuery);

        if (result.recordset.length > 0) {
            console.log('Používateľ s týmto e-mailom už existuje');
            return res.status(400).json({ message: 'Používateľ s týmto e-mailom už existuje.' });
        }

        console.log('Vytvaranie noveho pouzivatela:', name, lastName, email, apartmentNumber, password);

        // Vloženie nového používateľa do databázy
        const insertUserQuery = `
            INSERT INTO clenovia_bytovky (meno, priezvisko, email, cislo_bytu, heslo)
            VALUES (@name, @lastName, @email, @apartmentNumber, @password)
        `;
        await request.input('name', sql.NVarChar, name)
            .input('lastName', sql.NVarChar, lastName)
            .input('email', sql.NVarChar, email)
            .input('apartmentNumber', sql.NVarChar, apartmentNumber)
            .input('password', sql.NVarChar, password)  // Heslo sa nešifruje
            .query(insertUserQuery);

        console.log('Používateľ bol úspešne pridaný');
        res.json({ message: `Používateľ ${name} ${lastName} bol úspešne pridaný!` });
    } catch (error) {
        console.error('Chyba pri pridávaní nového používateľa:', error);
        res.status(500).json({ message: 'Chyba pri pridávaní nového používateľa.', error });
    }
});
