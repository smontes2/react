export function TodoCard(props) {
	const { todo, deleteTodo, todoIndex, editTodo } = props;
	return (
		<div className="card todo-item">
			<p>{todo.input}</p>
			<div className="todo-buttons">
				<button onClick={() => {
					editTodo(todoIndex)
				}} disabled={todo.complete}>Done</button>
				<button onClick={() => {
					deleteTodo(todoIndex)
				}}>Delete</button>
			</div>
		</div>
	)
}