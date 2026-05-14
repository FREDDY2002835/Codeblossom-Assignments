/*What is a class 
 A class is a blueprint: an informal term commonly used to describe how
 certain language features define the structure or contract for creating 
 objectifs classes.
 */


//  PRIORITIES 
/*This tells Typescript: @id mkust be a number
@title must be a string 
@descriprion must be a string
@completed  must be a boolean
 */
class Task {
    id: number;
    title: string;                          
    description: string;
    completed: boolean;
    // Here TypeScript protects us from mistakes.


// CONSTRUCTOR
/*
The contructor runs when we create a new Task
eg: const task1 = new Task(1, "Learn", Study);
*/
    constructor(id: number, title: string, description: string) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.completed = false;
    }
    // this means : specific object we are creating
}



class TaskManager {                    /* this function manages many tasks */
    private tasks: Task[] = [];       /* this line has a variable inside the class tasks, an array of task objects and  we initialize it as an empty array */         
    addTask(task: Task): void {       /* this method accepts a parameter, that must be a task , void means this method returns nothing */
        this.tasks.push(task);       /* here i am accessing the private array, adding a task into it */
    }

    listAllTasks(): void {
  if (this.tasks.length === 0) {     /* i check if the array is empty, if yes -> it prints a message and stop using return */
    console.log("No tasks available.");
    return;
  }

  this.tasks.forEach(task => {  /* loops through the array, for every task inside tasks, we print it. */
    console.log(
      `ID: ${task.id} | Title: ${task.title} | Completed: ${task.completed}`  /*interpolate */
    );
  });
}

markTaskComplete(id: number): void {
  const task = this.tasks.find(t => t.id === id);  /* searches inside the array */
                              /* t => t.id === id is an arrow functon, find the task where the task.id equals the id we passed */
  if (!task) {      /* if no task is found  we print a massage and stop the function */
    console.log("Task not found.");
    return;
  }

  task.completed = true;  /* we directly modify the object */
  console.log(`Task with ID ${id} marked as complete.`);
}

getTaskById(id: number): Task | undefined {   /* this is a Union Type , the function may return a task or undefined */
  return this.tasks.find(task => task.id === id);
}
    
}



// Test Code
const manager = new TaskManager();

const task1 = new Task(1, "learn", "Understand");
const task2 = new Task(2, "build", "practice");

manager.addTask(task1);
manager.addTask(task2);

console.log("Before completion")
manager.listAllTasks();

manager.markTaskComplete(1);

console.log("After completion");
manager.listAllTasks();