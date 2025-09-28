<template>
  <div class="ruleChain-list">
    <BasicTable @register="registerTable">
      <template #headerTop>
        <div class="text-lg font-bold my-2">
          {{ t(getTitle.value) }}
        </div>
      </template>
      <template #tableTitle>
        <div class="space-x-2">
          <a-button type="primary" @click="handleForm({})">
            <Icon icon="i-fluent:add-12-filled" /> {{ t('ruleChainPage.addRuleChain') }}
          </a-button>
          <a-input
            v-model:value="searchParam.textSearch"
            :placeholder="t('ruleChainPage.searchPlaceholder')"
            allow-clear
            @change="reload"
            style="width: 240px"
          >
            <template #suffix>
              <icon icon="ant-design:search-outlined" />
            </template>
          </a-input>
        </div>
      </template>
      <template #firstColumn="{ record }">
        <a @click="handleFLow({ id: record.id })" :title="record.name">
          {{ record.name }}
        </a>
      </template>
      <template #debugMode="{ record }">
        <Checkbox :checked="record.debugMode" />
      </template>
      <template #root="{ record }">
        <Checkbox :checked="record.root" />
      </template>
    </BasicTable>
    <InputForm @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  export default defineComponent({
    name: 'ViewsTbRuleChainList',
  });
</script>
<script lang="ts" setup>
  import { defineComponent, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Icon } from '/@/components/Icon';
  import { router } from '/@/router';
  import { Checkbox } from 'ant-design-vue';
  import { ruleChainList, setRootRuleChain, deleteRuleChain } from '/@/api/tb/ruleChain';
  import InputForm from './form.vue';

  const { t } = useI18n('tb');
  const { createConfirm, showMessage } = useMessage();

  const getTitle = {
    value: router.currentRoute.value.meta.title || 'ruleChain',
  };

  const searchParam = reactive({
    textSearch: '',
  });
  const tableColumns: BasicColumn[] = [
    {
      title: t('ruleChainPage.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      width: 260,
      align: 'left',
      fixed: 'left',
      slot: 'firstColumn',
    },
    {
      title: t('ruleChainPage.description'),
      dataIndex: 'additionalInfo.description',
      key: 'additionalInfo.description',
      align: 'left',
      ellipsis: true,
    },

    {
      title: t('ruleChainPage.debug'),
      dataIndex: 'debugMode',
      key: 'debugMode',
      width: 80,
      align: 'center',
      slot: 'debugMode',
    },
    {
      title: t('ruleChainPage.root'),
      dataIndex: 'root',
      key: 'root',
      width: 80,
      align: 'center',
      slot: 'root',
    },
    {
      title: t('ruleChainPage.createdTime'),
      dataIndex: 'createdTime',
      key: 'createdTime',
      format: 'date|YYYY-MM-DD HH:mm:ss',
      sorter: true,
      width: 160,
      align: 'center',
    },
  ];

  const actionColumn: BasicColumn = {
    width: 160,
    actions: (record: Recordable) => [
      {
        icon: 'ant-design:flag-outlined',
        disabled: record.root == true,
        title: t('ruleChainPage.actions.setRoot'),
        onClick: handleSetRuleChainRoot.bind(this, { ...record }),
      },
      {
        icon: 'i-clarity:note-edit-line',
        color: 'success',
        title: t('ruleChainPage.actions.edit'),
        onClick: handleForm.bind(this, { ...record }),
      },
      {
        icon: 'ant-design:delete-outlined',
        color: 'error',
        title: t('ruleChainPage.actions.deleteLabel'),
        disabled: record.root == true,
        onClick: handleDelete.bind(this, { ...record }),
      },
    ],
  };

  const [registerModal, { openModal }] = useModal();
  const [registerTable, { reload }] = useTable({
    rowKey: (record) => record.id.id,
    api: (arg) => ruleChainList(arg, 'CORE'),
    beforeFetch: wrapFetchParams,
    defSort: { sortProperty: 'createdTime', sortOrder: 'DESC' },
    columns: tableColumns,
    actionColumn: actionColumn,
    showTableSetting: true,
    useSearchForm: false,
    canResize: true,
  });

  function wrapFetchParams(param: any) {
    return { ...param, textSearch: searchParam.textSearch };
  }

  function handleForm(record: Recordable) {
    openModal(true, record);
  }

  async function handleDelete(record: Recordable) {
    createConfirm({
      iconType: 'error',
      title: t('ruleChainPage.delete.confirmTitle', { name: record.name }),
      content: t('ruleChainPage.delete.confirmContent'),
      centered: false,
      okText: t('ruleChainPage.delete.okText'),
      okButtonProps: {
        type: 'primary',
        danger: true,
      },
      onOk: async () => {
        try {
          await deleteRuleChain(record.id.id);
          showMessage(t('ruleChainPage.delete.success'));
        } catch (error: any) {
          console.log(error);
        } finally {
          handleSuccess();
        }
      },
    });
  }

  function handleSuccess() {
    reload();
  }

  function handleFLow(record: Recordable) {
    router.push({ path: `/rule-chain/${record.id.id}` });
  }

  async function handleSetRuleChainRoot(record: Recordable) {
    createConfirm({
      iconType: 'info',
      title: t('ruleChainPage.setRootConfirm.title', { name: record.name }),
      content: t('ruleChainPage.setRootConfirm.content'),
      centered: false,
      okText: t('ruleChainPage.setRootConfirm.okText'),
      onOk: async () => {
        try {
          await setRootRuleChain(record.id.id);
          showMessage(t('ruleChainPage.setRootConfirm.success'));
        } catch (error: any) {
          console.log(error);
        } finally {
          handleSuccess();
        }
      },
    });
  }
</script>
<style lang="less">
  .ruleChain-list {
  }
</style>
