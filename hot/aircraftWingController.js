/**
 * 飞机后翼旋转速度控制模块
 * 
 * 功能：根据飞行速度计算后翼旋转圈数
 * 公式：后翼RPM = 飞行速度(km/h) × 旋转系数
 */

class AircraftWingController {
    constructor(options = {}) {
        // 配置参数
        this.config = {
            rpmPerKmh: options.rpmPerKmh || 0.5, // 每 km/h 对应的转数
            maxRPM: options.maxRPM || 450,        // 最大RPM
            maxSpeed: options.maxSpeed || 900,    // 最大速度 km/h
        };

        // 状态
        this.state = {
            speed: 0,                // 当前飞行速度
            rpm: 0,                  // 当前RPM
            rotationAngle: 0,        // 累计旋转角度
            totalRotations: 0,       // 总旋转圈数
            animationId: null,
            lastTimestamp: Date.now(),
        };

        this.listeners = [];
    }

    /**
     * 设置飞行速度
     * @param {number} speed - 飞行速度 km/h
     */
    setSpeed(speed) {
        speed = Math.max(0, Math.min(speed, this.config.maxSpeed));
        this.state.speed = speed;

        // 计算RPM：速度越快，转速越快
        this.state.rpm = Math.min(speed * this.config.rpmPerKmh, this.config.maxRPM);

        this.notifyListeners('speedChanged');
    }

    /**
     * 获取当前旋转信息
     */
    getRotationInfo() {
        return {
            speed: this.state.speed,
            rpm: this.state.rpm,
            rotationAngle: this.state.rotationAngle,
            totalRotations: this.state.totalRotations,
        };
    }

    /**
     * 计算在给定时间内的旋转角度
     * @param {number} duration - 时间长度（秒）
     * @returns {number} 旋转角度（度）
     */
    calculateRotationInTime(duration) {
        // RPM -> 每秒旋转圈数 -> 每秒旋转度数
        const degreesPerSecond = (this.state.rpm / 60) * 360;
        return degreesPerSecond * duration;
    }

    /**
     * 计算达到目标旋转圈数需要的时间
     * @param {number} targetRotations - 目标圈数
     * @returns {number} 需要的时间（秒），如果RPM为0返回Infinity
     */
    calculateTimeForRotations(targetRotations) {
        if (this.state.rpm === 0) return Infinity;
        
        const targetDegrees = targetRotations * 360;
        const degreesPerSecond = (this.state.rpm / 60) * 360;
        return targetDegrees / degreesPerSecond;
    }

    /**
     * 启动动画
     */
    startAnimation() {
        this.state.lastTimestamp = Date.now();
        this._animate();
    }

    /**
     * 停止动画
     */
    stopAnimation() {
        if (this.state.animationId) {
            cancelAnimationFrame(this.state.animationId);
            this.state.animationId = null;
        }
    }

    /**
     * 重置状态
     */
    reset() {
        this.state.speed = 0;
        this.state.rpm = 0;
        this.state.rotationAngle = 0;
        this.state.totalRotations = 0;
        this.stopAnimation();
        this.notifyListeners('reset');
    }

    /**
     * 内部动画循环
     */
    _animate() {
        const now = Date.now();
        const deltaTime = (now - this.state.lastTimestamp) / 1000; // 转换为秒
        this.state.lastTimestamp = now;

        // 更新旋转角度
        const degreesPerSecond = (this.state.rpm / 60) * 360;
        this.state.rotationAngle += degreesPerSecond * deltaTime;

        // 保持角度在 0-360 范围（可选，为了性能）
        // this.state.rotationAngle %= 360;

        // 计算总旋转圈数
        this.state.totalRotations = this.state.rotationAngle / 360;

        this.notifyListeners('rotationUpdated');
        this.state.animationId = requestAnimationFrame(() => this._animate());
    }

    /**
     * 添加事件监听器
     */
    addEventListener(type, callback) {
        this.listeners.push({ type, callback });
    }

    /**
     * 移除事件监听器
     */
    removeEventListener(type, callback) {
        this.listeners = this.listeners.filter(
            l => !(l.type === type && l.callback === callback)
        );
    }

    /**
     * 通知所有监听器
     */
    notifyListeners(type) {
        this.listeners.forEach(listener => {
            if (listener.type === type) {
                listener.callback(this.getRotationInfo());
            }
        });
    }
}

// 使用示例
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AircraftWingController;
}

// 浏览器环境下的使用示例
if (typeof window !== 'undefined') {
    window.AircraftWingController = AircraftWingController;

    // 简单示例
    document.addEventListener('DOMContentLoaded', () => {
        const controller = new AircraftWingController({
            rpmPerKmh: 0.5,
            maxRPM: 450,
            maxSpeed: 900
        });

        // 监听旋转更新
        controller.addEventListener('rotationUpdated', (info) => {
            console.log(`Speed: ${info.speed} km/h, RPM: ${info.rpm.toFixed(1)}, Rotations: ${info.totalRotations.toFixed(2)}`);
        });

        // 设置速度和启动动画
        controller.setSpeed(300);
        controller.startAnimation();
    });
}
