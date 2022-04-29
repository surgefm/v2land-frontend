import { ThunkDispatch } from 'redux-thunk';

declare module 'redux' {
  interface Dispatch<A extends Action<any> = AnyAction> extends ThunkDispatch {}
}

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}

declare module 'react-telegram-login' {
  declare const Login: React.FC<any>;
  export default Login;
}
