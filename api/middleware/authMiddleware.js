function verificarAutenticacao(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'Token de autenticação inválido' });
        }
        req.usuarioId = decodedToken.usuarioId; 
        next(); 
    });
}

module.exports = verificarAutenticacao();