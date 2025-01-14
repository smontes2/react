// This is a clever component that uses the map function to create a list of buttons instead of writing out each button
export function Tabs(props) {
  const { todos, selectedTab, setSelectedTab} = props;
  const tabs = ["All", "Open", "Completed"];

  return (
    <nav className="tab-container">
      {tabs.map((tab, tabIndex) => {
        const numOfTasks =
          tab === "All"
            ? todos.length
            : tab === "Open"
            ? todos.filter((todo) => !todo.complete).length
            : todos.filter((todo) => todo.complete).length;
        return (
          <button onClick={() => {
			setSelectedTab(tab)
		  }} className={"tab-button " + (tab === selectedTab ? " tab-selected " : " ")} key={tabIndex}>
            <h4>
              {tab} <span>({numOfTasks})</span>
            </h4>
          </button>
        );
      })}
	  <hr />
    </nav>
  );
}
