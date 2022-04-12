import { State } from 'react-beautiful-dnd';
import { ThunkDispatch } from 'redux-thunk';

declare module 'redux' {
  interface Dispatch<A extends Action<any> = AnyAction> extends ThunkDispatch {}
}

import 'react';

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
