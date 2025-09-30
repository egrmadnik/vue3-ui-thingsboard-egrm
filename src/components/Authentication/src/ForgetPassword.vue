<template>
  <div>
    <Title>
      <slot name="title"> {{ title || t('sys.login.forgetPassword') }} 🤦🏻‍♂️ </slot>
      <template #desc>
        <span class="text-secondary">
          <slot name="subTitle">
            {{ subTitle || t('sys.login.forgetPasswordSubtitle') }}
          </slot>
        </span>
      </template>
    </Title>
    <BasicForm @register="registerForm" />

    <div>
      <Button type="primary" size="large" class="mt-2 w-full" @click="handleSubmit">
        <slot name="submitButtonText">
          {{ submitButtonText || t('sys.login.forgetFormTitle') }}
        </slot>
      </Button>
      <Button class="mt-4 w-full" size="large" @click="goToLogin()">
        {{ t('common.back') }}
      </Button>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { computed, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import Title from './AuthTitle.vue';
  import { Button } from 'ant-design-vue';

  const { t } = useI18n('tb');
  const { showMessage } = useMessage();

  interface Props {
    formSchema: FormSchema[];
    /**
     * @zh_CN 是否处于加载处理状态
     * @en_US Whether in loading state
     */
    loading?: boolean;
    /**
     * @zh_CN 登录路径
     * @en_US Login path
     */
    loginPath?: string;
    /**
     * @zh_CN 标题
     * @en_US Title
     */
    title?: string;
    /**
     * @zh_CN 描述
     * @en_US Subtitle / description
     */
    subTitle?: string;
    /**
     * @zh_CN 按钮文本
     * @en_US Button text
     */
    submitButtonText?: string;
  }

  defineOptions({
    name: 'ForgetPassword',
  });

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    loginPath: '/auth/login',
    submitButtonText: '',
    subTitle: '',
    title: '',
  });

  const emit = defineEmits<{
    submit: [Record<string, any>];
  }>();

  const [registerForm, formApi] = useForm(
    reactive({
      labelWidth: 1,
      schemas: computed(() => props.formSchema),
      baseColProps: { lg: 24, md: 24 },

      showActionButtonGroup: false,
    }),
  );

  const router = useRouter();

  async function handleSubmit() {
    try {
      const data = await formApi.validate();
      if (data) {
        emit('submit', data);
      }
    } catch (error: any) {
      if (error && error.errorFields) {
        showMessage(t('common.validateError'));
      }
      console.log('error', error);
    }
  }

  function goToLogin() {
    router.push(props.loginPath);
  }

  defineExpose({
    getFormApi: () => formApi,
  });
</script>
