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
