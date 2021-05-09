import {Note} from './Note'

export type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list' | 'null';
    title?: string;
    body?: string;
    color?: string;
    user?: string;
    route?: string;
    newtitle?: string;
    newbody?: string;
    newcolor?: string;
  }
  
  export type ResponseType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list' | 'errcode';
    success: boolean;
    message: string;
    notes?: Note[];
  }