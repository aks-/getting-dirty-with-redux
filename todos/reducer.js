import React from 'react';
import ReactDOM from 'react-dom';
import Redux, {createStore, combineReducers} from 'redux';

const todo = (state, action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      }
    case 'TOGGLE_TODO':
      if (state.id !== action.id)
        return state;
      return Object.assign({}, state, {
        completed: !state.completed
      });
    default:
      return state
  }
};

const todos = (state = [], action) => {
  switch(action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const visibilityFilter = (
  state = 'SHOW_ALL',
  action
) => {
  switch(action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);

const getVisibleTodos = (
  todos,
  filter
) => {
  switch(filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(
        t => t.completed
      );
    case 'SHOW_ACTIVE':
      return todos.filter(
        t => !t.completed
      );
  }
};

const Todo = ({
  onClick,
  completed,
  text
}) => (
<li 
  onClick={onClick}
  style={{
    textDecoration:
    completed ?
    'line-through':
    'none'
  }}>
  {text}
</li>
);

class VisibleTodoList extends React.Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <TodoList
        todos={
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
        }
        onTodoClick={id =>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id
          })            
        }
      />
    );
  }
}

const TodoList = ({
  todos,
  onTodoClick
}) => (
<ul>
  {todos.map(todo =>
             <Todo
               key={todo.id}
               {...todo}
               onClick={() => onTodoClick(todo.id)}
             />
             )}
           </ul>
);

const AddTodo = () => {
  let input;
  return <div>
      <input ref={node => {
        input = node;
      }}/>
      <button onClick={() => {
        store.dispatch({ 
          type: 'ADD_TODO',
          id: nextId++,
          text: input.value
        }); 
        input.value = '';
      }}>
      Add Todo
    </button>
  </div>;
};

const Link = ({
  active,
  children,
  onClick
}) => {
  if (active)
    return <span>{children}</span>

  return <a href="#"
    onClick={e => {
      e.preventDefault();
      onClick();
    }}>
    {children}
  </a>
};

class FilterLink extends React.Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillMount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <Link 
        active={
          props.filter ===
          state.visibilityFilter
        }
        onClick={() => {
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          });
        }}
      />
    );
  }
}

const Footer =({
  visibilityFilter,
  onFilterClick
}) => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
      >
      All
    </FilterLink>
    {', '}
    <FilterLink
      filter='SHOW_ACTIVE'
      >
      Active
    </FilterLink>
    {', '}
    <FilterLink
      filter='SHOW_COMPLETED'
      >
      Completed
    </FilterLink>
  </p>
);

let nextId = 0;
const TodoApp = ({
  todos,
  visibilityFilter
}) => {
    return <div>
      <AddTodo />
      <VisibleTodoList/>
      <Footer />
    </div>;
}

ReactDOM.render(<TodoApp />,
                document.getElementById('app'));


const testAddTodo = () => {
  const todosBefore = [];
  const todosAfter = [{
    id: 3,
    text: 'hey',
    completed: false
  }];

  const action = {
    type: 'ADD_TODO',
    id: 3,
    text: 'hey'
  };

  deepFreeze(todosBefore);

  expect(
    todos(todosBefore, action)
  ).toEqual(todosAfter);
};

const testToggleTodo = () => {
  const todosBefore = [{
    id: 3,
    text: 'hey',
    completed: false
  },{
    id: 4,
    text: 'Hua',
    completed: false
  }];

  const todosAfter = [{
    id: 3,
    text: 'hey',
    completed: false
  },{
    id: 4,
    text: 'Hua',
    completed: true
  }];

  const action = {
    type: 'TOGGLE_TODO',
    id: 4
  };

  deepFreeze(todosBefore);
  deepFreeze(action);

  expect(
    todos(todosBefore, action)
  ).toEqual(todosAfter);
};

testAddTodo();
testToggleTodo();
console.log('All tests passed!');
