import { Button, Modal, notification, Spin } from '@ty/antd';
import React, { memo, useCallback, useState } from 'react';
import utl from 'lodash';
import { RcFile, UploadChangeParam, UploadFile } from '@ty/antd/lib/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import Upload from './upload';
import { getToken } from '../../utils';

export interface UploadButtonProps {
  /** 文件上传参数及上传地址 */
  apiConfig: {
    method: string;
    url: string;
    prefix?: string;
    params?: object;
    templateUrl?: string;
  };
  /** 对话框标题 */
  modelTitle?: string;
  /** 文件上传完成后的回调函数 */
  onUploadSuccess?: (fielList: UploadChangeParam['fileList']) => void;
  /** 上传按钮文字 */
  buttonTitle?: string;
  /** 下载模板文件名 */
  downloadTitle?: string;
  /** 模板下载地址 */
  downloadUrl?: string;
  /** 文件上传限制类型 */
  mimeTypes?: string[];
  /** 触发按钮是否为 a 链接形式 */
  trigger?: boolean;
}

const UploadButton = memo<UploadButtonProps>((props) => {
  const {
    apiConfig,
    onUploadSuccess,
    modelTitle = '导入报表',
    buttonTitle = '导入报表',
    downloadTitle = '下载',
    mimeTypes = ['xls', 'xlsx'],
    trigger,
  } = props;

  const [modalVisible, setModalVisible] = useState(false);
  const [fileLists, setFileList] = useState<UploadFile<any>[]>([]);
  const [loading, setLoading] = useState(false);

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleUploadChange = useCallback((fileList) => {
    if (utl.isEmpty(fileList)) {
      setLoading(false);
      setFileList([]);
      return;
    }

    if (utl.get(fileList, '[0].response.error')) {
      setFileList([
        {
          ...fileList[0],
          status: 'error',
        },
      ]);
      setLoading(false);
      notification.error({
        message: '接口返回错误',
        description: utl.get(fileList, '[0].response.message'),
      });
      return;
    }

    setFileList(fileList);

    if (fileList[0].status === 'done') {
      setLoading(false);
      if (utl.get(fileList, '[0].response.error')) {
        return;
      }

      hideModal();

      if (onUploadSuccess) {
        onUploadSuccess(fileList);
      }
    }
  }, []);

  const getDataFn = () => ({
    method: apiConfig.method,
    params: JSON.stringify(apiConfig.params ?? {}),
  });

  /**
   * description 文件上传前判断文件类型
   */
  const checkFileType = (file: RcFile, types: string[] = []) => {
    if (types.length === 0) {
      return true;
    }
    /** 判断文件类型是否允许上传，比较类型不区分大小写 */
    const type = types.map((item) => item.toLowerCase());
    const nameType = file.name.split('.').pop()?.toLowerCase() || '';
    if (type.includes(nameType)) {
      setLoading(true);
      return true;
    }
    notification.error({
      message: `文件上传只支持${types.join(',')}类型`,
    });
    return false;
  };

  return (
    <>
      {trigger ? (
        <a onClick={() => setModalVisible(true)}>{buttonTitle}</a>
      ) : (
        <Button onClick={() => setModalVisible(true)} type="primary">
          {buttonTitle}
        </Button>
      )}
      <Modal
        title={modelTitle}
        visible={modalVisible}
        onCancel={hideModal}
        onOk={hideModal}
        footer={[
          <Button key="back" type="primary" onClick={hideModal}>
            取消
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <div style={{ borderWidth: 0, borderColor: '#e8e8e8', borderStyle: 'solid' }}>
            <div style={{ textAlign: 'center', margin: '30px' }}>
              <Upload
                maxLen={1}
                action={`${apiConfig?.prefix ?? '/'}${apiConfig.url}`}
                data={getDataFn}
                headers={{ Authorization: `Bearer ${getToken()}` }}
                onChange={handleUploadChange}
                value={fileLists}
                beforeUpload={(file) => checkFileType(file, mimeTypes)}
                showUploadList={false}
              >
                <Button>
                  <UploadOutlined />
                  上传文件
                </Button>
              </Upload>
            </div>
          </div>
          <p style={{ marginTop: '20px' }}>操作说明:</p>
          <p style={{ marginLeft: '20px' }}>1.仅支持导入 {mimeTypes.join(', ')} 格式的文件</p>
          <p style={{ marginLeft: '20px' }}>
            {apiConfig?.templateUrl ? (
              <>
                2.导入模板下载：
                <a
                  onClick={() => window.open(`${apiConfig?.prefix ?? ''}${apiConfig?.templateUrl}`)}
                >
                  {downloadTitle}
                </a>
              </>
            ) : null}
          </p>
        </Spin>
      </Modal>
    </>
  );
});

export { UploadButton, Upload };
