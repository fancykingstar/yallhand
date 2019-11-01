import React from 'react';
import Layout from '../../layouts/DefaultLayout';
import {Task} from "../components/Task";
import {TaskStore} from "../../../Stores/TaskStore";
import Paper from '@material-ui/core/Paper';
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
                              
                              <Paper style={{padding: 20, borderRadius: 8, margin: 25}} elevation={4}>
                              <Task data={item} index={index}/>
                              </Paper>
                           ) : <EmptyPlaceholder type="task"/> }
               </div>
            </div>
         </Layout>
      );
   }
}

export default TaskList;
