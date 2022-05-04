import { Tag } from '@Interfaces/Models/Tag';
import { PopularChatroom } from '@Interfaces/Models/Chat';

declare namespace IHomePage {
  export interface IProps {
    tagList: Tag[];
    chatrooms: PopularChatroom[];
  }

  export interface InitialProps {
    namespacesRequired: string[];
    tagList: Tag[];
    chatrooms: PopularChatroom[];
  }

  export interface IStateProps {
    home: {
      version: number;
    };
    image: {
      url: string;
    };
  }

  namespace Actions {
    export interface IMapPayload {}

    export interface IMapResponse {}
  }
}

export { IHomePage };
