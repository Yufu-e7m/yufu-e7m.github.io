function $(id) {
    return document.getElementById(id);
}

function $$(element) {
    return document.querySelectorAll(element);
}

const modal = $("Modal")
const closeBtn = $('closeBtn');
const tipsTitle = $('tipsTitle');
const tipsContect = $('tipsContect');

let num = 0;
let name = "";
let dd = 0;
let mm = 0;


const nameDict = new Map ([
    [1501, { name: '陳子軒', area: "E4" }],
    [1506, { name: '張進樂', area: "F4" }],
    [1515, { name: '江梓謙', area: "D4"}],
    [1517, { name: '郭綽豪', area: "D4"}],
    [1521, { name: '梁文謙', area: "A4"}],
    [1529, { name: '戴穎豪', area: "B4"}],
    [1535, { name: '黃啟謙', area: "C4"}]
]);

function getNextThursday(date = new Date()) {
    const result = new Date(date);
    const days = (4 - result.getDay() + 7) % 7 || 7;

    result.setDate(result.getDate() + days);
    return result;
}

console.log();

// 取得今天的日期，並格式化為 YYYY-MM-DD
const today = getNextThursday().toISOString().split('T')[0];

const dateInput = $("start")

// 自動設定 value 與 min 為今天
dateInput.value = today;
dateInput.min = today;

// （選填）如果您想保留限制最大日期為當年年底，可以動態計算
const currentYear = new Date().getFullYear();
dateInput.max = `${currentYear}-12-31`;

$("generate_btn").addEventListener("click", () => {
    const output = $("output")
    let reason = $("reason").value;
    let num = $("name-select").value;
    const dateObj = new Date(dateInput.value);
    if (num === "" || reason === "") {
        output.innerHTML = gen_output(-1,null,false);
        return;
    }
    output.innerHTML = gen_output(num, dateObj)
})


function gen_output(num,dateObj,isDone = true) {
    if (isDone === false) return '請先完善資料！！';
    let name = nameDict.get(parseInt(num))["name"];
    let dd = String(dateObj.getDate()).padStart(2, '0');
    let mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    let reason = $("reason").value;
    let area = nameDict.get(parseInt(num))["area"];
    let time_zone = getSelectedTime()
    if (!(mm || dd)) return '請先完善資料！！';
    return `${num} ${area}<br>高一甲 ${name}<br>${dd}/${mm} ${time_zone}未能當值<br>原因：${reason}`
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('複製成功！');
    } catch (err) {
        console.error('複製失敗：', err);
        return false;
    }
    return true;
}


$("copy_btn").addEventListener("click", () => {
    const textToCopy = $("output").value;
    const isCopyDone = copyToClipboard(textToCopy)
    tipsTitle.textContent = (isCopyDone ? "成功" : "Oops");
    tipsContect.textContent  = isCopyDone ? "請假內容已成功複製！去 WeChat 貼上吧！" : "在複製請假內容時遇到了問題！請再試一次或者直接選取內容複製...";
    modal.classList.add('show');
})

closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
});

$$(".time-btn").forEach(button => {
    button.addEventListener("click", () => {
        $$(".time-btn").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        console.log("選擇時段：", button.dataset.time);
    });
});

function getSelectedTime() {
    const selected = document.querySelector(".time-btn.active");
    return selected ? selected.textContent.trim() : null;
}