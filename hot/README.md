# 飞机后翼旋转速度控制 | Aircraft Wing Rotation Control

根据飞行速度计算飞机后翼的旋转圈数和旋转速度的前端解决方案。

## 📋 文件说明

### 1. `aircraftWingRotation.html`
完整的交互式演示页面，包含：
- 实时速度滑块控制（0-900 km/h）
- 3D飞机模型可视化
- 后翼动画旋转效果
- 实时数据统计显示

**使用方法：** 直接在浏览器中打开此文件

### 2. `aircraftWingController.js`
核心业务逻辑模块，提供：
- 飞行速度与后翼旋转速度的映射计算
- RPM（转每分钟）计算
- 旋转圈数追踪
- 事件监听系统

**使用方法：**
```javascript
// 引入模块
const AircraftWingController = require('./aircraftWingController.js');

// 创建控制器实例
const controller = new AircraftWingController({
    rpmPerKmh: 0.5,    // 每 km/h 对应的转数
    maxRPM: 450,       // 最大RPM
    maxSpeed: 900      // 最大速度
});

// 设置飞行速度
controller.setSpeed(300);

// 启动动画
controller.startAnimation();

// 获取旋转信息
const info = controller.getRotationInfo();
console.log(info);
// 输出: {
//   speed: 300,
//   rpm: 150,
//   rotationAngle: 123.45,
//   totalRotations: 0.34
// }
```

## 🔧 核心算法

### 旋转速度计算公式

```
RPM = min(速度 × 旋转系数, 最大RPM)
```

其中：
- **RPM** = 每分钟转数
- **速度** = 飞行速度 (km/h)
- **旋转系数** = 0.5（可配置）
- **最大RPM** = 450（防止过度旋转）

### 旋转角度计算

```
旋转角度/秒 = (RPM / 60) × 360°
```

### 总旋转圈数计算

```
总圈数 = 累计旋转角度 / 360°
```

## 📊 示例参数

| 飞行速度 | 后翼RPM | 旋转速度 |
|---------|---------|---------|
| 100 km/h | 50 | 5圈/分钟 |
| 300 km/h | 150 | 15圈/分钟 |
| 600 km/h | 300 | 30圈/分钟 |
| 900 km/h | 450 | 45圈/分钟（最大）|

## 🎮 API 文档

### 构造函数
```javascript
new AircraftWingController(options)
```
- `options.rpmPerKmh` (默认: 0.5) - 速度到RPM的转换系数
- `options.maxRPM` (默认: 450) - 最大RPM
- `options.maxSpeed` (默认: 900) - 最大飞行速度

### 主要方法

#### `setSpeed(speed)`
设置飞行速度并更新RPM
```javascript
controller.setSpeed(300); // 设置为300 km/h
```

#### `getRotationInfo()`
获取当前旋转信息
```javascript
const info = controller.getRotationInfo();
// { speed, rpm, rotationAngle, totalRotations }
```

#### `calculateRotationInTime(duration)`
计算在给定时间内的旋转角度
```javascript
const degrees = controller.calculateRotationInTime(5); // 5秒内旋转多少度
```

#### `calculateTimeForRotations(targetRotations)`
计算达到目标旋转圈数需要的时间
```javascript
const time = controller.calculateTimeForRotations(10); // 旋转10圈需要多少秒
```

#### `startAnimation()`
启动动画循环

#### `stopAnimation()`
停止动画循环

#### `reset()`
重置所有状态

#### `addEventListener(type, callback)`
监听事件
```javascript
controller.addEventListener('rotationUpdated', (info) => {
    console.log(`当前转速: ${info.rpm} RPM`);
});
```

## 🎨 与Cesium/GLTF集成

如果需要与3D GIS工具（如Cesium）集成，可以：

```javascript
// 1. 创建控制器
const wingController = new AircraftWingController();

// 2. 监听旋转更新
wingController.addEventListener('rotationUpdated', (info) => {
    // 3. 更新GLTF模型的后翼旋转角度
    updateAircraftWingRotation(info.rotationAngle);
});

// 4. 响应飞行速度变化
wingController.setSpeed(currentFlightSpeed);
wingController.startAnimation();
```

## 📝 配置调整

根据实际飞机型号，可调整以下参数：

- `rpmPerKmh`: 增大使旋转更快，减小使旋转更慢
- `maxRPM`: 真实飞机的最大螺旋桨转速
- `maxSpeed`: 飞机的巡航速度上限

## ✅ 功能特点

- ✨ 平滑的动画性能（使用 requestAnimationFrame）
- 🎯 精确的时间计算（基于毫秒级时间戳）
- 🔄 事件驱动架构（便于与其他系统集成）
- 📱 响应式设计（HTML演示支持所有设备）
- 🚀 轻量级依赖（无外部依赖）

## 📦 集成使用

### Node.js环境
```bash
npm install  # 根据需要
```

```javascript
const AircraftWingController = require('./aircraftWingController.js');
// 使用同上
```

### 浏览器环境
```html
<script src="aircraftWingController.js"></script>
<script>
    const controller = new window.AircraftWingController();
    // 使用同上
</script>
```

---

**创建日期:** 2026年4月15日  
**版本:** 1.0  
**作者:** AI Assistant
