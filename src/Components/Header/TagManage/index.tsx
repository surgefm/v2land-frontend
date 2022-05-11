import React, { useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { Button, Modal } from 'antd';

import { canCurrentClientEditTag } from '@Selectors';
import { ITagForm } from '@Components/Tag/Form/Form';

const TagForm = (dynamic(() => import('@Components/Tag/Form')) as any) as React.FC<ITagForm.IProps>;

export const HeaderTagManage: React.FC = () => {
  const router = useRouter();
  const tagId = +router.query.tagId;
  const canEdit = useSelector(canCurrentClientEditTag(tagId));
  const [visible, setVisible] = useState(false);

  if (!canEdit) return <></>;

  const handleOk = () => setVisible(false);
  const handleCancel = () => setVisible(false);

  return (
    <>
      <Button type="link" onClick={() => setVisible(true)}>
        管理话题
      </Button>
      <Modal
        title="管理话题"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <TagForm tagId={tagId} onOk={handleOk} onCancel={handleCancel} />
      </Modal>
    </>
  );
};
