## 使用 3D 模型查看器

### 功能说明

`drone-3d.html` 是一个功能完整的 3D 模型查看器，支持以下功能：

- ✅ 加载 .glb 和 .gltf 格式的 3D 模型
- ✅ 自动旋转功能，转速可调（0-100 RPM）
- ✅ 3D 视图和光源效果
- ✅ 实时显示旋转信息
- ✅ 网格辅助显示

### 如何使用

#### 方式一：在浏览器中上传文件

1. 启动本地服务器：
```bash
cd hot
python3 -m http.server 8000
```

2. 打开浏览器访问：
```
http://localhost:8000/drone-3d.html
```

3. 点击 "📁 选择模型文件" 按钮选择 `.glb` 文件

4. 调整滑块控制旋转速度

#### 方式二：将模型文件放入项目文件夹

1. 将 `dji_matrice_t300.glb` 复制到 `hot/` 文件夹

2. 修改 HTML 文件来自动加载模型

### 技术栈

- Three.js - 3D 渲染库
- GLTFLoader - glTF/GLB 模型加载器
- Vanilla JavaScript - 无依赖

### 兼容性

需要支持 WebGL 的现代浏览器：
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### 模型获取

您现在可以：
1. 上传本地的 `dji_matrice_t300.glb` 文件
2. 在线查找其他 DJI 无人机的 GLB 模型
3. 使用 Blender 等工具将模型转换为 GLB 格式
