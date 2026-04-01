# ProjectRN

这是一个基于 [Expo](https://expo.dev) / React Native 的音乐播放器项目，当前已经完成：

- Expo 托管项目发布配置
- EAS Build 云构建配置
- Android 内测 APK 流程
- Web 静态导出流程
- `expo-av` 到 `expo-audio` 的迁移

## 项目现状

- 技术栈：Expo SDK 54、React Native 0.81、Expo Router
- Expo 账号所有者：`radishmeng`
- Expo 项目 slug：`project-rn`
- Android 包名：`com.sugar.projectrn`
- iOS Bundle Identifier：`com.sugar.projectrn`
- Web 导出目录：`dist/`

如果后续要正式上线应用商店，建议把 Android 包名和 iOS Bundle Identifier 替换成你自己的正式反向域名。

## 环境要求

- Node.js 18+
- npm 9+
- Expo 账号
- Android 正式上架时需要 Google Play Console 账号
- iOS 正式上架时需要 Apple Developer 账号

## 安装与启动

1. 安装依赖

   ```bash
   npm install
   ```

2. 启动开发服务器

   ```bash
   npx expo start
   ```

3. 常用本地调试命令

   ```bash
   npm run android
   npm run ios
   npm run web
   ```

## 质量检查

发布前建议至少跑下面两项：

```bash
npm run lint
npx expo-doctor
```

当前仓库已经验证通过：

- `npm run lint`
- `npx expo-doctor`
- `npm run build:web`

## 发布配置文件

### `app.json`

负责应用基础元数据、图标、包名、插件和 Expo 项目绑定信息。

关键字段：

- `expo.slug`: `project-rn`
- `expo.owner`: `radishmeng`
- `expo.android.package`: `com.sugar.projectrn`
- `expo.ios.bundleIdentifier`: `com.sugar.projectrn`
- `expo.extra.eas.projectId`: `f8a09f80-e454-48b6-b749-67fbeb3c3fab`

### `eas.json`

负责不同构建环境：

- `development`: 开发客户端
- `preview`: 内测分发
- `production`: 正式发布

其中：

- Android `preview` 输出 `apk`
- Android `production` 默认输出商店包 `aab`
- 版本号由 EAS 远端管理

## 常用构建命令

```bash
# Web 静态站点
npm run build:web

# Android 内测 APK
npm run build:android:preview

# Android 正式 AAB
npm run build:android:production

# iOS 内测包
npm run build:ios:preview

# iOS 正式包
npm run build:ios:production

# Android 提交商店
npm run submit:android

# iOS 提交 App Store
npm run submit:ios
```

## 首次初始化

首次在新机器或新账号环境下操作时：

```bash
npx eas-cli login
npx eas-cli init
```

如果项目已经关联到 Expo，则 `eas init` 会直接链接现有项目。

## GitHub Actions 自动打包

仓库已经接入 GitHub Actions 工作流：

- [android-preview.yml](/Users/sugar/Documents/trae_projects/project-rn/.github/workflows/android-preview.yml)

触发方式：

- `push` 到 `main` 分支时自动发起 Android `preview` 构建
- 在 GitHub Actions 页面手动点击 `Run workflow`

使用前需要先在 GitHub 仓库里配置一个 Secret：

- 名称：`EXPO_TOKEN`

获取方式：

```bash
npx eas-cli token:create
```

把生成的 token 填到 GitHub 仓库：

1. 打开 GitHub 仓库
2. 进入 `Settings`
3. 进入 `Secrets and variables`
4. 进入 `Actions`
5. 新建 `EXPO_TOKEN`

工作流执行内容：

- `npm ci`
- `npm run lint`
- `npx expo-doctor`
- `npx eas-cli build --platform android --profile preview --non-interactive --no-wait`

执行结果：

- GitHub Actions Summary 中会显示本次 EAS Build ID
- Summary 中会附带 Expo 构建页面链接
- APK 在 EAS 云端构建完成后可从该页面下载

## Android 内测发布手册

### 1. 发起构建

```bash
npm run build:android:preview
```

这会使用 `preview` profile 发起一个内部测试构建，并生成 APK。

### 2. 查看构建状态

```bash
npx eas-cli build:list --platform android --limit 5
```

或查看指定构建：

```bash
npx eas-cli build:view <BUILD_ID>
```

### 3. 获取 APK 下载链接

当构建状态变成 `FINISHED` 后，`build:view` 返回结果里会包含 `artifacts.buildUrl`，这就是 APK 下载地址。

### 4. 分发给测试人员

内测常见分发方式：

- 直接发送 APK 下载链接
- 上传到企业内部网盘
- 让测试人员扫描 Expo 构建页面的二维码

### 5. 典型问题

- `expo doctor` 失败：先修复依赖和配置问题再发包
- 包名已被占用：更换 `android.package`
- 签名问题：检查 EAS 远端凭据是否创建成功
- 云构建排队：等待 Expo 队列释放

## Android 正式上架手册

### 1. 生成生产包

```bash
npm run build:android:production
```

生产构建默认生成 `.aab`，用于 Google Play 上架。

### 2. 登录 Google Play Console

需要准备：

- 应用名称
- 应用图标
- 隐私政策链接
- 截图
- 应用分类
- 年龄分级
- 测试说明

### 3. 上传 AAB

在 Google Play Console 中：

1. 创建应用
2. 进入“测试”或“正式版”
3. 上传 `.aab`
4. 填写发行说明
5. 提交审核

### 4. 可选：命令行提交

如果后续补齐 Play 凭据，也可以尝试：

```bash
npm run submit:android
```

## iOS 上架手册

### 1. 生成 iOS 构建

```bash
npm run build:ios:production
```

### 2. 准备 Apple 侧信息

- Apple Developer 账号
- App Store Connect 应用记录
- Bundle Identifier
- 隐私权限说明
- 截图与元数据

### 3. 提交 App Store

可通过 EAS Submit：

```bash
npm run submit:ios
```

## Web 发布手册

### 1. 生成静态站点

```bash
npm run build:web
```

产物在：

```text
dist/
```

### 2. 可部署平台

- Nginx
- Vercel
- Netlify
- GitHub Pages
- 任意静态文件服务器

### 3. 最简单的本地预览

```bash
npx serve dist
```

## 版本管理建议

当前项目使用 EAS 远端版本号策略：

- `expo.version` 控制应用版本
- Android `versionCode` 由 EAS 远端自动管理
- iOS `buildNumber` 由 EAS 远端自动管理

建议发布习惯：

- 功能上线：升级 `expo.version`
- 同版本重复打包：让 EAS 自动增加构建号

## 发布前检查清单

### 通用

- 依赖已安装
- `npm run lint` 通过
- `npx expo-doctor` 通过
- 应用图标、启动图已确认
- 包名和 Bundle ID 已确认
- 权限说明已确认

### Android

- Google Play Console 已准备
- 构建 profile 正确
- 生产包使用 `production`

### iOS

- Apple Developer 已开通
- App Store Connect 已建应用
- 证书与签名流程可用

## 当前已验证记录

截至 2026-04-01，已经完成以下验证：

- Expo 配置可正常解析
- Web 静态导出成功
- `expo-doctor` 全量通过
- Android `preview` 构建已成功提交到 EAS

当前这次 Android 内测构建 ID：

```text
d750a7c2-c14d-4bbc-84d2-c1fee42f439d
```

查看地址：

- [Expo Build 页面](https://expo.dev/accounts/radishmeng/projects/project-rn/builds/d750a7c2-c14d-4bbc-84d2-c1fee42f439d)

## 后续建议

- 为正式上线替换为你自己的正式包名
- 补充应用截图、隐私政策和商店文案
- 在 Android 真机上回归一次音频播放和进度拖动
- 如需热更新，再补充 `expo-updates` 策略
