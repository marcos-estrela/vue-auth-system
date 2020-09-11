import { email, required, minLength } from "vuelidate/lib/validators";

const data = {
    "_meta": {
        "color": "#8B0000",
        "apiURL": "http://localhost:3000/api",
        "catchMessage": "Ocorreu um problema na requisição. Tente novamente mais tarde."
    },
    "login": {
        "data": {
            "apiPath": "/login.js",
            "texts": {
                "title": "Acessar",
                "button": "Acessar"
            },
            "inputs": [
                {
                    "id": "email",
                    "type": "email",
                    "placeholder": "E-mail"
                },
                {
                    "id": "password",
                    "type": "password",
                    "placeholder": "Senha"
                }
            ],
            "links": [
                {
                    "id": "forgotPassword",
                    "text": "Esqueceu sua senha? Recupere-a",
                    "url": "/forgot-password"
                },
                {
                    "id": "newCustomer",
                    "text": "Novo por aqui? Crie uma conta",
                    "url": "/register"
                }
            ],
            validations: {
                email: {
                    required,
                    email
                },
                password: {
                    required,
                    minLength: minLength(8),
                },
            },
            errorMessages: {
                email: {
                    required: "E-mail é obrigatório",
                    email: "Deve ser um e-mail válido",
                },
                password: {
                    required: "Senha é obrigatório",
                    minLength: "A senha deve ter ao menos 8 caracteres",
                },
            },
        }
    },
    "register": {
        "data": {
            "apiPath": "/register.js",
            "texts": {
                "title": "Criar nova conta",
                "button": "Criar conta"
            },
            "inputs": [
                {
                    "id": "email",
                    "type": "email",
                    "placeholder": "E-mail"
                },
                {
                    "id": "password",
                    "type": "password",
                    "placeholder": "Senha"
                }
            ],
            "links": [
                {
                    "id": "alreadyCustomer",
                    "text": "Já tem uma conta? Acesse",
                    "url": "/login"
                }
            ],
            validations: {
                email: {
                    required,
                    email
                },
                password: {
                    required,
                    minLength: minLength(8),
                },
            },
            errorMessages: {
                email: {
                    required: "E-mail é obrigatório",
                    email: "Deve ser um e-mail válido",
                },
                password: {
                    required: "Senha é obrigatório",
                    minLength: "A senha deve ter ao menos 8 caracteres",
                },
            },
        }
    },
    "forgotPassword": {
        "data": {
            "apiPath": "/forgot-password.js",
            "texts": {
                "title": "Recuperar senha",
                "description": "Te enviaremos um e-mail contendo um link para inserir uma nova senha.",
                "button": "Enviar e-mail"
            },
            "inputs": [
                {
                    "id": "email",
                    "type": "email",
                    "placeholder": "E-mail"
                }
            ],
            validations: {
                email: {
                    required,
                    email
                },
            },
            errorMessages: {
                email: {
                    required: "E-mail é obrigatório",
                    email: "Deve ser um e-mail válido",
                },
            },
        }
    },
    "changePassword": {
        "data": {
            "apiPath": "/change-password.js",
            "texts": {
                "title": "Alterar senha",
                "button": "Alterar"
            },
            "inputs": [
                {
                    "id": "newPassword",
                    "type": "password",
                    "placeholder": "Senha"
                },
                {
                    "id": "newPasswordAgain",
                    "type": "password",
                    "placeholder": "Senha novamente"
                }
            ],
            validations: {
                newPassword: {
                    required,
                    minLength: minLength(8),
                },
                newPasswordAgain: {
                    required,
                    minLength: minLength(8),
                },
            },
            errorMessages: {
                newPassword: {
                    required: "Senha é obrigatório",
                    minLength: "A senha deve ter ao menos 8 caracteres",
                },
                newPasswordAgain: {
                    required: "Senha é obrigatório",
                    minLength: "A senha deve ter ao menos 8 caracteres",
                },
            },
        }
    },
    "validate": {
        "data": {
            "apiPath": "/validate.js",
            "texts": {
                "title": "Validação de e-mail",
                "description": "Obrigado por validar o seu e-mail. Aguarde que no momento requisitado estaremos enviando a sua carta. =)"
            },
            "links": [
                {
                    "text": "Retornar para a página inicial",
                    "url": "#"
                }
            ]
        }
    }
}

export default { data };