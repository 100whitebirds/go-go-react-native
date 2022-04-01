import { useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { Appbar, TextInput, RadioButton, Checkbox, Button } from 'react-native-paper'
import DropDownPicker from 'react-native-dropdown-picker'
import DatePicker from 'react-native-datepicker'
import { validateForm } from './utils/validateForm'
import axios from 'axios'

type Group = {
  label: string
  value: string
}

const groups = [
  { label: 'Не выбрано', value: 'none' },
  { label: 'VIP', value: 'vip' },
  { label: 'Проблемные', value: 'problem' },
  { label: 'ОМС', value: 'chi' }
]

type ErrorType = {
  lastName: any
  name: any
  commonName: any
  birthDate: any
}

const initialError = {
  lastName: '',
  name: '',
  commonName: '',
  birthDate: ''
}

const apiUrl = 'https://622f121d-5f5c-452f-afa7-7787dd15f8c8.mock.pstmn.io/client'


const App = () => {
  const [lastName, setLastName] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [commonName, setCommonName] = useState<string>('')
  const [gender, setGender] = useState<'male' | 'female' | 'none'>('male')
  const [disableSms, setDisableSms] = useState<boolean>(false)
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false)
  const [clientsGroups, setClientsGroup] = useState<Group[]>(groups)
  const [selectedGroup, setSelectedGroup] = useState<Group>(clientsGroups[0])
  const [birthDate, setBirthDate] = useState<string>('')
  
  const [error, setError] = useState<ErrorType>(initialError)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [modalMessage, setModalMessage] = useState<string>('')

  const resetForm = () => {
    setLastName('')
    setName('')
    setCommonName('')
    setGender('none')
    setSelectedGroup(clientsGroups[0])
    setBirthDate('')
    setDisableSms(false)
  }

  const submit = async () => {
    const err = validateForm(lastName, name, commonName, birthDate)
    if (err.lastName || err.name || err.commonName || err.birthDate) {
      setError(err)
    } else {
      const payload = {
        lastName,
        name,
        commonName,
        birthDate,
        gender,
        clientsGroup: selectedGroup,
        disableSms
      }
      await axios.post(apiUrl, payload).then(() => {
        setModalMessage('Успешная регистрация!') 
        setModalVisible(true)
        resetForm()
      }).catch(() => {
        setModalMessage('Произошла ошибка при регистрации')   
      })
    }
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: '#a99adb' }}>
      <View style={{ flex: 0.4 }}>
        <Appbar.Header>
          <Appbar.Content title='Регистрация' titleStyle={{ textAlign: 'center' }} />
        </Appbar.Header>

        <TextInput
          style={{marginVertical:1, backgroundColor: '#a99adb'}}
          label={error.lastName || 'Фамилия' }
          error={error.lastName}
          autoFocus={true}
          autoComplete={false}
          value={lastName}
          onChangeText={text => setLastName(text)}
        />

        <TextInput
          style={{marginVertical:1, backgroundColor: '#a99adb'}}
          label={error.name || 'Имя'}
          error={error.name}
          autoComplete={false}
          value={name}
          onChangeText={text => setName(text)}
        />

        <TextInput
          style={{marginVertical:1, backgroundColor: '#a99adb'}}
          label={error.commonName || 'Отчество'}
          error={error.commonName}
          autoComplete={false}
          value={commonName}
          onChangeText={text => setCommonName(text)}
        />
      </View>

      <View style={{ flex: 0.05, flexDirection: 'row', padding: 9, marginTop: 30 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Пол</Text>

        <View style={{ flex: 0.8, flexDirection: 'row', marginLeft: 50 }}>
          <RadioButton
            value={gender}
            status={gender === 'male' ? 'checked' : 'unchecked'}
            onPress={() => gender !== 'male' ? setGender('male') : setGender('none')}
          />
          <Text 
            onPress={() => gender !== 'male' ? setGender('male') : setGender('none')} 
            style={{ fontSize: 20, marginTop: 3 }}
          >
            Мужской
          </Text>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <RadioButton
            value={gender}
            status={gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => gender !== 'female' ? setGender('female') : setGender('none')}
          />
          <Text 
            onPress={() => gender !== 'female' ? setGender('female') : setGender('none')} 
            style={{ fontSize: 20, marginTop: 3 }}
          >
            Женский
          </Text>
        </View>
      </View>

      <View style={{ flex: 0.1, padding: 10, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Группа клиентов</Text>
        <View style={{ marginLeft: 20 }}>
          <DropDownPicker
            style={{ backgroundColor: '#6d5bc7', width: 200, borderWidth: 0 }}
            open={dropDownOpen}
            setOpen={setDropDownOpen}
            items={clientsGroups}
            setItems={setClientsGroup}
            placeholder={selectedGroup.label}
            value={selectedGroup as any}
            setValue={setSelectedGroup as any}  
          />
        </View>
        
      </View>

      <View style={{ flex: 0.1, padding: 10, flexDirection: 'row', alignItems: 'center', zIndex: -1 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Дата рождения</Text>
        <View style={{ marginLeft: 32 }}>
          <Text style={{ fontSize: 16, color: 'red' }}>{error.birthDate}</Text>
          <DatePicker
            style={{width: 200, backgroundColor: '#6d5bc7', borderRadius: 10 }}
            date={birthDate}
            mode="date"
            placeholder="Выберите дату"
            format="YYYY-MM-DD"
            minDate="1900-01-01"
            maxDate="2100-01-01"
            confirmBtnText="Подтвердить"
            cancelBtnText="Отмена"
            onDateChange={(date) => setBirthDate(date)}    
          />
        </View>
      </View>
      
      <View style={{ 
        flex: 0.12, 
        padding: 10, 
        flexDirection: 'row',  
        alignItems: 'center',
        zIndex: -1 
      }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginRight: 80 }}>Не отправлять СМС</Text>
        <View style={{ borderWidth: 2, width: 40, height: 40 }}>
          <Checkbox
              status={disableSms ? 'checked' : 'unchecked'}
              onPress={() => setDisableSms(!disableSms)}
            />
        </View>
      </View>

      <View style={{ marginTop: 30 }}>
        <Button 
          style={{ marginHorizontal: '20%', height: 50, justifyContent: 'center'}} 
          mode='contained' 
          onPress={() => submit()
        }>
          Зарегистрировать
        </Button>
      </View>

      { modalVisible && 
        <Modal>
          <View style={{ 
            height: '100%',
            width: '100%',
            justifyContent: 'center', 
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 30, color: 'rgb(0, 200, 0)' }}>
              { modalMessage }
            </Text>
            <TouchableOpacity>
              <Button 
                style={{ 
                  backgroundColor: 'lightblue',
                  width: 200,
                  height: 50,
                  marginTop: 30,
                  justifyContent: 'center'
                }}
                onPress={() => setModalVisible(false)}
              >
                Ok
              </Button>
            </TouchableOpacity>
          </View>
        </Modal>
      }
    </View>
  )
}

export default App