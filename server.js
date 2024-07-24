const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const pool = require('./db');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/api/cadastrar-usuario', async (req, res) => {
    const { nome_completo, cpf, cnh, tipo_veiculo, placa, empresa, email, senha } = req.body;
    const hashedPassword = await bcrypt.hash(senha, 10);
    try {
        const result = await pool.query(
            `INSERT INTO motoristas_escolares (nome_completo, cpf, cnh, tipo_veiculo, placa, empresa, email, senha)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [nome_completo, cpf, cnh, tipo_veiculo, placa, empresa, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const result = await pool.query('SELECT * FROM motoristas_escolares WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const isValid = await bcrypt.compare(senha, user.senha);
            if (isValid) {
                res.status(200).json({ message: 'Login bem-sucedido!', userName: user.nome_completo });
            } else {
                res.status(401).json({ message: 'Senha incorreta!' });
            }
        } else {
            res.status(404).json({ message: 'Usuário não encontrado!' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
