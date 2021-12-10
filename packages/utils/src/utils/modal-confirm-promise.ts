import { Modal } from '@ty/antd';

const modalConfirmPromise = async (
  fetch: (arg0: any) => Promise<any>,
  params: any,
  title: string,
) => {
  await new Promise((resolve, reject) => {
    try {
      Modal.confirm({
        icon: null,
        content: title,
        onOk: async () => {
          return fetch(params).then((success: any) => {
            if (success) {
              resolve(true);
            }
            return success;
          });
        },
        onCancel: async () => {
          const promis = async () => {
            return true;
          };
          return promis().then(() => {
            reject(new Error(''));
          });
        },
      });
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export { modalConfirmPromise };
