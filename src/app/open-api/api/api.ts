export * from './movements.service';
import { MovementsService } from './movements.service';
export * from './order.service';
import { OrderService } from './order.service';
export * from './queuetasks.service';
import { QueuetasksService } from './queuetasks.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [MovementsService, OrderService, QueuetasksService, UserService];
