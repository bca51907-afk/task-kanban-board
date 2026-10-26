# 任务管理看板

Vue3 + Vite + localStorage 纯前端任务管理看板应用，支持拖拽流转、多主题切换、数据持久化。

## 功能

- 三列看板：待办 → 进行中 → 已完成，双向拖拽流转
- 星标/紧急标记，分类管理
- 亮色/暗色/多彩三种主题
- 完成任务时 Canvas 粒子庆祝动画
- localStorage 自动保存
- 响应式布局

## 技术栈

- Vue 3 (Composition API + `<script setup>`)
- Vite 5
- Vitest + @vue/test-utils

## 开发

```bash
npm install
npm run dev      # 启动开发服务器 (端口 8085)
npm run test     # 运行单元测试
npm run build    # 生产构建
```

## 项目结构

```
src/
├── components/    # 9 个 Vue 组件
├── composables/   # 4 个组合式函数
├── config/        # 主题色板、提示文案
├── utils/         # storage/timeFormat/cssVariables
├── styles/        # CSS 变量定义
└── assets/        # 全局样式
```