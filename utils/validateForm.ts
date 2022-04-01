import { SetStateAction } from "react"

export const validateForm = (
  lastName: string,
  name: string,
  commonName: string,
  birthDate: string
) => {
  let lastNameMessage = ''
  let nameMessage = ''
  let commonNameMessage = ''
  let birthDateMessage = ''

  !lastName.length && (lastNameMessage = 'Поле является обязательным')
  lastName.length > 100 && (lastNameMessage = 'Максимальная допустимая длина - 100 символов')

  !name.length && (nameMessage = 'Поле является обязательным')
  name.length > 100 && (nameMessage = 'Максимальная допустимая длина - 100 символов')
  
  commonName.length > 100 && (commonNameMessage = 'Максимальная допустимая длина - 100 символов')

  const date = new Date().toISOString().slice(0, 10)
  !birthDate.length && (birthDateMessage = 'Поле является обязательным')
  date < birthDate && (birthDateMessage = 'Дата рождения должна быть меньше текущей')
  
  return ({
    lastName: lastNameMessage,
    name: nameMessage,
    commonName: commonNameMessage,
    birthDate: birthDateMessage
  })
}