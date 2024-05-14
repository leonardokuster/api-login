class UserController {
    static async index(req, res) {
        return res.status(200).json({ok: 'Bem-vindo usuário. Página em construção..'});
    }
}

module.exports = UserController