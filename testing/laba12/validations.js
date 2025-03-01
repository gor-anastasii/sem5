import { body } from "express-validator";

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
]

export const reqisterValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Имя должно содержать минимум 3 символа').isLength({min: 3}),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
]

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите тест статьи').isLength({min: 3}).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]