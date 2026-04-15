/**
 * 无人机螺旋桨旋转速度控制模块
 * 
 * 功能：控制无人机螺旋桨的旋转速度
 * 公式：螺旋桨转速(RPM) = 直接设置值
 */

class AircraftWingController {
    constructor(options = {}) {
        // 配置参数
        this.config = {
            maxRPM: options.maxRPM || 15000,      // 最大RPM
        };

        // 状态
        this.state = {
            rpm: 0,                  // 当前螺旋桨转速
            rotationAngle: 0,        // 累计旋转角度
            totalRotations: 0,       // 总旋转圈数
            animationId: null,
            lastTimestamp: Date.now(),
        };

        this.listeners = [];
    }

    /**
     * 设置螺旋桨转速
     * @param {number} rpm - 螺旋桨转速 RPM
     */
    setSpeed(rpm) {
        rpm = Math.max(0, Math.min(rpm, this.config.maxRPM));
        this.state.rpm = rpm;

        this.notifyListeners('rpmChanged');
    }

    /**
     * 获取当前旋转信息
     */
    getRotationInfo() {
        return {
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
            maxRPM: 15000,
        });

        // 监听旋转更新
        controller.addEventListener('rotationUpdated', (info) => {
            console.log(`RPM: ${info.rpm.toFixed(1)}, Rotations: ${info.totalRotations.toFixed(2)}`);
        });

        // 设置螺旋桨转速和启动动画
        controller.setSpeed(5000);
        controller.startAnimation();
    });
}
