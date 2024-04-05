// 獲取表單元素
const before_summer_list = [];
const after_summer_list = [];
const before_winter_list = [];
const after_winter_list = [];

const ids = [
    "before_summer_0_120",
    "before_winter_0_120",
    "after_summer_0_120",
    "after_winter_0_120",
    "summer_increase_0_120",
    "winter_increase_0_120",
    "before_summer_121_330",
    "before_winter_121_330",
    "after_summer_121_330",
    "after_winter_121_330",
    "summer_increase_121_330",
    "winter_increase_121_330",
    "before_summer_331_500",
    "before_winter_331_500",
    "after_summer_331_500",
    "after_winter_331_500",
    "summer_increase_331_500",
    "winter_increase_331_500",
    "before_summer_501_700",
    "before_winter_501_700",
    "after_summer_501_700",
    "after_winter_501_700",
    "summer_increase_501_700",
    "winter_increase_501_700",
    "before_summer_701_1000",
    "before_winter_701_1000",
    "after_summer_701_1000",
    "after_winter_701_1000",
    "summer_increase_701_1000",
    "winter_increase_701_1000",
    "before_summer_1000_above",
    "before_winter_1000_above",
    "after_summer_1000_above",
    "after_winter_1000_above",
    "summer_increase_1000_above",
    "winter_increase_1000_above"
];

// 迴圈生成變數並加入列表
for (let i = 0; i < ids.length; i += 1) {
    const textContent = document.getElementById(ids[i]).textContent;
    const number = parseFloat(textContent);
    const data = number.toFixed(2);

    if (ids[i].includes("before_summer")){
        before_summer_list.push(data);
    }
    if (ids[i].includes("after_summer")){
        after_summer_list.push(data);
    }
    if (ids[i].includes("before_winter")){
        before_winter_list.push(data);
    }
    if (ids[i].includes("after_winter")){
        after_winter_list.push(data);
    }
   }

const billingCycleSelect = document.getElementById('billingCycle');
const monthSelect = document.getElementById('select_month');
const electricityUsageInput = document.getElementById('electricityUsage');

const increasePercent = document.getElementById('increasePercent');
const beforeBillPrice = document.getElementById('billBefore');
const afterBillPrice = document.getElementById('billAfter');
const averagePrice = document.getElementById('averagePrice');

const landPrice = document.getElementById('landPrice');
const diffPrice = document.getElementById('diffPrice');

// 監聽用戶輸入事件，更新結果
billingCycleSelect.addEventListener('change', updateElectricityBill);
monthSelect.addEventListener('change', updateElectricityBill);
electricityUsageInput.addEventListener('input', updateElectricityBill);
landPrice.addEventListener('input', updateElectricityBill);

function countBillResult(cycle, usage, data_list) {
    const bill_range = [120, 330, 500, 700, 1000, 1001];
    let sum = 0;
    let result = 0;
    let prior_range = 0;
    // console.log(cycle, usage, data_list);
    if (usage) {
        if (cycle === "每月") {
            for (let i = 0; i < bill_range.length; i++) {
                if (i != 0){
                    prior_range = bill_range[i-1];
                }
                sum = bill_range[i];
                if (sum >= usage){
                    result += data_list[i] * (usage-prior_range);
                    console.log(result, (usage-prior_range), data_list[i]);
                    break;
                } else {
                    if (i == 5){
                        result += data_list[i] * (usage-prior_range);
                        console.log(result, (usage-prior_range), data_list[i]);
                        break;
                    }
                    result += data_list[i] * (bill_range[i]-prior_range);
                    console.log(result, bill_range[i], data_list[i]);
                }
            }
        } else {
            for (let i = 0; i < bill_range.length; i++) {
                if (i != 0){
                    prior_range = bill_range[i-1];
                }
                sum = bill_range[i]*2;
                if (sum >= usage){
                    result += data_list[i] * (usage-(prior_range*2));
                    console.log(result, (usage-(prior_range*2)), data_list[i]);
                    break;
                } else {
                    if (i == 5){
                        result += data_list[i] * (usage-(prior_range*2));
                        console.log(result,(usage-(prior_range*2)), data_list[i]);
                        break;
                    }
                    result += data_list[i] * (bill_range[i]-prior_range)*2;
                    console.log(result, bill_range[i], 2, data_list[i]);
                }
            }
        }
    }

    return result;
}

// 更新電費計算結果
function updateElectricityBill() {
    // 計算電費
    const cycle = billingCycleSelect.value;
    const month_type = monthSelect.value;
    const usage = parseFloat(electricityUsageInput.value);
    const landPrice_value = parseFloat(landPrice.value);
    let before_result = 0;
    let after_result = 0;
    if (month_type === "非夏月") {
        before_result = countBillResult(cycle, usage, before_winter_list);
        after_result = countBillResult(cycle, usage, after_winter_list);
    } else {
        before_result = countBillResult(cycle, usage, before_summer_list);
        after_result = countBillResult(cycle, usage, after_summer_list);
    }
    console.log(before_result.toFixed(2), after_result.toFixed(2));
    billBefore.textContent = before_result.toFixed(0) + " 台幣";
    billAfter.textContent = after_result.toFixed(0) + " 台幣";

    if (usage) {
        // 計算漲幅
        increase_value = (after_result/before_result - 1)* 100;
        increasePercent.textContent = increase_value.toFixed(2) + " %";

        // 計算均價
        average_value = after_result/usage;
        averagePrice.textContent = average_value.toFixed(2) + " 台幣";

        if (landPrice) {
            diff_value = landPrice_value * usage - after_result;
            diffPrice.textContent = diff_value.toFixed(0) + " 台幣";
        }
    }

}
