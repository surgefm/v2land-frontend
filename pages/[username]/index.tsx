// #region Global Imports
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NextPage } from 'next';
import { Space, Button, Input, Form, message } from 'antd';
// #endregion Global Imports

// #region Local Imports
import { useTranslation } from '@I18n';
import {
  Background,
  ClientHead,
  Footer,
  Card,
  EventTitle,
  ClientAvatar,
  ClientAvatarEditor,
} from '@Components';
import { ClientActions } from '@Actions';
import { getClientWithUsername, getClient, getLoggedInClientId } from '@Selectors';
import { UtilService, RedstoneService } from '@Services';
import { Rules } from '@Definitions';
// #endregion Local Imports

// #region Interface Imports
import { IClientPage, ReduxNextPageContext } from '@Interfaces';
// #endregion Interface Imports

const { TextArea } = Input;

const ClientPage: NextPage<IClientPage.IProps, IClientPage.InitialProps> = ({ clientId }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const client = useSelector(getClient(clientId));
  const loggedInClientId = useSelector(getLoggedInClientId);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(client ? client.avatar : '');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const decoratedRules = Rules(t);
  if (!client) return <React.Fragment />;

  const isCurrentClient = loggedInClientId === clientId;

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => setIsEditing(false);

  const handleFormChange = () => {
    let d =
      avatar === client.avatar &&
      form.getFieldValue('nickname') === client.nickname &&
      form.getFieldValue('description') === client.description;
    d = d || form.getFieldValue('nickname').length === 0;
    setDisabled(d);
  };

  const handleAvatarChange = (value: string) => {
    setAvatar(value);
    if (value !== client.avatar) setDisabled(false);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const response = await RedstoneService.updateClient(clientId, {
        avatar: avatar as string,
        nickname: form.getFieldValue('nickname') as string,
        description: form.getFieldValue('description') as string,
      });
      message.success(t('Client_EditSuccess'));
      dispatch(ClientActions.UpdateClient(clientId, response.client));
      setIsEditing(false);
    } catch (err) {
      // Do nothing
    } finally {
      setLoading(false);
    }
  };

  const getClientInfoComponent = () => {
    if (!isEditing) {
      return (
        <div className="row">
          <ClientAvatar clientId={client.id} size={160} showTooltip={false} />
          <div className="info">
            <Space direction="vertical">
              <div className="name">
                {client.nickname ? <EventTitle>{client.nickname}</EventTitle> : null}
                <span className="username">@{client.username}</span>
              </div>
              <p>{client.description || t('Client_NoDescription')}</p>
            </Space>
            {isCurrentClient ? (
              <div className="edit-buttons">
                <Button onClick={handleEditClick}>{t('Client_Edit')}</Button>
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <div className="row">
        <ClientAvatarEditor clientId={clientId} onChange={handleAvatarChange} />
        <div className="info">
          <Space direction="vertical">
            <Form
              form={form}
              name="client-detail"
              onValuesChange={handleFormChange}
              onFinish={submit}
            >
              <div className="name">
                <Form.Item
                  name="nickname"
                  initialValue={client.nickname}
                  validateFirst
                  rules={decoratedRules.nickname}
                >
                  <Input
                    size="large"
                    placeholder={t('Client_Nickname')}
                    style={{ fontSize: '1.5rem', width: '250px' }}
                  />
                </Form.Item>
                <span className="username">@{client.username}</span>
              </div>
              <Form.Item name="description" initialValue={client.description}>
                <TextArea maxLength={80} placeholder={t('Client_DescriptionPlaceholder')} />
              </Form.Item>

              <div className="edit-buttons">
                <Space>
                  <Button onClick={handleCancelClick}>{t('Client_Cancel')}</Button>
                  <Button htmlType="submit" type="primary" disabled={disabled} loading={loading}>
                    {t('Newsroom_EventDetail_Save')}
                  </Button>
                </Space>
              </div>
            </Form>
          </Space>
        </div>
      </div>
    );
  };

  return (
    <div className="top">
      <Background>
        <ClientHead clientId={clientId} />
        <Card>{getClientInfoComponent()}</Card>
        <Footer />
      </Background>
      <style jsx>
        {`
          .top :global(.row) {
            display: flex;
          }

          .top :global(.info) {
            margin-left: 1rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-grow: 1;
            width: calc(100% - 160px - 1rem);
          }

          .top :global(.name) {
            display: inline-flex;
            flex-wrap: wrap;
          }

          .top :global(.name) > :global(*):first-child {
            margin-right: 0.5rem;
          }

          .top :global(.username) {
            font-size: 2rem;
            white-space: nowrap;
            font-weight: 200;
          }

          .top :global(.edit-buttons) {
            display: flex;
            justify-content: flex-end;
          }

          .top :global(.ant-avatar-string) {
            font-size: 96px;
          }
        `}
      </style>
    </div>
  );
};

ClientPage.getInitialProps = async (
  ctx: ReduxNextPageContext
): Promise<IClientPage.InitialProps> => {
  const props = { namespacesRequired: ['common'] };

  let username = ctx.query.username as string;
  if (+username === +username) {
    UtilService.redirect(ctx, `/@Newspect/${username}`);
    return props;
  }

  if (username.startsWith('@')) username = username.slice(1);
  let client = getClientWithUsername(username)(ctx.store.getState());

  if (!client) {
    await ctx.store.dispatch(ClientActions.GetClient(username));
  }

  client = getClientWithUsername(username)(ctx.store.getState());
  if (!client) {
    UtilService.redirect(ctx, '/', { hiddenQuery: { client_not_found: 1 } });
    return props;
  }

  if (username !== client.username) {
    UtilService.redirect(ctx, `/@${client.username}`);
    return props;
  }

  return {
    ...props,
    clientId: client.id,
  };
};

export default ClientPage;
