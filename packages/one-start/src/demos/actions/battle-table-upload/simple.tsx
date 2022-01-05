import { OSBattleTableUpload, OSProviderWrapper } from '@ty-one-start/one-start';
import delay from 'delay';
import { mock, Random } from 'mockjs';

export default () => {
  return (
    <OSProviderWrapper>
      <OSBattleTableUpload
        settings={{
          modalTitle: '估值表',
          triggerText: '估值表',
          fieldItems: [
            {
              type: 'text',
              settings: {
                dataIndex: 'frameContractNumber',
                title: '框架合约编号',
              },
            },
            {
              type: 'text',
              key: 'stock',
              settings: {
                dataIndex: 'stock',
                title: '个股',
              },
            },
            {
              type: 'text',
              key: 'stockIndexFutures',
              settings: {
                dataIndex: 'stockIndexFutures',
                title: '股指期货',
              },
            },
          ],
          attachmentFieldKeys: {
            stock: {
              baseDataIndex: 'frameContractNumber',
              suffix: '.xlsx',
            },
            stockIndexFutures: {
              baseDataIndex: 'frameContractNumber',
              suffix: '.DBF',
            },
          },
          extraFormFieldItems: [
            {
              type: 'date',
              settings: {
                dataIndex: 'date',
                title: '交易日期',
              },
            },
          ],
        }}
        requests={{
          requestDataSource: async () => {
            return mock({
              error: false,
              data: {
                'page|30': [
                  {
                    frameContractNumber: () => Random.increment(),
                    id: '@id',
                  },
                ],
                total: 30,
              },
            });
          },
          requestWhenUpload: async (options) => {
            await delay(1000);

            return {
              error: false,
              data: {
                errorMessages: {
                  [options.files![0].attachmentId]: mock({
                    'list|1-10': [
                      {
                        title: () => Random.title(),
                        desc: () => Random.paragraph(1, 3),
                      },
                    ],
                  }).list,
                },
              },
            };
          },
        }}
        // buttonDisabled={selectedRowKeys.length === 0}
        // selectedRows={selectedRows}
      />
    </OSProviderWrapper>
  );
};
