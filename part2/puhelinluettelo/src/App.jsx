import { useState } from 'react'

const Filter = ({ filter, setFilter }) => {
  return (
    <div>filter shown with <input value={filter} onChange={(event) => setFilter(event.target.value)}/></div>
  )
}

const Persons = ({ person }) => {
  return (
    <li>{person.name} {person.number}</li>
  )
}

const addPerson = (event, persons, setPersons, newName, setNewName, newNumber, setNewNumber) => {
  event.preventDefault()
  const newPerson = { name: newName, number: newNumber }
  if (newPerson.name === '') {
    alert('Name cannot be empty')
    return
  }
  if (persons.map(person => person.name).includes(newPerson.name)) {
    alert(`${newPerson.name} is already added to phonebook`)
    return
  }
  if (newPerson.number === '') {
    alert('Number cannot be empty')
    return
  }
  if (newPerson.number)
  setPersons(persons.concat(newPerson))
  setNewName('')
  setNewNumber('')
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas',
      number: '040-1234567' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleNewNumber = (event, setNewNumber) => {
    setNewNumber(event.target.value)
  }

  const handleNewName = (event, setNewName) => {
    setNewName(event.target.value)
  }

  const handleFilter = (event, setFilter) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <form onSubmit={(event) => addPerson(event, persons, setPersons, newName, setNewName, newNumber, setNewNumber)}>
        <div>
          name: <input value={newName} onChange={(event) => handleNewName(event, setNewName)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={(event) => handleNewNumber(event, setNewNumber)}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => <Persons key={person.name} person={person} />)}
      </ul>
    </div>
  )
}

export default App