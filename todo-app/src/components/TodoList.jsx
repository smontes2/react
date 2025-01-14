import { TodoCard } from "./TodoCard";

export function TodoList(props) {
  const { todos, selectedTab, deleteTodo, editTodo} = props;
  
  const filteredTodos = todos.map((todo, index) => ({...todo, originalIndex: index}));

  const displayTodos =
    selectedTab === "All"
      ? filteredTodos
      : selectedTab === "Open"
      ? filteredTodos.filter((todo) => !todo.complete)
      : filteredTodos.filter((todo) => todo.complete);

  return (
    <>
      {displayTodos.map((todo) => {
        return <TodoCard 
          key={todo.originalIndex} 
          todoIndex={todo.originalIndex} 
          todo={todo} 
          deleteTodo={deleteTodo} 
          editTodo={editTodo}
        />;
      })}
    </>
  );
}
