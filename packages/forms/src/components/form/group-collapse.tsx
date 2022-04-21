import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

const findAllGapRow = (
  element: Element | null | undefined,
  cb: (next: Element) => boolean,
  collections: Element[] = [],
): Element[] => {
  if (element == null) return collections;
  if (element.nextElementSibling) {
    if (!cb(element.nextElementSibling)) {
      return findAllGapRow(
        element.nextElementSibling,
        cb,
        collections.concat(element.nextElementSibling),
      );
    }
    return collections;
  }
  return collections;
};

export default ({
  groupId,
  groupClass,
  dividerClass,
  groupRowClass,
}: {
  groupId: string;
  groupClass: string;
  dividerClass: string;
  groupRowClass: string;
}) => {
  const [visible, setVisible] = useState(true);

  const handleClick = () => {
    setVisible((prev) => !prev);
  };

  useEffect(() => {
    const groupItem = document.getElementById(groupId);
    const gapNodes = findAllGapRow(
      groupItem,
      (item) => !!item.firstElementChild?.classList.contains(dividerClass),
    );

    if (visible) {
      groupItem?.querySelector(`.${groupRowClass}`)?.classList.remove('os-hidden');
      gapNodes.forEach((item) => item.classList.remove('os-hidden'));
    } else {
      groupItem?.querySelector(`.${groupRowClass}`)?.classList.add('os-hidden');
      gapNodes.forEach((item) => item.classList.add('os-hidden'));
    }
  }, [dividerClass, groupClass, groupId, groupRowClass, visible]);

  return visible ? (
    <UpCircleOutlined
      style={{
        color: 'rgba(0, 0, 0, 0.45)',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    />
  ) : (
    <DownCircleOutlined
      style={{
        color: 'rgba(0, 0, 0, 0.45)',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    />
  );
};
