const Persons = ({ person, removePerson }) => {
	return (
	  <li>{person.name} {person.number}
	  <button onClick={() => removePerson(person.id)}>delete</button></li>
	)
}

export default Persons