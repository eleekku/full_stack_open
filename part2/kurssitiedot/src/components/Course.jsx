const Part = (props) => {
	return (
	  <div>
	  <p> {props.part.name} {props.part.exercises}</p>
	  </div>
	)
  }
  
  const Total = (props) => {
	return (
	  <div>
		<p>Number of exercises {props.course.parts.reduce((sum, part) => sum + part.exercises, 0)} </p>
	  </div>
	)
  }
  
  const Content = (props) => {
	return (
	  <div>
		{props.course.parts.map(part => <Part key={part.id} part={part} />)}
	  </div>
	)
  }
  
  const Header = (props) => {
	return (
	  <div>
	  <h1>{props.course.name}</h1>
	  </div>
	)
  }
  
const Course = (props) => {
	return (
		<div>
			<Header course={props.course}/>
			<Content course={props.course} />      
			<Total course={props.course}/>
	  	</div>
	)
}

export default Course
  