// Note to self, consider rewriting using arrow functions
export function Header(props) {
  const { todos } = props;
  const todosLength = todos.length;

  const isTaskPlurual = todos.length != 1;

  return (
    <header>
      <h1 className="text-gradient">
        You have {todosLength} open {isTaskPlurual ? "tasks" : "task"}
      </h1>
    </header>
  );
}

// Arrow function version
// export const Header = ({ todos }) => {
//   return (
//     <header>
//       <h1 className="text-gradient"> You have {todos.length} open tasks</h1>
//     </header>
//   )
// }
