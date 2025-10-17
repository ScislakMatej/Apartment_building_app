const express = require('express');
const sql = require('mssql'); 
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const xlsx = require("xlsx");
const fs = require("fs");


// Načítanie environment premenných
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // CORS policy

app.use(express.static(path.join(__dirname, 'src')));

// Middleware pre kontrolu databázového pripojenia
app.use((req, res, next) => {
    // Ak pripojenie zlyhalo a 'pool' nie je definovaný, vráti chybu 500
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
    pool = p;  // pridanie k pirpojenemu poolu
    if (pool.connected) {
        console.log('Pripojený k SQL databáze (Azure)');
    }
}).catch(err => {
    console.error('Nepodarilo sa pripojiť k databáze:', err);
    // *** ZMENA: SERVER SA NEUKONČÍ, POOL ZOSTANE NEDOSTUPNÝ (null) ***
    // process.exit(1); 
});

//* -------------------------------------PRIHLASENIE POUZIVATELA ----------------------------------- */
// Route pre login
app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ message: 'Prosím zadajte používateľské meno a heslo.' });
    }

    try {
        const sqlQuery = `SELECT * FROM clenovia_bytovky WHERE meno = @meno AND heslo = @heslo`;
        const request = pool.request();
        request.input('meno', sql.NVarChar, name);
        request.input('heslo', sql.NVarChar, password);

        const result = await request.query(sqlQuery);
        
        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Nesprávne používateľské meno alebo heslo.' });
        }

        const user = result.recordset[0];

        res.json({
            message: 'Prihlásenie úspešné',
            user: { 
                id: user.id,
                meno: user.meno,
                priezvisko: user.priezvisko,
                cislo_bytu: user.cislo_bytu 
            }
        });
    } catch (error) {
        console.error('Chyba servera pri spracovaní požiadavky:', error);
        res.status(500).json({ message: 'Chyba servera', error: error });
    }
});


// Spustenie servera
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server beží na http://localhost:${PORT}`);
});

/* -------------------------------------VYKRESLENIE EXCEL SUBORU----------------------------------- 

const { BlobServiceClient } = require("@azure/storage-blob");
const connectionString = 'DefaultEndpointsProtocol=https;AccountName=pmprojectstorage;AccountKey=H/KdyRAkk+euJZTLJY7/1mgV...'; // Skrátený connection string

// Funkcia na stiahnutie súboru z Azure Storage
async function downloadExcelFile() {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient("expenses-graph"); // Zmeňte na názov vášho kontajnera
    const blobClient = containerClient.getBlobClient("graf.xlsx"); // Zmeňte na názov vášho Excel súboru

    // Stiahnutie obsahu súboru ako Buffer
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);
    return downloaded;
}

// Pomocná funkcia na prevod streamu na Buffer
async function streamToBuffer(readableStream) {
    const chunks = [];
    for await (const chunk of readableStream) {
        chunks.push(chunk instanceof Buffer ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

// Funkcia na čítanie dát z Excelu a ich prevod na JSON
function parseExcel(buffer) {
    const workbook = xlsx.read(buffer, { type: "buffer" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Vyberte prvý list
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    return jsonData;
}

// API endpoint na získanie dát z Excel súboru
app.get('/api/excel-data', async (req, res) => {
    try {
        const excelBuffer = await downloadExcelFile();
        const jsonData = parseExcel(excelBuffer);
        res.json(jsonData); // Odošlite dáta do frontendu vo formáte JSON
    } catch (error) {
        console.error('Chyba pri načítaní Excel súboru:', error);
        res.status(500).json({ message: 'Chyba pri načítaní Excel súboru', error });
    }
});
*/

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
app.get('/api/clenovia', async (req, res) => {
    try {
        const clenovia = await getClenoviaData();
        //console.log('Returned data:', clenovia); // Loguj dáta, ktoré sú vracané
        res.json(clenovia);
    } catch (error) {
        console.error('Chyba pri načítaní údajov:', error);
        res.status(500).json({ message: 'Chyba pri načítaní údajov', error });
    }
});

//* ------------------------------------- Tasky ----------------------------------- */
// Route na tasky
// Route aby vytiahlo problemy ktore nie su spravene(je_spravene = 0)
app.get('/api/problems', async (req, res) => {
    try {
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
    if (!problem) return res.status(400).json({ message: 'Je potrebne zadať opis problému' });

    try {
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
        const request = pool.request();
        request.input('id', sql.Int, id);

        // Update je_spravene na 1
        const result = await request.query('UPDATE udrzba SET je_spravene = 1 WHERE id = @id');

        if (result.rowsAffected[0] > 0) {
            res.json({ message: 'Problem je vyriešený.' });
        } else {
            res.status(404).json({ message: 'Problem nebol nájdený.' });
        }
    } catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ message: 'Error updating task status', error });
    }
});

//* ------------------------------------- SETTING - uprava pouzivatela ----------------------------------- */


// Route pre aktualizáciu používateľských údajov (email, heslo)
app.put('/api/update-user', async (req, res) => {
    const { userId, oldPassword, currentEmail, newEmail, newPassword, confirmPassword } = req.body;

    // Overenie, že všetky požiadavky sú prítomné
    if (!userId || (!newEmail && !newPassword) || (newPassword && newPassword !== confirmPassword)) {
        return res.status(400).json({ message: 'Prosím zadajte platné údaje (email, heslo).' });
    }

    try {
        // Najprv overíme, že staré heslo je správne
        const request = pool.request();
        request.input('userId', sql.Int, userId);
        request.input('oldPassword', sql.NVarChar, oldPassword);

        const result = await request.query(`
            SELECT * FROM clenovia_bytovky WHERE id_clena = @userId AND heslo = @oldPassword
        `);

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Nesprávne staré heslo.' });
        }

        // Ak je heslo správne, overíme aktuálny email
        if (currentEmail) {
            const emailCheckQuery = 'SELECT * FROM clenovia_bytovky WHERE id_clena = @userId AND email = @currentEmail';
            request.input('currentEmail', sql.NVarChar, currentEmail);

            const emailCheckResult = await request.query(emailCheckQuery);

            if (emailCheckResult.recordset.length === 0) {
                return res.status(401).json({ message: 'Zadaný e-mail neexistuje v databáze.' });
            } else {
                console.log('Aktuálny email overený:', currentEmail);
            }
        }

        // Ak je heslo správne, aktualizujeme e-mail alebo heslo
        let updateQuery = 'UPDATE clenovia_bytovky SET ';
        const updateValues = [];
        
        if (newEmail) {
            updateQuery += 'email = @newEmail ';
            updateValues.push({ name: 'newEmail', type: sql.NVarChar, value: newEmail });
        }
        
        if (newPassword) {
            if (updateValues.length > 0) {
                updateQuery += ', ';
            }
            updateQuery += 'heslo = @newPassword ';
            updateValues.push({ name: 'newPassword', type: sql.NVarChar, value: newPassword });
        }
        
        updateQuery += 'WHERE id_clena = @userId';

        const updateRequest = pool.request();
        updateValues.forEach((param) => {
            updateRequest.input(param.name, param.type, param.value);
        });

        const updateResult = await updateRequest.query(updateQuery);

        if (updateResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Používateľ nebol nájdený.' });
        }

        res.json({ message: 'Údaje boli úspešne aktualizované.' });

    } catch (error) {
        console.error('Chyba pri aktualizácii používateľských údajov:', error);
        res.status(500).json({ message: 'Chyba pri aktualizácii údajov', error });
    }
});