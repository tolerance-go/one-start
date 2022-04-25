import { Popover } from 'antd';
import { NodeDataType } from '../typings';
import { renderNodeActions } from './render-node-actions';

export const renderNodeWrapper = (
  node: React.ReactNode,
  nodeData: NodeDataType,
  setAppData: React.Dispatch<React.SetStateAction<NodeDataType[]>>,
  options: {
    clsPrefix?: string;
  },
) => {
  const { clsPrefix } = options;
  // const modalRef = React.createRef<OSDialogAPI>();
  // const settingBtnRef = React.createRef<OSTriggerButtonAPI>();
  return (
    <Popover content={renderNodeActions(nodeData, setAppData)}>
      {nodeData.wrapper ?? true ? <div className={`${clsPrefix}-node`}>{node}</div> : node}
    </Popover>
  );
};
