import React from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends React.Component {
  state = {
    tasks: [],
  };
  ID_History = {
    list: [],
  };

  componentDidMount () {
    Promise.all([
      fetch(`/api/v1/task/random`).then((res) => res.json()).then((json) => {this.setState({tasks: [...this.state.tasks, {task: json.message, done: false, onCloud: false}]});}),
      fetch(`/api/v1/task/random`).then((res) => res.json()).then((json) => {this.setState({tasks: [...this.state.tasks, {task: json.message, done: false, onCloud: false}]});}),
      fetch(`/api/v1/task/random`).then((res) => res.json()).then((json) => {this.setState({tasks: [...this.state.tasks, {task: json.message, done: false, onCloud: false}]});}),
      ])
  }

  handleSubmit = task => {
    this.setState({tasks: [...this.state.tasks, {task: task, done: false, onCloud: false}]});
  }

  handleRandom = async() => {
    await fetch(`/api/v1/task/random`)
    .then((res) => res.json())
    .then((json) => {this.setState({tasks: [...this.state.tasks, {task: json.message, done: false, onCloud: false}]});})
  }
  
  handleSave = async() => {
    await fetch('/api/v1/task/list', {
      method: "POST",  
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then((response) => response.json()).then (data => {
      toast.success(data);
      this.ID_History.list.push({id: data})
      const newList = this.state.tasks.map(todo => {
        // if this task has the same ID as the edited task
        if (todo.onCloud === false) {
           //
           return {
              _id: data,
              task: todo.task,
              done: todo.done,
              onCloud: true,
           }
        }
        return todo;
     })
     this.setState({tasks: newList});
    })
    .catch(function (error) {
      console.log(error);
      toast.error(error);
    })}
  
  handleLoad = async(index) => {
    await fetch("/api/v1/task/list/" + index, {
      method: "GET"
    })
      .then((response) => response.json()).then (data => {
        toast.success("Loading completed");
        const newList = data.tasks.map(todo => {
            return {
            _id: index,
            task: todo.task,
            done: todo.done,
            onCloud: true,
            }     
       })
       this.setState({tasks: newList});
      })
      .catch(function (error) {
        toast.error(error);
        console.log(error);
      });
  }

  handleUpdate = async(index) => {
    let newTasks = this.state.tasks.map(todo => {
      if (todo._id === index ){
        return{
          task: todo.task,
          done: todo.done,
        }
      }
    })
    await fetch("/api/v1/task/list/" + index, {
      method: "PUT",  
      headers: {
        'Access-Control-Allow-Origin' : '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"tasks": newTasks})
    })
    .then((response) => response.json()).then (data => {
      // alert(data);
      toast.success("Update completed");
      const newList = this.state.tasks.map(todo => {
        // if this task has the same ID as the edited task
        if (todo.onCloud === false && todo._id === index) {
           //
           return {
              onCloud: true,
           }
        }
        return todo;
     })
    })
      .catch(function (error) {
        toast.error(error);
        console.log(error);
      });
  }


  handleDelete = (index) => {
    const newArr = [...this.state.tasks];
    newArr.splice(index, 1);
    this.setState({tasks: newArr});
  }

  handleToggle = (index) => {
    const newArr = [...this.state.tasks];
    newArr[index]['done'] = !newArr[index]['done'];
    newArr[index]['onCloud'] = false;
    this.setState({tasks: newArr});
  }

  render() {
    return(
      <div className='wrapper h-screen w-screen flex items-center justify-center bg-green-200 font-sans'>
        <ToastContainer />
        <div className='flex w-3/5'>
          <div className='card frame bg-white rounded shadow p-6 m-4 max-h-full w-full '>
            <Header numTodos={this.state.tasks.length} addRandom={this.handleRandom}  onSave={this.handleSave}/>
            <SubmitForm onFormSubmit={this.handleSubmit} />
            <TodoList tasks={this.state.tasks} done={this.handleToggle} onDelete={this.handleDelete} />
            <div className='flex w-full'>
              <UpdateForm onUpdate={this.handleUpdate}/>
              <LoadForm onLoad={this.handleLoad}/>
            </div>
          </div>
          <div className='card frame bg-white rounded shadow p-6 m-4 max-h-max w-1/3'>
            <History historyList={this.ID_History.list}/>
          </div>
        </div>
      </div>
    );
  } 
}


class SubmitForm extends React.Component {
  state = { term: '' };

  handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.term === '') return;
    this.props.onFormSubmit(this.state.term);
    this.setState({ term: '' });
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit} className='flex mt-4'>
        <input 
          type='text'
          className='input'
          placeholder='Enter Item'
          value={this.state.term}
          onChange={(e) => this.setState({term: e.target.value})}
          className="transition-all shadow appearance-none border rounded w-full py-2 px-3 mr-2 mb-4 text-grey-darker"
        />
        <button className='transition-all flex-no-shrink p-2 border-2 rounded text-purple-500 mb-4 border-purple-500 hover:text-white hover:bg-purple-500'>Submit</button>
      </form>
    );
  }
}


const Header = (props) => {
  return(
    <div>
      <div className='todo flex mb-4 items-center'>
        <h1 className="antialiased w-full text-grey-darkest font-semibold text-xl">Todo List</h1>
          <button className={"transition-all antialiased flex-no-shrink p-1.5 mr-2 font-semibold border-0 rounded hover:text-white text-purple-500 hover:bg-purple-500"} onClick={() => {props.addRandom()}}>Random</button>
          <button className={"transition-all antialiased flex-no-shrink p-1.5 font-semibold border-0 rounded hover:text-white text-purple-500 hover:bg-purple-500"} onClick={() => {props.onSave()}}>Save</button>
        </div>
      <div className='card-header'>
        <h1 className='card-header-title header'>
          You have {props.numTodos} Todos
        </h1>
      </div>
    </div>
  )
}

const History = (props) => {
    const history = props.historyList.map(data => {
      return <p className='transition-all text-grey-800 antialiased w-full text-base font-normal'> {"- "+data.id} </p>
    })
    return(
      <div>
        <h1 className="antialiased w-full text-grey-darkest font-semibold text-xl">History</h1>
        {history}
      </div>
    );
}

class UpdateForm extends React.Component {
  state = { term: '' };

  handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.term === '') return;
    this.props.onUpdate(this.state.term);
    this.setState({ term: '' });
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit} className='flex w-full mt-4'>
        <input 
          type='text'
          className='input'
          placeholder='Enter Item'
          value={this.state.term}
          onChange={(e) => this.setState({term: e.target.value})}
          className="transition-all shadow w-full appearance-none border rounded w-full py-2 px-3 mr-2 mb-4 text-grey-darker"
        />
        <button className='transition-all flex-no-shrink p-2 border-2 rounded text-purple-500 mb-4 border-purple-500 hover:text-white hover:bg-purple-500'>Update</button>
      </form>
    );
  }
}

class LoadForm extends React.Component {
  state = { term: '' };

  handleSubmit = (e) => {
    e.preventDefault();
    if(this.state.term === '') return;
    this.props.onLoad(this.state.term);
    this.setState({ term: '' });
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit} className='flex w-full mt-4'>
        <input 
          type='text'
          className='input'
          placeholder='Enter Item'
          value={this.state.term}
          onChange={(e) => this.setState({term: e.target.value})}
          className="transition-all shadow  ml-8 appearance-none border rounded w-full py-2 px-3 mr-2 mb-4 text-grey-darker"
        />
        <button className='transition-all flex-no-shrink p-2 border-2 rounded text-purple-500 mb-4 border-purple-500 hover:text-white hover:bg-purple-500'>Load</button>
      </form>
    );
  }
}


const TodoList = (props) => {
  const todos = props.tasks.map((todo, index) => {
    return <Todo content={todo.task} todo={todo} id={index} _id={todo._id} key={index} done={props.done} onDelete={props.onDelete} />
  })
  return( 
    <div className='list-wrapper'>
      {todos}
    </div>
  );
}

const Todo = (props) => {
  return(
    <div className="todo flex mb-4 items-center">
      <p className={props.todo.done? "transition-all line-through text-green-400 antialiased w-full text-base font-normal":"transition-all text-grey-800 antialiased w-full text-base font-normal"}>{props.content}</p>
      <p className={props.todo.onCloud? "transition-all antialiased flex-no-shrink pl-2 pt-1 pb-1 pr-2 border-0 rounded-full text-xs	bg-green-400 text-white":"transition-all antialiased flex-no-shrink text-xs pl-2 pt-1 pb-1 pr-2 border-0 rounded-full bg-gray-300 text-white"}>{props.todo.onCloud? "Saved":"Unsave"}</p>
      <button className={props.todo.done? "transition-all	flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-gray-300 border-gray-300 hover:bg-gray-300":"transition-all	flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green-400 border-green-400 hover:bg-green-400"}  onClick={() => {props.done(props.id)}}>{props.todo.done? "Undo":"Done"}</button>
      <button className="transition-all flex-no-shrink p-2 ml-2 border-2 rounded text-red-400 border-red-400 hover:text-white hover:bg-red-400" onClick={() => {props.onDelete(props.id)}}>Remove</button>
    </div>
  );
}

export default App;
