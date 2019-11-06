import React from 'react';
import Layout from '../../layouts/DefaultLayout';
import {Task} from "../components/Task";
import {TaskStore} from "../../../Stores/TaskStore";
import { EmptyPlaceholder } from '../components/EmptyPlaceholder';


class TaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           TaskData: [],
         
        }
     }
     componentDidMount() {
        this.setState({
           TaskData: TaskStore.allTasks,
        
        })
     }


   render() {
       const {TaskData} = this.state;
      return (
         <Layout pageTitle={"Tasks"}>
            <div style={{paddingTop: 20}} className="container">
               <div className="page_container">
               {(TaskData.length) ? TaskData.map((item, index) => 
               <Task data={item} index={index} usePaper/> ) : <EmptyPlaceholder type="task"/> }
               </div>
            </div>
         </Layout>
      );
   }
}

export default TaskList;
