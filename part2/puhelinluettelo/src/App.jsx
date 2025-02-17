import { useState } from 'react'

const Persons = ({ person }) => {
  return (
    <li>{person.name}</li>
  )
}

const handleNewName = (event) => {
  setNewName(event.target.value)
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>debug: {newName}</div>
      <ul>
        {persons.map(person => 
          <Persons key={person.name} person={person} />
        )}
      </ul>
    </div>
  )

}

export default App