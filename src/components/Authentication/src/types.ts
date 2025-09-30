export interface AuthenticationProps {
  /**
   * @zh_CN 验证码登录路径
   * @en_US Verification code login path
   */
  codeLoginPath?: string;
  /**
   * @zh_CN 忘记密码路径
   * @en_US Forgot password path
   */
  forgetPasswordPath?: string;

  /**
   * @zh_CN 是否处于加载处理状态
   * @en_US Whether in loading state
   */
  loading?: boolean;

  /**
   * @zh_CN 二维码登录路径
   * @en_US QR code login path
   */
  qrCodeLoginPath?: string;

  /**
   * @zh_CN 注册路径
   * @en_US Registration path
   */
  registerPath?: string;

  /**
   * @zh_CN 是否显示验证码登录
   * @en_US Whether to show verification code login
   */
  showCodeLogin?: boolean;
  /**
   * @zh_CN 是否显示忘记密码
   * @en_US Whether to show Forgot password
   */
  showForgetPassword?: boolean;

  /**
   * @zh_CN 是否显示二维码登录
   * @en_US Whether to show QR code login
   */
  showQrcodeLogin?: boolean;

  /**
   * @zh_CN 是否显示注册按钮
   * @en_US Whether to show Register button
   */
  showRegister?: boolean;

  /**
   * @zh_CN 是否显示记住账号
   * @en_US Whether to show Remember me
   */
  showRememberMe?: boolean;

  /**
   * @zh_CN 是否显示第三方登录
   * @en_US Whether to show third-party login
   */
  showThirdPartyLogin?: boolean;

  /**
   * @zh_CN 登录框子标题
   * @en_US Login subtitle
   */
  subTitle?: string;

  /**
   * @zh_CN 登录框标题
   * @en_US Login title
   */
  title?: string;
  /**
   * @zh_CN 提交按钮文本
   * @en_US Submit button text
   */
  submitButtonText?: string;
}
