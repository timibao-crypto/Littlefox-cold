# 飞机后翼旋转速度控制系统

## 项目简介

这是一个前端项目，用于模拟飞机后翼根据飞行速度进行旋转。该项目包含完整的速度控制逻辑、动画渲染和交互界面。

## 功能特性

✈️ **动态速度控制** - 通过滑块实时调整飞机飞行速度  
🔄 **自动计算旋转速度** - 根据飞行速度自动计算后翼转速（RPM）  
📊 **实时数据展示** - 显示速度、转速、旋转角度等关键参数  
🎨 **流畅动画** - 使用 requestAnimationFrame 实现流畅的旋转动画  
📱 **响应式设计** - 支持各种屏幕尺寸  

## 文件说明

### aircraftWingController.js
- **功能**: 核心控制模块，处理旋转速度计算和状态管理
- **主要的类**: `AircraftWingController`
- **关键方法**:
  - `setSpeed(speed)` - 设置飞行速度
  - `calculateRotationInTime(duration)` - 计算指定时间内的旋转角度
  - `calculateTimeForRotations(targetRotations)` - 计算达到目标旋转圈数需要的时间
  - `startAnimation()` - 启动动画
  - `stopAnimation()` - 停止动画

### aircraftWingRotation.html
- **功能**: 完整的交互界面和可视化
- **包含**:
  - 速度滑块控制
  - 飞机模型可视化
  - 实时数据显示
  - 集成的动画逻辑

## 使用方法

### 方式一：直接在浏览器中查看

```bash
# 进入项目目录
cd hot

# 启动本地服务器（需要安装http-server）
npx http-server . -p 8000

# 在浏览器中打开
http://localhost:8000/aircraftWingRotation.html
```

### 方式二：作为模块使用（Node.js/模块化项目）

```javascript
const AircraftWingController = require('./aircraftWingController.js');

// 创建控制器实例
const controller = new AircraftWingController({
    rpmPerKmh: 0.5,    // 每 km/h 对应的转数
    maxRPM: 450,       // 最大RPM
    maxSpeed: 900      // 最大速度 km/h
});

// 监听旋转更新事件
controller.addEventListener('rotationUpdated', (info) => {
    console.log(`Speed: ${info.speed} km/h, RPM: ${info.rpm.toFixed(1)}, Rotations: ${info.totalRotations.toFixed(2)}`);
});

// 设置速度
controller.setSpeed(300);

// 启动动画
controller.startAnimation();
```

## 配置参数

| 参数 | 值 | 说明 |
|------|-----|------|
| `rpmPerKmh` | 0.5 | 每 km/h 对应的转数 |
| `maxRPM` | 450 | 最大RPM（转/分钟） |
| `maxSpeed` | 900 | 最大飞行速度（km/h） |

## 计算公式

**后翼RPM计算公式**:
```
后翼RPM = min(飞行速度 × rpmPerKmh, maxRPM)
```

**每秒旋转度数**:
```
每秒旋转度数 = (RPM / 60) × 360
```

**总旋转圈数**:
```
总旋转圈数 = 累计旋转角度 / 360
```

## 事件系统

支持以下事件类型：

| 事件名 | 触发时机 | 回调参数 |
|--------|---------|---------|
| `speedChanged` | 速度改变时 | rotation info 对象 |
| `rotationUpdated` | 每帧更新时 | rotation info 对象 |
| `reset` | 重置时 | rotation info 对象 |

## 浏览器兼容性

- Chrome/Chromium 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 依赖

无外部依赖，使用纯 JavaScript 和 HTML5 API

## 许可证

MIT License

## 相关资源

- 原始示例: [DC DVGIS Editor](https://dc.dvgis.cn/#/editor?type=analysis&subType=model-editor&example=gltf)
