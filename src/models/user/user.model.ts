import { Task } from "models/task/task.model";

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  tasks: Task[];
}