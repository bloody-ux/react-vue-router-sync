import { History } from 'history';
import VueRouter from 'vue-router';
export declare type Disposer = () => void;
export interface HistoryOptions {
    basename?: string;
}
export default function sync(history: History, router: VueRouter, historyOptions?: HistoryOptions): Disposer;
