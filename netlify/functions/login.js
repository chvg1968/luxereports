const users = JSON.parse(process.env.USERS_JSON);

exports.handler = async (event) => {
    try {
        const { username, password } = JSON.parse(event.body);

        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Usuario o contraseña incorrectos" })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ username: user.username, role: user.role, property: user.property })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error interno del servidor" })
        };
    }
};