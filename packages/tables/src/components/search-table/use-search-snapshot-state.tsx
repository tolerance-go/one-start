import { useState, useEffect } from 'react';
import type { OSSourceTableAPI } from '@ty-one-start/typings';
import { useActionsRef } from '@ty-one-start/utils';
import { eventNames } from '../table/constants';

export const useSearchSnapshotState = ({
  sourceTableRef,
}: {
  sourceTableRef: React.MutableRefObject<OSSourceTableAPI | null>;
}) => {
  // 是否可以创建或更新
  const [canYouCreateOrUpdate, setCanYouCreateOrUpdate] = useState(false);

  const disableSnapshotCreator = () => {
    setCanYouCreateOrUpdate(false);
  };

  /** 激活 */
  const activeSnapshotCreator = () => {
    setCanYouCreateOrUpdate(true);
  };

  const inlineAPIRef = useActionsRef({
    disableSnapshotCreator,
    activeSnapshotCreator,
  });

  useEffect(() => {
    const handleReset = () => {
      inlineAPIRef.current.disableSnapshotCreator();
    };
    sourceTableRef.current?.core.on(eventNames.onSearchFormReset, handleReset);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sourceTableRef.current?.core.off(eventNames.onSearchFormReset, handleReset);
    };
  }, []);

  return {
    canYouCreateOrUpdate,
    disableSnapshotCreator,
    activeSnapshotCreator,
  };
};
