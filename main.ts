/**
 * 上次信號時間
 */
// 無線電接收
radio.onReceivedNumber(function (receivedNumber) {
    currentTime = input.runningTime()
    // 去抖處理
    if (currentTime - lastSignalTime < DEBOUNCE_TIME) {
        return
    }
    // 顯示接收信號
    xiamiBoard.OLEDshowUserText("Recv: " + receivedNumber, 8, 0)
    // 超聲波避障
    if (ultrasonicDistance < ULTRASONIC_THRESHOLD && receivedNumber != 14) {
        stopMotors()
        updateOLED("Obstacle Detected", true)
        return
    }
    switch (receivedNumber) {
        case 12: // 前進
            moveForward()
            break
        case 8:  // 後退
            moveBackward()
            break
        case 14: // 停止
            stopMotors()
            break
        default:
            basic.showIcon(IconNames.SmallHeart)
            updateOLED("Unknown Signal", true)
    }
lastSignalTime = currentTime
})
// 動作函數
function moveForward () {
    // M1: CCW
    // M2: CW
    // M3: CW
    controlMotors(1, vnorm, 0, vnorm, 0, vnorm, 1, vnorm, // M4: CCW
        RobotAction.Forward)
}
function stopMotors () {
    // M1
    xiamiBoard.motorStop(1)
// M2
    xiamiBoard.motorStop(2)
// M3
    xiamiBoard.motorStop(3)
// M4
    xiamiBoard.motorStop(4)
updateOLED(RobotAction.Stop, false)
    lastAction = RobotAction.Stop
}
// 顯示超聲波數據
function displaySensorData () {
    ultrasonicDistance = Math.round(xiamiBoard.Ultrasonic())
    // 驗證傳感器數據
    if (ultrasonicDistance < 0) {
        updateOLED("Sensor Error", true)
        return
    }
    // 顯示距離
    xiamiBoard.OLEDshowUserNumber(ultrasonicDistance, 2, 0)
    xiamiBoard.OLEDshowUserText("cm", 2, 6)
}
// 当前時間
// 初始化
function init () {
    radio.setGroup(RADIO_GROUP)
    xiamiBoard.initXiaMiBoard()
    xiamiBoard.setBrightness(OLED_BRIGHTNESS)
    // 黃色
    xiamiBoard.setIndexColor(0, 0xffff00)
    xiamiBoard.setIndexColor(1, 0xffff00)
    xiamiBoard.OLEDclear()
    stopMotors()
    // 顯示初始化完成
    updateOLED("Ready", true)
}
// OLED 顯示
function updateOLED (text: string, clear: boolean) {
    if (clear) {
        xiamiBoard.OLEDclear()
    }
    xiamiBoard.OLEDshowUserText(text, 0, 0)
}
// 控制電機
function controlMotors (m1Dir: number, m1Speed: number, m2Dir: number, m2Speed: number, m3Dir: number, m3Speed: number, m4Dir: number, m4Speed: number, action: string) {
    // M1
    xiamiBoard.motorRun(1, m1Dir, Math.constrain(m1Speed, 0, 255))
// M2
    xiamiBoard.motorRun(2, m2Dir, Math.constrain(m2Speed, 0, 255))
// M3
    xiamiBoard.motorRun(3, m3Dir, Math.constrain(m3Speed, 0, 255))
// M4
    xiamiBoard.motorRun(4, m4Dir, Math.constrain(m4Speed, 0, 255))
updateOLED(action, false)
    lastAction = action
}
function moveBackward () {
    // M1: CW
    // M2: CCW
    // M3: CCW
    controlMotors(0, vnorm, 1, vnorm, 1, vnorm, 0, vnorm, // M4: CW
        RobotAction.Backward)
}
let ultrasonicDistance = 0
let lastSignalTime = 0
let currentTime = 0
let vnorm = 0
let DEBOUNCE_TIME = 0
let OLED_BRIGHTNESS = 0
let ULTRASONIC_THRESHOLD = 0
let RADIO_GROUP = 0
// 超聲波距離
// 上次動作，初始為空以允許首次動作
let lastAction = ""
// 小車接收端
// 常量定義
// 無線電組ID
RADIO_GROUP = 121
// 默认电机速度
let V_NORM_DEFAULT = 120
// 超聲波避障阈值（厘米）
ULTRASONIC_THRESHOLD = 15
// OLED亮度
OLED_BRIGHTNESS = 87
// 去抖时间（毫秒，降低以加快響應）
DEBOUNCE_TIME = 50
// 传感器更新间隔（毫秒）
let UPDATE_INTERVAL = 500
const RobotAction = {
    Forward: "Forward",
    Backward: "Backward",
    Stop: "Stop"
}
// 全局變量
// 当前电机速度
vnorm = V_NORM_DEFAULT
// 主程序
init()
basic.forever(function () {
    displaySensorData()
    basic.pause(UPDATE_INTERVAL)
})
