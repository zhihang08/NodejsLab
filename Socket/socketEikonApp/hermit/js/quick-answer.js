const winScore = 10;
const failScore = -5;
let uuid = '';
let gameInstanceId = ''
let scoreObj = { mySide: 0, oppositeSide: 0 }
let index = 0;
var description = '快问快答,机会只有10次,每答对一题得10分,答错扣5分 扣5分 扣5分!!!'
const socket = io('http://10.117.62.137:3000');

// const socket = io('http://10.35.14.200:3000');
var user = JSON.parse(localStorage.getItem('user'));
var user2 = JSON.parse(localStorage.getItem('user2'));
$(function () {
    localStorage.setItem('round', 3)
    let isDisabled = false;
    var room = localStorage.getItem('room')

    socket.emit('add user', { user: user.name, room: room, uuid: user.uuid });
    user.uuid = ''
    user2.uuid = ''

    socket.on('add user', (data) => {
        if (data.uuid == -1) {
            console.log('room is full')
        }
    });

    socket.on('current room', (data) => {
        let local_user = JSON.parse(localStorage.getItem('user'))
        let local_user2 = JSON.parse(localStorage.getItem('user2'))
        if (data.length == 2) {
            for (let i = 0; i < data.length; i++) {
                let userItem = data[i];
                if (userItem.userName == user.name) {
                    if (local_user.uuid != userItem.uuid) {
                        user.uuid = userItem.uuid
                    }
                } else if (userItem.userName == user2.name) {
                    if (local_user2.uuid != userItem.uuid) {
                        user2.uuid = userItem.uuid
                    }
                }
            }
            if (user.uuid && user2.uuid) {
                socket.emit('game init', { uuid: user.uuid, stage: 2 })
                localStorage.setItem('user', JSON.stringify(user))
                localStorage.setItem('user2', JSON.stringify(user2))
            }

        }
    });
    socket.on('game init', (data) => {
        gameInstanceId = data.id;
        beginAnimate();
        loadQuestionAnimate();
    })

    // select answer event
    $("#answer-box").on("click", "#options li", function () {
        if (isDisabled) {
            return;
        }
        socket.emit('game process', {
            data: {
                question: index,
                answer: $(this).index()
            },
            uuid: user.uuid,
            gameID: gameInstanceId
        })
        disableOption();
    });

    // skip to next question
    socket.on('game process', (data) => {
        console.log(data);
        let actionUser = data.action.userName;
        let result = {}
        // find latest result  
        for (let i = 0; i < data.data.length; i++) {
            if (data.data[i].userName === actionUser) {
                result = data.data[i].data
                break;
            }
        }
        computeScore(result, actionUser);

        clearTimeout(hintDeley);
        if (result.question < questionList.length - 1) {

            $("#img").removeClass("left-in");
            $(".box").removeClass("right-in");

            $("#img").addClass("left-out");
            $(".box").addClass("right-out");
            setTimeout(function () {
                enableOption();
                index++;
                nextQuestion();
            }, 1000);

        } else {
            finishGame();
        }
    })
});
function computeScore(serverResult, actionUser) {
    // let scoreObj = commonUtil.getScore();
    let currentQuestion = questionList[serverResult.question];
    let $choosedLi = $("#options").find('li').eq(serverResult.answer);
    let resultStatus = serverResult.answer === currentQuestion.answer;
    if (user.name === actionUser) {
        scoreObj.mySide += resultStatus ? winScore : failScore
        if (resultStatus) {
            $choosedLi.append("<span class='result-flag correct'>CORRECT</span>");
        } else {
            $choosedLi.append("<span class='result-flag wrong'>WRONG</span>");
        }
    } else {
        scoreObj.oppositeSide += resultStatus ? winScore : failScore
        let imgSrc = user2.symbol === 'symbol1'?'img/France.png':'img/England.png'
        $choosedLi.append("<span class='result-flag oppositeSide'><img src='" + imgSrc + "'></span>");
    }
    $("#score").html(scoreObj.mySide)
    $("#vs-score").html(scoreObj.oppositeSide)
    console.log(scoreObj)
    // commonUtil.updateScore(scoreObj);
}

function finishGame() {
    updateScore();
    clearTimeout(hintDeley);
    if (user.symbol === 'symbol1') {
        socket.emit('game init', { uuid: user.uuid, stage: -1 })
    }
    // localStorage.setItem('round',4)   
    finishGameAnimate(scoreObj.mySide > scoreObj.oppositeSide ? 'win' : 'fail')
}
function updateScore() {
    user.score = user.score || 0;
    user2.score = user2.score || 0;

    user.score = parseInt(user.score) + scoreObj.mySide;
    localStorage.setItem("user", JSON.stringify(user))

    user2.score = parseInt(user2.score) + scoreObj.oppositeSide
    localStorage.setItem("user2", JSON.stringify(user2))
}

function disableOption() {
    isDisabled = true;
    $('#option').addClass("disabledCursor")
}

function enableOption() {
    isDisabled = false;
    $('#option').removeClass("disabledCursor")
}

function nextQuestion() {
    if (index < questionList.length) {
        clearTimeout(hintDeley);

        $("#img").removeClass("left-in");
        $(".box").removeClass("right-in");

        $("#img").addClass("left-out");
        $(".box").addClass("right-out");

        loadQuestionAnimate(questionList[index]);
    }
}

function loadQuestionAnimate() {
    question = questionList[index]
    $("#img").removeClass("left-out");
    $("#img").attr("src", "img/" + question.img);
    $("#img").addClass("left-in");

    // right: hint and question
    $(".box").removeClass("right-out");
    $("#question-text").text(question.question);
    $("#options").empty();
    for (let i = 0; i < question.options.length; i++) {
        $("#options").append(`<li>${question.options[i]}</li>`);
    }
    $("#hint-box").empty();
    hintDeley = setTimeout(function () {
        hintLoop(question.hints, 0);
    }, 0);
    $(".box").addClass("right-in");
}

function hintLoop(hintArray, arrIndex) {
    const $item = $(`<p>${hintArray[arrIndex]}</p>`);
    $item.css('display', 'block').hide();
    $("#hint-box").append($item);
    $item.fadeIn(2000);

    arrIndex++;
    if (arrIndex < hintArray.length) {
        hintDeley = setTimeout(function () {
            hintLoop(hintArray, arrIndex);
        }, 4000);
    }
}


const questionList = [
    {
        "hints": [
            "作品完成于约1478 - 1480年",
            "作者善于对光影精妙处理，让画面轮廓的颜色呈现渐渐变淡的效果",
            "作者是意大利文艺复兴时期的多项领域博学者"
        ],
        img: "Q1.jpg",
        question: '《柏诺瓦的圣母》的作者是谁?',
        options: [
            "达·芬奇",
            "拉斐尔",
            "罗伯特·康平"
        ],
        answer: '0' // start with 0
    },
    {
        "hints": [
            "作品完成于约1530 - 1534",
            "美第奇家族是作者艺术事业最早的赞助者",
            "《大卫》是作者的另一传世之作"
        ],
        img: "Q2.jpg",
        question: '《蹲着的男孩》的作者是谁？',
        options: [
            "多纳泰罗",
            "奥古斯特·罗丹",
            "米开朗基罗"
        ],
        answer: '2'
    },
    {
        "hints": [
            "作者是意大利文艺复兴后期威尼斯画派的代表画家",
            "作者曾多次以神话人物达娜厄为作画的主题",
            "作者被誉为西方油画之父，并被其同代人成为群星中的太阳"
        ],
        img: "Q3.jpg",
        question: '《达娜厄》的作者是谁？',
        options: [
            "提香",
            "丁托列托",
            "委罗内塞"
        ],
        answer: '0'
    },
    {
        "hints": [
            "作品是来这位自隆巴尔多地区的艺术家年轻时的杰作，他出生于1571年，逝于1610年",
            "作者通常被认为属于巴洛克画派，对巴洛克画派的形成有重要影响",
            "作者把阴暗法带进了敏感对照画法，加深了阴暗部分，用一束眩目的光刺穿对象"
        ],
        img: "Q4.jpg",
        question: '《弹鲁特琴者》的作者是谁？',
        options: [
            "卡拉瓦乔",
            "贝尔尼尼",
            "彼得·保罗·鲁本斯"
        ],
        answer: '0'
    },
    {
        "hints": [
            "作者的艺术作品总是充满着华丽、 性感与自由，格外受人推崇",
            "作为一名弗拉芒绘画大师，他的名声享誉欧洲，同时也是盛行于17世纪的巴 洛克艺术的代表人物与奠基者",
            "妻子海伦·富尔曼是成为作者多幅晚期作品中的模特儿，包括了《海伦娜在花园里》、《裹在大衣里的海伦娜》和《皮毛装束的海伦娜》等"
        ],
        img: "Q5.jpg",
        question: '《帕修斯解救安德洛美达》的作者是谁？',
        options: [
            "安东尼·梵·迪克",
            "彼得·保罗·鲁本斯",
            "委拉斯凯兹"
        ],
        answer: '1'
    },
    {
        "hints": [
            "作者是18世纪英国著名的肖像画家和风景画家，是英国肖像画三大师之一",
            "画面中人物的姿势采用 端庄的维纳斯式，这样的姿势频繁出现在画家壮 游期间的意大利艺术作品中，并得到英国人的赞赏",
            "作者以其惊人的绘画速度而闻名，他更多的是采用自然观察而不是严格的技巧"
        ],
        img: "Q6.jpg",
        question: '《蓝色夫人》的作者是谁？',
        options: [
            "托马斯·庚斯博罗",
            "雷诺兹",
            "乔治·罗姆尼"
        ],
        answer: '0'
    },
    {
        "hints": [
            "作品是这位绘画大师最后的几幅作品之一，也被视为他创作生涯的巅峰之作",
            "作者对光和影的表达发挥到了极致，其色彩的微妙与细腻使画面呈现出了虚实交替的景象，形象生动而富有诗意",
            "作者一生留下600多幅油画，300多幅蚀版画和2000多幅素描，几乎画了100多幅自画像"
        ],
        img: "Q7.jpg",
        question: '《浪子回头》的作者是谁？',
        options: [
            "伦勃朗·哈尔曼松·凡·莱因",
            "弗兰斯·哈尔斯",
            "彼得·保罗·鲁本斯"
        ],
        answer: '0'
    },
    {
        "hints": [
            "作品是在法国印象派运动诞生前所创作的",
            "作者常常可以从普通的风景中挖掘其魅力，观察景物细致入微，对光线的变化十分敏锐",
            "作者是法国印象派主要画家，印象派运动领袖人物"
        ],
        img: "Q8.jpg",
        question: '《花园中的女人》的作者是谁？',
        options: [
            "克劳德·莫奈",
            "爱德华·马奈",
            "卡米耶·毕沙罗"
        ],
        answer: '0'
    },
    {
        "hints": [
            "圣维克多山耸立在普罗旺斯艾克斯附近，是作者的出生地和逝世之地",
            "作者是后期印象派的主将，被誉为现代艺术之父、造型之父或现代绘画之父",
            "作者对物体体积感的追求和表现，为立体派开启了思路。作者重视色彩视觉的视的真实性，其客观地观察自然色彩的独特性大大区别于以往的理智地或主观地观察自然色彩的画家"
        ],
        img: "Q9.jpg",
        question: '《圣维克多山》的作者是谁？',
        options: [
            "保罗·高更",
            "保罗·塞尚",
            "克劳德·莫奈"
        ],
        answer: '1'
    },
    {
        "hints": [
            "20世纪初，两位莫斯科工业巨头的慷慨购买，使得俄罗斯成为世界上收藏此作者作品最多的地方",
            "作者自1901年起，增进了对色彩的理解与认识，并开始大胆用色，逐渐从学院派的沟通与透视画法中独立出来",
            "野兽派艺术运动的精神领袖，在20世纪的法国绘画界享有最高的声誉"
        ],
        img: "Q10.jpg",
        question: '《对话》的作者是谁？',
        options: [
            "勃拉克",
            "毕加索",
            "亨利·马蒂斯"
        ],
        answer: '2'
    }];